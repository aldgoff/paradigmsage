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

  drawCanvasTitles();
  drawLayoutBounds();

  demos.run(context);

  return;
}

// --- UI ---
export function init(playBoard) {
  console.log("view.init(): 3dc/view/init.js");

  const context = demo(playBoard);

  // Listeners:
  wirePanel("setup-window",  "setup",  buildSetupPayload);
  wirePanel("tray-window",   "tray",   buildTrayPayload);  // btn.disabled = false;  // When tray state changes, the view layer should enable this.
  wirePanel("game-window",   "game",   buildGamePayload);
  wirePanel("gambit-window", "gambit", buildGambitPayload);

  wirePanel("camera-window", "camera", buildCameraPayload); // Not subject to the undo arch.
  // Seampoint - more listeners...

  return context;
}
// Seampoint: more global functions...

// --- Helpers ---
// Labels the 2D control canvases.
function drawCanvasTitles() {
  drawCanvasTitle("3dc-move",   "moveCanvas");
  // drawCanvasTitle("3dc-setup",  "setupCanvas");
  // drawCanvasTitle("3dc-tray",   "trayCanvas");
  // drawCanvasTitle("3dc-game",   "gameCanvas");
  // drawCanvasTitle("3dc-gambit", "gambitCanvas");

  // drawCanvasTitle("3dc-camera", "cameraCanvas");
  // Seampoint - no more 2D canvases...
  }

function drawCanvasTitle(id_3dc, layoutLabel) { // Deprecating...
  const canvas = document.getElementById(id_3dc);
  const ctx    = canvas.getContext("2d");
  const element = viewModule[layoutLabel];

  ctx.save();
    ctx.fillStyle = "#888";
    ctx.font = "12px sans-serif";
    ctx.fillText(element.name, 4, 14);
  ctx.restore();
  }

function drawLayoutBounds(layout = viewModule) { // Deprecating...
  for (const layout_key in layout) { // Outline each graphical element in layout.
    if(     layout_key === "gameCanvas") {
      // const canvas = document.getElementById("3dc-game");
      // const ctx = canvas.getContext("2d");
      // const element = layout[layout_key];

      // ctx.save();
      //   ctxDefaults(ctx);
      //   for(const button of element.controls.buttons) {
      //     ctx.strokeRect(button.x, button.y, button.w, button.h);
      //     ctx.fillText(button.label, button.x + 4, button.y + 14);
      //   }
      // ctx.restore();
      }
    else if(layout_key === "cameraCanvas") {
      }
    else if(layout_key === "trayCanvas") {
      }
    else if(layout_key === "moveCanvas") {
      }
    else if(layout_key === "gambitCanvas") {
      }
    else {
      // console.log("No code yet to outline graphical elements in", layout_key);
    }
    // Seampoint - more 2D canvases...
  }
  }

function ctxDefaults(ctx) { // Deprecating...
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#888";
  ctx.font = "12px sans-serif";
}

function wirePanel(panelId, callbackName, buildPayload) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  panel.addEventListener("click", (e) => {
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

function buildCameraPayload(panel, action) { // Not subject to the undo arch.
  return { action };
}

// Seampoint: more local functions...

