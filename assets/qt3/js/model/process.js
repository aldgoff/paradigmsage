// ./assets/qt3/js/model/process.js

// This appears to be the execution path from processClick().

import { GRAMMAR } from "./grammar.js";
import { tokenize } from "./tokens.js";
import { processLoad } from "./tokens.js";
import { tokensToString } from "./tokens.js";
import { resetGlobals } from "./tokens.js";

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

import {process} from "./intent.js";


export function newGame() {
  modelSetStatusString("Player X: place first spooky mark (click on it again to change your mind).");
  modelSetStateString("");
  placements = [];
  cycleMoves = [];
  stemMoves = [];

  resetGlobals();

  let state = analyzeStateString(modelGetStateString());  // Generates meta data about the state.
  }

export function loadGame(stateString) { // Returns state string, potentially truncated.
  resetGlobals();

  const tokens = tokenize(stateString);  // Returns: [ {type, token}, ..., {"invalid", token} ]
  console.log("tokens", tokens);

  let player = "";    // Typical contents of the intent object.
  let turn = 0;
  let sq1 = 0;
  let sq2 = 0;
    
  for(const token of tokens) {  // For each token in current state string, convert to intent.
    token.str = token.token;
    console.log("token", token);

    let intent = { type: "weird" };

    let match ={};
    switch(token.type) {  // Create intent { type, player, turn, square, sq1, sq2, triggerMove, triggerSquare, clickSq, collapseSq }.
    case "empty":           // "".
      console.log("EMPTY-");
      intent = { type: "empty", player: "XO", turn: 0 };
      break;
    case "spooky":          // "X1+(1".
      console.log("SPOOKY-");
      match = GRAMMAR.spookyToken.exec(token.str);
      if(match != null) {
        player = match[1];
        turn   = Number(match[2]);
        sq1    = Number(match[3]);
        sq2    = 0;
        intent = { type: "spooky", player, turn, sq1, sq2 };
      }
      break;
    case "placement":       // "X1+(1,2); O2+(2,3); ".
      console.log("PLACEMENT-");
      match = GRAMMAR.placementToken.exec(token.str);
      if(match != null) {
        player = match[1];
        turn   = Number(match[2]);
        sq1    = Number(match[3]);
        sq2    = Number(match[4]);
        intent = { type: "placement", player, turn, sq1, sq2 };
      }
      break;
    case "spooky2":         // ",5)". // Can't happen in loadGame().
      console.log("SPOOKY2-");
      match = GRAMMAR.spooky2Token.exec(token.str);
      if(match != null) {
        sq2    = Number(match[1]);
        intent = { type: "spooky2", player, turn, sq1, sq2 };
      }
      break;
    case "pureLoop":        // "O2+(2,1)[12]; ".
      console.log("PURELOOP-");
      match = GRAMMAR.pureLoopToken.exec(token.token);
      if(match != null) {
        player = match[1];
        turn   = Number(match[2]);
        sq1    = Number(match[3]);
        sq2    = Number(match[4]);
        intent = { type: "loop", player, turn, sq1, sq2 };
      }
      break;
    case "stemLoop":        // "X3+(3,2)[23|1]"
      console.log("STEMLOOP-");
      match = GRAMMAR.stemLoopToken.exec(token.token);
      if(match != null) {
        player = match[1];
        turn   = Number(match[2]);
        sq1    = Number(match[3]);
        sq2    = Number(match[4]);
        intent = { type: "loop", player, turn, sq1, sq2 };
      }
      break;
    case "collapse":        // "X2@X1(1)!X1(1)!O2(2); ".
      console.log("COLLAPSE-");
      match = GRAMMAR.collapseToken.exec(token.token);
      if(match != null) {
        player  =  match[1];
        turn    = Number(match[2]);
        const triggerMove = match[3];
        const triggerSquare  = Number(match[4]);
        intent = { type: "collapse", player, turn, triggerMove, triggerSquare };
      }
      break;
    case "degenerate":      // "X9+(n,n); ".
      console.log("DEGENERATE-");
      match = GRAMMAR.degenerate.exec(token.token);
      if(match != null) {
        player  =  match[1];
        turn    = Number(match[2]);
        sq1     = Number(match[3]); // These must be equal.
        sq2     = Number(match[4]); // sq1 === sq2.
        intent = { type: "degenerate", player, turn, sq1, sq2 };
      }
      break;
    case "selfCollapse":    // "O9@X9(5)!X9(5); "
      console.log("SELFCOLLAPSE-");
      match = GRAMMAR.selfCollapseToken.exec(token.token);
      if(match != null) {
        const clickSq    = Number(match[1]);
        const collapseSq = Number(match[2]);
        intent = { type: "selfCollapse", clickSq, collapseSq };
      }
      break;
    case "score":    // "{X=1,O=0}"
      console.log("SCORE-");
      match = GRAMMAR.scoreToken.exec(token.token);
      if(match != null) {
        const X = match[1];
        const O = match[2];
        intent = { type: "score", X, O };
      }
      break;
    default:                // This truncates the load string.
      intent = { type: "invalid", msg: "Truncating load string." };
      break;
    }

    // ENTRY POINT FOR LOADS.
    const newStateString = process(modelGetStateString(), intent);

    modelSetStateString(newStateString);
    console.log("==========================");
  }

  return modelGetStateString();

  /* Experimental code */
    processLoad(tokens);
    return modelGetStateString();

  /* Original Code.
    // const lastToken = tokens[tokens.length-1];
    // const tokenString = tokensToString(tokens);

    // modelSetStateString(tokenString);
    // modelSetErrorString("");
    // if(lastToken.type === "invalid") {
    //   modelSetErrorString("Invalid state string, truncated at point of corruption.");
    // }
    
    // let state = processStateString(modelGetStateString());  // Overwrites errorString.
    // // return {
    //  // placements,
    //  // cycleMoves,
    //  // stemMoves,
    //  // score,
    //  // analyzedState
    // //};
    // 
    // // console.log("state", state);
    // console.log(tokenString);

    // placements = state.placements;
    // cycleMoves = state.cycleMoves;
    // stemMoves = state.stemMoves;

    // let lastPlayer = state.analyzedState.progress.player;
    // let lastStr = getLastMove(modelGetStateString());
    // let lastType = getLastMoveType(modelGetStateString());
    // let player = (lastPlayer === 'X' ? 'O' : 'X');

    // let errorString = "";
    // switch(lastType) {
    //   case 'empty':
    //     errorString = ERROR["emptyLoad"]();
    //     statusString = STATUS["playOrLoad"](player);
    //     break;
    //   case 'spooky':
    //     statusString = STATUS["spooky2"](player);
    //     break;
    //   case 'placement':
    //     statusString = STATUS["placement"](player);
    //     break;
    //   case 'loop':
    //     statusString = STATUS["collapse"](player);
    //     break;
    //   case 'collapse':
    //     statusString = STATUS["placement"](player);
    //     break;
    //   case 'score':
    //     let scoreStr = getLastMove(stateString);
    //     let score = STATUS["score"](scoreStr);
    //     let options = STATUS["gameOver"]();
    //     statusString = score + ". Options: " + options;
    //     break;
    //   case 'invalid':
    //     // statusString = ERROR["invalidStateString"]();
    //     break;
    // }
    // const error = modelGetErrorString();

    // modelSetStatusString(statusString); // Erases error string.
    // if(error.length > 0) {
    //   modelSetErrorString(error);
    // }
    // loadGameHelper(stateString, tokens);

    // return modelGetStateString();
  */
  }

export function loadEvent(event) {
  const square = Number(event.square.slice(-1)); // Last char of 'square' is the move number.
  const cell   = Number(event.cell.slice(-1)); // Last char of 'cell' is the move number.

  let player = "X";
  let turn   = 1;
  let sq1    = square;
  let sq2    = 0;

  // Fake state strings for exhuastive type testing:
    let fakeStateString = ""; // Empty.
    // let fakeStateString = "X1+(1"; // Spooky.
    // let fakeStateString = "X1+(1,2)"; // Placement.
    // let fakeStateString = "X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(1,3)[135]"; // Loop.
    // let fakeStateString = "1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(1,3)[135]; O5@X5(1)!X1(2)!X3(3)!X5(1)"; // Collapse.

    // let fakeStateString = "X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(8,9); O6+(7,8); X7+(4,7); O8+(1,4)[18765432]; \
    // X8@X1(2)!X1(2)!O2(3)!X3(6)!O4(9)!X5(8)!O6(7)!X7(4)!O8(1); X9+(5,5)"; // Degenerate.

    // let fakeStateString = "X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(8,9); O6+(7,8); X7+(4,7); O8+(1,4)[18765432]; \
    // X8@X1(2)!X1(2)!O2(3)!X3(6)!O4(9)!X5(8)!O6(7)!X7(4)!O8(1); X9+(5,5); O9@X9(5)!X9(5)"; // SelfCollapse.

    // let fakeStateString = "X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(1,3)[135]; O5@X5(1)!X1(2)!X3(3)!X5(1); {X=1,O=0}"; // score.

  // modelSetStateString(fakeStateString);

  let lastMove = getLastMove(modelGetStateString()); // { type: spooky, str: "X1+(1" }
  console.log("turn", turn);

  let lastMoveType = getLastMoveType(modelGetStateString()); // { type: spooky, str: "X1+(1" }
  console.log("lastMove", lastMoveType, lastMove);

  let intent = { type: "invalid", player, turn, sq1, sq2 };

  if(lastMove === "") {     // spooky
    console.log("BLANK");
    let type = "spooky";
    turn = 1;
    intent = { type, player, turn, sq1, sq2 };
    }
  else if(lastMoveType === "empty") {        // spooky
    console.log("EMPTY");
    let type = "spooky";
    turn = 1;
    intent = { type, player, turn, sq1, sq2 };
    }
  else if(lastMoveType === "spooky") {       // stripSpooky|spooky2|loop
    console.log("SPOOKY");
    const match = GRAMMAR.spookyToken.exec(lastMove);
    if(match != null) {
      player = match[1];
      turn = Number(match[2]);
      sq1 = Number(match[3]);

      let context = "";
      if(square === sq1)  context = "stripSpooky";
      else {
        if(true) { // !loopTest();
          context = "spooky2";
        }
        else {
          context = "loop";
        }
      }

      switch(context) {
        case "stripSpooky":
          intent = { type: "stripSpooky", player, turn, sq1, sq2 };
          break;
        case "spooky2":
          sq2 = square;
          intent = { type: "spooky2", player, turn, sq1, sq2 };
          break;
        case "loop":
          intent = { type: "loop", player, turn, sq1, sq2 };
          break;
        default:
          console.log("*** spooky else");
          break;
      }
    }
    }
  else if(lastMoveType === "placement") {    // spooky"
    console.log("PLACEMENT");
    
    const match = GRAMMAR.placementToken.exec(lastMove);
    if(match === null) throw Error("placement match can't be null, WTF?!?");
    turn = Number(match[2]) + 1;
    player = (turn%2) ? "X": "O";
    sq1 = square;
    sq2 = 0;

    let type = "spooky";
    intent = { type, player, turn, sq1, sq2 };
    }
  else if(lastMoveType === "loop") {         // collapse
    console.log("LOOP");
    let type = "collapse";
    intent = { type, player, turn, sq1, sq2 };
    }
  else if(lastMoveType === "collapse") {     // spooky|placement|degenerate|score
    console.log("COLLAPSE");
    let type = "spooky|placement|degenerate|score";
    intent = { type, player, turn, square, cell };
    }
  else if(lastMoveType === "degenerate") {   // selfCollapse|score
    console.log("DEGENERATE");
    let type = "selfCollapse|score";
    turn = 9;
    intent = { type, player, turn, square };
    }
  else if(lastMoveType === "selfCollapse") { // score
    console.log("SCORE");
    let type = "score";
    intent = { type };
    }
  else if(lastMoveType === "score") { // score
    console.log("SPOOKY");
    let type = "over";
    intent = { type };
    }
  else {
    console.log("*** lastMoveType else", lastMoveType);
  }

  // ENTRY POINT FOR CLICKS.
  const newStateString = process(modelGetStateString(), intent);  // intent.js.
  console.log(newStateString);

  modelSetStateString(newStateString);

  console.log("==========================");

  return modelGetStateString();
}




function loadGameHelper(stateString, tokens) {
  const lastToken = tokens[tokens.length-1];
  const tokenString = tokensToString(tokens);

  modelSetStateString(tokenString);
  modelSetErrorString("");
  if(lastToken.type === "invalid") {
    modelSetErrorString("Invalid state string, truncated at point of corruption.");
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
  // console.log("state", state);
  console.log(tokenString);

  placements = state.placements;
  cycleMoves = state.cycleMoves;
  stemMoves = state.stemMoves;

  let lastPlayer = state.analyzedState.progress.player;
  let lastStr = getLastMove(modelGetStateString());
  let lastType = getLastMoveType(modelGetStateString());
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

  modelSetStatusString(statusString); // Erases error string.
  if(error.length > 0) {
    modelSetErrorString(error);
  }
}

// ------------- Deprecated code ------------- //
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
    statusString = "Game is over. New Game, Rerun, Undo, Redo, Load.";
    }
  else if(isSquareClassical(modelGetStateString(), squareNum)) {    // Illegal move.
    statusString = "That square has collapsed. Choose another.";
    }
  else if(isDegenerateLastMove(modelGetStateString(), state)) {     // Self-collapse last move of game.
    // "X9+(n,n); O9@X9(n)!X9(n); "
    stateString = selfCollapseLastMove(state, intent);
    let outcome = evaluateGame(stateString);
    stateString += `{X=${outcome.score.X}, O=${outcome.score.O}}`;
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
    const sq1 = state.progress.sq1;
    const sq2 = squareNum;

    stateString = modelGetStateString() + `,${sq2}); `

    modelSetStateString(stateString);

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
    if (cellSq != null) {
      let triggerSquare = cellSq.square;
      let resolved = computeCollapseResolution(placements, cycleMoves, stemMoves, cellSq.cell, triggerSquare);
      stateString = addCollapseMove(modelGetStateString(), player, turn, cellSq.cell, cellSq.square, resolved);
      modelSetStateString(stateString);

      let outcome = evaluateGame(modelGetStateString());
      if(outcome.over) {
        stateString += `{X=${outcome.score.X}, O=${outcome.score.O}}`;
        statusString = `Game is over: ${outcome.desc}.`;
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
      const nextPlayer = (player === 'X') ? 'O' : 'X'; 
      errorString = ERROR["loop"](nextPlayer);  // TODO: error string fails to show.
      statusString = STATUS["uncollapsed"]();
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

  // console.log(modelGetStateString());

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

