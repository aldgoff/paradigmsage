// Regression tests for addSpookyMove().

import { assertEqual } from "./helpers.js";
import { addSpookyMove } from "../model/barrel.js";

let state = "";

// --------- --------- --------- --------- //

state = addSpookyMove(state, 'X',1, 1);
assertEqual(state, "X1+(1", "spooky placement, reversible");

// --------- --------- --------- --------- //

console.log("addSpookyMove() tests passed");
