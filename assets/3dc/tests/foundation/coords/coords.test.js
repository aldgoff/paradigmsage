/* File: coords.tests.js
  Path: ./3dc/tests/foundation/coords/
  Purpose: Test the coords module.
  Author: Allan Goff
  Date: 3/18/26
  UI: the export functions.
*/

import { getBoardSpec } from "../../../foundation/coords/coords.js";

export function run() {
  console.log(getBoardSpec("8x8x8"));
}
