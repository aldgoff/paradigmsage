/* File: state.tests.js
  Path: ./3dc/tests/state/
  Purpose: Test the state module.
  Author: Allan Goff
  Date: 4/06/26
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
import * as state from "../../model/state/state.js";

// ------------------------------------------------------------

export function run() {
  let prev = snapshotTotals();

  // state.demo();

  test_UI();
  // Seampoint: more tests...

  let curr = snapshotTotals();
  const pass = curr.pass - prev.pass;
  const fail = curr.fail - prev.fail;
  prev = curr;

  finalReport("Model/state");
}

// ------------------------------------------------------------

function test_UI() {
  const cases = [
    { value: "whatever", expected: "whatever", label: "module" },
  ];

  for (const { value, expected, label } of cases) {
    // assertEqual(UI(), expected, label);
  }

  report("UI", "state");
  }

// Seampoint: more tests...

