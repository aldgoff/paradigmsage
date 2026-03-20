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
        // Seam point: functiosns to test...
} from "../../foundation/rays/rays.js";

// ------------------------------------------------------------

export function run() {
  let prev = snapshotTotals();

  test_rayCounts();
  test_getRayVector();
  test_hasRay();
  test_knightDeltas();
  test_rayInvariant();
  test_rayUniqueness();
  // Seam point: more tests...

  let curr = snapshotTotals();

  const pass = curr.pass - prev.pass;
  const fail = curr.fail - prev.fail;

  if (TEST_MODE.foundation !== "VERBOSE") {
    console.log(`Foundation/rays ${pass}/${pass + fail}`);
  }

  finalReport();
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

  report("rayCounts", "foundation");
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

  report("getRayVector", "foundation");
  }

function test_hasRay() {
  assertEqual(hasRay("up"), true, "rook ray");
  assertEqual(hasRay("fore"), true, "bishop ray");
  assertEqual(hasRay("fore_up"), true, "duke ray");

  assertEqual(hasRay("ZZZ"), false, "invalid ray");

  report("hasRay", "foundation");
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

  report("knightDeltas", "foundation");
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

  report("rayInvariant", "foundation");
  }

function test_rayUniqueness() {
  const seen = new Set();

  for (const { vector } of getAllRays()) {
    const key = vector.join(",");

    assertEqual(seen.has(key), false, `duplicate ${key}`);
    seen.add(key);
  }

  report("rayUniqueness", "foundation");
}
// Seam point: more tests...

