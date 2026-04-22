/* File: setup.js
  Path: ./3dc/setup/setup.js
  Purpose: Controller code to setup board and trays.
  Author: Allan Goff
  Date: 4/22/26
  Recommended access: import * as setup.
  UI: the export functions.
*/

// --- Load JSON ---
import setupData from "./setup.json" assert { type: "json" };
  const setupModule = setupData.setup_module;
  const category  = setupModule.category;
  // Seampoint: more objects.

// --- Build upon previous layers ---
import * as state from "../../model/state/state.js";
import * as game  from          "../game/game.js";
// Seampoint: more imports.

// --- UI ---
export function panelDispatch(payload) {    // Dispatch payload from panel to handle event functions.
  const { action, 
    boardSize,  // 8x8x8|10x8x8|10x10x10.
    play,       // Off|rules|puzzle.
    trayType,   // Real|factory.
    visible,    // True|False.
    gap,        // 0|1|2|3.
    initialPos  // std|manual.
  } = payload;

  switch (action) {
    case "makeBoard":   handleMakeBoard(payload); break;
    case "showTrays":   handleShowTrays(payload.visible); break;
    case "hideTrays":   handleHideTrays(payload.visible); break;
    case "updateParam": handleTrayGap(payload); break;
    default: throw new Error(`Unknown setup action ${action}.`);
  }
  }
// Seampoint: more global functions.

// --- Handle Functions ---
function handleMakeBoard(payload) { // Setup handler.
  console.log("control: game.js - handleMakeBoard(payload):", payload);

  const { action, boardSize, play, trayType, visible, gap, initialPos } = payload;

  state.setup(payload);  // Command to change state.
  game.showUndoStatus();  // Show undo status in the panel.
  }

function handleShowTrays(visible) {
  console.log("control: game.js - handleShowTrays(visible):", visible);
  // TODO: change state.
  game.showUndoStatus();  // Show undo status in the panel.
  }

function handleHideTrays(visible) {
  console.log("control: game.js - handleHideTrays(visible):", visible);
  // TODO: change state.
  game.showUndoStatus();  // Show undo status in the panel.
  }

function handleTrayGap(payload) {
  console.log("control: game.js - handleTrayGap(payload):", payload);

  const { action, boardSize, play, trayType, visible, gap, initialPos } = payload;

  // TODO: change state.
  game.showUndoStatus();  // Show undo status in the panel.
}
// Seampoint: more local functions.

