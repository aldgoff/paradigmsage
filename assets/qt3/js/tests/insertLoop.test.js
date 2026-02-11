// Regression tests for insertLoop().

import { assertEqual } from "./helpers.js";
import { addPlacementMove } from "../model/barrel.js";
import { insertLoop } from "../model/barrel.js";
import { addCollapseMove } from "../model/barrel.js";

let state = "";

// --------- --------- --------- --------- //

state = addPlacementMove(state, 'X',1, 1,2);
assertEqual(state, "X1+(1,2);", "single placement");

state = addPlacementMove(state, 'O',2, 2,1);
assertEqual(state, "X1+(1,2); O2+(1,2);", "single placement");

state = insertLoop(state, [1,2]);
assertEqual(state, "X1+(1,2); O2+(1,2)[12];", "annotate pure loop");

state = addCollapseMove(state, 'X',3, 'O',2, 1 );
assertEqual(state, "X1+(1,2); O2+(1,2)[12]; X3!O2(1);", "collapse without trigger");

// --------- --------- --------- --------- //
// console.log("pure loop tests passed");
// --------- --------- --------- --------- //

state = addPlacementMove(state, 'X',3, 4,7);
assertEqual(state, "X1+(1,2); O2+(1,2)[12]; X3!O2(1); X3+(4,7);", "single placement");

state = addPlacementMove(state, 'O',4, 5,8);
assertEqual(state, "X1+(1,2); O2+(1,2)[12]; X3!O2(1); X3+(4,7); O4+(5,8);", "single");

state = addPlacementMove(state, 'X',5, 6,9);
assertEqual(state, "X1+(1,2); O2+(1,2)[12]; X3!O2(1); X3+(4,7); O4+(5,8); X5+(6,9);", "single");

state = addPlacementMove(state, 'O',6, 4,5);
assertEqual(state, "X1+(1,2); O2+(1,2)[12]; X3!O2(1); X3+(4,7); O4+(5,8); X5+(6,9); O6+(4,5);", "single");

state = addPlacementMove(state, 'X',7, 5,6);
assertEqual(state, "X1+(1,2); O2+(1,2)[12]; X3!O2(1); X3+(4,7); O4+(5,8); X5+(6,9); O6+(4,5); X7+(5,6);", "single");

state = addPlacementMove(state, 'O',8, 6,4);
assertEqual(state, "X1+(1,2); O2+(1,2)[12]; X3!O2(1); X3+(4,7); O4+(5,8); X5+(6,9); O6+(4,5); X7+(5,6); O8+(4,6);", "single placement");

state = insertLoop(state, [6,7,8], [3,4,5]);
assertEqual(state, "X1+(1,2); O2+(1,2)[12]; X3!O2(1); X3+(4,7); O4+(5,8); X5+(6,9); O6+(4,5); X7+(5,6); O8+(4,6)[678|345];", "annotate loop with stems");

// --------- --------- --------- --------- //
// console.log("loop tests with stems passed");
// --------- --------- --------- --------- //

// --------- --------- --------- --------- //

console.log("insertLoop() tests passed");
