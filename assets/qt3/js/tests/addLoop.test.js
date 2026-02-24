// Regression tests for addLoop().

import { assertEqual } from "./helpers.js";

import {addSpookyMove,
        addPlacementMove,
        addLoop,
 } from "../model/barrel.js";

let state = "";

// --------- --------- --------- --------- //

state = addSpookyMove(state, 'X',1, 1);
state = addPlacementMove(state, 'X',1, 1,2);
state = addLoop(state, [], []);
assertEqual(state, "X1+(1,2); ", "single placement");

state = addSpookyMove(state, 'O',2, 2);
state = addPlacementMove(state, 'O',2, 2,1);
state = addLoop(state, [1,2]);
assertEqual(state, "X1+(1,2); O2+(1,2)[12]; ", "annotate pure loop");

// --------- --------- --------- --------- //
// console.log("pure loop 2 tests passed");
// --------- --------- --------- --------- //

state += "X2@O2(1)!X1(2)!O2(1); ";
state = addSpookyMove(state, 'X',3, 4);
state = addPlacementMove(state, 'X',3, 4,7);
state = addLoop(state, [], []);
assertEqual(state, "X1+(1,2); O2+(1,2)[12]; X2@O2(1)!X1(2)!O2(1); X3+(4,7); ", "single");

state = addSpookyMove(state, 'O',4, 5);
state = addPlacementMove(state, 'O',4, 5,8);
state = addLoop(state, [], []);
assertEqual(state, "X1+(1,2); O2+(1,2)[12]; X2@O2(1)!X1(2)!O2(1); X3+(4,7); O4+(5,8); ", "single");

state = addSpookyMove(state, 'X',5, 6);
state = addPlacementMove(state, 'X',5, 6,9);
state = addLoop(state, [], []);
assertEqual(state, "X1+(1,2); O2+(1,2)[12]; X2@O2(1)!X1(2)!O2(1); X3+(4,7); O4+(5,8); X5+(6,9); ", "single");

state = addSpookyMove(state, 'O',6, 4);
state = addPlacementMove(state, 'O',6, 4,5);
state = addLoop(state, [], []);
assertEqual(state, "X1+(1,2); O2+(1,2)[12]; X2@O2(1)!X1(2)!O2(1); X3+(4,7); O4+(5,8); X5+(6,9); O6+(4,5); ", "single");

state = addSpookyMove(state, 'X',7, 5);
state = addPlacementMove(state, 'X',7, 5,6);
state = addLoop(state, [], []);
assertEqual(state, "X1+(1,2); O2+(1,2)[12]; X2@O2(1)!X1(2)!O2(1); X3+(4,7); O4+(5,8); X5+(6,9); O6+(4,5); X7+(5,6); ", "single");

state = addSpookyMove(state, 'O',8, 6);
state = addPlacementMove(state, 'O',8, 6,4);
state = addLoop(state, [6,7,8], [3,4,5]);
assertEqual(state, "X1+(1,2); O2+(1,2)[12]; X2@O2(1)!X1(2)!O2(1); X3+(4,7); O4+(5,8); X5+(6,9); O6+(4,5); X7+(5,6); O8+(4,6)[678|345]; ", "annotate loop with stems");

// --------- --------- --------- --------- //
// console.log("loop 6 tests with stems passed");
// --------- --------- --------- --------- //

// --------- --------- --------- --------- //
console.log("addLoop()             8/ 8 tests passed");
// --------- --------- --------- --------- //

