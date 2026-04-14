/* File: controller.js
  Path: ./3dc/controller/controller.js
  Purpose: The player's interface to setting up and playing the game.
  Author: Allan Goff
  Date: 4/02/26
  UI: the export functions.
*/

/** Roles:
 * Layer: Controller (State Transition Orchestration)
 *
 * Purpose:
 * Coordinates interaction between model and engine.
 * Selects and applies legal transitions.
 *
 * Ontology:
 * - Does not "execute moves" in a procedural sense
 * - Resolves valid state transitions
 *
 * Responsibilities:
 * - Request manifold generation from engine
 * - Filter/select valid transitions
 * - Apply atomic state updates
 * - Manage turn sequence
 *
 * Does NOT:
 * - Define rules
 * - Compute manifolds
 * - Render UI
 *
 * Inputs:
 * - Current game state
 * - Player input or AI selection
 *
 * Outputs:
 * - New canonical state
 * - Transition descriptors
 *
 * Notes:
 * The controller must not infer legality—it must defer to the engine.
*/

// --- Load JSON ---
// Seampoint: more objects.

// --- Build upon previous layers ---
import * as view  from "../view/view.js";
import * as model  from "../model/model.js";
import * as state   from "../model/state/state.js";

import * as register from "./events.js";
import * as example   from "../exampleRegistration/control.js";
// Seampoint: more imports...

// --- UI ---
export function init(playBoard) {
  console.log("controller.init(): 3dc/controller/controller.js");
  example.demoRegistration();

  makeDraggable(document.getElementById("setup-window"));  // DOM panels.
  makeDraggable(document.getElementById("tray-window"));
  makeDraggable(document.getElementById("game-window"));
  makeDraggable(document.getElementById("move-window"));
  makeDraggable(document.getElementById("gambit-window"));
  makeDraggable(document.getElementById("advsq-window"));

  makeDraggable(document.getElementById("camera-window")); // Not subject to the undo arch.
  // Seampoint - more 2D panels/canvi...

  register.callbacks(); // TODO: register each panel with the view layer.

  model.init(playBoard);
  view.init(playBoard);

  demo(); // POC for state interface and undo/redo architecture.
}
// Seampoint: more global functions...

// --- Helpers ---
let activeDrag = null;
let topZ = 100;

window.addEventListener("pointermove", (e) => {
  if (!activeDrag) return;

  const { element, offsetX, offsetY } = activeDrag;

  element.style.left = `${e.pageX - offsetX}px`;
  element.style.top  = `${e.pageY - offsetY}px`;
  });

window.addEventListener("pointerup", () => {
  activeDrag = null;
});

function makeDraggable(element) {
  element.addEventListener("pointerdown", (e) => {
    if (["BUTTON", "TEXTAREA", "INPUT"].includes(e.target.tagName)) return;

    const rect = element.getBoundingClientRect();
    const elemX = rect.left + window.scrollX;
    const elemY = rect.top  + window.scrollY;

    activeDrag = {
      element,
      offsetX: e.pageX - elemX,
      offsetY: e.pageY - elemY
    };

    element.style.zIndex = ++topZ;
  });
}
// Seampoint: more local functions...

/*** Demo Code - to be deprecated. */
import stateData from "../model/state/state.json" assert { type: "json" };
  const seed = stateData.state_module;     // Fake data from state.json.

function demo() { // TODO: Deprecating: create a fake state history, for dev undo arch.
  console.log("Demo undo/redo state architecture.");

  state.setNull();                                      // Initial state, all null.
  console.log(JSON.parse(JSON.stringify(state.getState())));

  state.setup(seed.Setup[0]);                           // Make a board.
  state.setup(seed.Setup[1]);                           // Change mind.
  state.setup(seed.Setup[2]);                           // Again.
  console.log(JSON.parse(JSON.stringify(state.getState())));

  state.pushAdvSq(seed.AdvSqs[0]);                      // Explore an advancement square.
  state.pushAdvSq(seed.AdvSqs[1]);
  state.pushAdvSq(seed.AdvSqs[2]);
  console.log(JSON.parse(JSON.stringify(state.getState())));

  state.freeze(structuredClone(seed.AdvSqs[1]));                         // Add to Gambits.
  console.log(JSON.parse(JSON.stringify(state.getState())));

  state.recordMove(structuredClone(state.getState().Gambits[0]));       // Make a move from the Gambits.
  console.log(JSON.parse(JSON.stringify(state.getState())));

  state.pushAdvSq(seed.AdvSqs[0]);                      // Explore an advancement square.
  state.pushAdvSq(seed.AdvSqs[1]);
  state.pushAdvSq(seed.AdvSqs[2]);
  console.log(JSON.parse(JSON.stringify(state.getState())));

  state.freeze(structuredClone(state.getState().AdvSqs[1]));             // Add to Gambits.
  console.log(JSON.parse(JSON.stringify(state.getState())));

  state.pushAdvSq(seed.AdvSqs[0]);                      // Explore an advancement square.
  state.pushAdvSq(seed.AdvSqs[1]);
  state.pushAdvSq(seed.AdvSqs[2]);
  console.log(JSON.parse(JSON.stringify(state.getState())));

  state.freeze(structuredClone(state.getState().AdvSqs[0]));             // Add to Gambits.
  console.log(JSON.parse(JSON.stringify(state.getState())));

  state.pushAdvSq(seed.AdvSqs[0]);                      // Explore an advancement square.
  state.pushAdvSq(seed.AdvSqs[1]);
  state.pushAdvSq(seed.AdvSqs[2]);
  state.pushAdvSq(seed.AdvSqs[3]);
  console.log(JSON.parse(JSON.stringify(state.getState())));
}

