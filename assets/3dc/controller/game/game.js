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
  // Seampoint: more objects.

// --- Build upon previous layers ---
import * as state  from "../../model/state/state.js";
import * as advsqs from "../../view/advsqs/advsqs.js";
import * as boards from "../../view/boards/boards.js";
// Seampoint: more imports.

// --- UI ---
export function panelDispatch(payload) {
  // console.log("control: game.js - panelDispatch(payload):", payload);

  const { action } = payload;
  switch (action) {
    case "newGame": handleNewGame(); break;
    case "rerun":   handleRerun(); break;
    case "undo":    handleUndo(); break;
    case "redo":    handleRedo(); break;
    case "load":    handleLoad(); break;
    case "save":    handleSave(); break;
    default: throw new Error(`Unknown game ***action ${action}.`);  break;
  }
  }
// Seampoint: more global functions.

// --- Handle Functions ---
function handleNewGame() {
  console.log("control: game.js - handleNewGame()");
  // TODO: code game.js - handleNewGame().
}

function handleRerun() {
  // console.log("currIndex", state.currentKeyIndex());
  // console.log("prevIndex", state.prevKeyIndex());
  console.log("currentKeyAndIndex", state.currentKeyAndIndex());
  
}

function handleRerun3() {
  while (stepBack()) {
    // keep stepping
  }

  finalizeRender();
  }
function stepBack() {
  const before = state.currentKeyIndex();

  const step = state.prevKeyIndex();
  if (!step) return false;

  const after = state.currentKeyIndex();

  if (crossedBuffer(before, after)) {
    handleBoundaryCross(before.arrayKey);
  }

  return true;
  }
function crossedBuffer(before, after) {
  return before.arrayKey !== after.arrayKey;
  }
function handleBoundaryCross(fromKey) {
  switch (fromKey) {
    case "AdvSqs":
      state.setUndoIndex("AdvSqs", 0);   // 🔥 erase buffer
      advsqs.clearAdvsq();               // minimal view update
      break;

    case "Gambits":
      state.setUndoIndex("Gambits", 0);
      // gambits.clear();
      break;

    case "Moves":
      state.setUndoIndex("Moves", 0);
      // moves.clear();
      break;
  }
  }
function finalizeRender() {
  const { arrayKey } = state.currentKeyIndex();

  switch (arrayKey) {
    case "AdvSqs":
      renderAdvsq();
      break;

    case "Setup":
      // nothing to clear; already base
      break;
  }
  }

function handleRerun2() {
  console.log("control: game.js - handleRerun()");

  const order = ["AdvSqs", "Gambits", "Moves", "Setup"];
  const curr = state.currentKeyIndex();
  let { arrayKey, index } = curr;

  const k = order.indexOf(arrayKey);

  if (arrayKey === "Sentry") {
    // nothing left → clear everything
    advsqs.clearAdvsq();
    showUndoStatus();
    return;
  }

  if (index > 0) {
    // collapse current buffer
    state.setUndoIndex(arrayKey, 1);

    // 🔥 CRITICAL: clear all higher buffers
    state.clearHigherBuffers(arrayKey);
  }
  else {
    // fall back to lower-priority buffers
    let found = false;

    for (let j = k + 1; j < order.length; j++) {
      const key = order[j];
      const i = state.getUndoIndex()[key];

    if (i > 0) {
      const max = state.getBufferLength(key);
      state.setUndoIndex(key, max);
      // state.setUndoIndex(key, 0);
      state.clearHigherBuffers(key);   // 🔥 required
      arrayKey = key;
      found = true;
      break;
    }
    }

    if (!found) {
      // full reset
      state.setUndoIndex("Setup", 0);
      advsqs.clearAdvsq();
      showUndoStatus();
      return;
    }
  }

  // --- render (same pattern as undo/redo) ---
  if (arrayKey === "AdvSqs") {
    const specs = state.fetchFromIndex("AdvSqs");

    advsqs.clearAdvsq();

    if (specs) {
      advsqs.makeAdvsq(specs);
      advsqs.setAdvsqPanelParams(specs);
    }
  }

  showUndoStatus();
  }

function handleRerun1() {
  console.log("control: game.js - handleNewGame()");
  // TODO: code game.js - handleNewGame().
}

function handleUndo() {
  const keyIndex = state.prevKeyIndex();

  if(!keyIndex) { // Edge case, blank canvas.
    console.log("Bottom Sentry");
    advsqs.clearAdvsq();
    // clear other buffers.
    boards.clearBoard();
    showUndoStatus();
    return;
  }

  if(keyIndex.arrayKey === "AdvSqs") {
    advsqs.clearAdvsq();
    const specs = state.fetchFromIndex("AdvSqs");
    if(specs) {
      advsqs.makeAdvsq(specs);
      advsqs.setAdvsqPanelParams(specs);
    }
    }
  else if(keyIndex.arrayKey === "Gambits") {
    advsqs.clearAdvsq();
    }
  else if(keyIndex.arrayKey === "Moves") {
    advsqs.clearAdvsq();
    // clear gambits.
    }
  else if(keyIndex.arrayKey === "Setup") {
    boards.clearBoard();
    // clear gambits.
    // clear moves.
    const specs = state.fetchFromIndex("Setup");
    console.log("specs", specs);
    if(specs) {
      boards.makeBoard(specs);
    }

    state.setup(specs);  // Command to change state.
    showUndoStatus();  // Show undo status in the panel.

  }
  else {
    advsqs.clearAdvsq();
    // clear gambits.
    // clear moves.
    boards.clearBoard();
  }

  showUndoStatus();

  // if (keyIndex.arrayKey === "AdvSqs") {
    //   const specs = state.fetchFromIndex("AdvSqs");

    //   // 🔥 critical: clear first
    //   // advsqs.clearAdvsq();

    //   if (specs) {
    //     advsqs.makeAdvsq(specs);
    //     advsqs.setAdvsqPanelParams(specs);
    //   }
    // }

    // showUndoStatus();
  }

function handleRedo() {
  const keyIndex = state.nextKeyIndex();

  if(!keyIndex) {
    console.log("Top Sentry");
    return;
  }

  if(keyIndex.arrayKey === "Setup") {
    const specs = state.fetchFromIndex("Setup");
      boards.clearBoard(specs);
    if(specs) {
      boards.makeBoard(specs);
    }
  }
  else if(keyIndex.arrayKey === "Moves") {
  }
  else if(keyIndex.arrayKey === "Gambits") {
  }
  else if(keyIndex.arrayKey === "AdvSqs") {
    const specs = state.fetchFromIndex("AdvSqs");
    advsqs.clearAdvsq();
    if(specs) {
      advsqs.makeAdvsq(specs);
      advsqs.setAdvsqPanelParams(specs);
    }
  }

  if (keyIndex.arrayKey === "AdvSqs") {
    // const specs = state.fetchFromIndex("AdvSqs");

    // advsqs.clearAdvsq();

    // if (specs) {
    //   advsqs.makeAdvsq(specs);
    //   advsqs.setAdvsqPanelParams(specs);
    // }
  }

  showUndoStatus();
  }

function handleLoad() {
  console.log("control: game.js - handleLoad()");
  // TODO: code game.js - handleLoad().
  }

function handleSave() {
  console.log("control: game.js - handleSave()");
  // TODO: code game.js - handleSave().
  const lastState = state.fetchCurrentSetup();  // Temp: being used for undo feedback, not button's intended purpose.
  const index = state.getUndoIndex(); // All of them.
  const setupIndex = index.Setup;     // Just the setup index
  console.log("Current Setup Undo:", setupIndex, lastState);
  }
// Seampoint: more global functions.

// --- Helpers ---
export function showUndoStatus() {
  const el = document.getElementById("undo-state");

  const keys = state.getStateKeys();
  const undo = state.getUndoIndex();

  const text = keys
    .map((key) => {
      const i   = undo[key];
      const max = state.getBufferLength(key);
      return `${key.padEnd(7)} ${i}/${max}`;
    })
    .join("\n");

  el.textContent = text;
}
// Seampoint: more local functions.

