// ./assets/qt3/js/model/tokens.js

import { GRAMMAR } from "../model/grammar.js";
import {getLastMove} from "../model/analyzeStateString.js";
import {getLastMoveType} from "../model/analyzeStateString.js";
import {modelSetStateString,
        modelGetStateString,
        modelSetStatusString,
        modelGetStatusString, // Not used.
        modelSetErrorString,
        modelGetErrorString,
} from "./model.js";
import {addSpookyMove,
        subSpookyMove,
        addPlacementMove, // Not used.
        // addLoop,  // Name conflict.
        addCollapseMove,
        addScore, // Not used.
} from "./barrel.js";
import {buildGraph,
        findPath,
        extractCycle,
        movesForEdge, // Not used.
        extractStems 
} from "./cycles.js";
import {analyzeStateString} from "./analyzeStateString.js";

import {cellInLoop,
        computeCollapseResolution,
} from "./collapse.js";
import {evaluateGame} from "./scoring.js";

import {ERROR,
        STATUS,
} from "./statusMsgs.js";

export function tokenize(stateString) {   // Returns: [{ type: "spooky", token: "" }, ...];
  const trimmed = stateString.trim();

  const tokens = [];
  let working = trimmed;

  // --- Deal with the empty string edge case.
  if (trimmed === "") {
    tokens.push({ type: "empty", token: "" });
    return tokens;
  }

  // --- Detect score (must be at end) ---
  let scoreMatch = GRAMMAR.scoreToken.exec(working);
  let scoreToken = { type: "missing", token: "" };

  if (scoreMatch) { // Score must occupy the end of string.
    const scoreText = scoreMatch[0];
    const scoreIndex = working.lastIndexOf(scoreText);

    if (scoreIndex + scoreText.length !== working.length) {
      scoreToken = {      // Append invalid score at the end of the token list.
        type: "invalid",
        token: working
      };
    }
    else {    // Remove score portion for earlier parsing
      working = working.slice(0, scoreIndex).trim();
      scoreToken = {      // Append valid score at the end of the token list.
        type: "score",
        token: scoreText
      };
    }
  }

  // --- Parse move fragments.
  if (working !== "") {
    const parts = working.split(";");

    for (let raw of parts) {
      let fragment = raw.trim();
      if (!fragment) continue;

      let type = null;

      if(false) { // Order dependence trumps logical sequence.
      } else if (GRAMMAR.spookyToken.test(fragment)) {       type = "spooky";
      } else if (GRAMMAR.degenerateToken.test(fragment)) {   type = "degenerate";
      } else if (GRAMMAR.placementToken.test(fragment)) {    type = "placement";
      } else if (GRAMMAR.pureLoopToken.test(fragment)) {     type = "pureLoop";
      } else if (GRAMMAR.stemLoopToken.test(fragment)) {     type = "stemLoop";
      } else if (GRAMMAR.loopToken.test(fragment)) {         type = "loop"; // Shadowed by previous pair of blocks.
      } else if (GRAMMAR.selfCollapseToken.test(fragment)) { type = "selfCollapse";
      } else if (GRAMMAR.collapseToken.test(fragment)) {     type = "collapse";
      } else if (GRAMMAR.scoreToken.test(fragment)) {        type = "score";  // Path taken only on multiple tokens.
      } else {                                               type = "invalid";
      }

      const token = { type: type, token: fragment };
      tokens.push({ type, token: fragment });
    }
  }

  // --- Append score last (if present).
  if (scoreToken.type != "missing") {
    tokens.push(scoreToken);
  }

  // --- Return list of token types and strings.
  return tokens;   // Returns: [{ type: "spooky", token: "" }];
}

export function tokensToString(tokens, tokenLimit = null) {
  let tokenString = "";

  const limit = (tokenLimit === null)
    ? tokens.length
    : Math.min(tokenLimit, tokens.length);

  for (let i = 0; i < limit; i++) {
    const token = tokens[i];

    if (token.type !== "invalid") {
      if (token.type === "empty") {
        tokenString = "";
        }
      else if (token.type === "score") {
        tokenString += token.token;
        }
      else if (token.type === "spooky") {
        tokenString += token.token;
        }
      else {
        tokenString += token.token + "; ";
      }
    } else {
      tokenString += token.token + "; ";
      break;
    }
  }

  return tokenString;
}

let placements = []; // Updated by addPlacement, used by wasCollapse().
let cycleMoves = []; // [] - just the path, does not include connecting move.
let stemMoves  = []; // [].
let resolved   = {}; // {}. "Maps, objects, sets, arrays...sheeze."

export function resetGlobals() {
  placements = [];  // Updated by addPlacement, used by wasCollapse().
  cycleMoves = []; // [] - just the path, does not include connecting move.
  stemMoves  = []; // [].
  resolved   = {}; // { 1: 4, 2: 5, 3: 6 }.

  // console.log("resolved", resolved);
}

/*
X1+(1,2); O2+(2,3); X3+(3,6); 
X1+(1,2); O2+(2,1)[12]; X2@X1(1)!X1(1)!O2(2); X3+(4,5); O4+(6
Works in click, but not in load.
X1+(1,2); O2+(2,1); X3+(4,5); O4+(6
*/

/*  let match = GRAMMAR.placement.exec(stateString);
    player:  match[1],
    turn:    Number(match[2]),
    squares: [Number(match[3]), Number(match[4])],
*/

function loadGameHelper(stateString, tokens) {  // Deprecate.
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
  // console.log(tokenString);

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
/*
  X1+(1,2); O2+(2,3); X3+(3,6); 
  X1+(1,2); O2+(2,1)[12]; X2@X1(1)!X1(1)!O2(2); X3+(4,5); O4+(6
  Works in click, but not in load.
  X1+(1,2); O2+(2,1); X3+(4,5); O4+(6
  X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,3)[34|12]; X4@O4(3)!X1(1)!O2(2)!X3(6)!O4(3); X5+(5,4); O6+(4
*/

export function processLoad(tokens) {  // TODO: interface for loadGame().
  console.log("processLoad(tokens)", tokens);
  /* Convert each token into an intent, then pipe down the click interface.
   *
   */

  let player = "";    // Typical contents of the intent object.
  let turn = 0;
  let sq1, sq2 = 0;

  modelSetStateString("");
  for(let token of tokens) {    // X1+(1,2); O2+(2,1)[12]; X2@X1(1)!X1(1)!O2(2); X3+(4,5); O4+(6
    token.str = token.token;
    console.log("token", token);
    let match;
    if(match = GRAMMAR.placementToken.exec(token.str))  console.log("placementToken", match);
    if(match = GRAMMAR.loopToken.exec(token.str))  console.log("loopToken", match);
    if(match = GRAMMAR.collapseToken.exec(token.str))  console.log("collapseToken", match);
  }
  for(let token of tokens) {    // X1+(1,2); O2+(2,1)[12]; X2@X1(1)!X1(1)!O2(2); X3+(4,5); O4+(6
    token.str = token.token;
    let intent = {};
    let match ={};

    switch(token.type) {  // Create intent { type, player, turn, square, sq1, sq2, triggerMove, triggerSquare, clickSq, collapseSq }.
    case "empty":           // "".
      intent = { type: "empty", player: "X", turn: 0 };
      break;
    case "placement":       // "X1+(1,2); ".
      match = GRAMMAR.placementToken.exec(token.str);
      if(match != null) {
        player = match[1];
        turn   = Number(match[2]);
        sq1    = Number(match[3]);
        sq2    = Number(match[4]);
        intent = { type: "placement", player, turn, sq1, sq2 };
      }
      break;
    case "spooky":          // "O4+(6".
      match = GRAMMAR.spookyToken.exec(token.str);
      if(match != null) {
        player = match[1];
        turn   = Number(match[2]);
        sq1    = Number(match[3]);
        intent = { type: "spooky", player, turn: turn, square: sq1 };
      }
      break;
    case "spooky2":         // ",5)".
      match = GRAMMAR.spooky2Token.exec(token.str);
      if(match != null) {
        sq2    = Number(match[1]);
        intent = { type: "spooky2", square: sq2 };
      }
      break;
    case "pureLoop":        // "O2+(2,1)[12]; ".
      match = GRAMMAR.pureLoopToken.exec(token.token);
      if(match != null) {
        player = match[1];
        turn   = Number(match[2]);
        sq1    = Number(match[3]);
        sq2    = Number(match[4]);
        intent = { type: "loop", player, turn, sq1, sq2 };
      }
      break;
    case "stemLoop":
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
      match = GRAMMAR.collapseToken.exec(token.token);
      if(match != null) {
        player  =  match[1];
        turn    = Number(match[2]);
        const triggerMove = match[3];
        const triggerSquare  = Number(match[4]);
        intent = { type: "collapse", player, turn, triggerMove, triggerSquare };
      }
      break;
    case "selfCollapse":
      match = GRAMMAR.selfCollapseToken.exec(token.token);
      if(match != null) {
        const clickSq    = Number(match[1]);
        const collapseSq = Number(match[2]);
        intent = { type: "selfCollapse", clickSq, collapseSq };
      }
      break;
    default:
      // This truncates the load string.
      break;
    }
    console.log("===== ", token.type, token.str, "intent", intent);

    let newStateString = processIntent(modelGetStateString(), intent);

    modelSetStateString(newStateString)
    // console.log(modelGetStateString());
  }

  return;
  }

export function processIntent(currentStateString, intent) { // { player: turn: sq: cell: }
  /* Returns a new, truncated, or unchanged state string.
   * Side effects:
   *    Error string set.
   *    Status string set.
   */
  /* Examples:
    ("", X, 1, 1, 9) => { "spooky", "X1+(1" }
    ("X1+(1", X, 1, 2, 9) => { "placement", "X1+(1,2); " }
   */

  console.log("*************************************");
  console.log("INTENT:", intent);
  console.log("*************************************");

  let newStateString = currentStateString;
  let token = {}; // { type: "placement", str: "X1+(1,2);" optionaOthers: }

  const lastMove = getLastMove(currentStateString); // { type: spooky, str: "X1+(1" }

  console.log("+++ lastMove", lastMove, "currentStateString", currentStateString);
  // console.log("+++ currentStateString", currentStateString);
  // console.log("+++ intent", intent);
  console.log("=====================================");
  const otherPlayer = (intent.player === 'X') ? 'O' : 'X';

  // Establish play context (this logic train is order dependent):
  if(     isGameOver(currentStateString)) {                     // State string has a score.
    console.log("IS GAME OVER", currentStateString, intent);
    modelSetErrorString(ERROR.gameOver());
    modelSetStatusString(STATUS.gameOver());
    } 
  else if(isSquareClassical(currentStateString, intent)) {      // Can't play in collapsed squares.
    console.log("IS SQUARE CLASSICAL", currentStateString, intent);
    modelSetErrorString(ERROR.squareCollapsed());
    modelSetStatusString(STATUS.alreadyCollapsed());
    }
  else if(isBoardEmpty(currentStateString, lastMove, intent)) { // The very first spooky mark, X1.
    console.log("IS BOARD EMPTY", currentStateString, lastMove, intent);
    // spooky intent {player: 'X', turn: 1, square: 1}
    // placement intent {player: 'X', turn: 1, sq1: 1, sq2: 2}
    // First turn is spooky by click, but placement by load.
    let token = { type: "invalid", str: "Intent was neither spooky nor placement."};
    if(intent.square != null)
      token = addSpooky1(currentStateString, intent);
    else if(intent.sq1 != null && intent.sq2 != null) 
      token = addPlacement(currentStateString, lastMove, intent);
    else
      console.log("BAD DAY");
    // console.log("token", token);

    if(token.type === "spooky") {
      newStateString = currentStateString + token.str;
      modelSetStatusString(STATUS.spooky2(intent.player));
      } 
    else if(token.type === "placement") {
      newStateString = currentStateString + token.str + "; ";
      modelSetStatusString(STATUS.placement(otherPlayer));
      } 
    else {              // "invalid".
      modelSetErrorString(ERROR.badStart(intent.player, intent.turn));
      modelSetStatusString(STATUS.spooky(intent.player, intent.turn));
    }
    }
  else if(isReclick(currentStateString, lastMove, intent)) {    // Undo spooky mark.
    console.log("IS RECLICK", currentStateString, lastMove, intent);
    newStateString = stripSpooky(currentStateString);
    modelSetStatusString(STATUS.undoSpooky(intent.player, intent.turn));
    }
  else if(wasLoop(currentStateString, lastMove, intent)) {       // Placement move creates a cyclic entanglement.
    console.log("WAS LOOP", currentStateString, lastMove, intent);
    let token = addCollapse(currentStateString, lastMove, intent);
    if(token.type != "invalid") {
      newStateString = currentStateString + token.str + "; ";   // "X1+(1,2); O2+(2" => "X1+(1,2); O2+(2,1)[12]; "
      modelSetStatusString(STATUS.placement(intent.player, intent.turn));
    } else {
      modelSetErrorString(ERROR.badPlacement(intent.player, intent.turn));
      modelSetStatusString(STATUS.placement(intent.player, intent.turn+1));
    }
    }
  else if(wasPlacement(currentStateString, lastMove, intent)) {  // Placement move; new, extended, or combined entanglements.
    console.log("WAS PLACEMENT", currentStateString, lastMove, intent);
    // spooky intent {player: 'X', turn: 1, square: 1}
    // placement intent {player: 'X', turn: 1, sq1: 1, sq2: 2}
    // First move is spooky by click, but placement by load.
    let token;
    if(intent.sq1 != null && intent.sq2 != null) 
      token = addPlacement(currentStateString, lastMove, intent); // Potential cyclic entanglement.
    if(intent.square != null)
      token = addSpooky1(currentStateString, intent);

    if(token.type === "spooky") {
      newStateString = currentStateString + token.str;
      modelSetStatusString(STATUS.spooky2(intent.player));
      } 
    else if(token.type === "placement") {
      newStateString = currentStateString + token.str + "; ";
      modelSetStatusString(STATUS.placement(otherPlayer));
      } 
    else {              // "invalid".
      modelSetErrorString(ERROR.badStart(intent.player, intent.turn));
      modelSetStatusString(STATUS.spooky(intent.player, intent.turn));
    }
    }
  else if(wasSpooky(currentStateString, lastMove, intent)) {     // Existing spooky mark.
    console.log("WAS SPOOKY", currentStateString, lastMove, intent);
    let token = addSpooky2(currentStateString, lastMove, intent); // Potential cyclic entanglement.
    // console.log("token", token);

    if(token.type === "placement") {
      newStateString = currentStateString + token.str + "; ";  // "X1+(1,2); O2+(2" => "X1+(1,2); O2+(2,3); "
      modelSetStatusString(STATUS.spooky(otherPlayer, intent.turn));
      } 
    else if(token.type === "loop") {
      newStateString = currentStateString + token.str + "; ";  // "X1+(1,2); O2+(2" => "X1+(1,2); O2+(2,1)[12]; "
      modelSetStatusString(STATUS.collapse(otherPlayer, intent.turn));
      } 
    else {
      newStateString = currentStateString;
      modelSetErrorString(ERROR.badStart(intent.player, intent.turn));
      modelSetStatusString(STATUS.placement(intent.player, intent.turn+1));
    }
    }
  else if(isDegenerate(currentStateString, lastMove, intent)) { // Degenerate trigger, compute outcome.
    console.log("IS DEGENERATE", currentStateString, lastMove, intent);
    let token = addDegenerate(currentStateString, intent);
    newStateString = currentStateString + token.str;
    modelSetStatusString(STATUS.selfCollapse(token.score));
    }
  else if(wasCollapse(currentStateString, lastMove, intent)) {   // Collapse trigger, check for outcome.
    console.log("WAS COLLAPSE", currentStateString, lastMove, intent);
    let token = addCollapse(currentStateString, lastMove, intent);
    if(token.type === "collapse") {
      newStateString = currentStateString + token.str + "; ";  // "...; X5+(3,6); O6+(6,3)[56]; " => "...; X5+(3,6); O6+(6,3)[56]; X6@O6(3)!X5(6)!O6(3); "
      modelSetStatusString(STATUS.collapse(intent.player, intent.turn));
    } 
    else if(token.type === "score") {
      newStateString = currentStateString + token.str;  // "...; X5+(3,6); O6+(6,3)[56]; " => "... X5+(3,6); O6+(6,3)[56]; X6@X5(3)!X5(3)!O6(6); {X=1,O=0.5}"
      modelSetStatusString(STATUS.score(intent.player, intent.turn+1));
    }
    else if(token.type === "invalid") {
      modelSetErrorString(ERROR.loop(intent.player, intent.turn));
      modelSetStatusString(STATUS.collapse(intent.player, intent.turn+1));
    }
    else {
      // throw Error("Unknown collapse resolution.");
    }
    }
  else if(isCollapsed(currentStateString, lastMove, intent)) { // The very first spooky mark, X1.
    console.log("WAS COLLAPSED", currentStateString, lastMove, intent);
    // spooky intent {player: 'X', turn: 1, square: 1}
    // placement intent {player: 'X', turn: 1, sq1: 1, sq2: 2}
    // First move is spooky by click, but placement by load.
    let token;
    if(intent.sq1 != null && intent.sq2 != null) 
      token = addPlacement(currentStateString, lastMove, intent);
    if(intent.square != null)
      token = addSpooky1(currentStateString, intent);

    if(token.type === "spooky") {
      newStateString = currentStateString + token.str;
      modelSetStatusString(STATUS.spooky2(intent.player, intent.turn+1));
      } 
    else if(token.type === "placement") {
      newStateString = currentStateString + token.str + "; ";
      modelSetStatusString(STATUS.placement(intent.player, intent.turn+1));
      } 
    else {              // "invalid".
      modelSetErrorString(ERROR.badStart(intent.player, intent.turn));
      modelSetStatusString(STATUS.spooky(intent.player, intent.turn));
    }
    }
  else {
    console.log("*** IS OOPS", currentStateString);
    console.log("*** lastMove", lastMove);
    console.log("*** intent", intent);
    console.log("*** Impossible state in processIntent().");
    // throw Error("Impossible state in processIntent().");
  }

  // Diagnositcs:
    // console.log("State  -", newStateString);
    // console.log("Status -", modelGetStatusString());
    // console.log("Error  -", modelGetErrorString());
    // console.log("------------------------");

  console.log(newStateString);

  return newStateString;
}

function cyclicEntanglement(placements, sq1, sq2) {
  const graph = buildGraph(placements);
  const path = findPath(graph, sq1, sq2);

  if (path !== null) { // Sq1 & sq2 already connected.
    console.log("cyclicEntanglement", placements, sq1, sq2);
    return true;
  }

  return false;
}
// Determination functions (9/9);
function isGameOver(       currentStateString) {                    // {X=1,O=0}
  return (getLastMoveType(currentStateString) === "score");
  }
function isSquareClassical(currentStateString, intent) {            // ... X2@X1(1)!X1(1)!O2(2); ...
  // Test based on stateString via regex (works).
  let match;
  while ((match = GRAMMAR.collapseResolve.exec(currentStateString)) !== null) {
    const collapsedSquare = Number(match[3]);
    if (collapsedSquare === intent.square) return true;
  }
  return false;

  // Test based on map of resolved moves (collapsed squares), (does not work).
  let hit = resolved[intent.square];  // Perhaps intent.square is a number not a string?
  if(hit != null) 
    return true;
  return false;
  }
function isBoardEmpty(     currentStateString, lastMove, intent) {  // lastMove: ""
  let empty = (currentStateString === "");

  return empty;
  }
function wasPlacement(      currentStateString, lastMove, intent) {  // lastMove: "X1+(1,2)"
  let match = GRAMMAR.placementToken.exec(lastMove);
  if(match === null) return false;
  
  let player = match[1];
  let turn   = Number(match[2]);
  let sq1    = Number(match[3]);
  let sq2    = Number(match[4]);

  // Tests:
  if(intent.player === player) return false;
  if(intent.turn != turn + 1) return false;
  if(sq1 === sq2) return false;

  return true; 
  }
function isReclick(        currentStateString, lastMove, intent) {  // lastMove: "X1+(1", intent: ",1)"
  let match = GRAMMAR.spookyToken.exec(lastMove);
  if(match === null) return false;

  let player = match[1];
  let turn   = Number(match[2]);
  let square = Number(match[3]);

  // Tests:
  if(intent.player != player) return false;
  if(intent.turn   != turn) return false;
  if(intent.square != square) return false;

  return true; 
  }
function wasLoop(           currentStateString, lastMove, intent) {  // lastMove: "X1+(1,2); O2+(2", intent: ",1)"
  let match = GRAMMAR.loopToken.exec(lastMove);
  console.log("LoopToken", lastMove, match);
  if(match === null) return false;

  let player = match[1];
  let turn   = Number(match[2]);
  let sq1    = Number(match[3]);
  let sq2    = intent.square;

  return (cyclicEntanglement(placements, sq1, sq2));

  // const graph = buildGraph(placements);
  // const path = findPath(graph, sq1, sq2);

  // if (path !== null) { // Sq1 & sq2 already connected.
  //   return true;
  // }

  // return false; 
  }
function wasSpooky(         currentStateString, lastMove, intent) {  // lastMove: "X1+(1", intent: ",2)"
  let match = GRAMMAR.spookyToken.exec(lastMove);
  if(match === null) return false;

  let player = match[1];
  let turn   = Number(match[2]);
  let square = Number(match[3]);

  // Tests:
  if(intent.player !=  player) return false;
  if(intent.turn   !=  turn)   return false;
  if(intent.square === square) return false;

  return true; 
  }
function isDegenerate(     currentStateString) {                    // "X9+(n,n); O9@X9(n)!X9(n); "
  return false;
  
  let degenerateLastMove = false;

  const state = analyzeStateString(currentStateString);
  if(state.counts.collapsedMoves === 8)
    degenerateLastMove = true;

  return degenerateLastMove;
  }
function wasCollapse(       currentStateString, lastMove, intent) {  // lastMove: "O2+(2,1)[12]; "
  return false;

  let match = GRAMMAR.placementToken.exec(lastMove);
  console.log("=== wasCollapse() match", match);
  if(match === null) return false;

  let loopMoves = match[1];
  let stemMoves = match[2];

  const state = analyzeStateString(currentStateString);

  return state.progress.collapse; 
  }
function isCollapsed(      currentStateString, lastMove, intent) {  // "X2@X1(1)!X1(1)!O2(2); "
  let match = GRAMMAR.collapseToken.exec(lastMove);
  console.log("isCollapsed - match", match, lastMove);
  if(match === null) return false;

  return true;
}

// Collapse helpers:
function computeResolvedSquares(lastMove, cellSq) {   // "O3@O2(2)!X1(1)!O2(2)!X3(3); "
  const match = GRAMMAR.loopToken.exec(lastMove);
  const player = match[1];
  const turn = match[2];
  const otherPlayer = (player === 'X') ? 'O' : 'X';

  if (cellSq != null) {
    let triggerSquare = cellSq.square;
    let resolveds = computeCollapseResolution(placements, cycleMoves, stemMoves, cellSq.cell, triggerSquare);
    for (let [move, square] of Object.entries(resolveds)) {
      resolved[move] = square;
    }

    let trigger = (cellSq.cell%2) ? 'X': 'O';   // "O3@O2(2)".
    let triggerString = `${otherPlayer}${turn}@${trigger}${cellSq.cell}(${cellSq.square})`;

    let resString = "";                         // "!X1(1)!O2(2)!X3(3)"
    for (const key in resolveds) {
      let player = (key%2) ? 'X': 'O';
      let square = resolveds[key];
      resString += `!${player}${key}(${square})`;
    }

    return `${triggerString}${resString}`;      // "O3@O2(2)!X1(1)!O2(2)!X3(3); "
  }
  }
function selfCollapseLastMove(intent) {               // "X9+(n,n); O9@X9(n)!X9(n); "
  let n = intent.square;
  let selfCollapseString = `X9+(${n},${n}); O9@X9(${n})!X9(${n})`;
  resolved[9] = n;

  return selfCollapseString;
}

// Change state functions (7/7):
function addSpooky1(currentStateString, intent) {             // "X1+(1,2); " => "X1+(1,2); O2+(2"
  let str = `${intent.player}${intent.turn}+(${intent.square}`;
  return { type: "spooky", str: str };
  }
function stripSpooky(currentStateString) {                    // "X1+(1,2); O2+(2"  => "X1+(1,2); "
  let newStateString = subSpookyMove(currentStateString);
  return newStateString;
  }
function addSpooky2(currentStateString, lastMove, intent) {   // "X1+(1,2); O2+(2"  => "X1+(1,2); O2+(2,3); "
  let type = "invalid";
  let str = "";

  let match = GRAMMAR.spookyToken.exec(lastMove);
  if(match === null) {
    console.log("match was null", match);
    return { type: "invalid", str: "Previous move was not a valid spooky mark." }; 
  }
  let player = match[1];
  let turn = Number(match[2]);
  let sq1 = Number(match[3]);
  let sq2 = intent.square;

  const graph = buildGraph(placements);
  const path = findPath(graph, sq1, sq2);

  if(path != null) {  // Build loop string with stems (if any).
    cycleMoves = extractCycle(path, placements, turn); // [] - just the path, does not include connecting move.
    stemMoves  = extractStems(graph, path, placements, cycleMoves); // [].

    const cycleStr = cycleMoves.join('');
    const stemsStr = stemMoves.length > 0 ? `|${stemMoves.join('')}` : '';
    const loopStr = `[${cycleStr}${stemsStr}]`;
    type = "loop";
    str = `,${sq2})${loopStr}`;
    } 
  else {              // Build spooky2 mark to complete placement move.
    type = "placement";
    str = `,${sq2})`;
  }

  placements.push({ // Add connecting move.
    move: turn,
    player: player,
    squares: [sq1, sq2]
  });

  return { type: type, str: str }; 
  }
function addLoop(currentStateString, lastMove, intent) {      // "X1+(1,2); O2+(2"  => "X1+(1,2); O2+(2,1)[12]; "
  let player = "";
  let turn = 0;
  let sq1 = 0;
  let sq2 = 0;

  let spooky = GRAMMAR.spooky.exec(lastMove);
  let placement = GRAMMAR.placement.exec(lastMove);

  let str = "";
  if(spooky != null) {
    player = spooky[1];
    turn   = Number(spooky[2]);
    sq1    = Number(spooky[3]);
    sq2    = intent.square;
    str = `,${sq2})`;
    }
  else if(placement != null) {
    player = placement[1];
    turn   = Number(placement[2]);
    sq1    = Number(placement[3]);
    sq2    = Number(placement[4]);
    str = `${lastMove}`;
  } 
  else {
    console.log("WARNGING");
  }

  const graph = buildGraph(placements);
  const path = findPath(graph, sq1, sq2);

  cycleMoves = extractCycle(path, placements, turn); // [] - just the path, does not include connecting move.
  stemMoves  = extractStems(graph, path, placements, cycleMoves); // [].

  // Build loop string with stems (if any).
  const cycleStr = cycleMoves.join('');
  const stemsStr = stemMoves.length > 0 ? `|${stemMoves.join('')}` : '';
  const loopStr = `[${cycleStr}${stemsStr}]`;

  placements.push({ // Add connecting move.
    move: turn,
    player: player,
    squares: [sq1, sq2]
  });

  str += `${loopStr}`;

  return { type: "loop", str: str }; 
  }
function addPlacement(currentStateString, lastMove, intent) { // "X1+(1,2); O2+(2"  => "X1+(1,2); O2+(2,3); "
  let placeStr = `${intent.player}${intent.turn}+(${intent.sq1},${intent.sq2})`;
  let loopStr = "";

  const graph = buildGraph(placements);
  const path = findPath(graph, intent.sq1, intent.sq2);

  if(path != null) {  // Build loop string with stems (if any).
    cycleMoves = extractCycle(path, placements, intent.turn); // [] - just the path, does not include connecting move.
    stemMoves  = extractStems(graph, path, placements, cycleMoves); // [].

    const cycleStr = cycleMoves.join('');
    const stemsStr = stemMoves.length > 0 ? `|${stemMoves.join('')}` : '';
    loopStr = `[${cycleStr}${stemsStr}]`;
    // str += `${loopStr}`;
  }

  placements.push({ // Add connecting move.
    move: intent.turn,
    player: intent.player,
    squares: [intent.sq1, intent.sq2]
  });

  if(loopStr === "") {
    let placementString = placeStr;
    return { type: "placement", str: placementString }; 
  } else {
    let loopString = `${placeStr}${loopStr}`;
    return { type: "loop", str: loopString }; 
  }
  }
function addCollapse(currentStateString, lastMove, intent) {  // "X3+(3,2)[23|1]; " => "X3+(3,2)[23|1]; O3@O2(2)!X1(1)!O2(2)!X3(3); "
  // Diagnostics:
    // console.log("addCollapse");
    // console.log("lastMove", lastMove);
    // console.log("intent", intent);
    // // console.log("cellSq", cellSq);
    // console.log("resolved", resolved);
    // // console.log("outcome", outcome);

  let token = {}; // { type: "invalid"|"collapse"|"score", str: "", outcome: outcome }
  
  const oldIntent = { squareNum: intent.square, cellNum: intent.cell };
  const cellSq = cellInLoop(oldIntent, placements, cycleMoves);

  console.log("cellSq", cellSq);
  if(cellSq === null) {   // Didn't collapse cyclic entanglement (click not on a purple spooky mark).
    token = { type: "invalid", str: "" };
    return token;
  }

  const collapseString = computeResolvedSquares(lastMove, cellSq);  // Side effect, updates resolved map.
  console.log("resolved", resolved);
  console.log("placements", placements);
  
  const newStateStr = `${currentStateString}${collapseString}`;
  const outcome = evaluateGame(newStateStr); // { over: score: {X: O:} desc: }

  if(!outcome.over) {     // Game not over yet.
    token = { type: "collapse", str: `${collapseString}` };
    return token;
    }
  else {                  // Game over, compute score.
    const scoreString = `{X=${outcome.score.X},O=${outcome.score.O}}`;
    token = { type: "score", str: `${collapseString}; ${scoreString}`, outcome: outcome };
    return token;
  }

  }
function addDegenerate(currentStateString, intent) {          // "X9+(n,n); O9@X9(n)!X9(n); "
  let token = {};   // Map {type: str: outcome: }.

  const collapseString = selfCollapseLastMove(intent);
  const newStateStr = `${currentStateString}${collapseString}`;

  const outcome = evaluateGame(newStateStr);
  const scoreString = `{X=${outcome.score.X},O=${outcome.score.O}}`;

  token = { type: "score", 
            str: `${collapseString}; ${scoreString}`, 
            score: `${scoreString}`, 
            outcome: outcome };

  return token;
}

/* FLOW
 * newStateString = processIntent(currentStateString, intent);  <- processClick enters here.
 * if(errorString != "") return;
 * 
 * tokens = tokenize(newStateString);                           <- loadGame enters here.
 * ...
 */

