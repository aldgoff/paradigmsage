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
// Seampoint: more objects...

// --- Build upon previous layers ---
import * as game   from "../../controller/game/game.js";
import * as state from "../../model/state/state.js";
import * as boards from "../../view/boards/boards.js";
import * as vGambits from "../../view/gambits/gambits.js";
// Seampoint: more imports...

// --- UI ---
export function panelDispatch(payload) {    // Dispatch payload from panel to handle event functions.
  // console.log("cntrl: setup.js - panelDispatch(payload):", payload);

  vGambits.cancelAnimation();

  const { action, 
    boardSize,  // 8x8x8|10x8x8|10x10x10.
    play,       // Off|rules|puzzle.
    trayType,   // Real|factory.
    visible,    // True|False.
    gap,        // 0|1|2|3.
    initialPos  // std|manual.
  } = payload;
  console.log("control: setup.js - panelDispatch(payload)", payload);

  switch (action) {
    case "makeBoard":   handleMakeBoard(payload); break;
    case "showTrays":   handleShowTrays(payload.visible); break;
    case "hideTrays":   handleHideTrays(payload.visible); break;
    case "updateParam": handleTrayGap(payload); break;
    default: throw new Error(`Unknown setup action ${action}.`);
  }
  }
// Seampoint: more global functions...

// --- Handle Functions ---
function handleMakeBoard(payload) { // Setup handler.
  console.log("control: game.js - handleMakeBoard(payload):", payload);

  const { action, boardSize, play, trayType, visible, gap, initialPos } = payload;

  state.pushNewSetup(payload);           // Log state change in undo buffer.
  boards.makeSetup(payload);             // Render.
  // Need to update state buffers.
  // Need to update setup panel.
  }

function handleShowTrays(visible) {
  console.log("control: game.js - handleShowTrays(visible):", visible);
  // TODO: change state - handleShowTrays().
  game.showUndoStatus();  // Show undo status in the panel.
  }

function handleHideTrays(visible) {
  console.log("control: game.js - handleHideTrays(visible):", visible);
  // TODO: change state - handleHideTrays()
  game.showUndoStatus();  // Show undo status in the panel.
  }

function handleTrayGap(payload) {
  console.log("control: game.js - handleTrayGap(payload):", payload);

  const { action, boardSize, play, trayType, visible, gap, initialPos } = payload;

  // TODO: change state - handleTrayGap().
  game.showUndoStatus();  // Show undo status in the panel.
}
// Seampoint: more local functions...

