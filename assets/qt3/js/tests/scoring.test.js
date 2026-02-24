// Regression tests for scoring().

import { assertEqual } from "./helpers.js";

import { evaluateGame } from "../model/barrel.js";

let state = "";
let outcome = {};

// --------- --------- --------- --------- //

let tests = [
  { str: "",  // New game.
    over: false, X: 0, O: 0,
    },
  { str: "X1+(1,2); O2+(4,5); X3+(2,3); ",  // 1 Sep, 1 entanglement.
    over: false, X: 0, O: 0,
    },
  { str: "X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(1,3)[153]; ",  // 1 pure cyclic entanglement.
    over: false, X: 0, O: 0,
    },
  { str: "X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(1,3)[153]; O5@X1(1)!X1(1)!X3(2)!X5(3); ",  // X with an early win {X-1, O-0}.
    over: true, X: 1, O: 0,
    },
  { str: "X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(8,9); O6+(4,5)[26|4];",  // Cyclic entanglement with stems.
    over: false, X: 0, O: 0,
    },
  { str: "X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(8,9); O6+(4,5)[26|4]; X6@O2(5)!O2(5)!O4(6)!O6(4);",  // O with an early win {X-0, O-1}.
    over: true, X: 0, O: 1,
    },
  { str: "X1+(1,2); O2+(1,2)[12]; X2@O2(1)!X1(2)!O2(1); X3+(4,5); O4+(4,5)[34]; X4@X3(4)!X3(4)!O4(5); X5+(6,9); "  // Cat's game {X-0, O-0}.
    + "O6+(6,9)[56]; X6@X5(9)!X5(9)!O6(6); X7+(7,8); O8+(3,8); X9+(3,7)[798]; O9@O8(8)!X7(7)!O8(8)!X9(3); ",
    over: true, X: 0, O: 0,
  },

  { str: "X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(3,6); O6+(1,4)[135426]; "  // X wins mixed game {X-1.0, O-0.5}.
    + "X6@X1(1)!X1(1)!O2(5)!X3(2)!O4(6)!X5(3)!O6(4); ",  
    over: true, X: 1.0, O: 0.5,
    },
  { str: "X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(1,7); O6+(3,6); X7+(3,6)[67|12345]; "  // O wins mixed game {X-0.5, O-1.0}.
    + "O7@O6(6)!X1(1)!O2(4)!X3(2)!O4(5)!X5(7)!O6(6)!X7(3);",
    over: true, X: 0.5, O: 1.0,
    },
  { str: "X1+(1,3); O2+(2,6); X3+(3,9); O4+(6,8); X5+(7,9); O6+(4,8); X7+(5,7); O8+(2,4)[2864]; "  // X with a late double win {X-1.5, O-0.0}.
    + "X8@O2(2)!O2(2)!O4(6)!O6(8)!O8(4); X9+(1,5)[19753]; O9@X7(5)!X1(3)!X3(9)!X5(7)!X7(5)!X9(1);"  ,
    over: true, X: 1.5, O: 0.0,
    },
  { str: "X1+(1,3); O2+(2,6); X3+(3,9); O4+(6,8); X5+(7,9); O6+(4,8); X7+(5,7); O8+(2,4)[2864]; " // X with a pure double win {X-2.0, O-0.0}.
    + "X8@O6(4)!O2(6)!O4(8)!O6(4)!O8(2); X9+(1,5)[19753]; O9@X9(5)!X1(1)!X3(3)!X5(9)!X7(7)!X9(5); ",
    over: true, X: 2.0, O: 0.0,
  },
];

for(let test of tests) {
  outcome = evaluateGame(test.str); 
  assertEqual(outcome.over, test.over);
  assertEqual(outcome.score.X, test.X);
  assertEqual(outcome.score.O, test.O);
};

// --------- --------- --------- --------- //
console.log("scoring()            11/11 tests passed");
// --------- --------- --------- --------- //

