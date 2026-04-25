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
  const seed = stateData.state_module;
// Seampoint: more objects.

// --- Build upon previous layers ---
import * as coords from "../../foundation/coords/coords.js";  // normalizeTileToVts().
// Seampoint: more imports...

let state = { // This is the state history of the game: setup-moves-gambits-advsqs.
  Setup:   [],
  Moves:   [],
  Gambits: [],
  AdvSqs:  []
  };

let bufferCount = { // bufferCount[key][0] = count of elements in buffer.
  Setup:   0,
  Moves:   0,
  Gambits: 0,
  AdvSqs:  0
}

export function getBufferCount() {
  return bufferCount;
  }
export function setBufferCount(key, value) {
  bufferCount[key] = value;
}

export function getBufferLength(buffer) {
  const arr = state[buffer];
  return arr ? arr.length : 0;
  }
export function getStateKeys() {
  return Object.keys(state);
}

// TODO: Leaves meshes in the scene.
export function clearBuffer(buffer) {
  console.log("model: state.js - clearBuffer(buffer):", buffer);
  state[buffer].length = 0;
  bufferCount[buffer] = 0;
}

export function prevKeyIndex() {
  const order = ["AdvSqs", "Gambits", "Moves", "Setup"];

  for (let k = 0; k < order.length; k++) {
    const key = order[k];
    let i = bufferCount[key];

    if (i > 0) {
      i = i - 1;
      bufferCount[key] = i;

      if (i > 0) {
        return { arrayKey: key, index: i - 1 };
      }

      // fall through to lower buffers
      for (let j = k + 1; j < order.length; j++) {
        const prevKey = order[j];
        const prevI = bufferCount[prevKey];

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
    let i = bufferCount[key];
    const max = state[key].length;

    if (i < max) {
      bufferCount[key] = i + 1;
      return { arrayKey: key, index: i };
    }

    for (let j = k + 1; j < order.length; j++) {
      const nextKey = order[j];
      const nextI = bufferCount[nextKey];
      const nextMax = state[nextKey].length;

      if (nextI < nextMax) {
        bufferCount[nextKey] = nextI + 1;
        return { arrayKey: nextKey, index: nextI };
      }
    }
  }

  return null;
}

// --- UI ---
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

export function fetchCurrentState(buffer) {
  const arr = state[buffer];
  const i = bufferCount[buffer];
  if (i === 0) return null;
  return arr[i - 1];  
  }
export const fetchCurrentSetup  = () => fetchCurrentState("Setup");
export const fetchCurrentMoves  = () => fetchCurrentState("Moves");
export const fetchCurrentGambit = () => fetchCurrentState("Gambits");
export const fetchCurrentAdvsq  = () => fetchCurrentState("AdvSqs");

export function replaceCurrentState(buffer, values) {
  const arr = state[buffer];
  if(!arr || !arr.length) return null;
  const i = bufferCount[buffer];
  if (i === 0) return null;
  arr[i - 1] = structuredClone(values);  
  }
export const replaceCurrentSetup  = (values) => replaceCurrentState("Setup",   values);
export const replaceCurrentMoves  = (values) => replaceCurrentState("Moves",   values);
export const replaceCurrentGambit = (values) => replaceCurrentState("Gambits", values);
export const replaceCurrentAdvsq  = (values) => replaceCurrentState("AdvSqs",  values);

export function pushNewState(buffer, values) {
  console.log("model: state.js - pushNewState(buffer, values):", buffer, values);

  if (!(buffer in state)) {
    throw new Error(`Unknown state buffer: ${buffer}`);
  }

  const i = bufferCount[buffer];

  state[buffer] = state[buffer].slice(0, i);    // Branch truncates current buffer if mid-history.
  state[buffer].push(structuredClone(values));  // Push new state onto undo buffer.
  bufferCount[buffer] = i + 1;                    // Advance the index.
  }
export const pushNewSetup  = (values) => pushNewState("Setup",   values);
export const pushNewMoves  = (values) => pushNewState("Moves",   values);
export const pushNewGambit = (values) => pushNewState("Gambits", values);
export const pushNewAdvsq  = (values) => pushNewState("AdvSqs",  values);

export function collapseKeyIndex() {
  const order = ["AdvSqs", "Gambits", "Moves", "Setup"];

  for (const key of order) {
    const i = bufferCount[key];

    if (i > 1) {
      bufferCount[key] = 1;
      return { arrayKey: key, index: 0 };
    }
  }

  return null; // Bottom Sentry
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

