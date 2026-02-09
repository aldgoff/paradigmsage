// Regression tests for addCollapseMove().

import { assertEqual } from "./helpers.js";
import { addPlacementMove } from "../model/barrel.js";
import { addCollapseMove } from "../model/barrel.js";

let state = "";
let state1 = "";
let state2 = "";

// --------- --------- --------- --------- //

state = addPlacementMove(state, 'X', 1, 1, 2);
assertEqual(state, "X1+(1,2);", "single placement");

state = addPlacementMove(state, 'O', 2, 2, 5);
assertEqual(state, "X1+(1,2); O2+(2,5);", "single placement");

state = addPlacementMove(state, 'X', 3, 5, 1);
assertEqual(state, "X1+(1,2); O2+(2,5); X3+(1,5);", "single placement");


state1 = addCollapseMove(state, 'O', 4, 'X', 3, 5);
assertEqual(state1, "X1+(1,2); O2+(2,5); X3+(1,5); O4!X3(5);", "collapse without trigger");

state2 = addCollapseMove(state, 'O', 4, 'X', 3, 5, {player: 'X', turn: 1, square: 1});
assertEqual(state2, "X1+(1,2); O2+(2,5); X3+(1,5); O4!X3(5)@X1(1);", "collapse with trigger");

// --------- --------- --------- --------- //

console.log("addCollapseMove() tests passed");
