/* File: advSqs.tests.js
  Path: ./3dc/tests/advSqs/
  Purpose: Test the advSqs module.
  Author: Allan Goff
  Date: 3/29/26
  UI: the export functions.
*/

// --- Regression framework ---
import {TEST_MODE,
        assertEqual,
        assertThrows,
        report,
        snapshotTotals,
        finalReport,
  } from "../core/asserts.js";

import { invariant } from "../core/invariants.js";

// --- Layers ---
import {getBoardSpec,
} from "../../foundation/coords/coords.js";

// --- Module ---
import {UI,
        AdvSq,
} from "../../geometry/advSqs.js";

// ------------------------------------------------------------

export function run() {
  let prev = snapshotTotals();

  test_UI();
  test_quad_ctor();
  // Seampoint: more tests...

  let curr = snapshotTotals();
  const pass = curr.pass - prev.pass;
  const fail = curr.fail - prev.fail;
  if (TEST_MODE.advSqs !== "VERBOSE") {
    console.log(`Geometry/advSqs (${pass}/${pass + fail}`);
  }
  prev = curr;

  finalReport();
}

// ------------------------------------------------------------

function test_UI() {
  const cases = [
    { value: "whatever", expected: "whatever", label: "module" },
  ];

  for (const { value, expected, label } of cases) {
    assertEqual(UI(), expected, label);
  }

  report("UI", "advSqs");
}

function test_quad_ctor() {
  const cases = [
    { value: { source: [0,0,0], quad: 1, k: 3 }, expected: "whatever", label: "advSqs" },
  ];

  for (const { value, expected, label } of cases) {
    const advsq = AdvSq.fromQuad(value.source, value.quad, value.k);
    console.log(advsq);
  }

  report("test_quad_ctor", "advSqs");
  }

// Seampoint: more tests...

