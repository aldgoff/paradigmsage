/* File: pieces.js
  Path: ./3dc/view/pieces/pieces.js
  Purpose: desc
  Author: Allan Goff
  Date: 5/03/26
  Recommended access: import * as pieces from ../../view/pieces/pieces.js
  UI: the export functions.
*/

// --- Load JSON ---
import piecesData from "./pieces.json" assert { type: "json" };
  const piecesModule = piecesData.pieces_module;
  const category  = piecesModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
import * as planes from "../../geometry/planes/planes.js";
import * as quads  from "../../geometry/quads/quads.js";
// Seampoint: more imports...


// --- UI ---
export function UI() {
  console.log("view: pieces.js - UI()");
  
  return "whatever";
  }
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

