/* File: perims.js
  Path: ./3dc/geometry/perims.js
  Purpose: desc
  Author: Allan Goff
  Date: 3/00/26
  UI: the export functions.
 */

// --- Load module ---

// --- Build upon the previous layers ---
import {normalizeTileToVts} from "../foundation/coords/coords.js";
import {getRayVector} from "../foundation/rays/rays.js";
import {quadToRayPair} from "./quads.js";
// Seampoint: more imports.

// --- UI ---
export function getStride({ quad, k }) {
  if (!Number.isInteger(k) || k < 0) {
    throw new Error(`getStride: invalid k (${k})`);
  }

  const [ray1, ray2] = quadToRayPair(quad);
  const v1 = getRayVector(ray1);
  const v2 = getRayVector(ray2);

  const stride = [];  // The ordered list of relative tiles on the perimeter.

  const E1 = scale(v1, k);            // E1
  if(k>0) { stride.push(E1); }  // At k=0 E1 & E2 are degenerate and coincide at the source.

  for (let i = 1; i < k; i++) {       // Outbound leg (along ray2).
    stride.push(add(E1, scale(v2, i)));
  }

  const apex = add(E1, scale(v2, k)); // Apex.
  stride.push(apex);            // At k=0 apex is degenerate with E1, E2, and the source.

  for (let i = 1; i < k; i++) {       // Inbound leg (back along ray1).
    stride.push(add(apex, scale(v1, -i)));
  }

  const E2 = scale(v2, k);            // E2.
  if(k>0) { stride.push(E2); } // At k=0 E1 & E2 are degenerate and coincide at the source.

  return {k, stride, E1, apex, E2 };
  }

export function nextPerimeter({ quad, k }) {
  return getStride({ quad, k: k + 1 });
  }

export function prevPerimeter({ quad, k }) {
  if (!Number.isInteger(k) || k <= 0) {
    throw new Error(`prevPerimeter: invalid k (${k})`);
  }

  return getStride({ quad, k: k - 1 });
  }

export function isTileInPlane(tile, v1, v2) {
  // Normalize tile to VTS (future-proof)
  const t = normalizeTileToVts(tile);  // from coords layer

  // Plane normal
  const n = cross(v1, v2);

  // If dot = 0 → tile lies in plane
  return dot(t, n) === 0;
}

// Seampoint: more global functions.

// --- Helpers ---
function add(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  }

function scale(v, s) {
  return [v[0] * s, v[1] * s, v[2] * s];
  }

function cross(a, b) {
  return [
    a[1]*b[2] - a[2]*b[1],
    a[2]*b[0] - a[0]*b[2],
    a[0]*b[1] - a[1]*b[0],
  ];
  }

function dot(a, b) {
  return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
}
// Seampoint: more local functions.

