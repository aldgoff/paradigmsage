/* File: events.js
  Path: ./3dc/controller/events.js
  Purpose: Register functions with the view layer for callbacks.
  Author: Allan Goff
  Date: 4/07/26
  Recommended access: import * as events.
  UI: the export functions.
*/

import * as setup    from "../controller/setup/setup.js";
import * as game     from "../controller/game/game.js";
import * as gambits  from "../controller/gambits/gambits.js";
import * as advsqs   from "../controller/advsqs/advsqs.js";

import * as register from "../view/registerHandlers.js";

// --- UI ---
export function callbacks() {
  register.setupControlDispatcher( setup.panelDispatch);    // Setup.
  register.gameControlDispatcher(   game.panelDispatch);    // Undo interface.
  register.advsqControlDispatcher(advsqs.panelDispatch);    // Manipulate an advancement square.
  register.gambitControlDispatcher(gambits.panelDispatch);  // Build a gambit.

  register.cameraControlDispatcher(cameraPanelDispatch);  // Not subject to the undo arch.
  // Seampoint - register another dispatcher.
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

