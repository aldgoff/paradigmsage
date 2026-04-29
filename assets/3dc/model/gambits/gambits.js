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
  const category  = gambitsModule.category;
  // Seampoint: more objects.

// --- Build upon previous layers ---
import * as planes from "../../geometry/planes/planes.js";
import * as quads  from "../../geometry/quads/quads.js";
// Seampoint: more imports.


// --- UI ---
export function UI() {
  console.log("control: gambits.js - UI()");
  
  return "whatever";
}

export function makeGambit(curr) {
  console.log("model: gambits.js - makeGambit(curr).", curr);

  const { srcTile, quad, perimeter, stride, opacity } = curr;
  const dst = planes.resolveDstTile(srcTile, quad, perimeter, stride);  // Derive dst tile.
  const src = coords.vtsToBoard(srcTile); // Convert to positional notation for onboard tiles, vts for rest.
  
  const area = (perimeter+1)*(perimeter+1);
  const gambit = { Q: quad, src, dst, area };   // Prepare gambit state data.
  const idx = state.pushNewGambit(gambit);      // Undo buffer.

  return idx;
}
// Seampoint: more global functions.

