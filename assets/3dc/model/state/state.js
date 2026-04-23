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
import * as model  from "../../model/model.js";
import * as coords from "../../foundation/coords/coords.js";  // normalizeTileToVts().

import * as view   from "../../view/view.js";
import * as boards from "../../view/boards/boards.js";
import * as advsqs from "../../view/advsqs/advsqs.js";
// Seampoint: more imports...

let state = { // This is the state history of the game: setup-moves-gambits-advsqs.
  Setup:   [],
  Moves:   [],
  Gambits: [],
  AdvSqs:  []
  };

let undoIndex = { // undoIndex[key][0] = pointer to NEXT item to apply.
  Setup:   0,
  Moves:   0,
  Gambits: 0,
  AdvSqs:  0
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
  if(!arr || !arr.length) return null;
  return arr[arr.length - 1];
  }
export const fetchCurrentSetup  = () => fetchCurrentState("Setup");
export const fetchCurrentMoves  = () => fetchCurrentState("Moves");
export const fetchCurrentGambit = () => fetchCurrentState("Gambits");
export const fetchCurrentAdvsq  = () => fetchCurrentState("AdvSqs");

export function replaceCurrentState(buffer, values) {
  const arr = state[buffer];
  if(!arr || !arr.length) return null;
  arr[arr.length - 1] = structuredClone(values);
  }
export const replaceCurrentSetup  = (values) => replaceCurrentState("Setup",   values);
export const replaceCurrentMoves  = (values) => replaceCurrentState("Moves",   values);
export const replaceCurrentGambit = (values) => replaceCurrentState("Gambits", values);
export const replaceCurrentAdvsq  = (values) => replaceCurrentState("AdvSqs",  values);

export function clearBuffer(buffer) {
  console.log("model: state.js - clearBuffer(buffer):", buffer);
  state[buffer].length = 0;
  undoIndex[buffer] = 0;
}

export function pushNewState(buffer, values) {
  console.log("model: state.js - pushNewState(buffer, values):", buffer, values);

  if (!(buffer in state)) {
    throw new Error(`Unknown state buffer: ${buffer}`);
  }

  const i = undoIndex[buffer];

  state[buffer] = state[buffer].slice(0, i);    // Branch truncates current buffer if mid-history.
  state[buffer].push(structuredClone(values));  // Push new state onto undo buffer.
  undoIndex[buffer] = i + 1;                    // Advance the index.
  }
export const pushNewSetup  = (values) => pushNewState("Setup",   values);
export const pushNewMoves  = (values) => pushNewState("Moves",   values);
export const pushNewGambit = (values) => pushNewState("Gambits", values);
export const pushNewAdvsq  = (values) => pushNewState("AdvSqs",  values);


export function currentKeyAndIndex() {
  const order = ["AdvSqs", "Gambits", "Moves", "Setup"];
  const undo = undoIndex;

  for (const key of order) {
    const i = undo[key];
    if (i > 0) {
      return { key, index: i - 1 };
    }
  }

  return { arrayKey: "Sentry", index: -1 };
  }

export function currentKeyIndex() {
  const order = ["AdvSqs", "Gambits", "Moves", "Setup"];
  const undo = undoIndex;

  for (const key of order) {
    const i = undo[key];
    if (i > 0) {
      return { arrayKey: key, index: i - 1 };
    }
  }

  return { arrayKey: "Sentry", index: -1 };
  }

export function prevKeyIndex() {
  const order = ["AdvSqs", "Gambits", "Moves", "Setup"];

  for (let k = 0; k < order.length; k++) {
    const key = order[k];
    let i = undoIndex[key];

    if (i > 0) {
      i = i - 1;
      undoIndex[key] = i;

      if (i > 0) {
        return { arrayKey: key, index: i - 1 };
      }

      // fall through to lower buffers
      for (let j = k + 1; j < order.length; j++) {
        const prevKey = order[j];
        const prevI = undoIndex[prevKey];

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
    let i = undoIndex[key];
    const max = state[key].length;

    if (i < max) {
      undoIndex[key] = i + 1;
      return { arrayKey: key, index: i };
    }

    for (let j = k + 1; j < order.length; j++) {
      const nextKey = order[j];
      const nextI = undoIndex[nextKey];
      const nextMax = state[nextKey].length;

      if (nextI < nextMax) {
        undoIndex[nextKey] = nextI + 1;
        return { arrayKey: nextKey, index: nextI };
      }
    }
  }

  return null;
}

export function fetchFromIndex(buffer) {
  const i = undoIndex[buffer];
  if (i === 0) return null;
  return state[buffer][i - 1];
}

export function getUndoIndex() {
  return undoIndex;
  }
export function setUndoIndex(key, value) {
  undoIndex[key] = value;
}
export function getBufferLength(buffer) {
  const arr = state[buffer];
  return arr ? arr.length : 0;
  }
export function getStateKeys() {
  return Object.keys(state);
}

export function clearHigherBuffers(fromKey) {
  const order = ["AdvSqs", "Gambits", "Moves", "Setup"];
  const k = order.indexOf(fromKey);

  for (let i = 0; i < k; i++) {
    const key = order[i];
    undoIndex[key] = 0;
  }
}

// Basic player sequence.
export function setup(payload) {           // Pick a board, trays, rule enforcement, etc.
  console.log("model: state.js - setup(payload):", payload);
  const { action, boardSize, trayType, trayGap } = payload;

  const board = boardSize.split("x").map(n => Number(n));
  const newBoard = { "board": board, "play": "off", trayType, trayGap, "initialPos": "std" };

  // TODO: may have to erase later states and/or delete an existing board.
  pushNewSetup(payload);
  console.log("model: state.js - setup()...getState()", getState());
  boards.makeBoard(board);
  }

export function addTrays(option) {           // Pick a board, trays, rule enforcement, etc.
  console.log("model: state.js - addTrays(option):", option);
  // TODO: may have to erase later states and/or delete an existing board.
  pushNewSetup(option);
  console.log("model: state.js - setup()...getState()", getState());
  // boards.makeBoard(option.board);
  }

export function pushAdvSq(specs) {        // Manipulate an advancement square.
  console.log("model: state.js - pushAdvSq(specs):", specs);
  state.AdvSqs.push(specs);           // Update state history.
  advsqs.makeAdvsq(specs);            // Render.
  advsqs.setAdvsqPanelParams(specs);  // Update the panel.
  }

export function clearAdvSqs() {
  console.log("model: state.js - clearAdvSqs():");

  const initial = advsqs.getAdvsqPanelInitialParams();  // Normalize initial primary fields.
  let params = normalize(initial);
  advsqs.setAdvsqPanelParams(params);

  state.AdvSqs = [];
  advsqs.clearAdvsq();
  }

export function freeze(advsq) {           // Freeze each on board to generate gambit.
  state.Gambits.push(structuredClone(advsq));
  state.AdvSqs.length = 0;
  }

export function recordMove(gambit) {      // Select a move from the gambit set of advsqs.
  state.Moves.push(structuredClone(gambit));
  // state.Gambits.length = 0;
}
// Seampoint: more global functions...

// --- Helpers ---
function normalize(payload) { // Convert panel strings to numbers, arrays, etc.
  let { srcTile, quad, perimeter, stride, opacity } = payload;  // Unpack primary fields.

  srcTile   = coords.normalizeTileToVts(srcTile);               // Convert numeric fields.
  quad      = Number(quad);  
  perimeter = Number(perimeter);
  stride    = Number(stride);
  opacity   = Number(opacity);

  const normed = { srcTile, quad, perimeter, stride, opacity }; // Repack primary fields.

  return normed;
}

// To be deprecated as dev progresses...useful javascript weirdness.
function iterateState(stateData) {
  const mod = stateData.state_module;

  // Javescript - weirdness...
    // mod.Name.forEach((element, index) => {...});   // Element and index.
    // mod.Name.forEach(element => {...});            // Element only, no index.
    // mod.Name.forEach(n => {...});                  // Indicate element (n) stands for Name.

  console.log("Setup:");
  mod.Setup.forEach((entry, i) => {
    console.log(i, entry);
  });

  console.log("Moves:");
  mod.Moves.forEach((entry, i) => {
    console.log(i, entry);
  });

  console.log("Gambits:");
  mod.Gambits.forEach((entry, i) => {
    console.log(i, entry);
  });

  console.log("AdvSqs:");
  mod.AdvSqs.forEach((entry, i) => {
    console.log(i, entry);
  });
}
// Seampoint: more local functions...

