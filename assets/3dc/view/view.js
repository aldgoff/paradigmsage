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
// Seampoint: more objects...

// --- Build upon previous layers ---
import { initThree } from "./render/initThree.js";
import { LAYOUT_3DC } from "../layout.js";
// Seampoint: more imports...


// --- UI ---
export function init(playBoard) {
  console.log("view.init(): 3dc/view/init.js");
  if (!playBoard) return false;

  const context = initThree(playBoard);

  drawCanvasTitles();

  drawLayoutBounds();

  return context;
}
// Seampoint: more global functions...

// --- Helpers ---
// Labels the 2D control canvases.
function drawCanvasTitles(layout = LAYOUT_3DC) {
  drawCanvasTitle("3dc-game",    "gameCanvas");
  drawCanvasTitle("3dc-camera",  "cameraCanvas");
  drawCanvasTitle("3dc-tray",    "trayCanvas");
  drawCanvasTitle("3dc-listing", "listingCanvas");
  drawCanvasTitle("3dc-gambit",  "gambitCanvas");
  // Seampoint - more 2D canvases...
}

function drawCanvasTitle(id_3dc, layoutLabel) {
  const canvas = document.getElementById(id_3dc);
  const ctx    = canvas.getContext("2d");
  const element = LAYOUT_3DC[layoutLabel];

  ctx.save();
    ctx.fillStyle = "#888";
    ctx.font = "12px sans-serif";
    ctx.fillText(element.name, 4, 14);
  ctx.restore();
}

function drawLayoutBounds(layout = LAYOUT_3DC) {
  for (const layout_key in layout) { // Outline each graphical element in layout.
    if(     layout_key === "gameCanvas") {
      const canvas = document.getElementById("3dc-game");
      const ctx = canvas.getContext("2d");
      const element = layout[layout_key];

      ctx.save();
        ctxDefaults(ctx);
        for(const button of element.controls.buttons) {
          ctx.strokeRect(button.x, button.y, button.w, button.h);
          ctx.fillText(button.label, button.x + 4, button.y + 14);
        }
      ctx.restore();
      }
    else if(layout_key === "cameraCanvas") {
      }
    else if(layout_key === "trayCanvas") {
      }
    else if(layout_key === "listingCanvas") {
      }
    else if(layout_key === "gambitCanvas") {
      }
    else {
      // console.log("No code yet to outline graphical elements in", layout_key);
    }
    // Seampoint - more 2D canvases...
  }
}

function ctxDefaults(ctx) {
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#888";
  ctx.font = "12px sans-serif";
}

