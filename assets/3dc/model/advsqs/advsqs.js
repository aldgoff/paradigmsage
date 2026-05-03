/* File: advsqs.js
  Path: ./3dc/advsqs/advsqs.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/15/26
  Recommended access: import * as advsqs.
  UI: the export functions.
  Philosophy: should be able to delete a module by deleting its directory.
*/

// --- Load JSON ---
import advsqsData from "./advsqs.json" assert { type: "json" };
  const advsqsModule = advsqsData.advsqs_module;
  const category  = advsqsModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as state  from "../../model/state/state.js";
// Seampoint: more imports...

const buffer = "AdvSqs";   // State buffer (state.js).

// --- UI ---
export function makeEntry(payload) {
  console.log(`model: ${buffer}.js - makeEntry(payload):`, payload);

  const entry = null; // TODO: build entry specific to this module
  return entry;
  }

export function fetchCurrentEntry() {
  console.log(`model: ${buffer}.js - fetchCurrentEntry()`);

  const entry = state.fetchCurrentState(buffer);
  return entry;
  }

export function fetchLastEntry() {
  console.log(`model: ${buffer}.js - fetchLastEntry()`);

  const len = state.getBufferLength(buffer);
  if (len === 0) return null;

  const entry = state.getState()[buffer][len - 1];
  return entry;
  }

export function fetchThisEntry(idx) {
  console.log(`model: ${buffer}.js - fetchThisEntry(idx):`, idx);

  const arr = state.getState()[buffer];
  if (!arr || idx < 0 || idx >= arr.length) return null;

  const entry = arr[idx];
  return entry;
}

export function addEntry(entry) {
  console.log(`model: ${buffer}.js - addEntry(entry):`, entry);

  state.pushNewState(buffer, entry);
  }

export function insertEntry(entry, idx) {
  console.log(`model: ${buffer}.js - insertEntry(entry, idx):`, entry, idx);

  state.insertState(buffer, entry, idx);
  }

export function replaceEntry(entry, idx) {
  console.log(`model: ${buffer}.js - replaceEntry(entry, idx):`, entry, idx);

  state.replaceState(buffer, entry, idx);
}

export function clearCurrentEntry() {
  console.log(`model: ${buffer}.js - clearCurrentEntry()`);

  const i = state.getBufferIndex()[buffer];
  if (i === 0) return;

  state.deleteState(buffer, i - 1);
  }

export function clearLastEntry() {
  console.log(`model: ${buffer}.js - clearLastEntry()`);

  const len = state.getBufferLength(buffer);
  if (len === 0) return;

  state.deleteState(buffer, len - 1);
  }

export function clearThisEntry(idx) {
  console.log(`model: ${buffer}.js - clearThisEntry(idx):`, idx);

  state.deleteState(buffer, idx);
  }

export function clearRestOfBuffer(idx) {
  console.log(`model: ${buffer}.js - clearRestOfBuffer(idx):`, idx);

  state.truncateState(buffer, idx);
  }

export function clearEntireBuffer() {
  console.log(`model: ${buffer}.js - clearEntireBuffer()`);

  state.clearBuffer(buffer);
}


// TODO: Deprecate pre UI standardization.
export function clearBuffer() {
  state.clearBuffer("AdvSqs");      // Update undo buffer.
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

