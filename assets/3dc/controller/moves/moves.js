/* File: moves.js
  Path: ./3dc/controller/moves/moves.js
  Purpose: Allows moving pieces, shows the list of moves.
  Author: Allan Goff
  Date: 4/27/26
  Recommended access: import * as cMoves from ../../controller/moves/moves.js
  UI: the export functions.
*/

// --- Load JSON ---
import movesData from "./moves.json" assert { type: "json" };
  const movesModule = movesData.moves_module;
  // const category  = movesModule.category;
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

  const { action } = payload;
  switch (action) {
    case "move":         handleMove(payload); break;
    case "capture":      handleCapture(payload); break;
    case "enpassant":    handleEnpassant(payload); break;
    case "castle":       handleCastle(payload); break;
    case "promote":      handlePromote(payload); break;
    case "duke-decay":   handleDukeDecay(payload); break;
    case "bishop-decay": handleBishopDecay(payload); break;
    case "fission":      handleFission(payload); break;
    default: throw new Error(`Unknown moves action ${action}.`);  break;
  }

  game.showUndoStatus();                          // Update game panel (undo).
}
// Seampoint: more global functions...

// --- Handle Functions ---
function handleMove(payload) {
  console.log("cntrl: moves.js - handleMove(payload)", payload);
  // TODO: change state - handleMove().

  const index = state.getBufferIndex()["Moves"] + 1;
  const entry = mMoves.createState(payload, index); // Index is used to determine the turn.
  state.pushNewMove(entry);         // Change state.

  vMoves.renderMove(entry);         // Render.
  vMoves.addLineToPanel(entry);        // Update panel.
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
export function normalize(payload) { // Convert panel strings to vts arrays.
  let { player, piece, src, dst, capture, sec, opts } = payload;   // Unpack panel fields.

  src = src ? coords.normalizeTileToVts(src) : null;
  dst = dst ? coords.normalizeTileToVts(dst) : null;
  sec = sec ? coords.normalizeTileToVts(sec) : null;

  const normed = { player, piece, src, dst, capture, sec, opts }; // Repack panel fields.

  return normed;
  }
// Seampoint: more local functions...

