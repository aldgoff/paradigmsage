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
// Seampoint: more objects...

// --- Dependencies ---
  import * as mTrays from "../../model/trays/trays.js";
// Seampoint: more imports...

// --- UI ---
export function init(entry) {
  console.log("cntrl: trays.js - init(entry)", entry);

  mTrays.init(entry);  // Initial occupancy depends on board size and tray type.

  return;
  }
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

