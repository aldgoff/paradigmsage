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
  register.gameControlDispatcher(gameButtonDispatch);
  register.cameraControlDispatcher(cameraButtonDispatch);
  register.trayControlDispatcher(trayButtonDispatch);
  register.moveControlDispatcher(moveButtonDispatch);

  register.gambitControlDispatcher(gambitButtonDispatch);
  register.setupControlDispatcher(setupButtonDispatch);
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

function gameButtonDispatch(button) {
  console.log(`gameButtonDispatch() ${button}`);

  switch (button) {
    case "Rerun": handleRerun(); break;
    case "Undo": handleUndo(); break;
    case "Redo": handleRedo(); break;
    default: throw new Error(`Unknown game button ${button}.`);  break;
  }
  }

function cameraButtonDispatch(button) {
  console.log(`cameraButtonDispatch() ${button}`);

  switch (button) {
    default: throw new Error("Unknown camera button.");  break;
  }
  }

function trayButtonDispatch(button) {
  console.log(`trayButtonDispatch() ${button}`);

  switch (button) {
    default: throw new Error(`Unknown tray button ${button}.`);  break;
  }
  }

function moveButtonDispatch(button) {
  console.log(`moveButtonDispatch() ${button}`);

  switch (button) {
    default: throw new Error(`Unknown move button ${button}.`);  break;
  }
}

function gambitButtonDispatch(button) {   // Gambit panel.
  // console.log(`gambitButtonDispatch() ${button}`);
  switch (button) {
    case "freeze": handleFreeze(); break;
    case "prev": handlePrev(); break;
    case "next": handleNext(); break;
    case "delete": handleDelete(); break;
    case "deselect": handleDeselect(); break;
    default: throw new Error(`Unknown gambit button ${button}.`);  break;
  }
}

function setupButtonDispatch(button) {    // Setup panel.
  // console.log(`setupButtonDispatch() ${button}`);
  switch (button) {
    case "makeBoard": handleMakeBoard(); break;
    case "makeTrays": handleMakeTrays(); break;
    default: throw new Error(`Unknown setup button ${button}.`);  break;
  }
}
// Seampoint - more dispatchers...

// Dispatch functions.
function handleRerun() {}     // TODO: switch from canvi to panels.
function handleUndo() {
  console.log("   simulated undo button.");
  }
function handleRedo() {}

function handleFreeze() {     // Gambit handlers.
  console.log("control_layer.eventHandler.gambit: Freeze.");
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

function handleMakeBoard() {     // Setup handlers.
  console.log("control_layer.eventHandler.setup: Make Board.");
  // TODO: change state.
  }

function handleMakeTrays() {
  console.log("control_layer.eventHandler.setup: Make Trays.");
  // TODO: change state.
}
// Seampoint - more handle functions, to be grouped by panel.

