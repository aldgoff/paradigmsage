// ./assets/qt3/js/model/intent.js

// This appears to be the execution path from processClick().

import { GRAMMAR } from "./grammar.js";

let placements = []; // Updated by addPlacement, used by wasCollapse().
let cycleMoves = []; // [] - just the path, does not include connecting move.
let stemMoves  = []; // [].
let resolved   = {}; // {}. "Maps, objects, sets, arrays...sheeze."

export function resetGlobals() {
  placements = [];  // Updated by addPlacement, used by wasCollapse().
  cycleMoves = []; // [] - just the path, does not include connecting move.
  stemMoves  = []; // [].
  resolved   = {}; // { 1: 4, 2: 5, 3: 6 }.
}

export function process(oldStateString, intent) {
  let newStateString = "";

  console.log("process(intent)", intent);

  let token = {};
  switch(intent.type) {
  case "spooky":
    token = addSpooky(oldStateString, intent);
    newStateString = oldStateString + token.str;
    break;
  case "stripSpooky":
    newStateString = stripSpooky(oldStateString); // Stripped off spooky1.
    break;
  case "spooky2":
    token = addSpooky2(oldStateString, intent);
    newStateString = oldStateString + token.str + "; ";
    updatePlacements(intent.player, intent.turn, intent.sq1, intent.sq2)
    break;
  case "placement":
    token = addPlacement(oldStateString, intent);
    newStateString = oldStateString + token.str + "; ";
    updatePlacements(intent.player, intent.turn, intent.sq1, intent.sq2)
    break;
  default:
    console.log("*** process bad intent type", intent.type);
    break;
  }

  return newStateString;
}

function addSpooky(oldStateString, intent) {        // "X1+(1,2); " => "X1+(1,2); O2+(2"
  let str = `${intent.player}${intent.turn}+(${intent.sq1}`; // "O2+(2".
  return { type: "spooky", str: str };
  }

function stripSpooky(oldStateString) {              // "X1+(1,2); O2+(2" => "X1+(1,2); ".
  const newStateString = oldStateString.slice(0, -5);
  return newStateString;
  }

function addSpooky2(oldStateString, intent) {       // "X1+(1; " => "X1+(1,2); "
  let str = `,${intent.sq2})`;      // ",2)".
  return { type: "placement", str: str };
  }

function addPlacement(oldStateString, intent) {     // "X1+(1,2); " => "X1+(1,2); O2+(2,3); "
  let str = `${intent.player}${intent.turn}+(${intent.sq1},${intent.sq2})`;
  return { type: "placement", str: str };
  }
/**/

function updatePlacements(player, turn, sq1, sq2) {
  placements.push({ // Add move list of placements.
    move: turn,
    player: player,
    squares: [sq1, sq2]
  });
}