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
// Seampoint: more imports...


// --- UI ---
export function init() {
  console.log("view.init(): 3dc/view/init.js");
  const container = document.getElementById("3dc-game");
  if (!container) return false;

  const context = initThree(container);
  return context;
}
// Seampoint: more global functions...

