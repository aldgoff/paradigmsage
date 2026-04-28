/* File: gambits.js
  Path: ./3dc/view/gambits/gambits.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/15/26
  Recommended access: import * as gambits.
  UI: the export functions.
*/

// --- Load JSON ---
import gambitsData from "./gambits.json" assert { type: "json" };
  const gambitsModule = gambitsData.gambits_module;
  const category  = gambitsModule.category;
  // Seampoint: more objects.

// --- Build upon previous layers ---
import * as planes from "../../geometry/planes/planes.js";
import * as quads  from "../../geometry/quads.js";
// Seampoint: more imports.


// --- UI ---
export function UI() {
  console.log("control: gambits.js - UI()");
  
  return "whatever";
  }
// Seampoint: more global functions.

