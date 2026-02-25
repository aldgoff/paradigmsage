// Regression tests for parse().

import { assertEqual } from "./helpers.js";

/* Method that given a state string will return an array of objects { type, string } where
   type is "spooky|placement|loop|collapse|degenerate|score" and 
   string is a move element "X1+(1,2);". 
*/

import { parseStateTranscript } from "../model/parse.js";

let state = "";
let moves = [];

let tests = [
  { str: "", // Empty.
    length: 0
    },
  { str: "X1+(1,2); O2+(2,3); X3+(4,5); O4+(6", // Spooky, placement.
    length: 4, spooky: "spooky", placement: "placement"
    },
  { str: "X1+(1,2); O2+(1,2)[12]; X2@X1(1)!X1(1)!O2(2); X3+(4,5); O4+(4,5)[34]; X4@X3(4)!X3(4)!O4(5); X5+(7,8); O6+(7,8)[56]; X6@X5(7)!X5(7)!O6(8); {X-1, O-0.5}", // Collapse, score.
    length: 10, placement: "placement", loop: "loop", collapse: "collapse", score: "score"
    },
  { str: "X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(8,9); O6+(7,8); X7+(4,7); O8+(1,4)[18765432]; X8@X1(1)!X1(1)!O2(2)!X3(3)!O4(6)!X5(9)!O6(8)!X7(7)!O8(4); X9+(5,5); O9@X9(5)!X9(5); {X-2, O-0}", // Degenerate.
    length: 12, placement: "placement", loop: "loop", collapse: "collapse", degenerate: "degenerate", score: "score"
    },
];

for (let test of tests) {
  moves = parseStateTranscript(test.str);
  // console.log("moves", moves);

  assertEqual(moves.length, test.length, "empty");

  if(moves.length == 4) {       // spooky|placement
    assertEqual(moves[0].type, test.placement, "placement");
    assertEqual(moves[1].type, test.placement, "placement");
    assertEqual(moves[2].type, test.placement, "placement");
    assertEqual(moves[3].type, test.spooky,    "spooky");
    } 
  else if(moves.length == 10) { // placement|loop|collapse|score
    assertEqual(moves[0].type, test.placement, "placement");
    assertEqual(moves[1].type, test.loop,      "loop");
    assertEqual(moves[2].type, test.collapse,  "collapse");
    assertEqual(moves[3].type, test.placement, "placement");
    assertEqual(moves[4].type, test.loop,      "loop");
    assertEqual(moves[5].type, test.collapse,  "collapse");
    assertEqual(moves[6].type, test.placement, "placement");
    assertEqual(moves[7].type, test.loop,      "loop");
    assertEqual(moves[8].type, test.collapse,  "collapse");
    assertEqual(moves[9].type, test.score,     "score");
    }
  else if(moves.length == 12) { // placement|loop|degenerate|collapse|score
    assertEqual(moves[0].type,  test.placement, "placement");
    assertEqual(moves[1].type,  test.placement, "placement");
    assertEqual(moves[2].type,  test.placement, "placement");
    assertEqual(moves[3].type,  test.placement, "placement");
    assertEqual(moves[4].type,  test.placement, "placement");
    assertEqual(moves[5].type,  test.placement, "placement");
    assertEqual(moves[6].type,  test.placement, "placement");
    assertEqual(moves[7].type,  test.loop,      "loop");
    assertEqual(moves[8].type,  test.collapse,  "collapse");
    assertEqual(moves[9].type,  test.degenerate,"degenerate");
    assertEqual(moves[10].type, test.collapse,  "collapse");
    assertEqual(moves[11].type, test.score,     "score");
  }
}

// --------- --------- --------- --------- //
console.log("parseStateTranscript() 4/ 4 tests passed");
// --------- --------- --------- --------- //

