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

function gambitButtonDispatch(button) {
  console.log(`gambitButtonDispatch() ${button}`);

  switch (button) {
    default: throw new Error(`Unknown gambit button ${button}.`);  break;
  }
}
// Seampoint - more dispatchers...

// Dispatch functions.
function handleRerun() {}
function handleUndo() {
  console.log("   simulated undo button.");
}
function handleRedo() {}
// Seampoint - more handle functions, to be grouped by canvi.

