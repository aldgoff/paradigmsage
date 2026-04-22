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

export function pushNewState(buffer, values) {
  if (!(buffer in state)) {
    throw new Error(`Unknown state buffer: ${buffer}`);
  }

  const i = undoIndex[buffer];

  // 🔥 Branch: truncate current buffer if mid-history
  state[buffer] = state[buffer].slice(0, i);

  // 🔥 Push new state
  state[buffer].push(structuredClone(values));

  // 🔥 Advance index
  undoIndex[buffer] = i + 1;
}
export function pushNewState1(buffer, values) {
  if(!(buffer in state)) {
    throw new Error(`Unknown state buffer: ${buffer}`);
  }
  state[buffer].push(structuredClone(values));
  }
export const pushNewSetup  = (values) => pushNewState("Setup",   values);
export const pushNewMoves  = (values) => pushNewState("Moves",   values);
export const pushNewGambit = (values) => pushNewState("Gambits", values);
export const pushNewAdvsq  = (values) => pushNewState("AdvSqs",  values);

export function getUndoIndex() {
  return undoIndex;
}
export function getBufferLength(buffer) {
  const arr = state[buffer];
  return arr ? arr.length : 0;
}
export function getStateKeys() {
  return Object.keys(state);
}
// Basic player sequence.
export function setup(option) {           // Pick a board, trays, rule enforcement, etc.
  console.log("model: state.js - setup(option):", option);
  // TODO: may have to erase later states and/or delete an existing board.
  // state.Setup.push(option);
  pushNewSetup(option);
  boards.makeBoard(option.board);
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

