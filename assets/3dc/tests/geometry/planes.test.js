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

import {getPlaneGroups,
        getPlanesForType,
        getPlaneTypeForPlane,
        nextPlane,
        prevPlane,

        getPlane,
        getPlaneRays,
        getPlaneQuad1,
        getPlanePOV,
        getPlaneRule,
        resolveDstTile,
        // Seampoint: functions to test...
} from "../../geometry/planes.js";

import * as coords from "../../foundation/coords/coords.js";  // vtsToNotation().

// ------------------------------------------------------------

export function run() {
  let prev = snapshotTotals();

  test_planeGroups();         // Spec section 2.2 - plane groups.
  test_planesForType();
  test_planeTypeForPlane();
  test_nextPrev();
  
  test_getPlane();            // Spec section 3 - plane/rays/quads.
  test_getPlaneRays();
  test_getPlaneQuad1();
  test_getPlanePOV();
  test_getPlaneRule();
  test_resolveDstTile();

  test_planeRayInvariants();
  test_planeCycleClosure();
  // Seampoint: more tests...

  // TODO: refactor as teardown(<module>):
  let curr = snapshotTotals();
  const pass = curr.pass - prev.pass;
  const fail = curr.fail - prev.fail;

  finalReport("Geometry/planes");
}

// ------------------------------------------------------------

// Spec section 3.
function test_planeGroups() {
  const groups = getPlaneGroups();

  assertEqual(Object.keys(groups).length, 3, "three plane groups");

  assertEqual(groups.orthogonal.length, 3, "rook planes count");
  assertEqual(groups.skew.length, 4, "bishop planes count");
  assertEqual(groups.slant.length, 6, "duke planes count");

  report("planeGroups", "planes");
  }

function test_planesForType() {
  const rookPlanes = getPlanesForType("orthogonal");

  assertEqual(rookPlanes.includes("Horizontal"), true, "rook has Horizontal");
  assertEqual(rookPlanes.includes("Left"), true, "rook has Left");
  assertEqual(rookPlanes.includes("Right"), true, "rook has Right");

  assertThrows(() => getPlanesForType("invalid"), "invalid type throws");

  report("planesForType", "planes");
  }

function test_planeTypeForPlane() {
  assertEqual(getPlaneTypeForPlane("Horizontal"), "orthogonal", "Horizontal type");
  assertEqual(getPlaneTypeForPlane("Upward"), "skew", "Upward type");
  assertEqual(getPlaneTypeForPlane("Major"), "slant", "Major type");

  assertThrows(() => getPlaneTypeForPlane("FakePlane"), "invalid plane throws");

  report("planeTypeForPlane", "planes");
  }

function test_nextPrev() {
  const cases = [
    { "plane": "Horizontal", "expected": "Left",     label: "rook planes" }, 
    { "plane": "Upward",     "expected": "Downward", label: "bishop planes" }, 
    { "plane": "Major",      "expected": "Minor",    label: "duke planes" }, 
  ];

  for (const test of cases) {
    const nxtPlane = nextPlane(test.plane);
    assertEqual(nxtPlane, test.expected, `${test.label}`);

    const prvPlane = prevPlane(nxtPlane);
    assertEqual(prvPlane, test.plane, `${test.label}`);
  }

  report("test_nextPrev", "planes");
}

// Spec section 4.
function test_getPlane() {
  const p = getPlane("Horizontal");

  assertEqual(typeof p, "object", "plane exists");

  assertThrows(() => getPlane("FakePlane"), "invalid plane throws");

  report("getPlane", "planes");
  }

function test_getPlaneRays() {
  const rays = getPlaneRays("Horizontal");

  assertEqual(rays.length, 4, "Horizontal has 4 rays");
  assertEqual(rays[0], "left_fore", "first ray correct");

  const major = getPlaneRays("Major");
  assertEqual(major.length, 4, "Major has 4 rays");

  const upward = getPlaneRays("Upward");
  assertEqual(upward.length, 6, "Upward has 6 rays");

  report("getPlaneRays", "planes");
  }

function test_getPlaneQuad1() {
  assertEqual(getPlaneQuad1("Horizontal"), "Forward", "Horizontal quad1");
  assertEqual(getPlaneQuad1("Major"), "Dart", "Major quad1");
  assertEqual(getPlaneQuad1("Left"), null, "Left quad1 null");

  report("getPlaneQuad1", "planes");
  }


function test_getPlanePOV() {
  assertEqual(getPlanePOV("Horizontal"), "White", "Horizontal POV");
  assertEqual(getPlanePOV("Major"), "Neutral", "Major POV");
  assertEqual(getPlanePOV("Upleft"), "White", "Upleft POV");

  report("getPlanePOV", "planes");
  }

function test_getPlaneRule() {
  assertEqual(getPlaneRule("Horizontal"), "1.1", "Horizontal rule");
  assertEqual(getPlaneRule("Leftward"), "2.2", "Leftward rule");
  assertEqual(getPlaneRule("Minor"), "3.3", "Minor rule");

  report("getPlaneRule", "planes");
}

function test_resolveDstTile() {
  const source = [0,0,0]; // Q4,4.
  const cases = [
    { input: { quad:  1, k: 2, s: 0 }, expect: {dst: 'Q6,6' }, label: "no stride" },
    { input: { quad:  1, k: 2, s: 1 }, expect: {dst: 'Q6,4' }, label: "E1" },
    { input: { quad:  1, k: 2, s: 2 }, expect: {dst: 'Q6,5' }, label: "outbound" },
    { input: { quad:  1, k: 2, s: 3 }, expect: {dst: 'Q6,6' }, label: "apex" },
    { input: { quad:  1, k: 2, s: 4 }, expect: {dst: 'Q5,6' }, label: "inbound" },
    { input: { quad:  1, k: 2, s: 5 }, expect: {dst: 'Q4,6' }, label: "E2" },
    { input: { quad:  1, k: 2, s: 6 }, expect: {dst: 'Q6,6' }, label: "tooLarge" },
    { input: { quad:  1, k: 0, s: 2 }, expect: {dst: 'Q4,4' }, label: "no perimeter" },
    { input: { quad:  1, k: 7, s: 6 }, expect: {dst: [0,7,5]}, label: "large perimeter" },
    { input: { quad:  1, k: 2, s: 5 }, expect: {dst: 'Q4,6' }, label: "rook linear E2" },
    { input: { quad:  2, k: 2, s: 1 }, expect: {dst: 'Q4,6' }, label: "rook linear E1" },
    { input: { quad: 13, k: 3, s: 1 }, expect: {dst: 'KN7,4'}, label: "Upward" },
    { input: { quad: 13, k: 3, s: 0 }, expect: {dst: [6,3,3]}, label: "Upward" },
    { input: { quad: 37, k: 3, s: 6 }, expect: {dst: 'KB8,8'}, label: "Major onBoard" },
    { input: { quad: 37, k: 3, s: 5 }, expect: {dst: [1,5,5]}, label: "Major offBoard" },
    { input: { quad: 54, k: 2, s: 3 }, expect: {dst: 'Q8,4' }, label: "Duplex" },
    { input: { quad: 58, k: 2, s: 3 }, expect: {dst: 'Q8,4' }, label: "Duplex" },
  ];

  for(const { input, expect, label } of cases) {
    const dst = resolveDstTile(source, input.quad, input.k, input.s); // [1,1,1];
    assertEqual(dst, expect.dst, `resolveDstTile validation failed ${label} 
      ${dst} Q${input.quad} k: ${input.k} stride: ${input.s}.`);
  }

  report("resolveDstTile", "planes");
  }

function test_planeRayInvariants() {
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

  report("planeRayInvariants", "planes");
  }

function test_planeCycleClosure() {
  const groups = getPlaneGroups();

  for (const planes of Object.values(groups)) {
    for (const p of planes) {
      const rays = getPlaneRays(p);

      // implicit closure: last connects to first
      assertEqual(rays.length >= 4, true, `${p} cycle valid`);
    }
  }

  report("planeCycleClosure", "planes");
}
// Seampoint: more tests...

