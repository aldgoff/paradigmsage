/* File: state.js
  Path: ./3dc/model/state/state.js
  Purpose: The state of a 3D Chess game.
  Author: Allan Goff
  Date: 4/06/26
  Recommended access: import * as mState from "../../model/state/state.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import stateData from "./state.json" assert { type: "json" };
  const seed = stateData.state_module;  // Not used, kept for syntax reference only.
// Seampoint: more objects...

// --- Dependencies ---
// Seampoint: more imports...

// --- Globals ---
  let state = { // This is the state history of the game: setup-moves-gambits-advsqs.
    Setup:   [],
    Moves:   [],
    Gambits: [],
    AdvSqs:  []
    };

  let indexes = { // Current element in each buffer, a key-value object.
    Setup:   0,
    Moves:   0,
    Gambits: 0,
    AdvSqs:  0
  }
// Seampoint: more globals...

// --- UI ---
export function getStateKeys() {    // ["Setup","Moves","Gambits","AdvSqs"] (in state order).
  return Object.keys(state);
}

/* ----- May Transition Buffers ----- */
export function getCurrBuffer() {   // Returns highest-order active buffer (index > 0), or null if none.
  console.log("model: state.js - getCurrBuffer");
  const keys = getStateKeys();
  let currBuffer = null;

  for(const key of keys) {
    if(indexes[key] > 0) {
      currBuffer = key;
    }
  }

  return currBuffer;
  }

export function getNextBuffer() {   // Returns next non-empty buffer after the current buffer, or first non-empty buffer if none is active, else null.
  const keys = getStateKeys(); 
  const currBuffer = getCurrBuffer();

  if(!currBuffer) { // Return first non-empty buffer.
    for(const key of keys) {
      if(getBufferLength(key) > 0) return key;
    }
    return null;
  }

  const startIdx = keys.indexOf(currBuffer);

  for(let i = startIdx + 1; i < keys.length; i++) {
    const key = keys[i];
    if(getBufferLength(key) > 0) return key;
  }

  return null; // top sentry
  }

export function getPrevBuffer() {   // Returns previous non-empty buffer before the current buffer, or null if none exists.
  const keys = getStateKeys();
  const currBuffer = getCurrBuffer();

  if(!currBuffer) return null;

  const startIdx = keys.indexOf(currBuffer);

  for(let i = startIdx - 1; i >= 0; i--) {
    const key = keys[i];
    if(getBufferLength(key) > 0) return key;
  }

  return null; // bottom sentry
  }

export function prevKeyIndex() {
  const order = [...getStateKeys()].reverse();  // ["AdvSqs", "Gambits", "Moves", "Setup"]

  for(let k = 0; k < order.length; k++) {
    const key = order[k];
    let i = indexes[key];

    if(i > 0) {
      i = i - 1;
      indexes[key] = i;

      if(i > 0) {
        return { arrayKey: key, index: i - 1 };
      }

      // fall through to lower buffers
      for(let j = k + 1; j < order.length; j++) {
        const prevKey = order[j];
        const prevI = indexes[prevKey];

        if(prevI > 0) {
          return { arrayKey: prevKey, index: prevI - 1 };
        }
      }

      return null;
    }
  }

  return null;
  }

export function nextKeyIndex() {
  const order = getStateKeys(); // ["Setup", "Moves", "Gambits", "AdvSqs"]

  for(let k = 0; k < order.length; k++) {
    const key = order[k];
    let i = indexes[key];
    const max = state[key].length;

    if(i < max) {
      indexes[key] = i + 1;
      return { arrayKey: key, index: i };
    }

    for(let j = k + 1; j < order.length; j++) {
      const nextKey = order[j];
      const nextI = indexes[nextKey];
      const nextMax = state[nextKey].length;

      if(nextI < nextMax) {
        indexes[nextKey] = nextI + 1;
        return { arrayKey: nextKey, index: nextI };
      }
    }
  }

  return null;
}

/* ----- Buffer Specific ----- */
export function getCurrentIndex(buffer) { // Active element in this buffer (0 <= i <= len).
  return indexes[buffer];
  }

export function isAtEnd(buffer) {         // Index = length.
  return indexes[buffer] === state[buffer].length;
  }

export function isAtBeg(buffer) {         // Index = one.
  return indexes[buffer] === 1;
  }

export function isInactive(buffer) {      // Index = zero.
  return indexes[buffer] === 0;
  }

export function fetchPrevState(buffer) {
  const i = indexes[buffer];
  if(i <= 1) return null;
  return state[buffer][i-2];  
  }

export function fetchNextState(buffer) {
  const i = indexes[buffer];
  if(i >= getBufferLength(buffer)) return null;
  return state[buffer][i];  
  }

export function getBufferLength(buffer) { // Number of items in this buffer (0-N).
  const arr = state[buffer];
  return arr ? arr.length : 0;
}

/* ----- Getters & Setters for the State Arrays ----- */
export function getIndices() {              // Fetch copy of index array.
  return indexes;
  }

export function setIndices(newIndices) {    // Replace entire buffer index array.
  indexes = newIndices;
  }

export function getState() {                // Fetch copy of state array (the 4 buffers).
  return state;
  }

export function setState(newState) {        // Create a whole new state (all 4 buffers).
  state = structuredClone(newState);
  }

export function setNull() {                 // Set state to null.
  state = { Setup: [], Moves: [], Gambits: [], AdvSqs: [] };
  }

export function getNull() {                 // Get the null state.
  return { Setup: [], Moves: [], Gambits: [], AdvSqs: [] };
  }

export function resetAllIndices() {         // Zero out all the indices.
  console.log("model: state.js - resetAllIndices()");

  for(const key of Object.keys(indexes)) {
    indexes[key] = 0;
  }
}

/* ----- Setters & Getters for  ----- */
export function setBufferIndex(buffer, value) {
  indexes[buffer] = value;
  }

export function getBufferIndex(buffer) { // Not used yet.
  return indexes[buffer];
}

/* ----- ----- ----- ----- */
export function clearBuffer(buffer) { // Leaves meshes in scene, be sure to call the clear routine.
  console.log("model: state.js - clearBuffer(buffer):", buffer);
  
  state[buffer].length = 0;
  indexes[buffer] = 0;
}

export function trimStateToIndex(buffer) {  // Not used yet.
  console.log("model: state.js - trimStateToIndex(buffer):", buffer);

  if(!(buffer in state)) return;

  const i = indexes[buffer];
  state[buffer] = state[buffer].slice(0, i);
  }

export function setBuffer(buffer, entries) {  // Not used yet.
  console.log("model: state.js - setBuffer(buffer, entries):", buffer, entries);

  if (!(buffer in state)) return;

  state[buffer] = structuredClone(entries);
  indexes[buffer] = entries.length;
  }

/* ----- ----- ----- ----- */

export function insertState(buffer, values, idx) {
  console.log("model: state.js - insertState(buffer, values, idx):", buffer, values, idx);

  if (!(buffer in state)) {
    throw new Error(`Unknown state buffer: ${buffer}`);
  }

  const arr = state[buffer];
  if (!arr || idx < 0 || idx > arr.length) return;

  const i = indexes[buffer];

  // Branch if inserting before current index
  if (idx < i) {
    state[buffer] = arr.slice(0, i);
  }

  state[buffer].splice(idx, 0, structuredClone(values));
  indexes[buffer] = idx + 1;
  }

export function replaceState(buffer, values, idx) {
  console.log("model: state.js - replaceState(buffer, values, idx):", buffer, values, idx);

  if (!(buffer in state)) {
    throw new Error(`Unknown state buffer: ${buffer}`);
  }

  const arr = state[buffer];
  if (!arr || idx < 0 || idx >= arr.length) return;

  arr[idx] = structuredClone(values);
  indexes[buffer] = idx + 1;
  }

export function deleteState(buffer, idx) {
  console.log("model: state.js - deleteState(buffer, idx):", buffer, idx);

  if (!(buffer in state)) {
    throw new Error(`Unknown state buffer: ${buffer}`);
  }

  const arr = state[buffer];
  if (!arr || idx < 0 || idx >= arr.length) return;

  arr.splice(idx, 1);

  const i = indexes[buffer];
  if (i > idx) indexes[buffer] = i - 1;
  }

export function truncateState(buffer, idx) {
  console.log("model: state.js - truncateState(buffer, idx):", buffer, idx);

  if (!(buffer in state)) {
    throw new Error(`Unknown state buffer: ${buffer}`);
  }

  const arr = state[buffer];
  if (!arr || idx < 0 || idx > arr.length) return;

  state[buffer] = arr.slice(0, idx);
  indexes[buffer] = Math.min(indexes[buffer], idx);
}

/* Shortcut functions - make args clearer. */
export function fetchCurrentState(buffer) {
  const i = indexes[buffer];
  if (i === 0) return null;
  return state[buffer][i-1];  
  }
  export const fetchCurrentSetup  = () => fetchCurrentState("Setup");
  export const fetchCurrentMove   = () => fetchCurrentState("Moves");
  export const fetchCurrentGambit = () => fetchCurrentState("Gambits");
  export const fetchCurrentAdvsq  = () => fetchCurrentState("AdvSqs");

export function replaceCurrentState(buffer, values) { // Not used, yet.
  const arr = state[buffer];
  if(!arr || !arr.length) return null;
  const i = indexes[buffer];
  if (i === 0) return null;
  arr[i - 1] = structuredClone(values);  
  }
  export const replaceCurrentSetup  = (values) => replaceCurrentState("Setup",   values);
  export const replaceCurrentMove   = (values) => replaceCurrentState("Moves",   values);
  export const replaceCurrentGambit = (values) => replaceCurrentState("Gambits", values);
  export const replaceCurrentAdvsq  = (values) => replaceCurrentState("AdvSqs",  values);

export function pushNewState(buffer, values) {  // Uses current index, will branch if idx<length.
  console.log("model: state.js - pushNewState(buffer, values):", buffer, values);

  if (!(buffer in state)) {
    throw new Error(`Unknown state buffer: ${buffer}`);
  }

  const i = indexes[buffer];

  state[buffer] = state[buffer].slice(0, i);    // Branch truncates current buffer if mid-history.
  state[buffer].push(structuredClone(values));  // Push new state onto undo buffer.
  indexes[buffer] = i + 1;                    // Advance the index.
  }
  export const pushNewSetup  = (values) => pushNewState("Setup",   values);
  export const pushNewMove   = (values) => pushNewState("Moves",   values);
  export const pushNewGambit = (values) => pushNewState("Gambits", values);
  export const pushNewAdvsq  = (values) => pushNewState("AdvSqs",  values);
/* ----- ----- ----- ----- */

// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

/* TODO: QC checklist
  1. tbd
*/

