/* File: advsqs.js
  Path: ./3dc/advsqs/advsqs.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/15/26
  Recommended access: import * as advsqs.
  UI: the export functions.
*/

// --- Load JSON ---
import advsqsData from "./advsqs.json" assert { type: "json" };
  const advsqsModule = advsqsData.advsqs_module;
  const category  = advsqsModule.category;
  // Seampoint: more objects.

// --- Build upon previous layers ---
import * as state  from "../../model/state/state.js";

import * as planes from "../../geometry/planes/planes.js";
import * as quads  from "../../geometry/quads/quads.js";
// Seampoint: more imports.


// --- UI ---
export function UI() {
  console.log("control: advsqs.js - UI()");
  
  return "whatever";
}

export function clearBuffer() {
  state.clearBuffer("AdvSqs");      // Update undo buffer.

}

// Seampoint: more global functions.

