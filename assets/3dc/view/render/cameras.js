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
  const jit = camerasModule.jitter;
  // Seampoint: more objects.

// --- Build upon previous layers ---
// Seampoint: more imports.

let camera = null;
let pov    = POV.neutral;   // JSON.
let basePov = cloneVec3(pov);
let focalPoint = [0,0,0];   // Center of board.

const specs = { camera, pov, focalPoint };

// TODO: Move jitter from render/camera to viewer.
let jitter = {
  enabled: false,
  rangeRad: (0.5 * jit.maxAngleDeg) * (Math.PI / 180),
  speedDeg: 10,          // degrees/sec
  direction: 1,
  angle: 0               // ← PRIMARY STATE
};

export function setJitter(range, speed) {
  jitter.rangeRad = (range * jit.maxAngleDeg) * (Math.PI / 180);

  // speed independent of range
  jitter.speedDeg = jit.minSpeed + speed * (jit.maxSpeed - jit.minSpeed);
  }

export function isJitterEnabled() {
  return jitter.enabled;
  }

export function startJitter() {
  // derive angle from current view
  jitter.angle = computeAngleFromPov();

  jitter.enabled = true;
  }

export function stopJitter() {
  jitter.enabled = false;
  }

export function updateJitter(deltaTime) {
  if (!jitter.enabled) return;

  const speedRad = (jitter.speedDeg * Math.PI) / 180;

  // advance position
  jitter.angle += jitter.direction * speedRad * deltaTime;

  // reflect at bounds
  if (jitter.angle > jitter.rangeRad) {
    jitter.angle = jitter.rangeRad;
    jitter.direction *= -1;
  }

  if (jitter.angle < -jitter.rangeRad) {
    jitter.angle = -jitter.rangeRad;
    jitter.direction *= -1;
  }

  // apply
  const y = pov[1];            // preserve vertical
  pov = cloneVec3(basePov);
  pov[1] = y;

  applyJitter(jitter.angle);
  }

export function reverseJitter() {
  jitter.direction *= -1;
}

// --- Jitter Helpers ---
function applyJitter(angle) {
  const [x, y, z] = basePov;

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  pov[0] = x * cos - z * sin;
  pov[2] = x * sin + z * cos;

  specs.camera.position.set(...pov);
  specs.camera.lookAt(...focalPoint);
  }

function computeAngleFromPov() {
  const [bx, , bz] = basePov;
  const [px, , pz] = pov;

  const baseAngle = Math.atan2(bz, bx);
  const povAngle  = Math.atan2(pz, px);

  return povAngle - baseAngle;
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

