/* File: moves.js
  Path: ./3dc/controller/moves/moves.js
  Purpose: Allows moving pieces, shows the list of moves.
  Author: Allan Goff
  Date: 4/27/26
  Recommended access: import * as cMoves from ""../../controller/moves/moves.js";
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

// --- Build upon previous layers ---
  import * as game     from "../../controller/game/game.js";

  import * as state    from "../../model/state/state.js";
  import * as mMoves   from "../../model/moves/moves.js";
  import * as coords   from "../../foundation/coords/coords.js";  // normalizeTileToVts().
  import * as quads    from "../../geometry/quads/quads.js";

  import * as vMoves   from "../../view/moves/moves.js";
  import * as vGambits from "../../view/gambits/gambits.js";
// Seampoint: more imports...

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
    case "move":         handleMove(payload); break;
    case "capture":      handleCapture(payload); break;
    case "enpassant":    handleEnpassant(payload); break;
    case "castle":       handleCastle(payload); break;
    case "promote":      handlePromote(payload); break;
    case "duke-decay":   handleDukeDecay(payload); break;
    case "bishop-decay": handleBishopDecay(payload); break;
    case "fission":      handleFission(payload); break;
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
// Seampoint: more global functions...

// --- Handle Functions ---
function handleMove(payload) {
  console.log("cntrl: moves.js - handleMove(payload)", payload);

  const { action, player, piece, src, dst, sec, captured, opts } = payload;  // Informative.

  const entry = mMoves.makeEntry(payload);  // Create entry.
  applyEntry(entry);
  }

function handleCapture(payload) {
  console.log("cntrl: moves.js - handleCapture(payload)", payload);
  // TODO: change state - handleCapture().
  }

function handleEnpassant(payload) {
  console.log("cntrl: moves.js - handleEnpassant(payload)", payload);
  // TODO: change state - handleEnpassant().
  }

function handleCastle(payload) {
  console.log("cntrl: moves.js - handleCastle(payload)", payload);
  // TODO: change state - handleCastle().
  }

function handlePromote(payload) {
  console.log("cntrl: moves.js - handlePromote(payload)", payload);
  // TODO: change state - handlePromote().
  }

function handleDukeDecay(payload) {
  console.log("cntrl: moves.js - handleDukeDecay(payload)", payload);
  // TODO: change state - handleDukeDecay().
  }

function handleBishopDecay(payload) {
  console.log("cntrl: moves.js - handleBishopDecay(payload)", payload);
  // TODO: change state - handleBishopDecay().
  }

function handleFission(payload) {
  console.log("cntrl: moves.js - handleFission(payload)", payload);
  // TODO: change state - handleFission().
}
// Seampoint: more handle functions...

// --- Helpers...
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
  vMoves.render(entry);               // Render.
  vMoves.pushPanelLine(entry);        // Add line to panel.

  // TODO: remove all entries in the downstream buffers; 
  // a new move invalidates gambits and advsqs.
}

// Seampoint: more local functions...

