/* File: modules.js
  Path: ./3dc/layer/modules/modules.js
  Purpose: template for code files.
  Author: Allan Goff
  Date: 5/03/26
  Recommended access: import * as modules from "../../layer/modules/modules.js";
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
  // console.log("layer: modules.js - UI()");
  
  return "whatever";
  }
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

