/* File: selections.js
  Path: ./3dc/model/selections/selections.js
  Purpose: Manage raycasting clicks for tiles, pieces, advsqs, gambits, etc.
  Author: Allan Goff
  Date: 6/04/26
  Recommended access: import * as mSelections from "../../model/selections/selections.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import selectionsData from "./selections.json" assert { type: "json" };
  const selectionsModule = selectionsData.selections_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as planes from "../geometry/planes/planes.js";
  import * as quads  from "../geometry/quads/quads.js";
// Seampoint: more imports...

// --- Globals ---
// Seampoint: more globals...

// --- UI ---
export function UI() {
  console.log("model: selections.js - UI()");
  
  return;
  }
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

