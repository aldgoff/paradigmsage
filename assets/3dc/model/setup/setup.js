/* File: setup.js
  Path: ./3dc/model/setup/setup.js
  Purpose: State for the setup panel: payload, entry, line.
  Author: Allan Goff
  Date: 5/02/26
  Recommended access: import * as mSetup from "../../model/setup/setup.js";
  UI: the export functions.
  Philosophy: Delete a module by deleting its directory - not so much.
    controller/ model/ view/
    play.md - DOM
    main.js - regressions
    view.js - wire, build payload
    game.js - rewind, FF
    state.js - undo, redo
*/

// --- Load JSON ---
  import setupData from "./setup.json" assert { type: "json" };
  const setupModule = setupData.setup_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as vSetup   from "../../view/setup/setup.js";
// Seampoint: more imports...

// --- Globals ---
// Seampoint: more globals...

// --- UI ---
export function reset() {
  console.log("model: setup.js - reset()");

  vSetup.clearSetup();
  }

export function makeEntry(payload) {
  console.log(`model: setup.js - makeEntry(payload):`, payload);

  const { action, prevBoard, nextBoard, boardSize,trayType,trayGap } = payload;

  const entry = payload;

  return entry;
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...
