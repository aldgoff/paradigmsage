/* File: moves.js
  Path: ./3dc/moves/moves.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/27/26
  Recommended access: import * as moves.
  UI: the export functions.
*/

// --- Load JSON ---
import movesData from "./moves.json" assert { type: "json" };
  const movesModule = movesData.moves_module;
  const category  = movesModule.category;
  // Seampoint: more objects.

// --- Build upon previous layers ---
import * as quads  from "../../geometry/quads/quads.js";
// Seampoint: more imports.


// --- UI ---
export function UI() {
  console.log("cntrl: moves.js - UI()");
  
  return "whatever";
  }
// Seampoint: more global functions.

