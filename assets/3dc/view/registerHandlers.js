/* File: registerHandlers.js
  Path: ./3dc/controller/registerHandlers.js
  Purpose: Offers interface to register callback functions.
  Author: Allan Goff
  Date: 4/07/26
  UI: the export functions.
*/

export const callback = { // Allows rest of view layer easy access to control's dispatch functions.
  setup: null,
  tray: null, 
  game: null, 
  move: null, 
  gambit: null,
  advsq: null,

  camera: null, // Not subject to the undo arch.
  // Seampoint - more callbacks...
}

export function setupControlDispatcher(fn)  { callback.setup  = fn; }
export function trayControlDispatcher(fn)   { callback.tray   = fn; }
export function gameControlDispatcher(fn)   { callback.game   = fn; }
export function moveControlDispatcher(fn)   { callback.move   = fn; }
export function gambitControlDispatcher(fn) { callback.gambit = fn; }
export function advsqControlDispatcher(fn)  { callback.advsq  = fn; }

export function cameraControlDispatcher(fn) { callback.camera = fn; } // Not subject to the undo arch.
// Seampoint - more dispatchers...

