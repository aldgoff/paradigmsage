/* File: gambits.tests.js
  Path: ./3dc/tests/gambits/
  Purpose: Test the gambits module.
  Author: Allan Goff
  Date: 4/25/26
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
} from "../../view/gambits/gambits.js";

// ------------------------------------------------------------

export function run() {
  let prev = snapshotTotals();

  test_UI();
  // Seampoint: more tests...

  let curr = snapshotTotals();
  const pass = curr.pass - prev.pass;
  const fail = curr.fail - prev.fail;
  // if (TEST_MODE.gambits !== "VERBOSE") {
  //   console.log(`Templates/cat ${pass}/${pass + fail}`);
  // }
  prev = curr;

  finalReport("Gambits/cat");
}

// ------------------------------------------------------------

function test_UI() {
  const cases = [
    { value: "whatever", expected: "whatever", label: "gambits" },
  ];

  for (const { value, expected, label } of cases) {
    assertEqual(UI(), expected, label);
  }

  report("UI", "gambits");
  }

// Seampoint: more tests...

