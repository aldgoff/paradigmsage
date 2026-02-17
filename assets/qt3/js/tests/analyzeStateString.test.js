// Regression tests for analyzeStateString().

import { assertEqual } from "./helpers.js";

import { addPlacementMove } from "../model/barrel.js";
import { analyzeStateString } from "../model/barrel.js";

let state = "";
let res = null;
/*
X1+(1,2); O2+(2,3); X3+(3,4); O4+(4,5); X5+(5,6); O6+(6,7); X7+(7,8); O8+(8,9); 
X9+(1,9)[198765432]; O9@X1(1)!X1(1)!O2(2)!X3(3)!O4(4)!X5(5)!O6(6)!X7(7)!O8(8)!X9(9);
*/
let tests = [
  { str: "", 
    movesSpooky: 0, movesPlacement: 0, movesCollapse: 0, movesNumber: 0,
    countOfSeparables: 0, countOfEntanglements: 0, numberOfEntangledMoves: 0, numberOfCollapsedMoves: 0,
    },
  { str: "X1+(1", 
    movesSpooky: 1, movesPlacement: 0, movesCollapse: 0, movesNumber: 0,
    countOfSeparables: 0, countOfEntanglements: 0, numberOfEntangledMoves: 0, numberOfCollapsedMoves: 0,
    },
  { str: "X1+(1,2); ", 
    movesSpooky: 0, movesPlacement: 1, movesCollapse: 0, movesNumber: 1,
    countOfSeparables: 1, countOfEntanglements: 0, numberOfEntangledMoves: 0, numberOfCollapsedMoves: 0,
    },
  { str: "X1+(1,2); O2+(2,3); ", 
    movesSpooky: 0, movesPlacement: 2, movesCollapse: 0, movesNumber: 2,
    countOfSeparables: 0, countOfEntanglements: 1, numberOfEntangledMoves: 2, numberOfCollapsedMoves: 0,
    },
  { str: "X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,6); ", 
    movesSpooky: 0, movesPlacement: 4, movesCollapse: 0, movesNumber: 4,
    countOfSeparables: 0, countOfEntanglements: 2, numberOfEntangledMoves: 4, numberOfCollapsedMoves: 0,
  },

  { str: "X1+(1,2); O2+(2,3); X3+(3,4); O4+(4,5); X5+(5,6); O6+(6,7); X7+(7,8); O8+(8,9); "
       + "X9+(1,9)[198765432]; ", 
    movesSpooky: 0, movesPlacement: 9, movesCollapse: 0, movesNumber: 9,
    countOfSeparables: 0, countOfEntanglements: 1, numberOfEntangledMoves: 9, numberOfCollapsedMoves: 0,
    },
  { str: "X1+(1,2); O2+(2,3); X3+(3,4); O4+(4,5); X5+(5,6); O6+(6,7); X7+(7,8); O8+(8,9); "
       + "X9+(1,9)[198765432]; O9@X1(1)!X1(1)!O2(2)!X3(3)!O4(4)!X5(5)!O6(6)!X7(7)!O8(8)!X9(9); ", 
    movesSpooky: 0, movesPlacement: 9, movesCollapse: 1, movesNumber: 10,
    countOfSeparables: 0, countOfEntanglements: 0, numberOfEntangledMoves: 0, numberOfCollapsedMoves: 9,
  },

  { str: "X1+(1,2); O2+(4,5); X3+(7,8); O4+(3,6); ", 
    movesSpooky: 0, movesPlacement: 4, movesCollapse: 0, movesNumber: 4,
    countOfSeparables: 4, countOfEntanglements: 0, numberOfEntangledMoves: 0, numberOfCollapsedMoves: 0,
  },

  { str: "X1+(1,2); O2+(4,5); X3+(7,8); O4+(3,6); X5+(6,9);", 
    movesSpooky: 0, movesPlacement: 5, movesCollapse: 0, movesNumber: 5,
    countOfSeparables: 3, countOfEntanglements: 1, numberOfEntangledMoves: 2, numberOfCollapsedMoves: 0,
  },

  { str: "X1+(1,2); O2+(4,5); X3+(7,8); O4+(3,6); X5+(6,9); O6+(4,7);", 
    movesSpooky: 0, movesPlacement: 6, movesCollapse: 0, movesNumber: 6,
    countOfSeparables: 1, countOfEntanglements: 2, numberOfEntangledMoves: 5, numberOfCollapsedMoves: 0,
  },

  { str: "", 
    movesSpooky: 0, movesPlacement: 0, movesCollapse: 0, movesNumber: 0,
    countOfSeparables: 0, countOfEntanglements: 0, numberOfEntangledMoves: 0, numberOfCollapsedMoves: 0,
  },

  { str: "", 
    movesSpooky: 0, movesPlacement: 0, movesCollapse: 0, movesNumber: 0,
    countOfSeparables: 0, countOfEntanglements: 0, numberOfEntangledMoves: 0, numberOfCollapsedMoves: 0,
  },

  { str: "", 
    movesSpooky: 0, movesPlacement: 0, movesCollapse: 0, movesNumber: 0,
    countOfSeparables: 0, countOfEntanglements: 0, numberOfEntangledMoves: 0, numberOfCollapsedMoves: 0,
  },

  // { str: "", 
  //   movesSpooky: 0, movesPlacement: 0, movesCollapse: 0, movesNumber: 0,
  //   countOfSeparables: 0, countOfEntanglements: 0, numberOfEntangledMoves: 0, numberOfCollapsedMoves: 0,
  // },
];

for (let test of tests) {
  console.log("test", test);
  res = analyzeStateString(test.str);
  assertEqual(res.movesSpooky, test.movesSpooky, "movesSpooky");
  assertEqual(res.movesPlacement, test.movesPlacement, "movesPlacement");
  assertEqual(res.movesCollapse,  test.movesCollapse,  "movesCollapse");
  assertEqual(res.movesNumber,    test.movesNumber,  "movesNumber");

  assertEqual(res.countOfSeparables,    test.countOfSeparables,  "countOfSeparables");
  assertEqual(res.countOfEntanglements, test.countOfEntanglements,  "countOfEntanglements");

  assertEqual(res.numberOfEntangledMoves, test.numberOfEntangledMoves,  "numberOfEntangledMoves");
  assertEqual(res.numberOfCollapsedMoves, test.numberOfCollapsedMoves,  "numberOfCollapsedMoves");

}



/*
    movesPlacement: 0,
    movesCollapse: 0,
    movesNumber: 0,
    countOfSeparables: 0,
    numberOfEntanglements: 0,
    collapsedMoves: [],
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

// --------- --------- --------- --------- //

console.log("analyzeStateString() tests passed");
