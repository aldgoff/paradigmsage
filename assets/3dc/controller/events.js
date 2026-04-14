/* File: events.js
  Path: ./3dc/controller/events.js
  Purpose: Register functions with the view layer for callbacks.
  Author: Allan Goff
  Date: 4/07/26
  UI: the export functions.
*/

import * as register from "../view/registerHandlers.js";
import * as controls from "./controller.js";
import * as state   from "../model/state/state.js";

// --- UI ---
export function callbacks() {
  register.setupControlDispatcher(setupPanelDispatch);    // Make board.
  register.trayControlDispatcher(trayPanelDispatch);      // Make tray
  register.gameControlDispatcher(gameButtonDispatch);     // Undo interface.
                                                          // Move panel is display only, no inputs.
  register.gambitControlDispatcher(gambitButtonDispatch); // Build a gambit.
  register.advsqControlDispatcher(advsqPanelDispatch);    // Manipulate an advancement square.

  register.cameraControlDispatcher(cameraPanelDispatch);  // Not subject to the undo arch.
  // Seampoint - register another dispatcher.
}

function setupPanelDispatch(payload) {    // Dispatch payload from panel to handleevent functions.
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

function advsqPanelDispatch(payload) {
  const { action, srcTile, quad, perimeter, stride } = payload;
  switch (action) {
    case "place":       handlePlace(payload); break;
    case "remove":      handleRemove(); break;
    case "updateParam": handleUpdateParam(payload); break;
    case "nudgeSrc":    handleNudgeSrc(payload); break;
    case "nextQuad":    handleNextQuad(); break;
    case "nextPlane":   handleNextPlane(); break;
    case "nextPiece":   handleNextPiece(); break;
    default: throw new Error(`Unknown advsq action ${action}, payload ${JSON.stringify(payload)}.`);
  }
}

function cameraPanelDispatch(payload) { // Not subject to the undo arch.
  const { action, value } = payload;
  switch (action) {
    case "ZoomIn":  handleZoomIn(); break;
    case "ZoomOut": handleZoomOut(); break;
    case "Ascend":  handleAscend(); break;
    case "Descend": handleDescend(); break;
    case "SetPOV":  handlePOV(value); break;
    default: throw new Error(`Unknown camera action ${action} value ${value}.`);  break;
  }
}
// Seampoint - more dispatchers...

// Handle event functions.
function handleMakeBoard(boardSize) { // Setup handlers.
  console.log("Setup Make-Board:", boardSize);
  // TODO: change state.
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

let undoState = { // This is the undo state of the game: local to controller.
  Setup:   [],
  Moves:   [],
  Gambits: [],
  Insights:[],
  AdvSqs:  []
};

let undoIndex = {
  Setup:   [],
  Moves:   [],
  Gambits: [],
  Insights:[],
  AdvSqs:  []
}
function handleNewGame() {            // Game handlers.
  console.log("Game New-Game:");
  // TODO: change state.
  }

function handleRerun() {
  console.log("Game Rerun:");
  // TODO: change state.
  for(const key in undoIndex) {
    const array = undoIndex[key];
    console.log(key, "undoIndex i/max", undoIndex[key][0], undoIndex[key][1]);
  }
  }
  
function handleUndo() {
  // console.log("Game Undo:");
  // TODO: change state.
  if(undoIndex["AdvSqs"][0] >= 0) {
    let i = undoIndex["AdvSqs"][0];
    const stateArray = undoState["AdvSqs"];
      console.log(`AdvSq ${i}`, JSON.parse(JSON.stringify(stateArray))[i])
    undoIndex["AdvSqs"][0] = --i;
    }
  else if(undoIndex["Gambits"][0] >= 0) {
    let i = undoIndex["Gambits"][0];
    const stateArray = undoState["Gambits"];
      console.log(`Gambit ${i}`, JSON.parse(JSON.stringify(stateArray))[i])
    undoIndex["Gambits"][0] = --i;
    }
  else if(undoIndex["Insights"][0] >= 0) {
    let i = undoIndex["Insights"][0];
    const stateArray = undoState["Insights"];
      console.log(`Insight ${i}`, JSON.parse(JSON.stringify(stateArray))[i])
    undoIndex["Insights"][0] = --i;
    }
  else if(undoIndex["Moves"][0] >= 0) {
    let i = undoIndex["Moves"][0];
    const stateArray = undoState["Moves"];
      console.log(`Move ${i}`, JSON.parse(JSON.stringify(stateArray))[i])
    undoIndex["Moves"][0] = --i;
    }
  else if(undoIndex["Setup"][0] >= 0) {
    let i = undoIndex["Setup"][0];
    const stateArray = undoState["Setup"];
      console.log(`Setup ${i}`, JSON.parse(JSON.stringify(stateArray))[i])
    undoIndex["Setup"][0] = --i;
  }
  };
  
function handleRedo() {
  // console.log("Game Redo:");
  // TODO: change state.
  if(undoIndex["Setup"][0] < undoIndex["Setup"][1]) {
    let i = undoIndex["Setup"][0];
    const stateArray = undoState["Setup"];
      console.log(`Setup ${i+1}`, JSON.parse(JSON.stringify(stateArray))[i+1])
    undoIndex["Setup"][0] = ++i;
    }
  else if(undoIndex["Moves"][0] < undoIndex["Moves"][1]) {
    let i = undoIndex["Moves"][0];
    const stateArray = undoState["Moves"];
      console.log(`Move ${i+1}`, JSON.parse(JSON.stringify(stateArray))[i+1])
    undoIndex["Moves"][0] = ++i;
    }
  else if(undoIndex["Insights"][0] < undoIndex["Insights"][1]) {
    let i = undoIndex["Insights"][0];
    const stateArray = undoState["Insights"];
      console.log(`Insight ${i+1}`, JSON.parse(JSON.stringify(stateArray))[i+1])
    undoIndex["Insights"][0] = ++i;
    }
  else if(undoIndex["Gambits"][0] < undoIndex["Gambits"][1]) {
    let i = undoIndex["Gambits"][0];
    const stateArray = undoState["Gambits"];
      console.log(`Gambit ${i+1}`, JSON.parse(JSON.stringify(stateArray))[i+1])
    undoIndex["Gambits"][0] = ++i;
    }
  else if(undoIndex["AdvSqs"][0] < undoIndex["AdvSqs"][1]) {
    let i = undoIndex["AdvSqs"][0];
    const stateArray = undoState["AdvSqs"];
      console.log(`AdvSq ${i+1}`, JSON.parse(JSON.stringify(stateArray))[i+1])
    undoIndex["AdvSqs"][0] = ++i;
  }
  }
  
function handleLoad() {
  console.log("Game Load:", state.getState());
  undoState = structuredClone(state.getState());  // A deep copy for undo to traverse.
  for(const key in undoState) {
    const array = undoState[key];
    console.log(key, "length", array.length);
    undoIndex[key][0] = array.length - 1;
    undoIndex[key][1] = array.length - 1;
  }
  console.log("----------");
  // TODO: change state.
  }
  
function handleSave() {
  console.log("Game Save:");
  // TODO: change state.
}

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

function handlePlace(payload) {       // Advsq handlers.
  const { action, srcTile, quad, perimeter, stride } = payload;
  console.log("Advsq Place:", payload);
  // TODO: change state.
  }

function handleRemove() {
  console.log("Advsq Remove:");
  // TODO: change state.
  }

function handleUpdateParam(payload) {
  const { name, value } = payload;
  console.log("Advsq Update:", payload);

  // Optional: normalize name
  const param = name.replace("advsq-", "");
  // console.log(`Param ${param} = ${value}`);

  // TODO: change state
  }

function handleNudgeSrc(payload) {
  const { axis, delta } = payload;

  console.log(`Advsq Nudge-Src ${axis} by ${delta}`);

  // TODO:
  // 1. read current srcTile
  // 2. parse into (z,x,y)
  // 3. apply delta
  // 4. write back to input OR state
  }

function handleNextQuad() {
  console.log("Advsq Next-Quad:");
  // TODO: change state.
  }

function handleNextPlane() {
  console.log("Advsq Next-Plane:");
  // TODO: change state.
  }

function handleNextPiece() {
  console.log("Advsq Next-Piece:");
  // TODO: change state.
}

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

