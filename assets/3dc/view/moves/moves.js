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
  import * as cSelections from "../../controller/selections/selections.js";

  import * as view   from "../../view/view.js";
// Seampoint: more imports...

// --- Globals ---
  let activeAnimation = null;
  const TURN_WIDTH  =  4;
  const KEY_WIDTH   =  4;
  const PIECE_WIDTH = 22;
  const COL_WIDTH   = 38;
  const blank = "                                    ";
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
  if(!scroll) return;

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
  const list6 = list[5];  // Unneeded.
  const type1 = list1.key[3];
  const type2 = list2.key[3];

  const turnCol    = (String(turn).padStart(3)).padEnd(TURN_WIDTH);      // Columns.
  const keyPrevCol = `${list1.key.slice(0,3)}S ${list1.prev}`.padEnd(7);  // WKBB/D => WKBS.

  let secondCol;                        // Second column: sub pieces to destinations.
  const sub1 = `${list1.key[3]}`;         // B|D.
  const sub2 = `${list2.key[3]}`;         // D|B.
  const mov1 = `${list1.post.slice(1)}`;  // @KR1,1 => KR1,1.
  const mov2 = `${list2.post.slice(1)}`;
  const cap1 = `${list1.post}`;           // @KR8,8.
  const cap2 = `${list2.post}`;
  const piece1 = (list3) ? `${list3.key[3]}` : null;      // RBDSQNPKU.
  const piece2 = (list4) ? `${list4.key[3]}` : null;
  const piece3 = (list5) ? `${list5.key[3]}` : null;
  const stack = 'S';
  const movCap = cSelections.getTileFirst();
  // console.log("*** sub1", sub1);
  // console.log("*** sub2", sub2);
  // console.log("*** mov1", mov1);
  // console.log("*** mov2", mov2);
  // console.log("*** cap1", cap1);
  // console.log("*** cap2", cap2);
  // console.log("*** piece1", piece1);
  // console.log("*** piece2", piece2);
  // console.log("*** piece3", piece3);
  // console.log("*** movCap", movCap);

  //     keyPrevCol  sub1-mov1 sub2-mov2
  //  1  WKBS @KB1,1  B-KB3,3   D-KB4,4        BKBS @KB8,8 D-KB6,6 B-KB5,5         fissMM,fissMM
  //  2  WQBS @QB1,1  B-KB4,4   D-KB3,3        BQBS @QB8,8 D-KB5,5 B-KB6,6         fissJJ,fissJJ

  if(     annotation === "fissMM") {  // B|D-KB3,3  B|D-KB4,4.
    secondCol = `${sub1}-${mov1} ${sub2}-${mov2}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissMJ") {  // B|D-KB3,3  B|D-KB4,4.
    secondCol = `${sub1}-${mov1} ${sub2}-${mov2}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissJM") {  // B|D-KB3,3  B|D-KB4,4.
    secondCol = `${sub1}-${mov1} ${sub2}-${mov2}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissJJ") {  // B|D-KB3,3  B|D-KB4,4.
    secondCol = `${sub1}-${mov1} ${sub2}-${mov2}`.padEnd(PIECE_WIDTH);
  }
  else if(annotation === "fissMC") {  // B|D-KB3,3  B|DxP.
    secondCol = (movCap)
      ? `${sub1}-${mov1} ${sub2}x${piece1} ${cap2}`.padEnd(PIECE_WIDTH)
      : `${sub1}x${piece1} ${cap1} ${sub2}-${mov2}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissMS") {  // B|D-KB3,3  B|DxS.
    secondCol = (movCap)
      ? `${sub1}-${mov1} ${sub2}x${stack} ${cap2}`.padEnd(PIECE_WIDTH)
      : `${sub1}x${stack} ${cap1} ${sub2}-${mov2}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissJC") {  // B|D-KB3,3  B|DxP.
    secondCol = (movCap)
      ? `${sub1}-${mov1} ${sub2}x${piece1} ${cap2}`.padEnd(PIECE_WIDTH)
      : `${sub1}x${piece1} ${cap1} ${sub2}-${mov2}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissJS") {  // B|D-KB3,3  B|DxS.
    secondCol = (movCap)
      ? `${sub1}-${mov1} ${sub2}x${stack} ${cap2}`.padEnd(PIECE_WIDTH)
      : `${sub1}x${stack} ${cap1} ${sub2}-${mov2}`.padEnd(PIECE_WIDTH);
  }
  else if(annotation === "fissCM") {  // B|DxP  B|D-KB3,3.
    secondCol = (movCap)
      ? `${sub1}x${piece1} ${cap1} ${sub2}-${mov2}`.padEnd(PIECE_WIDTH)
      : `${sub1}-${mov1} ${sub2}x${piece1} ${cap2}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissSM") {  // B|DxS  B|D-KB3,3.
    secondCol = (movCap)
      ? `${sub1}x${stack} ${cap1} ${sub2}-${mov2}`.padEnd(PIECE_WIDTH)
      : `${sub1}-${mov1} ${sub2}x${piece1} ${cap2}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissCJ") {  // B|DxP  B|D-KB3,3.
    secondCol = (movCap)
      ? `${sub1}x${piece1} ${cap1} ${sub2}-${mov2}`.padEnd(PIECE_WIDTH)
      : `${sub1}-${mov1} ${sub2}x${piece1} ${cap2}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissSJ") {  // B|DxS  B|D-KB3,3.
    secondCol = (movCap)
      ? `${sub1}x${stack} ${cap1} ${sub2}-${mov2}`.padEnd(PIECE_WIDTH)
      : `${sub1}-${mov1} ${sub2}x${piece1} ${cap2}`.padEnd(PIECE_WIDTH);
  }
  else if(annotation === "fissCC") {  // B|DxP  B|DxP.
    secondCol = `${sub1}x${piece1} ${cap1} ${sub2}x${piece2} ${cap2}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissCS") {  // B|DxP  B|DxS.
    secondCol = `${sub1}x${piece1} ${cap1} ${sub2}x${stack} ${cap2}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissSC") {  // B|DxS  B|DxP.
    secondCol = `${sub1}x${stack} ${cap1} ${sub2}x${piece3} ${cap2}`.padEnd(PIECE_WIDTH);
    }
  else if(annotation === "fissSS") {  // B|DxS  B|DxS.
    secondCol = `${sub1}x${stack} ${cap1} ${sub2}x${stack} ${cap2}`.padEnd(PIECE_WIDTH);
  }
  
  const row = `${keyPrevCol} ${secondCol}`.padEnd(COL_WIDTH);         // Assemble.
  const whiteCol = (player === "White") ? row: `${blank}`;
  const blackCol = (player === "Black") ? row: `${blank}`;
  const annotationsCol = `${annotation}`;
  const line = `${turnCol} ${whiteCol} ${blackCol} ${annotationsCol}`;

  return line;  // 2  WKBS... 
  }

function assembleEnpassantLine(entry) { // WKNP @KN5,5 ExP @KB6,6 e.p. ...WKRP @KR4,4 x BKRP@KR5,5...
  console.log("view : moves.js - assembleEnpassantLine(entry)", entry);

  const { action, turn, player, list, annotation } = entry;   // Parse.

  const attacker = list[0]; // [{key,prev,post}].
  const captured = list[1]; // [{key,prev,post}].

  const turnCol  = (String(turn).padStart(3)).padEnd(TURN_WIDTH);      // Columns.
  const keyPrevCol = `${attacker.key} ${attacker.prev}`.padEnd(7);  // WKNP @KN5,5.
  const cap1 = `${attacker.post}`;           // @KN6,6.
  const secondCol = `ExP ${cap1}`.padEnd(PIECE_WIDTH);
  const row = `${keyPrevCol} ${secondCol}`.padEnd(COL_WIDTH);         // Assemble.

  const whiteCol = (player === "White") ? row: `${blank}`;
  const blackCol = (player === "Black") ? row: `${blank}`;
  const annotationsCol = `${annotation}`;
  const line = `${turnCol} ${whiteCol} ${blackCol} ${annotationsCol}`;

  return line;  // 2  WKRP @KR4,4 x BKRP@KR5,5...
  }

function assembleCastleLine(entry) {    // WKRP @KR4,4 x BKRP@KR5,5...
  console.log("view : moves.js - assembleCastleLine(entry)", entry);

  const { action, turn, player, list, annotation } = entry;   // Parse.
  const king  = list[0]; // [{key,prev,post}].
  const rook  = list[1]; // [{key,prev,post}].
  const rook2 = (list.length === 3) ? list[2] : null; // [{key,prev,post}].

  const turnCol = (String(turn).padStart(3)).padEnd(TURN_WIDTH);      // Columns.
  let row = "";
  if((list.length === 3)) {  // Double castle.
    const keyPrevCol = `${rook.key[0]}KQR @RR1,1`.padEnd(7);  // WKQR @KR1,1.
    const mov1 = `${king.post.slice(1)}`;   // @K1,1 => K1,1.
    const mov2 = `${rook.post.slice(1)}`;   // @KR1,1 => KR1,1.
    const mov3 = `${rook2.post.slice(1)}`;  // @QR1,1 => QR1,1.
    const secondCol = `K-${mov1} KR-${mov2} QR-${mov3}`.padEnd(PIECE_WIDTH);
    row = `${keyPrevCol} ${secondCol}`.padEnd(COL_WIDTH);         // Assemble.
  }
  else {  // Single castle (kingside, queenside, royal)
    const keyPrevCol = `${rook.key} ${rook.prev}`.padEnd(7);  // WKKR @KR1,1.
    const mov1 = `${king.post.slice(1)}`;   // @K1,1 => K1,1.
    const mov2 = `${rook.post.slice(1)}`;   // @KR1,1 => KR1,1.
    const secondCol = `K-${mov1} R-${mov2}`.padEnd(PIECE_WIDTH);
    row = `${keyPrevCol} ${secondCol}`.padEnd(COL_WIDTH);         // Assemble.
  }

  const whiteCol = (player === "White") ? row: `${blank}`;
  const blackCol = (player === "Black") ? row: `${blank}`;
  const annotationsCol = `${annotation}`;
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

/* TODO: QC checklist
  1. PromoteMov
  2. PromoteCap
  3. uplifts
  4. Castle
  5. KQ-side
  6. royal
*/

