/* File: tiles.js
  Path: ./3dc/model/tiles/tiles.js
  Purpose: state for tiles.
  Author: Allan Goff
  Date: 6/09/26
  import * as mTiles from "../../model/tiles/tiles.js";
  UI: the export functions.
*/

// --- Load JSON ---
import tilesData from "./tiles.json" assert { type: "json" };
  const tilesModule = tilesData.tiles_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as vTiles from "../../view/tiles/tiles.js";
// Seampoint: more imports...

// --- Globals ---
  const selectedTiles   = new Set();   // key = vts.join(",") - has(key = "8,7,7");
  const offsetTiles     = new Map();   // key = vts.join(",") - get(key = "8,7,7");
  const confluenceTiles = new Map();   // key = vts.join(",") - get(key = "8,7,7");
  /*
    const array  = [];        // of Access via index: array[i];
    const set    = new Set(); // of Existence via itself (membership): set.has(key);
    const object = {};        // in Access via key string: object["str"];
    const map    = new Map(); // of Access via arbitrary key: map.set()|get()|has();
  */
// Seampoint: more globals...

// --- UI ---
export function getSelectedTiles() {
  return selectedTiles;
  }

export function getOccpiedTiles() {
  return occupiedTiles;
  }

export function getOffsetTiles() {
  return offsetTiles;
}

export function UI() {
  console.log("model: tiles.js - UI()");
  
  return "whatever";
  }
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

