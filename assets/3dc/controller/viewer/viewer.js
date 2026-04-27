/* File: viewer.js
  Path: ./3dc/viewer/viewer.js
  Purpose: desc
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
import * as quads  from "../geometry/quads.js";
// Seampoint: more imports.


// --- UI ---
export function UI() {
  console.log("cntrl: viewer.js - UI()");
  
  return "whatever";
  }
// Seampoint: more global functions.

