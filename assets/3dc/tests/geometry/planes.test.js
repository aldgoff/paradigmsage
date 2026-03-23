/* File: planes.tests.js
  Path: ./3dc/tests/geometry/
  Purpose: Test the planes module.
  Author: Allan Goff
  Date: 3/23/26
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

import {
  getBasePieces,
  getPlaneTypeForPiece,

  getPlaneGroups,
  getPlanesForType,
  getPlaneTypeForPlane,

  getPlane,
  getPlaneRays,
  getPlaneQuad1,
  getPlanePOV,
  getPlaneRule,
        // Seampoint: functions to test...
} from "../../geometry/planes.js";

// ------------------------------------------------------------

export function run() {
  let prev = snapshotTotals();

  test_basePieces();          // Spec paragraph 2 - base pieces.
  test_planeTypeForPiece();
  test_planeTypeInvariant();

  test_planeGroups();         // Spec paragraph 3 - plane groups.
  test_planesForType();
  test_planeTypeForPlane();
  test_piecePlaneConsistency();  
  
  test_getPlane();            // Spec paragraph 34- plane/rays/quads.
  test_getPlaneRays();
  test_getPlaneQuad1();
  test_getPlanePOV();
  test_getPlaneRule();
  test_planeRayInvariant();
  // Seampoint: more tests...

  let curr = snapshotTotals();  // TODO: refactor as teardown(<module>):

  const pass = curr.pass - prev.pass;
  const fail = curr.fail - prev.fail;

  if (TEST_MODE.geometry !== "VERBOSE") {
    console.log(`Geometry/rays ${pass}/${pass + fail}`);
  }

  finalReport();
}

// ------------------------------------------------------------

// Spec paragraph 2.
function test_basePieces() {
  const expected = ["rook", "bishop", "duke"];
  const result = getBasePieces();

  assertEqual(result, expected, "base pieces list");

  report("basePieces", "geometry");
  }

function test_planeTypeForPiece() {
  assertEqual(getPlaneTypeForPiece("rook"), "orthogonal", "rook plane type");
  assertEqual(getPlaneTypeForPiece("bishop"), "skew", "bishop plane type");
  assertEqual(getPlaneTypeForPiece("duke"), "slant", "duke plane type");

  assertThrows(() => getPlaneTypeForPiece("pawn"), "invalid piece throws");

  report("planeTypeForPiece", "geometry");
  }

function test_planeTypeInvariant() {
  const pieces = ["rook", "bishop", "duke"];

  for (const p of pieces) {
    const type = getPlaneTypeForPiece(p);
    const valid = ["orthogonal", "skew", "slant"].includes(type);
    assertEqual(valid, true, `${p} valid plane type`);
  }

  report("planeTypeInvariant", "geometry");
}

// Spec paragraph 3.
function test_planeGroups() {
  const groups = getPlaneGroups();

  assertEqual(Object.keys(groups).length, 3, "three plane groups");

  assertEqual(groups.orthogonal.length, 3, "rook planes count");
  assertEqual(groups.skew.length, 4, "bishop planes count");
  assertEqual(groups.slant.length, 6, "duke planes count");

  report("planeGroups", "geometry");
  }

function test_planesForType() {
  const rookPlanes = getPlanesForType("orthogonal");

  assertEqual(rookPlanes.includes("Horizontal"), true, "rook has Horizontal");
  assertEqual(rookPlanes.includes("Left"), true, "rook has Left");
  assertEqual(rookPlanes.includes("Right"), true, "rook has Right");

  assertThrows(() => getPlanesForType("invalid"), "invalid type throws");

  report("planesForType", "geometry");
  }

function test_planeTypeForPlane() {
  assertEqual(getPlaneTypeForPlane("Horizontal"), "orthogonal", "Horizontal type");
  assertEqual(getPlaneTypeForPlane("Upward"), "skew", "Upward type");
  assertEqual(getPlaneTypeForPlane("Major"), "slant", "Major type");

  assertThrows(() => getPlaneTypeForPlane("FakePlane"), "invalid plane throws");

  report("planeTypeForPlane", "geometry");
  }

function test_piecePlaneConsistency() {
  const pieces = ["rook", "bishop", "duke"];

  for (const p of pieces) {
    const type = getPlaneTypeForPiece(p);
    const planes = getPlanesForType(type);

    assertEqual(Array.isArray(planes), true, `${p} has planes`);
    assertEqual(planes.length > 0, true, `${p} non-empty planes`);
  }

  report("piecePlaneConsistency", "geometry");
}

// Spec paragraph 4.
function test_getPlane() {
  const p = getPlane("Horizontal");

  assertEqual(typeof p, "object", "plane exists");

  assertThrows(() => getPlane("FakePlane"), "invalid plane throws");

  report("getPlane", "geometry");
  }

function test_getPlaneRays() {
  const rays = getPlaneRays("Horizontal");

  assertEqual(rays.length, 4, "Horizontal has 4 rays");
  assertEqual(rays[0], "left_fore", "first ray correct");

  const major = getPlaneRays("Major");
  assertEqual(major.length, 4, "Major has 4 rays");

  const upward = getPlaneRays("Upward");
  assertEqual(upward.length, 6, "Upward has 6 rays");

  report("getPlaneRays", "geometry");
  }

function test_getPlaneQuad1() {
  assertEqual(getPlaneQuad1("Horizontal"), "Forward", "Horizontal quad1");
  assertEqual(getPlaneQuad1("Major"), "Dart", "Major quad1");
  assertEqual(getPlaneQuad1("Left"), null, "Left quad1 null");

  report("getPlaneQuad1", "geometry");
  }


function test_getPlanePOV() {
  assertEqual(getPlanePOV("Horizontal"), "White", "Horizontal POV");
  assertEqual(getPlanePOV("Major"), "Neutral", "Major POV");
  assertEqual(getPlanePOV("Upleft"), "Top", "Upleft POV");

  report("getPlanePOV", "geometry");
  }

function test_getPlaneRule() {
  assertEqual(getPlaneRule("Horizontal"), "1.1", "Horizontal rule");
  assertEqual(getPlaneRule("Leftward"), "2.2", "Leftward rule");
  assertEqual(getPlaneRule("Minor"), "3.3", "Minor rule");

  report("getPlaneRule", "geometry");
  }

function test_planeRayInvariant() {
  const groups = getPlaneGroups();

  for (const planes of Object.values(groups)) {
    for (const p of planes) {
      const rays = getPlaneRays(p);

      const validLength = (rays.length === 4 || rays.length === 6);
      assertEqual(validLength, true, `${p} valid ray count`);

      const unique = new Set(rays).size === rays.length;
      assertEqual(unique, true, `${p} unique rays`);
    }
  }

  report("planeRayInvariant", "geometry");
}

// Seampoint: more tests...

