/* File: tiles.js
  Path: ./3dc/controller/tiles/tiles.js
  Purpose: commands for managing tiles.
  Author: Allan Goff
  Date: 6/09/26
  import * as cTiles from "../../controller/tiles/tiles.js";
  UI: the export functions.
*/

// --- Load JSON ---
import tilesData from "./tiles.json" assert { type: "json" };
  const tilesModule = tilesData.tiles_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as mTiles from "../../model/tiles/tiles.js";
// Seampoint: more imports...

// --- Globals ---
// Seampoint: more globals...

// --- UI ---
export function UI() {
  console.log("cntrl: tiles.js - UI()");
  
  return "whatever";
  }
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

