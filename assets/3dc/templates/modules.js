/* File: modules.js
  Path: ./3dc/modules/modules.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/15/26
  Recommended access: import * as modules.
  UI: the export functions.
*/

// --- Load JSON ---
import modulesData from "./modules.json" assert { type: "json" };
  const modulesModule = modulesData.modules_module;
  const category  = modulesModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
import * as planes from "../geometry/planes/planes.js";
import * as quads  from "../geometry/quads/quads.js";
// Seampoint: more imports...


// --- UI ---
export function UI() {
  console.log("control: modules.js - UI()");
  
  return "whatever";
  }
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

