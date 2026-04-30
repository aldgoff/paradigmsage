/* File: gambits.js
  Path: ./3dc/gambits/gambits.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/15/26
  Recommended access: import * as gambits.
  UI: the export functions.
*/

// --- Load JSON ---
import gambitsData from "./gambits.json" assert { type: "json" };
  const gambitsModule = gambitsData.gambits_module;
// Seampoint: more objects...

// --- Build upon previous layers ---
import * as planes from "../../geometry/planes/planes.js";
import * as coords from "../../foundation/coords/coords.js";

import * as view   from "../../view/view.js";
// Seampoint: more imports..

// --- UI ---
export function UI() {
  console.log("control: gambits.js - UI()");
  
  return "whatever";
}

export function makeGambit(specs) {
  console.log("model: gambits.js - makeGambit(specs).", specs);

  const { srcTile, quad, perimeter, stride, opacity } = specs;
  const dst = planes.resolveDstTile(srcTile, quad, perimeter, stride);  // Derive dst tile.
  const src = coords.vtsToBoard(srcTile); // Convert to positional notation for onboard tiles, vts for rest.
  
  const group = view.buildAdvSqGroup(specs); // {srcTile: Array(3), quad: 1, perimeter: 0, stride: 0, opacity: 0.5}

  const area = (perimeter+1)*(perimeter+1);
  const gambit = { Q: quad, src, dst, area };   // Prepare gambit state data.

  return {gambit, group};
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

