/* File: state.tests.js
  Path: ./3dc/tests/state/
  Purpose: Test the state module.
  Author: Allan Goff
  Date: 4/06/26
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

// --- Load JSON ---
import stateData from "../../model/state/state.json" assert { type: "json" };
  const stateModule = stateData.state_module;
  const Setup   = stateModule.Setup;
  const Moves   = stateModule.Moves;
  const Gambits = stateModule.Gambits;
  const AdvSqs  = stateModule.AdvSqs;
// Seampoint: more objects...

// --- Layers ---
import * as coords from "../../foundation/coords/coords.js";

// --- Module ---
import * as state from "../../model/state/state.js";

// ------------------------------------------------------------

export function run() {
  let prev = snapshotTotals();

  test_state();
  test_setup();
  // test_moves();
  test_gambits();
  // test_advsqs();
  // Seampoint: more tests...

  let curr = snapshotTotals();
  const pass = curr.pass - prev.pass;
  const fail = curr.fail - prev.fail;
  prev = curr;

  finalReport("Model/state");
}

// ------------------------------------------------------------

function test_state() {
  const cases = [
    { expected: 44, label: "-example" },
    { expected: 75, label: "-_cannonicalSchema" },
    { expected: 11, label: "Setup" },
    { expected:  5, label: "Moves" },
    { expected:  4, label: "Gambits" },
    { expected:  6, label: "AdvSqs" },
  ];

  let i=0;
  for(const state in stateModule) {
    assertEqual(stateModule[state].length, cases[i].expected, cases[i].label);
    i++;
  }

  report("stateModule", "state");
  }

function test_setup() {
  const cases = [
    { expected: '{"board":[8,8,8],"play":"off","trays":"none","gap":0,"initialPos":"std|list","itemized":{"white":[],"black":[]}}', label: "8x8x8" },
    { expected: '{"board":[10,8,8],"play":"off","trays":"none","gap":0,"initialPos":"std|list","itemized":{"white":[],"black":[]}}', label: "10x8x8" },
    { expected: '{"board":[10,10,10],"play":"off","trays":"none","gap":0,"initialPos":"std|list","itemized":{"white":[],"black":[]}}', label: "10x10x10" },

    { expected: '{"board":[8,8,8],"play":"game","trays":"real","gap":0,"autoload":true}', label: "game-real" },
    { expected: '{"board":[8,8,8],"play":"puzzle","trays":"factory","gap":0,"autoload":true}', label: "puzzle-factory" },

    { expected: '{"board":[8,8,8],"play":"game","trays":"real","gap":1,"autoload":true}', label: "gap 1" },
    { expected: '{"board":[8,8,8],"play":"game","trays":"real","gap":2,"autoload":true}', label: "gap 2" },
    { expected: '{"board":[8,8,8],"play":"game","trays":"real","gap":3,"autoload":true}', label: "gap 3" },

    { expected: '{"board":[6,6,6],"play":"game","trays":"real","gap":0}', label: "6x6x6" },
    { expected: '{"board":[5,5,5],"play":"game","trays":"real","gap":0}', label: "5x5x5" },
    { expected: '{"board":[4,4,4],"play":"game","trays":"real","gap":0}', label: "4x4x4" },
  ];

  Setup.forEach((entry, i) => {
    const obj = JSON.stringify(entry);
    assertEqual(obj, cases[i].expected, cases[i].label);
  });

  report("Setup array", "state");
  }

function test_moves() {
  const cases = [
    { expected: '{"turn":1,"moves":["P-K4,4","P-Q4,3"],"coords":["",""],"annotations":["","..."]}', label: "turn 1" },
    { expected: '{"turn":2,"moves":["PxP","N-KB3,3"],"coords":["...",""],"annotations":["",""]}', label: "turn 2" },
    { expected: '{"turn":3,"moves":["qnP-QN3,4","..."],"coords":["...","..."],"annotations":["...","..."]}', label: "turn 3" },
  ];

  Moves.forEach((entry, i) => {
    const obj = JSON.stringify(entry);
    assertEqual(obj, cases[i].expected, cases[i].label);
  });

  report("Moves array", "state");
  }

function test_gambits() {
  const cases = [
    { expected: '{"Q":37,"src":"Q3,3","dst":"KB2,2","area":0}', label: "queen/king" },
    { expected: '{"Q":38,"src":"Q3,3","dst":"KN3,3","area":0}', label: "queen/knight" },
    { expected: '{"Q":1,"src":"Q3,3","dst":"Q1,1","area":0}',   label: "queen/queen" },
    { expected: '{"Q":1,"src":"Q3,3","dst":[6,3,3],"area":0}',  label: "queen/queen" },
  ];

  Gambits.forEach((entry, i) => {
    const obj = JSON.stringify(entry);
    assertEqual(obj, cases[i].expected, cases[i].label);
  });

  report("Gambits array", "state");
  }

function test_advsqs() {
  const cases = [
    { expected: '{"src":"Q1,1","dst":"KB2,2"}', label: "rook?" }, // TODO verify tests.
    { expected: '{"src":"Q2,2","dst":"KN3,3"}', label: "bishop?" },
    { expected: '{"src":"K3,3","dst":"Q1,1"}',  label: "duke?" },
    { expected: '{"src":"K4,4","dst":"KR1,1"}', label: "stack?" },
  ];

  AdvSqs.forEach((entry, i) => {
    const obj = JSON.stringify(entry);
    assertEqual(obj, cases[i].expected, cases[i].label);
  });

  report("AdvSqs array", "state");
  }

// Seampoint: more tests...

