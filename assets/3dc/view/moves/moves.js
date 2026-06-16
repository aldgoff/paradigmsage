/* File: moves.js
  Path: ./3dc/view/moves/moves.js
  Purpose: Rendering the view panel and board.
  Author: Allan Goff
  Date: 4/30/26
  Recommended access: import * as vMoves from "../../view/moves/moves.js";
  UI: the export functions.
  Philosophy: Delete a module by deleting its directory - not so much.
    controller/ model/ view/
    play.md - DOM
    main.js - regressions
    view.js - wire, build payload
    game.js - rewind, FF
    state.js - undo, redo
*/

// --- Load JSON ---
  import movesData from "./moves.json" assert { type: "json" };
  const movesModule = movesData.moves_module;
  const category  = movesModule.category;
// Seampoint: more objects...

// --- Dependencies ---
  import * as state  from "../../model/state/state.js";
  import * as quads  from "../../geometry/quads/quads.js";
// Seampoint: more imports...

// --- Globals ---
  let activeAnimation = null;
// Seampoint: more globals...

// --- UI ---
export function clearMoves() {
  console.log("view : moves.js - clearMoves()");
  }

export function undo(move) {
  console.log("view : moves.js - undo(move)", move);
  // TODO: write undo().
  }

export function redo(move) {
  console.log("view : moves.js - redo(move)", move);
  // TODO: write redo().
}

export function pushPanelLine(move) {
  console.log("view : moves.js - pushPanelLine(move)", move);
  
  let { action, turn, player, key, prev, post } = move;

  const scroll = document.getElementById("move-list");
  if(!scroll) return;

  const line = assembleMoveLine(move);

  const div = document.createElement("div");
  div.textContent = line;

  // Write to the scroll box.
  scroll.appendChild(div);
  scroll.scrollTop = scroll.scrollHeight;
  }

export function pushPanelLine1(move) {
  console.log("view : moves.js - pushPanelLine(move)", move);

  const scroll = document.getElementById("move-list");
  if(!scroll) return;

  const line = assembleLine(move);

  const div = document.createElement("div");
  div.textContent = line;

  // Write to the scroll box.
  scroll.appendChild(div);
  scroll.scrollTop = scroll.scrollHeight;
  }

export function popPanelLine() {
  console.log("view : moves.js - popPanelLine()");

  const scroll = document.getElementById("move-list");
  if(!scroll) return;

  const last = scroll.lastElementChild;
  if(!last) return;

  scroll.removeChild(last);
  }

export function refreshPanel(move) {
  console.log("view : moves.js - refreshPanel(move)", move);
  
  const scroll = document.getElementById("move-list");    // Scroll list.
  if (!scroll) return;

  const count = state.getIndices().Moves;                 // Scroll text box.
  const children = scroll.children;
  for (let i = 0; i < children.length; i++) {
    if (i < count) {
      children[i].style.opacity = "1.0";   // active
    } else {
      children[i].style.opacity = "0.3";   // future
    }
  }
}

export function cancelAnimation() {
  if (activeAnimation) {
    activeAnimation.cancelled = true;
    activeAnimation = null;
  }
  }

export function render(move) {  // Used to render a just created move via panel.
  console.log("view : moves.js - renderMove(move)", move);
  // TODO: write renderMove().
  return;
  }

export function renderMove(move) {  // Used to render a just created move via panel.
  console.log("view : moves.js - renderMove(move)", move);
  // TODO: write renderMove().
  return;
  }

export function derenderMove(move) {
  console.log("view : moves.js - derenderMove(move)", move);
  // TODO: write derenderMove().
  return;
}
// Seampoint: more global functions...

// --- Helpers ---
function assembleLine(move) {
  const { turn, player, piece, src, action, dst, sec } = move;

  const index = state.getIndices().Moves;

  // --- column widths ---
  const turnCol = (String(turn).padStart(3)).padEnd(4);
  const pieceCol = `${piece}`.padEnd(1);
  const moveCol = "-";
  const dstCol = `${dst}`.padEnd(6);

  const whiteCol = (player === "White") ? `${pieceCol}${moveCol}${dstCol}`: "        ";
  const blackCol = (player === "Black") ? `${pieceCol}${moveCol}${dstCol}`: "        ";

  const annotationsCol = ".....    .....";

  const line = `${turnCol} ${whiteCol} ${blackCol} ${annotationsCol}`;

  return line;
}

function assembleMoveLine(move) {
  let { action, turn, player, key, prev, post } = move;

  const index = state.getIndices().Moves;

  // --- column widths ---
  const turnCol  = (String(turn).padStart(3)).padEnd(4);
  const pieceCol = `${key}`.padEnd(4);
  const srcCol   = `${prev}`.padEnd(6);
  const dstCol   = `${post}`.padEnd(6);

  const whiteCol = (player === "White") ? `${pieceCol} ${srcCol} - ${dstCol}`: "        ";
  const blackCol = (player === "Black") ? `${pieceCol} ${srcCol} - ${dstCol}`: "        ";

  const annotationsCol = ".....    .....";

  const line = `${turnCol} ${whiteCol} ${blackCol} ${annotationsCol}`;

  return line;
}
// Seampoint: more local functions...

