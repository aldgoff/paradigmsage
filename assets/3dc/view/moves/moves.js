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
  
  const { action, turn, player, list } = entry;   // list:[{key,prev,post}].

  const scroll = document.getElementById("move-list");
  if(!scroll) return;

  let line = "";
  if(     action === "move")          line = assembleMoveLine(entry);
  else if(action === "capture")       line = assembleCaptureLine(entry);
  else if(action === "enpassant")     line = assembleEnpassantLine(entry);
  else if(action === "castle")        line = assembleCastleLine(entry);
  else if(action === "promote")       line = assemblePromoteLine(entry);
  else if(action === "fission")       line = assembleFissionLine(entry);
  else if(action === "uplift")        line = assembleUpliftLine(entry);

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

  (count%2 === 1)                                         // Player radio buttons.
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
  const blank = "                          ";

function assembleMoveLine(entry) {      // WKRP @KR2,2 - @KR4,4...
  console.log("view : moves.js - assembleMoveLine(move)", entry);

  const { action, turn, player, list, annotation } = entry;   // Parse.
  const lists = list.length;
  const mover = list[0]; // [{key,prev,post}].
  const list2 = (lists === 2) ? list[1] : null;

  const key = (lists === 2) ? `${mover.key.slice(0,3)}S` : mover.key;

  const turnCol  = (String(turn).padStart(3)).padEnd(4);      // Columns.
  const pieceCol = `${key}`.padEnd(4);
  const srcCol   = `${mover.prev}`.padEnd(6);
  const dstCol   = `${mover.post.slice(1)}`.padEnd(10);

  const row = `${pieceCol} ${srcCol} ${key[3]}-${dstCol}`.padEnd(26); // Assemble.
  const whiteCol = (player === "White") ? row: `${blank}`;
  const blackCol = (player === "Black") ? row: `${blank}`;
  const annotationsCol = `${annotation}`;
  const line = `${turnCol} ${whiteCol} ${blackCol} ${annotationsCol}`;

  return line;  // 1  WKRP @KR2,2 P-KR4,4    ....
  }

function assembleCaptureLine(entry) {   // WKRP @KR4,4 x BKRP@KR5,5...
  console.log("view : moves.js - assembleCaptureLine(entry)", entry);

  const { action, turn, player, list, annotation } = entry;   // Parse.

  const lists = list.length;
  const list1 = list[0];    // [{key,prev,post}].
  const list2 = list[1];    // [{key,prev,post}].
  const list3 = list[2];    // Possibly null.
  const list4 = list[3];    // Possibly null.

  let row = "";
  if(annotation === "capture") {
    const key = list1.key;
    const pieceCol = `${list1.key}`.padEnd(4);
    const srcCol   = `${list1.prev}`.padEnd(6);
    const dstCol   = `${list1.post}`.padEnd(10);
    row = `${pieceCol} ${srcCol} ${list1.key[3]}x${list2.key[3]} ${dstCol}`.padEnd(26);  // Assemble.
    }
  else if(annotation === "decay") {
    const key = list1.key;
    const pieceCol = `${list1.key}`.padEnd(4);
    const srcCol   = `${list1.prev}`.padEnd(6);
    const dstCol   = `${list1.post}`.padEnd(10);
    row = `${pieceCol} ${srcCol} ${list1.key[3]}x${list2.key[3]} ${dstCol}`.padEnd(26);  // Assemble.
    }
  else if(annotation === "SxZ") {
    const key = `${list1.key.slice(0,3)}S`;
    const pieceCol = `${key}`.padEnd(4);
    const srcCol   = `${list1.prev}`.padEnd(6);
    const dstCol   = `${list1.post}`.padEnd(10);
    row = `${pieceCol} ${srcCol} Sx${list3.key[3]} ${dstCol}`.padEnd(26);  // Assemble.
    }
  else if(annotation === "ZxS") {
    const key = `${list2.key.slice(0,3)}S`;
    const pieceCol = `${list1.key}`.padEnd(4);
    const srcCol   = `${list1.prev}`.padEnd(6);
    const dstCol   = `${list1.post}`.padEnd(10);
    row = `${pieceCol} ${srcCol} ${list1.key[3]}xS ${dstCol}`.padEnd(26);  // Assemble.
    }
  else if(annotation === "SxS") {
    const key1 = `${list1.key.slice(0,3)}S`;
    const key3 = `${list3.key.slice(0,3)}S`;
    const pieceCol = `${key1}`.padEnd(4);
    const srcCol   = `${list1.prev}`.padEnd(6);
    const dstCol   = `${list1.post}`.padEnd(10);
    row = `${pieceCol} ${srcCol} SxS ${dstCol}`.padEnd(26);  // Assemble.
    }
  else {
    throw new Error(`Unknown annotation ${annotation}.`);
  }

  const turnCol  = (String(turn).padStart(3)).padEnd(4);      // Columns.
  const whiteCol = (player === "White") ? row: `${blank}`;
  const blackCol = (player === "Black") ? row: `${blank}`;
  const annotationsCol = `${annotation}`;
  const line = `${turnCol} ${whiteCol} ${blackCol} ${annotationsCol}`;

  return line;  // 1  WKRP @KR2,2 P-KR4,4    ....
}

function assembleFissionLine(entry) {   // WKRP @KR4,4 x BKRP@KR5,5...
  console.log("view : moves.js - assembleFissionLine(entry)", entry);

  const { action, turn, player, list, annotation } = entry;   // Parse.
  const list1 = list[0]; // [{key,prev,post}].
  const list2 = list[1]; // [{key,prev,post}].
  const type1 = list1.key[3];
  const type2 = list2.key[3];

  const turnCol  = (String(turn).padStart(3)).padEnd(4);      // Columns.
  const piece1Col  = `${type1}${list1.post}`.padEnd(7);
  const piece2Col  = `${type2}${list2.post}`.padEnd(7);

  const row = `${piece1Col} ${piece2Col}`.padEnd(26);         // Assemble.
  const whiteCol = (player === "White") ? row: `${blank}`;
  const blackCol = (player === "Black") ? row: `${blank}`;
  const annotationsCol = "fission";
  const line = `${turnCol} ${whiteCol} ${blackCol} ${annotationsCol}`;

  return line;  // 2  WKRP @KR4,4 x BKRP@KR5,5...
  }

function assembleEnpassantLine(entry) { // WKRP @KR4,4 x BKRP@KR5,5...
  console.log("view : moves.js - assembleEnpassantLine(entry)", entry);

  const { action, turn, player, list, annotation } = entry;   // Parse.
  const attacker = list[0]; // [{key,prev,post}].
  const captured = list[1]; // [{key,prev,post}].

  const turnCol  = (String(turn).padStart(3)).padEnd(4);      // Columns.
  const pieceCol = `${attacker.key}`.padEnd(4);
  const srcCol   = `${attacker.prev}`.padEnd(7);
  const dstCol   = `${captured.key}${attacker.post}`.padEnd(10);

  const row = `${pieceCol} ${srcCol} x ${dstCol}`.padEnd(26); // Assemble.
  const whiteCol = (player === "White") ? row: `${blank}`;
  const blackCol = (player === "Black") ? row: `${blank}`;
  const annotationsCol = "ep";
  const line = `${turnCol} ${whiteCol} ${blackCol} ${annotationsCol}`;

  return line;  // 2  WKRP @KR4,4 x BKRP@KR5,5...
  }

function assembleCastleLine(entry) {    // WKRP @KR4,4 x BKRP@KR5,5...
  console.log("view : moves.js - assembleCastleLine(entry)", entry);

  const { action, turn, player, list, annotation } = entry;   // Parse.
  const king  = list[0]; // [{key,prev,post}].
  const rook  = list[1]; // [{key,prev,post}].
  const rook2 = (list.length === 3) ? list[2] : null; // [{key,prev,post}].

  const turnCol  = (String(turn).padStart(3)).padEnd(4);      // Columns.
  const kingCol  = `K${king.post}`.padEnd(7);
  const rookCol  = `R${rook.post}`.padEnd(7);
  const rook2Col = (list.length === 3) ? `R${rook2.post}`.padEnd(8) : "".padEnd(8);

  const row = `${kingCol} ${rookCol} ${rook2Col}`.padEnd(26); // Assemble.
  const whiteCol = (player === "White") ? row: `${blank}`;
  const blackCol = (player === "Black") ? row: `${blank}`;
  const annotationsCol = (list.length === 3) ? "double" : "castle";
  // const annotationsCol = "castle: kingside, queenside, royal, double";  // TODO: castle type.
  const line = `${turnCol} ${whiteCol} ${blackCol} ${annotationsCol}`;

  return line;  // 2  WKRP @KR4,4 x BKRP@KR5,5...
}

function assemblePromoteLine(entry) {   // WKRP @KR7,7 - Q@KR8,8...
  console.log("view : moves.js - assemblePromoteLine(entry)", entry);

  const { action, turn, player, list, annotation } = entry;   // Parse.
  const pawn  = list[0]; // [{key,prev,post}].
  const queen = list[1]; // [{key,prev,post}].

  const turnCol  = (String(turn).padStart(3)).padEnd(4);      // Columns.
  const pieceCol = `${pawn.key}`.padEnd(4);
  const srcCol   = `${pawn.prev}`.padEnd(7);
  const dstCol   = `${pawn.post}`.padEnd(10);

  const row = `${pieceCol} ${srcCol} - ${queen.key[3]}${dstCol}`.padEnd(26); // Assemble.
  const whiteCol = (player === "White") ? row: `${blank}`;
  const blackCol = (player === "Black") ? row: `${blank}`;
  const annotationsCol = ".....";
  const line = `${turnCol} ${whiteCol} ${blackCol} ${annotationsCol}`;

  return line;  // 1  WKRP @KR7,7 - Q@KR8,8...
  }

function assembleUpliftLine(entry) {
  console.log("view : moves.js - assembleUpliftLine(entry)", entry);

  const { action, turn, player, list, annotation } = entry;   // Parse.
  const stack  = list[0]; // [{key,prev,post}].
  const bishop = list[1]; // [{key,prev,post}].
  const duke   = list[1]; // [{key,prev,post}].

}
// Seampoint: more local functions...

// Move, decayMovs, promoteMov.
// Teleports, capture, combines, decayCaps, promoteCap, uplifts.
// StackCap.
// StackMov, Enpassant.
// FissionMM, castle, royal.
// fissionCM, fissionMC.
// fissionCC.
// DoubleCastle.

//WTF? Fission: capture and teleportation ?!?
