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

// --- Dependencies ---
  import * as mPieces from "../../model/pieces/pieces.js";
// Seampoint: more imports...

// --- UI ---
export function init(entry) {
  console.log("cntrl: pieces.js - init(entry)", entry);

  mPieces.init(entry);  // Initial occupancy depends on board size and tray type.

  return;
  }
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

