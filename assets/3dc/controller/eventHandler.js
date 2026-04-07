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
  register.cameraControlDispatcher(buttonDispatch);
  register.trayControlDispatcher(buttonDispatch);
  register.moveControlDispatcher(buttonDispatch);
  register.gambitControlDispatcher(buttonDispatch);
  // Seampoint - register another dispatcher.
}

function buttonDispatch(button) {
  console.log(`buttonDispatch() ${button}`);

  switch (button) {
    case "Rerun": handleRerun(); break;
    case "Undo": handleUndo(); break;
    case "Redo": handleRedo(); break;
  }
  }

function gameButtonDispatch(button) {
  console.log(`gameButtonDispatch() ${button}`);

  switch (button) {
    case "Rerun": handleRerun(); break;
    case "Undo": handleUndo(); break;
    case "Redo": handleRedo(); break;
  }
}
// Seampoint - more dispatchers...

// Dispatch functions.
function handleRerun() {}
function handleUndo() {}
function handleRedo() {}
// Seampoint - more handle functions, tobe grouped by canvas.

