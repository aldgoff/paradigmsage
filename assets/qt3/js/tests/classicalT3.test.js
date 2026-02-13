// Regression tests for classical tic-tac-toe as special case of QT3().

import { assertEqual } from "./helpers.js";
import { addPlacementMove } from "../model/barrel.js";
import { addScore } from "../model/barrel.js";

let state = "";

// --------- --------- --------- --------- //

state = addPlacementMove(state, 'X',1, 1,1);
assertEqual(state, "X1+(1,1);", "classical placement");

state = addPlacementMove(state, 'O',2, 2,2);
assertEqual(state, "X1+(1,1); O2+(2,2);", "classical placement");

state = addPlacementMove(state, 'X',3, 5,5);
assertEqual(state, "X1+(1,1); O2+(2,2); X3+(5,5);", "classical placement");

state = addPlacementMove(state, 'O',4, 6,6);
assertEqual(state, "X1+(1,1); O2+(2,2); X3+(5,5); O4+(6,6);", "classical placement");

state = addPlacementMove(state, 'X',5, 9,9);
assertEqual(state, "X1+(1,1); O2+(2,2); X3+(5,5); O4+(6,6); X5+(9,9);", "classical placement");


state = addScore(state, { X: 1, O: 0 });
assertEqual(state, "X1+(1,1); O2+(2,2); X3+(5,5); O4+(6,6); X5+(9,9); {X1,O0}", "classial score");

// --------- --------- --------- --------- //

console.log("classical tic-tac-toe tests passed");
