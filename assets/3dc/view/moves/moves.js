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
    const opacity = (i < count)
      ? "1.0"     // active
      : "0.3";    // future
    children[i].style.opacity = opacity;
  }
}

export function cancelAnimation() {
  if (activeAnimation) {
    activeAnimation.cancelled = true;
    activeAnimation = null;
  }
}
// Seampoint: more global functions...

// --- Helpers ---
function assembleMoveLine(move) {
  console.log("view : moves.js - assembleMoveLine(move)", move);

  let { action, turn, player, key, prev, post } = move;

  const index = state.getIndices().Moves;

  // --- Column widths ---
  const turnCol  = (String(turn).padStart(3)).padEnd(4);
  const pieceCol = `${key}`.padEnd(4);
  const srcCol   = `${prev}`.padEnd(6);
  const dstCol   = `${post}`.padEnd(6);

  const whiteCol = (player === "White") ? `${pieceCol} ${srcCol} - ${dstCol}`: "                     ";
  const blackCol = (player === "Black") ? `${pieceCol} ${srcCol} - ${dstCol}`: "                     ";

  const annotationsCol = ".....";

  const line = `${turnCol} ${whiteCol} ${blackCol} ${annotationsCol}`;

  return line;
}
// Seampoint: more local functions...

