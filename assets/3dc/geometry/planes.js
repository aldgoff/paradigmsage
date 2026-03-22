/* File: planes.js
  Path: ./3dc/geometry/planes.js
  Purpose: Define planes and quads.
  Author: Allan Goff
  Date: 3/21/26
  UI: export functions only.
*/

// --- Load module ---
import planesData from "./planes.json" assert { type: "json" };
  const planesModule = planesData.planes_module;
  const basePieces = planesModule.basePieces;
  // Seampoint: more objects.

// --- Build upon the previous layers ---
import { } from "../foundation/coords/coords.js";
// Seampoint: more imports.

// --- UI ---
export function getPlaneTypeForPiece(piece) {
  const entry = planesData.planes_module.basePieces[piece];
  if (!entry) throw new Error(`Unknown piece: ${piece}`);
  return entry.planeType;
}

// Seampoint: more global functions.


// --- Helpers ---

// Seampoint: more local functions.

