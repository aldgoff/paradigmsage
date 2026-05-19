/* File: trays.js
  Path: ./3dc/controller/trays/trays.js
  Purpose: Define interface to the trays control module.
  Author: Allan Goff
  Date: 5/19/26
  Recommended access: import * as cTrays from "../../controller/trays/trays.js";
  UI: the export functions.
*/

// --- Load JSON ---
import traysData from "./trays.json" assert { type: "json" };
  const traysModule = traysData.trays_module;
  const category  = traysModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as planes from "../geometry/planes/planes.js";
  import * as quads  from "../geometry/quads/quads.js";
// Seampoint: more imports...

// --- UI ---
export function UI() {
  // console.log("cntrl: trays.js - UI()");
  
  return;
  }
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

