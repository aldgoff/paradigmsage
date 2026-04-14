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
  const POV = camerasModule.POV;
  // Seampoint: more objects.

// --- Build upon previous layers ---
// Seampoint: more imports.

let camera = null;
let pov    = POV.neutral;   // JSON.
let focalPoint = [0,0,0];   // Center of board.

const specs = { camera, pov, focalPoint };

// --- UI ---
export function init(zoom, pov, focalPoint=[0,0,0]) {
  console.log("Camera Init()");
  specs.pov  = POV[pov];
  specs.focalPoint = focalPoint;

  const left   = -zoom; // left boundary of view
  const right  =  zoom; // right boundary
  const top    =  zoom; // top boundary
  const bottom = -zoom; // bottom boundary
  const near   =     1; // near clipping plane
  const far    =  2000; // far clipping plane
  const camera = new THREE.OrthographicCamera( left, right, top, bottom,near, far);
  specs.camera = camera;

  camera.position.set(...specs.pov );  // These two lines go together.
  camera.lookAt(...focalPoint);

  return camera;
}
  
export function zoomIn(delta) {
  specs.camera.zoom += delta;
  specs.camera.updateProjectionMatrix();

  return;
  }

export function shiftVertical(tilt) {
  pov[1] += tilt;

  specs.camera.position.set(...pov);
  specs.camera.lookAt(...focalPoint);

  return;
  }

export function rotate(delta) {
  pov[0] += delta;
  pov[2] -= delta;

  specs.camera.position.set(...pov);
  specs.camera.lookAt(...focalPoint);

  return;
  }

export function selectPOV(newPov) {
  const vertical = pov[1];
  pov = POV[newPov];
  pov[1] = vertical;

  specs.camera.position.set(...pov);
  specs.camera.lookAt(...focalPoint);

  return;
}
// Seampoint: more global functions.

