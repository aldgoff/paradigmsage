/* File: camera.js
  Path: ./3dc/controller/camera/camera.js
  Purpose: Panel interface to camera control.
  Author: Allan Goff
  Date: 4/27/26
  Recommended access: import * as cCamera from "../../controller/camera/camera.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import cameraData from "./camera.json" assert { type: "json" };
  const cameraModule = cameraData.camera_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as vCameras from "../../view/render/cameras.js";
  import * as vGambits from "../../view/gambits/gambits.js";
// Seampoint: more imports.

// --- UI ---
export function panelDispatch(payload) {
  // console.log("cntrl: camera.js - panelDispatch(payload)", payload);

  vGambits.cancelAnimation();

  const { action, value, offboardOpacity } = payload;

  switch (action) {
    case "ZoomIn":  handleZoomIn(); break;
    case "ZoomOut": handleZoomOut(); break;
    case "Ascend":  handleAscend(); break;
    case "Descend": handleDescend(); break;
    case "SetPOV":  handlePOV(value); break;  // TODO: eliminate one.
    case "updateParam": handlePOV(value); break;
    default: throw new Error(`Unknown camera action ${action} value ${value}.`); break;
  }
  }

export function buildPayload(panel, action) {
  if (action === "SetPOV") {
    const radio = panel.querySelector('input[name="camera-pov"]:checked');
    return {
      action,
      value: radio?.value
    };
  }

  return { action };
}
// Seampoint: more global functions...

function handleZoomIn() {             // Camera handlers. Not subject to undo.
  console.log("Camera Zoom-In:");
  const delta = 0.1;
  vCameras.zoomIn(delta);
  }

function handleZoomOut() {
  const delta = -0.1;
  vCameras.zoomIn(delta);
  }

function handleAscend() {
  const tilt = 10;
  vCameras.shiftVertical(tilt);
  }

function handleDescend() {
  const tilt = -10;
  vCameras.shiftVertical(tilt);
}

function handlePOV(pov) {
  vCameras.selectPOV(pov, [0, 0, 0]);
}
// Seampoint: more handlers...

// --- Helpers ---
// Seampoint: more local functions...

