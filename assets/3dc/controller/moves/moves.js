/* File: moves.js
  Path: ./3dc/controller/moves/moves.js
  Purpose: Allows moving pieces, shows the list of moves.
  Author: Allan Goff
  Date: 4/27/26
  Recommended access: import * as cMoves from "../../controller/moves/moves.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import movesData from "./moves.json" assert { type: "json" };
  const movesModule = movesData.moves_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as panels      from "../../panels/panels.js";
  import * as game        from "../../controller/game/game.js";
  import * as cSetup      from "../../controller/setup/setup.js";
  import * as cSelections from "../../controller/selections/selections.js";

  import * as state    from "../../model/state/state.js";
  import * as mMoves   from "../../model/moves/moves.js";
  import * as mPieces  from "../../model/pieces/pieces.js";
  import * as mBoards  from "../../model/boards/boards.js";
  import * as coords   from "../../foundation/coords/coords.js";
  import * as quads    from "../../geometry/quads/quads.js";

  import * as vMoves   from "../../view/moves/moves.js";
  import * as vGambits from "../../view/gambits/gambits.js";
  import * as vAdvsqs  from "../../view/advsqs/advsqs.js";
// Seampoint: more imports...

// --- Globals ---
// Seampoint: more globals...

// --- UI ---
export function panelDispatch(payload) {
  // console.log("cntrl: moves.js - panelDispatch(payload):", payload);

  vGambits.cancelAnimation();

  const { action, player,} = payload;   // White|Black
  const selections = cSelections.getSelections();

  switch (action) {
    case "move":          handleMove(payload, selections); break;
    case "capture":       handleCapture(payload, selections); break;
    case "enpassant":     handleEnpassant(payload, selections); break;
    case "castle":        handleCastle(payload, selections); break;
    case "promote":       handlePromote(payload, selections); break;
    case "duke-decay":    handleDukeDecay(payload, selections); break;
    case "bishop-decay":  handleBishopDecay(payload, selections); break;
    case "fission":       handleFission(payload, selections); break;
    case "teleportation": handleTeleportation(payload, selections); break;
    case "uplift  ":      handleUplift(payload, selections); break;
    case "updateParam":  break;

    default: throw new Error(`Unknown moves action ${action}.`);  break;
  }

  (player === "White")
    ? document.querySelector('input[name="move-player"][value="Black"]').checked = true
    : document.querySelector('input[name="move-player"][value="White"]').checked = true;

  game.showUndoStatus();                          // Update game panel (undo).
  }

 function normalize(payload) { // Convert panel strings to vts arrays.
  let { player, piece, src, dst, capture, sec, opts } = payload;   // Unpack panel fields.

  src = src ? coords.normalizeTileToVts(src) : null;
  dst = dst ? coords.normalizeTileToVts(dst) : null;
  sec = sec ? coords.normalizeTileToVts(sec) : null;

  const normed = { player, piece, src, dst, capture, sec, opts }; // Repack panel fields.

  return normed;
  }

export function buildPayload(panel, action) {
  console.log("     ---------- cntrl: moves.js");

  const player = panel.querySelector('input[name="move-player"]:checked')?.value;

  return { action, player };
}

export function buildForward(entry) {     // Restore from redo.
  console.log("cntrl: moves.js - buildForward(entry)", entry);

  const { action, turn, player, list } = entry;  // list:[{key,prev,post},...]}.

  if(     action === "move")          forewardMove(entry);
  else if(action === "capture")       forewardCapture(entry);
  else if(action === "enpassant")     forewardEnpassant(entry);
  else if(action === "castle")        forewardCastle(entry);
  else if(action === "promote")       forewardPromote(entry)
  else if(action === "duke-decay")    ; // TODO: ForwardTask()
  else if(action === "bishop-decay")  ; // TODO: ForwardTask()
  else if(action === "fission")       ; // TODO: ForwardTask()
  else if(action === "teleportation") ; // TODO: ForwardTask()
  else if(action === "uplift")        ; // TODO: ForwardTask()
  else {  // SeampointAdd: more build functions (fore)...
    throw new Error(`Unknown forward action ${action} for moves.`);
  }

  vMoves.refreshPanel(entry);         

  console.log("*** pieceList", mPieces.getPieceList());
  console.log("*** occupancy", mBoards.getBoardOccupancy());

  panels.diagnostics();
  }

export function buildBackward(entry) {    // Restore from undo.
  console.log("cntrl: moves.js - buildBackward(entry)", entry);

  const { action, turn, player, list } = entry;  // list:[{key,prev,post},...]}.

  if(     action === "move")          backwardMove(entry);
  else if(action === "capture")       backwardCapture(entry);
  else if(action === "enpassant")     backwardEnpassant(entry);
  else if(action === "castle")        backwardCastle(entry);
  else if(action === "promote")       backwardPromote(entry)
  else if(action === "duke-decay")    ; // TODO: BackwardTask()
  else if(action === "bishop-decay")  ; // TODO: BackwardTask()
  else if(action === "fission")       ; // TODO: BackwardTask()
  else if(action === "teleportation") ; // TODO: BackwardTask()
  else if(action === "uplift")        ; // TODO: BackwardTask()
  else {  // SeampointAdd: more build functions (back)...
    throw new Error(`Unknown backward action ${action} for moves.`);
  }

  vMoves.refreshPanel(entry);         

  console.log("*** pieceList", mPieces.getPieceList());
  console.log("*** occupancy", mBoards.getBoardOccupancy());

  panels.diagnostics();
}
// Seampoint: more global functions...

// --- Handle Functions ---
function handleMove(payload, selections) {  // Create from panel.
  console.log("cntrl: moves.js - handleMove(payload, selections)", payload, selections);

  const { action, player } = payload;
  const entry = mMoves.makeMoveEntry(payload, selections);
  forewardMove(entry);

  applyEntry(entry);
  }

function handleCapture(payload, selections) {  // Create from panel.
  console.log("cntrl: moves.js - handleCapture(payload, selections)", payload, selections);

  const { action, player } = payload;
  const entry = mMoves.makeCaptureEntry(payload, selections);
  forewardCapture(entry);

  applyEntry(entry);
  }

function handleEnpassant(payload, selections) {  // Create from panel.
  console.log("cntrl: moves.js - handleEnpassant(payload, selections)", payload, selections);

  const { action, player } = payload;
  const entry = mMoves.makeEnpassantEntry(payload, selections);
  forewardEnpassant(entry);

  applyEntry(entry);
  }

function handleCastle(payload, selections) {
  console.log("cntrl: moves.js - handleCastle(payload, selections)", payload, selections);
 
  const { action, player } = payload;
  const entry = mMoves.makeCastleEntry(payload, selections);
  forewardCastle(entry);

  applyEntry(entry);
  }

function handlePromote(payload, selections) {
  console.log("cntrl: moves.js - handlePromote(payload, selections)", payload, selections);

  const { action, player } = payload;
  const entry = mMoves.makePromoteEntry(payload, selections);
  forewardPromote(entry);

  applyEntry(entry);
  }

function handleDukeDecay(payload, selections) {
  console.log("cntrl: moves.js - handleDukeDecay(payload, selections)", payload, selections);

  const { action, player } = payload;

  // TODO: change state - handleDukeDecay().
  }

function handleBishopDecay(payload, selections) {
  console.log("cntrl: moves.js - handleBishopDecay(payload, selections)", payload, selections);

  const { action, player } = payload;

  // TODO: change state - handleBishopDecay().
  }

function handleFission(payload, selections) {
  console.log("cntrl: moves.js - handleFission(payload, selections)", payload, selections);

  const { action, player } = payload;

  // TODO: change state - handleFission().
  }

function handleTeleportation(payload, selections) {
  console.log("cntrl: moves.js - handleTeleportation(payload, selections)", payload, selections);

  const { action, player } = payload;

  // TODO: change state - handleTeleportation().
  }

function handleUplift(payload, selections) {
  console.log("cntrl: moves.js - handleUplift(payload)", payload, selections);

  const { action, player } = payload;

  // TODO: change state - handleUplift().
}
// SeampointAdd: more handle functions...

// --- Helpers...
function forewardMove(entry) {        // Move piece.
  console.log("cntrl: moves.js - forewardMove(entry)", entry);

  const { action, turn, player, list } = entry;           // Parse.
  const mover = list[0]; // list: [{key,prev,post}].
  const stack = list[1]; // list: [{key,prev,post}, {key,prev,post}].

  const [, dstStr] = mover.post.split("@");               // Move(s).
  mPieces.movePieceTileToTile(mover.key, dstStr);
  if(stack) {
    mPieces.movePieceTileToTile(stack.key, dstStr);
  }
  }

function backwardMove(entry) {
  console.log("cntrl: moves.js - backwardMove(entry)", entry);

  const { action, turn, player, list } = entry;           // Parse.
  const mover = list[0]; // list: {key,prev,post}.
  const stack = list[1]; // list: [{key,prev,post}, {key,prev,post}].

  const [, dstStr] = mover.prev.split("@");               // Move(s).
  mPieces.movePieceTileToTile(mover.key, dstStr);
  if(stack) {
    mPieces.movePieceTileToTile(stack.key, dstStr);
  }
}

function forewardCapture(entry) {     // Capture piece.
  console.log("cntrl: moves.js - forewardCapture(entry)", entry);

  const { action, turn, player, list } = entry;           // Parse.
  const attacker = list[0]; // {key,prev,post}
  const captured = list[1]; // {key,prev,post}

  const [, dstStr]  = attacker.post.split("@");           // Move(s).
  mPieces.movePieceFromBoardToTray(captured.key);
  mPieces.movePieceTileToTile(attacker.key, dstStr);
  }

function backwardCapture(entry) {
  console.log("cntrl: moves.js - backwardCapture(entry)", entry);

  const { action, turn, player, list } = entry;           // Parse.
  const attacker = list[0]; // {key,prev,post}
  const captured = list[1]; // {key,prev,post}

  const [, attStr]  = attacker.prev.split("@");           // Move(s).
  const [, capStr]  = captured.prev.split("@");
  mPieces.movePieceTileToTile(attacker.key, attStr);
  mPieces.movePieceFromTrayToBoard(captured.key, capStr);
}

function forewardEnpassant(entry) {   // En passant.
  console.log("cntrl: moves.js - forewardEnpassant(entry)", entry);

  const { action, turn, player, list } = entry;           // Parse.
  const attacker = list[0]; // {key,prev,post}
  const captured = list[1]; // {key,prev,post}

  const [, dstStr]  = attacker.post.split("@");           // Move(s).
  mPieces.movePieceFromBoardToTray(captured.key);
  mPieces.movePieceTileToTile(attacker.key, dstStr);
  }

function backwardEnpassant(entry) {
  console.log("cntrl: moves.js - backwardEnpassant(entry)", entry);

  const { action, turn, player, list } = entry;           // Parse.
  const attacker = list[0]; // {key,prev,post}
  const captured = list[1]; // {key,prev,post}

  const [, attStr]  = attacker.prev.split("@");           // Move(s).
  const [, capStr]  = captured.prev.split("@");
  mPieces.movePieceTileToTile(attacker.key, attStr);
  mPieces.movePieceFromTrayToBoard(captured.key, capStr);
}

function forewardCastle(entry) {      // Castle.
  console.log("cntrl: moves.js - forewardCastle(entry)", entry);

  const { action, turn, player, list } = entry;           // Parse.
  const king = list[0]; // {key,prev,post}
  const rook = list[1]; // {key,prev,post}
  const rook2 = (list.length === 3) ? list[2] : null; // [{key,prev,post}].

  const [, kingStr]  = king.post.split("@");              // Move(s).
  const [, rookStr]  = rook.post.split("@");
  mPieces.movePieceTileToTile(king.key, kingStr);
  mPieces.movePieceTileToTile(rook.key, rookStr);
  if(rook2) {
    const [, rookStr]  = rook2.post.split("@");
    mPieces.movePieceTileToTile(rook2.key, rookStr);
  }
  }

function backwardCastle(entry) {
  console.log("cntrl: moves.js - backwardCastle(entry)", entry);

  const { action, turn, player, list } = entry;           // Parse.
  const king = list[0]; // {key,prev,post}
  const rook = list[1]; // {key,prev,post}
  const rook2 = (list.length === 3) ? list[2] : null; // [{key,prev,post}].

  const [, kingStr]  = king.prev.split("@");              // Move(s).
  const [, rookStr]  = rook.prev.split("@");
  mPieces.movePieceTileToTile(king.key, kingStr);
  mPieces.movePieceTileToTile(rook.key, rookStr);
  if(rook2) {
    const [, rookStr]  = rook2.prev.split("@");
    mPieces.movePieceTileToTile(rook2.key, rookStr);
  }
}

function forewardPromote(entry) {      // Promote.
  console.log("cntrl: moves.js - forewardPromote(entry)", entry);

  const { action, turn, player, list } = entry;           // Parse.
  const pawn  = list[0]; // {key,prev,post}
  const queen = list[1]; // {key,prev,post}

  const [, pawnStr]  = pawn.post.split("@");              // Move(s).
  const [, queenStr] = queen.post.split("@");
  mPieces.movePieceTileToTile(pawn.key, pawnStr);
  // TODO: promote pawn to queen (or whatever).
  }

function backwardPromote(entry) {
  console.log("cntrl: moves.js - backwardPromote(entry)", entry);

  const { action, turn, player, list } = entry;           // Parse.
  const pawn  = list[0]; // {key,prev,post}
  const queen = list[1]; // {key,prev,post}

  const [, pawnStr]  = pawn.prev.split("@");              // Move(s).
  const [, queenStr] = queen.prev.split("@");
  // TODO: demote queen to pawn.
  mPieces.movePieceTileToTile(pawn.key, pawnStr);
}
// SeampointAdd: more fore/back functions...

function branchHistory(entry) {
  console.log("cntrl: moves.js - branchHistory(entry):", entry);

  if(!state.isAtEnd("Moves")) {               // Undo branch.
    let top = state.getBufferLength("Moves");
    const idx = state.getCurrentIndex("Moves");
    state.truncateState("Moves", idx);
    while(top > idx) {
      vMoves.popPanelLine();
      top--;
    }
    vMoves.refreshPanel(entry);
  }

  vGambits.clearGambits();            // Remove all entries in downstream buffers.
  state.clearBuffer("Gambits");

  vAdvsqs.clearAdvsqs();
  state.clearBuffer("AdvSqs");
  }

function applyEntry(entry) {
  console.log("cntrl: moves.js - applyEntry(entry)", entry);

  branchHistory(entry);               // Manage undo history when branched.
  state.pushNewMove(entry);           // Change state.
  vMoves.pushPanelLine(entry);        // Add line to panel.
  vMoves.refreshPanel(entry);         // Refresh panel (dimmed future rows).
}
// Seampoint: more local functions...

/* TODO: QC checklist✅ 
    1. Write handle routines.
    2. ✅ Branch.
    3. ✅ Remove all downstream buffers.
    4. Write the forward functions.
    5. Write the backward functions.
*/

