// qt3/view/view.js

import { QT3_LAYOUT } from "../layout.js";
import {
  drawControls,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  setControlHandler
} from "./controlsView.js";

const canvas = document.getElementById("qt3-game");
const ctx = canvas.getContext("2d");

export function initView() {
  render();
  installPointerHandlers();
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLayoutBounds(ctx);
  drawControls(ctx);              // Imported from controlsView.js.
  drawBoardGrid(ctx, QT3_LAYOUT);
  drawSquareNumbers(ctx, QT3_LAYOUT);
  drawStateString(ctx);
}

// Outline the visual objets to facilitate arranging them.
export function drawLayoutBounds(ctx, layout = QT3_LAYOUT) {
  ctx.save();
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 1;

  for (const layout_key in layout) { // Outline each graphical element in layout.
    if (layout_key === "board") {  // Outline & label QT3 squares and spooky cells..
      const squares = layout.board.squares;
      for (const squares_key in squares) {
        const sq = squares[squares_key];  // Square1, square2, square3, ... square9.

        // The grid of spooky cells within each square.
        const cell = sq.spookyCells;
        for (const cells_key in cell) {
          const sub = cell[cells_key];
          ctx.strokeRect(sub.x, sub.y, sub.w, sub.h);
          ctx.fillStyle = "#ccc";
          ctx.font = "12px sans-serif";
          ctx.fillText(cells_key, sub.x + 7, sub.y + 19);
       }
      }
      }
    else {                  // Outline & label graphical elements.
      const element = layout[layout_key];
      ctx.strokeRect(element.x, element.y, element.w, element.h);
      ctx.fillStyle = "#888";
      ctx.font = "12px sans-serif";
      ctx.fillText(layout_key, element.x + 4, element.y + 14);
    }
  }

  ctx.restore();
}

/* Draw and manage the control buttons. */
function installPointerHandlers() {
  canvas.addEventListener("mousedown", e => {
    const { x, y } = getCanvasCoords(e);

    // Controls get first priority.
    if (handlePointerDown(x, y)) {
      render();
      return;
      }

    // Board is next.
    if (handleSquareClicks(x, y)) {
      render();
      return;
    }

    /* Next step planning */
      // Move list (jump to a point in the game history, maybe just prev and next buttons?
      // Ensemble (for classical game selection - populates the classical listing)?
      // State string (for pasting before loading)?
  });

  canvas.addEventListener("mousemove", e => {
    const { x, y } = getCanvasCoords(e);
    if (handlePointerMove(x, y)) render();
  });

  canvas.addEventListener("mouseup", e => {
    const { x, y } = getCanvasCoords(e);
    handlePointerUp(x, y);
    render();
  });
  }

function getCanvasCoords(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.round(e.clientX - rect.left),
    y: Math.round(e.clientY - rect.top)
  };
  }

export function setViewControlHandler(fn) {
  setControlHandler(fn);
}

/* Draw board and square numbers. */
function drawBoardGrid(ctx, layout) {
  const { x, y, w, h, gridLines } = layout.board;
  const { gap, thickness, separation, color } = gridLines;

  const squareSize = 90;  // matches layout squares
  const total = squareSize * 3 + gap * 2;

  ctx.save();
  ctx.fillStyle = color;

  // --- Vertical double lines ---
  for (let col = 1; col <= 2; col++) {
    const offset = x + gridLines.offset + col * squareSize + (col - 1) * gap;

    // first line
    ctx.fillRect(
      offset,
      y,
      thickness,
      total
    );

    // second line
    ctx.fillRect(
      offset + separation,
      y,
      thickness,
      total
    );
  }

  // --- Horizontal double lines ---
  for (let row = 1; row <= 2; row++) {
    const offset = y + gridLines.offset + row * squareSize + (row - 1) * gap;

    // first line
    ctx.fillRect(
      x,
      offset,
      total,
      thickness
    );

    // second line
    ctx.fillRect(
      x,
      offset + separation,
      total,
      thickness
    );
  }

  ctx.restore();
  }

function drawSquareNumbers(ctx, layout) {
  ctx.save();
  ctx.fillStyle = "#666";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "right";
  ctx.textBaseline = "bottom";

  for (const key in layout.board.squares) {
    const sq = layout.board.squares[key].square;
    const num = key.replace("square", "");

    ctx.fillText(
      num,
      sq.x + sq.w + 4,
      sq.y + sq.h + 4
    );
  }

  ctx.restore();
}

/* Code to respond to square/cell clicks. */
let squareHandler = null;                 // Event triggered callback to
export function setSquareHandler(fn) {    // respond to square/cell clicks.
  squareHandler = fn;
  }

function handleSquareClicks(x, y) {       // Event driven, called by listener, invokes squareHandler.
  const squares = QT3_LAYOUT.board.squares;

  for (const squareKey in squares) {  // 9 squares.
    const spookyCells = squares[squareKey].spookyCells;

    for (const cellKey in spookyCells) {  // 9 spooky cells in each square.
      const cell = spookyCells[cellKey];

      const hit =
        cell.x <= x && x <= cell.x + cell.w &&
        cell.y <= y && y <= cell.y + cell.h;

      if (hit) {
        if (squareHandler) {
          squareHandler({     // event - {square: 'square1', cell: 'm1'}
            square: squareKey,
            cell: cellKey
          });
        }
        return true;
      }
    }
  }

  return false;
}

/* Code to set and draw the state string. */
let currentStateString = ""; 

export function setStateString(str) {
  currentStateString = str;
  render();
  }

function drawStateString(ctx) {
  const { x, y, w, h } = QT3_LAYOUT.stateBox;

  ctx.save();

  // Box background
  ctx.fillStyle = "#111";
  ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = "#555";
  ctx.strokeRect(x, y, w, h);

  // Text
  ctx.fillStyle = "#0f0";
  ctx.font = "13px monospace";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  const padding = 10;
  const textY = y + h / 2;

  ctx.fillText(currentStateString, x + padding, textY);

  ctx.restore();
}

