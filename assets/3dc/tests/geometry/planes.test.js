/* File: planes.tests.js
  Path: ./3dc/tests/foundation/
  Purpose: Test the planes module.
  Author: Allan Goff
  Date: 3/21/26
  UI: the export functions.
*/

import {TEST_MODE,
        assertEqual,
        assertThrows,
        report,
        snapshotTotals,
        finalReport,
  } from "../core/asserts.js";

import { invariant } from "../core/invariants.js";

import {getPlaneTypeForPiece,
        // Seam point: functions to test...
} from "../../geometry/planes.js";


// ------------------------------------------------------------

export function run() {
  let prev = snapshotTotals();


  // Seam point: more tests...

  let curr = snapshotTotals();

  const pass = curr.pass - prev.pass;
  const fail = curr.fail - prev.fail;

  if (TEST_MODE.geometry !== "VERBOSE") {
    console.log(`Geometry/rays ${pass}/${pass + fail}`);
  }

  finalReport();
}

// ------------------------------------------------------------


// Seam point: more tests...

