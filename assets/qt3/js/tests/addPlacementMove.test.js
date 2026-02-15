// Regression tests for addPlacementMove().

import { assertEqual } from "./helpers.js";
import { addSpookyMove } from "../model/barrel.js";
import { addPlacementMove } from "../model/barrel.js";
import { addLoop } from "../model/barrel.js";

let state = "";

// --------- --------- --------- --------- //

state = addSpookyMove(state, 'X',1, 1);
state = addPlacementMove(state, 'X',1, 1,2);
state = addLoop(state, [], []);
assertEqual(state, "X1+(1,2); ", "single placement");

state = addSpookyMove(state, 'O',2, 2);
state = addPlacementMove(state, 'O',2, 2,5);
state = addLoop(state, [], []);
assertEqual(state, "X1+(1,2); O2+(2,5); ", "single placement");

state = addSpookyMove(state, 'X',3, 5,1);
state = addPlacementMove(state, 'X',3, 5,1);
state = addLoop(state, [], []);
assertEqual(state, "X1+(1,2); O2+(2,5); X3+(1,5); ", "single placement");

// --------- --------- --------- --------- //

console.log("addPlacementMove() tests passed");
