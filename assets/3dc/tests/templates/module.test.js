/* File: templates.tests.js
  Path: ./3dc/tests/templates/
  Purpose: Test the templates module.
  Author: Allan Goff
  Date: 3/20/26
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
  const specNames = ["8x8x8", "10x8x8", "10x10x10"];

  let prev = snapshotTotals();

  for (const specName of specNames) {
    if (TEST_MODE.templates === "VERBOSE") {
      console.log(getBoardSpec(specName));
    }

    test_UI(specName);
    // Seampoint: more tests...

    let curr = snapshotTotals();

    const pass = curr.pass - prev.pass;
    const fail = curr.fail - prev.fail;

    if (TEST_MODE.templates !== "VERBOSE") {
      console.log(`Templates/cat (${specName}) ${pass}/${pass + fail}`);
    }

    prev = curr;
  }

  finalReport();
}

// ------------------------------------------------------------

function test_UI(specName) {
  const cases = [
    { value: "whatever", expected: "whatever", label: "module" },
  ];

  for (const { value, expected, label } of cases) {
    assertEqual(UI(specName), expected, label);
  }

  report("UI", "templates");
  }

// Seampoint: more tests...

