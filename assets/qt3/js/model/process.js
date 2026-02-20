// ./assets/qt3/js/model/process.js

// import {GRAMMAR} from "./grammer.js";

import {analyzeStateString} from "./analyzeStateString.js";
import {evaluateGame} from "./scoring.js";
import {isSquareClassical} from "./structure.js";
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
} from "../model/cycles.js";


/***************************************** */

let stateString = "";
let placements = [];  // [{ move, player, squares:[a,b] }].

/* Code for collapse moves. */
let cycleMoves = [];
let stemMoves = [];

export function processClick(intent) {
  const squareNum = intent.squareNum;
  const cellNum   = intent.cellNum;

  let statusString = "";

  const state = analyzeStateString(stateString);
  console.log(state);

  let turn = state.progress.turn + 1;
  let player = (turn%2) ? 'X' : 'O'

  if(evaluateGame(state).over) {                  // Game over.
    statusString = "Game is over. New Game, Restart, Undo, Load.";
    }
  else if(isSquareClassical(stateString, squareNum)) {  // Illegal move.
    statusString = "That square has collapsed. Choose another.";
    }
  else if(isDegenerateLastMove(stateString, state)) {   // Self-collapse last move of game.
    // "X9+(n,n); O9@X9(n)!X9(n); "
    stateString = selfCollapseLastMove(stateString, state, intent);
    let outcome = evaluateGame(stateString);
    stateString += `{X${outcome.score.X},O${outcome.score.O}}`;
    statusString = `Game over: ${outcome.desc}.`;
    }
  else if(isReClickSpooky(stateString, state, intent)) {               // Undo 1st spooky mark.
    stateString = subSpookyMove(stateString);
    statusString = `Spooky mark undone. ${player}: restart your placement move, `
                 + `place a spooky mark in any uncollapsed square.`
    }
  else if(isSpooky(stateString, state)) {               // Place 1st spooky mark.
    stateString = addSpookyMove(stateString, player, turn, squareNum);
    statusString = `Continue with rest of placement move, `
                 + `${player}: place your second spooky mark or undo the first one.`
    }
  else if(isPlacement(stateString, state)) {            // Place 2nd spooky mark.
    stateString = addPlacementMove(stateString, player, turn, state.progress.sq1, squareNum);
    const sq1 = state.progress.sq1;
    const sq2 = squareNum;

    const graph = buildGraph(placements);

    const path = findPath(graph, sq1, sq2);

    if (path !== null) { // Sq1 & sq2 already connected.
      cycleMoves = extractCycle(path, placements, turn); // [] - just the path, does not include connecting move.
      stemMoves  = extractStems(graph, path, placements, cycleMoves); // [].

      stateString = addLoop(stateString, cycleMoves, stemMoves);

      let collapsePlayer = (player === 'X') ? 'O' : 'X'; // Must be other player who chooses the collapse..
      statusString = `${collapsePlayer} must first collapse the cyclic entanglement. `
                   + `Click on a purple spooky mark.`
    }
    else {
      statusString = `${player}: begin your next placement move, `
                   + `place a spooky mark in any uncollapsed square.`
    }

    placements.push({ // Add connecting move.
      move: turn,
      player: player,
      squares: [sq1, sq2]
    });

    }
  else if(isCollapse(stateString, state)) {       // Collapse move.
    let cellSq = cellInLoop(intent, placements, cycleMoves);
    if (cellSq != null) {
      let triggerSquare = cellSq.square;
      let resolved = computeCollapseResolution(placements, cycleMoves, stemMoves, cellSq.cell, triggerSquare);
      stateString = addCollapseMove(stateString, player, turn, cellSq.cell, cellSq.square, resolved);

      let outcome = evaluateGame(stateString);
      if(outcome.over) {
        stateString += `{X${outcome.score.X},O${outcome.score.O}}`;
        statusString = `Game over: ${outcome.desc}.`;
      }
      else {
        statusString = `Player ${player}: place first spooky mark (click on it again to change your mind (in-work)).`;
      }
    }
    }
  else if(isOffCyclicEntanglement(stateString)) {       // Failed to click on loop.
    statusString = `Must first collapse the cyclic entanglement.`;
    }
  else if(isOnStem(stateString)) {                      // Clicked on stem.
    statusString = "Must choose a spooky mark on the loop of the cyclic entanglement "
                 + "(purple), not on the stem (orange)."
    }
  else if(isOnLoop(stateString, state)) {               // Collapse cyclic entanglement.
    stateString = collapseCyclicEntanglement(stateString, squareNum, cellNum);
    let outcome = evaluateGame(newState);
    if(outcome.over) {
      stateString += `{X${outcome.score.X},O${outcome.score.O}}`;
      statusString = `Game over: ${outcome.desc}.`;
      }
    else {
      let nextPlayer = (player === 'X') ? 'O' : 'X';
      statusString = `${nextPlayer}'s turn to make a placement move.`;
    }
    }
  else {                                                // Can't happen.
    console.log("CAN'T HAPPEN - OOPS!");
  }

  console.log(stateString);
  
  return {stateStr: stateString, statusStr: statusString};
}

/** Decision functions which query state: */

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
  return state.progress.firstSpooky;
  }

function isPlacement(stateString, state) { // Done.
  return state.progress.placement;
  }
function isCollapse(stateString, state) { // Done.
  return state.progress.collapse;
}
  
function isOffCyclicEntanglement(stateString) { // draft
  let notOnCycle = false;

  // TODO: fill in decision function isOffCyclicEntanglement().

  return notOnCycle;
  }
function isOnStem(stateString) { // draft
  let onStem = false;

  // TODO: fill in decision function isOnStem().

  return onStem;
  }
function isOnLoop(stateString, state) { // draft
  let onLoop = false;

  // TODO: fill in decision function isOnLoop().

  return onLoop;
}

/** Action functions which change stage. */

function selfCollapseLastMove(stateString, state, intent) {
  // "X9+(n,n); O9@X9(n)!X9(n); "

  let n = intent.squareNum;
  let selfCollapseString = `X9+(${n},${n}); O9@X9(${n})!X9(${n}); `;

  return state = stateString + selfCollapseString;
}

/** Other helper functions. */

export function cellInLoop(intent, placements, cycleMoves) {  // { cell: cellNum, square: squareNum }.
  const squareNum = intent.squareNum;
  const cellNum   = intent.cellNum;
  
  // Must be one of the loop moves.
  if (!cycleMoves.includes(cellNum)) {
    return null;
  }

  // Find the placement for that move.
  const p = placements.find(p => p.move === cellNum);
  if (!p) {
    return null;
  }

  // That move must occupy this square.
  if (!p.squares.includes(squareNum)) return null;

  // Success
  return {
    cell: cellNum,
    square: squareNum
  };
}

export function computeCollapseResolution(
  placements,
  cycleMoves,
  stemMoves,
  triggerMove,
  triggerSquare
  ) {

  const componentMoves = new Set([
    ...cycleMoves,
    ...stemMoves
  ]);

  const resolved = {};
  const stack = [];

  resolved[triggerMove] = triggerSquare;
  stack.push(triggerMove);

  while (stack.length > 0) {

    const move = stack.pop();
    const square = resolved[move];

    for (const p of placements) {

      if (!componentMoves.has(p.move)) continue;
      if (p.move === move) continue;
      if (resolved[p.move] !== undefined) continue;

      const [a, b] = p.squares;

      if (a === square || b === square) {
        const forcedSquare = (a === square) ? b : a;
        resolved[p.move] = forcedSquare;
        stack.push(p.move);
      }
    }
  }

  return resolved;
}

