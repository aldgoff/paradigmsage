/* File: setup.js
  Path: ./3dc/setup/setup.js
  Purpose: desc
  Author: Allan Goff
  Date: 5/02/26
  Recommended access: import * as setup.
  UI: the export functions.
  Philosophy: should be able to delete a module by deleting its directory.
*/

// --- Load JSON ---
import setupData from "./setup.json" assert { type: "json" };
  const setupModule = setupData.setup_module;
  const category  = setupModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as state  from "../../model/state/state.js";
// Seampoint: more imports...

const buffer = "Setup";   // State buffer (state.js).

// --- UI ---
export function UI() {
  console.log("control: setup.js - UI()");
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
export function clearBuffer() {
  state.clearBuffer("Setup");      // Update undo buffer.
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...
