/* File: model.js
  Path: ./3dc/model/model.js
  Purpose: The state and logic of 3D Chess.
  Author: Allan Goff
  Date: 4/04/26
  UI: the export functions.
*/

/* Notes:
 * Will want to leverage JSON stringify and parse.
 * const str = JSON.stringify(setup);
 * const obj = JSON.parse(str);
 */

// --- Load JSON ---
import modelData from "./model.json" assert { type: "json" };
  const modelModule = modelData.model_module;
  // Seampoint: more objects.

// --- Build upon previous layers ---
import * as view    from "../view/view.js";
import * as control from "../controller/controller.js";
import * as state   from "./state/state.js";
// Seampoint: more imports...

// --- UI ---
export function init(playBoard) {
  let setup;

  console.log("model.init(): 3dc/model/model.js");

  // state.demo();

  // exampleStateStr();
  // exampleStateStrSetup();
  // exampleStateStrMoves();
  // exampleStateStrGambits();
  // exampleStateStrAdvsq();

  return setup; // Whatever that is.
}

// By squencing into 4 groups, need only one set of undo buttons; achieves logarithmic undo.
function exampleStateStr() {
  let stateStr = "Setup:{}; Moves:{}; Gambits:{}; AdvSq:{}";

  console.log(stateStr);
}

function exampleStateStrSetup() {
  let stateStr1 = "Setup:{[" +
                  "{board: 8x8x8}, " +
                  "{board: 10x8x8}, " +
                  "{board: 10x10x10}, " +
                  "{board: 6x6x6}, " +
                  "{board: 5x5x5}, " +
                  "{board: 4x4x4}, " +
                  "]};";
  let stateStr2 = "Setup:{[" +
                  "{board: 8x8x8, play: game, trays: real, gap: 0}" +
                  "{board: 8x8x8, play: game, trays: real, gap: 1}" +
                  "{board: 8x8x8, play: game, trays: real, gap: 2}" +
                  "]};";

  console.log(stateStr1);
  console.log(stateStr2);

  // const obj = JSON.parse(stateStr1);
  // const str = JSON.stringify(object);

  // console.log(obj);
  // console.log(str);
}

function exampleStateStrSetup1() {
  let stateStr = "Setup:{" +
                  "board: 8x8x8|10x8x8|10x10x10|6x6x6|5x5x5|4x4x4, " +
                  "play: game|puzzle:{size:[5,5,5],loc:[0,0,0]}, " +
                  "trays: real|factory|none, " +
                  "gap: 0|1|2, " +  // This is view centric; it is just a default value, can be changed dynamically.
                  "initialPos: std|itemized:{white:[...],black:[...]}, " +
                  "autoLoad: true|false" +
                 "};";

  console.log(stateStr);
}

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

function exampleStateStrGambits() {
  let stateStr = "Gambits:{[Q:37,[[Q0,0],[KB2,2]]; Q:38,[[Q0,0],[KN3,3]]; Q:1,[[Q0,0],[Q1,1]]; ... ]}";

  console.log(stateStr);
}

function exampleStateStrAdvsq() {
  let stateStr = "Advsq:{[[[Q0,0],[KB2,2]]; [[Q0,0],[KN3,3]]; [[Q0,0],[Q1,1]]; ... ]}";

  console.log(stateStr);
}

