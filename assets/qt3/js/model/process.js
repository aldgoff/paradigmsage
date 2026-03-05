// ./assets/qt3/js/model/process.js

import { GRAMMAR } from "./grammar.js";
import { tokenize } from "./tokens.js";
import { tokensToString } from "./tokens.js";

import {analyzeStateString} from "./analyzeStateString.js";
import {getLastMoveType} from "./analyzeStateString.js";
import {getLastMove} from "./analyzeStateString.js";
import {evaluateGame} from "./scoring.js";
// import {isSquareClassical} from "./structure.js";

import {cellInLoop,
        computeCollapseResolution,
} from "./collapse.js";

import {addSpookyMove,
        subSpookyMove,
        addPlacementMove,
        addLoop,
        addCollapseMove,
        addScore,
} from "./barrel.js";
import {buildGraph,
        findPath,
        extractCycle,
        movesForEdge,
        extractStems 
} from "./cycles.js";
import {modelSetStateString,
        modelGetStateString,
        modelSetStatusString,
        modelGetStatusString,
        modelSetErrorString,
        modelGetErrorString,
} from "./model.js";
import {ERROR,
        STATUS,
} from "./status.js";

import {processStateString} from "./structure.js";

/***************************************** */

/* Major bug...
  X1+(1,2); O2+(1,2)[12]; X3@O2(1)!X1(2)!O2(1); 
  X3+(4,5); O4+(5,6); X5+(4,5)[35|4]; O6@X3(5)!X3(5)!O4(6)!X5(4); 
  O6+(5,6)[46|35]; X7+(7,8); O8+(8,9); X9+(7,8)[79|8]; O10@X9(8)!X7(7)!O8(9)!X9(8); 
  {X1,O0}X9+(3,3); O9@X9(3)!X9(3); {X2,O0}

  Clicking on classical squares is not working correctly.
*/

let placements = [];  // [{ move, player, squares:[a,b] }].
let cycleMoves = [];  // Code for collapse moves.
let stemMoves = [];
let statusString = "";

export function newGame() {
  modelSetStatusString("Player X: place first spooky mark (click on it again to change your mind).");
  modelSetStateString("");
  placements = [];
  cycleMoves = [];
  stemMoves = [];

  let state = analyzeStateString(modelGetStateString());
}

export function loadGame(stateString) { // Returns nothing.
  console.log("loadGame() ", stateString);

  const tokens = tokenize(stateString);  // Returns: [ {type, token}, ..., {"invalid", token} ]
  const lastToken = tokens[tokens.length-1];

  const tokenString = tokensToString(tokens);

  modelSetStateString(tokenString);
  modelSetErrorString("");
  if(lastToken.type === "invalid") {
    modelSetErrorString("Invalid state string, truncated at point of corruption.");
  }

  console.log("tokenString", tokenString);  
  console.log("----- ----- ----- ----- ");
  
  let state = processStateString(modelGetStateString());  // Overwrites errorString.
  /* return {
      placements,
      cycleMoves,
      stemMoves,
      score,
      analyzedState
    };
   */
  console.log("state", state);

  placements = state.placements;
  cycleMoves = state.cycleMoves;
  stemMoves = state.stemMoves;

  let lastPlayer = state.analyzedState.progress.player;
  
  let lastStr = getLastMove(modelGetStateString());
  let lastType = getLastMoveType(modelGetStateString());

  console.log("lastStr", lastStr, "lastType", lastType, "lastPlayer", lastPlayer);

  let player = (lastPlayer === 'X' ? 'O' : 'X');

  let errorString = "";
  switch(lastType) {
    case 'empty':
      errorString = ERROR["emptyLoad"]();
      statusString = STATUS["playOrLoad"](player);
      break;
    case 'spooky':
      statusString = STATUS["spooky2"](player);
      break;
    case 'placement':
      statusString = STATUS["placement"](player);
      break;
    case 'loop':
      statusString = STATUS["collapse"](player);
      break;
    case 'collapse':
      player = (len%2) ? 'X' : 'O' ;
      statusString = STATUS["placement"](player);
      break;
    case 'score':
      let scoreStr = getLastMove(stateString);
      let score = STATUS["score"](scoreStr);
      let options = STATUS["gameOver"]();
      statusString = score + ". Options: " + options;
      break;
    case 'invalid':
      // statusString = ERROR["invalidStateString"]();
      break;
  }
  const error = modelGetErrorString();
  console.log("error", error);

  modelSetStatusString(statusString); // Erases error string.
  if(error.length > 0) {
    modelSetErrorString(error);
  }
}

export function processString(moves) { // Returns: [ {type, token}, {type, token}... ]
  // console.log("processString", moves.length, "moves");

  let growingStateString = "";
  let state;

  for(const move of moves) {
    growingStateString += `${move.token} `;
    // console.log(growingStateString);
    buildEntanglementNetwork(move); // { type, token }.
  }
}

function buildEntanglementNetwork(move) { // { type, token }.
  let parse;
  let player;
  let turn;
  let sq1;
  let sq2;
  let triggerMove = "";
  let triggerSquare = 0;
  let cycle = "";
  let stems = "";

  // console.log("buildEntanglementNetwork", move);

  let statusString = "";
  if(     move.type === "spooky") {     // Working.
    // console.log("spooky");

    // Are any of these even used?
      parse = parseSpookyMove(move.token);
      player = parse.player;
      turn = parse.turn;
      sq1 = parse.sq1;

    // stateString = addSpookyMove(modelGetStateString(), player, turn, squareNum);

    statusString = `Continue with rest of placement move, `
                 + `${player}: place your second spooky mark or undo the first one.`
    }
  else if(move.type === "placement") {  // Working.
    // console.log("placement");

    parse = parsePlacementMove(move.token);

    placements.push({ // Add connecting move.
      move: parse.turn,
      player: parse.player,
      squares: [parse.sq1, parse.sq2]
    });

    let nextPlayer = (parse.player === 'X') ? 'O' : 'X'; // Must be other player who chooses the collapse..
    statusString = `${nextPlayer}: begin your next placement move, `
                 + `place a spooky mark in any uncollapsed square.`
    }
  else if(move.type === "loop") {       // Working.
    // console.log("loop");

    parse = parseLoopMove(move.token);

    const graph = buildGraph(placements);
    const path = findPath(graph, parse.sq1, parse.sq2);

    if (path !== null) { // Sq1 & sq2 already connected.
      cycleMoves = extractCycle(path, placements, parse.turn); // [] - just the path, does not include connecting move.
      stemMoves  = extractStems(graph, path, placements, cycleMoves); // [].
    }

    placements.push({ // Add connecting move.
      move: parse.turn,
      player: parse.player,
      squares: [parse.sq1, parse.sq2]
    });

    let collapsePlayer = (parse.player === 'X') ? 'O' : 'X'; // Must be other player who chooses the collapse..
    statusString = `${collapsePlayer} must first collapse the cyclic entanglement. `
                 + `Click on a purple spooky mark.`

    // statusString = "You must click on a purple spooky mark, orange marks are stems, their classical value predetermined."
    }
  else if(move.type === "collapse") {
    // console.log("collapse");

    }
  else if(move.type === "degenerate") {
    // console.log("degenerate");

    }
  else if(move.type === "score") {
    // console.log("score");
    statusString = "Game is over. New Game|Rerun|Undo|Load.";
    }
  else {
    // console.log("Oops");
  }

  // console.log("placements", placements);
  // console.log("cycleMoves", cycleMoves);
  // console.log("stemMoves",  stemMoves );

  modelSetStatusString(statusString);
}

/*
  X1+(1,2); O2+(2,3); X3+(2,3)[23|1]; 
  placements (3) [{…}, {…}, {…}]
    0: {move: 1, player: 'X', squares: Array(2)}
    1: {move: 2, player: 'O', squares: Array(2)}
    2: {move: 3, player: 'X', squares: Array(2)}
    length: 3
  cycleMoves (2) [2, 3]
    0: 2
    1: 3
    length: 2
  stemMoves [1]
    0: 1
    length: 1
 */

/* State
  {progress: {…}, moves: {…}, counts: {…}, outcome: {…}}
  counts: {loneSpooky: 0, separables: 0, entanglements: 1, cyclics: 0, entangledMoves: 2, …}
  moves: {spooky: 1, placement: 2, collapse: 0, number: 2}
  outcome: {over: false, score: {…}, wins: null, desc: 'TBD'}
  progress: {turn: 2, player: 'O', sq1: 3, sq2: 0, spooky: false, …}
  X1+(1,2); O2+(2,3); X3+(2,3)[23|1];  
 */

export function processClick(intent) {
  const squareNum = intent.squareNum;
  const cellNum   = intent.cellNum;

  let stateString = "";
  let statusString = "";

  const state = analyzeStateString(modelGetStateString());
  // console.log("state", state);

  let turn = state.progress.turn + 1;
  let player = (turn%2) ? 'X' : 'O'

  if(evaluateGame(state).over) {                          // Game over.
    statusString = "Game is over. New Game, Rerun, Undo, Load.";
    }
  else if(isSquareClassical(modelGetStateString(), squareNum)) {    // Illegal move.
    statusString = "That square has collapsed. Choose another.";
    }
  else if(isDegenerateLastMove(modelGetStateString(), state)) {     // Self-collapse last move of game.
    // "X9+(n,n); O9@X9(n)!X9(n); "
    stateString = selfCollapseLastMove(state, intent);
    let outcome = evaluateGame(stateString);
    stateString += `{X-${outcome.score.X}, O-${outcome.score.O}}`;
    modelSetStateString(stateString);
    statusString = `Last move self-collapsed (degenerate). Game over: ${outcome.desc}.`;
    }
  else if(isReClickSpooky(modelGetStateString(), state, intent)) {  // Undo 1st spooky mark.
    stateString = subSpookyMove(modelGetStateString());
    modelSetStateString(stateString);
    statusString = `Spooky mark undone. ${player}: restart your placement move, `
                 + `place a spooky mark in any uncollapsed square.`
    }
  else if(isSpooky(modelGetStateString(), state)) {                 // Spooky move.
    stateString = addSpookyMove(modelGetStateString(), player, turn, squareNum);
    modelSetStateString(stateString);
    statusString = `Continue with rest of placement move, `
                 + `${player}: place your second spooky mark or undo the first one.`
    }
  else if(isPlacement(modelGetStateString(), state)) {              // Placement move.
    stateString = addPlacementMove(modelGetStateString(), player, turn, state.progress.sq1, squareNum);
    modelSetStateString(stateString);
    const sq1 = state.progress.sq1;
    const sq2 = squareNum;

    const graph = buildGraph(placements);
    const path = findPath(graph, sq1, sq2);

    if (path !== null) { // Sq1 & sq2 already connected.
      cycleMoves = extractCycle(path, placements, turn); // [] - just the path, does not include connecting move.
      stemMoves  = extractStems(graph, path, placements, cycleMoves); // [].

      stateString = addLoop(modelGetStateString(), cycleMoves, stemMoves);
      modelSetStateString(stateString);

      let collapsePlayer = (player === 'X') ? 'O' : 'X'; // Must be other player who chooses the collapse..
      statusString = `${collapsePlayer} must first collapse the cyclic entanglement. `
                   + `Click on a purple spooky mark.`
    }
    else {
      let nextPlayer = (player === 'X') ? 'O' : 'X'; // Must be other player who chooses the collapse..
      statusString = `${nextPlayer}: begin your next placement move, `
                   + `place a spooky mark in any uncollapsed square.`
    }

    placements.push({ // Add connecting move.
      move: turn,
      player: player,
      squares: [sq1, sq2]
    });

    }
  else if(isCollapse(modelGetStateString(), state)) {               // Collapse move.
    let cellSq = cellInLoop(intent, placements, cycleMoves);
    console.log("isCollapse() cellInLoop", cellSq, "=", intent, placements, cycleMoves);
    if (cellSq != null) {
      let triggerSquare = cellSq.square;
      let resolved = computeCollapseResolution(placements, cycleMoves, stemMoves, cellSq.cell, triggerSquare);
      stateString = addCollapseMove(modelGetStateString(), player, turn, cellSq.cell, cellSq.square, resolved);
      modelSetStateString(stateString);

      let outcome = evaluateGame(modelGetStateString());
      if(outcome.over) {
        stateString += `{X-${outcome.score.X}, O-${outcome.score.O}}`;
        statusString = `Game over: ${outcome.desc}.`;
        modelSetStateString(stateString);
      }
      else {
        if(state.progress.turn == 8) {
          statusString = `Player ${player}: click in lone empty square, move will self-collapse.`;
        } else {
          statusString = `Player ${player}: place first spooky mark (click it again to change your mind).`;
        }
      }
    }
    else {
      statusString = "You must click on a purple spooky mark, orange marks are stems, their classical value predetermined."
    }
    /* -- console.log("isCollapse() cellInLoop", cellSq, "=", intent, placements, cycleMoves); --
      isCollapse() cellInLoop {cell: 3, square: 3}
      cell: 3
      square: 3
      [[Prototype]]: Object = {squareNum: 3, cellNum: 3}
      cellNum: 3
      squareNum: 3
      [[Prototype]]: Objectconstructor: ƒ Object()hasOwnProperty: ƒ hasOwnProperty()isPrototypeOf: ƒ isPrototypeOf()propertyIsEnumerable: ƒ propertyIsEnumerable()toLocaleString: ƒ toLocaleString()toString: ƒ toString()valueOf: ƒ valueOf()__defineGetter__: ƒ __defineGetter__()__defineSetter__: ƒ __defineSetter__()__lookupGetter__: ƒ __lookupGetter__()__lookupSetter__: ƒ __lookupSetter__()__proto__: (...)get __proto__: ƒ __proto__()set __proto__: ƒ __proto__() (3) [{…}, {…}, {…}]
      0: {move: 1, player: 'X', squares: Array(2)}
      1: {move: 2, player: 'O', squares: Array(2)}
      2: {move: 3, player: 'X', squares: Array(2)}
      length: 3
      [[Prototype]]: Array(0) (2) [2, 3]
      0: 2
      1: 3
      length: 2
      [[Prototype]]: Array(0)
     */
    }
  else {                                                  // Can't happen.
    console.log("CAN'T HAPPEN - OOPS!");
  }

  console.log(modelGetStateString());
  
  // console.log("placements", placements);
  // console.log("cycleMoves", cycleMoves);
  // console.log("stemMoves",  stemMoves );

  return {stateStr: modelGetStateString(), statusStr: statusString};
}

/** Decision functions which query state: */
function isSquareClassical(stateString, squareNum) {
  let match;

  while ((match = GRAMMAR.collapseResolve.exec(stateString)) !== null) {
    const collapsedSquare = Number(match[3]);
    if (collapsedSquare === squareNum) return true;
  }

  return false;
  }

function isDegenerateLastMove(stateString, state) { // draft
  let degenerateLastMove = false;

  if(state.counts.collapsedMoves === 8)
    degenerateLastMove = true;

  return degenerateLastMove;
  }

function isReClickSpooky(stateString, state, intent) { // draft
  let reClicked = false;
  
  if(state.progress.sq1 != 0
  && state.progress.sq2 === 0) {  // There is a trailing spooky mark.
    if(intent.squareNum === state.progress.sq1) {
      reClicked = true;
    }
  }

  return reClicked;
  }

function isSpooky(stateString, state) {    // Done.
  return state.progress.spooky;
  }

function isPlacement(stateString, state) { // Done.
  return state.progress.placement;
  }
function isCollapse(stateString, state) { // Done.
  return state.progress.collapse;
}
  
/** Action functions which change stage. */

function selfCollapseLastMove(state, intent) {
  // "X9+(n,n); O9@X9(n)!X9(n); "

  let n = intent.squareNum;
  let selfCollapseString = `X9+(${n},${n}); O9@X9(${n})!X9(${n}); `;

  return state = modelGetStateString() + selfCollapseString;
}

/** Helper functions: */

