/* File: moves.js
  Path: ./3dc/controller/moves/moves.js
  Purpose: Allows moving pieces, shows the list of moves.
  Author: Allan Goff
  Date: 4/27/26
  Recommended access: import * as cMoves from "../../controller/moves/moves.js";
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
// Seampoint: more imports...

// --- Globals ---
// Seampoint: more globals...

// --- UI ---
export function panelDispatch(payload) {
  // console.log("cntrl: moves.js - panelDispatch(payload):", payload);

  vGambits.cancelAnimation();

  const { action, 
    player,   // White|Black
    piece,    // R|B|D|Q|N|S|P|K
    src,      // K2,2
    dst,      // K4,4
    sec,      // QB5,6
    captured, // R|B|D|Q|N|S|P|K
    opts      // TBD?
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
    piece:    panel.querySelector('[name="move-piece"]')?.value,
    src:      panel.querySelector('[name="move-src"]')?.value,
    dst:      panel.querySelector('[name="move-dst"]')?.value,
    sec:      panel.querySelector('[name="move-2nd"]')?.value,
    captured: panel.querySelector('[name="move-capture"]')?.value,
    opts:     panel.querySelector('[name="move-opts"]')?.value,
  };
}

export function buildForward(entry) {     // Redo.
  console.log("cntrl: moves.js - buildForward(entry)", entry);

  const { action, turn, player, key, prev, next } = entry;

  (player === "White")
    ? document.querySelector('input[name="move-player"][value="Black"]').checked = true
    : document.querySelector('input[name="move-player"][value="White"]').checked = true;

  if(     action === "move") {
    // const { action, key, prev, post } = entry;
    // TODO: ForwardTask()
    setButtonState("state");
    vMoves.refreshPanel();   
    console.log("*** end of forward moves.");      
    }
  else if(action === "capture") {
    const { action, key, prev, post } = entry;
    // TODO: ForwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else if(action === "enpassant") {
    const { action, key, prev, post } = entry;
    // TODO: ForwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else if(action === "castle") {
    const { action, key, prev, post } = entry;
    // TODO: ForwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else if(action === "promote") {
    const { action, key, prev, post } = entry;
    // TODO: ForwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else if(action === "duke-decay") {
    const { action, key, prev, post } = entry;
    // TODO: ForwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else if(action === "bishop-decay") {
    const { action, key, prev, post } = entry;
    // TODO: ForwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else if(action === "fission") {
    const { action, key, prev, post } = entry;
    // TODO: ForwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else if(action === "teleportation") {
    const { action, key, prev, post } = entry;
    // TODO: ForwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else if(action === "uplift") {
    const { action, key, prev, post } = entry;
    // TODO: ForwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else {  // Seampoint: more buttons...
    throw new Error(`Unknown forward action ${action} for moves.`);
  }

  // diagnostic();
}

export function buildBackward(entry) {    // Undo.
  console.log("cntrl: moves.js - buildForward(entry)", entry);

  const { action, turn, player, key, prev, next } = entry;

  (player === "Black")
    ? document.querySelector('input[name="move-player"][value="Black"]').checked = true
    : document.querySelector('input[name="move-player"][value="White"]').checked = true;

  if(     action === "move") {
    // const { action, key, prev, post } = entry;
    // TODO: BackwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else if(action === "capture") {
    const { action, key, prev, post } = entry;
    // TODO: BackwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else if(action === "enpassant") {
    const { action, key, prev, post } = entry;
    // TODO: BackwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else if(action === "castle") {
    const { action, key, prev, post } = entry;
    // TODO: BackwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else if(action === "promote") {
    const { action, key, prev, post } = entry;
    // TODO: BackwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else if(action === "duke-decay") {
    const { action, key, prev, post } = entry;
    // TODO: BackwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else if(action === "bishop-decay") {
    const { action, key, prev, post } = entry;
    // TODO: BackwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else if(action === "fission") {
    const { action, key, prev, post } = entry;
    // TODO: BackwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else if(action === "teleportation") {
    const { action, key, prev, post } = entry;
    // TODO: BackwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else if(action === "uplift") {
    const { action, key, prev, post } = entry;
    // TODO: BackwardTask()
    setButtonState("state");
    vMoves.refreshPanel();         
    }
  else {  // Seampoint: more buttons...
    throw new Error(`Unknown backward action ${action} for moves.`);
  }
    vMoves.refreshPanel();         

  // diagnostic();
}

function setButtonState(state) {
  console.log("cntrl: moves.js - setButtonState(state)", state);

}

// Seampoint: more global functions...

// --- Handle Functions ---
function handleMove(payload) {
  console.log("cntrl: moves.js - handleMove(payload)", payload);

  const { action, player, piece, src, dst, sec, captured, opts } = payload;  // Informative.
  const selections = cSelections.getSelections();

  const entry = mMoves.makeMoveEntry(selections, payload);

  performMove(entry);

  applyEntry(entry);
  }

function handleCapture(payload) {
  console.log("cntrl: moves.js - handleCapture(payload)", payload);

  const { player, piece, src, dst, sec, captured, opts } = payload;  // Informative.

  // TODO: change state - handleCapture().
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
function performMove(entry) {
  console.log("cntrl: moves.js - performMove(entry)", entry);

  let { action, turn, player, key, prev, post } = entry;

  const boardSpec = cSetup.getCurrBoard().boardSize;

  const [, dstStr] = post.split("@");
  const dstTile = coords.normalizeTileToVts(dstStr, boardSpec);

  const { ok, err } = mPieces.movePieceTileToTile(key, dstStr);
  if(!ok) return { ok, err };

  (player === "White")
    ? document.querySelector('input[name="move-player"][value="Black"]').checked = true
    : document.querySelector('input[name="move-player"][value="White"]').checked = true;

  console.log("*** pieceList", mPieces.getPieceList());
  console.log("*** occupancy", mBoards.getBoardOccupancy());
}

function performCapture(selections, payload) {
  console.log("cntrl: moves.js - performCapture(selections, payload)", selections, payload);

  }

function performEnPassant(selections, payload) {
  console.log("cntrl: moves.js - performEnPassant(selections, payload)", selections, payload);

  }

function performCastle(selections, payload) {
  console.log("cntrl: moves.js - performCastle(selections, payload)", selections, payload);

  }

function performPromote(selections, payload) {
  console.log("cntrl: moves.js - performPromote(selections, payload)", selections, payload);

  }

function performDukeDecay(selections, payload) {
  console.log("cntrl: moves.js - performDukeDecay(selections, payload)", selections, payload);

  }

function performBishopDecay(selections, payload) {
  console.log("cntrl: moves.js - performBishopDecay(selections, payload)", selections, payload);

  }

function performFission(selections, payload) {
  console.log("cntrl: moves.js - performFission(selections, payload)", selections, payload);

  }

function performTeleportation(selections, payload) {
  console.log("cntrl: moves.js - performTeleportation(selections, payload)", selections, payload);

  }

function performUplift(selections, payload) {
  console.log("cntrl: moves.js - performUplift(selections, payload)", selections, payload);

}

function applyEntry(entry) {
  console.log("cntrl: moves.js - applyEntry(entry)", entry);

  const currEntry = state.fetchCurrentState("Moves"); // Clear previous move.
  if(currEntry != null) {
    // vMoves.clear(currEntry);
    if(!state.isAtEnd("Moves")) {     // Branches the undo history, discards original branch.
      // TODO: clear all later move entries.
      // const idx = state.getCurrentIndex("Moves"); // Not quite working...
      // state.truncateState("Moves", idx);
    }
  }

  state.pushNewMove(entry);           // Change state.
  vMoves.pushPanelLine(entry);        // Add line to panel.

  // TODO: remove all entries in the downstream buffers; 
  // a new move invalidates gambits and advsqs.
}
// Seampoint: more local functions...

/* TODO: QC checklist✅ 
    1. Write handle routines.
    2. Branch.
    3. Remove all downstream buffers.
    4. Write the forward functions.
    5. Write the backward functions.
*/

