/* File: coords.tests.js
  Path: ./3dc/tests/foundation/
  Purpose: Test the coords module.
  Author: Allan Goff
  Date: 3/18/26
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
        tileToRcs,
        boardToRcs,
        rcsToVts,
        vtsToRcs,
        rcsToBoard,
        onBoardRcs,
        onBoardVts,
        // Seam point: functions to test...
} from "../../foundation/coords/coords.js";

// ------------------------------------------------------------

export function run() {
  const specNames = ["8x8x8", "10x8x8", "10x10x10"];

  let prev = snapshotTotals();

  for (const specName of specNames) {
    if (TEST_MODE.foundation === "VERBOSE") {
      console.log(getBoardSpec(specName));
    }

    test_normalizeTileToVts(specName);
    test_tileToRcs(specName);

    test_boardToRcs(specName);
    test_rcsToVts(specName);
    test_vtsToRcs(specName);
    test_rcsToBoard(specName);

    test_onBoardRcs(specName);
    test_onBoardVts(specName);
    // Seam point: more tests...

    test_roundTrip(specName);

    let curr = snapshotTotals();

    const pass = curr.pass - prev.pass;
    const fail = curr.fail - prev.fail;

    // if (TEST_MODE.foundation !== "VERBOSE") {
    //   console.log(`Foundation/coords (${specName}) ${pass}/${pass + fail}`);
    // }

    prev = curr;
  }

  finalReport("Foundation/coords");
}

// ------------------------------------------------------------

function test_normalizeTileToVts(specName) {
  const cases = [
    { input: "QR1,1", expected: rcsToVts(boardToRcs("QR1,1", specName), specName), label: "string input" },
    { input: [0,0,0], expected: [0,0,0],                                           label: "vts passthrough" },
  ];

  for (const { input, expected, label } of cases) {
    const result = normalizeTileToVts(input, specName);

    assertEqual(result, expected, `${label} → vts`);
  }

  report("normalizeTileToVts", "foundation");
  }

function test_tileToRcs(specName) {
  const spec = getBoardSpec(specName);

  const center = [spec.Nz/2, spec.Nx/2, spec.Ny/2];

  const cases = [
    { input: "QR1,1", expected: boardToRcs("QR1,1", specName), label: "string input" },
    { input: [0,0,0], expected: center, label: "vts input" },
  ];

  for (const { input, expected, label } of cases) {
    const result = tileToRcs(input, spec);

    assertEqual(result, expected, `${label} → rcs`);
  }

  report("tileToRcs", "foundation");
}

function test_boardToRcs(specName) {
  const spec = getBoardSpec(specName);
  const levelMap = spec.level_map;

  const validCases = [
    { loc: "QR1,1", expected: [levelMap["QR"], 1, 1], label: "QR"},
    { loc: "Q1,1",  expected: [levelMap["Q"], 1, 1],  label: "Q"},
    { loc: "K4,4",  expected: [levelMap["K"], 4, 4],  label: "K"},
  ];

  const invalidCases = [
    // Format errors:
      ["QR1-1", "wrong delimiter"],
      ["QR1 1", "missing comma"],
      ["QR,1",  "missing X"],
      ["QR1,",  "missing Y"],
      ["QR",    "no coordinates"],
      ["ZZ1,1", "invalid prefix"],
      ["",      "empty input"],
    // Numeric errors: Save for the onBoard functions.
      ["QR-1,1",  "negative X"],
      ["QR1,-1",  "negative Y"],
      ["QR1.5,1", "non-integer"],
  ];

  for (const { loc, expected, label } of validCases) {
    const rcs = boardToRcs(loc, specName);

    assertEqual(rcs, expected, `rcs → ${label}`);
  }

  for (const [loc, label] of invalidCases) {
    assertThrows(() => boardToRcs(loc, specName), label);
  }

  report("boardToRcs", "foundation");
  }

function test_rcsToVts(specName) {
  const spec = getBoardSpec(specName);

  const center = [  spec.Nz/2,   spec.Nx/2,   spec.Ny/2];
  const corner = [1-spec.Nz/2, 1-spec.Nx/2, 1-spec.Ny/2];

  const cases = [
    { rcs: center,                            expected: [0, 0, 0],                       label: "anchor"},
    { rcs: [1, 1, 1],                         expected: [corner[0],corner[1],corner[2]], label: "corner"},
    { rcs: [center[0]+1,center[1],center[2]], expected: [1, 0, 0],                       label: "mid level"},
  ];

  for (const { rcs, expected, label } of cases) {
    const vts = rcsToVts(rcs, spec);

    assertEqual(vts, expected, `${label} → vts`);
  }

  report("rcsToVts", "foundation");
  }

function test_vtsToRcs(specName) {
  const spec = getBoardSpec(specName);

  const center = [  spec.Nz/2,   spec.Nx/2,   spec.Ny/2];
  const corner = [1-spec.Nz/2, 1-spec.Nx/2, 1-spec.Ny/2];

  const cases = [
    { vts: [0, 0, 0],                       expected: center,                            label: "anchor"},
    { vts: [corner[0],corner[1],corner[2]], expected: [1, 1, 1],                         label: "corner"},
    { vts: [1, 0, 0],                       expected: [center[0]+1,center[1],center[2]], label: "mid level"},
  ];

  for (const { vts, expected, label } of cases) {
    const rcs = vtsToRcs(vts, spec);

    assertEqual(rcs, expected, `rcs → ${label}`);
  }

  report("vtsToRcs", "foundation");
  }

function test_rcsToBoard(specName) {
  const spec = getBoardSpec(specName);
  const inv = spec.inverse_level_map;

  const center = [spec.Nz/2, spec.Nx/2, spec.Ny/2];

  const cases = [
    { rcs: [1, 1, 1],                         expected: `${inv["1"]}1,1`,                                       label: "corner"},
    { rcs: center,                            expected: `${inv[String(center[0])]}${center[1]},${center[2]}`,   label: "anchor"},
    { rcs: [center[0]+1,center[1],center[2]], expected: `${inv[String(center[0]+1)]}${center[1]},${center[2]}`, label: "mid level"},
  ];

  for (const { rcs, expected, label } of cases) {
    const result = rcsToBoard(rcs, specName);

    assertEqual(result, expected, `${label} → board`);
  }

  report("rcsToBoard", "foundation");
}

function test_onBoardRcs(specName) {
  const spec = getBoardSpec(specName);

  const cases = [
    // In-bounds
    { rcs: [1, 1, 1],                   expected: true, label: "corner in"},
    { rcs: [spec.Nz, spec.Nx, spec.Ny], expected: true, label: "opposite corner in"},

    // Below bounds
    { rcs: [0, 1, 1], expected: false, label: "Z below"},
    { rcs: [1, 0, 1], expected: false, label: "X below"},
    { rcs: [1, 1, 0], expected: false, label: "Y below"},

    // Above bounds (spec-driven)
    { rcs: [spec.Nz + 1, 1, 1], expected: false, label: "Z above"},
    { rcs: [1, spec.Nx + 1, 1], expected: false, label: "X above"},
    { rcs: [1, 1, spec.Ny + 1], expected: false, label: "Y above"},
  ];

  for (const { rcs, expected, label } of cases) {
    const result = onBoardRcs(rcs, spec);

    assertEqual(result, expected, `${label} → onBoardRcs`);
  }

  report("onBoardRcs", "foundation");
  }

function test_onBoardVts(specName) {
  const spec = getBoardSpec(specName);

  const hz = spec.Nz / 2;
  const hx = spec.Nx / 2;
  const hy = spec.Ny / 2;

  const cases = [
    // In-bounds (corners)
    { vts: [1 - hz, 1 - hx, 1 - hy], expected: true, label: "corner in"},
    { vts: [hz, hx, hy], expected: true, label: "opposite corner in"},

    // Out of bounds (just outside)
    { vts: [1 - hz - 1, 1 - hx - 1, 1 - hy - 1], expected: false, label: "outside low"},
    { vts: [hz + 1, hx + 1, hy + 1], expected: false, label: "outside high"},
  ];

  for (const { vts, expected, label } of cases) {
    const result = onBoardVts(vts, spec);

    assertEqual(result, expected, `${label} → onBoardVts`);
  }

  report("onBoardVts", "foundation");
}

// Seam point: more tests...

function test_roundTrip(specName) {
  const cases = ["QR1,1", "Q4,4", "K4,4"];

  for (const loc of cases) {
    const rcs1 = boardToRcs(loc, specName);
    const vts  = rcsToVts(rcs1, specName);
    const rcs2 = vtsToRcs(vts, specName);
    const loc2 = rcsToBoard(rcs2, specName);

    assertEqual(rcs2, rcs1, `${loc} rcs roundTrip`);
    assertEqual(loc2, loc, `${loc} board roundTrip`);
  }
  report("roundTrip", "foundation");
}

