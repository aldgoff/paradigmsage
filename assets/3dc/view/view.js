/* File: view.js
  Path: ./3dc/view/view.js
  Purpose: Interface to the view layer, render board, wire the panels, and add event listeners.
  Author: Allan Goff
  Date: 4/02/26
  Recommended access: import * as view.
  UI: the export functions.
*/

/** Roles:
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

// --- Load JSON ---
// Seampoint: more objects...

// --- Build upon previous layers ---
import * as run        from "./registerHandlers.js";
import * as renders    from "./render/renders.js";
import * as coordsMaps from "./render/coordsMaps.js";
import * as demos      from "./demos.js";
import * as tiles      from "./tiles/tiles.js";
import * as game       from "../controller/game/game.js";
// Seampoint: more imports...

export let context;

// --- Demo for development ---
function demo(playBoard) {
  if (!playBoard) return false;

  const context = renders.init(playBoard);

  demos.run(context);

  return;
}

// --- UI ---
export function init(playBoard) { // PlayBoard is the 3D canvas from the THREE renderer.
  console.log("view.init(): 3dc/view/init.js");

  if(false) {  // POC.
    const context = demo(playBoard); // Display POC board, decorators, raycasting.
  }
  else {      // Growing the panel and undo features.
    context = renders.init(playBoard);
    context.tileMap = new Map();
    context.tileGeometry = new THREE.BoxGeometry(...coordsMaps.vts2xyz(tiles.tileSize()));
    // demos.run(context);
  }

  // Listeners: (The move listing is purely output, no input, therefore no wiring todo.)

  // wireSimplePanel("tray-window",   "tray",   buildTrayPayload);  // btn.disabled = false;

  wireSetupPanel( "setup-window",  "setup",  buildSetupPayload);
  wireSimplePanel("game-window",   "game",   buildGamePayload);
  wireSimplePanel("gambit-window", "gambit", buildGambitPayload);
  wireAdvsqPanel( "advsq-window",  "advsq",  buildAdvsqPayload);

  window.addEventListener("keydown", handleAdvsqKeys);

  wireSimplePanel("camera-window", "camera", buildCameraPayload); // Not subject to the undo arch.
  // Seampoint - more listeners...

  game.showUndoStatus();

  return;
}
// Seampoint: more global functions...

// --- Helpers ---
function wireSimplePanel(panelId, callbackName, buildPayload) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  const cb = run.callback[callbackName];
  if (!cb) return;

  // --- Radios (change → immediate action) ---
  panel.addEventListener("change", (e) => {
    const radio = e.target.closest('input[type="radio"]');
    if (!radio) return;

    const action = radio.dataset.action;
    if (!action) return;

    cb({
      action,
      value: radio.value
    });
  });

  // --- Buttons (click → full payload) ---
  panel.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    if (!action) return;

    const payload = buildPayload(panel, action);
    cb(payload);
  });
  }

function wireSetupPanel(panelId, callbackName, buildPayload) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  const cb = run.callback[callbackName];
  if (!cb) return;

  // --- Change events (ALL inputs → full payload) ---
  panel.addEventListener("change", (e) => {
    // const input = e.target.closest("input");
    const input = e.target.closest('input[name="tray-gap"]');
    if (!input) return;

    const payload = buildPayload(panel, "updateParam");
    cb(payload);
  });

  // --- Click events (buttons → full payload with action) ---
  panel.addEventListener("click", (e) => {
    // ignore radios (handled in change)
    if (e.target.closest('input[type="radio"]')) return;

    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    if (!action) return;

    const payload = buildPayload(panel, action);
    cb(payload);
  });
  }

function wireAdvsqPanel(panelId, callbackName, buildPayload) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  const cb = run.callback[callbackName];
  if (!cb) return;

  // --- Change events (ALL inputs → full payload) ---
  panel.addEventListener("change", (e) => {
    const input = e.target.closest("input");
    if (!input) return;

    const payload = buildPayload(panel, "updateParam");
    cb(payload);
  });

  // --- Click events (buttons → full payload with action) ---
  panel.addEventListener("click", (e) => {
    // ignore radios (handled in change)
    if (e.target.closest('input[type="radio"]')) return;

    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    if (!action) return;

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
  console.log("     ---------- view: view.js");
  return {
    action,
    boardSize:  panel.querySelector('input[name="board-size"]:checked')?.value,
    trayType:   panel.querySelector('input[name="tray-type"]:checked')?.value,
    visible:    panel.querySelector('input[name="tray-visible"]')?.value,
    initialPos: panel.querySelector('input[name="initial-pos"]')?.value,
    trayGap:    panel.querySelector('input[name="tray-gap"]')?.value,
  };
  }

function buildTrayPayload(panel, action) {
  const selected = panel.querySelector('input[name="tray-type"]:checked')?.value;

  console.log("     ---------- view: view.js");
  return {
    action,
    trayType: selected?.value
  };
  }

function buildGamePayload(panel, action) {
  console.log("     ---------- view: view.js");
  return { action };
  }

function buildGambitPayload(panel, action) {
  console.log("     ---------- view: view.js");
  return { action };
  }

function buildAdvsqPayload(panel, action) {
  console.log("     ---------- view: view.js");
  return {
    action,
    srcTile:  panel.querySelector('[name="advsq-src"]')?.value,
    quad:     panel.querySelector('[name="advsq-quad"]')?.value,
    perimeter:panel.querySelector('[name="advsq-perimeter"]')?.value,
    stride:   panel.querySelector('[name="advsq-stride"]')?.value,
    opacity:  panel.querySelector('[name="advsq-opacity"]')?.value,
  };
}

function buildCameraPayload(panel, action) { // Not subject to the undo arch.
  return { action };
}

// Seampoint: more local functions...

