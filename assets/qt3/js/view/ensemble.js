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

  Contradictory squares (multiple marks) require special representation beyond simple overlap.
  Mixed X and O in one square can visually overlap acceptably.
  Double O could be represented by '@'.

  Double X could be represented by '+'.
  Mixed conflict (X and O) could be represented by '±'.
  Three or more conflicts should display digits 3–8.
  Counts 3–8 should be rendered white-on-black for visual emphasis.
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
  const matrixSquare = [ 
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
  const matrixHorizontal = [ 
    {w:  1, h:  1},
    {w:  2, h:  1},
    {w:  4, h:  1},
    {w:  8, h:  1},
    {w: 16, h:  1},
    {w: 16, h:  2},
    {w: 16, h:  4},
    {w: 16, h:  8},
    {w: 16, h: 16},
    {w: 16, h: 32},
  ];
  const matrix = matrixSquare
  
  // const moves = [' ',' ',' ',  ' ',' ',' ',  ' ',' ',' '];
  const ensemble = generateClassicalEnsemble(stateString);  // [ [], [], [], ... [] ]

  const turns = Math.log2(ensemble.length);
  // const morton = generateOrder(turns);

  // console.log("ensemble.length", ensemble.length);
  // console.log("morton.length", morton.length);
  // console.log("turns", turns);

  // const turns = Math.log2(ensemble.length);

  for (let i = 0; i < ensemble.length; i++) {
    const { row, col } = indexToCoord7(i, turns);
    console.log("{ row, col }", { row, col });
    // const [ row, col ] = order[i];
    // console.log("{ row, col }", [row, col]);

    const X = element.x + col * grid;
    const Y = element.y + row * grid;

    drawClassicalGame(ensemble[i], X, Y);
  }

  let k = 0;
  // for( const loc of morton) {
  //   const [mx, my] = loc;

  //   const moves = ensemble[k++];
  //   const X = element.x + mx*grid;
  //   const Y = element.y + my*grid;
  //   drawClassicalGame(moves, X, Y);
  // }

  // const I = matrix[turns].w;
  // const J = matrix[turns].h;
  
  // // moves = ['X',' ',' ', 'O',' ','X', ' ','@',' '];  // +, ±, 2-8.
  // // TODO: compute games, moves, and prunes from the stateString.

  // k = 0;
  // // console.log("Drawing classical ensemble.")
  // for(let i=0; i<I; i++) {
  //   const X = element.x + i*grid;
  //   for(let j=0; j<J; j++) {
  //     let moves = ensemble[k++];
  //     const Y = element.y + j*grid;
  //     drawBackground(X, Y); 
  //     drawLines(X, Y); 
  //     let pruned = drawGame(X, Y, moves);
  //     if(pruned) 
  //       drawPruned(X, Y);
  //   }
  // }

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

function indexToCoord6(index, turns) {

  let row = 0;
  let col = 0;

  let width = 1;
  let height = 1;

  for (let t = 0; t < turns; t++) {

    const bitIndex = turns - 1 - t;
    const bit = (index >> bitIndex) & 1;

    if (width === height) {
      // Square → copy below → affect row
      row = row * 2 + bit;
      height *= 2;
    } else {
      // Rectangle → copy right → affect column
      col = col * 2 + bit;
      width *= 2;
    }
  }

  return { row, col };
}

function indexToCoord5(index, turns) {

  let row = 0;
  let col = 0;

  let width = 1;
  let height = 1;

  for (let t = 0; t < turns; t++) {

    const bitIndex = turns - 1 - t;
    const bit = (index >> bitIndex) & 1;

    if (width === height) {
      // Square → grow downward
      row = row * 2 + bit;
      height *= 2;
    } else {
      // Rectangle → grow right
      col = col * 2 + bit;
      width *= 2;
    }
  }

  return { row, col };
}

function indexToCoord4(index, turns) {

  let row = 0;
  let col = 0;

  let vPos = Math.ceil(turns / 2) - 1;
  let hPos = Math.floor(turns / 2) - 1;

  for (let t = 0; t < turns; t++) {

    const bitIndex = turns - 1 - t;
    const bit = (index >> bitIndex) & 1;

    if (t % 2 === 0) {
      row |= bit << vPos;
      vPos--;
    } else {
      col |= bit << hPos;
      hPos--;
    }
  }

  return { row, col };
}

function indexToCoord3(index, turns) {
  let row = 0;
  let col = 0;

  let rowShift = 0;
  let colShift = 0;

  for (let t = 0; t < turns; t++) {
    // Newer moves are more significant bits
    const bitIndex = turns - 1 - t;
    const bit = (index >> bitIndex) & 1;

    const isXTurn = (t % 2 === 0); // move1 = t=0

    if (isXTurn) {
      row = (row << 1) | bit;
      rowShift++;
    } else {
      col = (col << 1) | bit;
      colShift++;
    }
  }

  return { row, col };
}

function indexToCoord2(index, turns) {
  let row = 0;
  let col = 0;

  let rowShift = 0;
  let colShift = 0;

  for (let t = 0; t < turns; t++) {

    const bit = (index >> t) & 1;  // LSB first

    const isXTurn = (t % 2 === 0); // Turn 0 = move 1 = X

    if (isXTurn) {
      row |= (bit << rowShift);
      rowShift++;
    } else {
      col |= (bit << colShift);
      colShift++;
    }
  }

  return { row, col };
}

function indexToCoord1(index, turns) {
  let row = 0;
  let col = 0;

  let rowBit = 0;
  let colBit = 0;

  for (let t = 0; t < turns; t++) {
    // Extract bit for this turn (from MSB to LSB)
    const shift = turns - 1 - t;
    const bit = (index >> shift) & 1;

    const isXTurn = (t % 2 === 0); // Turn 0 = move 1 = X

    if (isXTurn) {
      row = (row << 1) | bit;
      rowBit++;
    } else {
      col = (col << 1) | bit;
      colBit++;
    }
  }

  return { row, col };
}

const order = [ // Width x heigth.
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
function squareLoop(ensemble) {
    let k = 0;

}

function generateOrder(n) {
  if (n === 0) return [[0, 0]];

  const prev = generateOrder(n - 1);
  const size = 1 << (n - 1); // 2^(n-1)

  const result = [];

  // Q1: top-left
  for (const [x, y] of prev)
    result.push([x, y]);

  // Q2: top-right
  for (const [x, y] of prev)
    result.push([x, y + size]);

  // Q3: bottom-left
  for (const [x, y] of prev)
    result.push([x + size, y]);

  // Q4: bottom-right
  for (const [x, y] of prev)
    result.push([x + size, y + size]);

  return result;  // [ [x,y], [x,y], [x,y], ... [x,y] ];
}

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

function reverseText(move, x, y, X, Y) {  // Questionable visual effectiveness.
  ctx.save();

  ctx.fillStyle = "#000";
  ctx.fillRect(x+2, y+2, size-4, size-4);

  ctx.fillStyle = "#fff";
  ctx.fillText(move, X, Y);

  ctx.restore();
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

import { parseState } from "../model/analyzeStateString.js";

export function generateClassicalEnsemble1(stateString) {
  const { placements } = parseState(stateString); // [{move, sq1, sq2}];
  
  // const moves = placements.slice().sort((a, b) => a.move - b.move);
  const moves = placements.slice();

  console.log("moves", moves);

  // Start with one empty classical board
  let ensemble = [new Array(9).fill(' ')];

  for (const move of moves) {
    console.log("move", move);
    const player = (move.move%2) ? 'X' : 'O';        // 'X' or 'O'
    const sq1 = move.sq1 - 1;          // convert to 0–8 index
    const sq2 = move.sq2 - 1;

    const collapsed = move.collapsed;  // assume analyzeStateString exposes this

    // COLLAPSE
    if (collapsed) {
      const target = collapsed === 'left' ? sq1 : sq2;

      ensemble = ensemble.map(board => {
        const next = board.slice();
        applyMark(next, target, player);
        return next;
      });

      continue;
    }

    // SPOOKY MOVE → DUPLICATE
    const size = ensemble.length;
    const duplicated = [];

    for (let i = 0; i < size; i++) {
      const original = ensemble[i];

      // First branch → sq1
      const board1 = original.slice();
      applyMark(board1, sq1, player);
      duplicated.push(board1);

      // Second branch → sq2
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
