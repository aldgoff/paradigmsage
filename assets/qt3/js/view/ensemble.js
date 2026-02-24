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
import { listPlacementsWithCollapse } from "../model/analyzeStateString.js";

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
  ctx.save();

  const state = analyzeStateString(stateString);  // {progress, moves, counts, outcome}.
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
  
  // { board: ['X','','', 'O','','X', '','',''], prunedBy: null }.
  const ensemble = generateClassicalEnsemble(stateString);  // [{ board: [9], prunedBy: null }, { board: [9], prunedBy: null }, ... { board: [9], prunedBy: null }];

  const turns = Math.log2(ensemble.length);

  for (let i = 0; i < ensemble.length; i++) {
    const { row, col } = indexToCoord7(i, turns);

    const X = element.x + col * grid;
    const Y = element.y + row * grid;

    drawClassicalGame(ensemble[i], X, Y); // { board: [9], prunedBy: null }.
  }

  ctx.restore();
}

function drawClassicalGame(moves, X, Y) {  // { board: [9], prunedBy: null }.
  drawBackground(X, Y); 
  drawLines(X, Y); 
  drawGame(X, Y, moves);

  if(moves.prunedBy === "contradiction") 
    drawPruned(X, Y);
  if(moves.prunedBy === "collapse") 
    drawCollapsed(X, Y);
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

export function drawGame(x, y, moves) { // { board: ['X','','', 'O','','X', '','',''], prunedBy: null }.
  ctx.save();

  ctx.fillStyle = "#000";
  ctx.font = "12px sans-serif";

  for(let i=0; i<9; i++) {
    const move = moves.board[i];
    const X = x + cells[i].x + 3;
    const Y = y + cells[i].y + 13;

    if(move === ' ' || move === 'X' || move === 'O') {
      ctx.fillText(move, X, Y);
    }
    else {
      ctx.fillStyle = "#000";
      ctx.font = "12px sans-serif";
      ctx.fillText('@', X-2, Y);
    }
  }

  ctx.restore();
}

function drawPruned(x, y) {
  ctx.save();

  ctx.globalAlpha = 0.6;
  ctx.fillStyle = "#eee";
  ctx.fillRect(x, y, grid - 10, grid - 10);

  ctx.strokeStyle = "#fff";
  ctx.strokeRect(x, y, grid - 10, grid - 10);

  ctx.restore();
}

function drawCollapsed(x, y) {
  ctx.save();

  ctx.globalAlpha = 0.6;
  ctx.fillStyle = "#f8f880";
  ctx.fillRect(x, y, grid - 10, grid - 10);

  ctx.strokeStyle = "#fff";
  ctx.strokeRect(x, y, grid - 10, grid - 10);

  ctx.restore();
}

/* Functions to generate the games in the classical ensemble. */
  // Vertical duplication (X) → marked first, then unmarked
  // Horizontal duplication (O) → same structure; spatial mapping handles direction
  // const moves = placements.slice().sort((a, b) => a.move - b.move);

import { parseHalfState } from "../model/analyzeStateString.js";

function generateClassicalEnsemble(stateString) {
  const { placements } = parseHalfState(stateString);
  const moves = placements.slice();  // Always process chronologically.

  // ensemble:[{ board: ['X','','', 'O','','X', '','',''], prunedBy: 'null'|'contradiction'|'collapse' }, ...].
  let ensemble = [{ board: new Array(9).fill(' '), prunedBy: null }]; 

  for (const move of moves) { // Duplication loop.
    const player = (move.move % 2 === 1) ? 'X' : 'O';
    const sq1 = move.sq1 - 1;
    const sq2 = move.sq2 - 1;

    if(move.sq2 === 0) {    // --- HALF MOVE (first spooky click). ---
      const size = ensemble.length;
      const marked = [];
      const unmarked = [];
      let pruned;
      for (let i = 0; i < size; i++) {
        const original = ensemble[i];

        // Branch A.
        const board1 = original.board.slice();  // Shallow copy.
        let contradiction1 = applyMark(board1, sq1, player);
        let pruned1 = original.prunedBy;
        if (!pruned1 && contradiction1 === '@') {
            pruned1 = 'contradiction';
        }
        marked.push({ board: board1, prunedBy: pruned1 });               // Branch A → sq1.

        // Branch B.
        const board2 = original.board.slice();
        let pruned2 = original.prunedBy;
        unmarked.push({ board: board2, prunedBy: pruned2 });             // Branch B → sq2 (not yet chosen).
      }
      ensemble = marked.concat(unmarked);
    }
    else {    // --- FULL PLACEMENT (second spooky click completed). ---
      const size = ensemble.length;
      const duplicated = [];
      for (let i = 0; i < size; i++) {
        const original = ensemble[i];
        const board1 = original.board.slice();
        let contradiction = applyMark(board1, sq1, player);
        let pruned = original.prunedBy;
        if (!pruned && contradiction === '@') {
            pruned = 'contradiction';
        }
        duplicated.push({ board: board1, prunedBy: pruned });          // Branch A → sq1.
      }
      for (let i = 0; i < size; i++) {
        const original = ensemble[i];
        const board2 = original.board.slice();
        let contradiction = applyMark(board2, sq2, player);
        let pruned = original.prunedBy;
        if (!pruned && contradiction === '@') {
            pruned = 'contradiction';
        }
        duplicated.push({ board: board2, prunedBy: pruned });          // Branch B → sq2.
      }
      ensemble = duplicated;
    }
  }
  // console.log("generateClassicalEnsemble(stateString)", ensemble);

  const required = applyCollapsePruning(ensemble, stateString);

  if (required.size > 0) {
    for (const branch of ensemble) {
      if (branch.prunedBy === 'contradiction') continue;

      for (const [square, player] of required) {
        if (branch.board[square] !== player) {
          branch.prunedBy = 'collapse';
          break;
        }
      }
    }
  }

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

  return board[index];
}

function applyCollapsePruning(ensemble, stateString) {
  // --- APPLY COLLAPSE PRUNING ---
  const collapseInfo = listPlacementsWithCollapse(stateString);

  // Build required square → player map
  // e.g. { 0: 'X', 1: 'O' }  (0-based board index)
  const required = new Map();

  collapseInfo.forEach((p, index) => {
    if (p.collapse === 'none') return;

    const moveNum = index + 1;
    const player = (moveNum % 2 === 1) ? 'X' : 'O';

    const square = (p.collapse === 'left')
      ? p.sq1 - 1
      : p.sq2 - 1;

    required.set(square, player);
  });

  return required;
}