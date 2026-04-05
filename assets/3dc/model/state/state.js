/* File: state.js
  Path: ./3dc/model/state/state.js
  Purpose: The state of a 3D Chess game.
  Author: Allan Goff
  Date: 4/04/26
  UI: the export functions.
*/

/* Notes:
 * Will want to leverage JSON stringify and parse.
 * const str = JSON.stringify(setup);
 * const obj = JSON.parse(str);
 */

// --- Load JSON ---
import stateData from "./state.json" assert { type: "json" };
  const stateModule = stateData.state_module;
  const Setup    = stateModule.Setup;
  const Moves    = stateModule.Moves;
  const Gambits  = stateModule.Gambits;
  const Insights = stateModule.Gambits;
  const AdvSqs   = stateModule.AdvSqs;
  // Seampoint: more objects.

// --- Build upon previous layers ---
import * as view from "../../view/view.js";
import * as control from "../../controller/controller.js";
// Seampoint: more imports...

// --- UI ---
export function demo() {
  const stateStr = JSON.stringify(stateModule);
  console.log(stateStr);

  iterateState(stateData);
}

function iterateState(state) {
  const mod = state.state_module;

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

  console.log("Insights:");
  mod.Insights.forEach((entry, i) => {
    console.log(i, entry);
    // console.log(`Q:${entry.Q} ${entry.src} → ${entry.dst}`);
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

function iterateState1(stateObj) {
  const mod = stateObj.state_module;

  console.log("Setup:");
  mod.Setup.forEach((entry, i) => {
    console.log(i, entry);
  });

  console.log("Moves:");
  mod.Moves.forEach(move => {
    console.log(`Turn ${move.turn}:`, move.moves, move.coords, move.annotations);
  });

  console.log("Gambits:");
  mod.Gambits.forEach(g => {
    console.log(`Turn ${g.turn}:`, g.moves, g.coords, g.annotations);
  });

  console.log("Insights:");
  for (let i = 0; i < mod.Insights.length; i += 2) {
    const quad = mod.Insights[i];
    const pair = mod.Insights[i + 1];
    console.log(quad, pair);
  }

  console.log("AdvSqs:");
  mod.AdvSqs.forEach(([src, dst]) => {
    console.log(src, "→", dst);
  });
}

export function demo1() {
  console.log("State:", Setup, Moves, Gambits, Insights, AdvSqs);
  for(const state in stateModule) {
    console.log(state);
    for(const item of state) {
      console.log(item);
    }
  }

  console.log("State: {[Setup:{}; Moves:{}; Gambits:{}; Insight:{}; AdvSqs:{};]}");

  const str = JSON.stringify(Setup);
  const obj = JSON.parse(str);

  console.log(str);
  console.log(obj);

  const undoArray = obj;
  console.log("board...");
  for(let i=0; i<undoArray.length; i++) {
    console.log(undoArray[i]);
  }

  console.log("-----------");

}

