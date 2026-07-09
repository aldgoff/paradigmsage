/* File: rays.js
  Path: ./3dc/foundation/rays/rays.js
  Purpose: Define directional primitives (rays + knight deltas) in VTS space.
  Author: Allan Goff
  Date: 3/20/26
  Recommended access: import * as rays from "../../foundation/rays/rays.js";
  UI: export functions only.

  Notes:
    - Rays are pure direction vectors (dz,dx,dy)  (1,0,0), (1,1,0), (1,1,1).
    - No ordering, adjacency, or plane membership.
    - Knights are displacement vectors (not rays).
*/

// --- Load module ---
  import raysData from "./rays.json" assert { type: "json" };
  const raysModule = raysData.rays_module;
  const ROOK   = raysModule.rook;
  const BISHOP = raysModule.bishop;
  const DUKE   = raysModule.duke;
  const APEX   = raysModule.apex;
  const KNIGHT = raysModule.knight;
// Seampoint: more imports...

// --- Dependencies ---
// Seampoint: more imports...

// --- UI ---
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
  apex:   APEX,
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

export function apexRay(rayName) {
  return APEX[rayName];
  // DEPRECATE.
  let ray = [];
  switch(rayName) {
    case "LFU_RFU":   ray = APEX.LFU_RFU;   break;
    case "RFU_right": ray = APEX.RFU_right; break;
    case "right_RBD": ray = APEX.right_RBD; break;
    case "RBD_LBD":   ray = APEX.RBD_LBD;   break;
    case "LBD_left":  ray = APEX.LBD_left;  break;
    case "left_LFU":  ray = APEX.left_LFU;  break;
    
    case "LFD_RFD":   ray = APEX.LFD_RFD;   break;
    case "RFD_right": ray = APEX.RFD_right; break;
    case "right_RBU": ray = APEX.right_RBU; break;
    case "RBU_LBU":   ray = APEX.RBU_LBU;   break;
    case "LBU_left":  ray = APEX.LBU_left;  break;
    case "left_LFD":  ray = APEX.left_LFD;  break;
    
    case "LBU_LFU":   ray = APEX.LBU_LFU;   break;
    case "LFU_fore":  ray = APEX.LFU_fore;  break;
    case "fore_RFD":  ray = APEX.fore_RFD;  break;
    case "RFD_RBD":   ray = APEX.RFD_RBD;   break;
    case "RBD_back":  ray = APEX.RBD_back;  break;
    case "back_LBU":  ray = APEX.back_LBU;  break;
    
    case "RBU_RFU":   ray = APEX.RBU_RFU;   break;
    case "RFU_fore":  ray = APEX.RFU_fore;  break;
    case "fore_LFD":  ray = APEX.fore_LFD;  break;
    case "LFD_LBD":   ray = APEX.LFD_LBD;   break;
    case "LBD_back":  ray = APEX.LBD_back;  break;
    case "back_RBU":  ray = APEX.back_RBU;  break;
    
    default: throw new Error(`Unknown apex ray, ${rayName}.`)
  }

  return ray;
}
// Seampoint: more global functions...

// --- Helpers ---
function findRay(rayName) {
  if (rayName in ROOK)   return ROOK[rayName];
  if (rayName in BISHOP) return BISHOP[rayName];
  if (rayName in DUKE)   return DUKE[rayName];

  throw new Error(`Unknown ray: ${rayName}`);
}
// Seampoint: more local functions...

