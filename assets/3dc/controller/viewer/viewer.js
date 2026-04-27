/* File: viewer.js
  Path: ./3dc/viewer/viewer.js
  Purpose: Adjust elements which affect view: gap, jitter, and level separation.
  Author: Allan Goff
  Date: 4/27/26
  Recommended access: import * as viewer.
  UI: the export functions.
*/

// --- Load JSON ---
import viewerData from "./viewer.json" assert { type: "json" };
  const viewerModule = viewerData.viewer_module;
  const category  = viewerModule.category;
  // Seampoint: more objects.

// --- Build upon previous layers ---
import * as cameras from "../../view/render/cameras.js";
// Seampoint: more imports.

// --- UI ---
export function panelDispatch(payload) {
  console.log("cntrl: viewer.js - panelDispatch(payload)", payload);

  let { action, gap, sep, range, speed } = payload;
  gap   = Number(gap);
  sep   = Number(sep);
  range = Number(range);
  speed = Number(speed);

  switch (action) {
    case "ShowTrays":      handleShowTrays(payload); break;
    case "HideTrays":      handleHideTrays(payload); break;
    case "StartAnimation": handleStartAnimation(payload); break;
    case "StopAnimation":  handleStopAnimation(payload); break;
    case "updateParam":    handleViewerParams({ gap, sep, range, speed }); break;
    default: throw new Error(`Unknown viewer action ${action} payload ${payload}.`); break;
  }
}
// Seampoint: more global functions.

// --- Handle Functions ---
function handleShowTrays(payload) {   // Viewer handlers. Not subject to undo.
  console.log("cntrl: viewer.js - handleShowTrays(payload)", payload);
  // TODO: show trays.
  }

function handleHideTrays(payload) {
  console.log("cntrl: viewer.js - handleHideTrays(payload)", payload);
  // TODO: hide trays.
  }

function handleStartAnimation(payload) {
  console.log("cntrl: viewer.js - handleStartAnimation(payload)", payload);
  // TODO: start animation.
  cameras.startJitter();
  }

function handleStopAnimation(payload) {
  console.log("cntrl: viewer.js - handleStopAnimation(payload)", payload);
  // TODO: stop animation.
  cameras.stopJitter();
  }

function handleViewerParams(params) {
  console.log("cntrl: viewer.js - handleViewerParams", params);
  // TODO: viewer parameters.

  cameras.setJitter(params.range, params.speed);

  // <input type="range" name="offboard-opacity" min="0" max="1" step="0.01" value="0.5"> </label>
}
// Seampoint - more handlers...

// --- Helpers ---
// Seampoint: more local functions.

