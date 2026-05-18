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

// --- Build upon previous layers ---
  import * as state   from "../../model/state/state.js";
  import * as quads  from "../../geometry/quads/quads.js";
// Seampoint: more imports...

// --- Globals ---
let activeAnimation = null;

// --- UI ---
export function undo(move) {
  console.log("view: moves.js - undo(move)", move);
  // TODO: write undo().
  }

export function redo(move) {
  console.log("view: moves.js - redo(move)", move);
  // TODO: write redo().
}

export function pushPanelLine(move) {
  console.log("view : moves.js - pushPanelLine(move)", move);

  const el = document.getElementById("move-list");
  if(!el) return;

  const line = assembleLine(move);

  const div = document.createElement("div");
  div.textContent = line;

  // Write to the scroll box.
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
  }

export function popPanelLine() {
  console.log("view : moves.js - popPanelLine()");

  const el = document.getElementById("move-list");
  if(!el) return;

  const last = el.lastElementChild;
  if(!last) return;

  el.removeChild(last);
  }

export function refreshPanel() {
  // console.log("view : moves.js - refreshPanel()");
  const el = document.getElementById("move-list");
  if (!el) return;

  const count = state.getIndices().Moves;

  const children = el.children;

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
  console.log("view: moves.js - renderMove(move)", move);
  // TODO: write renderMove().
  return;
  }

export function renderMove(move) {  // Used to render a just created move via panel.
  console.log("view: moves.js - renderMove(move)", move);
  // TODO: write renderMove().
  return;
  }

export function derenderMove(move) {
  console.log("view: moves.js - derenderMove(move)", move);
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
// Seampoint: more local functions...

