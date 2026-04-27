/* File: camera.js
  Path: ./3dc/camera/camera.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/27/26
  Recommended access: import * as camera.
  UI: the export functions.
*/

// --- Load JSON ---
import cameraData from "./camera.json" assert { type: "json" };
  const cameraModule = cameraData.camera_module;
  const category  = cameraModule.category;
  // Seampoint: more objects.

// --- Build upon previous layers ---
import * as quads  from "../../geometry/quads.js";
// Seampoint: more imports.


// --- UI ---
export function UI() {
  console.log("cntrl: modules.js - UI()");
  
  return "whatever";
  }
// Seampoint: more global functions.

