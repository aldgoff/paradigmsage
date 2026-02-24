// Regression tests for addSpookyMove().

import { assertEqual } from "./helpers.js";

import { addSpookyMove } from "../model/barrel.js";

let state = "";

// --------- --------- --------- --------- //

state = addSpookyMove(state, 'X',1, 1);
assertEqual(state, "X1+(1", "spooky placement, reversible");

state = "X1+(1,2); O2+(1,2)[12]; X2@X1(1)!X1(1)!O2(2); ";
state = addSpookyMove(state, 'X',3, 4);
assertEqual(state, "X1+(1,2); O2+(1,2)[12]; X2@X1(1)!X1(1)!O2(2); X3+(4", "spooky placement, reversible");

// --------- --------- --------- --------- //
console.log("addSpookyMove()       2/ 2 tests passed");
// --------- --------- --------- --------- //

