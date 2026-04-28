/* File: controller.js
  Path: ./3dc/controller/controller.js
  Purpose: The player's interface to setting up, exploring, and playing the game.
  Author: Allan Goff
  Date: 4/02/26
  Recommended access: import * as control.
  UI: the export functions.
*/

/** Roles:
 * Layer: Controller (State Transition Orchestration)
 *
 * Purpose:
 * - Coordinates interaction between model and engine.
 * - Selects and applies legal transitions.
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
 * - Player input
 *
 * Outputs:
 * - New canonical state
 * - Transition descriptors
 *
 * Notes:
 * - The controller must not infer legality—it must defer to the engine.
*/

// --- Load JSON ---
// Seampoint: more objects...

// --- Build upon previous layers ---
import * as setup     from "../controller/setup/setup.js";
import * as moves     from "../controller/moves/moves.js";
import * as gambits   from "../controller/gambits/gambits.js";
import * as cAdvsqs   from "../controller/advsqs/advsqs.js";
import * as compasses from "../controller/compasses/compasses.js";

import * as game      from "../controller/game/game.js";

import * as camera    from "../controller/camera/camera.js";
import * as viewer    from "../controller/viewer/viewer.js";

import * as model    from "../model/model.js";
import * as state    from "../model/state/state.js";

import * as view     from "../view/view.js";
import * as register from "../view/registerHandlers.js";
import * as vAdvsqs  from "../view/advsqs/advsqs.js";

//TODO: DEPRECATED exampleRegistration
import * as example  from "../exampleRegistration/control.js";
// Seampoint: more imports...

// --- UI ---
export function init(playBoard) {
  console.log("controller.init(): 3dc/controller/controller.js");

  //TODO: DEPRECATED exampleRegistration
  // example.demoRegistration();

  makeDraggable(document.getElementById("setup-window"));   // DOM panels.
  makeDraggable(document.getElementById("move-window"));
  makeDraggable(document.getElementById("gambit-window"));
  makeDraggable(document.getElementById("advsq-window"));
  makeDraggable(document.getElementById("compass-window"));

  makeDraggable(document.getElementById("game-window"));    // Undo control for the previous 4 panels.

  makeDraggable(document.getElementById("camera-window")); // Not subject to undo.
  makeDraggable(document.getElementById("viewer-window"));
  // Seampoint - more 2D panels/canvi...

  callbacks();

  model.init(playBoard);
  view.init(playBoard);

  vAdvsqs.setAdvsqPanelInitialParams();

  // demo(); // POC for state interface and undo/redo architecture.
}
// Seampoint: more global functions...

// --- Globals ---
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

/*** ---------- ---------- ---------- ---------- ***/

// --- UI ---
function callbacks() {
  register.setupControlDispatcher(      setup.panelDispatch);  // Setup board, tray, and inital position.
  register.moveControlDispatcher(       moves.panelDispatch);  // Make and review moves.
  register.gambitControlDispatcher(   gambits.panelDispatch);  // Build a gambit.
  register.advsqControlDispatcher(    cAdvsqs.panelDispatch);  // Manipulate an advancement square.
  register.compassControlDispatcher(compasses.panelDispatch);  // Slip the advsq along rays or apex directions.

  register.gameControlDispatcher(        game.panelDispatch);  // Undo interface.

  register.cameraControlDispatcher(    camera.panelDispatch);  // Not subject to undo.
  register.viewerControlDispatcher(    viewer.panelDispatch);
  // Seampoint - register another dispatcher.
}

// --- Helpers ---
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

 // TODO: Deprecating demo code: create a fake state history, for dev undo arch.
/*** Demo Code */
import stateData from "../model/state/state.json" assert { type: "json" };
  const seed = stateData.state_module;     // Fake data from state.json.

function demo() {
  console.log("Demo undo/redo state architecture.");

  state.setNull();                                      // Initial state, all null.
  console.log(JSON.parse(JSON.stringify(state.getState())));

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

