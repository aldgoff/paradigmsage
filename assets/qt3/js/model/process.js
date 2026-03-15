// ./assets/qt3/js/model/process.js

// This appears to be the execution path from processClick().

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
        addPlacementMove, // Not used.
        addLoop,
        addCollapseMove,
        addScore, // Not used.
} from "./barrel.js";
import {buildGraph,
        findPath,
        extractCycle,
        movesForEdge, // Not used.
        extractStems 
} from "./cycles.js";
import {modelSetStateString,
        modelGetStateString,
        modelSetStatusString,
        modelGetStatusString, // Not used.
        modelSetErrorString,
        modelGetErrorString,
} from "./model.js";
import {ERROR,
        STATUS,
} from "./statusMsgs.js";

import {processStateString} from "./structure.js";

/***************************************** */

/* Illegal moves trigger bugs...
  X3+(4,5); O4+(5,6); X5+(4,5)[35|4]; O6@X3(5)!X3(5)!O4(6)!X5(4); 
  O6+(5,6)[46|35]; X7+(7,8); O8+(8,9); X9+(7,8)[79|8]; O10@X9(8)!X7(7)!O8(9)!X9(8); {X1,O0}X9+(3,3); O9@X9(3)!X9(3); {X2,O0}
*/

let placements = [];  // [{ move, player, squares:[a,b] }].
let cycleMoves = [];  // Code for collapse moves.
let stemMoves = [];
let statusString = "";

/* Example bad strings; the click UI enforces most of these automatically, but the load UI can violate them all.
  No guarentee this list is exhaustive, but it's close, and has high coverage.

  Example bad syntax;
    "sam i am"  // Nonsense.
    "Y1+(1" // Invalid player [X|O].
    "X0+(1" // Invalid turn (1-9).
    "X1*(1" // Invalid move type (placement +, collapse @).

    "X1+("   // Malformed spooky.
    "X1+(3," // Malformed spooky.
    "X1+(10" // Malformed spooky.

    "X1+(3.8)" // Malformed placement.
    "X1+(38)"  // Malformed placement.
    "X1+(3,8"  // Malformed placement.

    "O2+(1,2)[12"    // Mallformed loop.
    "O2+(1,2)12]"    // Mallformed loop.
    "O2+(1,2)[12||]" // Mallformed loop.
    "O2+(1,2)[3|12]" // Mallformed loop.
    "O2+(1,2)[5]"    // Mallformed loop.
    "O2+(1,2)[|12]"  // Mallformed loop.

    "X2O2(1)!X1(2)!O2(1)   // Malformed trigger.
    "X2@O2(12)!X1(2)!O2(1) // Malformed trigger.
    "X2@O2(12!X1(2)!O2(1)  // Malformed trigger.

    "X2@O2(1)X1(2)!O2(1) // Malformed collapse.
    "X2@O2(1)!X1(2)O2(1) // Malformed collapse.
    "X2@O2(1)!X1(2!O2(1) // Malformed collapse.
    "X2@O2(1)!X1(2)!O21) // Malformed collapse.

    "X8+(5,5)" // Malformed degenerate.
    "O9+(5,5)" // Malformed degenerate.
    "X9+(5)"   // Malformed degenerate.

    "O8@X9(5)!X9(5)"  // Malformed selfCollapse.
    "O9@X8(5)!X9(5)"  // Malformed selfCollapse.
    "O9@X9(55)!X9(5)" // Malformed selfCollapse.
    "O9@X9(5)!X8(5)"  // Malformed selfCollapse.
    "O9@X9(5)!O9(5)"  // Malformed selfCollapse.
    "O9@X9(5)!X9(4)"  // Malformed selfCollapse.
    
    "{X1,O0}"         // Malformed score.
    "{X-1, O=0}"      // Malformed score.
    "{O=0, X=1}"      // Malformed score.
    "{X=3, O=0}"      // Malformed score.
    "{X=1.0, O=0.5}"  // Malformed score.

  Example bad open moves;
    X1+(1,2); X3+(1,2); // A player can't make two moves in a row.
    X1+(1,2); O4+(4,5); // Moves must occur sequentially.
    O2+(4,5); X1+(1,2); // Moves cannot occur out of order.
    X1+(1,2); O3+(1,2); // X's placement moves are on odd turns, O's on even turns.
    X1+(1,2); O2+(1,2)[12]; O2@X1(1) // X's collapse moves are on even turns, O's on odd turns.

  Example blocked moves;
    X1+(1,2); O2+(1,2)[12]; X2@X1(1)!X1(1)!O2(2); X3+(1); // Can't place spooky marks in collapsed squares.
    X1+(1,2); O2+(1,2)[12]; X2@X1(1)!X1(1)!O2(2); X3+(3,2); // Can't place spooky marks in collapsed squares.
    X1+(1,2); O2+(2,3); X3+(2,3)[23|1]; O3@O2(4)  // Can't collapse a square not involved with the cyclic entanglement.
    X1+(1,2); O2+(2,3); X3+(2,3)[23|1]; O3@O2(2)  // Can't collapse a cell without a spooky mark (requires cell info).
    X1+(1,2); O2+(2,3); X3+(2,3)[23|1]; O3@O2(2)  // Can't collapse a stem spooky mark (requires cell info).
    X1+(1,2); O2+(2,3); X3+(2,3)[23|1]; O3@O1(1)  // Can't collapse a move to a square it has no spooky marks in.
    X1+(1,2); O2+(2,3); X3+(2,3)[23|1]; O3@O4(2)  // Can't collapse a move not involved with the cyclic entanglement.
    X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(1,3)[153]; O5@X1(1)!X1(1)!X3(2)!X5(3); {X-1, O-0} 06+(4,6) // Can't make placement moves after a game is over.
    X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(1,3)[153]; O5@X1(1)!X1(1)!X3(2)!X5(3); {X-1, O-0} X6@O2(4) // Can't make collapse moves after a game is over.
*/

export function newGame() {
  modelSetStatusString("Player X: place first spooky mark (click on it again to change your mind).");
  modelSetStateString("");
  placements = [];
  cycleMoves = [];
  stemMoves = [];

  let state = analyzeStateString(modelGetStateString());  // Generates meta data about the state.
  }

export function loadGame(stateString) { // Returns state string, potentially truncated.
  const tokens = tokenize(stateString);  // Returns: [ {type, token}, ..., {"invalid", token} ]
  const lastToken = tokens[tokens.length-1];

  const tokenString = tokensToString(tokens);

  modelSetStateString(tokenString);
  let errorString = "";

  if(lastToken.type === "invalid") {
    errorString = ERROR["invalidStateString"]();
  }
  
  let state = processStateString(modelGetStateString());  // Overwrites errorString.
  /* return {
      placements,
      cycleMoves,
      stemMoves,
      score,
      analyzedState
    };
   */

  console.log(tokenString); // Displays process of game...keep.

  placements = state.placements;
  cycleMoves = state.cycleMoves;
  stemMoves = state.stemMoves;

  let lastPlayer = state.analyzedState.progress.player;
  let lastTurn = state.analyzedState.progress.turn;
  
  let lastStr = getLastMove(modelGetStateString());
  let lastType = getLastMoveType(modelGetStateString());

  let player = (lastPlayer === 'X' ? 'O' : 'X');

  switch(lastType) {
    case 'empty':
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
      statusString = STATUS["placement"](player);
      break;
    case 'score':
      let scoreStr = getLastMove(stateString);
      let score = STATUS["score"](scoreStr);
      let options = STATUS["gameOver"]();
      statusString = score + " Options: " + options;
      break;
    case 'invalid':
      errorString = ERROR["invalidStateString"]();
      statusString = STATUS["syntax"]();
      break;
  }

  modelSetStatusString(statusString); // Erases error string.
  if(errorString.length > 0) {
    modelSetErrorString(errorString);
  }

  return modelGetStateString();
  }

export function processClick(intent) {  // This now seems solid - except for scoring.
  const squareNum = intent.squareNum;
  const cellNum   = intent.cellNum;

  let stateString = "";
  let statusString = "";
  let errorString = "";

  const state = analyzeStateString(modelGetStateString());

  let turn = state.progress.turn + 1;
  let player = (turn%2) ? 'X' : 'O'

  if(isGameOver(modelGetStateString())) {                           // Game over.
    let score = getLastMove(modelGetStateString());
    statusString = STATUS["score"](score) + " Options: " + STATUS["gameOver"]();
    }
  else if(isSquareClassical(modelGetStateString(), squareNum)) {    // Illegal move.
    statusString = STATUS["alreadyCollapsed"]();
    }
  else if(isDegenerateLastMove(modelGetStateString(), state)) {     // Self-collapse last move of game.
    // "X9+(n,n); O9@X9(n)!X9(n); "
    stateString = selfCollapseLastMove(state, intent);
    let outcome = evaluateGame(stateString);

    stateString = addScore(stateString, { X: outcome.score.X, O: outcome.score.O });
    let score = getLastMove(stateString);

    modelSetStateString(stateString);
    statusString = STATUS["selfCollapse"](score);
    // TODO: get outcome desc to mean something.
    }
  else if(isReClickSpooky(modelGetStateString(), state, intent)) {  // Undo 1st spooky mark.
    stateString = subSpookyMove(modelGetStateString());
    modelSetStateString(stateString);
    statusString = STATUS["undoSpooky"](player);
    }
  else if(isSpooky(modelGetStateString(), state)) {                 // Spooky move.
    stateString = addSpookyMove(modelGetStateString(), player, turn, squareNum);
    modelSetStateString(stateString);
    statusString = STATUS["spooky2"](player);
    }
  else if(isPlacement(modelGetStateString(), state)) {              // Placement move.
    const sq1 = state.progress.sq1;
    const sq2 = squareNum;

    stateString = addPlacementMove(modelGetStateString(), player, turn, sq1, sq2);
    modelSetStateString(stateString);

    const graph = buildGraph(placements);
    const path = findPath(graph, sq1, sq2);

    if (path !== null) { // Sq1 & sq2 already connected.
      cycleMoves = extractCycle(path, placements, turn); // [] - just the path, does not include connecting move.
      stemMoves  = extractStems(graph, path, placements, cycleMoves); // [].

      stateString = addLoop(modelGetStateString(), cycleMoves, stemMoves);
      modelSetStateString(stateString);
    
      let collapsePlayer = (player === 'X') ? 'O' : 'X'; // Must be other player who chooses the collapse.
      statusString = STATUS["loop"](collapsePlayer);
    }
    else {
      let nextPlayer = (player === 'X') ? 'O' : 'X'; // Must be other player who makes the next move.
      statusString = STATUS["loop"](nextPlayer);
    }

    placements.push({ // Add connecting move.
      move: turn,
      player: player,
      squares: [sq1, sq2]
    });

    }
  else if(isCollapse(modelGetStateString(), state)) {               // Collapse move.
    let cellSq = cellInLoop(intent, placements, cycleMoves);
    if (cellSq != null) {
      let triggerSquare = cellSq.square;
      let resolved = computeCollapseResolution(placements, cycleMoves, stemMoves, cellSq.cell, triggerSquare);
      stateString = addCollapseMove(modelGetStateString(), player, turn, cellSq.cell, cellSq.square, resolved);
      modelSetStateString(stateString);

      let outcome = evaluateGame(modelGetStateString());
      if(outcome.over) {
        stateString = addScore(stateString, { X: outcome.score.X, O: outcome.score.O });
        let score = getLastMove(stateString);
        statusString = STATUS["score"](score) + " " + STATUS["gameOver"]();
        // TODO: get outcome desc to mean something.
        modelSetStateString(stateString);
      }
      else {
        if(state.progress.turn == 8) {
          statusString = STATUS["degenerate"](player);
        } else {
          statusString = STATUS["spooky"](player);
        }
      }
    }
    else {
      const nextPlayer = (player === 'X') ? 'O' : 'X'; 
      errorString = ERROR["loop"](nextPlayer);  // TODO: error string fails to show.
      statusString = STATUS["uncollapsed"]();
    }
    }
  else {                                                  // Can't happen.
    console.log("CAN'T HAPPEN - OOPS!");
  }

  console.log(modelGetStateString());

  return {stateStr: modelGetStateString(), statusStr: statusString, errorString: errorString};
}

/** Decision functions which query state: */
function isGameOver(stateString) {
  let over = false;

  let lastType = getLastMoveType(stateString);

  return (lastType === "score");
  }

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

/* X1+(1,2); O2+(2,3); X3+(2,3)[23|1]; 
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

