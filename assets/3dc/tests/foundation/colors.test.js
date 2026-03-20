/* File: colors.tests.js
  Path: ./3dc/tests/foundation/
  Purpose: Test the colors module.
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

import {getBoardSpec,
        normalizeTileToVts,
} from "../../foundation/coords/coords.js";

import {bishopColor,
        dukeColor,
        tileColors,
        tileColorString,
        // Seam point: more tests...
} from "../../foundation/colors/colors.js";

// ------------------------------------------------------------

export function run() {
  const specNames = ["8x8x8", "10x8x8", "10x10x10"];

  let prev = snapshotTotals();

  for (const specName of specNames) {
    if (TEST_MODE.foundation === "VERBOSE") {
      console.log(getBoardSpec(specName));
    }

    test_bishopColor(specName);
    test_dukeColor(specName);
    test_tileColors(specName);
    test_tileColorString(specName);
    // Seam point: more tests...

    test_colorInvariant(specName);

    let curr = snapshotTotals();

    const pass = curr.pass - prev.pass;
    const fail = curr.fail - prev.fail;

    if (TEST_MODE.foundation !== "VERBOSE") {
      console.log(`Foundation/colors (${specName}) ${pass}/${pass + fail}`);
    }

    prev = curr;
  }

  finalReport();
}

// ------------------------------------------------------------

function test_bishopColor(specName) {
  const cases = [
    { vts: [0,0,0], expected: "white", label: "origin" },
    { vts: [1,0,0], expected: "black", label: "x shift" },
    { vts: [1,1,0], expected: "white", label: "xy even" },
    { vts: [-1,-1,-1], expected: "black", label: "neg parity" },
  ];

  for (const { vts, expected, label } of cases) {
    assertEqual(bishopColor(vts, specName), expected, label);
  }

  // normalization invariant
  const tile = "Q4,4";
  assertEqual(
    bishopColor(tile, specName),
    bishopColor(normalizeTileToVts(tile, specName), specName),
    "string vs vts"
  );

  report("bishopColor", "foundation");
  }

function test_dukeColor(specName) {
  const cases = [
    { vts: [0,0,0], expected: "silver", label: "000" },
    { vts: [0,0,1], expected: "jade",   label: "001" },
    { vts: [0,1,0], expected: "ruby",   label: "010" },
    { vts: [0,1,1], expected: "gold",   label: "011" },

    { vts: [1,0,0], expected: "gold",   label: "100 flip" },
    { vts: [1,0,1], expected: "ruby",   label: "101 flip" },
    { vts: [1,1,0], expected: "jade",   label: "110 flip" },
    { vts: [1,1,1], expected: "silver", label: "111 flip" },
  ];

  for (const { vts, expected, label } of cases) {
    assertEqual(dukeColor(vts, specName), expected, label);
  }

  // normalization invariant
  const tile = "Q4,4";
  assertEqual(
    dukeColor(tile, specName),
    dukeColor(normalizeTileToVts(tile, specName), specName),
    "string vs vts"
  );

  report("dukeColor", "foundation");
  }

function test_tileColors(specName) {
  const cases = [
    {
      input: [0,0,0],
      expected: { bishop: "white", duke: "silver" },
      label: "origin"
    },
    {
      input: [1,0,0],
      expected: { bishop: "black", duke: "gold" },
      label: "x shift"
    },
  ];

  for (const { input, expected, label } of cases) {
    const result = tileColors(input, specName);

    assertEqual(result.bishop, expected.bishop, `${label} bishop`);
    assertEqual(result.duke,   expected.duke,   `${label} duke`);
  }

  report("tileColors", "foundation");
  }

function test_tileColorString(specName) {
  const cases = [
    { input: [0,0,0], expected: "white-silver", label: "origin" },
    { input: [1,0,0], expected: "black-gold",   label: "x shift" },
  ];

  for (const { input, expected, label } of cases) {
    const result = tileColorString(input, specName);

    assertEqual(result, expected, label);
  }

  report("tileColorString", "foundation");
}

// Seam point: more tests...

function test_colorInvariant(specName) {
  const tiles = ["Q4,4", [0,0,0]];

  for (const tile of tiles) {
    const vts = normalizeTileToVts(tile, specName);

    assertEqual(
      bishopColor(tile, specName),
      bishopColor(vts, specName),
      "bishop invariant"
    );

    assertEqual(
      dukeColor(tile, specName),
      dukeColor(vts, specName),
      "duke invariant"
    );
  }

  report("colorInvariant", "foundation");
}

