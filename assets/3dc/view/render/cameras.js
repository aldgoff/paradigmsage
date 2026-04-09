/* File: cameras.js
  Path: ./3dc/view/render/cameras.js
  Purpose: Interface to the camera controls, POV on the board, zoom, etc.
  Author: Allan Goff
  Date: 4/09/26
  UI: the export functions.
*/

// --- Load Libraries ---
const THREE = window.THREE;

// --- Load JSON ---
import camerasData from "./cameras.json" assert { type: "json" };
  const camerasModule = camerasData.cameras_module;
  const category  = camerasModule.category;
  const POV  = camerasModule.POV;
  // Seampoint: more objects.

// --- Build upon previous layers ---
// Seampoint: more imports.

let camera = null;
let zoom   = 1000;          // Most useful: 400 - 1500.
let pov    = POV.neutral;   // JSON.
let focalPoint = [0,0,0];   // Center of board.

const specs = { camera, zoom, pov, focalPoint };

// --- UI ---
export function init(zoom, pov, focalPoint=[0,0,0]) {
  specs.zoom = zoom;
  specs.pov  = POV[pov];
  specs.focalPoint = focalPoint;

  let camera = new THREE.OrthographicCamera( -zoom, zoom, zoom, -zoom,   1, 2000 ); // TODO: replace magic numbers.
  specs.camera = camera;

  camera.position.set(...specs.pov );  // These two lines go together.
  camera.lookAt(...focalPoint);

  return camera;
}

export function UI(newPov, focalPoint=specs.focalPoint) {
  pov = POV[newPov];
  specs.camera.position.set(...pov);
  specs.camera.lookAt(...focalPoint);

  return;
  }
// Seampoint: more global functions.

