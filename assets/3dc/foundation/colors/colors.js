/* File: colors.js
  Path: ./3dc/foundation/colors/colors.js
  Purpose: Tile color system (bishop + duke) in VTS space.
  Author: Allan Goff
  Date: 3/20/26
  Recommended access: import * as colors.
  UI: the export functions.
*/

// --- Load module ---
import colorsData from "./colors.json" assert { type: "json" };
  const colorsModule = colorsData.colors_module;
  const BISHOP = colorsModule.bishop_color;
  const DUKE   = colorsModule.duke_color;
// Seampoint: more imports...

// --- Build upon previous layers ---
import * as coords from "../coords/coords.js";

// --- UI ---
// -- Public API (positional notation) --
export function bishopColor(tile, specOrName = "8x8x8") {
  const vts = coords.normalizeTileToVts(tile, specOrName);
  return bishopColorVts(vts);
  }

export function dukeColor(tile, specOrName = "8x8x8") {
  const vts = coords.normalizeTileToVts(tile, specOrName);
  return dukeColorVts(vts);
  }

export function tileColors(tile, specOrName = "8x8x8") {
  const vts = coords.normalizeTileToVts(tile, specOrName);

  return {
    bishop: bishopColorVts(vts),
    duke:   dukeColorVts(vts),
    vts
  };
}

export function tileColorString(tile, specOrName = "8x8x8") {
  const { bishop, duke } = tileColors(tile, specOrName);
  return `${bishop}-${duke}`;
}

// -- Core (VTS only) --
export function bishopColorVts(vts /* spec-independent */) {
  const [z, x, y] = vts;

  const parity = (z + x + y) & 1;

  return BISHOP.colors[String(parity)]; // "white"|"black".
  }

export function dukeColorVts(vts /* spec-independent */) {
  const [z, x, y] = vts;

  const uz = z & 1;
  const ux = x & 1;
  const uy = y & 1;

  const block = DUKE.color_map[`uz=${uz}`];

  return block[`${ux},${uy}`];  // "gold"|"ruby"|"jade"|"silver".
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

