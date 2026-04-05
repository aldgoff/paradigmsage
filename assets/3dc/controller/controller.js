/**
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
  Purpose: desc
  Author: Allan Goff
  Date: 4/02/26
  UI: the export functions.
*/

// --- Load JSON ---
// Seampoint: more objects...

// --- Build upon previous layers ---
import * as view from "../view/view.js";
import * as model from "../model/model.js";
// Seampoint: more imports...

// --- UI ---
export function init(playBoard) {
  console.log("controller.init(): 3dc/controller/controller.js");

  makeDraggable(document.getElementById("game-window"));
  makeDraggable(document.getElementById("listing-window"));
  makeDraggable(document.getElementById("tray-window"));
  makeDraggable(document.getElementById("gambit-window"));
  makeDraggable(document.getElementById("camera-window"));
  // Seampoint - more 2D canvases...

  const setup = model.init(playBoard);
  const context = view.init(playBoard);
}
// Seampoint: more global functions...

// --- Helpers ---
function makeDraggable(element) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  element.addEventListener("pointerdown", (e) => {
    isDragging = true;
    const rect = element.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  });

  window.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    element.style.left = `${e.clientX - offsetX}px`;
    element.style.top  = `${e.clientY - offsetY}px`;
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

