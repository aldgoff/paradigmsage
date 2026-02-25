// qt3/model/model.js

import {analyzeStateString,
} from "./analyzeStateString.js";

/* The QT3 model consists a just a handful of items:
  A status string (statusString) - the player's next actions.
  An error string (errorString) - lets players know when they have made a UI mistake.
  An analysis string (analysisString) - stats about the current game.

  The state string (stateString) - human readable history of the game.
  The history pointer (histPtr) - where we are in the game, undo/redo/restart.
*/

let modelStateString  = "";  // This is the state of the game.
let modelStatusString = "";  // This is the status of the game.
let modelState;

export function modelSetStateString(str) {  // Sets stateString, model must update its state.
  modelStateString = str;
  }

export function modelGetStateString() {     // Gets stateString.
  return modelStateString;
  }

export function modelSetStatusString(str) { // Sets statusString.
  modelStatusString = str;
  }

export function modelGetStatusString() {    // Gets statusString.
  return modelStatusString;
}

export function validStateString(stateString) {
  // TODO: write validStateString().

  return true;
}

/* -------------------- */

function processStateChange(str) {
  modelStateString = str;
  modelState = analyzeStateString(modelStateString);

  console.log("processStateChange() - modelState", modelState);
}

function updateStateObjects(stateString) {

}

function updateStatusString(stateString, stateOjects) {
  let statusString = "";

  return statusString;
}

/* -------------------- */
  // let histPtr = 0;

  // let numOfMoves = 0; // Potential placement/collapses.
  // const maxNumOfMoves = 9+4; // Potential placement/collapses.

  // export function setHistptr (ptr) {  // 0 => Rerun.
  //   histPtr = ptr;
  // }

  // export function slipHistptr (steps) {  // Undo (-1), Redo (+1).
  //   histPtr += steps;
  //   if(histPtr < 0) histPtr = 0;
  //   if(histPtr > numberOfMoves) histPtr = numberOfMoves;
  // }

