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
  const planeGroups  = planesModule.planeGroups;
  const planePairs   = planesModule.planePairs;
  const planes       = planesModule.planes;
  // Seampoint: more objects.

// --- UI ---

// Spec paragraph 3 - plane groups.
export function getPlaneGroups() {
  return planeGroups;
  }

export function getPlanePairs() {
  return planePairs;
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

export function nextPlane(plane) {
  for (const group of Object.values(planeGroups)) {
    const idx = group.indexOf(plane);
    if (idx !== -1) {
      return group[(idx + 1) % group.length];
    }
  }

  throw new Error(`nextPlane: unknown plane ${plane}`);
  }

export function prevPlane(plane) {
  for (const group of Object.values(planeGroups)) {
    const idx = group.indexOf(plane);
    if (idx !== -1) {
      return group[(idx - 1 + group.length) % group.length];
    }
  }

  throw new Error(`prevPlane: unknown plane ${plane}`);
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

