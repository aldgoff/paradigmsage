/* File: pieces.js
  Path: ./3dc/model/pieces/pieces.js
  Purpose: desc
  Author: Allan Goff
  Date: 5/03/26
  Recommended access: import * as vPieces from ""../../view/pieces/pieces.js";
  UI: the export functions.
*/

// --- Load JSON ---
import piecesData from "./pieces.json" assert { type: "json" };
  const piecesModule = piecesData.pieces_module;
  const eights = piecesModule.eights;
  const ten    = piecesModule.ten;
  const tens   = piecesModule.tens;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as planes from "../../geometry/planes/planes.js";
  import * as quads  from "../../geometry/quads/quads.js";

  import * as vPieces from "../../view/pieces/pieces.js";
  // Seampoint: more imports...

// --- Global (example only) ---
  const {
      side     = "White|Black",        // More concise, "W|B".
      piece    = "R|B|D|S|Q|N|P|K",
      location = "@|~", // Board or tray.
      coords   = "K2,2",
      ref      = "absolute|relative"  // If relative is the standard, uneeded, Black disambiguates.
  };  // Subtle point, B, D & S are color restricted, and stacks can even be crossed.

// --- UI ---
export function UI() {
  console.log("model: pieces.js - UI()");
  
  return;
  }
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

