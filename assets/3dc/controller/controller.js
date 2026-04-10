/** Verbosity from the AI.
 * Module: <filename>
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

/* File: controller.js
  Path: ./3dc/controller/controller.js
  Purpose: The player's interface to setting up and playing the game.
  Author: Allan Goff
  Date: 4/02/26
  UI: the export functions.
*/

// --- Load JSON ---
import stateData from "../model/state/state.json" assert { type: "json" };
  const seed = stateData.state_module;     // Fake data from state.json.
// Seampoint: more objects.

// --- Build upon previous layers ---
import * as view from "../view/view.js";
import * as model from "../model/model.js";
import * as state from "../model/state/state.js";
import * as register from "../controller/eventHandler.js";
// Seampoint: more imports...

// --- UI ---
export function init(playBoard) {
  console.log("controller.init(): 3dc/controller/controller.js");

  makeDraggable(document.getElementById("game-window"));
  makeDraggable(document.getElementById("camera-window"));
  makeDraggable(document.getElementById("tray-window"));
  makeDraggable(document.getElementById("move-window"));
  makeDraggable(document.getElementById("gambit-window"));
  // Seampoint - more 2D canvases...

  /* Callback registration control flow:
   * Control: registers callback functions via view registration 
   * control.init() -> control/register.callbacks() -> 
   * control/eventHandlers/*GameDispatchers() -> view/registerHandlers/callback register.
   * view.init() -> view.demo() -> run.callback.whatever(control)
   */

  register.callbacks();

  model.init(playBoard);
  view.init(playBoard);

  demo(); // POC for state interface and undo/redo architecture.
}

function demo() { // Demo calls to model state arch: create a board and freeze an advsq.
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

  state.freeze(seed.AdvSqs[1]);                         // Add to insights.
  console.log(JSON.parse(JSON.stringify(state.getState())));

  state.pushAdvSq(seed.AdvSqs[0]);                      // Explore an advancement square.
  state.pushAdvSq(seed.AdvSqs[1]);
  state.pushAdvSq(seed.AdvSqs[2]);
  console.log(JSON.parse(JSON.stringify(state.getState())));

  state.freeze(state.getState().AdvSqs[2]);             // Add to insights.
  console.log(JSON.parse(JSON.stringify(state.getState())));

  state.recordMove(state.getState().Insights[1]);       // Make a move from the insights.
  console.log(JSON.parse(JSON.stringify(state.getState())));
}
// Seampoint: more global functions...

// --- Helpers ---
let topZ = 100;

function makeDraggable(element) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  element.addEventListener("pointerdown", (e) => {
    isDragging = true;

    // 🔥 bring to front
    element.style.zIndex = ++topZ;

    const rect = element.getBoundingClientRect();
    const elemX = rect.left + window.scrollX;
    const elemY = rect.top  + window.scrollY;

    offsetX = e.pageX - elemX;
    offsetY = e.pageY - elemY;

    element.setPointerCapture(e.pointerId);
  });

  window.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    element.style.left = `${e.pageX - offsetX}px`;
    element.style.top  = `${e.pageY - offsetY}px`;
  });

  window.addEventListener("pointerup", () => {
    isDragging = false;
  });
}

function getCanvasLocalCoords(canvas, e) {  // TODO: unused.
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
  }

function isInsideAnyButton(x, y, buttons) {  // TODO: unused.
  return buttons.some(b =>
    x >= b.x && x <= b.x + b.w &&
    y >= b.y && y <= b.y + b.h
  );
}
// Seampoint: more local functions...

