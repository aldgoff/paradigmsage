// qt3/view/view.js

import { QT3_LAYOUT } from "../layout.js";
import {
  drawControls,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  setControlHandler
} from "./controlsView.js";
import { drawMoves } from "./moves.js";

const canvas = document.getElementById("qt3-game");
const ctx = canvas.getContext("2d");

export function initView() {
  render();
  installPointerHandlers();
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight) {
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

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLayoutBounds(ctx);
  drawControls(ctx);                      // Imported from controlsView.js.
  drawBoardGrid(ctx, QT3_LAYOUT);
  drawSquareNumbers(ctx, QT3_LAYOUT);
  drawStateString(ctx);
  drawStatusString(ctx);
  drawMoves(ctx, currentStateString);     // Imported from moves.js.
  drawQuantumListing(QT3_LAYOUT.moveListQT3, currentStateString);
  drawClassicalListing(QT3_LAYOUT.moveListCT3, currentStateString);
  // ...
}

// Outline the visual objets to facilitate arranging them.
export function drawLayoutBounds(ctx, layout = QT3_LAYOUT) {
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
    else if (layout_key === "controls") {
      // console.log("// Don't draw controls outline.");
      }
    else if (layout_key === "moveListQT3") {
      // console.log("// Don't draw moveListQT3 outline.");
    }
    else if (layout_key === "moveListCT3") {
      // console.log("// Don't draw moveListCT3 outline.");
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
      drawControls(ctx);
      return;
      }

    // Board is next.
    if (handleSquareClicks(x, y)) {
      return;
    }

    /* Next step planning */
      // Move list (jump to a point in the game history, maybe just prev and next buttons?
      // Ensemble (for classical game selection - populates the classical listing)?
      // State string (for pasting before loading)?
  });

  canvas.addEventListener("mousemove", e => {
    const { x, y } = getCanvasCoords(e);
    if (handlePointerMove(x, y)) {
      drawControls(ctx);
    }
  });

  canvas.addEventListener("mouseup", e => {
    const { x, y } = getCanvasCoords(e);
    handlePointerUp(x, y);
    drawControls(ctx);
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

  // ctx.fillText(currentStateString, x + padding, textY);
  drawWrappedText(ctx, currentStateString, x + padding, y + 10, w-2 * padding, 20);

  ctx.restore();
}

/* Code to set and draw the status string. */
let currentStatusString = "Welcome to quantum tic-tac-toe (QT3). Click on New Game to begin."; 

export function setStatusString(str) {
  currentStatusString = str;
  render();
  }

function drawStatusString(ctx) {
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

  // ctx.fillText(currentStatusString, x + padding, textY);
  drawWrappedText(ctx, currentStatusString, x + padding, y + 10, w-2 * padding, 20);

  ctx.restore();
}

function setGlobalListStyles() {
  ctx.setLineDash([0, 0]);
  ctx.strokeStyle = "#000";
  ctx.fillStyle = "#000";
  ctx.font = "16px sans-serif";
  }
function drawTitle(layout, title) {
  setGlobalListStyles();

  // Bound box for title.
  ctx.strokeRect(layout.title.x, layout.title.y, layout.title.w, layout.title.h); 
  ctx.fillText(title, layout.title.x + 7, layout.title.y + 19);
  }
function drawHeader(layout, header) {
  setGlobalListStyles();

  // Shorthand for layout elements.
  let row = layout.header;
  let x_offset = row.h;
  let o_offset = row.h + row.w;

  // X - Classical.
  ctx.strokeRect(row.x, row.y, row.h, row.h);
  ctx.fillText('X', row.x + 9, row.y + 20);
  ctx.strokeRect(row.x + x_offset, row.y, row.w, row.h);
  ctx.fillText(header, row.x + x_offset + 8, row.y + 20);

  // O - Classical.
  ctx.strokeRect(row.x + o_offset, row.y, row.h, row.h);
  ctx.fillText('O', row.x + o_offset + 8, row.y + 20);
  ctx.strokeRect(row.x + x_offset + o_offset, row.y, row.w, row.h);
  ctx.fillText(header, row.x + x_offset + o_offset + 8, row.y + 20);
  }
function drawMoveNums(layout) {
  setGlobalListStyles();

  // Shorthand for layout elements.
  let row = layout.rows;
  let sep = row.h;

  for(let i=1; i<=9; i+=2) { // X moves.
    ctx.strokeRect(row.x, row.y + (i-1)*(sep/2), row.h, row.h);
    ctx.fillText(i, row.x + 10, row.y + (i-1)*(sep/2) + 19);
    ctx.strokeRect(row.x + row.h, row.y + (i-1)*(sep/2), row.w, row.h);
  }
  let o_offset = row.w + row.h;
  for(let i=2; i<=8; i+=2) { // O moves.
    ctx.strokeRect(row.x + row.w+row.h, row.y + (i-2)*(sep/2), row.h, row.h);
    ctx.fillText(i, row.x + row.w+row.h + 10, row.y + (i-2)*(sep/2) + 19);
    ctx.strokeRect(row.x + row.h + o_offset, row.y + (i-2)*(sep/2), row.w, row.h);
  }
  }
function drawQuantumMoves(layout, stateString) {
  setGlobalListStyles();
  // Need to derive moves from the stateString.
  let moves = [[4,5], [5,6], [6,4], [7,8], [8,9]];

  let row = layout.rows;
  let sep = 0;
  let xory = 1;
  let offset = 0;

  for(const move of moves) { // X moves.
    if (xory%2) {
      offset = 0;
      ctx.fillText(`${move[0]} --- ${move[1]}`, row.x + row.h + offset + 12, row.y + sep + 19);
    } 
    else {                  // O moves.
      offset = row.w + row.h;
      ctx.fillText(`${move[0]} --- ${move[1]}`, row.x + row.h + offset + 12, row.y + sep + 19);
      sep += row.h;
    }
    xory += 1;
  }
  }
function drawClassicalMoves(layout, stateString) {
  setGlobalListStyles();
  // Need to derive moves from the stateString.
  let moves = [4, 5, 6, '--', '--', 1, 3, 2];

  let row = layout.rows;
  let sep = 0;
  let xory = 1;
  let offset = 0;

  for(const move of moves) { // X moves.
    if (xory%2) {
      offset = 0;
      ctx.fillText(`    ${move}`, row.x + row.h + offset + 12, row.y + sep + 19);
    } 
    else {                  // O moves.
      offset = row.w + row.h;
      ctx.fillText(`    ${move}`, row.x + row.h + offset + 12, row.y + sep + 19);
      sep += row.h;
    }
    xory += 1;
  }
}

function drawQuantumListing(layout, stateString) {
  drawTitle(layout, "       Quantum Moves");
  drawHeader(layout, "Spooky");
  drawMoveNums(layout);
  drawQuantumMoves(layout, stateString);
  }
function drawClassicalListing(layout, stateString) {
  drawTitle(layout, "       Classical Moves");
  drawHeader(layout, "  Move");
  drawMoveNums(layout);
  drawClassicalMoves(layout, stateString);
}

