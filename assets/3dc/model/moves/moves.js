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
  let sam = move.turn;  // Test access to json file.
  console.log("Sam", sam);
  // TODO: code model: moves - createState().

  const srcTile = payload.src;
  const dstTile = payload.dst;
  const secTile = payload.sec;

  let entry = {"turn": 1, "moves": ["P-K4,4", "P-Q4,3"], "coords": ["", ""], "annotations": ["", "..."] };
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

export function tableFormat(entry) {      // Convert a state entry into columnized string for the panel display.
  console.log("model: moves.js - tableFormat(entry)", entry);
  // TODO: code model: moves - tableFormat().
  let tableStr = "";
  return tableStr;
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

