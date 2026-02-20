// qt3/model/model.js

/* The QT3 model consists a just a handful of items:
  A status string (statusString) - the player's next actions.
  An error string (errorString) - lets players know when they have made a UI mistake.
  An analysis string (analysisString) - stats about the current game.

  The state string (stateString) - human readable history of the game.
  The history pointer (histPtr) - where we are in the game, undo/redo/restart.
*/

import {buildSquareMap} from "./structure.js";

let histPtr = 0;

let numOfMoves = 0; // Potential placement/collapses.
const maxNumOfMoves = 9+4; // Potential placement/collapses.

export function setHistptr (ptr) {  // 0 => Restart.
  histPtr = ptr;
}

export function slipHistptr (steps) {  // Undo (-1), Redo (+1).
  histPtr += steps;
  if(histPtr < 0) histPtr = 0;
  if(histPtr > numberOfMoves) histPtr = numberOfMoves;
}

