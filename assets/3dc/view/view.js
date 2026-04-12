/**
 * Module: <filename>
 * Layer: View (Projection & Visualization)
 *
 * Purpose:
 * Projects the abstract constraint system into human-readable form.
 *
 * Ontology:
 * - The board is a projection, not the system itself
 * - Visuals are approximations of higher-dimensional relations
 *
 * Responsibilities:
 * - Render board state
 * - Visualize manifolds (planes, perimeters)
 * - Display transitions and highlights
 *
 * Does NOT:
 * - Contain game logic
 * - Validate moves
 * - Define rules
 *
 * Inputs:
 * - Canonical state
 * - Transition descriptors
 * - Optional manifold traces
 *
 * Notes:
 * Avoid encoding logic assumptions in visuals (e.g., paths).
*/

/* File: view.js
  Path: ./3dc/view/view.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/02/26
  UI: the export functions.
*/

// --- Load JSON ---
import viewData from "./view.json" assert { type: "json" };
  const viewModule = viewData.view_module;
  const threeDCanvas = viewModule.threeDCanvas;   // 3D canvas, fixed, background.
  const gameCanvas   = viewModule.gameCanvas;     // 2D canvi, floating, draggable.
  const cameraCanvas = viewModule.cameraCanvas;
  const trayCanvas   = viewModule.trayCanvas;
  const moveCanvas   = viewModule.moveCanvas;
  const gambitCanvas = viewModule.gambitCanvas;
// Seampoint: more objects...

// --- Build upon previous layers ---
import * as run from "./registerHandlers.js";
import * as renders from "./render/renders.js";
import * as demos from "./demos.js";
// Seampoint: more imports...

// --- Demo for development ---
function demo(playBoard) {
  // Just testing the callback functions, actual use is event driven.
  // run.callback.game("Undo");
  // run.callback.camera("aCameraButton");

  if (!playBoard) return false;

  const context = renders.init(playBoard);

  demos.run(context);

  return;
}

// --- UI ---
export function init(playBoard) {
  console.log("view.init(): 3dc/view/init.js");

  const context = demo(playBoard);

  // Listeners: (The move listing is purely output, no input, therefore no wiring todo.)
  wirePanel("setup-window",  "setup",  buildSetupPayload);
  wirePanel("tray-window",   "tray",   buildTrayPayload);  // btn.disabled = false;
  wirePanel("game-window",   "game",   buildGamePayload);
  wirePanel("gambit-window", "gambit", buildGambitPayload);
  wirePanel("advsq-window",  "advsq",  buildAdvsqPayload);

  window.addEventListener("keydown", handleAdvsqKeys);

  wirePanel("camera-window", "camera", buildCameraPayload); // Not subject to the undo arch.
  // Seampoint - more listeners...

  return context;
}
// Seampoint: more global functions...

// --- Helpers ---
function wirePanel(panelId, callbackName, buildPayload) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  panel.addEventListener("change", (e) => {
    const cb = run.callback[callbackName];
    if (!cb) return;

    // --- Radios ---
    const radio = e.target.closest('input[type="radio"]');
    if (radio) {
      const action = radio.dataset.action;
      if (!action) return;

      cb({ action, value: radio.value });
      return;
    }

    // --- Inputs (advsq only) ---
    const input = e.target.closest('input');
    if (!input) return;

    if (callbackName !== "advsq") return;

    cb({
      action: "updateParam",
      name: input.name,
      value: input.value
    });
  });

  panel.addEventListener("click", (e) => {
    // --- Ignore radios (handled by change) ---
    if (e.target.closest('input[type="radio"]')) return;

    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    if (!action) return;

    const cb = run.callback[callbackName];
    if (!cb) return;

    const payload = buildPayload(panel, action);

    cb(payload);
  });
}

function handleAdvsqKeys(e) {
  if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

  const cb = run.callback.advsq;
  if (!cb) return;

  let axis = null;
  let delta = 0;

  const shift = e.shiftKey;

  switch (e.key.toLowerCase()) {
    case "k": axis = "z"; delta = shift ? -1 : +1; break;
    case "i": axis = "x"; delta = shift ? -1 : +1; break;
    case "j": axis = "y"; delta = shift ? -1 : +1; break;
    default: return;
  }

  e.preventDefault(); // <-- ALSO IMPORTANT

  cb({
    action: "nudgeSrc",
    axis,
    delta
  });
}

function buildSetupPayload(panel, action) {
  const selected = panel.querySelector('input[name="board-size"]:checked');

  return {
    action,
    boardSize: selected?.value
  };
  }

function buildTrayPayload(panel, action) {
  const selected = panel.querySelector('input[name="tray-type"]:checked');

  return {
    action,
    trayType: selected?.value
  };
  }

function buildGamePayload(panel, action) {
  return { action };
  }

function buildGambitPayload(panel, action) {
  return { action };
  }

function buildAdvsqPayload(panel, action) {
  return {
    action,
    srcTile:  panel.querySelector('[name="advsq-src"]')?.value,
    quad:     panel.querySelector('[name="advsq-quad"]')?.value,
    perimeter:panel.querySelector('[name="advsq-perimeter"]')?.value,
    stride:   panel.querySelector('[name="advsq-stride"]')?.value,
  };
}

function buildCameraPayload(panel, action) { // Not subject to the undo arch.
  return { action };
}

// Seampoint: more local functions...

