/* File: moves.js
  Path: ./3dc/controller/moves/moves.js
  Purpose: Allows moving pieces.
  Author: Allan Goff
  Date: 4/27/26
  Recommended access: import * as cMoves from ../../controller/moves/moves.js
  UI: the export functions.
*/

// --- Load JSON ---
import movesData from "./moves.json" assert { type: "json" };
  const movesModule = movesData.moves_module;
  const category  = movesModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as game     from "../../controller/game/game.js";

  import * as state    from "../../model/state/state.js";
  import * as quads    from "../../geometry/quads/quads.js";

  import * as vMoves   from "../../view/moves/moves.js";
  import * as vGambits from "../../view/gambits/gambits.js";
// Seampoint: more imports...

// --- UI ---
export function panelDispatch(payload) {
  console.log("cntrl: moves.js - panelDispatch(payload):", payload);

  vGambits.cancelAnimation();

  const { action } = payload;
  switch (action) {
    case "move":      handleMove(payload); break;
    case "capture":   handleCapture(payload); break;
    case "castle":    handleCastle(payload); break;
    case "enpassant": handleEnpassant(payload); break;
    case "promote":   handlePromote(payload); break;
    default: throw new Error(`Unknown moves action ${action}.`);  break;
  }

  game.showUndoStatus();                          // Update game panel (undo).
}
// Seampoint: more global functions...

// --- Handle Functions ---
function handleMove(payload) {
  console.log("cntrl: moves.js - handleMove()");
  // TODO: change state - handleMove().

  const move = {};
  
  state.pushNewMove(move);                        // Change state.

  vMoves.renderMove(move);                        // Render.
  vMoves.updatePanel(move);                       // Update panel.
  }

function handleCapture(payload) {
  console.log("cntrl: moves.js - handleCapture(payload)"), payload;
  // TODO: change state - handleCapture().
  }

function handleCastle(payload) {
  console.log("cntrl: moves.js - handleCastle(payload)", payload);
  // TODO: change state - handleCastle().
  }

function handleEnpassant(payload) {
  console.log("cntrl: moves.js - handleEnpassant(payload)", payload);
  // TODO: change state - handleEnpassant().
  }

function handlePromote(payload) {
  console.log("cntrl: moves.js - handlePromote(payload)", payload);
  // TODO: change state - handlePromote().
  }

// Seampoint: more handle functions...

// --- Helpers...
// Seampoint: more local functions...

