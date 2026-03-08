// qt3/model/model.js

/* The QT3 model consists a just a handful of items:
  The state string (stateString) - human readable history of the game.
  A status string (statusString) - the player's next actions.
  An error string (errorString)  - lets players know when they have made a UI mistake.
*/

let modelStateString  = "";  // This is the state of the game.
let modelStatusString = "";  // This is the status of the game.
let modelErrorString  = "";  // Errors if any.

export function modelSetStateString(str) {  // Sets stateString.
  modelStateString = str;
  }

export function modelGetStateString() {     // Gets stateString.
  return modelStateString;
}

export function modelSetStatusString(str) { // Sets statusString.
  modelStatusString = str;
  modelErrorString = "";
  }

export function modelGetStatusString() {    // Gets statusString.
  return modelStatusString;
}

export function modelSetErrorString(str) {  // Sets errorString.
  modelErrorString = str;
  }

export function modelGetErrorString() {     // Gets errorString.
  return modelErrorString;
}

