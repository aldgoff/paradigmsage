// qt3/model/model.js

/* The QT3 model consists a just a handful of items:
  The state string (stateString) - human readable history of the game.
  A status string (statusString) - the player's next actions.
  An error string (errorString)  - lets players know when they have made a UI mistake.
*/

let modelStateString  = "";  // This is the state of the game.
let modelStatusString = "";  // This is the status of the game.
let modelErrorString  = "";  // Errors if any.

export function modelSetStateString(str) {  // StateString.
  modelStateString = str;
  }

export function modelGetStateString() {
  return modelStateString;
}

export function modelSetStatusString(str) { // StatusString.
  modelStatusString = str;
  modelErrorString = "";
  }

export function modelGetStatusString() {
  return modelStatusString;
}

export function modelSetErrorString(str) {  // ErrorString.
  modelErrorString = str;
  }

export function modelGetErrorString() {
  return modelErrorString;
}

