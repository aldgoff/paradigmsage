/* File: setup.js
  Path: ./3dc/layer/setup/setup.js
  Purpose: desc
  Author: Allan Goff
  Date: 5/03/26
  Recommended access: import * as setup from ../../layer/setup/setup.js
  UI: the export functions.
*/

// --- Load JSON ---
import setupData from "./setup.json" assert { type: "json" };
  const setupModule = setupData.setup_module;
  // const category  = setupModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
import * as planes from "../../geometry/planes/planes.js";
import * as quads  from "../../geometry/quads/quads.js";
// Seampoint: more imports...


// --- UI ---
export function UI() {
  console.log("layer: setup.js - UI()");
  
  return "whatever";
  }
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

