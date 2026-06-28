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
  const TURN_WIDTH  =  4;
  const KEY_WIDTH   =  4;
  const PIECE_WIDTH = 22;
  const COL_WIDTH   = 36;
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

  // Changepoint:
  div.dataset.original = line;   // <-- Save pristine text.

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

  const count = state.getIndices().Moves;
  const children = scroll.children;

  for(let i = 0; i < children.length; i += 2) {
    const white = children[i];
    const black = children[i + 1];

    if(!white) break;

    // Last unmatched move (shouldn't normally happen).
    if(!black) {
      white.style.display = "";
      white.style.opacity = (i < count) ? "1.0" : "0.4";
      break;
    }

    // Collapse Black into White.
    // const whiteText = white.textContent;
    // const blackText = black.textContent;

    // Changepoint:
    const whiteText = white.dataset.original;
    const blackText = black.dataset.original;

    // Columns:
    // 000-003 turn
    // 004-030 White
    // 031-057 Black
    // 058-... annotation
    const whiteCol = whiteText.slice(KEY_WIDTH,           KEY_WIDTH+COL_WIDTH).trimEnd();
    const blackCol = blackText.slice(KEY_WIDTH+COL_WIDTH, KEY_WIDTH+2*COL_WIDTH).trimEnd();
    const whiteAnn = whiteText.slice(KEY_WIDTH+2*COL_WIDTH).trim();
    const blackAnn = blackText.slice(KEY_WIDTH+2*COL_WIDTH).trim();

    white.textContent =
      `${whiteText.slice(0,4)}${whiteCol.padEnd(COL_WIDTH)}${blackCol.padEnd(COL_WIDTH)}${whiteAnn},${blackAnn}`;

    black.style.display = "none";

    // Three-state opacity.
    if(i + 1 < count)
      white.style.opacity = "1.0";     // Both halves completed.
    else if(i < count)
      white.style.opacity = "0.65";     // White completed, Black pending.
    else
      white.style.opacity = "0.3";     // Future move.
  }

  (count%2 === 1)                                         // Player radio buttons.
    ? document.querySelector('input[name="move-player"][value="Black"]').checked = true
    : document.querySelector('input[name="move-player"][value="White"]').checked = true;
}

export function refreshPanel1(move) {
  console.log("view : moves.js - refreshPanel(move)", move);

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
  const blank = "                                  ";

/* Notation Summary:
  * - => pure move
  * x => capture
  * ^ => promote/uplift/join
  */
function assembleMoveLine(entry) {      // WKRP @KR2,2 - @KR4,4...
  console.log("view : moves.js - assembleMoveLine(move)", entry);

  const { action, turn, player, list, annotation } = entry;   // Parse.
  const lists = list.length;
  const list1 = list[0]; // [{key,prev,post}].
  const list2 = (lists === 2) ? list[1] : null;

  const key = (lists === 2) ? `${list1.key.slice(0,3)}S` : list1.key;

  const turnCol  = (String(turn).padStart(3)).padEnd(TURN_WIDTH);      // Columns.
  const keyCol   = `${key}`.padEnd(KEY_WIDTH);
  const srcCol   = `${list1.prev}`.padEnd(6);
  const dstCol   = `${list1.post.slice(1)}`.padEnd(10);
  const transCol = `${key[3]}-${dstCol}`;

  const row = `${keyCol} ${srcCol} ${transCol}`.padEnd(COL_WIDTH);   // Assemble.
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
    const keyCol   = `${list1.key}`.padEnd(KEY_WIDTH);
    const srcCol   = `${list1.prev}`.padEnd(6);
    const transCol = `${list1.key[3]}x${list2.key[3]}`;
    const dstCol   = `${list1.post}`.padEnd(10);
    row = `${keyCol} ${srcCol} ${transCol} ${dstCol}`.padEnd(COL_WIDTH); // Assemble.
    }
  else if(annotation === "decay") {
    const key = list1.key;
    const keyCol   = `${list1.key}`.padEnd(KEY_WIDTH);
    const srcCol   = `${list1.prev}`.padEnd(6);
    const transCol = `${list1.key[3]}x${list2.key[3]}`;
    const dstCol   = `${list1.post}`.padEnd(10);
    row = `${keyCol} ${srcCol} ${transCol} ${dstCol}`.padEnd(COL_WIDTH); // Assemble.
    }
  else if(annotation === "SxC") {
    const key = `${list1.key.slice(0,3)}S`;
    const keyCol   = `${key}`.padEnd(KEY_WIDTH);
    const srcCol   = `${list1.prev}`.padEnd(6);
    const transCol = `Sx${list3.key[3]}`;
    const dstCol   = `${list1.post}`.padEnd(10);
    row = `${keyCol} ${srcCol} ${transCol} ${dstCol}`.padEnd(COL_WIDTH); // Assemble.
    }
  else if(annotation === "CxS") {
    const key = `${list2.key.slice(0,3)}S`;
    const keyCol   = `${list1.key}`.padEnd(KEY_WIDTH);
    const srcCol   = `${list1.prev}`.padEnd(6);
    const transCol = `${list1.key[3]}xS`;
    const dstCol   = `${list1.post}`.padEnd(10);
    row = `${keyCol} ${srcCol} ${transCol} ${dstCol}`.padEnd(COL_WIDTH); // Assemble.
    }
  else if(annotation === "SxS") {
    const key1 = `${list1.key.slice(0,3)}S`;
    const key3 = `${list3.key.slice(0,3)}S`;
    const keyCol   = `${key1}`.padEnd(KEY_WIDTH);
    const srcCol   = `${list1.prev}`.padEnd(6);
    const transCol = "SxS";
    const dstCol   = `${list1.post}`.padEnd(10);
    row = `${keyCol} ${srcCol} ${transCol} ${dstCol}`.padEnd(COL_WIDTH); // Assemble.
    }
  else {
    throw new Error(`Unknown annotation ${annotation}.`);
  }

  const turnCol  = (String(turn).padStart(3)).padEnd(TURN_WIDTH);      // Columns.
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
  const list2 = list[1];
  const list3 = list[2];
  const list4 = list[3];
  const list5 = list[4];
  const list6 = list[5];
  const type1 = list1.key[3];
  const type2 = list2.key[3];

  const turnCol    = (String(turn).padStart(3)).padEnd(TURN_WIDTH);      // Columns.
  const keyPrevCol = `${list1.key.slice(0,3)}S ${list1.prev}`.padEnd(7);  // WKBB/D => WKBS.

  let secondCol;                        // Second column: sub pieces to destinations.
  const sub1 = `${list1.key[3]}`;         // B|D.
  const sub2 = `${list2.key[3]}`;         // D|B.
  const mov1 = `${list1.post.slice(1)}`;  // @KR1,1 => KR1,1.
  const mov2 = `${list2.post.slice(1)}`;
  // console.log("*** sub1", sub1);
  // console.log("*** sub2", sub2);
  // console.log("*** mov1", mov1);
  // console.log("*** mov2", mov2);

  //    -keyPrevCol-
  //  1  WKBS @KB1,1 B-KB3,3 D-KB4,4        BKBS @KB8,8 D-KB6,6 B-KB5,5         fissMM,fissMM
  //  2  WQBS @QB1,1 B-KB4,4 D-KB3,3        BQBS @QB8,8 D-KB5,5 B-KB6,6         fissJJ,fissJJ


  const bMovCol = (list1.key[3] === 'B') ? `${list1.post.slice(1)}` : `${list2.post.slice(1)}`;
  const dMovCol = (list1.key[3] === 'B') ? `${list2.post.slice(1)}` : `${list1.post.slice(1)}`;

  if(     annotation === "fissMM") {
    secondCol = `${sub1}-${mov1} ${sub2}-${mov2}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissMJ") {
    secondCol = `${sub1}-${mov1} ${sub2}-${mov2}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissJM") {
    secondCol = `${sub1}-${mov1} ${sub2}-${mov2}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissJJ") {
    secondCol = `${sub1}-${mov1} ${sub2}-${mov2}`.padEnd(PIECE_WIDTH);
  }
  else if(annotation === "fissMC") {
    if(selections.getTileFirst())
      secondCol = `B-${bCapCol} Dx${dCapCol}`.padEnd(PIECE_WIDTH);
    else
      secondCol = `Bx${bCapCol} D-${dCapCol}`.padEnd(PIECE_WIDTH);
    secondCol = `S-${bMovCol}x${dMovCol}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissMS") {
    secondCol = `S-${bMovCol}x${dMovCol}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissJC") {
    secondCol = `S-${bMovCol}x${dCapCol}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissJS") {
    secondCol = `S-${bMovCol}x${dMovCol}`.padEnd(PIECE_WIDTH);
  }
  else if(annotation === "fissCM") {
    secondCol = `Sx${bMovCol}-${dMovCol}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissSM") {
    secondCol = `Sx${bMovCol}-${dMovCol}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissCJ") {
    secondCol = `Sx${bMovCol}-${dMovCol}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissSJ") {
    secondCol = `Sx${bMovCol}-${dMovCol}`.padEnd(PIECE_WIDTH);
  }
  else if(annotation === "fissCC") {
    const bCapCol = (list1.key[3] === 'B') ? `${list3.key[3]} ${list1.post}` : `${list4.key[3]} ${list2.post}`;
    const dCapCol = (list1.key[3] === 'B') ? `${list4.key[3]} ${list2.post}` : `${list3.key[3]} ${list1.post}`;
    secondCol = `Bx${bCapCol} Dx${dCapCol}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissCS") {
    const bCapCol = `${list3.key[3]} ${list1.post}`;
    const dCapCol = `S ${list2.post}`;
    secondCol = `Bx${bCapCol} Dx${dCapCol}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissSC") {
    const bCapCol = `S ${list1.post}`;
    const dCapCol = `${list5.key[3]} ${list2.post}`;
    secondCol = `Bx${bCapCol} Dx${dCapCol}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissSS") {
    const bCapCol = `S ${list1.post}`;
    const dCapCol = `S ${list2.post}`;
    secondCol = `Bx${bCapCol} Dx${dCapCol}`.padEnd(PIECE_WIDTH);
  }
  
  const row = `${keyPrevCol} ${secondCol}`.padEnd(COL_WIDTH);         // Assemble.
  const whiteCol = (player === "White") ? row: `${blank}`;
  const blackCol = (player === "Black") ? row: `${blank}`;
  const annotationsCol = `${annotation}`;
  const line = `${turnCol} ${whiteCol} ${blackCol} ${annotationsCol}`;

  return line;  // 2  WKBS... 
}

function assembleEnpassantLine(entry) { // WKRP @KR4,4 x BKRP@KR5,5...
  console.log("view : moves.js - assembleEnpassantLine(entry)", entry);

  const { action, turn, player, list, annotation } = entry;   // Parse.
  const attacker = list[0]; // [{key,prev,post}].
  const captured = list[1]; // [{key,prev,post}].

  const turnCol  = (String(turn).padStart(3)).padEnd(TURN_WIDTH);      // Columns.
  const keyCol   = `${attacker.key}`.padEnd(KEY_WIDTH);
  const srcCol   = `${attacker.prev}`.padEnd(7);
  const dstCol   = `${captured.key}${attacker.post}`.padEnd(10);

  const row = `${keyCol} ${srcCol} x ${dstCol}`.padEnd(COL_WIDTH); // Assemble.
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

  const turnCol  = (String(turn).padStart(3)).padEnd(TURN_WIDTH);      // Columns.
  const kingCol  = `K${king.post}`.padEnd(7);
  const rookCol  = `R${rook.post}`.padEnd(7);
  const rook2Col = (list.length === 3) ? `R${rook2.post}`.padEnd(8) : "".padEnd(8);

  const row = `${kingCol} ${rookCol} ${rook2Col}`.padEnd(COL_WIDTH); // Assemble.
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

  const turnCol  = (String(turn).padStart(3)).padEnd(TURN_WIDTH);      // Columns.
  const keyCol   = `${pawn.key}`.padEnd(KEY_WIDTH);
  const srcCol   = `${pawn.prev}`.padEnd(7);
  const dstCol   = `${pawn.post}`.padEnd(10);

  const row = `${keyCol} ${srcCol} - ${queen.key[3]}${dstCol}`.padEnd(COL_WIDTH); // Assemble.
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
// Castle, royal.
// fissionCM, fissionMC.
// fissionCC.
// DoubleCastle.

//WTF? Fission: capture and teleportation ?!?
