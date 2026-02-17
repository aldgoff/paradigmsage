// Regression tests for addCollapseMove().

import { assertEqual } from "./helpers.js";

import { addSpookyMove } from "../model/barrel.js";
import { addPlacementMove } from "../model/barrel.js";
import { addLoop } from "../model/barrel.js";
import { addCollapseMove } from "../model/barrel.js";

let state = "";

// --------- --------- --------- --------- //

state = addSpookyMove(state, 'X',1, 1);
state = addPlacementMove(state, 'X',1, 1,2);
state = addLoop(state, [], []);
assertEqual(state, "X1+(1,2); ", "single placement");

state = addSpookyMove(state, 'O',2, 2);
state = addPlacementMove(state, 'O',2, 2,3);
state = addLoop(state, [], []);
assertEqual(state, "X1+(1,2); O2+(2,3); ", "single placement");

state = addSpookyMove(state, 'X',3, 3);
state = addPlacementMove(state, 'X',3, 3,6);
state = addLoop(state, [], []);
assertEqual(state, "X1+(1,2); O2+(2,3); X3+(3,6); ", "single placement");

state = addSpookyMove(state, 'O',4, 3);
state = addPlacementMove(state, 'O',4, 3,1);
state = addLoop(state, [1,2,3],[6]);
assertEqual(state, "X1+(1,2); O2+(2,3); X3+(3,6); O4+(1,3)[123|6]; ", "collapse loop with stems.");

// --------- --------- --------- --------- //

console.log("addCollapseMove() tests passed");

