
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

export function vts2pixels( [z, x, y], Sxy = 100, Sz = 160, center = [0,0,0]) {
  return [
    x * Sxy - center[0],
    z * Sz  - center[1],
    y * Sxy - center[2]
  ];
  }

export function pixels2vts( [x, y, z], Sxy = 100, Sz = 160, center = [0,0,0]) {
  return [
    Math.round((y + center[1]) / Sz),   // z
    Math.round((x + center[0]) / Sxy),  // x
    Math.round((z + center[2]) / Sxy)   // y
  ];
}

export function vts2pixels2([z, x, y], S = 100, center = [0,0,0]) {
  return [
    x * S - center[0],
    z * S - center[1],
    y * S - center[2]
  ];
  }

export function pixels2vts2([x, y, z], S = 100, center = [0,0,0]) {
  return [
    Math.round((y + center[1]) / S),  // z
    Math.round((x + center[0]) / S),  // x
    Math.round((z + center[2]) / S)   // y
  ];
}

export function vts2pixels1([z, x, y], S = 100) {
  return [x * S, z * S, y * S];
  }

export function pixels2vts1([x, y, z], S = 100) {
  return [
    Math.round(y / S),  // z
    Math.round(x / S),  // x
    Math.round(z / S)   // y
  ];
}

