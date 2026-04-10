/* File: rays.tests.js
  Path: ./3dc/tests/foundation/
  Purpose: Test the rays module.
  Author: Allan Goff
  Date: 3/20/26
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

import {getRayVector,
        getRookRays,
        getBishopRays,
        getDukeRays,
        getKnightDeltas,
        getAllRayNames,
        getAllRays,
        hasRay,
        apexRay,
        // Seam point: functions to test...
} from "../../foundation/rays/rays.js";

// ------------------------------------------------------------

export function run() {
  let prev = snapshotTotals();

  test_rayCounts();
  test_getRayVector();
  test_hasRay();
  test_apexRays();
  test_knightDeltas();
  test_rayInvariant();
  test_rayUniqueness();
  // Seam point: more tests...

  let curr = snapshotTotals();

  const pass = curr.pass - prev.pass;
  const fail = curr.fail - prev.fail;

  finalReport("Foundation/rays");
}

// ------------------------------------------------------------

function test_rayCounts() {
  const rook   = getRookRays();
  const bishop = getBishopRays();
  const duke   = getDukeRays();
  const knight = getKnightDeltas();

  assertEqual(Object.keys(rook).length,   6,  "rook count");
  assertEqual(Object.keys(bishop).length, 12, "bishop count");
  assertEqual(Object.keys(duke).length,   8,  "duke count");
  assertEqual(knight.length,              24, "knight count");

  report("rayCounts", "rays");
  }

function test_getRayVector() {
  const cases = [
    { name: "up",        expected: [ 1, 0, 0] },
    { name: "fore",      expected: [ 0, 1, 1] },
    { name: "fore_up",   expected: [ 1, 1, 1] },
  ];

  for (const { name, expected } of cases) {
    const v = getRayVector(name);
    assertEqual(v, expected, `${name} vector`);
  }

  // defensive copy test
  const v1 = getRayVector("up");
  v1[0] = 999;

  const v2 = getRayVector("up");
  assertEqual(v2, [1,0,0], "defensive copy");

  // invalid
  assertThrows(() => getRayVector("ZZZ"), "invalid ray");

  report("getRayVector", "rays");
  }

function test_hasRay() {
  assertEqual(hasRay("up"), true, "rook ray");
  assertEqual(hasRay("fore"), true, "bishop ray");
  assertEqual(hasRay("fore_up"), true, "duke ray");

  assertEqual(hasRay("ZZZ"), false, "invalid ray");

  report("hasRay", "rays");
  }

function test_apexRays() {
  const bishop = getBishopRays();
  const tests = [ 
    { value: "LFU_RFU",   expect: addRays(bishop.LFU,   bishop.RFU),   label: "upward Q13" },  // [ 2, 1, 1]
    { value: "RFU_right", expect: addRays(bishop.RFU,   bishop.right), label: "upward Q14" },  // [ 1,-1, 2]
    { value: "right_RBD", expect: addRays(bishop.right, bishop.RBD),   label: "upward Q15" },
    { value: "RBD_LBD",   expect: addRays(bishop.RBD,   bishop.LBD),   label: "upward Q16" },
    { value: "LBD_left",  expect: addRays(bishop.LBD,   bishop.left),  label: "upward Q17" },
    { value: "left_LFU",  expect: addRays(bishop.left,  bishop.LFU),   label: "upward Q18" },

    { value: "LFD_RFD",   expect: addRays(bishop.LFD,   bishop.RFD),   label: "downward Q19" },
    { value: "RFD_right", expect: addRays(bishop.RFD,   bishop.right), label: "downward Q20" },
    { value: "right_RBU", expect: addRays(bishop.right, bishop.RBU),   label: "downward Q21" },
    { value: "RBU_LBU",   expect: addRays(bishop.RBU,   bishop.LBU),   label: "downward Q22" },
    { value: "LBU_left",  expect: addRays(bishop.LBU,   bishop.left),  label: "downward Q23" },
    { value: "left_LFD",  expect: addRays(bishop.left,  bishop.LFD),   label: "downward Q24" },

    { value: "LBU_LFU",   expect: addRays(bishop.LBU,   bishop.LFU),   label: "leftward Q25" },
    { value: "LFU_fore",  expect: addRays(bishop.LFU,   bishop.fore),  label: "leftward Q26" },
    { value: "fore_RFD",  expect: addRays(bishop.fore,  bishop.RFD),   label: "leftward Q27" },
    { value: "RFD_RBD",   expect: addRays(bishop.RFD,   bishop.RBD),   label: "leftward Q28" },
    { value: "RBD_back",  expect: addRays(bishop.RBD,   bishop.back),  label: "leftward Q29" },
    { value: "back_LBU",  expect: addRays(bishop.back,  bishop.LBU),   label: "leftward Q30" },

    { value: "RBU_RFU",   expect: addRays(bishop.RBU,   bishop.RFU),   label: "Rightward Q31" },
    { value: "RFU_fore",  expect: addRays(bishop.RFU,   bishop.fore),  label: "Rightward Q32" },
    { value: "fore_LFD",  expect: addRays(bishop.fore,  bishop.LFD),   label: "Rightward Q33" },
    { value: "LFD_LBD",   expect: addRays(bishop.LFD,   bishop.LBD),   label: "Rightward Q34" },
    { value: "LBD_back",  expect: addRays(bishop.LBD,   bishop.back),  label: "Rightward Q35" },
    { value: "back_RBU",  expect: addRays(bishop.back,  bishop.RBU),   label: "Rightward Q36" },
  ]

  for(const test of tests) {
    assertEqual(apexRay(test.value), test.expect, `Invalid bishop apex ray in ${test.label} plane.`);
  }

  report("apexRays", "rays");
  }

function test_knightDeltas() {
  const deltas = getKnightDeltas();

  // spot checks
  assertEqual(deltas.includes([1,2,2]), false, "reference check"); // arrays differ by reference

  const found = deltas.some(d =>
    d[0] === 1 && d[1] === 2 && d[2] === 2
  );
  assertEqual(found, true, "contains (1,2,2)");

  // shape check
  for (const d of deltas) {
    assertEqual(d.length, 3, "delta length");
  }

  report("knightDeltas", "rays");
  }

function test_rayInvariant() {
  const names = getAllRayNames();

  for (const name of names) {
    const [dz, dx, dy] = getRayVector(name);

    // components must be in {-1,0,1}
    const valid =
      [-1,0,1].includes(dz) &&
      [-1,0,1].includes(dx) &&
      [-1,0,1].includes(dy);

    assertEqual(valid, true, `${name} component range`);

    // not zero vector
    const nonZero = (dz !== 0 || dx !== 0 || dy !== 0);
    assertEqual(nonZero, true, `${name} non-zero`);
  }

  report("rayInvariant", "rays");
  }

function test_rayUniqueness() {
  const seen = new Set();

  for (const { vector } of getAllRays()) {
    const key = vector.join(",");

    assertEqual(seen.has(key), false, `duplicate ${key}`);
    seen.add(key);
  }

  report("rayUniqueness", "rays");
}
// Seam point: more tests...

// --- Helpers ---
function addRays(ray1, ray2) {
  let sum = [];

  sum[0] = ray1[0] + ray2[0];
  sum[1] = ray1[1] + ray2[1];
  sum[2] = ray1[2] + ray2[2];

  return sum;
}

