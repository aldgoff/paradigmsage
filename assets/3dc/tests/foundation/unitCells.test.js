/* File: unitCells.tests.js
  Path: ./3dc/tests/foundation/
  Purpose: Test the unitCells module.
  Author: Allan Goff
  Date: 3/24/26
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

// --- Module ---
import {getUnitCell,
        getShape,
        getRayTypes,
        getRayTypeInfo,
        getAxisChange,
        getRayCount,
        getCorrelation,
        getBasePiece,
        getLineType,
        getPlaneType,
} from "../../foundation/unitCells/unitCells.js";

// ------------------------------------------------------------

export function run() {
  let prev = snapshotTotals();

  test_getUnitCell();
  test_getShape();
  test_getRayTypes();
  test_getAxisChange();
  test_getRayCount();
  test_getBasePiece();
  test_getLinePlaneType();
  test_unitCellInvariant();
  test_rayTypeCorrelationAlignment();
  // Seampoint: more tests...

  let curr = snapshotTotals();

  const pass = curr.pass - prev.pass;
  const fail = curr.fail - prev.fail;

  finalReport("Foundation/unitCell");
}

// ------------------------------------------------------------
function test_getUnitCell() {
  assertEqual(typeof getUnitCell("2D"), "object", "2D exists");
  assertEqual(typeof getUnitCell("3D"), "object", "3D exists");

  assertThrows(() => getUnitCell("4D"), "invalid dimension throws");

  report("getUnitCell", "unitCells");
  }

function test_getShape() {
  assertEqual(getShape("2D"), "square", "2D shape");
  assertEqual(getShape("3D"), "cube", "3D shape");

  report("getShape", "unitCells");
  }

function test_getRayTypes() {
  const r2 = getRayTypes("2D");
  const r3 = getRayTypes("3D");

  assertEqual(r2.includes("side"), true, "2D side");
  assertEqual(r2.includes("corner"), true, "2D corner");

  assertEqual(r3.includes("face"), true, "3D face");
  assertEqual(r3.includes("edge"), true, "3D edge");
  assertEqual(r3.includes("vertex"), true, "3D vertex");

  report("getRayTypes", "unitCells");
  }

function test_getAxisChange() {
  assertEqual(getAxisChange("2D", "side"), 1, "side axis");
  assertEqual(getAxisChange("2D", "corner"), 2, "corner axis");

  assertEqual(getAxisChange("3D", "face"), 1, "face axis");
  assertEqual(getAxisChange("3D", "edge"), 2, "edge axis");
  assertEqual(getAxisChange("3D", "vertex"), 3, "vertex axis");

  report("getAxisChange", "unitCells");
  }

function test_getRayCount() {
  assertEqual(getRayCount("2D", "side"), 4, "side count");
  assertEqual(getRayCount("2D", "corner"), 4, "corner count");

  assertEqual(getRayCount("3D", "face"), 6, "face count");
  assertEqual(getRayCount("3D", "edge"), 12, "edge count");
  assertEqual(getRayCount("3D", "vertex"), 8, "vertex count");

  report("getRayCount", "unitCells");
  }

function test_getBasePiece() {
  assertEqual(getBasePiece("2D", "side"), "rook", "2D rook");
  assertEqual(getBasePiece("2D", "corner"), "bishop", "2D bishop");

  assertEqual(getBasePiece("3D", "face"), "rook", "3D rook");
  assertEqual(getBasePiece("3D", "edge"), "bishop", "3D bishop");
  assertEqual(getBasePiece("3D", "vertex"), "duke", "3D duke");

  report("getBasePiece", "unitCells");
  }

function test_getLinePlaneType() {
  // 2D
  assertEqual(getLineType("2D", "side"), "orthogonal", "2D orthogonal");
  assertEqual(getLineType("2D", "corner"), "diagonal", "2D diagonal");

  assertEqual(getPlaneType("2D", "side"), null, "2D no plane");

  // 3D
  assertEqual(getPlaneType("3D", "face"), "orthogonal", "3D orthogonal");
  assertEqual(getPlaneType("3D", "edge"), "skew", "3D skew");
  assertEqual(getPlaneType("3D", "vertex"), "slant", "3D slant");

  assertEqual(getLineType("3D", "face"), null, "3D no line");

  report("getLinePlaneType", "unitCells");
  }

function test_unitCellInvariant() {
  for (const dim of ["2D", "3D"]) {
    const rays = getRayTypes(dim);

    for (const r of rays) {
      // axisChange must exist
      const axis = getAxisChange(dim, r);
      assertEqual(typeof axis, "number", `${dim} ${r} axis exists`);

      // correlation must exist
      const piece = getBasePiece(dim, r);
      assertEqual(typeof piece, "string", `${dim} ${r} piece exists`);
    }
  }

  report("unitCellInvariant", "unitCells");
  }

function test_rayTypeCorrelationAlignment() {
  for (const dim of ["2D","3D"]) {
    const rays = getRayTypes(dim);

    for (const r of rays) {
      const c = getCorrelation(dim, r);
      assertEqual(typeof c, "object", `${dim} ${r} correlation exists`);
    }
  }

  report("rayTypeCorrelationAlignment", "unitCells");
}
// Seampoint: more tests...

