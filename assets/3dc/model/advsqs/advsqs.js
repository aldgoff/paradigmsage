/* File: advsqs.js
  Path: ./3dc/advsqs/advsqs.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/15/26
  Recommended access: import * as mAdvsqs from ../../model/advsqs/advsqa.js
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
import advsqsData from "./advsqs.json" assert { type: "json" };
  const advsqsModule = advsqsData.advsqs_module;
  const category  = advsqsModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
// Seampoint: more imports...

// --- UI ---
export function makeEntry(payload) {
  console.log(`model: advsqs.js - makeEntry(payload):`, payload);

  let { src, srcTile, quad, perimeter, stride, opacity } = payload;  // Informative.

  const entry = payload;

  return entry;
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

