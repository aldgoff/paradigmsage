/* File: moves.js
  Path: ./3dc/view/moves/moves.js
  Purpose: Rendering the view panel and board.
  Author: Allan Goff
  Date: 4/30/26
  Recommended access: import * as vMoves from ../../view/moves/moves.js
  UI: the export functions.
*/

// --- Load JSON ---
import movesData from "./moves.json" assert { type: "json" };
  const movesModule = movesData.moves_module;
  const category  = movesModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
import * as quads  from "../../geometry/quads/quads.js";
// Seampoint: more imports...

// --- UI ---
export function UI() {
  console.log("view: moves.js - UI()");
  
  return "whatever";
  }

export function renderMove(move) {
  console.log("view: moves.js - renderMove(move)", move);
  
  return;
  }

export function updatePanel(move) {
  console.log("view: moves.js - updatePanel(move)", move);
  
  return;
  }
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

