/* File: gambits.tests.js
  Path: ./3dc/tests/gambits/
  Purpose: Test the gambits module.
  Author: Allan Goff
  Date: 4/24/26
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
import * as gambits from "../../controller/gambits/gambits.js";

// ------------------------------------------------------------

export function run() {
  let prev = snapshotTotals();

  test_plumbing();
  // Seampoint: more tests...

  let curr = snapshotTotals();
  const pass = curr.pass - prev.pass;
  const fail = curr.fail - prev.fail;
  // if (TEST_MODE.gambits !== "VERBOSE") {
  //   console.log(`Gambits/cat ${pass}/${pass + fail}`);
  // }
  prev = curr;

  finalReport("Gambits/plumbing");
}

// ------------------------------------------------------------

function test_plumbing() {
  const cases = [
    { value: "whatever", expected: 1, label: "module" },
  ];

  for (const { value, expected, label } of cases) {
    const gambit = {Q: 1, src: "Q4,4", dst: "Q4,4"};  // {Q, src, dst}.
    assertEqual(gambit.Q, expected, label);
  }

  report("plumbing", "gambits");
  }

// Seampoint: more tests...

