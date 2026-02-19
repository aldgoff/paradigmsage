// Controller.js.

import {analyzeGame} from "../model/model.js";  // DEPRECATED.

// Model layer.
import { processClick } from "../model/process.js";

import {addSpookyMove,
        addPlacementMove,
        addLoop,
        addCollapseMove,
        addScore,
} from "../model/barrel.js";
import {buildGraph,
        findPath,
        extractCycle,
        movesForEdge,
        extractStems 
} from "../model/cycles.js";
import {evaluateGame,
        hasLegalMoves,
} from "../model/scoring.js";

// View layer.
import {initView,
        setSquareHandler,
        setStateString,
        setStatusString,
} from "../view/view.js";
import {setControlHandler,
} from "../view/controlsView.js";
import {parsePlacements
} from "../view/moves.js"

// Controller layer.
import {cellInLoop,
        computeCollapseResolution,
        isSquareClassical
} from "../controller/collapse.js"

/* State string example.  
  X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,6); X5+(6,9); O6+(7,8); 
  X7+(4,6)[347|5]; @X3(4)!X3(4)!O4(5)!X5(9)!X7(6); 
  O8+(7,8)[68]; @O6(8)!O6(8)!O8(7); 
  X9+(1,3)[192]; @O2(2)!X1(1)!O2(2)!X9(3); 
*/

// Progressive changes:
let stateString = ""; // X1+(1,2); O2+(...
let turn = 0;  // 1 - 9.
let player = "X";     // 'X'|'O'.
let sq1, sq2 = 0;     // 1 - 9.
let placements = [];  // [{ move, player, squares:[a,b] }].

/* Code for collapse moves. */
let cycleMoves = [];
let stemMoves = [];

// State changes:
let gameOver = false;
let collapse = false;
let spooky = 1;       // 1, 2.

export function initController () {
  console.log("Controller: qt3/js/controller/controller.js");

  setControlHandler( button => {    // Registers function with view so it can be called on button events.
    handleButtonRelease(button);
  });

  setSquareHandler( squareKey => {  // Registers function with view so it can be called on square events.
    handleSquareCellClick(squareKey);
  });

  initView(); // Dev scaffolding.
}

function handleButtonRelease(button) {
  switch (button) {
    case "New Game":
      console.log(button);
      stateString = ""; // X1+(1,2); O2+(...
      turn = 0;  // 1 - 9.
      player = "X";     // 'X'|'O'.
      sq1, sq2 = 0;     // 1 - 9.
      placements = [];  // [{ move, player, squares:[a,b] }].

      cycleMoves = [];  // Spooky marks on the loop.
      stemMoves = [];   // Spooky marks on the stems.

      gameOver = false; // State changes:
      collapse = false;
      spooky = 1;       // 1, 2.

      setStatusString(`Player ${player}: place first spooky mark (click on it again to change your mind (in-work)).`);
      setStateString("");
      break;
    case "Restart":
      console.log(button);
      setStatusString(`Player ${player}: place first spooky mark (click on it again to change your mind (in-work)).`);
      break;
    case "Undo":
      console.log(button);
      break;
    case "Redo":
      console.log(button);
      break;
    case "Load":
      console.log(button);
      let stateString = "";
      let analysis = {};

      stateString = "X1+(1,2); ";         // Correct.
        analysis = analyzeGame(stateString);
        console.log(analysis);

      stateString = "X1+(1,2); O2+(4,5); X3+(7,8); O4+(6,9); ";                   // 4 separables.
        analysis = analyzeGame(stateString);
        console.log(analysis);

      stateString = "X1+(1,2); O2+(4,5); X3+(7,8); O4+(6,9); X5+(1,4); O6+(8,9); "; // 4 separables.
        analysis = analyzeGame(stateString);
        console.log(analysis);

      stateString =  "X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(8,9); O6+(7,8); "
      stateString += "X7+(4,7); O8+(4,5); X9+(1,5)[198765432]; ";
        analysis = analyzeGame(stateString);
        console.log(analysis);

      stateString = "X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,6); X5+(7,8); O6+(8,9); X7+(4,5)[37|4];"
        analysis = analyzeGame(stateString);
        console.log(analysis);

      


      // stateString = "X1+(1,2); O2+(2,3); ";         // pending.
      // analysis = analyzeGame(stateString);
      // console.log(analysis);
      
      // stateString = "X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,6); X5+(6,9); O6+(7,8); X7+(4,6)[347|5]; O7@O4(5)!X3(4)!O4(5)!X5(9)!X7(6);";
      // analysis = analyzeGame(stateString);  // Not so good.
      
      break;
    case "Help":
      console.log(button);
      let helpString = "";
      helpString = "QT3 is the simplest possible toy universe which can demonstrate superposition. ";
      helpString += "It has an objective measurement mechanism (cyclic entanglements). "
      helpString += "It has a clear interpretation - a quantum game implies "
      helpString += "a set of simultaneous classical games; the classical ensemble."
      setStatusString(helpString);
      break;
    default:
      console.log("default - unknown button.");
      break;
  }
}

function handleSquareCellClick3(event) {  // Respond to clicks in squares down to the cell level.
  // event - {square: 'square1', cell: 'm1'}

  const result = processClick(stateString, event);  // {state: str, status: str}.

  stateString  = result.state;          // "X1+(1,2); O2+(2,3); X3+(1,3)[132]; "
  statusString = result.status;         // "Player O to collapse cyclic entanglement."

  setStateString(stateString);          // Stores the state string in the model layer.

  updateStatusString(statusString);     // Update the status box in the view layer.

  updateBoard(stateString);             // Update spooky and classical marks on the QT3 board.
  updateQuantumListing(stateString);    // Update listing of quantum moves.
  updateClassicalListing(stateString);  // Update listing of classical moves. (Clicking in ensemble overrides.)
  updateStateString(stateString);       // Update the state box in the view layer.
  updateEnsemble(stateString);          // Update ensemble of classical games.
}

function handleSquareCellClick2(event) {  // Respond to clicks in squares down to the cell level.
  // event - {square: 'square1', cell: 'm1'}
  // console.log("Click", event);

  const square = event.square;
  const cell = event.cell;
  const squareNum = Number(square.slice(-1)); // Last char of 'square' is the move number.

  const state = analyzeStateString(stateString);

  let statStr = `X: make your first placement move, `   // New Game, or start up.
              + `place a spooky mark in any uncollapsed square.`

  if(evaluateGame(stateString).over) {                  // Game over.
    setStatusString("Game is over. New Game, Restart, Undo, Load.");
    return;
    }
  else if(isSquareClassical(stateString, squareNum)) {  // Illegal move.
    setStatusString("That square has collapsed. Choose another.");
    return;
    }
  else if(reClickSpooky(state)) {                       // Undo 1st spooky mark.
    stateString = undoFirstSpookyMark(stateString);
    setStateString(stateString);
    updateView(stateString);
    statStr = `Spooky mark undone. ${player}: restart your placement move, `
            + `place a spooky mark in any uncollapsed square.`
    setStatusString(statStr);
    }
  else if(isDegenerateLastMove(state)) {                // Self-collapse last move of game.
    // "X9+(n,n); O9@X9(n)!X9(n); "
    stateString = selfCollapseLastMove(stateString, player, turn, sq1);
    outcome = evaluateGame(stateString);
    stateString += `{X${outcome.score.X},O${outcome.score.O}}`;
    updateView(stateString);
    setStatusString(`Game over: ${outcome.desc}.`);
    }
  else if(isFirstSpooky(state)) {                       // Place 1st spooky mark.
    turn += 1;
    player = (turn%2) ? 'X' : 'O';
    sq1 = squareNum;
    stateString = addSpookyMove(stateString, player, turn, sq1);
    updateView(stateString);
    statStr = `Continue with rest of placement move, `
            + `${player}: place your second spooky mark or undo the first one.`
    setStatusString(statStr);
    }
  else if(isSecondSpooky(state)) {                      // Place 2nd spooky mark.
    sq2 = squareNum;
    stateString = addPlacementMove(stateString, player, turn, sq1, sq2);
    updateView(stateString);
    if(isCycleEntanglement(stateString)) {
      collapsePlayer = (player === 'X') ? 'O' : 'X';
      statStr = `${collapsePlayer} must first collapse the cyclic entanglement. `
              + `Click on a purple spooky mark.`
      setStatusString(statStr);
    }
    else {
      statStr = `${player}: begin your next placement move, `
              + `place a spooky mark in any uncollapsed square.`
      setStatusString(statStr);
    }
    }
  else if(offCyclicEntanglement(state)) {               // Failed to click on loop.
    setStatusString(`Must first collapse the cyclic entanglement.`);
    }
  else if(onStem(state)) {                              // Clicked on stem.
    statStr = "Must choose a spooky mark on the loop of the cyclic entanglement "
            + "(purple), not on the stem (orange)."
    setStatusString(statStr);
    }
  else if(onLoop(state)) {                              // Collapse cyclic entanglement.
    stateString = collapseCyclicEntanglement(state, square, cell);
    updateView(stateString);
    outcome = evaluateGame(stateString);
    if(outcome.over) {
      stateString += `{X${outcome.score.X},O${outcome.score.O}}`;
      updateView(stateString);
      setStatusString(`Game over: ${outcome.desc}.`);
      }
    else {
      nextPlayer = (player === 'X') ? 'O' : 'X';
      setStatusString(`${nextPlayer}'s turn to make a placement move.`);
    }
    }
  else {                                                // Can't happen.
    console.log("CAN'T HAPPEN - OOPS!");
  }
  
  setStateString(stateString);  // Update state string so view can show it.
  console.log(stateString);     // Diagnostic.

  return stateString;
}

// --- Decision functions. ---
function reClickSpooky(state) {}
function isDegenerateLastMove(state) {}
function isFirstSpooky(state) {}
function isSecondSpooky(state) {}
function isCycleEntanglement(stateString) {}
function offCyclicEntanglement(state) {}
function onStem(state) {}
function onLoop(state) {}

// --- Action functions. ---
function undoFirstSpookyMark(stateString) {}
function selfCollapseLastMove(stateString, player, turn, sq1) {}
function collapseCyclicEntanglement(state, square, cell) {}


function handleSquareCellClick(event) {  // Respond to clicks in squares down to the cell level.
  // event - {square: 'square1', cell: 'm1'}
  // console.log("Click", event);

  // TADONE:
  // Creates canonical string, alternating players, correct move numbers, ordered squares.
  // Also detects cyclic entanglements, stems, and appends canonical loop string.
  // Supports collapse and appends canonical collapse string.
  // Enforces end of game.
  // TODO:
  // Spooky undo, and prevent moves into classical squares.

  const square = event.square;
  const cell = event.cell;
  const squareNum = Number(square.slice(-1)); // Last char of 'square' is the move number.

  // Prevent placement into classical squares (but allow collapse selection).
  if (isSquareClassical(stateString, squareNum)) {
    setStatusString("That square has collapsed. Choose another.");
    return;
  }

  if(     gameOver) {           // Game over.
    setStatusString("Game is over. New Game, Restart, Undo.");
    return;
    }
  else if(collapse) {           // Collapse move required - "...X7+(4,6)[347|5]; => @X3(4)!X3(4)!O4(5)..."."
    let cellSq = cellInLoop(event, placements, cycleMoves);
    if (cellSq != null) {
      let triggerSquare = cellSq.square;
      let resolved = computeCollapseResolution(placements, cycleMoves, stemMoves, cellSq.cell, triggerSquare);
      stateString = addCollapseMove(stateString, player, turn, cellSq.cell, cellSq.square, resolved);

      setStateString(stateString);

      collapse = false;
      setStatusString(`Player ${player}: place first spooky mark (click on it again to change your mind (in-work)).`);
      gameOver = (turn == 9) && (spooky === 1);
    }
    else {
      console.log ("No spooky mark in cell", cell, "in square", square);
      collapse = true;
    }
    }
  else if(spooky === 1) {       // First spooky mark - "X1+(1".
    turn += 1;
    sq1 = squareNum; // Last char of 'square1' is the move number.
    stateString = addSpookyMove(stateString, player, turn, sq1);
    setStatusString(`Player ${player}: place second spooky mark (commits to the move).`);
    spooky = 2;
    }
  else if(spooky === 2) {       // Second spooky mark - "X1+(1,2)" - Completes a placement move.
    sq2 = squareNum; // Last char 'square2';
    if(sq1 === sq2) {
      setStatusString("Second spooky mark must be in a different square (unless only one uncollapsed square left.)");
      return;
    }
    stateString = addPlacementMove(stateString, player, turn, sq1, sq2);

    // Check for cyclic entanglement.
    const graph = buildGraph(placements);
    const path = findPath(graph, sq1, sq2);

    if (path !== null) { // Sq1 & sq2 already connected.
      cycleMoves = extractCycle(path, placements, turn); // [] - just the path, does not include connecting move.
      stemMoves  = extractStems(graph, path, placements, cycleMoves); // [].

      collapse = true;

      let collapsePlayer = (player === 'X') ? 'O' : 'X'; // Must be other player who chooses the collapse..

      stateString = addLoop(stateString, cycleMoves, stemMoves);
      setStatusString(`Player ${collapsePlayer} needs to make a collapse move - select one purple spooky mark.`);
    }
    else {
      stateString += `; `;
    }

    placements.push({ // Add connecting move.
      move: turn,
      player: player,
      squares: [sq1, sq2]
    });

    spooky = 1;   // Ready for next placement move.
    player = (player === 'X') ? 'O' : 'X'; // Toggle player.
    if(!collapse) {
      setStatusString(`Player ${player}: place first spooky mark (click on it again to change your mind (in-work)).`);
    }
    }
  else {                        // Can't happen.
    console.log("CAN'T HAPPEN - OOPS!");
  }

  setStateString(stateString);  // Update state string so view can show it.
  console.log(stateString);     // Diagnostic.
}

