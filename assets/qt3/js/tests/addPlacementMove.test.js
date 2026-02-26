// Regression tests for addPlacementMove().

import { assertEqual } from "./helpers.js";

import {addSpookyMove,
        addPlacementMove,
 } from "../model/barrel.js";

let state = "";

// --------- --------- --------- --------- //

state = addSpookyMove(state, 'X',1, 1);
state = addPlacementMove(state, 'X',1, 1,2);
assertEqual(state, "X1+(1,2); ", "single placement");

state = addSpookyMove(state, 'O',2, 2);
state = addPlacementMove(state, 'O',2, 2,5);
assertEqual(state, "X1+(1,2); O2+(2,5); ", "single placement");

state = addSpookyMove(state, 'X',3, 5,1);
state = addPlacementMove(state, 'X',3, 5,1);
assertEqual(state, "X1+(1,2); O2+(2,5); X3+(1,5); ", "single placement");

// --------- --------- --------- --------- //
console.log("addPlacementMove()    3/ 3 tests passed");
// --------- --------- --------- --------- //
