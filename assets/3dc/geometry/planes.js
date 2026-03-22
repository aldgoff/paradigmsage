/* File: planes.js
  Path: ./3dc/geometry/planes.js
  Purpose: Define planes and quads.
  Author: Allan Goff
  Date: 3/21/26
  UI: export functions only.
*/

import planesData from "./planes.json" assert { type: "json" };
const planesModule = planesData.planes_module;
const basePieces = planesModule.basePieces;
// Seam point: more json objects.

export function getPlaneTypeForPiece(piece) {
  const entry = planesData.planes_module.basePieces[piece];
  if (!entry) throw new Error(`Unknown piece: ${piece}`);
  return entry.planeType;
}
