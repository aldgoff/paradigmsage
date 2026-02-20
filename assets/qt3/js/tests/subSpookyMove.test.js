// Regression tests for subSpookyMove().

import { assertEqual } from "./helpers.js";

import { addSpookyMove } from "../model/barrel.js";
import { subSpookyMove } from "../model/barrel.js";

let state = "";

// --------- --------- --------- --------- //

state = addSpookyMove(state, 'X',1, 1);
state = subSpookyMove(state);
assertEqual(state, "", "spooky removement");

// --------- --------- --------- --------- //

console.log("subSpookyMove() tests passed");

