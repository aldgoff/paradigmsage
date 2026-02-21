// qt3/view/ensemble.js

import { QT3_LAYOUT } from "../layout.js";

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

  const moves = ['X','','', 'O','','2', '','',''];
  // TODO: compute games, moves, and prunes from the stateString.

  // Example only to nail down the graphical elements.
  for(let i=0; i<4; i++) {
    const X = element.x + i*grid;
    for(let j=0; j<4; j++) {
      const Y = element.y + j*grid;
      drawBackground(X, Y); 
      drawLines(X, Y); 
      drawGame(X, Y, moves);
    }
    drawPruned(X, element.y);
  }

  ctx.restore();
}

function drawBackground(x, y) {
  ctx.fillStyle = "#bbb";
  ctx.fillRect(x, y, grid - 10, grid - 10);

  ctx.strokeStyle = "#fff";
  ctx.strokeRect(x, y, grid - 10, grid - 10);
}

function drawLines(x, y) {
  ctx.fillStyle = "#000";
  for (let col = 1; col <= 2; col++) {
    const deltaX = x + offset + col * size + (col - 1) * gap;
    const deltaY = y + offset + col * size + (col - 1) * gap;

    ctx.fillRect( deltaX-1, y, thickness, length );  // Vertical line.
    ctx.fillRect( x, deltaY, length, thickness );  // Horizontal line.
  }
}

function drawGame(x, y, moves) { // moves: ['X','','', 'O','','X', '','','']
  ctx.fillStyle = "#000";
  ctx.font = "12px sans-serif";

  for(let i=0; i<9; i++) {
    const move = moves[i];
    const X = x + cells[i].x + 3;
    const Y = y + cells[i].y + 13;

    ctx.fillText(move, X, Y);
  }
}

function drawPruned(x, y) {
  ctx.save();

  ctx.globalAlpha = 0.7;
  ctx.fillStyle = "#ccc";
  ctx.fillRect(x, y, grid - 10, grid - 10);

  ctx.strokeStyle = "#fff";
  ctx.strokeRect(x, y, grid - 10, grid - 10);

  ctx.restore();
}

