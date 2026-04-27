/* File: cameras.js
  Path: ./3dc/view/render/cameras.js
  Purpose: Interface to the camera controls, POV on the board, zoom, etc.
  Author: Allan Goff
  Date: 4/09/26
  Recommended access: import * as cameras.
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
let basePov = cloneVec3(pov);
let focalPoint = [0,0,0];   // Center of board.

const specs = { camera, pov, focalPoint };

let jitter = {
  enabled: false,
  rangeRad: (0.5 * camerasModule.jitter.maxAngleDeg) * (Math.PI / 180), // default 50%
  periodSec: (camerasModule.jitter.minPeriodSec + camerasModule.jitter.maxPeriodSec) / 2,
  t: 0,
  prevAngle: 0
};

export function setJitter(range01, speed01) {
  const maxAngleDeg = camerasModule.jitter.maxAngleDeg;
  const minPeriod   = camerasModule.jitter.minPeriodSec;
  const maxPeriod   = camerasModule.jitter.maxPeriodSec;

  jitter.rangeRad = (range01 * maxAngleDeg) * (Math.PI / 180);

  // Map speed slider → period (inverse relationship)
  jitter.periodSec = maxPeriod - (speed01 * (maxPeriod - minPeriod));

  // jitter.enabled = range01 > 0 && speed01 > 0;
}
export function updateJitter(deltaTime) {
  if (!jitter.enabled) return;

  jitter.t += deltaTime;

  const omega = (2 * Math.PI) / jitter.periodSec;
  const angle = jitter.rangeRad * Math.sin(omega * jitter.t);

  // --- Reset to base each frame (ensures symmetry) ---
  pov = cloneVec3(basePov);

  applyJitter(angle);
  // Convert absolute → delta (avoids drift)
  // const delta = angle - jitter.prevAngle;
  // jitter.prevAngle = angle;

  // rotate(delta);
}
export function startJitter() {
  // --- Hard reset time phase ---
  jitter.t = 0;
  jitter.prevAngle = 0;

  // --- Lock current POV as base ---
  basePov = cloneVec3(pov);

  // --- Enable ---
  jitter.enabled = true;
}
export function stopJitter() {
  jitter.enabled = false;
}

// --- UI ---
export function init(zoom, pov, focalPoint=[0,0,0]) {
  console.log("view: camera.js - Init()");
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
  const [x, y, z] = pov;

  const cos = Math.cos(delta);
  const sin = Math.sin(delta);

  const newX = x * cos - z * sin;
  const newZ = x * sin + z * cos;

  pov[0] = newX;
  pov[2] = newZ;

  specs.camera.position.set(...pov);
  specs.camera.lookAt(...focalPoint);
}
function applyJitter(angle) {
  const [x, y, z] = basePov;

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  pov[0] = x * cos - z * sin;
  pov[2] = x * sin + z * cos;

  specs.camera.position.set(...pov);
  specs.camera.lookAt(...focalPoint);
}

export function selectPOV(newPov) {
  const vertical = pov[1];
  pov = [...POV[newPov]];
  pov[1] = vertical;

  basePov = cloneVec3(pov);
  jitter.t = 0;
  jitter.prevAngle = 0;

  specs.camera.position.set(...pov);
  specs.camera.lookAt(...focalPoint);

  return;
}
// Seampoint: more global functions.

// --- Helpers ---
function cloneVec3(v) {
  return [v[0], v[1], v[2]];
}
// Seampoint: more local functions.

