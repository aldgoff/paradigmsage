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
  if(     action === "move")      line = assembleMoveLine(entry);
  else if(action === "capture")   line = assembleCaptureLine(entry);
  else if(action === "enpassant") line = assembleEnpassantLine(entry);
  // SeampointAdd: more assemble line functions.

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

  // const { action, turn, player } = move; // Can be null, not even used.
  // const { action, turn, player, list } = move;
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
  console.log("*** count", count);                        // Player radio buttons.
  (count%2 === 1)
    ? document.querySelector('input[name="move-player"][value="Black"]').checked = true
    : document.querySelector('input[name="move-player"][value="White"]').checked = true;
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
const blank = "                         ";

function assembleMoveLine(entry) {
  console.log("view : moves.js - assembleMoveLine(move)", entry);

  const { action, turn, player, list } = entry;           // Parse.
  const mover = list[0]; // [{key,prev,post}].

  const turnCol  = (String(turn).padStart(3)).padEnd(4);  // Columns.
  const pieceCol = `${mover.key}`.padEnd(4);
  const srcCol   = `${mover.prev}`.padEnd(6);
  const dstCol   = `${mover.post}`.padEnd(10);

  const row = `${pieceCol} ${srcCol} - ${dstCol}`;        // Assemble.
  const whiteCol = (player === "White") ? row: `${blank}`;
  const blackCol = (player === "Black") ? row: `${blank}`;
  const annotationsCol = ".....";
  const line = `${turnCol} ${whiteCol} ${blackCol} ${annotationsCol}`;

  return line;  // 1  WKRP @KR2,2 - @KR4,4...
  }

function assembleCaptureLine(entry) {
  console.log("view : moves.js - assembleCaptureLine(entry)", entry);

  const { action, turn, player, list } = entry;           // Parse.
  const attacker = list[0]; // [{key,prev,post}].
  const captured = list[1]; // [{key,prev,post}].

  const turnCol  = (String(turn).padStart(3)).padEnd(4);  // Columns.
  const pieceCol = `${attacker.key}`.padEnd(4);
  const srcCol   = `${attacker.prev}`.padEnd(6);
  const dstCol   = `${captured.key}${attacker.post}`.padEnd(10);

  const row = `${pieceCol} ${srcCol} x ${dstCol}`;        // Assemble.
  const whiteCol = (player === "White") ? row: `${blank}`;
  const blackCol = (player === "Black") ? row: `${blank}`;
  const annotationsCol = ".....";
  const line = `${turnCol} ${whiteCol} ${blackCol} ${annotationsCol}`;

  return line;  // 2  WKRP @KR4,4 x BKRP@KR5,5...
}

function assembleEnpassantLine(entry) {
  console.log("view : moves.js - assembleEnpassantLine(entry)", entry);

  const { action, turn, player, list } = entry;           // Parse.
  const attacker = list[0]; // [{key,prev,post}].
  const captured = list[1]; // [{key,prev,post}].

  const turnCol  = (String(turn).padStart(3)).padEnd(4);  // Columns.
  const pieceCol = `${attacker.key}`.padEnd(4);
  const srcCol   = `${attacker.prev}`.padEnd(6);
  const dstCol   = `${captured.key}${attacker.post}`.padEnd(10);

  const row = `${pieceCol} ${srcCol} x ${dstCol}`;        // Assemble.
  const whiteCol = (player === "White") ? row: `${blank}`;
  const blackCol = (player === "Black") ? row: `${blank}`;
  const annotationsCol = "ep";
  const line = `${turnCol} ${whiteCol} ${blackCol} ${annotationsCol}`;

  return line;  // 2  WKRP @KR4,4 x BKRP@KR5,5...
}
// SeampointAdd: more assemble line functions...

// Seampoint: more local functions...

