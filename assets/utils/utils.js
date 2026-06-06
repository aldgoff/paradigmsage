/* File: utils.js
  Path: ../utils/utils.js
  Purpose: Useful tools for dealing with JavaScript.
  Author: Allan Goff
  Date: 4/29/26
  Recommended access: import * as utils from "../../../utils/utils.js";
  UI: the export functions.
*/

// --- UI ---
export function isSame(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
  }

export function add(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  }

export function scale(v, s) {
  return [v[0] * s, v[1] * s, v[2] * s];
}

