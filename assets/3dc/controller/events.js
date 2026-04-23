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

import * as register from "../view/registerHandlers.js";
import * as view     from "../view/advsqs/advsqs.js";

// --- UI ---
export function callbacks() {
  register.setupControlDispatcher( setup.panelDispatch);  // Setup.
  register.gameControlDispatcher(   game.panelDispatch);  // Undo interface.
  register.advsqControlDispatcher(advsqs.panelDispatch);  // Manipulate an advancement square.

  register.gambitControlDispatcher(gambitButtonDispatch); // Build a gambit.
  register.cameraControlDispatcher(cameraPanelDispatch);  // Not subject to the undo arch.
  // Seampoint - register another dispatcher.
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

