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

// --- Globals ---
const buffer = "Gambits";   // State buffer (state.js).

// --- UI ---
export function makeEntry(advsq) {
  console.log(`model: ${buffer}.js - makeEntry(advsq):`, advsq);

  const { srcTile, quad, perimeter, stride, opacity } = advsq;

  const src = coords.vtsToBoard(srcTile); // Convert to positional notation for onboard tiles, vts for rest.
  const dst = planes.resolveDstTile(srcTile, quad, perimeter, stride);  // Derive dst tile.
  const area = (perimeter+1)*(perimeter+1);

  const entry = { Q: quad,src,dst,area, srcTile,quad,perimeter,stride,opacity }; // Prepare gambit state data.

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

  const prev = state.getCurrentIndex(buffer);
  state.setBufferIndex(buffer, len);
  const entry = state.fetchCurrentState(buffer);
  state.setBufferIndex(buffer, prev);

  return entry;
  }

export function fetchThisEntry(idx) {
  console.log(`model: ${buffer}.js - fetchThisEntry(idx):`, idx);

  const len = state.getBufferLength(buffer);
  if (idx < 0 || idx >= len) return null;

  const prev = state.getCurrentIndex(buffer);
  state.setBufferIndex(buffer, idx + 1);
  const entry = state.fetchCurrentState(buffer);
  state.setBufferIndex(buffer, prev);

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

  const i = state.getCurrentIndex(buffer);
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
export function makeGroupFromEntry(entry) {
  console.log("model: gambits.js - makeGroupFromEntry(entry).", entry);
  const { Q,src,dst,area, srcTile,quad,perimeter,stride,opacity } = entry; // Prepare gambit state data.

  const advsq = {srcTile, quad, perimeter, stride, opacity};// {srcTile: Array(3), quad: 1, perimeter: 2, stride: 3, opacity: 0.5}
  const group = view.buildAdvSqGroup(advsq); // {srcTile: Array(3), quad: 1, perimeter: 0, stride: 0, opacity: 0.5}

  return group;
}
export function makeGroup(advsq) {
  console.log("model: gambits.js - makeGroup(advsq).", advsq);

  const group = view.buildAdvSqGroup(advsq); // {srcTile: Array(3), quad: 1, perimeter: 0, stride: 0, opacity: 0.5}

  return group;
}
export function makeGambit(specs) {
  console.log("model: gambits.js - makeGambit(specs).", specs);

  const { srcTile, quad, perimeter, stride, opacity } = specs;
  const dst = planes.resolveDstTile(srcTile, quad, perimeter, stride);  // Derive dst tile.
  const src = coords.vtsToBoard(srcTile); // Convert to positional notation for onboard tiles, vts for rest.
  
  const area = (perimeter+1)*(perimeter+1);
  const gambit = { Q: quad, src, dst, area };   // Prepare gambit state data.

  return gambit;
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

