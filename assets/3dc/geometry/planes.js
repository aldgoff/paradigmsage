/* File: planes.js
  Path: ./3dc/geometry/planes.js
  Purpose: Define planes and quads.
  Author: Allan Goff
  Date: 3/23/26
  UI: export functions only.
*/

// --- Load module ---
import planesData from "./planes.json" assert { type: "json" };
  const planesModule = planesData.planes_module;
  const basePieces   = planesModule.basePieces;
  const planeGroups  = planesModule.planeGroups;
  const planes       = planesModule.planes;
  // Seampoint: more objects.

// --- Build upon the previous layers ---
import { } from "../foundation/coords/coords.js";
// Seampoint: more imports.

// --- UI ---
// Spec paragraph 2 - base pieces.
export function getBasePieces() {
  return Object.keys(basePieces);
  }

export function getPlaneTypeForPiece(piece) {
  const entry = basePieces[piece];
  if (!entry) throw new Error(`Unknown piece: ${piece}`);
  return entry.planeType;
}

// Spec paragraph 3 - plane groups.
export function getPlaneGroups() {
  return planeGroups;
  }

export function getPlanesForType(type) {
  const planes = planeGroups[type];
  if (!planes) throw new Error(`Unknown plane type: ${type}`);
  return planes;
  }

export function getPlaneTypeForPlane(plane) {
  for (const [type, planes] of Object.entries(planeGroups)) {
    if (planes.includes(plane)) return type;
  }
  throw new Error(`Unknown plane: ${plane}`);
}

// Spec paragraph 4 - planes (where ray cycles and quads are defined).
export function getPlane(plane) {
  const entry = planes[plane];
  if (!entry) throw new Error(`Unknown plane: ${plane}`);
  return entry;
  }

export function getPlaneRays(plane) {
  const entry = getPlane(plane);
  return entry.rays;
  }

export function getPlaneQuad1(plane) {
  const entry = getPlane(plane);
  return entry.quad1;
  }

export function getPlanePOV(plane) {
  const entry = getPlane(plane);
  return entry.pov;
  }

export function getPlaneRule(plane) {
  const entry = getPlane(plane);
  return entry.rule;
}

// Seampoint: more global functions.


// --- Helpers ---

// Seampoint: more local functions.

