/* File: events.js
  Path: ./3dc/controller/events.js
  Purpose: Register functions with the view layer for callbacks.
  Author: Allan Goff
  Date: 4/07/26
  Recommended access: import * as events.
  UI: the export functions.
*/

import * as control  from "../controller/controller.js";
import * as setup    from "./setup/setup.js";
import * as game     from "./game/game.js";
import * as advsqs   from "./advsqs/advsqs.js";

import * as state    from "../model/state/state.js";
import * as coords   from "../foundation/coords/coords.js";
import * as quads    from "../geometry/quads.js";
import * as overlaps from "../geometry/overlapTiles.js";

import * as register from "../view/registerHandlers.js";
import * as boards   from "../view/boards/boards.js";
import * as view     from "../view/advsqs/advsqs.js";

// --- UI ---
export function callbacks() {
  // register.setupControlDispatcher(setupPanelDispatch);    // Make board.
  // register.gameControlDispatcher(gameButtonDispatch);     // Undo interface.
  register.setupControlDispatcher(setup.panelDispatch);    // Setup.
  register.gameControlDispatcher( game.panelDispatch);     // Undo interface.
  register.advsqControlDispatcher(advsqs.panelDispatch);   // Manipulate an advancement square.
  
  // register.trayControlDispatcher(trayPanelDispatch);      // Make tray
  
                                                          // Move panel is display only, no inputs.
  register.gambitControlDispatcher(gambitButtonDispatch); // Build a gambit.
  register.cameraControlDispatcher(cameraPanelDispatch);  // Not subject to the undo arch.
  // Seampoint - register another dispatcher.
}

function setupPanelDispatch(payload) {    // Dispatch payload from panel to handle event functions.
  console.log("control: events.js - setupPanelDispatch(payload):", payload);
  const { action, boardSize } = payload;
  switch (action) {
    case "makeBoard": handleMakeBoard(boardSize); break;
    default: throw new Error(`Unknown setup action ${action}.`);
  }
  }

function trayPanelDispatch(payload) {
  const { action, trayType } = payload;
  switch (action) {
    case "makeTrays": handleMakeTrays(trayType); break;
    case "showTray": handleShowTray(); break;
    case "hideTray": handleHideTray(); break;
    case "cycleGap": handleCycleGap(); break;
    default: throw new Error(`Unknown tray action ${action}.`);
  }
  }

function gameButtonDispatch(payload) {
  // console.log("gameButtonDispatch()", payload);
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

function gambitButtonDispatch(payload) {
  const { action } = payload;
  switch (action) {
    case "freeze": handleFreeze(); break;
    case "prev": handlePrev(); break;
    case "next": handleNext(); break;
    case "delete": handleDelete(); break;
    case "deselect": handleDeselect(); break;
    default: throw new Error(`Unknown gambit action ${action}.`);  break;
  }
  }

function cameraPanelDispatch(payload) { // Not subject to the undo arch.
  const { action, value, offboardOpacity } = payload;

  switch (action) {
    case "ZoomIn":  handleZoomIn(); break;
    case "ZoomOut": handleZoomOut(); break;
    case "Ascend":  handleAscend(); break;
    case "Descend": handleDescend(); break;
    case "SetPOV":  handlePOV(value); break;
    default: throw new Error(`Unknown camera action ${action} value ${value}.`); break;
  }
  // <input type="range" name="offboard-opacity" min="0" max="1" step="0.01" value="0.5"> </label>
}
// Seampoint - more dispatchers...

// Handle event functions.
function handleMakeBoard(boardSize) { // Setup handlers.
  console.log("control: events.js - handleMakeBoard(boardSize):", boardSize);
  const board = boardSize.split("x").map(n => Number(n));
  const newBoard = { "board": board, "play": "off", "trays": "none", "gap": 0, "initialPos": "std" };

  trimStateToUndoIndex();
  state.setup(newBoard);  // Command to change setup state.

  cloneStateHistory();
  }

function handleMakeTrays(trayType) {  // Tray handlers.
  console.log("Tray Make-Tray:", trayType);
  // TODO: change state.
  }

function handleShowTray() {
  console.log("Tray Show:");
  // TODO: change state.
  }

function handleHideTray() {
  console.log("Tray Hide");
  // TODO: change state.
  }

function handleCycleGap() {
  console.log("Tray Cycle-Gap:");
  // TODO: change state.
}
/*** ---------- ---------- ---------- ---------- ***/

function handleNewGame() {            // Game handlers.
  // console.log("Game New-Game:");
  // TODO: change state.
  cloneStateHistory();
  // showUndoStatusInPanel();
  }

function handleRerun() {
  const order = ["AdvSqs", "Gambits", "Moves", "Setup"];
  const curr = currentKeyIndex();
  let { arrayKey, index } = curr;
  const k = order.indexOf(arrayKey);

  if(arrayKey === "Sentry") { // 🔥 Case 0: already at Sentry
    boards.clearBoard();
    showUndoStatusInPanel();
    return;
    }
  else if(index > 0) {        // 🔥 Case 1: collapse current key to first element.
    undoIndex[arrayKey][0] = 1;
    } 
  else {                      // 🔥 Case 2: move to next lower-priority key.
    let found = false;
    for(let j = k + 1; j < order.length; j++) { // Check each undo category.
      const key = order[j];
      const i = undoIndex[key][0];

      if(i > 0) {
        undoIndex[key][0] = 0;   // Jump to empty state of that key.
        arrayKey = key;
        found = true;
        break;
      }
    }

    // 🔥 Fall through to Sentry
    if(!found) {
      undoIndex.Setup[0] = 0;      // Zero Setup explicitly (important for display).
      boards.clearBoard();
      showUndoStatusInPanel();
      return;
    }
  }

  // 🔥 Render logic (Sentry-aware)
  if(     arrayKey === "AdvSqs") {
    if(undoIndex.AdvSqs[0] === 0) {
      view.clearAdvsq();
    } else {
      const specs = undoState.AdvSqs[undoIndex.AdvSqs[0] - 1];
      view.makeAdvsq(specs);
      view.setAdvsqPanelParams(view.specsToPanelParams(specs));
    }
    }
  else if(arrayKey === "Setup") {
    if(undoIndex.Setup[0] === 0) {
      boards.clearBoard();
    } else {
      const setup = undoState.Setup[undoIndex.Setup[0] - 1];
      boards.makeBoard(setup.board);
    }
  }
  // Seampoint for the rest of the undo elements.

  showUndoStatusInPanel();
  }

function handleUndo() {
  const keyIndex = prevKeyIndex();
  if(!keyIndex) { // Bottom sentry.
    boards.clearBoard();
    showUndoStatusInPanel();
    return;
  }

  if(     keyIndex.arrayKey === "AdvSqs") {
    const specs = undoState.AdvSqs[keyIndex.index];
    console.log("control: events.js - HandleUndo() - specs", specs);
    view.makeAdvsq(specs);
    view.setAdvsqPanelParams(view.specsToPanelParams(specs));
    }
  else if(keyIndex.arrayKey === "Gambits") {
    const specs = undoState.Gambits[keyIndex.index];
    console.log("control: events.js - HandleUndo(gambit)", specs);
    // TODO: call the view routine to render the gambit.
    }
  else if(keyIndex.arrayKey === "Moves") {
    const specs = undoState.Moves[keyIndex.index];
    console.log("control: events.js - HandleUndo(move)", specs);
    // TODO: call the view routine to render the move.
    }
  else if(keyIndex.arrayKey === "Setup") {
    const setup = undoState.Setup[keyIndex.index];
    console.log("control: events.js - HandleUndo(setup)", setup);
    boards.makeBoard(setup.board);
  }

  showUndoStatusInPanel();
  }

function handleRedo() {
  const keyIndex = nextKeyIndex();
  if(!keyIndex) {   // Top sentry.
    console.log("Heat death - no more state history.");
    return;
  }

  if(keyIndex.arrayKey === "AdvSqs") {
    const specs = undoState.AdvSqs[keyIndex.index];
    console.log("control: events.js - HandleRedo(advsq)", specs);
    view.makeAdvsq(specs);
    view.setAdvsqPanelParams(view.specsToPanelParams(specs));
    }
  else if(keyIndex.arrayKey === "Gambits") {
    const specs = undoState.Gambits[keyIndex.index];
    console.log("control: events.js - HandleRedo(gambit)", specs);
    // TODO: call the view routine to render the gambit.
    }
  else if(keyIndex.arrayKey === "Moves") {
    const specs = undoState.Moves[keyIndex.index];
    console.log("control: events.js - HandleRedo(move)", specs);
    // TODO: call the view routine to render the move.
    }
  else if(keyIndex.arrayKey === "Setup") {
    const setup = undoState.Setup[keyIndex.index];
    console.log("control: events.js - HandleRedo(setup)", setup);
    boards.makeBoard(setup.board);
  }

  showUndoStatusInPanel();
  }
  
function handleLoad() {
  console.log("Game Load:", state.getState());
  // TODO: change state.
  }
  
function handleSave() {
  // console.log("Game Save:");
  // TODO: change state.
  const state1 = currentKeyIndex();
  console.log("currentKeyIndex()", currentKeyIndex());
  console.log("undoState()", undoState[state1.arrayKey][state1.index]);

  /*** Refactoring to state based undo system. ***/
  const lastState = state.fetchCurrentSetup();  // Temp: being used for undo feedback, not button's intended purpose.
  const index = state.getUndoIndex(); // All of them.
  const setupIndex = index.Setup;     // Just the setup index
  console.log("Current Setup Undo:", setupIndex, lastState);
}

// --- Helpers ---
let undoState = { // This is the undo state of the game: local to controller.
  Setup:   [],
  Moves:   [],
  Gambits: [],
  AdvSqs:  []
  };

let undoIndex = { // undoIndex[key][0] = pointer to NEXT item to apply.
  Setup:   [],
  Moves:   [],
  Gambits: [],
  AdvSqs:  []
}

export function showUndoStatusInPanel() {    // Game helpers.
  const el = document.getElementById("undo-list");

  const rows = [
    ["Setup",   undoIndex.Setup],
    ["Moves",   undoIndex.Moves],
    ["Gambits", undoIndex.Gambits],
    ["AdvSqs",  undoIndex.AdvSqs]
  ];

  const text = rows
    .map(([label, [i, max]]) =>
      `${label.padEnd(7)} ${i}/${max}`
    )
    .join("\n");

  el.textContent = text;

  //*** New State Based Undo System ***/
  showUndoStatus();
  }

function showUndoStatus() {
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

export function currentKeyIndex() {
  const order = ["AdvSqs", "Gambits", "Moves", "Setup"];

  for (const key of order) {
    const i = undoIndex[key][0];
    if (i > 0) {
      return { arrayKey: key, index: i - 1 };
    }
  }

  return { arrayKey: "Sentry", index: -1 };  // 🔥 explicit
  }

export function prevKeyIndex() {
  const order = ["AdvSqs", "Gambits", "Moves", "Setup"];

  for (let k = 0; k < order.length; k++) {
    const key = order[k];
    let i = undoIndex[key][0];

    // Only consider arrays that have any applied state
    if (i > 0) {
      i = i - 1;

      if (i >= 0) {      // Case 1: still within same array
        undoIndex[key][0] = i;
        if(i-1 >= 0)
          return { arrayKey: key, index: i-1 };
      }

      for (let j = k + 1; j < order.length; j++) {      // Case 2: retreat to previous arrays
        const prevKey = order[j];
        const prevI = undoIndex[prevKey][0];

        if (prevI > 0) {
          return { arrayKey: prevKey, index: prevI - 1 };
        }
      }

      return null; // nothing left anywhere
    }
  }

  return null; // no arrays had state
  }

export function nextKeyIndex() {
  const order = ["Setup", "Moves", "Gambits", "AdvSqs"];

  for (let k = 0; k < order.length; k++) {
    const key = order[k];
    let i = undoIndex[key][0];
    const max = undoIndex[key][1];

    // Only consider arrays that have remaining redo
    if (i < max) {      // Case 1: advance within same array
      undoIndex[key][0] = i + 1;
      return { arrayKey: key, index: i };
    }

    for (let j = k + 1; j < order.length; j++) {    // Case 2: move forward to next arrays
      const nextKey = order[j];
      const nextI = undoIndex[nextKey][0];
      const nextMax = undoIndex[nextKey][1];

      if (nextI < nextMax) {
        undoIndex[nextKey][0] = nextI + 1;
        return { arrayKey: nextKey, index: nextI };
      }
    }

    // If we checked this key and forward keys, nothing found
    if (i < max) break;
  }

  return null;
  }

export function trimStateToUndoIndex() {
  const curr = state.getState();
  const next = {};

  for (const key in curr) {
    const cutoff = undoIndex[key][0];   // pointer to NEXT
    next[key] = curr[key].slice(0, cutoff);
  }

  state.setState(next);
  }

export function cloneStateHistory() {
  undoState = structuredClone(state.getState());  // A deep copy for undo to traverse.
  for(const key in undoState) {
    const array = undoState[key];
    undoIndex[key][0] = array.length;
    undoIndex[key][1] = array.length;
  }
  // const keyIndex = currentKeyIndex();

  showUndoStatusInPanel();
}

export function clearStateHistoryArray(array) {
  undoState[array] = [];
  undoIndex.AdvSqs = [0, 0];
}
/*** ---------- ---------- ---------- ---------- ***/

function handleFreeze() {             // Gambit handlers.
  console.log("Gambit Freeze-AdvSq:");
  // TODO: change state.
  }

function handlePrev() {
   console.log("Gambit Prev:");
 // TODO: change state.
  }

function handleNext() {
  console.log("Gambit Next:");
  // TODO: change state.
  }

function handleDelete() {
  console.log("Gambit Delete:");
  // TODO: change state.
  }

function handleDeselect() {
  console.log("Gambit Deselect:");
  // TODO: change state.
}
/*** ---------- ---------- ---------- ---------- ***/

import * as cameras from "../view/render/cameras.js";

function handleZoomIn() {             // Camera handlers. Not subject to the undo arch.
  console.log("Camera Zoom-In:");
  const delta = 0.1;
  cameras.zoomIn(delta);
  }

function handleZoomOut() {
  const delta = -0.1;
  cameras.zoomIn(delta);
  }

function handleAscend() {
  const tilt = 10;
  cameras.shiftVertical(tilt);
  }

function handleDescend() {
  const tilt = -10;
  cameras.shiftVertical(tilt);
  }

function handlePOV(pov) {
  cameras.selectPOV(pov, [0, 0, 0]);
}

// Seampoint - more handle functions, to be grouped by panel.

