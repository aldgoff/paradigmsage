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

export function setViewControlHandler(fn) {
  setControlHandler(fn);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLayoutBounds(ctx);
  drawControls(ctx);
}

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

        // The full square.
        const square = sq.square;
        ctx.strokeRect(square.x, square.y, square.w, square.h);
        ctx.fillStyle = "#888";
        ctx.font = "12px sans-serif";
        ctx.fillText("", square.x + 4, square.y + 14);

        // The grid of spooky cells.
        const cell = sq.spookyCells;
        for (const cells_key in cell) {
          const sub = cell[cells_key];
          ctx.strokeRect(sub.x, sub.y, sub.w, sub.h);
          ctx.fillStyle = "#888";
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

// Code to notify controller that a QT3 square has been selected.
let squareHandler = null;

export function setSquareHandler(fn) {
  squareHandler = fn;
}

function handleSquareClicks(x, y) {
  const squares = QT3_LAYOUT.board.squares;

  for (const squareKey in squares) {
    const sq = squares[squareKey];

    // First: test spooky cells (higher precision).
    const cells = sq.spookyCells;

    for (const cellKey in cells) {
      const cell = cells[cellKey];

      const hit =
        cell.x <= x && x <= cell.x + cell.w &&
        cell.y <= y && y <= cell.y + cell.h;

      if (hit) {
        if (squareHandler) {
          squareHandler({
            type: "spooky",
            square: squareKey,
            cell: cellKey
          });
        }
        return true;
      }
    }

    // Second: test full square.
    const square = sq.square;

    const squareHit =
      square.x <= x && x <= square.x + square.w &&
      square.y <= y && y <= square.y + square.h;

    if (squareHit) {
      if (squareHandler) {
        squareHandler({
          type: "square",
          square: squareKey
        });
      }
      return true;
    }
  }

  return false;
}
