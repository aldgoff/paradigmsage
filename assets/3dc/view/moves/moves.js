/* File: moves.js
  Path: ./3dc/view/moves/moves.js
  Purpose: Rendering the view panel and board.
  Author: Allan Goff
  Date: 4/30/26
  Recommended access: import * as vMoves from "../../view/moves/moves.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import movesData from "./moves.json" assert { type: "json" };
  const movesModule = movesData.moves_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as state  from "../../model/state/state.js";

  import * as view   from "../../view/view.js";
// Seampoint: more imports...

// --- Globals ---
  let activeAnimation = null;
// Seampoint: more globals...

// --- UI ---
export function clearMoves() {
  console.log("view : moves.js - clearMoves()");

  let top = state.getBufferLength("Moves");
  state.truncateState("Moves", 0);
  while(top > 0) {
    popPanelLine();
    top--;
  }

  const scene = view.getContext().scene;
  }

export function pushPanelLine(entry) {
  console.log("view : moves.js - pushPanelLine(move)", entry);
  
  const { action, turn, player, key, prev, post } = entry;
  // const {action,turn,player,list:[{key,prev,post}]} = entry;

  const scroll = document.getElementById("move-list");
  if(!scroll) return;

  let line = "";
  if(action === "move")
    line = assembleMoveLine(entry);
  else if(action == "capture")
    line = assembleCaptureLine(entry);

  const div = document.createElement("div");
  div.textContent = line;

  // Write to the scroll box.
  scroll.appendChild(div);
  scroll.scrollTop = scroll.scrollHeight;
  }

export function pushPanelCaptureLine(entry) {
  console.log("view : moves.js - pushPanelCaptureLine(move)", entry);
  
  // const {action,turn,player,list:[{key,prev,post},{key,prev,post}]} = entry;

  const scroll = document.getElementById("move-list");
  if(!scroll) return;

  const line = assembleCaptureLine(entry);

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

  // const { action, turn, player, key, prev, post } = move;
  // const {action,turn,player,list:[{key,prev,post}]} = entry/move;

  const scroll = document.getElementById("move-list");    // Scroll list.
  if (!scroll) return;

  const count = state.getIndices().Moves;                 // Scroll text box.
  const children = scroll.children;
  for(let i = 0; i < children.length; i++) {
    const opacity = (i < count)
      ? "1.0"     // active
      : "0.5";    // future
    children[i].style.opacity = opacity;
  }
  }

export function refreshEntry(entry) {
  console.log("view : moves.js - refreshEntry(entry):", entry);

  // const {action,turn,player,list:[{key,prev,post}]} = entry;

  const move = entry;
  refreshPanel(move);
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
  // const {action,turn,player,list:[{key,prev,post}]} = entry;

  const index = state.getIndices().Moves;

  // --- Column widths ---
  const turnCol  = (String(turn).padStart(3)).padEnd(4);
  const pieceCol = `${key}`.padEnd(4);
  const srcCol   = `${prev}`.padEnd(6);
  const dstCol   = `${post}`.padEnd(10);

  const whiteCol = (player === "White") ? `${pieceCol} ${srcCol} - ${dstCol}`: "                         ";
  const blackCol = (player === "Black") ? `${pieceCol} ${srcCol} - ${dstCol}`: "                         ";

  const annotationsCol = ".....";

  const line = `${turnCol} ${whiteCol} ${blackCol} ${annotationsCol}`;

  return line;
}

function assembleCaptureLine(entry) {
  console.log("view : moves.js - assembleCaptureLine(entry)", entry);

  // const {action,turn,player,list:[{key,prev,post}]} = entry;
  const { action, turn, player, list } = entry;
  const attacker = list[0]; // {key,prev,post}
  const captured = list[1]; // {key,prev,post}

  const index = state.getIndices().Moves;

  // --- Column widths ---
  const turnCol  = (String(turn).padStart(3)).padEnd(4);
  const pieceCol = `${attacker.key}`.padEnd(4);
  const srcCol   = `${attacker.prev}`.padEnd(6);
  const dstCol   = `${captured.key}${attacker.post}`.padEnd(10);

  const whiteCol = (player === "White") ? `${pieceCol} ${srcCol} x ${dstCol}`: "                         ";
  const blackCol = (player === "Black") ? `${pieceCol} ${srcCol} x ${dstCol}`: "                         ";

  const annotationsCol = ".....";

  const line = `${turnCol} ${whiteCol} ${blackCol} ${annotationsCol}`;

  return line;
}
// Seampoint: more local functions...

