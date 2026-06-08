/* File: model.js
  Path: ./3dc/model/model.js
  Purpose: The state and logic of 3D Chess.
  Author: Allan Goff
  Date: 4/04/26
  Recommended access: import * as model from "../model/model.js";
  UI: the export functions.
*/

// --- Load JSON ---
import modelData from "./model.json" assert { type: "json" };
  const modelModule = modelData.model_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as control from "../controller/controller.js";
  import * as view    from "../view/view.js";
  import * as state   from "./state/state.js";  // All the undoable state code.
// Seampoint: more imports...

// --- UI ---
export function init(playBoard) {
  let setup;

  console.log("model.init(): 3dc/model/model.js");

  // exampleStateStrMoves();  // Comments about fallback notation: coords and annotations - keep for now.

  return setup; // Whatever that is.
}
// Seampoint: more global functions...

// --- Helpers ---
function exampleStateStrMoves() { // Best with collapsible listing table.
  // Fallback0: P[z,x,y]-[k,i,j]: piece at zxy moves to|captures piece at [kij].
  // Fallback1: qPxknP: disambiguate by level, piece on queen level takes piece on king night level.
  // Fallback0 is easy for computer but verbose for players.
  // Fallback1 is easier for players, but problematic for code.
  // Listing gets unreadable unless moves require only a few chars.
  // Then there are the 'on guard' annotations, ch, en passant, forks, disc ch, pins, etc.
  let stateStr1 = "Moves:{1:{P-K4,4; P-Q4,3}; 2:{PxP; N-KB3,3}; 3:{qnP-QN3,4; ...}; ... }";
  let stateStr2 = "Moves:{... 20:{PxKch; qPxP[4,5,4]}; 21:{KroyalCastle; PtoQ(KR)}; ... }";
  let stateStr3 = "Moves:{... 8:{P[KR1,5]xP[KN2,4]ep[KN3,4]; ... }";
  let stateStr4 = "Moves:{... 6:{S-B[KB3,3]D[Q4,4]; ... }";
  let stateStr5 = "Moves:{[" +
                  "{turn: 1, moves: {P-K4,4; P-Q4,3}, coords: {...;...}, annotations: {...;...}}, " +
                  "{turn: 2, moves: {PxP; N-KB3,3}, coords: {...;...}, annotations: {...;...}}, " +
                  "{turn: 3, moves: {qnP-QN3,4; ...}, ...}, " +
                  "... " +
                  "]}";

  console.log(stateStr1);
  console.log(stateStr2);
  console.log(stateStr3);
  console.log(stateStr4);
  console.log(stateStr5);
}
// Seampoint: more local functions...

