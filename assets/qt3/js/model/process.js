// ./assets/qt3/js/model/process.js

// import {GRAMMAR} from "./grammer.js";

import {analyzeStateString} from "./analyzeStateString.js";
import {evaluateGame} from "./scoring.js";
import {isSquareClassical} from "./structure.js";

/***************************************** */

export function processClick(stateString, intent) {
  const squareNum = intent.squareNum;
  const cellNum   = intent.cellNum;

  let newState = stateString;
  let statusString = "";
  // result = { stateStr: "New state string", statusStr: "Action or blocked" };

  const state = analyzeStateString(stateString);
  let player = state.player;

  if(evaluateGame(stateString).over) {                  // Game over.
    statusString = "Game is over. New Game, Restart, Undo, Load.";
    }
  else if(isSquareClassical(stateString, squareNum)) {     // Illegal move.
    statusString = "That square has collapsed. Choose another.";
    }
  else if(isReClickSpooky(stateString)) {               // Undo 1st spooky mark.
    newState = undoFirstSpookyMark(stateString);
    statusString = `Spooky mark undone. ${player}: restart your placement move, `
                 + `place a spooky mark in any uncollapsed square.`
    }
  else if(isDegenerateLastMove(stateString, state)) {   // Self-collapse last move of game.
    // "X9+(n,n); O9@X9(n)!X9(n); "
    newState = selfCollapseLastMove(stateString, state);
    let outcome = evaluateGame(newState);
    newState += `{X${outcome.score.X},O${outcome.score.O}}`;
    statusString = `Game over: ${outcome.desc}.`;
    }
  else if(isFirstSpooky(stateString, state)) {          // Place 1st spooky mark.
    newState = addSpookyMove(stateString, state);
    statusString = `Continue with rest of placement move, `
                 + `${player}: place your second spooky mark or undo the first one.`
    }
  else if(isSecondSpooky(stateString, state)) {         // Place 2nd spooky mark.
    newState = addPlacementMove(stateString, state);
    if(isCycleEntanglement(newState)) {
      let collapsePlayer = (player === 'X') ? 'O' : 'X';
      statusString = `${collapsePlayer} must first collapse the cyclic entanglement. `
                   + `Click on a purple spooky mark.`
    }
    else {
      statusString = `${player}: begin your next placement move, `
                   + `place a spooky mark in any uncollapsed square.`
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
    newState = collapseCyclicEntanglement(stateString, squareNum, cellNum);
    let outcome = evaluateGame(newState);
    if(outcome.over) {
      newState += `{X${outcome.score.X},O${outcome.score.O}}`;
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

  return {stateStr: newState, statusStr: statusString};
}

/** Decision functions which query state: */

function isReClickSpooky(stateString) {
  let reClicked = false;

  // TODO: fill in decision function isReClickSpooky().

  return reClicked;
  }

function isDegenerateLastMove(stateString) {
  let degenerateLastMove = false;

  // TODO: fill in decision function isDegenerateLastMove().

  return degenerateLastMove;
  }

function isFirstSpooky(stateString, state) {    // Done.
  console.log("isFirstSpooky: state:", state);

  // TODO: fill in decision function isFirstSpooky().

  return state.progress.firstSpooky;
  }

function isSecondSpooky(stateString, state) {
  let spooky = false;

  // TODO: fill in decision function isSecondSpooky().

  return spooky;
  }
function isOffCyclicEntanglement(stateString) {
  let notOnCycle = false;

  // TODO: fill in decision function isOffCyclicEntanglement().

  return notOnCycle;
  }
function isOnStem(stateString) {
  let onStem = false;

  // TODO: fill in decision function isOnStem().

  return onStem;
  }
function isOnLoop(stateString, state) {
  let onLoop = false;

  // TODO: fill in decision function isOnLoop().

  return onLoop;
}

/** Action functions which change stage. */

export function addSpookyMove(stateString, state) {
  let newState = stateString;

  // TODO: fill in action function addSpookyMove().

  return newState;
}

export function undoFirstSpookyMark(stateString) {
  let newState = stateString.slice(0, -5);  // "Xn+(1"

  // TODO: fill in action functionundoFirstSpookyMark().

  return newState;
}

// TODO: Add rest of action functions to model.

