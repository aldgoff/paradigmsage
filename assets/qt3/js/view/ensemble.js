// qt3/view/ensemble.js

/* Spec capture
  Classical ensemble is recomputed from scratch on every spooky, placement, and collapse move using only stateString.

  Ensemble has 512 fixed locations, each in one of four modes: bounded (backdrop), duplicated, marked, or pruned.

  On New Game, 511 locations remain bounded and one location is duplicated (empty classical board).
  On first spooky move, the single board duplicates into two branches reflecting click order placements.

  Placement moves render marks in click order, not canonical order.
  Canonical square ordering must be abandoned for ensemble identity stability across undo/redo.
  A dedicated state comparison routine must compare two state strings ignoring triggers and placement order.
  Ensemble branch positions must remain identity-stable across replay and pruning.

  State analysis should return a 9-element array per classical game containing '', 'X', 'O', '@'.
 */

/* Science result:
 * This 6 move sequence yeilded the fractal pattern I suspected.
 * X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,6); X5+(7,8); O6+(8,9); 
 *
 */

import { QT3_LAYOUT } from "../layout.js";
import { analyzeStateString } from "../model/analyzeStateString.js";

const canvas = document.getElementById("qt3-game");
const ctx = canvas.getContext("2d");

const layout = QT3_LAYOUT;
const element = layout["ensemble"]
const box = element.box;
const grid = Number(box.grid);
const { gap, thickness, offset } = element.gridLines;
const board = box.board;
const size = board.size.w;
const cells = board.cells;
const length = 3*size;

export function drawBounds(x, y) {
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = "#888";

  ctx.strokeRect(x, y, grid - 10, grid - 10);
}

export function drawEnsemble(stateString) {
  // console.log("drawEnsemble()");
  ctx.save();

  const state = analyzeStateString(stateString);
  const matrix = [ 
    {w:  1, h:  1},
    {w:  1, h:  2},
    {w:  2, h:  2},
    {w:  2, h:  4},
    {w:  4, h:  4},
    {w:  4, h:  8},
    {w:  8, h:  8},
    {w:  8, h: 16},
    {w: 16, h: 16},
    {w: 16, h: 32},
  ];
  
  // const moves = [' ',' ',' ',  ' ',' ',' ',  ' ',' ',' '];
  const ensemble = generateClassicalEnsemble(stateString);  // [ [], [], [], ... [] ]

  const turns = Math.log2(ensemble.length);

  for (let i = 0; i < ensemble.length; i++) {
    const { row, col } = indexToCoord7(i, turns);
    console.log("{ row, col }", { row, col });

    const X = element.x + col * grid;
    const Y = element.y + row * grid;

    drawClassicalGame(ensemble[i], X, Y);
  }

  ctx.restore();
}

function drawClassicalGame(moves, X, Y) {
  drawBackground(X, Y); 
  drawLines(X, Y); 
  let pruned = drawGame(X, Y, moves);
  if(pruned) 
    drawPruned(X, Y);
}

function indexToCoord7(index, turns) {
  let row = 0;
  let col = 0;

  let width = 1;
  let height = 1;

  for (let t = 0; t < turns; t++) {
    // NEWEST DUPLICATION = lowest bit
    const bit = (index >> t) & 1;

    if (width === height) {
      // square → copy down
      row += bit * height;
      height *= 2;
    } else {
      // rectangle → copy right
      col += bit * width;
      width *= 2;
    }
  }

  return { row, col };
}

const order = [ // Width x heigth - Example only, not used.
  //w, h
  [ 0, 0],  // 1.

  [ 0, 1],
  [ 1, 0],
  [ 1, 1],    // 4.

  [ 0, 2],
  [ 0, 3],
  [ 1, 2],
  [ 1, 3],
  [ 2, 0],
  [ 2, 1],
  [ 3, 0],
  [ 3, 1],
  [ 2, 2],
  [ 2, 3],
  [ 3, 2],
  [ 3, 3],  // 16.

  // ...    // 64.

  // ...    // 512.
]
/* ----------------------------------------- */

export function drawBackground(x, y) {
  ctx.save();

  ctx.fillStyle = "#bbb";
  ctx.fillRect(x, y, grid - 10, grid - 10);

  ctx.strokeStyle = "#fff";
  ctx.strokeRect(x, y, grid - 10, grid - 10);

  ctx.restore();
}

export function drawLines(x, y) {
  ctx.save();

  ctx.fillStyle = "#000";
  for (let col = 1; col <= 2; col++) {
    const deltaX = x + offset + col * size + (col - 1) * gap;
    const deltaY = y + offset + col * size + (col - 1) * gap;

    ctx.fillRect( deltaX-1, y, thickness, length );  // Vertical line.
    ctx.fillRect( x, deltaY, length, thickness );  // Horizontal line.
  }

  ctx.restore();
}

export function drawGame(x, y, moves) { // moves: ['X','','', 'O','','X', '','','']
  let pruned = false;
  ctx.save();

  ctx.fillStyle = "#000";
  ctx.font = "12px sans-serif";

  for(let i=0; i<9; i++) {
    const move = moves[i];
    const X = x + cells[i].x + 3;
    const Y = y + cells[i].y + 13;

    if(move === ' ' || move === 'X' || move === 'O') 
      ctx.fillText(move, X, Y);
    else
      pruned = true;
  }

  ctx.restore();

  return pruned;
}

function drawPruned(x, y) {
  ctx.save();

  ctx.globalAlpha = 0.8;
  ctx.fillStyle = "#ccc";
  ctx.fillRect(x, y, grid - 10, grid - 10);

  ctx.strokeStyle = "#fff";
  ctx.strokeRect(x, y, grid - 10, grid - 10);

  ctx.restore();
}

/* Functions to generate the games in the classical ensemble. */

import { parseHalfState } from "../model/analyzeStateString.js";

export function generateClassicalEnsemble(stateString) {
  const { placements } = parseHalfState(stateString);

  // Always process chronologically
  // const moves = placements.slice().sort((a, b) => a.move - b.move);
  // const moves = placements.slice().sort((a, b) => a.move - b.move);
  const moves = placements.slice();

  // console.log("generateClassicalEnsemble() moves", moves);

  let ensemble = [new Array(9).fill(' ')];

  for (const move of moves) {
    console.log("move", move);
    const player = (move.move % 2 === 1) ? 'X' : 'O';
    const sq1 = move.sq1 - 1;
    const sq2 = move.sq2 - 1;

    // --- HALF MOVE (first spooky click) ---
    if (move.sq2 === 0) {

      const marked = [];
      const unmarked = [];

      for (let i = 0; i < ensemble.length; i++) {
        const original = ensemble[i];

        const board1 = original.slice();
        applyMark(board1, sq1, player);

        marked.push(board1);
        unmarked.push(original.slice());
      }

      // Vertical duplication (X) → marked first, then unmarked
      // Horizontal duplication (O) → same structure; spatial mapping handles direction

      ensemble = marked.concat(unmarked);

      continue;
    }

    // --- FULL PLACEMENT (second spooky click completed) ---
    // Duplicate and apply both branches simultaneously

    const size = ensemble.length;
    const duplicated = [];

    // for (let i = 0; i < size; i++) {
    //   const original = ensemble[i];

    //   // Branch A → sq1
    //   const board1 = original.slice();
    //   applyMark(board1, sq1, player);
    //   duplicated.push(board1);

    //   // Branch B → sq2
    //   const board2 = original.slice();
    //   applyMark(board2, sq2, player);
    //   duplicated.push(board2);
    // }
    for (let i = 0; i < size; i++) {
      const original = ensemble[i];

      // Branch A → sq1
      const board1 = original.slice();
      applyMark(board1, sq1, player);
      duplicated.push(board1);
    }
    for (let i = 0; i < size; i++) {
      const original = ensemble[i];

      // Branch B → sq2
      const board2 = original.slice();
      applyMark(board2, sq2, player);
      duplicated.push(board2);
    }

    ensemble = duplicated;
  }

  console.log("ensemble", ensemble);

  return ensemble;
}

function applyMark(board, index, player) {

  const current = board[index];

  if (current === ' ') {
    board[index] = player;
  }
  else if (current === player) {
    board[index] = '@';
  }
  else {
    board[index] = '@';
  }
}
