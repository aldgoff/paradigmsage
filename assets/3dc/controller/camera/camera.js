/* File: camera.js
  Path: ./3dc/camera/camera.js
  Purpose: Panel interface to camera control.
  Author: Allan Goff
  Date: 4/27/26
  Recommended access: import * as camera.
  UI: the export functions.
*/

// --- Load JSON ---
import cameraData from "./camera.json" assert { type: "json" };
  const cameraModule = cameraData.camera_module;
  const category  = cameraModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
import * as cameras from "../../view/render/cameras.js";
// Seampoint: more imports.

// --- UI ---
export function panelDispatch(payload) {
  // console.log("cntrl: camera.js - panelDispatch(payload)", payload);
  const { action, value, offboardOpacity } = payload;

  switch (action) {
    case "ZoomIn":  handleZoomIn(); break;
    case "ZoomOut": handleZoomOut(); break;
    case "Ascend":  handleAscend(); break;
    case "Descend": handleDescend(); break;
    case "SetPOV":  handlePOV(value); break;
    default: throw new Error(`Unknown camera action ${action} value ${value}.`); break;
  }
}
// Seampoint: more global functions...

function handleZoomIn() {             // Camera handlers. Not subject to undo.
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
// Seampoint - more handlers...

// --- Helpers ---
// Seampoint: more local functions...

