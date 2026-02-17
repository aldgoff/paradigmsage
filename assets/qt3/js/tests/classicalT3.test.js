// Regression tests for classical tic-tac-toe as special case of QT3().
// Note: there is no addClassical() function.

import { assertEqual } from "./helpers.js";

import { addSpookyMove } from "../model/barrel.js";
import { addPlacementMove } from "../model/barrel.js";
import { addLoop } from "../model/barrel.js";
import { addScore } from "../model/barrel.js";

let state = "";

// --------- --------- --------- --------- //

state = addSpookyMove(state, 'X',1, 1);
state = addPlacementMove(state, 'X',1, 1,1);
state = addLoop(state, [1], []);
assertEqual(state, "X1+(1,1)[1]; ", "classical placement");

state = addSpookyMove(state, 'O',2, 2);
state = addPlacementMove(state, 'O',2, 2,2);
state = addLoop(state, [2], []);
assertEqual(state, "X1+(1,1)[1]; O2+(2,2)[2]; ", "classical placement");

state = addSpookyMove(state, 'X',3, 5);
state = addPlacementMove(state, 'X',3, 5,5);
state = addLoop(state, [5], []);
assertEqual(state, "X1+(1,1)[1]; O2+(2,2)[2]; X3+(5,5)[5]; ", "classical placement");

state = addSpookyMove(state, 'O',4, 6);
state = addPlacementMove(state, 'O',4, 6,6);
state = addLoop(state, [6], []);
assertEqual(state, "X1+(1,1)[1]; O2+(2,2)[2]; X3+(5,5)[5]; O4+(6,6)[6]; ", "classical placement");

state = addSpookyMove(state, 'X',5, 9);
state = addPlacementMove(state, 'X',5, 9,9);
state = addLoop(state, [9], []);
assertEqual(state, "X1+(1,1)[1]; O2+(2,2)[2]; X3+(5,5)[5]; O4+(6,6)[6]; X5+(9,9)[9]; ", "classical placement");

state = addScore(state, { X: 1, O: 0 });
assertEqual(state, "X1+(1,1)[1]; O2+(2,2)[2]; X3+(5,5)[5]; O4+(6,6)[6]; X5+(9,9)[9]; {X1,O0}", "classial score");

// --------- --------- --------- --------- //

console.log("classical tic-tac-toe tests passed");

