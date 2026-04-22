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
import * as state  from "../../model/state/state.js";
// Seampoint: more imports.

// --- UI ---
export function panelDispatch(payload) {    // Dispatch payload from panel to handle event functions.
  const { action, 
    boardSize,  // 8x8x8|10x8x8|10x10x10.
    play,       // Off|rules|puzzle.
    trays,      // Real|factory.
    visible,    // True|False.
    gap,        // 0|1|2|3.
    initialPos  // std|manual.
  } = payload;

  switch (action) {
    case "makeBoard": handleMakeBoard(payload.boardSize); break;
    case "makeTrays": handleMakeTrays(payload); break;
    case "showTrays": handleShowTrays(); break;
    case "hideTrays": handleHideTrays(); break;
    case "updateParam":   handleTrayGap(payload); break;
    case "cycleGap":  handleCycleGap(payload); break;
    default: throw new Error(`Unknown setup action ${action}.`);
  }
  }
// Seampoint: more global functions.

// --- Handle Functions ---
function handleMakeBoard(boardSize) { // Setup handler.
  console.log("control: game.js - handleMakeBoard(boardSize):", boardSize);
  const board = boardSize.split("x").map(n => Number(n));
  const newBoard = { "board": board, "play": "off", "trays": "none", "gap": 0, "initialPos": "std" };

  trimStateToUndoIndex();
  state.setup(newBoard);  // Command to change setup state.

  cloneStateHistory();
  }

function handleMakeTrays(payload) {   // Tray handlers.
  console.log("control: game.js - handleMakeTrays(payload):", payload);
  // TODO: change state.
  }

function handleShowTrays() {
  console.log("control: game.js - handleShowTrays():");
  // TODO: change state.
  }

function handleHideTrays() {
  console.log("control: game.js - handleHideTrays():");
  // TODO: change state.
  }

function handleCycleGap(payload) {
  console.log("control: game.js - handleCycleGap(payload):", payload);
  // TODO: change state.
}

function handleTrayGap(payload) {
  console.log("control: game.js - handleTrayGap(payload):", payload);
  // TODO: change state.
}
// Seampoint: more local functions.

