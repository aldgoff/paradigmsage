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
    placementMoves: 0, collapseMoves: 0, numberOfMoves: 0,
    },
  { str: "X1+(1,2); ", 
    placementMoves: 1, collapseMoves: 0, numberOfMoves: 1,
    },
  { str: "X1+(1,2); O2+(2,3); X3+(3,4); O4+(4,5);", 
    placementMoves: 4, collapseMoves: 0, numberOfMoves: 4,
    },
  { str: "X1+(1,2); O2+(2,3); X3+(3,4); O4+(4,5); X5+(5,6); O6+(6,7); X7+(7,8); O8+(8,9); X9+(1,9)[198765432]; ", 
    placementMoves: 9, collapseMoves: 0, numberOfMoves: 9,
    },
  { str: "X1+(1,2); O2+(2,3); X3+(3,4); O4+(4,5); X5+(5,6); O6+(6,7); X7+(7,8); O8+(8,9); "
       + "X9+(1,9)[198765432]; ", 
    placementMoves: 9, collapseMoves: 0, numberOfMoves: 9,
    },
  { str: "X1+(1,2); O2+(2,3); X3+(3,4); O4+(4,5); X5+(5,6); O6+(6,7); X7+(7,8); O8+(8,9); "
       + "X9+(1,9)[198765432]; O9@X1(1)!X1(1)!O2(2)!X3(3)!O4(4)!X5(5)!O6(6)!X7(7)!O8(8)!X9(9); ", 
    placementMoves: 9, collapseMoves: 1, numberOfMoves: 10,
    },
  { str: "", 
    placementMoves: 0, collapseMoves: 0, numberOfMoves: 0,
  },
  { str: "", 
    placementMoves: 0, collapseMoves: 0, numberOfMoves: 0,
  },
];

for (let test of tests) {
  console.log("test", test);
  res = analyzeStateString(test.str);
  assertEqual(res.placementMoves, test.placementMoves, "placementMoves");
  assertEqual(res.collapseMoves,  test.collapseMoves,  "collapseMoves");
  // assertEqual(res.numberOfMoves,  test.numberOfMoves,  "numberOfMoves");

}



/*
    placementMoves: 0,
    collapseMoves: 0,
    numberOfMoves: 0,
    numberOfSeparables: 0,
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
