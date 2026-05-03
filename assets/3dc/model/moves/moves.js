/* File: moves.js
  Path: ./3dc/model/moves/moves.js
  Purpose: The moves portion of the state of the game.
  Author: Allan Goff
  Date: 4/30/26
  Recommended access: import * as mMoves from ../../model/moves/moves.js
  UI: the export functions.
  Philosophy: should be able to delete a module by deleting its directory.
*/

// --- Load JSON ---
import movesData from "./moves.json" assert { type: "json" };
  const movesModule = movesData.moves_module;
  const move  = movesModule.Move;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as state  from "../../model/state/state.js";
// Seampoint: more imports...

const buffer = "Moves";   // State buffer (state.js).

// --- UI ---
export function UI() {
  console.log("control: moves.js - UI()");
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
export function createState(payload, index) { // Create the state entry from raw data.
  console.log("model: moves.js - createState(payload, index)", payload, index);
  // TODO: code model: moves - createState().

  let { action, player, piece, src, dst, sec, capture, opts } = payload;
  let turn = Math.floor((index + 1) / 2);
  let entry = { turn, player, piece, src, action, dst, sec };

  return entry;
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

