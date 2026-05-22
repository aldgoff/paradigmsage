/* File: planes.js
  Path: ./3dc/geometry/planes/planes.js
  Purpose: Define planes and quads.
  Author: Allan Goff
  Date: 3/23/26
  Recommended access: import * as planes from "../../geometry/planes/planes.js";
  UI: export functions only.
*/

// --- Load module ---
import planesData from "./planes.json" assert { type: "json" };
  const planesModule = planesData.planes_module;
  const planeGroups  = planesModule.planeGroups;
  const planePairs   = planesModule.planePairs;
  const planes       = planesModule.planes;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as utils  from "../../../../utils/utils.js";

  import * as coords from "../../foundation/coords/coords.js";
  import * as rays   from "../../foundation/rays/rays.js";  // getRayVector().
  import * as quads  from "../../geometry/quads/quads.js";  // quadToRayPair().
  import * as perims from "../../geometry/perims/perims.js";  // scale(), add().
// Seampoint: more imports...

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

export function resolveDstTile(srcTile, quad, perimeter, stride) {
  // console.log("model: planes.js - resolveDstTile(srcTile, quad, perimeter, stride)", srcTile, quad, perimeter, stride);

  const rayPair = quads.quadToRayPair(quad);  // Convert quad to named ray pair to vts rays.

  const ray1 = rays.getRayVector(rayPair[0]);
  const ray2 = rays.getRayVector(rayPair[1]);

  const k = perimeter;                        // Numerical foundation.
  const s = stride - 1;
  let offset = 0;
  let dstTile = [...srcTile]; // Clone not ref!

  if(     stride == 0) {                      // Assume stride on the apex tile.
    offset = utils.add(utils.scale(ray1, k), utils.scale(ray2, k));
    dstTile = utils.add(dstTile, offset);
    }
  else if(stride <= k) {                      // Outbound.
    offset = utils.add(utils.scale(ray1, k), utils.scale(ray2, s));
    dstTile = utils.add(dstTile, offset);
    }
  else if(stride == k + 1) {                  // Stride is on the apex tile.
    offset = utils.add(utils.scale(ray1, k), utils.scale(ray2, k));
    dstTile = utils.add(dstTile, offset);
    }
  else if(stride <= 2*k + 1) {                // Inbound
    offset = utils.add(utils.scale(ray2, k), utils.scale(ray1, 2*k - s));
    dstTile = utils.add(dstTile, offset);
    }
  else {                                      // Assume stride on the apex tile.
    offset = utils.add(utils.scale(ray1, k), utils.scale(ray2, k));
    dstTile = utils.add(dstTile, offset);
  }

  const onBoard = coords.onBoardVts(dstTile);
  const dst = (onBoard) ? coords.rcsToBoard(coords.vtsToRcs(dstTile)) : dstTile; // "Q1,1", [-4,-4,-4].

  return dst; // vts.
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

