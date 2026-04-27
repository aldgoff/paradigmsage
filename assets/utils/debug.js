/* File: debug.js
  Path: ../utils/debug.js
  Purpose: Useful tools for dealing with JavaScript crap, like consol.log delays.
  Author: Allan Goff
  Date: 4/21/26
  Recommended access: import * as utils.
  UI: the export functions.
*/

export function snapshot(obj) {
  return JSON.parse(JSON.stringify(obj));
}

