/* File: state.js
  Path: ./3dc/model/state/state.js
  Purpose: The state of a 3D Chess game.
  Author: Allan Goff
  Date: 4/06/26
  UI: the export functions.
*/

/* JSON stringify and parse syntax:
 * Will want to leverage JSON stringify and parse.
 * const str = JSON.stringify(setup);
 * const obj = JSON.parse(str);
*/

// --- Load JSON ---
import stateData from "./state.json" assert { type: "json" };
  const seed = stateData.state_module;
// Seampoint: more objects.

// --- Build upon previous layers ---
import * as model from "../../model/model.js";
import * as view   from "../../view/view.js";
import * as control from "../../controller/controller.js";

import * as boards from "../../view/boards/boards.js";

// Seampoint: more imports...

let state = { // This is the state of the game: board/moves/gambits/advsq.
  Setup:   [],
  Moves:   [],
  Gambits: [],
  AdvSqs:  []
};

// --- UI ---
export function getState() {
  return state;
  }

export function getNull() {
  return { Setup: [], Moves: [], Gambits:[], AdvSqs: [] };
  }

export function setNull() {
  state = { Setup: [], Moves: [], Gambits:[], AdvSqs: [] };
}

// Basic player sequence.
export function setup(option) {           // Pick a board, trays, rule enforcement, etc.
  // TODO: may have to erase later states and/or delete an existing board.
  state.Setup.push(option);
  boards.makeBoard(option.board);
  }

export function pushAdvSq(advsq) {        // Manipulate an advancement square.
  state.AdvSqs.push(advsq);
  }

export function freeze(advsq) {           // Freeze each on board to generate gambit.
  state.Gambits.push(structuredClone(advsq));
  state.AdvSqs.length = 0;
  }

export function recordMove(gambit) {     // Select a move from the gambit set of advsqs.
  state.Moves.push(structuredClone(gambit));
  // state.Gambits.length = 0;
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
    // console.log(`Turn ${entry.turn}:`);
    // console.log("  Moves:", entry.moves.join(" | "));
    // console.log("  Coords:", entry.coords.join(" | "));
    // console.log("  Notes:", entry.annotations.join(" | "));
  });

  console.log("Gambits:");
  mod.Gambits.forEach((entry, i) => {
    console.log(i, entry);
    // mod.Gambits.forEach(g => {
      // console.log(`Turn ${entry.turn}:`);
      // console.log("  Moves:", entry.moves.join(" | "));
      // console.log("  Coords:", entry.coords.join(" | "));
      // console.log("  Notes:", entry.annotations.join(" | "));
  });

  console.log("AdvSqs:");
  mod.AdvSqs.forEach((entry, i) => {
    console.log(i, entry);
  });

  // mod.AdvSqs.forEach(a => {
  //   console.log(`${a.src} → ${a.dst}`);
  // });
  // mod.AdvSqs.forEach((entry, i) => {
  //   console.log(`${entry.src} → ${entry.dst}`);
  // });
}

