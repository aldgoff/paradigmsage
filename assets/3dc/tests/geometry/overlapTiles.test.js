/* File: overlapTiles.tests.js
  Path: ./3dc/tests/overlapTiles/
  Purpose: Test the overlapTiles module.
  Author: Allan Goff
  Date: 3/30/26
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

// --- Module ---
import {getStride,
        getRoles,
} from "../../geometry/overlapTiles.js";

// ------------------------------------------------------------

export function run() {
  let prev = snapshotTotals();

  test_basePieces_stride();
  test_queen_stride();
  test_basePieces_roles();
  test_queen_roles();
  test_fails();
  test_stride_vocab();
  // Seampoint: more tests...

  let curr = snapshotTotals();
  const pass = curr.pass - prev.pass;
  const fail = curr.fail - prev.fail;
  prev = curr;

  finalReport("Geometry/overlap");
}

// ------------------------------------------------------------

function test_basePieces_stride() {
  const cases = [
    { params: { piece: 'rook',   subType: null, quadType: 'all',  k: 0 }, 
      expected: ["source"], 
      label: "Source" },
    { params: { piece: 'rook',   subType: null, quadType: 'all',  k: 2 }, 
      expected: ["end2", "body", "apex", "body", "end2"], 
      label: "Rook (2)" },
    { params: { piece: 'bishop', subType: null, quadType: 'all',  k: 2 }, 
      expected: ["end2", "body", "apex", "body", "end2"], 
      label: "Bishop (2)" },
    { params: { piece: 'duke',   subType: null, quadType: 'edge', k: 2 }, 
      expected: ["end3", "body", "apex", "body", "end3"], 
      label: "Duke-edge (3)" },
    { params: { piece: 'duke',   subType: null, quadType: 'face', k: 2 }, 
      expected: ["end3", "body", "duplex", "body", "end3"], 
      label: "Duke-face (3)" },

    { params: { piece: 'rook',   subType: null, quadType: 'all',  k: 3 }, 
      expected: ["end2", "body", "body", "apex", "body", "body", "end2"], 
      label: "Rook (3)" },
    { params: { piece: 'bishop', subType: null, quadType: 'all',  k: 4 }, 
      expected: ["end2", "body", "body", "body", "apex", "body", "body", "body", "end2"], 
      label: "Bishop (4)" },
    { params: { piece: 'duke',   subType: null, quadType: 'edge', k: 5 }, 
      expected: ["end3", "body", "body", "body", "body", "apex", "body", "body", "body", "body", "end3"], 
      label: "Duke-edge (5)" },
    { params: { piece: 'duke',   subType: null, quadType: 'face', k: 6 }, 
      expected: ["end3", "body", "body", "body", "body", "body", "duplex", "body", "body", "body", "body", "body", "end3"], 
      label: "Duke-face (6)" },
    ];

  for (const { params, expected, label } of cases) {
    let actual = getStride(params);
    assertEqual(JSON.stringify(actual), JSON.stringify(expected), label);
  }

  report("basePiece strides", "overlapTiles");
  }

function test_queen_stride() {
  const cases = [
    { params: { piece: 'queen', subType: 'rook',   quadType: 'all',  k: 2 }, 
      expected: ["hotspot", "body", "qtile", "body", "hotspot"], 
      label: "Queen-Rook (2)" },
    { params: { piece: 'queen', subType: 'bishop', quadType: 'all',  k: 2 }, 
      expected: ["qtile", "body", "Feynman", "body", "qtile"], 
      label: "Queen-Bishop (2)" },
    { params: { piece: 'queen', subType: 'duke',   quadType: 'edge', k: 2 }, 
      expected: ["end3", "body", "apex", "body", "end3"], 
      label: "Queen-Duke-edge (3)" },
    { params: { piece: 'queen', subType: 'duke',   quadType: 'face', k: 2 }, 
      expected: ["end3", "body", "hotspot", "body", "end3"], 
      label: "Queen-Duke-face (3)" },

    { params: { piece: 'queen', subType: 'rook',   quadType: 'all',  k: 3 }, 
      expected: ["end2", "body", "body", "brook", "body", "body", "end2"], 
      label: "Queen-Rook (3)" },
    { params: { piece: 'queen', subType: 'bishop', quadType: 'all',  k: 4 }, 
      expected: ["qtile", "body", "body", "body", "Feynman", "body", "body", "body", "qtile"], 
      label: "Queen-Bishop (4)" },
    { params: { piece: 'queen', subType: 'duke',   quadType: 'edge', k: 6 }, 
      expected: ["end3", "body", "Feynman", "body", "body", "body", "apex", "body", "body", "body", "Feynman", "body", "end3"], 
      label: "Queen-Duke-edge (6)" },
    { params: { piece: 'queen', subType: 'duke',   quadType: 'face', k: 5 }, 
      expected: ["end3", "body", "body", "body", "body", "hotspot", "body", "body", "body", "body", "end3"], 
      label: "Queen-Duke-face (5)" },
    ];

  for (const { params, expected, label } of cases) {
    const actual = getStride(params);
    assertEqual(JSON.stringify(actual), JSON.stringify(expected), label);
  }

  report("queen strides", "overlapTiles");
  }

function test_basePieces_roles() {
  const cases = [
    { params: { piece: 'rook',   subType: null, quadType: 'all',  k: 2 }, 
      expected: [
        { "name": "end2",   "multiplicity": 2 },
        { "name": "body",   "multiplicity": 1 },
        { "name": "apex",   "multiplicity": 1 },
        ], 
      label: "Rook roles" },
    { params: { piece: 'bishop', subType: null, quadType: 'all',  k: 2 }, 
      expected: [
        { "name": "end2",   "multiplicity": 2 },
        { "name": "body",   "multiplicity": 1 },
        { "name": "apex",   "multiplicity": 1 },
        ], 
      label: "Bishop roles" },
    { params: { piece: 'duke',   subType: null, quadType: 'edge', k: 2 }, 
      expected: [
        { "name": "end3",  "multiplicity": 3 },
        { "name": "body",  "multiplicity": 1 },
        { "name": "apex",  "multiplicity": 1 },
        { "name": "third", "multiplicity": 1 },
        ], 
      label: "Duke-edge roles" },
    { params: { piece: 'duke',   subType: null, quadType: 'face', k: 2 }, 
      expected: [
        { "name": "end3",   "multiplicity": 3 },
        { "name": "body",   "multiplicity": 1 },
        { "name": "duplex", "multiplicity": 2 },
        ], 
      label: "Duke-face roles" },
    ];

  for (const { params, expected, label } of cases) {
    let actual = getRoles(params);
    assertEqual(JSON.stringify(actual), JSON.stringify(expected), label);
  }

  report("basePiece roles", "overlapTiles");
  }

function test_queen_roles() {
  const cases = [
    { params: { piece: 'queen', subType: 'rook',   quadType: 'all',  k: 2 }, 
      expected: [
        { "name": "end2",    "multiplicity": 2 },
        { "name": "body",    "multiplicity": 1 },
        { "name": "brook",   "multiplicity": 3 },
        { "name": "qtile",   "multiplicity": 4 },
        { "name": "hotspot", "multiplicity": 4 }
        ],
      label: "Queen-Rook roles" },
    { params: { piece: 'queen', subType: 'bishop', quadType: 'all',  k: 2 }, 
      expected: [
        { "name": "brook",   "multiplicity": 3 },
        { "name": "qtile",   "multiplicity": 4 },
        { "name": "body",    "multiplicity": 1 },
        { "name": "apex",    "multiplicity": 1 },
        { "name": "Feynman", "multiplicity": 2 }
        ],
      label: "Queen-Bishop roles" },
    { params: { piece: 'queen', subType: 'duke',   quadType: 'edge', k: 2 }, 
      expected: [
        { "name": "end3",    "multiplicity": 3 },
        { "name": "body",    "multiplicity": 1 },
        { "name": "apex",    "multiplicity": 1 },
        { "name": "Feynman", "multiplicity": 2 }
        ], 
      label: "Queen-Duke-edge roles" },
    { params: { piece: 'queen', subType: 'duke',   quadType: 'face', k: 2 }, 
      expected: [
        { "name": "end3",    "multiplicity": 3 },
        { "name": "body",    "multiplicity": 1 },
        { "name": "hotspot", "multiplicity": 4 }
        ],
      label: "Queen-Duke-face roles" },
    ];

  for (const { params, expected, label } of cases) {
    const actual = getRoles(params);
    assertEqual(JSON.stringify(actual), JSON.stringify(expected), label);
  }

  report("queen roles", "overlapTiles");
  }

function test_fails() {
  const cases = [
    { fn: () => getStride({ piece: 'rook',    quadType: 'all',  k: -1 }), label: 'k below range' },
    { fn: () => getStride({ piece: 'rook',    quadType: 'all',  k: 11 }), label: 'k above range' },
    { fn: () => getStride({ piece: 'rook',    quadType: 'edge', k:  1 }), label: 'rook invalid quadType' },
    { fn: () => getStride({ piece: 'queen',   quadType: 'all',  k:  1 }), label: 'queen missing subType' },
    { fn: () => getStride({ piece: 'unknown', quadType: 'all',  k:  1 }), label: 'unknown piece' },
    { fn: () => getRoles( { piece: 'queen',   quadType: 'all' }), label: 'getRoles queen missing subType' },
    { fn: () => getRoles( { piece: 'duke',    quadType: 'all' }), label: 'duke invalid quadType' }
  ];

  for (const { fn, label } of cases) {
    assertThrows(fn, label);
  }

  report('failure cases', 'overlapTiles');
  }

function test_stride_vocab() {
  const roles = getRoles({ piece: 'queen', subType: 'rook', quadType: 'all' });
  const vocab = new Set(roles.map(r => r.name));
  vocab.add("source");

  for (let k = 0; k <= 10; k++) {
    const stride = getStride({ piece: 'queen', subType: 'rook', quadType: 'all', k });
    for (const token of stride) {
      assertEqual(vocab.has(token), true, `Unknown token '${token}'`);
    }
  }

  report("stride vocabulary", "overlapTiles");
}
// Seampoint: more tests...

