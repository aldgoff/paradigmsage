/* File: setup.js
  Path: ./3dc/setup/setup.js
  Purpose: Controller code to setup board and trays.
  Author: Allan Goff
  Date: 4/22/26
  Recommended access: import * as cSetup from ../../control/setup/setup.js
  UI: the export functions.
  Philosophy: Dlete a module by deleting its directory - not so much.
    controller/ model/ view/
    play.md - DOM
    main.js - regressions
    view.js - wire, build payload
    game.js - rewind, FF
    state.js - undo, redo
*/

// --- Load JSON ---
import setupData from "./setup.json" assert { type: "json" };
  const setupModule = setupData.setup_module;
  const category  = setupModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as game     from "../../controller/game/game.js";

  import * as state    from "../../model/state/state.js";
  import * as mSetup   from "../../model/setup/setup.js";

  import * as boards   from "../../view/boards/boards.js";
  import * as vSetup   from "../../view/setup/setup.js";
  import * as vGambits from "../../view/gambits/gambits.js";
// Seampoint: more imports...

// --- UI ---
export function panelDispatch(payload) {    // Dispatch payload from panel to handle event functions.
  // console.log("cntrl: setup.js - panelDispatch(payload):", payload);

  vGambits.cancelAnimation();

  const { action, 
    boardSize,  // 8x8x8|10x8x8|10x10x10.
    trayType,   // Real|factory.
    initialPos, // std|manual.
    play,       // Off|rules|puzzle. TODO: future|deprecate
    visible,    // True|False. TODO: future|deprecate
    gap,        // 0|1|2|3. TODO: future|deprecate
  } = payload;

  switch (action) {
    case "makeBoard":   handleMakeBoard(payload); break;
    case "showTrays":   handleShowTrays(payload.visible); break;
    case "hideTrays":   handleHideTrays(payload.visible); break;
    case "updateParam": handleTrayGap(payload); break;
    default: throw new Error(`Unknown setup action ${action}.`);
  }

  game.showUndoStatus();                          // Update game panel (undo).
  }

export function buildPayload(panel, action) {
  console.log("     ---------- cntrl: setup.js");
  return {
    action,
    boardSize:  panel.querySelector('input[name="board-size"]:checked')?.value,
    trayType:   panel.querySelector('input[name="tray-type"]:checked')?.value,
    initialPos: panel.querySelector('input[name="initial-pos"]:checked')?.value,
  };
  }

// Seampoint: more global functions...

// --- Handle Functions ---
function handleMakeBoard(payload) { // Setup handler.
  console.log("control: game.js - handleMakeBoard(payload):", payload);

  const { action, boardSize, trayType, initialPos } = payload;  // Informative.

  const nextEntry = mSetup.makeEntry(payload);    // Transform panel payload into state entry.
  applyEntry(nextEntry);
}

function handleShowTrays(visible) {
  console.log("control: game.js - handleShowTrays(visible):", visible);
  // TODO: change state - handleShowTrays().
  }

function handleHideTrays(visible) {
  console.log("control: game.js - handleHideTrays(visible):", visible);
  // TODO: change state - handleHideTrays()
  }

function handleTrayGap(payload) {
  console.log("control: game.js - handleTrayGap(payload):", payload);

  const { action, boardSize, play, trayType, visible, gap, initialPos } = payload;

  // TODO: change state - handleTrayGap().
}

// --- Helpers ---
function applyEntry(entry) {
  console.log("cntrl: setup.js - applyEntry(entry)", entry);

  const currEntry = mSetup.fetchCurrentEntry(); // Clear previous board.
  if(currEntry != null) {
    vSetup.clear(currEntry);
    if(!state.isAtEnd("Setup")) {     // Branches the undo history, discards original branch.
      // TODO: clear all later setup entries.
      // const idx = state.getCurrentIndex("Setup"); // Not quite working...
      // state.truncateState("Setup", idx);
    }
  }

  state.pushNewSetup(entry);          // Log state change in undo buffer.
  vSetup.render(entry);               // Render the new board and trays.
  vSetup.refreshPanel(entry);         // Only needed by panels with derived fields.

  // TODO: remove all entries in the downstream buffers; 
  // a new board invalidates moves, gambits, and advsqs.
}
// Seampoint: more local functions...

