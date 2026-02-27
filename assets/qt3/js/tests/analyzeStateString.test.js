// Regression tests for analyzeStateString().

import {assertEqual,
        assertThrows,
 } from "./helpers.js";

import {addPlacementMove,
        analyzeStateString,
} from "../model/barrel.js";

let state = "";
let res = null;

let tests = [
  { str: "", // Empty.
    movesSpooky: 0, movesPlacement: 0, movesCollapse: 0, movesNumber: 0,
    countOfSeparables: 0, countOfEntanglements: 0, countOfCyclics: 0,
    numberOfEntangledMoves: 0, numberOfCollapsedMoves: 0,
    },
  { str: "X1+(1", // Spooky.
    movesSpooky: 1, movesPlacement: 0, movesCollapse: 0, movesNumber: 0,
    countOfSeparables: 0, countOfEntanglements: 0, countOfCyclics: 0,
    numberOfEntangledMoves: 0, numberOfCollapsedMoves: 0,
    },
  { str: "X1+(1,2); ", // Placement.
    movesSpooky: 0, movesPlacement: 1, movesCollapse: 0, movesNumber: 1,
    countOfSeparables: 1, countOfEntanglements: 0, countOfCyclics: 0,
    numberOfEntangledMoves: 0, numberOfCollapsedMoves: 0,
    },
  { str: "X1+(1,2); O2+(2,3); ", // Semi-entanglement.
    movesSpooky: 0, movesPlacement: 2, movesCollapse: 0, movesNumber: 2,
    countOfSeparables: 0, countOfEntanglements: 1, countOfCyclics: 0,
    numberOfEntangledMoves: 2, numberOfCollapsedMoves: 0,
    },
  { str: "X1+(1,2); O2+(2,3); X3+(1,3)[132]; ", // Triple loop.
    movesSpooky: 0, movesPlacement: 3, movesCollapse: 0, movesNumber: 3,
    countOfSeparables: 0, countOfEntanglements: 1, countOfCyclics: 1,
    numberOfEntangledMoves: 3, numberOfCollapsedMoves: 0,
    },
  { str: "X1+(1,2); O2+(1,2)[12]; ",              // EPR loop.
    movesSpooky: 0, movesPlacement: 2, movesCollapse: 0, movesNumber: 2,
    countOfSeparables: 0, countOfEntanglements: 1, countOfCyclics: 1,
    numberOfEntangledMoves: 2, numberOfCollapsedMoves: 0,
    },
  { str: "X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,6); ", // Two semi-entanglements.
    movesSpooky: 0, movesPlacement: 4, movesCollapse: 0, movesNumber: 4,
    countOfSeparables: 0, countOfEntanglements: 2, countOfCyclics: 0,
    numberOfEntangledMoves: 4, numberOfCollapsedMoves: 0,
  },

  { str: "X1+(1,2); O2+(2,3); X3+(3,4); O4+(4,5); X5+(5,6); O6+(6,7); X7+(7,8); O8+(8,9); " // Loop.
       + "X9+(1,9)[198765432]; ", 
    movesSpooky: 0, movesPlacement: 9, movesCollapse: 0, movesNumber: 9,
    countOfSeparables: 0, countOfEntanglements: 1, countOfCyclics: 1,
    numberOfEntangledMoves: 9, numberOfCollapsedMoves: 0,
    },
  { str: "X1+(1,2); O2+(2,3); X3+(3,4); O4+(4,5); X5+(5,6); O6+(6,7); X7+(7,8); O8+(8,9); " // Collapse.
       + "X9+(1,9)[198765432]; O9@X1(1)!X1(1)!O2(2)!X3(3)!O4(4)!X5(5)!O6(6)!X7(7)!O8(8)!X9(9); ", 
    movesSpooky: 0, movesPlacement: 9, movesCollapse: 1, movesNumber: 10,
    countOfSeparables: 0, countOfEntanglements: 0, countOfCyclics: 0,
    numberOfEntangledMoves: 0, numberOfCollapsedMoves: 9,
  },

  { str: "X1+(1,2); O2+(4,5); X3+(7,8); O4+(3,6); ", // Four separable pairs of spooky marks, the max possible.
    movesSpooky: 0, movesPlacement: 4, movesCollapse: 0, movesNumber: 4,
    countOfSeparables: 4, countOfEntanglements: 0, countOfCyclics: 0,
    numberOfEntangledMoves: 0, numberOfCollapsedMoves: 0,
    },

  { str: "X1+(1,2); O2+(4,5); X3+(7,8); O4+(3,6); X5+(6,9);", // Join one pair.
    movesSpooky: 0, movesPlacement: 5, movesCollapse: 0, movesNumber: 5,
    countOfSeparables: 3, countOfEntanglements: 1, countOfCyclics: 0,
    numberOfEntangledMoves: 2, numberOfCollapsedMoves: 0,
    },

  { str: "X1+(1,2); O2+(4,5); X3+(7,8); O4+(3,6); X5+(6,9); O6+(4,7);", // Join two pairs.
    movesSpooky: 0, movesPlacement: 6, movesCollapse: 0, movesNumber: 6,
    countOfSeparables: 1, countOfEntanglements: 2, countOfCyclics: 0,
    numberOfEntangledMoves: 5, numberOfCollapsedMoves: 0,
  },

  { str: "X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,6); X5+(7,8); O6+(8,9);", // Three entanglements, the max possible.
    movesSpooky: 0, movesPlacement: 6, movesCollapse: 0, movesNumber: 6,
    countOfSeparables: 0, countOfEntanglements: 3, countOfCyclics: 0,
    numberOfEntangledMoves: 6, numberOfCollapsedMoves: 0,
  },
];

for (let test of tests) {
  // console.log("test", test);
  res = analyzeStateString(test.str);
  assertEqual(res.moves.spooky,    test.movesSpooky,    "movesSpooky");
  assertEqual(res.moves.placement, test.movesPlacement, "movesPlacement");
  assertEqual(res.moves.collapse,  test.movesCollapse,  "movesCollapse");
  assertEqual(res.moves.number,    test.movesNumber,    "movesNumber");

  assertEqual(res.counts.separables,    test.countOfSeparables,     "counts.separables");
  assertEqual(res.counts.entanglements, test.countOfEntanglements,  "countOfEntanglements");
  assertEqual(res.counts.cyclics,       test.countOfCyclics,  "countOfCyclics");

  assertEqual(res.counts.entangledMoves, test.numberOfEntangledMoves,  "numberOfEntangledMoves");
  assertEqual(res.counts.collapsedMoves, test.numberOfCollapsedMoves,  "numberOfCollapsedMoves");
}

let N = tests.length;
// console.log("analyzeStateString() - moves & counts: ${N}/${N} tests passed");

// --------- --------- --------- --------- //

const lastMoveType = [
  { str: "", last: "empty" },

  { str: "X1+(1", last: "spooky" },
  { str: "X1+(1,2); ", last: "placement" },
  { str: "X1+(1,2); O2+(4", last: "spooky" },
  { str: "X1+(1,2); O2+(4,5); ", last: "placement" },
  { str: "X1+(1,2); O2+(4,5); X3+(2", last: "spooky" },
  { str: "X1+(1,2); O2+(4,5); X3+(2,3); ", last: "placement" },
  { str: "X1+(1,2); O2+(4,5); X3+(2,3); O4+(5 ", last: "spooky" },
  { str: "X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); ", last: "placement" },

  { str: "X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(1", last: "spooky" },
  { str: "X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(1,3)[135]", last: "loop" },
  { str: "X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(1,3)[135]; O5@X5(1)!X1(2)!X3(3)!X5(1); ", last: "collapse" },
  { str: "X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(8,9); O6+(7,8); X7+(4,7); O8+(1,4)[18765432]; "
       + "X8@X1(2)!X1(2)!O2(3)!X3(6)!O4(9)!X5(8)!O6(7)!X7(4)!O8(1); X9+(5,5); ",                      last: "degenerate" },
  { str: "X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(1,3)[135]; O5@X5(1)!X1(2)!X3(3)!X5(1); {X-1, O-0}", last: "score" },

  { str: "X1+(1,2); O2+(2,3); X3+(3,4); O4+(4,5); X5+(5,6); O6+(6,7); X7+(7,8); O8+(8,9); "
       + "X9+(1,9)[198765432]; O9@X1(1)!X1(1)!O2(2)!X3(3)!O4(4)!X5(5)!O6(6)!X7(7)!O8(8)!X9(9);", last: "collapse" },
]

for (let test of lastMoveType) {
  res = analyzeStateString(test.str);
  assertEqual(res.progress.last, test.last, "last move type");
}

N = lastMoveType.length;
// console.log("analyzeStateString() - progress.last: {N}/${N}  tests passed");

// --------- --------- --------- --------- //

/*  TODO: complete analyzeStateString().
    collapsedSquares: [],
    numberOfLoopMoves: 0,
    numberOfStemMoves: 0,
    numberOfClassicalRealities: 1,
    fieldOfClassicalRealities: 1,
    sequentialChronoBlocks: 0,
    overlappingChronoBlocks: 0,
    nestedChronoBlocks: 0
*/

// --------- --------- --------- --------- //
N = tests.length + lastMoveType.length;
console.log(`analyzeStateString() ${N}/${N} tests passed`);
// --------- --------- --------- --------- //

