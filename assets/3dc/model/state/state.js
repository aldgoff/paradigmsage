/* File: state.js
  Path: ./3dc/model/state/state.js
  Purpose: The state of a 3D Chess game.
  Author: Allan Goff
  Date: 4/06/26
  Recommended access: import * as state.
  UI: the export functions.
*/
/* const obj = JSON.parse(JSON.stringify(setup)); */

// --- Load JSON ---
import stateData from "./state.json" assert { type: "json" };
  const seed = stateData.state_module;  // Not used, kept for syntax reference only.
// Seampoint: more objects...

// --- Build upon previous layers ---
// Seampoint: more imports...

let state = { // This is the state history of the game: setup-moves-gambits-advsqs.
  Setup:   [],
  Moves:   [],
  Gambits: [],
  AdvSqs:  []
  };

let bufferIndex = { // Current element in buffer.
  Setup:   0,
  Moves:   0,
  Gambits: 0,
  AdvSqs:  0
}

// --- UI ---
export function getCurrentBuffer() {
  const keys = getStateKeys(); // ["Setup","Moves","Gambits","AdvSqs"]
  let current = null;

  for (const key of keys) {
    if (bufferIndex[key] > 0) {
      current = key;
    }
  }

  return current;
}
export function getNextBuffer() {
  const keys = getStateKeys(); // ["Setup","Moves","Gambits","AdvSqs"]
  const current = getCurrentBuffer();

  if (!current) {
    // no current → return first non-empty buffer
    for (const key of keys) {
      if (getBufferLength(key) > 0) return key;
    }
    return null;
  }

  const startIdx = keys.indexOf(current);

  for (let i = startIdx + 1; i < keys.length; i++) {
    const key = keys[i];
    if (getBufferLength(key) > 0) return key;
  }

  return null; // top sentry
}
export function getPrevBuffer() {
  const keys = getStateKeys(); // ["Setup","Moves","Gambits","AdvSqs"]
  const current = getCurrentBuffer();

  if (!current) return null;

  const startIdx = keys.indexOf(current);

  for (let i = startIdx - 1; i >= 0; i--) {
    const key = keys[i];
    if (getBufferLength(key) > 0) return key;
  }

  return null; // bottom sentry
}


export function getBufferIndex() {
  return bufferIndex;
  }
export function setBufferIndex(key, value) {
  bufferIndex[key] = value;
  }

export function getBufferLength(buffer) {
  const arr = state[buffer];
  return arr ? arr.length : 0;
  }
export function getStateKeys() {
  return Object.keys(state);
}

export function clearBuffer(buffer) { // Leaves meshes in scene, be sure to call the clear routine.
  console.log("model: state.js - clearBuffer(buffer):", buffer);
  state[buffer].length = 0;
  bufferIndex[buffer] = 0;
  }

export function prevKeyIndex() {
  const order = ["AdvSqs", "Gambits", "Moves", "Setup"];

  for (let k = 0; k < order.length; k++) {
    const key = order[k];
    let i = bufferIndex[key];

    if (i > 0) {
      i = i - 1;
      bufferIndex[key] = i;

      if (i > 0) {
        return { arrayKey: key, index: i - 1 };
      }

      // fall through to lower buffers
      for (let j = k + 1; j < order.length; j++) {
        const prevKey = order[j];
        const prevI = bufferIndex[prevKey];

        if (prevI > 0) {
          return { arrayKey: prevKey, index: prevI - 1 };
        }
      }

      return null;
    }
  }

  return null;
  }

export function nextKeyIndex() {
  const order = ["Setup", "Moves", "Gambits", "AdvSqs"];

  for (let k = 0; k < order.length; k++) {
    const key = order[k];
    let i = bufferIndex[key];
    const max = state[key].length;

    if (i < max) {
      bufferIndex[key] = i + 1;
      return { arrayKey: key, index: i };
    }

    for (let j = k + 1; j < order.length; j++) {
      const nextKey = order[j];
      const nextI = bufferIndex[nextKey];
      const nextMax = state[nextKey].length;

      if (nextI < nextMax) {
        bufferIndex[nextKey] = nextI + 1;
        return { arrayKey: nextKey, index: nextI };
      }
    }
  }

  return null;
}
/* ----- ----- ----- ----- */

export function trimStateToIndex(buffer) {
  console.log("model: state.js - trimStateToIndex(buffer):", buffer);

  if (!(buffer in state)) return;

  const i = bufferIndex[buffer];
  state[buffer] = state[buffer].slice(0, i);
  }

export function resetAllIndices() {
  console.log("model: state.js - resetAllIndices()");

  for (const key of Object.keys(bufferIndex)) {
    bufferIndex[key] = 0;
  }
  }

export function setBuffer(buffer, entries) {
  console.log("model: state.js - setBuffer(buffer, entries):", buffer, entries);

  if (!(buffer in state)) return;

  state[buffer] = structuredClone(entries);
  bufferIndex[buffer] = entries.length;
  }

export function getCurrentIndex(buffer) {
  return bufferIndex[buffer];
  }

export function isAtEnd(buffer) {
  return bufferIndex[buffer] === state[buffer].length;
  }

export function isAtBeg(buffer) {
  return bufferIndex[buffer] <= 1;
}
/* ----- ----- ----- ----- */

export function setState(newState) {
  state = structuredClone(newState);
  }

export function getState() {
  return state;
  }

export function setNull() {
  state = { Setup: [], Moves: [], Gambits: [], AdvSqs: [] };
  }

export function getNull() {
  return { Setup: [], Moves: [], Gambits: [], AdvSqs: [] };
}
/* ----- ----- ----- ----- */

export function insertState(buffer, values, idx) {
  console.log("model: state.js - insertState(buffer, values, idx):", buffer, values, idx);

  if (!(buffer in state)) {
    throw new Error(`Unknown state buffer: ${buffer}`);
  }

  const arr = state[buffer];
  if (!arr || idx < 0 || idx > arr.length) return;

  const i = bufferIndex[buffer];

  // Branch if inserting before current index
  if (idx < i) {
    state[buffer] = arr.slice(0, i);
  }

  state[buffer].splice(idx, 0, structuredClone(values));
  bufferIndex[buffer] = idx + 1;
  }

export function replaceState(buffer, values, idx) {
  console.log("model: state.js - replaceState(buffer, values, idx):", buffer, values, idx);

  if (!(buffer in state)) {
    throw new Error(`Unknown state buffer: ${buffer}`);
  }

  const arr = state[buffer];
  if (!arr || idx < 0 || idx >= arr.length) return;

  arr[idx] = structuredClone(values);
  bufferIndex[buffer] = idx + 1;
  }

export function deleteState(buffer, idx) {
  console.log("model: state.js - deleteState(buffer, idx):", buffer, idx);

  if (!(buffer in state)) {
    throw new Error(`Unknown state buffer: ${buffer}`);
  }

  const arr = state[buffer];
  if (!arr || idx < 0 || idx >= arr.length) return;

  arr.splice(idx, 1);

  const i = bufferIndex[buffer];
  if (i > idx) bufferIndex[buffer] = i - 1;
  }

export function truncateState(buffer, idx) {
  console.log("model: state.js - truncateState(buffer, idx):", buffer, idx);

  if (!(buffer in state)) {
    throw new Error(`Unknown state buffer: ${buffer}`);
  }

  const arr = state[buffer];
  if (!arr || idx < 0 || idx > arr.length) return;

  state[buffer] = arr.slice(0, idx);
  bufferIndex[buffer] = Math.min(bufferIndex[buffer], idx);
}

export function fetchPrevState(buffer) {
  const i = bufferIndex[buffer];
  if (i <= 1) return null;
  return state[buffer][i-2];  
  }

export function fetchNextState(buffer) {
  const i = bufferIndex[buffer];
  if (i >= getBufferLength(buffer)) return null;
  return state[buffer][i];  
}

/* Shortcut functions - make args clearer. */
export function fetchCurrentState(buffer) {
  const i = bufferIndex[buffer];
  if (i === 0) return null;
  return state[buffer][i-1];  
  }
  export const fetchCurrentSetup  = () => fetchCurrentState("Setup");
  export const fetchCurrentMove   = () => fetchCurrentState("Moves");
  export const fetchCurrentGambit = () => fetchCurrentState("Gambits");
  export const fetchCurrentAdvsq  = () => fetchCurrentState("AdvSqs");

export function replaceCurrentState(buffer, values) {
  const arr = state[buffer];
  if(!arr || !arr.length) return null;
  const i = bufferIndex[buffer];
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

  const i = bufferIndex[buffer];

  state[buffer] = state[buffer].slice(0, i);    // Branch truncates current buffer if mid-history.
  state[buffer].push(structuredClone(values));  // Push new state onto undo buffer.
  bufferIndex[buffer] = i + 1;                    // Advance the index.
  }
  export const pushNewSetup  = (values) => pushNewState("Setup",   values);
  export const pushNewMove   = (values) => pushNewState("Moves",   values);
  export const pushNewGambit = (values) => pushNewState("Gambits", values);
  export const pushNewAdvsq  = (values) => pushNewState("AdvSqs",  values);
/* ----- ----- ----- ----- */

export function collapseKeyIndex() {
  const order = ["AdvSqs", "Gambits", "Moves", "Setup"];

  for (const key of order) {
    const i = bufferIndex[key];

    if (i > 1) {
      bufferIndex[key] = 1;
      return { arrayKey: key, index: 0 };
    }
  }

  return null; // Bottom Sentry
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

