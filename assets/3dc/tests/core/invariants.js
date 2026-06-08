/* File: invariants.js
  Path: ./3dc/tests/core/invariants.js
  Purpose: Functions to trap invariants.
  Author: Allan Goff
  Date: 6/08/26
  Recommended access: import * as invariants from "../../tests/core/invariants.js";
  UI: the export functions.
*/

export function invariant(condition, message) {
  if (!condition) {
    throw new Error(`Invariant failed: ${message}`);
  }
}

