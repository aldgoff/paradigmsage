/* File: gambits.js
  Path: ./3dc/gambits/gambits.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/15/26
  Recommended access: import * as mGambits from ../../model/gambits/gambits.js
  UI: the export functions.
  Philosophy: Dlete a module by deleting its directory - not so much.
    controller/ model/ view/
    play.md - DOM
    main.js - regressions
    view.js - wire, build payload
    game.js - rewind, FF
    state.js - undo, redo
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

/* TODO: Gambit additions:
 * 0. HandleLoad
 * 1. Rebuild groups on load
 * 2. No single source of registry
 * 3. Entry not canonical
 * 4. Load does not restore indexed state correctly
 * 5. Load does not use rerunGambits()
 * 6. Group creation path is unclear
 * 7. Delete by passes state API
 * 8. Hard coded UI reset values
 * 9. Panel + state desync possibility.
*/

// --- UI ---
export function makeEntry(advsq) {
  console.log(`model: gambits.js - makeEntry(advsq):`, advsq);

  const { src, srcTile, quad, perimeter, stride, opacity } = advsq;

  // const src = coords.vtsToBoard(srcTile); // Convert to positional notation for onboard tiles, vts for rest.
  const dst = planes.resolveDstTile(srcTile, quad, perimeter, stride);  // Derive dst tile.
  const area = (perimeter+1)*(perimeter+1);

  const advsqs = [{ src, srcTile, quad, perimeter, stride, opacity }];
  const entry = { Q: quad,src,dst,area, advsqs }; // Prepare gambit state data.

  return entry;
}

export function fetchThisEntry(idx) {
  console.log(`model: gambits.js - fetchThisEntry(idx):`, idx);

  const len = state.getBufferLength("Gambits");
  if (idx < 0 || idx >= len) return null;

  const prev = state.getCurrentIndex("Gambits");
  state.setBufferIndex("Gambits", idx + 1);

  const entry = state.fetchCurrentState("Gambits");
  state.setBufferIndex("Gambits", prev);

  return entry;
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

