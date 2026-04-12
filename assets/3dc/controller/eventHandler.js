/* File: eventHandler.js
  Path: ./3dc/controller/eventHandler.js
  Purpose: Register functions with the view layer for callbacks.
  Author: Allan Goff
  Date: 4/07/26
  UI: the export functions.
*/

import * as view from "../view/view.js";
import * as register from "../view/registerHandlers.js";

export function callbacks() {
  register.moveControlDispatcher(moveButtonDispatch);

  register.setupControlDispatcher(setupPanelDispatch);
  register.trayControlDispatcher(trayPanelDispatch);
  register.gameControlDispatcher(gameButtonDispatch);
  register.gambitControlDispatcher(gambitButtonDispatch);

  register.cameraControlDispatcher(cameraButtonDispatch); // Not subject to the undo arch.
  // Seampoint - register another dispatcher.
}

function buttonDispatch(button) { // Template, not used.
  console.log(`buttonDispatch() ${button}`);

  switch (button) {
    case "Rerun": handleRerun(); break;
    case "Undo": handleUndo(); break;
    case "Redo": handleRedo(); break;
    default: throw new Error(`Unknown button ${button}.`);  break;
  }
}

function moveButtonDispatch(button) {       // Deprecating...
  console.log(`moveButtonDispatch() ${button}`);

  switch (button) {
    default: throw new Error(`Unknown move button ${button}.`);  break;
  }
}

function setupPanelDispatch(payload) {    // Dispatch payload from panel to dispatch functions.
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
  console.log(`gameButtonDispatch() ${payload}`);
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

function cameraButtonDispatch(payload) { // Not subject to the undo arch.
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

// Dispatch functions.
function handleMakeBoard(boardSize) { // Setup handlers.
  // console.log("control_layer.eventHandler.setup: Make Board.");
  console.log("Make Board:", boardSize);
  // TODO: change state.
}

function handleMakeTrays(trayType) {  // Tray handlers.
  // console.log("control_layer.eventHandler.tray: Make Trays.");
  console.log("Make Tray:", trayType);
  // TODO: change state.
  }

function handleShowTray() {
  console.log("control_layer.eventHandler.tray: Show Tray.");
  // TODO: change state.
  }

function handleHideTray() {
  console.log("control_layer.eventHandler.tray: Hide Tray.");
  // TODO: change state.
  }

function handleCycleGap() {
  console.log("control_layer.eventHandler.tray: Cycle Gap.");
  // TODO: change state.
}

function handleNewGame() {            // Game handlers.
  console.log("control_layer.eventHandler.game: New Game.");
  // TODO: change state.
  }

function handleRerun() {
  console.log("control_layer.eventHandler.game: Rerun.");
  // TODO: change state.
  }
  
function handleUndo() {
  // console.log("   simulated undo button.");
  console.log("control_layer.eventHandler.game: Undo.");
  // TODO: change state.
  }
  
function handleRedo() {
  console.log("control_layer.eventHandler.game: Redo.");
  // TODO: change state.
  }
  
function handleLoad() {
  console.log("control_layer.eventHandler.game: Load.");
  // TODO: change state.
  }
  
function handleSave() {
  console.log("control_layer.eventHandler.game: Save.");
  // TODO: change state.
}

function handleFreeze() {             // Gambit handlers.
  console.log("control_layer.eventHandler.gambit: Freeze AdvSq.");
  // TODO: change state.
  }

function handlePrev() {
  console.log("control_layer.eventHandler.gambit: Prev.");
  // TODO: change state.
  }

function handleNext() {
  console.log("control_layer.eventHandler.gambit: Next.");
  // TODO: change state.
  }

function handleDelete() {
  console.log("control_layer.eventHandler.gambit: Delete.");
  // TODO: change state.
  }

function handleDeselect() {
  console.log("control_layer.eventHandler.gambit: Deselect.");
  // TODO: change state.
}

function handleZoomIn() {             // Camera handlers. Not subject to the undo arch.
  console.log("control_layer.eventHandler.camera: Zoom In.");
  // TODO: change state.
  }

function handleZoomOut() {
  console.log("control_layer.eventHandler.camera: Zoom Out.");
  // TODO: change state.
  }

function handleAscend() {
  console.log("control_layer.eventHandler.camera: Ascend.");
  // TODO: change state.
  }

function handleDescend() {
  console.log("control_layer.eventHandler.camera: Descend.");
  // TODO: change state.
  }

function handlePOV(pov) {
  console.log(`control_layer.eventHandler.camera: POV = ${pov}.`);
  // TODO: change state.
}

// Seampoint - more handle functions, to be grouped by panel.

