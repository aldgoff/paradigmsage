// main.js — simplest possible QT3 test
// Goal: prove one placement move produces a state string

import { addPlacementMove } from "./model/addPlacementMove.js";
import { addCollapseMove } from "./model/addCollapseMove.js";

let state = "";
let state1 = "";
let state2 = "";

// hard-coded single move
state = addPlacementMove(state, 'X', 1, 1, 2);

console.log("QT3 state after one move:", state);

// Expected output:
// QT3 state after one move: X1+(1,2)



// Hard-coded three moves creating a cyclic entanglement.
state = addPlacementMove(state, 'O', 2, 2, 5);
state = addPlacementMove(state, 'X', 3, 5, 1);

console.log("QT3 state after three moves:", state);

state1 = addCollapseMove(state, 'O', 4, 'X', 3, 5);
state2 = addCollapseMove(state, 'O', 4, 'X', 3, 5, {player: 'X', turn: 1, square: 1});

console.log("QT3 state after three moves:", state1);
console.log("QT3 state after three moves:", state2);

// Example:
// state = "X1+(1,2); O2+(2,5); X3+(1,5);";
// state = addCollapseMove(state, 'O', 4, 'X', 3, 5, { player: 'X', turn: 1, square: 1 });
// -> "X1+(1,2); O2+(2,5); X3+(1,5); O4!X3(5)@X1(1);"

