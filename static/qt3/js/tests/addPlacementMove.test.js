// Regression tests for addPlacementMove().

import { assertEqual } from "./helpers.js";
import { addPlacementMove } from "../model/barrel.js";

let state = "";

// --------- --------- --------- --------- //

state = addPlacementMove(state, 'X',1, 1,2);
assertEqual(state, "X1+(1,2);", "single placement");

state = addPlacementMove(state, 'O',2, 2,5);
assertEqual(state, "X1+(1,2); O2+(2,5);", "single placement");

state = addPlacementMove(state, 'X',3, 5,1);
assertEqual(state, "X1+(1,2); O2+(2,5); X3+(1,5);", "single placement");

// --------- --------- --------- --------- //

console.log("addPlacementMove() tests passed");
