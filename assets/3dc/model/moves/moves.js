/* File: moves.js
  Path: ./3dc/model/moves/moves.js
  Purpose: The moves portion of the state of the game.
  Author: Allan Goff
  Date: 4/30/26
  Recommended access: import * as mMoves from ../../model/moves/moves.js
  UI: the export functions.
*/

// --- Load JSON ---
import movesData from "./moves.json" assert { type: "json" };
  const movesModule = movesData.moves_module;
  const move  = movesModule.Move;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as planes from "../../geometry/planes/planes.js";
  import * as quads  from "../../geometry/quads/quads.js";
// Seampoint: more imports...

// --- UI ---
export function stringifyBuffer(buffer) { // Convert array of state entries, to be used by load/save.
  console.log("model: moves.js - stringifyBuffer()");
  // TODO: code model: moves - stringifyBuffer().
  let strings = [];
  return strings;
  }

export function parseBuffer(strings) {    // Convert array of state strings, to be used by load/save.
  console.log("model: moves.js - stringify()");
  // TODO: code model: moves - parseBuffer().
  let buffer = []; // An array of state buffers, to be used by load/save.
  return buffer;
}

export function createState(payload, index) { // Create the state entry from raw data.
  console.log("model: moves.js - createState(payload, index)", payload, index);
  // TODO: code model: moves - createState().

  let { action, player, piece, src, dst, sec, capture, opts } = payload;
  let turn = Math.floor((index + 1) / 2);
  let entry = { turn, player, piece, src, action, dst, sec };

  return entry;
  }

export function stringify(entry) {        // Convert a state entry to a state string.
  console.log("model: moves.js - stringify(entry)", entry);
  // TODO: code model: moves - stringify().
  let str = "";
  return str;
  }

export function parse(str) {              // Convert a state string to a state entry.
  console.log("model: moves.js - parse(str)", str);
  // TODO: code model: moves - parse().
  let entry = {};
  return entry;
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

