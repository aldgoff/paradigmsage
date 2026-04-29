/* File: registerHandlers.js
  Path: ./3dc/controller/registerHandlers.js
  Purpose: Offers interface to register callback functions.
  Author: Allan Goff
  Date: 4/07/26
  Recommended access: import * as run.
  UI: the export functions.
*/

// --- UI ---
export const callback = { // Allows rest of view layer easy access to control's dispatch functions.
  setup: null,    // Primary panels, under undo.
  move: null, 
  gambit: null,
  advsq: null,
  compass: null, 

  game: null,     // Undo system, etc.

  camera: null,   // Not subject to undo.
  viewer: null,
  // Seampoint - more callbacks...
}

export function setupControlDispatcher(fn)   { callback.setup   = fn; } // Primary panels, under undo.
export function moveControlDispatcher(fn)    { callback.move    = fn; }
export function gambitControlDispatcher(fn)  { callback.gambit  = fn; }
export function advsqControlDispatcher(fn)   { callback.advsq   = fn; }
export function compassControlDispatcher(fn) { callback.compass = fn; }

export function gameControlDispatcher(fn)    { callback.game   = fn; }  // Undo system, etc.

export function cameraControlDispatcher(fn)  { callback.camera = fn; }  // Not subject to undo.
export function viewerControlDispatcher(fn)  { callback.viewer = fn; }
// Seampoint - more dispatchers...

