/* File: moves.js
  Path: ./3dc/model/moves/moves.js
  Purpose: The moves portion of the state of the game.
  Author: Allan Goff
  Date: 4/30/26
  Recommended access: import * as mMoves from ../../model/moves/moves.js
  UI: the export functions.
*/

// --- Load JSON ---
import movesData from "./moves.json" assert { type: "json" };
  const movesModule = movesData.moves_module;
  const category  = movesModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as planes from "../geometry/planes/planes.js";
  import * as quads  from "../geometry/quads/quads.js";
// Seampoint: more imports...

// --- UI ---
export function UI() {
  console.log("model: moves.js - UI()");
  
  return "whatever";
  }
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

