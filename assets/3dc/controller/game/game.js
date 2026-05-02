/* File: game.js
  Path: ./3dc/game/game.js
  Purpose: Game control, including undo.
  Author: Allan Goff
  Date: 4/22/26
  Recommended access: import * as game.
  UI: the export functions.
*/

// --- Load JSON ---
import gameData from "./game.json" assert { type: "json" };
  const gameModule = gameData.game_module;
  const category  = gameModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as cGambits from "../../controller/gambits/gambits.js";

  import * as state    from "../../model/state/state.js";

  import * as boards   from "../../view/boards/boards.js";
  import * as vAdvsqs  from "../../view/advsqs/advsqs.js";
  import * as vGambits from "../../view/gambits/gambits.js";
// Seampoint: more imports...

// --- UI ---
export function panelDispatch(payload) {
  // console.log("cntrl: game.js - panelDispatch(payload):", payload);

  vGambits.cancelAnimation();

  const { action } = payload;
  switch (action) {
    case "newGame": handleNewGame(); break;
    case "undo":    handleUndo(); break;
    case "redo":    handleRedo(); break;
    case "rewind":  handleRewind(); break;
    case "forward": handleFastForward(); break;
    case "load":    handleLoad(); break;
    case "save":    handleSave(); break;
    default: throw new Error(`Unknown game ***action ${action}.`);  break;
  }
  }

export function showUndoStatus() {  // Show undo buffers in Game panel.
  console.log("cntrl: game.js - showUndoStatus():");

  const el = document.getElementById("undo-state");

  const keys = state.getStateKeys();
  const undo = state.getBufferIndex();

  const text = keys
    .map((key) => {
      const i   = undo[key];
      const max = state.getBufferLength(key);
      return `${key.padEnd(7)} ${i}/${max}`;
    })
    .join("\n");

  el.textContent = text;
}
// Seampoint: more global functions...

// --- Handle Functions ---
function handleNewGame() {
  console.log("cntrl: game.js - handleNewGame()");
  // TODO: game.js - handleNewGame().
  }

function handleUndo() {
  const keyIndex = state.prevKeyIndex();

  if(!keyIndex) { // Edge case, blank canvas, "Bottom Sentry".
    console.log("Bottom Sentry");
    vAdvsqs.clearAdvsq();
    // clear other buffers.
    boards.clearBoard();
    showUndoStatus();
    return;
  }

  if(keyIndex.arrayKey === "AdvSqs") {
    vAdvsqs.clearAdvsq();
    const specs = state.fetchCurrentState("AdvSqs");
    if(specs) {
      vAdvsqs.makeAdvsq(specs);
      vAdvsqs.setAdvsqPanelParams(specs);
    }
    }
  else if(keyIndex.arrayKey === "Gambits") {
    vAdvsqs.clearAdvsq();

    vGambits.refreshPanel();

    const count = state.getBufferIndex().Gambits;
    const idx = count; // first "future" item

    const group = cGambits.getGambitGroup(idx);
    if (group) {
      vGambits.derenderGambit(group);
    }
    }
  else if(keyIndex.arrayKey === "Moves") {
    vAdvsqs.clearAdvsq();
    // clear gambits.
    }
  else if(keyIndex.arrayKey === "Setup") {
    boards.clearBoard();
    // clear gambits.
    // clear moves.
    const specs = state.fetchCurrentState("Setup");
    console.log("specs", specs);
    if(specs) {
      boards.makeSetup(specs);
    }
    showUndoStatus();  // Show undo status in the panel.
    }
  else { throw new Error("Unknown undo buffer:", keyIndex.arrayKey);
  }

  showUndoStatus();
  }

function handleRedo() {
  const keyIndex = state.nextKeyIndex();

  if(!keyIndex) {   // Edge case, at latest,= "Top Sentry"
    console.log("Top Sentry");
    return;
  }

  if(keyIndex.arrayKey === "Setup") {
    const specs = state.fetchCurrentState("Setup");
    boards.clearBoard(specs);
    if(specs) {
      boards.makeSetup(specs);
    }
    }
  else if(keyIndex.arrayKey === "Moves") {
    const specs = state.fetchCurrentState("Moves");
    // TODO: clear Moves.
    }
  else if(keyIndex.arrayKey === "Gambits") {
    const specs = state.fetchCurrentState("Gambits");
    // TODO: clear Gambits.

    vGambits.refreshPanel();

    const count = state.getBufferIndex().Gambits;
    const idx = count - 1; // newly active item

    const group = cGambits.getGambitGroup(idx);
    if (group) {
      vGambits.renderGambit(group); // Default animation is false.
    }
    }
  else if(keyIndex.arrayKey === "AdvSqs") {
    const specs = state.fetchCurrentState("AdvSqs");
    vAdvsqs.clearAdvsq();
    if(specs) {
      vAdvsqs.makeAdvsq(specs);
      vAdvsqs.setAdvsqPanelParams(specs);
    }
    }
  else { throw new Error("Unknown undo buffer:", keyIndex.arrayKey);
  }

  showUndoStatus();
  }

function handleRewind() {
  console.log("cntrl: game.js - handleRewind()");

  const keyIndex = state.collapseKeyIndex();

  if (!keyIndex) { // Bottom Sentry
    console.log("Bottom Sentry");
    vAdvsqs.clearAdvsq();
    boards.clearBoard();
    showUndoStatus();
    return;
  }

  if (keyIndex.arrayKey === "AdvSqs") {
    vAdvsqs.clearAdvsq();
    const specs = state.fetchCurrentState("AdvSqs");
    if (specs) {
      vAdvsqs.makeAdvsq(specs);
      vAdvsqs.setAdvsqPanelParams(specs);
    }
    }
  else if (keyIndex.arrayKey === "Gambits") {
    vAdvsqs.clearAdvsq();
    state.setBufferIndex("AdvSqs", 0);
    cGambits.rerunGambits();
    }
  else if (keyIndex.arrayKey === "Moves") {
    vAdvsqs.clearAdvsq();
    // TODO: clear gambits if implemented
    }
  else if (keyIndex.arrayKey === "Setup") {
    boards.clearBoard();
    const specs = state.fetchCurrentState("Setup");
    if (specs) {
      boards.makeSetup(specs);
    }
    }
  else {
    throw new Error("Unknown rerun buffer:", keyIndex.arrayKey);
  }

  showUndoStatus();  
  }

function handleFastForward() {
  console.log("cntrl: game.js - handleFastForward()");

  const counts = state.getBufferIndex();

  let startKey = null;

  if (counts.AdvSqs > 0) startKey = "AdvSqs";
  else if (counts.Gambits > 0) startKey = "Gambits";
  else if (counts.Moves > 0) startKey = "Moves";
  else if (counts.Setup > 0) startKey = "Setup";

  if (!startKey) return;

  let keyIndex;

  while (true) {
    keyIndex = state.nextKeyIndex();
    if (!keyIndex) break;

    // --- APPLY SAME LOGIC AS handleRedo ---
    if (keyIndex.arrayKey === "Setup") {
      const specs = state.fetchCurrentState("Setup");
      boards.clearBoard();
      if (specs) {
        boards.makeSetup(specs);
        cGambits.rebindOverlaysToBoard();
      }
      // if (specs) boards.makeBoard(specs);
      }
    else if (keyIndex.arrayKey === "Moves") {
      const specs = state.fetchCurrentState("Moves");
      // TODO: fastforward moves.
      }
    else if (keyIndex.arrayKey === "Gambits") {
      vGambits.refreshPanel();

      const count = state.getBufferIndex().Gambits;
      const idx = count - 1;

      const group = cGambits.getGambitGroup(idx);
      if (group) {
        vGambits.renderGambit(group);
      }
      }
    else if (keyIndex.arrayKey === "AdvSqs") {
      const specs = state.fetchCurrentState("AdvSqs");
      vAdvsqs.clearAdvsq();
      if (specs) {
        vAdvsqs.makeAdvsq(specs);
        vAdvsqs.setAdvsqPanelParams(specs);
      }
      }

    else {
      throw new Error("Unknown buffer:", keyIndex.arrayKey);
    }

    // --- STOP when we hit next buffer ---
    if (keyIndex.arrayKey !== startKey) break;
  }

  showUndoStatus();
  }

function handleLoad() {
  console.log("cntrl: game.js - handleLoad()");
  // TODO: game.js - handleLoad().

  // Dev/Debug code - temporary.
  console.log("cntrl: game.js... getStateKeys()", state.getStateKeys());
  console.log("cntrl: game.js... getBufferIndex()", state.getBufferIndex());
  console.log("cntrl: game.js... getState()", state.getState());
  console.log("cntrl: game.js... getNull()", state.getNull());
  }

function handleSave() {
  console.log("cntrl: game.js - handleSave()");

  let idx = 0;

  idx = state.getBufferIndex()["Setup"]; 
  const currSetup = state.fetchCurrentSetup();
  console.log("cntrl: game.js - handleSave(currSetup) ", idx, currSetup);

  idx = state.getBufferIndex()["Moves"]; 
  const currMove = state.fetchCurrentMove();
  console.log("cntrl: game.js - handleSave(currMove)  ", idx, currMove);

  idx = state.getBufferIndex()["Gambits"]; 
  const currGambit = state.fetchCurrentGambit();
  console.log("cntrl: game.js - handleSave(currGambit)", idx, currGambit);

  idx = state.getBufferIndex()["AdvSqs"]; 
  const currAdvsq = state.fetchCurrentAdvsq();
  console.log("cntrl: game.js - handleSave(currAdvsq) ", idx, currAdvsq);
  
  // TODO: game.js - handleSave().
  }
// Seampoint: more handle functions...

// --- Helpers ---
// Seampoint: more local functions...

