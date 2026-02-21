// ./assets/qt3/js/model/process.js

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

export function newGame() {
  stateString = "";
  placements = [];
  cycleMoves = [];
  stemMoves = [];

  // setStateString("");    // This will clear the board.
  let state = analyzeStateString(stateString);

}

/* List of status strings: 
  statusString = "Game is over. New Game, Restart, Undo, Load.";
  statusString = "That square has collapsed. Choose another.";
  statusString = `Last move self-collapsed (degenerate). Game over: ${outcome.desc}.`;
  statusString = `Spooky mark undone. ${player}: restart your placement move, place a spooky mark in any uncollapsed square.`
  statusString = `Continue with rest of placement move, ${player}: place your second spooky mark or undo the first one.`
    statusString = `${collapsePlayer} must first collapse the cyclic entanglement. Click on a purple spooky mark.`
    statusString = `${nextPlayer}: begin your next placement move, place a spooky mark in any uncollapsed square.`
      statusString = `Game over: ${outcome.desc}.`;
      statusString = `Player ${player}: place first spooky mark (click it again to change your mind).`;
 */

/* Major bug...
  X1+(1,2); O2+(1,2)[12]; X3@O2(1)!X1(2)!O2(1); 
  X3+(4,5); O4+(5,6); X5+(4,5)[35|4]; O6@X3(5)!X3(5)!O4(6)!X5(4); 
  O6+(5,6)[46|35]; X7+(7,8); O8+(8,9); X9+(7,8)[79|8]; O10@X9(8)!X7(7)!O8(9)!X9(8); 
  {X1,O0}X9+(3,3); O9@X9(3)!X9(3); {X2,O0}

  Clicking on classical squares is not working correctly.
 */

export function processClick(intent) {
  const squareNum = intent.squareNum;
  const cellNum   = intent.cellNum;

  let statusString = "";

  const state = analyzeStateString(stateString);

  let turn = state.progress.turn + 1;
  let player = (turn%2) ? 'X' : 'O'

  if(evaluateGame(state).over) {                          // Game over.
    statusString = "Game is over. New Game, Restart, Undo, Load.";
    }
  else if(isSquareClassical(stateString, squareNum)) {    // Illegal move.
    statusString = "That square has collapsed. Choose another.";
    }
  else if(isDegenerateLastMove(stateString, state)) {     // Self-collapse last move of game.
    // "X9+(n,n); O9@X9(n)!X9(n); "
    stateString = selfCollapseLastMove(stateString, state, intent);
    let outcome = evaluateGame(stateString);
    stateString += `{X${outcome.score.X},O${outcome.score.O}}`;
    statusString = `Last move self-collapsed (degenerate). Game over: ${outcome.desc}.`;
    }
  else if(isReClickSpooky(stateString, state, intent)) {  // Undo 1st spooky mark.
    stateString = subSpookyMove(stateString);
    statusString = `Spooky mark undone. ${player}: restart your placement move, `
                 + `place a spooky mark in any uncollapsed square.`
    }
  else if(isSpooky(stateString, state)) {                 // Spooky move.
    stateString = addSpookyMove(stateString, player, turn, squareNum);
    statusString = `Continue with rest of placement move, `
                 + `${player}: place your second spooky mark or undo the first one.`
    }
  else if(isPlacement(stateString, state)) {              // Placement move.
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
  else if(isCollapse(stateString, state)) {               // Collapse move.
    console.log("isCollapse() state", state);
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
    }
  else {                                                  // Can't happen.
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
  
/** Action functions which change stage. */

function selfCollapseLastMove(stateString, state, intent) {
  // "X9+(n,n); O9@X9(n)!X9(n); "

  let n = intent.squareNum;
  let selfCollapseString = `X9+(${n},${n}); O9@X9(${n})!X9(${n}); `;

  return state = stateString + selfCollapseString;
}

/** Helper functions: */

function cellInLoop(intent, placements, cycleMoves) {  // { cell: cellNum, square: squareNum }.
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

function computeCollapseResolution(
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

