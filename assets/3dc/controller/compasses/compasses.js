/* File: compasses.js
  Path: ./3dc/compasses/compasses.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/27/26
  Recommended access: import * as compasses.
  UI: the export functions.
*/

// --- Load JSON ---
import compassesData from "./compasses.json" assert { type: "json" };
  const compassesModule = compassesData.compasses_module;
  const category  = compassesModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
import * as quads  from "../../geometry/quads/quads.js";
// Seampoint: more imports...


// --- UI ---
export function UI() {
  console.log("cntrl: compasses.js - UI()");
  
  return "whatever";
  }
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

