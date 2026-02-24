// Regression tests for addScore().

import { assertEqual } from "./helpers.js";

import { addScore } from "../model/barrel.js";

let state = "X1+(1,2); O2=(4,5); X3+(2,3); O4+(5,6); X5+(3,1); O6!X5(3); ";

// --------- --------- --------- --------- //

state = addScore(state, { X: 1, O: 0.5 });
assertEqual(state, "X1+(1,2); O2=(4,5); X3+(2,3); O4+(5,6); X5+(3,1); O6!X5(3); {X-1, O-0.5}", "X quantum win (chronoblock overlap)");

// --------- --------- --------- --------- //

console.log("addScore()            1/ 1 tests passed");

