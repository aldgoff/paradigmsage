
/* File: coordsMap.js
  Path: ./3dc/view/render/coordsMap.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/02/26
  UI: the export functions.
*/

export function vts2xyz([z, x, y]) {
  return [x, z, y];
  }

export function xyz2vts([x, y, z]) {
  return [y, x, z]
  }

export function vts2pixels( [z, x, y], Sxy = 100, Sz = 160, center = [50,80,50]) {
  return [
    x * Sxy - center[0],
    z * Sz  - center[1],
    y * Sxy - center[2]
  ];
  }

export function pixels2vts( [x, y, z], Sxy = 100, Sz = 160, center = [50,80,50]) {
  return [
    Math.round((y + center[1]) / Sz),   // z
    Math.round((x + center[0]) / Sxy),  // x
    Math.round((z + center[2]) / Sxy)   // y
  ];
}

