/* File: coordsMaps.js
  Path: ./3dc/view/render/coordsMaps.js
  Purpose: Coordinate transforms between 3DC vts versus THREE xyz and scene pixels.
  Author: Allan Goff
  Date: 4/02/26
  Recommended access: import * as coordsMaps.
  UI: the export functions.
*/

// --- Load JSON ---
import coordsMapsData from "./coordsMaps.json" assert { type: "json" };
  const coordsMapsModule = coordsMapsData.coordsMaps_module;
  const dims = coordsMapsModule.dims;
// Seampoint: more objects...

// --- UI ---
// TODO: scales are hard coded, need to import from a JSON file.
export function vts2xyz([z, x, y]) {
  return [x, z, y];
  }

export function xyz2vts([x, y, z]) {
  return [y, x, z]
  }

export function vts2pixels( [z, x, y], Sxy = dims.Sxy, Sz = dims.Sz, center = dims.center) {
  return [
    x * Sxy - center[0],
    z * Sz  - center[1],
    y * Sxy - center[2]
  ];
  }

export function pixels2vts( [x, y, z], Sxy = dims.Sxy, Sz = dims.Sz, center = [dims.center]) {
  return [
    Math.round((y + center[1]) / Sz),   // z
    Math.round((x + center[0]) / Sxy),  // x
    Math.round((z + center[2]) / Sxy)   // y
  ];
}

