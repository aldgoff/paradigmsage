/* File: templates.tests.js
  Path: ./3dc/tests/templates/
  Purpose: Test the templates module.
  Author: Allan Goff
  Date: 3/00/26
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
} from "../../templates/module.js";

// ------------------------------------------------------------

export function run() {
  let prev = snapshotTotals();

  test_UI();
  // Seampoint: more tests...

  let curr = snapshotTotals();
  const pass = curr.pass - prev.pass;
  const fail = curr.fail - prev.fail;
  if (TEST_MODE.templates !== "VERBOSE") {
    console.log(`Templates/cat (${pass}/${pass + fail}`);
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

  report("UI", "templates");
  }

// Seampoint: more tests...

