// Regression tests for parse().

import { assertEqual } from "./helpers.js";

/* Method that given a state string will return an array of objects { type, change } where
   type is "spooky|placement|loop|collapse|degenerate|score" and 
   change is a string, a move element "X1+(1,2);". 
*/

import {parseStateTranscript,
        parseSpookyMove,
        parsePlacementMove,
        parseLoopMove,
        parseCollapseMove,
        parseDegenerateMove,
        parseScoreBlock,
} from "../model/parse.js";

let state = "";
let moves = [];

let tests = [       // "X1+(1,2); O2+(2,3); X3+(4,5); O4+(6": return [ {type, change}, {type, change}... ].
  { str: "", // Empty.
    length: 0
    },
  { str: "X1+(1,2); O2+(2,3); X3+(4,5); O4+(6", // type: "spooky"|"placement", change: "O4+(6"|"X3+(4,5)"
    length: 4, spooky: "spooky", placement: "placement"
    },
  { str: "X1+(1,2); O2+(1,2)[12]; X2@X1(1)!X1(1)!O2(2); X3+(4,5); O4+(4,5)[34]; X4@X3(4)!X3(4)!O4(5); X5+(7,8); O6+(7,8)[56]; X6@X5(7)!X5(7)!O6(8); {X=1, O=0.5}", // Collapse, score.
    length: 10, placement: "placement", loop: "loop", collapse: "collapse", score: "score"
    },
  { str: "X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(8,9); O6+(7,8); X7+(4,7); O8+(1,4)[18765432]; X8@X1(1)!X1(1)!O2(2)!X3(3)!O4(6)!X5(9)!O6(8)!X7(7)!O8(4); X9+(5,5); O9@X9(5)!X9(5); {X=2, O=0}", // Degenerate.
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
// console.log("parseStateTranscript() 4/ 4 tests passed");
// --------- --------- --------- --------- //

let spookyTests = [           // "X1+(3": return {player, turn:, sq1, null}.
  { str: "X1+(3", player: "X", turn: 1, sq1: 3 },
  { str: "O4+(1", player: "O", turn: 4, sq1: 1 },
  { str: "X9+(2", player: "X", turn: 9, sq1: 2 },
  ];

for (let test of spookyTests) {
  const parse = parseSpookyMove(test.str);

  assertEqual(parse.player, test.player);
  assertEqual(parse.turn,   test.turn);
  assertEqual(parse.sq1,    test.sq1);
  }

// console.log("parseSpookyMove()      3/ 3 tests passed");

let placementTests = [        // "X1+(3,6);": return {player, turn:, sq1, null}.
  { str: "X1+(3,8);", player: "X", turn: 1, sq1: 3, sq2: 8 },
  { str: "O4+(1,8);", player: "O", turn: 4, sq1: 1, sq2: 8 },
  { str: "X9+(2,8);", player: "X", turn: 9, sq1: 2, sq2: 8 },
  ];

for (let test of placementTests) {
  const parse = parsePlacementMove(test.str); // "X1+(3,6);": return {player, turn:, sq1, null}.

  assertEqual(parse.player, test.player);
  assertEqual(parse.turn,   test.turn);
  assertEqual(parse.sq1,    test.sq1);
  assertEqual(parse.sq2,    test.sq2);
  }

// console.log("parsePlacementMove()   3/ 3 tests passed");

let loopTests = [             // "O6+(3,7)[165|432];": return {player, turn:, sq1, sq2, cycle, stems}.
  { str: "O2+(1,2)[12];",       player: "O", turn: 2, sq1: 1, sq2: 2, cycle: "12",       stems: "" },
  { str: "O8+(1,4)[18765432];", player: "O", turn: 8, sq1: 1, sq2: 4, cycle: "18765432", stems: "" },
  { str: "O6+(3,7)[165|432];",  player: "O", turn: 6, sq1: 3, sq2: 7, cycle: "165",      stems: "432" },
  ];

for (let test of loopTests) {
  const parse = parseLoopMove(test.str);

  assertEqual(parse.player, test.player);
  assertEqual(parse.turn,   test.turn);
  assertEqual(parse.sq1,    test.sq1);
  assertEqual(parse.sq2,    test.sq2);
  }

// console.log("parseLoopMove()        3/ 3 tests passed");

let collapseTests = [         // "X2@X1(1)!X1(1)!O2(2);": return {player, turn, triggerMove, triggerSquare, sequence}.
  { str: "X2@X1(1)!X1(1)!O2(2);", player: "X", turn: 2, triggerMove: "X1", triggerSquare: 1, sequence: "!X1(1)!O2(2)" },
  { str: "O9@X9(5)!X9(5);",       player: "O", turn: 9, triggerMove: "X9", triggerSquare: 5, sequence: "!X9(5)" },
  ];

for (let test of collapseTests) {
  const parse = parseCollapseMove(test.str); // "X2@X1(1)!X1(1)!O2(2);": return {player, turn, triggerMove, triggerSquare, sequence}.

  assertEqual(parse.player,        test.player);
  assertEqual(parse.turn,          test.turn);
  assertEqual(parse.triggerMove,   test.triggerMove);
  assertEqual(parse.triggerSquare, test.triggerSquare);
  assertEqual(parse.sequence,      test.sequence);
  }

// console.log("parseCollapseMove()    2/ 2 tests passed");

let degenerateTests = [       // "X9+(5,5);" return { player, turn, sq }
  { str: "X9+(5,5);", player: "X", turn: 9, sq: 5},
  ];

for (let test of degenerateTests) {
  const parse = parseDegenerateMove(test.str); // "X9+(5,5);": return { player, turn, sq }.

  assertEqual(parse.player, test.player);
  assertEqual(parse.turn,   test.turn);
  assertEqual(parse.sq,     test.sq);
  }

// console.log("parseDegenerateMove()  1/ 1 tests passed");

let scoreTests = [            // "{X-1, O-0.5}" // return { X: "1", O: "0.5" }
  { str: "{X=0, O=0}",     X: "0", O: "0" },
  { str: "{X=1, O=0.5}",   X: "1", O: "0.5" },
  { str: "{X=2.0, O=0.0}", X: "2.0", O: "0.0" },
  ];

for (let test of scoreTests) {
  const parse = parseScoreBlock(test.str); // "": return {}.

  assertEqual(parse.X, test.X);
  assertEqual(parse.O,   test.O);
  }

// console.log("parseScoreBlock()      3/ 3 tests passed");

// --------- --------- --------- --------- //
console.log("parse.js             19/19 tests passed");
// --------- --------- --------- --------- //

