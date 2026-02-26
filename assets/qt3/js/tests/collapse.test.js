// Regression tests for collapse().

import { assertEqual } from "./helpers.js";

import { parsePlacements } from "../model/structure.js";

import {cellInLoop,
        computeCollapseResolution,
} from "../model/collapse.js";

let state = "";
let res;

let intent = { squareNum: 0, cellNum: 0 };
let placements = { move: 0, player: 'X', squares: [0, 0] };
let cycleMoves = [];

// --------- --------- --------- --------- //

let loopTests = [
  { str: "X1+(1,2); O2+(2,3); X3+(2,3)[23|1];", // tbd.
    cell: 3, square: 3,
    },
  ];

/* Data Types:
  cellSq {
    cell: cellNum,
    square: squareNum
  };

  intent: {
    squareNum: 0,
    cellNum: 0,
  }

  placement: {
    move: parse.turn,
    player: parse.player,
    squares: [parse.sq1, parse.sq2]
  }

  cycleMoves: [0:, 1:, ...]
 */

  /*
  X1+(1,2); O2+(2,3); X3+(2,3)[23|1]; 
  placements (3) [{…}, {…}, {…}]
    0: {move: 1, player: 'X', squares: Array(2)}
    1: {move: 2, player: 'O', squares: Array(2)}
    2: {move: 3, player: 'X', squares: Array(2)}
    length: 3
  cycleMoves (2) [2, 3]
    0: 2
    1: 3
    length: 2
  stemMoves [1]
    0: 1
    length: 1
 */

/* Code Snippets:
    cycleMoves = extractCycle(path, placements, parse.turn); // [] - just the path, does not include connecting move.
    stemMoves  = extractStems(graph, path, placements, cycleMoves); // [].

    placements.push({ // Add connecting move.
      move: parse.turn,
      player: parse.player,
      squares: [parse.sq1, parse.sq2]
    });
*/

intent = { squareNum: 3, cellNum: 3 };

cycleMoves.push(2);
cycleMoves.push(3);

for (let test of loopTests) {
  placements = parsePlacements(test.str);
  let cellSq = cellInLoop(intent, placements, cycleMoves);
  console.log("test", test, intent, placements, cycleMoves, cellSq);
  assertEqual(cellSq.cell,   test.cell,   "cell");
  assertEqual(cellSq.square, test.square, "square");
}

// --------- --------- --------- --------- //
console.log("collapse 1 tests passed");
// --------- --------- --------- --------- //
