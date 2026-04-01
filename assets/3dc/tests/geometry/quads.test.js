/* File: quads.tests.js
  Path: ./3dc/tests/quads/
  Purpose: Test the quads module.
  Author: Allan Goff
  Date: 3/26/26
  UI: the export functions.
*/

// --- Regression framework ---
import {TEST_MODE,
        assertEqual,
        assertThrows,
        assertNotThrows,
        report,
        snapshotTotals,
        finalReport,
  } from "../core/asserts.js";

import { invariant } from "../core/invariants.js";

// --- Module ---
import {pqrTable,
        elementsToGlobalQ,
        nextQuadInPlane,
        prevQuadInPlane,
        strToQ,
        qToStr,
} from "../../geometry/quads.js";
import {quadToPiece,
        quadToPlane,
        quadToPieceQuad,
        quadToPlaneQuad,
        quadToRayPair,
        quadToNickname,
} from "../../geometry/quads.js";
import {pieceToQuad,
        planeToQuad,
        pieceQuadToQuad,
        planeQuadToQuad,
        rayPairToQuad,
        nicknameToQuad,
} from "../../geometry/quads.js";
import {pieceToQuads,
        planeToQuads,
        planeQuadTable,
} from "../../geometry/quads.js";

// ------------------------------------------------------------

export function run() {
  let prev = snapshotTotals();

  test_pieceBijection();
  test_planeBijection();
  test_rayPairBijection();
  test_nextPrev();

  const count  = test_nicknameBijectionCount();
  const unique = test_nicknameUnique();
  test_nicknames(count, unique);

  test_elementsToQuad();

  test_pieceQuadUniqueness();
  test_planeQuadUniqueness();
  test_pieceCoverage();
  test_planeCoverage();

  test_fails();
  // Seampoint: more tests...

  let curr = snapshotTotals();
  const pass = curr.pass - prev.pass;
  const fail = curr.fail - prev.fail;
  if (TEST_MODE.quads !== "VERBOSE") {
    console.log(`Geometry/quads ${pass}/${pass + fail}`);
  }

  finalReport();
}

// ------------------------------------------------------------

function test_pieceBijection() {
  for(let i=1; i<=60; i++) {
    const q1 = i;
    const piece = quadToPiece(q1);
    const quad  = quadToPieceQuad(q1);

    const q2 = pieceToQuad(piece, quad);

    assertEqual(q2, q1, `piece bijection failed at Q${q1}`);
  }

  report("pieceBijection", "quads");
  }

function test_planeBijection() {
  for(let i=1; i<=60; i++) {
    const q1 = i;
    const plane = quadToPlane(q1);
    const quad  = quadToPlaneQuad(q1);

    const q2 = planeToQuad(plane, quad);

    assertEqual(q2, q1, `plane bijection failed at Q${q1}`);
  }

  report("planeBijection", "quads");
  }

function test_rayPairBijection() {
  for(let i=1; i<=60; i++) {
    const q1 = i;
    const rayPair = quadToRayPair(q1);
    const q2      = rayPairToQuad(rayPair);

    assertEqual(q2, q1, `ray pair bijection failed at Q${q1}`);
  }

  report("rayPairBijection", "quads");
  }

function test_nextPrev() {
  for(let i=1; i<=60; i++) {
    const q1 = i;
    const quad = nextQuadInPlane(q1);
    const q2   = prevQuadInPlane(quad);

    assertEqual(q2, q1, `ray pair bijection failed at Q${q1}`);
  }

  report("rayPairBijection", "quads");
}

function test_nicknameBijectionCount() {
  const seenQuads = new Set();

  for(let i=1; i<=60; i++) {
    const q1 = i;
    const nickname = quadToNickname(q1);

    if (nickname == null) continue;

    // inverse mapping
    const q2 = nicknameToQuad(nickname);
    assertEqual(q2, q1, `Nickname inverse failed for ${nickname}`);

    seenQuads.add(q1);
  }

  report("nicknameCount", "quads");

  return seenQuads.size;
  }

function test_nicknameUnique() {
  const seenNicknames = new Set();

  for(let i=1; i<=60; i++) {
    const q1 = i;
    const nickname = quadToNickname(q1);

    if (nickname == null) continue;

    // forward uniqueness: nickname appears once
    assertNotThrows(() => {
      if (seenNicknames.has(nickname)) {
        throw new Error(`Duplicate nickname: ${nickname}`);
      }
    }, "Duplicate nickname");
    seenNicknames.add(nickname);
  }

  report("nicknameUnique", "quads");

  return seenNicknames.size;
  }

function test_nicknames(count, unique) {
  // Ensure unique count matches actual count.
  assertEqual(
    count,
    unique,
    "Nickname unique count mismatch"
  );

  report("nicknames", "quads");
}

function test_elementsToQuad() {
  for(let i=1; i<=60; i++) {
    const q1 = i;
    const res = pqrTable(q1);
    const q2  = elementsToGlobalQ(res);

    assertEqual(q2, q1, `elements quad bijection failed at Q${q1}`);
  }

  report("elementsToQuad", "quads");
}

function test_pieceQuadUniqueness() {
  const seen = new Set();

  for (let q = 1; q <= 60; q++) {
    const key = `${quadToPiece(q)}-${quadToPieceQuad(q)}`;

    assertNotThrows(() => {
      if (seen.has(key)) throw new Error(`Duplicate pieceQ: ${key}`);
    }, "Duplicate pieceQ");
    seen.add(key);
  }

  report("pieceQuadUnique", "quads");
  }

function test_planeQuadUniqueness() {
  const seen = new Set();

  for (let q = 1; q <= 60; q++) {
    const key = `${quadToPlane(q)}-${quadToPlaneQuad(q)}`;

    assertNotThrows(() => {
      if (seen.has(key)) throw new Error(`Duplicate planeQ: ${key}`);
    }, "Duplicate planeQ");
    seen.add(key);
  }

  report("planeQuadUnique", "quads");
  }

function test_pieceCoverage() {
  const seen = new Set();

  for (const piece of ["rook", "bishop", "duke"]) {
    for (const quad of pieceToQuads(piece)) {
      seen.add(quad);
    }
  }

  assertEqual(seen.size, 60, "Piece coverage failed");

  report("pieceCoverage", "quads");
  }

function test_planeCoverage() {
  const seen = new Set();

  for (const planeRec of planeQuadTable) {
    for (const quad of planeToQuads(planeRec.plane)) {
      seen.add(quad);
    }
  }

  assertEqual(seen.size, 60, "Plane coverage failed");

  report("planeCoverage", "quads");
}

function test_fails() {
  // --- strToQ failures ---
  assertThrows(() => strToQ("Q0"),   "strToQ: below range throws");
  assertThrows(() => strToQ("Q61"),  "strToQ: above range throws");
  assertThrows(() => strToQ("Qabc"), "strToQ: non-numeric throws");
  assertThrows(() => strToQ("60"),   "strToQ: missing prefix throws");

  // --- qToStr failures ---
  assertThrows(() => qToStr(0),   "qToStr: below range throws");
  assertThrows(() => qToStr(61),  "qToStr: above range throws");
  assertThrows(() => qToStr(1.5), "qToStr: non-integer throws");
  assertThrows(() => qToStr("1"), "qToStr: wrong type throws");

  report("testFails", "quads");
}
// Seampoint: more tests...

