/* File: gambits.js
  Path: ./3dc/gambits/gambits.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/15/26
  Recommended access: import * as gambits.
  UI: the export functions.
  Philosophy: should be able to delete a module by deleting its directory.
*/

// --- Load JSON ---
import gambitsData from "./gambits.json" assert { type: "json" };
  const gambitsModule = gambitsData.gambits_module;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as state  from "../../model/state/state.js";

  import * as planes from "../../geometry/planes/planes.js";
  import * as coords from "../../foundation/coords/coords.js";

  import * as view   from "../../view/view.js";
// Seampoint: more imports..

const buffer = "Gambits";   // State buffer (state.js).

// --- UI ---
export function UI() {
  console.log("control: gambits.js - UI()");
}

export function makeEntry(payload) { const entry=null; return entry; }
export function fetchCurrentEntry() { const entry=null; return entry; }
export function fetchLastEntry() { const entry=null; return entry; }
export function fetchThisEntry(idx) { const entry=null; return entry; }

export function addEntry(entry) {}
export function insertEntry(entry, idx) {}
export function replaceEntry(entry, idx) {}

export function clearCurrentEntry() {}
export function clearLastEntry() {}
export function clearThisEntry(idx) {}
export function clearRestOfBuffer(idx) {}
export function clearEntireBuffer() {}


// TODO: Deprecate pre UI standardization.
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

