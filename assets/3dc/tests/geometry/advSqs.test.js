/* File: advSqs.tests.js
  Path: ./3dc/tests/advSqs/
  Purpose: Test the advSqs module.
  Author: Allan Goff
  Date: 4/1/26
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
import {planeToQuad,
} from "../../geometry/quads.js";

// --- Module ---
import {AdvSq,
        isEqual,
} from "../../geometry/advSqs.js";

// ------------------------------------------------------------

export function run() {
  let prev = snapshotTotals();

  test_quad_ctor();
  test_raypair_ctor();
  test_advSqValidation();
  test_nextPrevQuads();
  test_nextPrevPlanes();
  test_apexEnds();
  test_advSqColors();
  // Seampoint: more tests...

  let curr = snapshotTotals();
  const pass = curr.pass - prev.pass;
  const fail = curr.fail - prev.fail;
  prev = curr;

  finalReport("Geometry/advSqs");
}

// ------------------------------------------------------------

function test_quad_ctor() {
  const source = [0,0,0];
  const cases = [
    { input: { quad:  1, k: 2 }, expect: {piece: "rook",  plane: "Horizontal",rayPair: ["left_fore", "right_fore"],range: 2, area:  9}, label: "rook" },
    { input: { quad: 13, k: 3 }, expect: {piece: "bishop",plane: "Upward",    rayPair: ["LFU",  "RFU"],            range: 3, area: 16}, label: "bishop" },
    { input: { quad: 37, k: 4 }, expect: {piece: "duke",  plane: "Major",     rayPair: ["fore_down","fore_up"],    range: 4, area: 25}, label: "duke" },
  ];

  for(const { input, expect, label } of cases) {
    const advSq = AdvSq.fromQuad(source, input.quad, input.k);
    assertEqual(advSq.getPiece(),   expect.piece,   `AdvSq validation failed for piece   ${label} ${input.quad} ${input.k}.`);
    assertEqual(advSq.getPlane(),   expect.plane,   `AdvSq validation failed for plane   ${label} ${input.quad} ${input.k}.`);
    assertEqual(advSq.getRayPair(), expect.rayPair, `AdvSq validation failed for rayPair ${label} ${input.quad} ${input.k}.`);
    assertEqual(advSq.getRange(),   expect.range,   `AdvSq validation failed for range   ${label} ${input.quad} ${input.k}.`);
    assertEqual(advSq.getArea(),    expect.area,    `AdvSq validation failed for area    ${label} ${input.quad} ${input.k}.`);
  }

  report("quad_ctor", "advSqs");
  }

function test_raypair_ctor() {
  const source = [0,0,0];
  const cases = [
    { input: { rayPair: ["left_fore", "right_fore"], k: 2 }, expect: {piece: "rook",  plane: "Horizontal",quad:  1, range: 2, area:  9}, label: "rook" },
    { input: { rayPair: ["LFU",  "RFU"],             k: 3 }, expect: {piece: "bishop",plane: "Upward",    quad: 13, range: 3, area: 16}, label: "bishop" },
    { input: { rayPair: ["fore_down","fore_up"],     k: 4 }, expect: {piece: "duke",  plane: "Major",     quad: 37, range: 4, area: 25}, label: "duke" },
  ];

  for(const { input, expect, label } of cases) {
    const advSq = AdvSq.fromRayPair(source, input.rayPair, input.k);
    assertEqual(advSq.getPiece(), expect.piece, `AdvSq validation failed for piece ${label} ${input.rayPair} ${input.k}.`);
    assertEqual(advSq.getPlane(), expect.plane, `AdvSq validation failed for plane ${label} ${input.rayPair} ${input.k}.`);
    assertEqual(advSq.getQuad(),  expect.quad,  `AdvSq validation failed for quad  ${label} ${input.rayPair} ${input.k}.`);
    assertEqual(advSq.getRange(), expect.range, `AdvSq validation failed for range ${label} ${input.rayPair} ${input.k}.`);
    assertEqual(advSq.getArea(),  expect.area,  `AdvSq validation failed for area  ${label} ${input.rayPair} ${input.k}.`);
  }

  report("raypair_ctor", "advSqs");
  }

function test_advSqValidation() {
  const source = [0,0,0];
  const cases = [
    { input: { quad:  1, k: 2 }, expect: {piece: "rook",  plane: "Horizontal",rayPair: ["left_fore", "right_fore"],range: 2, area:  9}, label: "rook" },
    { input: { quad: 13, k: 3 }, expect: {piece: "bishop",plane: "Upward",    rayPair: ["LFU",  "RFU"],            range: 3, area: 16}, label: "bishop" },
    { input: { quad: 37, k: 4 }, expect: {piece: "duke",  plane: "Major",     rayPair: ["fore_down","fore_up"],    range: 4, area: 25}, label: "duke" },
  ];

  for(const { input, expect, label } of cases) {
    const advSq = AdvSq.fromQuad(source, input.quad, input.k);
    assertEqual(advSq.getPiece(),   expect.piece,   `AdvSq validation failed for piece   ${label} ${input.quad} ${input.k}.`);
    assertEqual(advSq.getPlane(),   expect.plane,   `AdvSq validation failed for plane   ${label} ${input.quad} ${input.k}.`);
    assertEqual(advSq.getRayPair(), expect.rayPair, `AdvSq validation failed for rayPair ${label} ${input.quad} ${input.k}.`);
    assertEqual(advSq.getRange(),   expect.range,   `AdvSq validation failed for range   ${label} ${input.quad} ${input.k}.`);
    assertEqual(advSq.getArea(),    expect.area,    `AdvSq validation failed for area    ${label} ${input.quad} ${input.k}.`);
  }

  report("advSqValid", "advSqs");
  }

function test_nextPrevQuads() {
  const SENTRY = 10; // Number of quads/plane is limited to 4 or 6 - avoids infinite loop on a bug.

  const cases = [
    { input: { source: [0,0,0], quad:  1, k: 0 }, expected:  2, label: "rook" },
    { input: { source: [0,0,0], quad:  1, k: 1 }, expected:  2, label: "rook" },
    { input: { source: [0,0,0], quad:  1, k: 2 }, expected:  2, label: "rook" },
    { input: { source: [0,0,0], quad:  5, k: 4 }, expected:  6, label: "rook wrap" },
    { input: { source: [0,0,0], quad:  8, k: 5 }, expected:  5, label: "rook wrap" },
    { input: { source: [0,0,0], quad: 12, k: 7 }, expected:  9, label: "rook wrap" },

    { input: { source: [1,1,1], quad: 13, k: 6 }, expected: 14, label: "bishop" },
    { input: { source: [1,1,1], quad: 19, k: 7 }, expected: 20, label: "bishop" },
    { input: { source: [1,1,1], quad: 25, k: 8 }, expected: 26, label: "bishop" },
    { input: { source: [1,1,1], quad: 31, k: 9 }, expected: 32, label: "bishop" },
    { input: { source: [1,1,1], quad: 18, k: 6 }, expected: 13, label: "bishop wrap" },
    { input: { source: [1,1,1], quad: 24, k: 6 }, expected: 19, label: "bishop wrap" },
    { input: { source: [1,1,1], quad: 30, k: 6 }, expected: 25, label: "bishop wrap" },
    { input: { source: [1,1,1], quad: 36, k: 6 }, expected: 31, label: "bishop wrap" },

    { input: { source: [-3,-3,-3], quad: 37, k: 3 }, expected: 38, label: "duke" },
    { input: { source: [-3,-3,-1], quad: 41, k: 3 }, expected: 42, label: "duke" },
    { input: { source: [-3, 0,-3], quad: 45, k: 3 }, expected: 46, label: "duke" },
    { input: { source: [-2,-3,-3], quad: 49, k: 3 }, expected: 50, label: "duke" },
    { input: { source: [ 3,-3,-3], quad: 53, k: 3 }, expected: 54, label: "duke" },
    { input: { source: [ 3, 3, 4], quad: 57, k: 3 }, expected: 58, label: "duke" },
    { input: { source: [ 2, 2, 2], quad: 40, k: 3 }, expected: 37, label: "duke wrap" },
    { input: { source: [ 2, 2, 2], quad: 44, k: 3 }, expected: 41, label: "duke wrap" },
    { input: { source: [ 2, 2, 2], quad: 48, k: 3 }, expected: 45, label: "duke wrap" },
    { input: { source: [ 2, 2, 2], quad: 52, k: 3 }, expected: 49, label: "duke wrap" },
    { input: { source: [ 2, 2, 2], quad: 56, k: 3 }, expected: 53, label: "duke wrap" },
    { input: { source: [ 2, 2, 2], quad: 60, k: 3 }, expected: 57, label: "duke wrap" },
  ];

  for(const { input, expected, label } of cases) {
    const advSq = AdvSq.fromQuad(input.source, input.quad, input.k);
    let nextAdvSq = advSq.nextQuad();
    let prevAdvSq = advSq.nextQuad();

    assertEqual(nextAdvSq.quad, expected, `advSqs next/prev quads failed for ${label} ${input.quad} ${input.k}.`);

    for(let i=2; i<SENTRY; i++) {
      let next = nextAdvSq.nextQuad();
      prevAdvSq = next.prevQuad();
      assertEqual(prevAdvSq, nextAdvSq, `advSq bijection failed at ${nextAdvSq}`);
      nextAdvSq = next;
      if(nextAdvSq.quad === advSq.quad) {
        assertEqual(nextAdvSq, advSq, `advSq bijection failed at ${nextAdvSq}`);
        // console.log(`cycle closed at ${i}`);
        break;
      }
    }
  }

  report("nextPrevQuads", "advSqs");
  }

function test_nextPrevPlanes() {
  const SENTRY = 10; // Plane groups max size = 6

  const cases = [
    // --- Rook planes (orthogonal group: 3-cycle) ---
    { input: { source: [0,0,0], quad:  1, k: 0 }, label: "rook" },
    { input: { source: [0,0,0], quad:  5, k: 2 }, label: "rook" },
    { input: { source: [0,0,0], quad:  9, k: 3 }, label: "rook" },

    // --- Bishop planes (skew group: 4-cycle) ---
    { input: { source: [1,1,1], quad: 13, k: 3 }, label: "bishop" },
    { input: { source: [1,1,1], quad: 19, k: 3 }, label: "bishop" },
    { input: { source: [1,1,1], quad: 25, k: 3 }, label: "bishop" },
    { input: { source: [1,1,1], quad: 31, k: 3 }, label: "bishop" },

    // --- Duke planes (slant group: 6-cycle) ---
    { input: { source: [2,2,2], quad: 37, k: 2 }, label: "duke" },
    { input: { source: [2,2,2], quad: 41, k: 2 }, label: "duke" },
    { input: { source: [2,2,2], quad: 45, k: 2 }, label: "duke" },
    { input: { source: [2,2,2], quad: 49, k: 2 }, label: "duke" },
    { input: { source: [2,2,2], quad: 53, k: 2 }, label: "duke" },
    { input: { source: [2,2,2], quad: 57, k: 2 }, label: "duke" },
  ];

  for (const { input, label } of cases) {
    const advSq = AdvSq.fromQuad(input.source, input.quad, input.k);

    let nextAdvSq = advSq.nextPlane();
    let prevAdvSq = advSq.prevPlane();

    // --- Basic sanity: next then prev returns original ---
    const back = nextAdvSq.prevPlane();
    assertEqual(back, advSq, `plane next/prev mismatch for ${label} ${input.quad}`);

    // --- Cycle traversal ---
    let count = 1;

    for (let i = 2; i < SENTRY; i++) {
      const next = nextAdvSq.nextPlane();
      prevAdvSq = next.prevPlane();

      assertEqual(prevAdvSq, nextAdvSq, `plane bijection failed at quad ${nextAdvSq.quad}`);

      nextAdvSq = next;
      count++;

      if (nextAdvSq.quad === advSq.quad) {
        assertEqual(nextAdvSq, advSq, `plane cycle failed to return to origin for ${label}`);

        // Optional: check expected cycle sizes
        // rook=3, bishop=4, duke=6
        // console.log(`plane cycle closed at ${count}`);

        break;
      }
    }
  }

  report("nextPrevPlanes", "advSqs");
  }

function test_apexEnds() {
  const source = [0,0,0];
  const planeQuad = 1;
  const k = 3;
  const cases = [
    { input: "Horizontal",expect: { E1:   [[0,0,0], [0,1,0], [0,2,0], [0,3,0]],
                                    Apex: [[0,0,0], [0,1,1], [0,2,2], [0,3,3]],
                                    E2:   [[0,0,0], [0,0,1], [0,0,2], [0,0,3]], }, label: "rook" },
    { input: "Left",      expect: { E1:   [[0,0,0], [1,0,0], [2,0,0], [3,0,0]],
                                    Apex: [[0,0,0], [1,0,1], [2,0,2], [3,0,3]],
                                    E2:   [[0,0,0], [0,0,1], [0,0,2], [0,0,3]], }, label: "rook" },
    { input: "Right",     expect: { E1:   [[0,0,0], [1,0,0], [2,0,0], [3,0,0]],
                                    Apex: [[0,0,0], [1,1,0], [2,2,0], [3,3,0]],
                                    E2:   [[0,0,0], [0,1,0], [0,2,0], [0,3,0]], }, label: "rook" },

    { input: "Upward",    expect: { // E1:   [[0,0,0], [ 1, 0, 1], [ 2, 0, 2], [ 3, 0, 3]],
                                    E1:   [[0,0,0], [ 1, 1, 0], [ 2, 2, 0], [ 3, 3, 0]],
                                    Apex: [[0,0,0], [ 2, 1, 1], [ 4, 2, 2], [ 6, 3, 3]],
                                    // E2:   [[0,0,0], [ 1, 1, 0], [ 2, 2, 0], [ 3, 3, 0]], 
                                    E2:   [[0,0,0], [ 1, 0, 1], [ 2, 0, 2], [ 3, 0, 3]], 
                                  }, label: "bishop" },
    { input: "Downward",  expect: { // E1:   [[0,0,0], [-1, 0, 1], [-2, 0, 2], [-3, 0, 3]],
                                    E1:   [[0,0,0], [-1, 1, 0], [-2, 2, 0], [-3, 3, 0]],
                                    Apex: [[0,0,0], [-2, 1, 1], [-4, 2, 2], [-6, 3, 3]],
                                    // E2:   [[0,0,0], [-1, 1, 0], [-2, 2, 0], [-3, 3, 0]], 
                                    E2:   [[0,0,0], [-1, 0, 1], [-2, 0, 2], [-3, 0, 3]], 
                                  }, label: "bishop" },
    { input: "Leftward",  expect: { E1:   [[0,0,0], [ 1, 0,-1], [ 2, 0,-2], [ 3, 0,-3]],
                                    // Apex: [[0,0,0], [ 2, 0, 0], [ 4, 0, 0], [ 6, 0, 0]],
                                    Apex: [[0,0,0], [ 2, 1,-1], [ 4, 2,-2], [ 6, 3,-3]],
                                    // E2:   [[0,0,0], [ 1, 0, 1], [ 2, 0, 2], [ 3, 0, 3]], 
                                    E2:   [[0,0,0], [ 1, 1, 0], [ 2, 2, 0], [ 3, 3, 0]], 
                                  }, label: "bishop" },
    { input: "Rightward", expect: { E1:   [[0,0,0], [ 1,-1, 0], [ 2,-2, 0], [ 3,-3, 0]],
                                    // Apex: [[0,0,0], [ 2, 0, 0], [ 4, 0, 0], [ 6, 0, 0]],
                                    Apex: [[0,0,0], [ 2,-1, 1], [ 4,-2, 2], [ 6,-3, 3]],
                                    // E2:   [[0,0,0], [ 1, 1, 0], [ 2, 2, 0], [ 3, 3, 0]], 
                                    E2:   [[0,0,0], [ 1, 0, 1], [ 2, 0, 2], [ 3, 0, 3]], 
                                  }, label: "bishop" },

    { input: "Major",     expect: { E1:   [[0,0,0], [-1, 1, 1], [-2, 2, 2], [-3, 3, 3]],
                                    Apex: [[0,0,0], [ 0, 2, 2], [ 0, 4, 4], [ 0, 6, 6]],
                                    E2:   [[0,0,0], [ 1, 1, 1], [ 2, 2, 2], [ 3, 3, 3]], }, label: "duke" },
    { input: "Minor",     expect: { E1:   [[0,0,0], [ 1, 1,-1], [ 2, 2,-2], [ 3, 3,-3]],
                                    Apex: [[0,0,0], [ 2, 0, 0], [ 4, 0, 0], [ 6, 0, 0]],
                                    E2:   [[0,0,0], [ 1,-1, 1], [ 2,-2, 2], [ 3,-3, 3]], }, label: "duke" },
    { input: "Upleft",    expect: { E1:   [[0,0,0], [ 1, 1,-1], [ 2, 2,-2], [ 3, 3,-3]],
                                    Apex: [[0,0,0], [ 2, 2, 0], [ 4, 4, 0], [ 6, 6, 0]],
                                    E2:   [[0,0,0], [ 1, 1, 1], [ 2, 2, 2], [ 3, 3, 3]], }, label: "duke" },
    { input: "Downleft",  expect: { E1:   [[0,0,0], [-1, 1,-1], [-2, 2,-2], [-3, 3,-3]],
                                    Apex: [[0,0,0], [-2, 2, 0], [-4, 4, 0], [-6, 6, 0]],
                                    E2:   [[0,0,0], [-1, 1, 1], [-2, 2, 2], [-3, 3, 3]], }, label: "duke" },
    { input: "Upright",   expect: { E1:   [[0,0,0], [ 1,-1, 1], [ 2,-2, 2], [ 3,-3, 3]],
                                    Apex: [[0,0,0], [ 2, 0, 2], [ 4, 0, 4], [ 6, 0, 6]],
                                    E2:   [[0,0,0], [ 1, 1, 1], [ 2, 2, 2], [ 3, 3, 3]], }, label: "duke" },
    { input: "Downright", expect: { E1:   [[0,0,0], [-1,-1, 1], [-2,-2, 2], [-3,-3, 3]],
                                    Apex: [[0,0,0], [-2, 0, 2], [-4, 0, 4], [-6, 0, 6]],
                                    E2:   [[0,0,0], [-1, 1, 1], [-2, 2, 2], [-3, 3, 3]], }, label: "duke" },
  ];

  for(const { input, expect, label } of cases) {
    const quad = planeToQuad(input, planeQuad);
    const advSq = AdvSq.fromQuad(source, quad, k);
    const end1Seq = advSq.getEnd1Tiles();
    const apexSeq = advSq.getApexTiles();
    const end2Seq = advSq.getEnd2Tiles();

    assertEqual(JSON.stringify(end1Seq), JSON.stringify(expect.E1),   `AdvSq tile E1 sequence failed for ${label} ${input} ${quad}.`);
    assertEqual(JSON.stringify(apexSeq), JSON.stringify(expect.Apex), `AdvSq tile Apex sequence failed for ${label} ${input} ${quad}.`);
    assertEqual(JSON.stringify(end2Seq), JSON.stringify(expect.E2),   `AdvSq tile E2 sequence failed for ${label} ${input} ${quad}.`);
  }

  report("apexEnds", "advSqs");
  }

function test_advSqColors() {
  const cases = [
    { input: { source: [0,0,0], quad: 1, k: 3 }, expect: { white: 8, black: 8, gold: 4, silver: 4, ruby: 4, jade: 4 }, label: "rook" },
    { input: { source: [0,0,1], quad: 1, k: 3 }, expect: { white: 8, black: 8, gold: 4, silver: 4, ruby: 4, jade: 4 }, label: "rook" },
    { input: { source: [0,1,0], quad: 1, k: 3 }, expect: { white: 8, black: 8, gold: 4, silver: 4, ruby: 4, jade: 4 }, label: "rook" },
    { input: { source: [1,0,0], quad: 1, k: 3 }, expect: { white: 8, black: 8, gold: 4, silver: 4, ruby: 4, jade: 4 }, label: "rook" },

    { input: { source: [0,0,0], quad: 13, k: 3 }, expect: { white: 16, black:  0, gold: 4, silver: 4, ruby: 4, jade: 4 }, label: "bishop" },
    { input: { source: [0,0,1], quad: 13, k: 3 }, expect: { white:  0, black: 16, gold: 4, silver: 4, ruby: 4, jade: 4 }, label: "bishop" },
    { input: { source: [0,1,0], quad: 13, k: 3 }, expect: { white:  0, black: 16, gold: 4, silver: 4, ruby: 4, jade: 4 }, label: "bishop" },
    { input: { source: [1,0,0], quad: 13, k: 3 }, expect: { white:  0, black: 16, gold: 4, silver: 4, ruby: 4, jade: 4 }, label: "bishop" },
    { input: { source: [0,1,1], quad: 13, k: 3 }, expect: { white: 16, black:  0, gold: 4, silver: 4, ruby: 4, jade: 4 }, label: "bishop" },
    { input: { source: [1,1,0], quad: 13, k: 3 }, expect: { white: 16, black:  0, gold: 4, silver: 4, ruby: 4, jade: 4 }, label: "bishop" },
    { input: { source: [1,0,1], quad: 13, k: 3 }, expect: { white: 16, black:  0, gold: 4, silver: 4, ruby: 4, jade: 4 }, label: "bishop" },
    { input: { source: [1,1,1], quad: 13, k: 3 }, expect: { white:  0, black: 16, gold: 4, silver: 4, ruby: 4, jade: 4 }, label: "bishop" },

    { input: { source: [1,0,0], quad: 37, k: 3 }, expect: { white: 8, black: 8, gold: 16, silver:  0, ruby:  0, jade:  0 }, label: "duke" },
    { input: { source: [0,1,1], quad: 37, k: 3 }, expect: { white: 8, black: 8, gold: 16, silver:  0, ruby:  0, jade:  0 }, label: "duke" },
    { input: { source: [0,0,0], quad: 37, k: 3 }, expect: { white: 8, black: 8, gold:  0, silver: 16, ruby:  0, jade:  0 }, label: "duke" },
    { input: { source: [1,1,1], quad: 37, k: 3 }, expect: { white: 8, black: 8, gold:  0, silver: 16, ruby:  0, jade:  0 }, label: "duke" },
    { input: { source: [0,1,0], quad: 37, k: 3 }, expect: { white: 8, black: 8, gold:  0, silver:  0, ruby: 16, jade:  0 }, label: "duke" },
    { input: { source: [1,0,1], quad: 37, k: 3 }, expect: { white: 8, black: 8, gold:  0, silver:  0, ruby: 16, jade:  0 }, label: "duke" },
    { input: { source: [0,0,1], quad: 37, k: 3 }, expect: { white: 8, black: 8, gold:  0, silver:  0, ruby:  0, jade: 16 }, label: "duke" },
    { input: { source: [1,1,0], quad: 37, k: 3 }, expect: { white: 8, black: 8, gold:  0, silver:  0, ruby:  0, jade: 16 }, label: "duke" },
  ];

  for(const { input, expect, label } of cases) {
    const advSq = AdvSq.fromQuad(input.source, input.quad, input.k);
    const colors = advSq.colors();
    assertEqual(JSON.stringify(colors), JSON.stringify(expect), `${label}`);
  }

  report("advSqColors", "advSqs");
  }
// Seampoint: more tests...

