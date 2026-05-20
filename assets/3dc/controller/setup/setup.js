/* File: setup.js
  Path: ./3dc/controller/setup/setup.js
  Purpose: Controller code to setup board and trays.
  Author: Allan Goff
  Date: 4/22/26
  Recommended access: import * as cSetup from "../../control/setup/setup.js";
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
  import * as mPieces  from "../../model/pieces/pieces.js";
  import * as mTrays   from "../../model/trays/trays.js";
  import * as mBoards  from "../../model/boards/boards.js";

  import * as boards   from "../../view/boards/boards.js";
  import * as vSetup   from "../../view/setup/setup.js";
  import * as vGambits from "../../view/gambits/gambits.js";
  import * as vViewer  from "../../view/viewer/viewer.js";
// Seampoint: more imports...

// --- Globals ---
const pieceList = {
  "white": { "ref": "abs", "pieces": [], "pawns": [] }, 
  "black": { "ref": "rel", "pieces": [], "pawns": [] }
};

// --- UI ---
export function panelDispatch(payload) {    // Dispatch payload from panel to handle event functions.
  // console.log("cntrl: setup.js - panelDispatch(payload):", payload);

  vGambits.cancelAnimation();

  const { action, 
    boardSize,  // 8x8x8|10x8x8|10x10x10.
    trayType,   // Real|factory.
    initialPos, // std|manual.
    pieceList,
  } = payload;

  switch (action) {
    case "makeBoard":   handleMakeBoard(payload); break;
    case "lock":        handleLock(payload); break;
    case "updateParam": break;
    default: throw new Error(`Unknown setup action ${action}.`);
  }

  game.showUndoStatus();                          // Update game panel (undo).
  }

export function buildPayload(panel, action) {
  console.log("     ---------- cntrl: setup.js");
  const initialPos = panel.querySelector('input[name="initial-pos"]:checked')?.value;
  const pos = (initialPos === "standard") ? "std" : "list";
  return {
    action,
    boardSize:  panel.querySelector('input[name="board-size"]:checked')?.value,
    trayType:   panel.querySelector('input[name="tray-type"]:checked')?.value,
    initialPos: pos,
    pieceList,
  };
}
// Seampoint: more global functions...

// --- Handle Functions ---
function handleMakeBoard(payload) { // Setup handler.
  console.log("cntrl: game.js - handleMakeBoard(payload):", payload);

  const { action, boardSize, trayType, initialPos } = payload;  // Informative.

  const entry = mSetup.makeEntry(payload);    // Transform panel payload into state entry.

  mTrays.init(entry);   // New Game (games.js) moves them from tray to board, play may begin.
  mBoards.init(entry);  // Initial occupancy depends on board size and tray type.
  mPieces.init(entry);  // Every piece is in a tray, none are on the board.

  applyEntry(entry);
  }

function handleLock(payload) {  // Locks initial pos after pieces manually moved from tray to board.
  console.log("cntrl: game.js - handleLock(payload):", payload);

  const { action, boardSize, trayType, initialPos, pieceList } = payload;  // Informative.

  const entry = mSetup.makeEntry(payload);    // Transform panel payload into state entry.

  mTrays.disableManualMode(entry);  // Players can no longer move pieces to/from trays, rules do that.

  state.pushNewSetup(entry);          // Log state change in undo buffer.
  vSetup.pushPanelLine(entry);        // Add line to panel.
  vSetup.refreshPanel(entry);         // Only needed by panels with derived fields.
}

// --- Helpers ---
function applyEntry(entry) {
  console.log("cntrl: setup.js - applyEntry(entry)", entry);

  const currEntry = state.fetchCurrentState("Setup"); // Clear previous board.
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
  vSetup.pushPanelLine(entry);        // Add line to panel.
  vSetup.refreshPanel(entry);         // Only needed by panels with derived fields.

  // TODO: remove all entries in the downstream buffers; 
  // a new board invalidates moves, gambits, and advsqs.
}
// Seampoint: more local functions...

