/* File: pieces.js
  Path: ./3dc/controller/pieces/pieces.js
  Purpose: Commands for moving pieces around.
  Author: Allan Goff
  Date: 5/03/26
  Recommended access: import * as cPieces from "../../controller/pieces/pieces.js";
  UI: the export functions.
*/

// --- Load JSON ---
import piecesData from "./pieces.json" assert { type: "json" };
  const piecesModule = piecesData.pieces_module;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as planes from "../../geometry/planes/planes.js";
  import * as quads  from "../../geometry/quads/quads.js";
// Seampoint: more imports...

// --- UI ---
export function UI() {
  console.log("cntrl: pieces.js - UI()");
  
  return;
  }
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

