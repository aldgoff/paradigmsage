/* File: coords.tests.js
  Path: ./3dc/tests/foundation/coords/
  Purpose: Test the coords module.
  Author: Allan Goff
  Date: 3/18/26
  UI: the export functions.
*/

import {assertEqual,
        assertThrows,
        report,
        finalReport,
 } from "../../core/asserts.js";

import { invariant } from "../../core/invariants.js";

import {getBoardSpec,
        boardToRcs,
        rcsToVts,
        vtsToRcs,
} from "../../../foundation/coords/coords.js";

export function run() {
  const specName = "8x8x8"; // "8x8x8", "10x8x8", "10x10x10".

  if (true) console.log(getBoardSpec(specName));
  
  test_boardToRcs(specName);
  test_rcsToVts(specName);
  test_vtsToRcs(specName);

  test_roundTrip(specName);

  finalReport();

  // Seam point: more tests...
}

function test_boardToRcs(specName) {
  const validCases = [
    ["QR1,1", 1, 1, 1, "QR"],
    ["K4,4",  5, 4, 4, "K"],
    // Seam point: more valid tiles.
    ];
  const invalidCases = [
    // Off the board errors:
      // ["QR11,11", "out of bounds high"],
      // ["QR0,0",   "out of bounds low"],
    // Format errors:
      ["QR1-1", "wrong delimiter"],
      ["QR1 1", "missing comma"],
      ["QR,1",  "missing X"],
      ["QR1,",  "missing Y"],
      ["QR",    "no coordinates"],
      ["ZZ1,1", "invalid prefix"],
      ["",      "empty input"],
    // Numeric errors: Save for the onBoard functions.
      // ["QR0,1",   "X below range"],
      // ["QR1,0",   "Y below range"],
      // ["QR-1,1",  "negative X"],
      // ["QR1,-1",  "negative Y"],
      // ["QR1.5,1", "non-integer"],
    // Bounds errors (spec-dependent): Save for the onBoard functions.
      // ["QR9,1", "X > Nx"],
      // ["QR1,9", "Y > Ny"],
    // Seam point: more invalid  tiles.
  ];

  for (const [loc, z, x, y, label] of validCases) {
    const rcs = boardToRcs(loc, specName);

    assertEqual(rcs, [z, x, y], `rcs → ${label}`);
    }
  
  for (const [loc, label] of invalidCases) {
    assertThrows( () => boardToRcs(loc, specName), label);
  }
  report("boardToRcs");
  }

function test_rcsToVts(specName) {
  const cases = [
    ["Q4,4",   0,  0,  0, "anchor"],
    ["QR1,1", -3, -3, -3, "corner"],
    ["K4,4",   1,  0,  0, "mid level"],
    // Seam point: more cases.
  ];

  for (const [loc, z, x, y, label] of cases) {
    const rcs = boardToRcs(loc, specName);
    const vts = rcsToVts(rcs, specName);

    assertEqual(vts, [z, x, y], `${label} → vts`);
  }
  report("rcsToVts");
  }

function test_vtsToRcs(specName) {
  const cases = [
    [[ 0,  0,  0], 4, 4, 4, "anchor"],
    [[-3, -3, -3], 1, 1, 1, "corner"],
    [[ 1,  0,  0], 5, 4, 4, "mid level"],
    // Seam point: more cases.
  ];

  for (const [vts, z, x, y, label] of cases) {
    const rcs = vtsToRcs(vts, specName);

    assertEqual(rcs, [z, x, y], `rcs → ${label}`);
  }
  report("vtsToRcs");
}

function test_roundTrip(specName) {
  const cases = ["QR1,1", "Q4,4", "K4,4"];

  for (const loc of cases) {
    const rcs1 = boardToRcs(loc, specName);
    const vts  = rcsToVts(rcs1, specName);
    const rcs2 = vtsToRcs(vts, specName);

    assertEqual(rcs2, rcs1, `${loc} roundTrip`);
  }
  report("roundTrip");
}

// Seam point: more tests...

