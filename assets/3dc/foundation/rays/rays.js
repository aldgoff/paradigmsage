/* File: rays.js
  Path: ./3dc/foundation/rays/rays.js
  Purpose: Define directional primitives (rays + knight deltas) in VTS space.
  Author: Allan Goff
  Date: 3/20/26
  UI: export functions only.

  Notes:
    - Rays are pure direction vectors (dz,dx,dy)  (1,0,0), (1,1,0), (1,1,1).
    - No ordering, adjacency, or plane membership.
    - Knights are displacement vectors (not rays).
*/

import raysData from "./rays.json" assert { type: "json" };

// -- Load module --

const raysModule = raysData.rays_module;

const ROOK   = raysModule.rook;
const BISHOP = raysModule.bishop;
const DUKE   = raysModule.duke;
const KNIGHT = raysModule.knight;

// -- Internal helpers --

function findRay(rayName) {
  if (rayName in ROOK)   return ROOK[rayName];
  if (rayName in BISHOP) return BISHOP[rayName];
  if (rayName in DUKE)   return DUKE[rayName];

  throw new Error(`Unknown ray: ${rayName}`);
}

// -- Core (VTS only) --

export function getRayVector(rayName) {
  const v = findRay(rayName);
  return [...v]; // defensive copy
}

// -- Registries (read-only intent) --

export const RAY_REGISTRY = {
  rook:   ROOK,
  bishop: BISHOP,
  duke:   DUKE,
  knight: KNIGHT
};

// -- Convenience accessors --

export function getRookRays() {
  return ROOK;
  }

export function getBishopRays() {
  return BISHOP;
  }

export function getDukeRays() {
  return DUKE;
  }

export function getKnightDeltas() {
  return KNIGHT;
}

// -- Introspection (useful for tests/debug) --

export function getAllRayNames() {
  return [
    ...Object.keys(ROOK),
    ...Object.keys(BISHOP),
    ...Object.keys(DUKE)
  ];
  }

export function getAllRays() {
  return getAllRayNames().map(name => ({
    name,
    vector: getRayVector(name)
  }));
  }

export function hasRay(rayName) {
  return (
    rayName in ROOK ||
    rayName in BISHOP ||
    rayName in DUKE
  );
}

