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

  const { action, 
    player,   // White|Black
  } = payload;

  switch (action) {
    case "move":          handleMove(payload); break;
    case "capture":       handleCapture(payload); break;
    case "enpassant":     handleEnpassant(payload); break;
    case "castle":        handleCastle(payload); break;
    case "promote":       handlePromote(payload); break;
    case "duke-decay":    handleDukeDecay(payload); break;
    case "bishop-decay":  handleBishopDecay(payload); break;
    case "fission":       handleFission(payload); break;
    case "teleportation": handleTeleportation(payload); break;
    case "uplift  ":      handleUplift(payload); break;
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

  return {
    action,
    player:   panel.querySelector('input[name="move-player"]:checked')?.value,
  };
}

export function buildForward(entry) {     // Redo.
  console.log("cntrl: moves.js - buildForward(entry)", entry);

  const { action, turn, player, key, prev, next } = entry;
  // const { action, turn, player, list } = entry;

  if(     action === "move") {
    // const {action,turn,player,list:[{key,prev,post}]} = entry;
    forewardMove(entry);
    }
  else if(action === "capture") {
    forewardCapture(entry);
    }
  else if(action === "enpassant") {
    // TODO: ForwardTask()
    }
  else if(action === "castle") {
    // TODO: ForwardTask()
    }
  else if(action === "promote") {
    // TODO: ForwardTask()
    }
  else if(action === "duke-decay") {
    // TODO: ForwardTask()
    }
  else if(action === "bishop-decay") {
    // TODO: ForwardTask()
    }
  else if(action === "fission") {
    // TODO: ForwardTask()
    }
  else if(action === "teleportation") {
    // TODO: ForwardTask()
    }
  else if(action === "uplift") {
    // TODO: ForwardTask()
    }
  else {  // Seampoint: more buttons...
    throw new Error(`Unknown forward action ${action} for moves.`);
  }

  vMoves.refreshPanel();         

  console.log("*** pieceList", mPieces.getPieceList());
  console.log("*** occupancy", mBoards.getBoardOccupancy());

  panels.diagnostics();
  }

export function buildBackward(entry) {    // Undo.
  console.log("cntrl: moves.js - buildBackward(entry)", entry);

  const { action, turn, player, key, prev, next } = entry;
  // const { action, turn, player, list } = entry;

  if(     action === "move") {
    // const {action,turn,player,list:[{key,prev,post}]} = entry;
    backwardMove(entry);
    }
  else if(action === "capture") {
    backwardCapture(entry);
    }
  else if(action === "enpassant") {
    // TODO: BackwardTask()
    }
  else if(action === "castle") {
    // TODO: BackwardTask()
    }
  else if(action === "promote") {
    // TODO: BackwardTask()
    }
  else if(action === "duke-decay") {
    // TODO: BackwardTask()
    }
  else if(action === "bishop-decay") {
    // TODO: BackwardTask()
    }
  else if(action === "fission") {
    // TODO: BackwardTask()
    }
  else if(action === "teleportation") {
    // TODO: BackwardTask()
    }
  else if(action === "uplift") {
    // TODO: BackwardTask()
    }
  else {  // Seampoint: more buttons...
    throw new Error(`Unknown backward action ${action} for moves.`);
  }

  vMoves.refreshPanel();         

  console.log("*** pieceList", mPieces.getPieceList());
  console.log("*** occupancy", mBoards.getBoardOccupancy());

  panels.diagnostics();
}
// Seampoint: more global functions...

// --- Handle Functions ---
function handleMove(payload) {
  console.log("cntrl: moves.js - handleMove(payload)", payload);

  const { action, player } = payload;
  const selections = cSelections.getSelections();

  const entry = mMoves.makeMoveEntry(selections, payload);

  forewardMove(entry);

  branchHistory(entry);
  state.pushNewMove(entry);           // Change state.
  vMoves.pushPanelLine(entry);        // Create and add line to panel.
  vMoves.refreshPanel(entry);
  }

function handleCapture(payload) {
  console.log("cntrl: moves.js - handleCapture(payload)", payload);

  const { action, player } = payload;
  const selections = cSelections.getSelections();

  const entry = mMoves.makeCaptureEntry(selections, payload);

  forewardCapture(entry);

  branchHistory(entry);
  state.pushNewMove(entry);           // Change state.
  vMoves.pushPanelCaptureLine(entry); // Add line to panel.
  vMoves.refreshPanel(entry);
  }

function handleEnpassant(payload) {
  console.log("cntrl: moves.js - handleEnpassant(payload)", payload);

  const { player, piece, src, dst, sec, captured, opts } = payload;  // Informative.

  // TODO: change state - handleEnpassant().
  }

function handleCastle(payload) {
  console.log("cntrl: moves.js - handleCastle(payload)", payload);
 
  const { player, piece, src, dst, sec, captured, opts } = payload;  // Informative.

 // TODO: change state - handleCastle().
  }

function handlePromote(payload) {
  console.log("cntrl: moves.js - handlePromote(payload)", payload);

  const { player, piece, src, dst, sec, captured, opts } = payload;  // Informative.

  // TODO: change state - handlePromote().
  }

function handleDukeDecay(payload) {
  console.log("cntrl: moves.js - handleDukeDecay(payload)", payload);

  const { player, piece, src, dst, sec, captured, opts } = payload;  // Informative.

  // TODO: change state - handleDukeDecay().
  }

function handleBishopDecay(payload) {
  console.log("cntrl: moves.js - handleBishopDecay(payload)", payload);

  const { player, piece, src, dst, sec, captured, opts } = payload;  // Informative.

  // TODO: change state - handleBishopDecay().
  }

function handleFission(payload) {
  console.log("cntrl: moves.js - handleFission(payload)", payload);

  const { player, piece, src, dst, sec, captured, opts } = payload;  // Informative.

  // TODO: change state - handleFission().
  }

function handleTeleportation(payload) {
  console.log("cntrl: moves.js - handleTeleportation(payload)", payload);

  const { player, piece, src, dst, sec, captured, opts } = payload;  // Informative.

  // TODO: change state - handleTeleportation().
  }

function handleUplift(payload) {
  console.log("cntrl: moves.js - handleUplift(payload)", payload);

  const { player, piece, src, dst, sec, captured, opts } = payload;  // Informative.

  // TODO: change state - handleUplift().
}
// Seampoint: more handle functions...

// --- Helpers...
function forewardMove(entry) {
  console.log("cntrl: moves.js - forewardMove(entry)", entry);

  let { action, turn, player, key, prev, post } = entry;
  // const {action,turn,player,list:[{key,prev,post}]} = entry;

  const [, dstStr] = post.split("@");
  const { ok, err } = mPieces.movePieceTileToTile(key, dstStr);
  if(!ok) return { ok, err };
  }

function backwardMove(entry) {
  console.log("cntrl: moves.js - backwardMove(entry)", entry);

  let { action, turn, player, key, prev, post } = entry;
  // const {action,turn,player,list:[{key,prev,post}]} = entry;

  const [, dstStr] = prev.split("@");
  const { ok, err } = mPieces.movePieceTileToTile(key, dstStr);
  if(!ok) return { ok, err };
}

function forewardCapture(entry) {
  console.log("cntrl: moves.js - forewardCapture(entry)", entry);

  const { action, turn, player, list } = entry;
  const attacker = list[0]; // {key,prev,post}
  const captured = list[1]; // {key,prev,post}

  const [, dstStr]  = attacker.post.split("@");
  mPieces.movePieceFromBoardToTray(captured.key);
  mPieces.movePieceTileToTile(attacker.key, dstStr);
  }

function backwardCapture(entry) { // TODO: write.
  console.log("cntrl: moves.js - backwardCapture(entry)", entry);

  const { action, turn, player, list } = entry;
  const attacker = list[0]; // {key,prev,post}
  const captured = list[1]; // {key,prev,post}

  const [, attStr]  = attacker.prev.split("@");
  const [, capStr]  = captured.prev.split("@");
  mPieces.movePieceTileToTile(attacker.key, attStr);
  mPieces.movePieceFromTrayToBoard(captured.key, capStr);
}

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

  state.pushNewMove(entry);           // Change state.
  vMoves.pushPanelLine(entry);        // Add line to panel.
  vMoves.refreshPanel(entry);
}
// Seampoint: more local functions...

/* TODO: QC checklist✅ 
    1. Write handle routines.
    2. ✅ Branch.
    3. ✅ Remove all downstream buffers.
    4. Write the forward functions.
    5. Write the backward functions.
*/

