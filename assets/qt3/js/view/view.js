// qt3/view/view.js

import { QT3_LAYOUT } from "../layout.js";

import {drawButtons,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        setButtonHandler
} from "./controlsView.js";
import {drawMoves 
} from "./moves.js";
import {drawQuantumListing,
        drawClassicalListing,
} from "./listings.js";
import {drawBounds,
        drawEnsemble,
} from "./ensemble.js";

import {modelSetStateString,  // The state of the game is held in the model layer.
        modelGetStateString,
        modelSetStatusString,
        modelGetStatusString,
} from "../model/model.js";

// The js-website drawing canvas.
const canvas = document.getElementById("qt3-game");
const ctx = canvas.getContext("2d");

export function initView() {
  installPointerHandlers();
  render();
}

export function updateView() {
  modelGetStateString()
  render();
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawLayoutBounds();                // Local.

  drawStatusString();                // Local.

  drawButtons();                     // Imported from controlsView.js.

  drawBoardGrid(QT3_LAYOUT);         // Local.
  drawSquareNumbers(QT3_LAYOUT);     // Local.
  drawMoves(modelGetStateString());  // Imported from moves.js.

  drawQuantumListing(  QT3_LAYOUT.moveListQT3, modelGetStateString()); // Imported from listings.js.
  drawClassicalListing(QT3_LAYOUT.moveListCT3, modelGetStateString());

  drawStateString(modelGetStateString());

  drawEnsemble(modelGetStateString());       // Imported from ensemble.
}

// Outline visual objects (facilitates arranging them).
function drawLayoutBounds(layout = QT3_LAYOUT) {
  ctx.save();

  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 1;

  for (const layout_key in layout) { // Outline each graphical element in layout.
    if (layout_key === "board") {  // Outline & label QT3 squares and spooky cells.
      // console.log("// Don't draw board outline.");
      const squares = layout.board.squares;
      for (const squares_key in squares) {
        const sq = squares[squares_key];  // Square1, square2, square3, ... square9.

        // The grid of spooky cells within each square.
        // const cell = sq.spookyCells; // Draw cells.
        const cell = [];  // Don't.
        for (const cells_key in cell) {
          const sub = cell[cells_key];
          ctx.fillStyle = "#ccc";  // Visible cells.
          ctx.strokeRect(sub.x, sub.y, sub.w, sub.h);
          ctx.font = "12px sans-serif";
          ctx.fillText(cells_key, sub.x + 7, sub.y + 19);
        }
      }
      }
    else if (layout_key === "controls") {
      // console.log("// Don't draw controls outline.");
      }
    else if (layout_key === "moveListQT3") {
      // console.log("// Don't draw moveListQT3 outline.");
      }
    else if (layout_key === "moveListCT3") {
      // console.log("// Don't draw moveListCT3 outline.");
      }
    else if (layout_key === "stateBox") {
      // console.log("// Don't draw stateBox outline.");
      }
    else if (layout_key === "ensemble") {
      // console.log("// Don't draw ensemble outline.");
      const element = layout[layout_key]
      const box = element.box;
      const grid = Number(box.grid);

      const X = element.x;
      const Y = element.y;

      for(let i=0; i<16; i++) {
        const X = element.x + i*grid;
        for(let j=0; j<32; j++) {
          const Y = element.y + j*grid;
          drawBounds(X, Y);
        }
      }
      }
    else {                  // Outline & label graphical elements.
      const element = layout[layout_key];
      // console.log("layout_key", layout_key); // statusBox only.
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

    if (handlePointerDown(x, y)) {  // Buttons controlsView.js.
      drawButtons();
      return;
      }

    if (handleSquareClicks(x, y)) { // Board clicks.
      return;
    }

    /* Next step planning */
      // TODO: Ensemble (for classical game selection - populates the classical listing)?
  });

  canvas.addEventListener("mousemove", e => {
    const { x, y } = getCanvasCoords(e);
    if (handlePointerMove(x, y)) {
      drawButtons();
    }
  });

  canvas.addEventListener("mouseup", e => {
    const { x, y } = getCanvasCoords(e);
    handlePointerUp(x, y);
    drawButtons();
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
  setButtonHandler(fn);
}

/* Draw board and square numbers. */
function drawBoardGrid(layout) {
  const { x, y, w, h, gridLines } = layout.board;
  const { gap, thickness, separation, color } = gridLines;

  const squareSize = 90;  // matches layout squares
  const length = squareSize * 3 + gap * 2;

  ctx.save();
  ctx.fillStyle = color;

  for (let col = 1; col <= 2; col++) {  // Vertical double lines.
    const offset = x + gridLines.offset + col * squareSize + (col - 1) * gap;

    ctx.fillRect(offset,              y, thickness, length);  // 1st line.
    ctx.fillRect(offset + separation, y, thickness, length);  // 2nd line.
  }

  for (let row = 1; row <= 2; row++) {  // Horizontal double lines.
    const offset = y + gridLines.offset + row * squareSize + (row - 1) * gap;

    ctx.fillRect(x, offset,              length, thickness);  // 1st line.
    ctx.fillRect(x, offset + separation, length, thickness);  // 2nd line.
  }

  ctx.restore();
  }

function drawSquareNumbers(layout) {
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

/* Square/cell clicks. */
let squareHandler = null;                 // Event triggered callback to
export function setSquareHandler(fn) {    // respond to square/cell clicks.
  squareHandler = fn;
  }

function handleSquareClicks(x, y) {       // View layer: event driven, called by canvas listener, invokes squareHandler.
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

/* State string. */
export function setStateString(str) {
  modelSetStateString(str);
  render(); // Calls drawStateString(str).
  }

function drawStateString(stateString) {
  const textarea = document.getElementById("qt3-state-input");
  if (textarea) {
    textarea.value = stateString;
  }
}

/* Status string. */
export function setStatusString(str) {
  modelSetStatusString(str);
  drawStatusString();
  }

function drawStatusString() {
  const { x, y, w, h } = QT3_LAYOUT.statusBox;

  ctx.save();

  // Box background
  ctx.fillStyle = "#fff";
  ctx.fillRect(x, y, w, h);

  ctx.strokeStyle = "#555";
  ctx.strokeRect(x, y, w, h);

  // Text
  ctx.fillStyle = "#000";
  ctx.font = "16px monospace";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  const padding = 10;
  const textY = y + 4

  drawWrappedText(modelGetStatusString(), x + padding, y + 10, w-2 * padding, 20);

  ctx.restore();
  }

function drawWrappedText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let lines = [];

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + " ";
    } else {
      line = testLine;
    }
  }

  lines.push(line);

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, y + i * lineHeight);
  }
}

