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

// All tests use the same state string, 3 move cyclic entanglement with one stem.
let loopTests = [
  { str: "X1+(1,2); O2+(2,3); X3+(1,2)[13|2]; ",            // In loop.
    cycleMoves: [1,1], intent: { squareNum: 1, cellNum: 1 },
    cellSq: { squareNum: 1, cellNum: 1 },
    },
  { str: "X1+(1,2); O2+(2,3); X3+(1,2)[13|2]; ",            // In loop.
    cycleMoves: [1,2], intent: { squareNum: 2, cellNum: 2 },
    cellSq: { squareNum: 2, cellNum: 2 },
    },
  ];

for (let test of loopTests) {
  placements = parsePlacements(test.str);
  let cellSq = cellInLoop(test.intent, placements, test.cycleMoves);

  assertEqual(cellSq.cell, test.cellSq.cellNum, "cell");
  assertEqual(cellSq.square, test.cellSq.squareNum, "square");
}

let offLoopTests = [
  { str: "X1+(1,2); O2+(2,3); X3+(1,2)[13|2]; ",            // On stem.
    cycleMoves: [1,2], intent: { squareNum: 3, cellNum: 3 },
    cellSq: null,
    },
  { str: "X1+(1,2); O2+(2,3); X3+(1,2)[13|2]; ",            // Off entanglement.
    cycleMoves: [1,2], intent: { squareNum: 4, cellNum: 4 },
    cellSq: null,
    },
  ];

for (let test of offLoopTests) {
  placements = parsePlacements(test.str);
  let cellSq = cellInLoop(test.intent, placements, test.cycleMoves);

  assertEqual(cellSq, null, "stem");
}

let collapseTests = [
  { str: "X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(9,3)[354|12]; O5@X5(3)!X1(1)!O2(2)!X3(6)!O4(9)!X5(3); ",
    cycleMoves: [3,4,5], stemMoves: [1,2], triggerMove: 5, triggerSquare: 3,
    resolved: { 1: 1, 2: 2, // Pretty much just the classical listing.
                3: 6, 4: 9, 
                5: 3 }, 
    },
  ];

for (let test of collapseTests) {
  let placements = parsePlacements(test.str);
  let resolved = computeCollapseResolution(placements, // { moveNum, square }, but this way {4: 6}?!?
                    test.cycleMoves, test.stemMoves, test.triggerMove, test.triggerSquare);

  assertEqual(resolved[1], test.resolved[1], "Move 1");
  assertEqual(resolved[2], test.resolved[2], "Move 2");
  assertEqual(resolved[3], test.resolved[3], "Move 3");
  assertEqual(resolved[4], test.resolved[4], "Move 4");
  assertEqual(resolved[5], test.resolved[5], "Move 5");
}

const N = loopTests.length + offLoopTests.length + collapseTests.length;

// --------- --------- --------- --------- //
console.log(`collapse.js           ${N}/ ${N} tests passed`);
// --------- --------- --------- --------- //

