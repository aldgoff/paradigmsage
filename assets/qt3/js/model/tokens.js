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

let placements = []; // Updated by addPlacement, used by isCollapse().
let cycleMoves = []; // [] - just the path, does not include connecting move.
let stemMoves  = []; // [].
let resolved   = {}; // {}. "Maps, objects, sets, arrays...sheeze."

export function resetGlobals() {
  placements = [];  // Updated by addPlacement, used by isCollapse().
  cycleMoves = []; // [] - just the path, does not include connecting move.
  stemMoves  = []; // [].
  resolved   = {}; // { 1: 4, 2: 5, 3: 6 }.

  console.log("resolved", resolved);
}

export function intentFromToken(token) {  // TODO: interface for loagGame().
  let intent;

  return intent;
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
  let newStateString = currentStateString;
  let token = {}; // { type: "placement", str: "X1+(1,2);" optionaOthers: }

  if(intent === null) return currentStateString;

  const lastMove = getLastMove(currentStateString); // { type: spooky, str: "X1+(1" }
  console.log("lastMove", lastMove, "intent", intent);
  console.log("=====================================");
  const otherPlayer = (intent.player === 'X') ? 'O' : 'X';

  // Establish play context (this logic train is order dependent):
  if(     isGameOver(currentStateString)) {                     // State string has a score.
    console.log("IS GAME OVER", currentStateString, lastMove, intent);
    modelSetErrorString(ERROR.gameOver());
    modelSetStatusString(STATUS.gameOver());
    } 
  else if(isSquareClassical(currentStateString, intent)) {      // Can't play in collapsed squares.
    console.log("IS SQUARE CLASSICAL", currentStateString, lastMove, intent);
    modelSetErrorString(ERROR.squareCollapsed());
    modelSetStatusString(STATUS.alreadyCollapsed());
    }
  else if(isBoardEmpty(currentStateString, lastMove, intent)) { // The very first spooky mark, X1.
    console.log("IS BOARD EMPTY", currentStateString, lastMove, intent);
    let token = addSpooky(currentStateString, intent);
    console.log("token", token);
    if(token.type != "invalid") {
      newStateString = currentStateString + token.str;
      modelSetStatusString(STATUS.spooky2(intent.player, intent.turn+1));
    } else {
      modelSetErrorString(ERROR.badStart(intent.player, intent.turn));
      modelSetStatusString(STATUS.spooky(intent.player, intent.turn));
    }
    }
  else if(isReclick(currentStateString, lastMove, intent)) {    // Undo spooky mark.
    console.log("IS RECLICK", currentStateString, lastMove, intent);
    newStateString = stripSpooky(currentStateString);
    modelSetStatusString(STATUS.undoSpooky(intent.player, intent.turn));
    }
  else if(isLoop(currentStateString, lastMove, intent)) {       // Placement move creates a cyclic entanglement.
    console.log("IS LOOP", currentStateString, lastMove, intent);
    let token = addLoop(currentStateString, lastMove, intent);
    if(token.type != "invalid") {
      newStateString = currentStateString + token.str + "; ";   // "X1+(1,2); O2+(2" => "X1+(1,2); O2+(2,1)[12]; "
      modelSetStatusString(STATUS.collapse(intent.player, intent.turn));
    } else {
      modelSetErrorString(ERROR.badPlacement(intent.player, intent.turn));
      modelSetStatusString(STATUS.placement(intent.player, intent.turn+1));
    }
    }
  else if(isPlacement(currentStateString, lastMove, intent)) {  // Placement move; new, extended, or combined entanglements.
    console.log("IS PLACEMENT", currentStateString, lastMove, intent);
    let token = addSpooky(currentStateString, intent);
    console.log("isPlacement() token", token);
    if(token.type != "invalid") {
      // newStateString = stripSpooky(currentStateString) + token.str + "; ";  // "X1+(1,2); O2+(2" => "X1+(1,2); O2+(2,1)[12]; "
      newStateString = currentStateString + token.str;
      modelSetStatusString(STATUS.spooky2(intent.player, intent.turn));
    } else {
      modelSetErrorString(ERROR.badPlacement(intent.player, intent.turn));
      modelSetStatusString(STATUS.placement(intent.player, intent.turn+1));
    }
    }
  else if(isSpooky(currentStateString, lastMove, intent)) {     // Existing spooky mark.
    console.log("IS SPOOKY", currentStateString, lastMove, intent);
    let token = addPlacement(currentStateString, lastMove, intent);
    console.log("isSpooky() token", token);
    if(token.type != "invalid") {
      newStateString = currentStateString + token.str + "; ";  // "X1+(1,2); O2+(2" => "X1+(1,2); O2+(2,3); "
      modelSetStatusString(STATUS.spooky(otherPlayer, intent.turn));
    } else {
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
  else if(isCollapse(currentStateString, lastMove, intent)) {   // Collapse trigger, check for outcome.
    console.log("IS COLLAPSE", currentStateString, lastMove, intent);
    let token = addCollapse(currentStateString, lastMove, intent);
    console.log("token", token);
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
      throw Error("Unknown collapse resolution.");
    }
    }
  else {
    console.log("IS OOPS", currentStateString, lastMove, intent);
    console.log("*** Impossible state in processIntent().");
    // throw Error("Impossible state in processIntent().");
  }

  // Diagnositcs:
  console.log("newStateString         -", newStateString);
  console.log("modelGetStatusString() -", modelGetStatusString());
  console.log("modelGetErrorString()  -", modelGetErrorString());
  console.log("------------------------");

  return newStateString;
}

// Determination functions (9/9);
function isGameOver(       currentStateString) {                    // {X=1, O=0}
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
  let empty = (lastMove === "");

  return empty;
  }
function isPlacement(      currentStateString, lastMove, intent) {  // lastMove: "X1+(1,2)"
  let placement = GRAMMAR.placement.exec(lastMove);
  if(placement === null) return false;
  
  let player = placement[1];
  let turn   = Number(placement[2]);
  let sq1    = Number(placement[3]);
  let sq2    = Number(placement[4]);

  // Tests:
  if(intent.player === player) return false;
  if(intent.turn != turn + 1) return false;
  if(sq1 === sq2) return false;

  return true; 
  }
function isReclick(        currentStateString, lastMove, intent) {  // lastMove: "X1+(1", intent: ",1)"
  let spooky = GRAMMAR.spooky.exec(lastMove);
  if(spooky === null) return false;

  let player = spooky[1];
  let turn   = Number(spooky[2]);
  let square = Number(spooky[3]);

  // Tests:
  if(intent.player != player) return false;
  if(intent.turn   != turn) return false;
  if(intent.square != square) return false;

  return true; 
  }
function isLoop(           currentStateString, lastMove, intent) {  // lastMove: "X1+(1,2); O2+(2", intent: ",1)"
  let spooky = GRAMMAR.spooky.exec(lastMove);
  if(spooky === null) return false;
  console.log("isLoop");

  let player = spooky[1];
  let turn   = Number(spooky[2]);
  let sq1    = Number(spooky[3]);
  let sq2    = intent.square;

  const graph = buildGraph(placements);
  const path = findPath(graph, sq1, sq2);

  if (path !== null) { // Sq1 & sq2 already connected.
    return true;
  }

  return false; 
  }
function isSpooky(         currentStateString, lastMove, intent) {  // lastMove: "X1+(1", intent: ",2)"
  let spooky = GRAMMAR.spooky.exec(lastMove);
  if(spooky === null) return false;
  console.log("spooky", spooky);

  let player = spooky[1];
  let turn   = Number(spooky[2]);
  let square = Number(spooky[3]);

  // Tests:
  if(intent.player != player) return false;
  if(intent.turn   != turn) return false;
  if(intent.square === square) return false;

  return true; 
  }
function isDegenerate(     currentStateString) {                    // "X9+(n,n); O9@X9(n)!X9(n); "
  let degenerateLastMove = false;

  const state = analyzeStateString(currentStateString);
  if(state.counts.collapsedMoves === 8)
    degenerateLastMove = true;

  return degenerateLastMove;
  }
function isCollapse(       currentStateString, lastMove, intent) {  // lastMove: "O2+(2,1)[12]; "
  let loop = GRAMMAR.loop.exec(lastMove);
  if(loop === null) return false;
  console.log("isCollapse", loop);

  let loopMoves = loop[1];
  let stemMoves = loop[2];

  const state = analyzeStateString(currentStateString);
  console.log("state", state);

  return state.progress.collapse; 
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

// Change state functions (5/7):
function addSpooky(currentStateString, intent) {              // "X1+(1,2); " => "X1+(1,2); O2+(2"
  let str = `${intent.player}${intent.turn}+(${intent.square}`;
  return { type: "spooky", str: str };
  }
function stripSpooky(currentStateString) {                    // "X1+(1,2); O2+(2"  => "X1+(1,2); "
  let newStateString = subSpookyMove(currentStateString);
  return newStateString;
  }
function addLoop(currentStateString, lastMove, intent) {      // "X1+(1,2); O2+(2"  => "X1+(1,2); O2+(2,1)[12]; "
  let match = GRAMMAR.spooky.exec(lastMove);
  console.log("addLoop", match);

  let player = match[1];
  let turn = Number(match[2]);
  let sq1 = Number(match[3]);
  let sq2 = intent.square;

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
  console.log("### placements", placements);

  let str = `,${sq2})${loopStr}`;

  return { type: "loop", str: str }; 
  }
function addPlacement(currentStateString, lastMove, intent) { // "X1+(1,2); O2+(2"  => "X1+(1,2); O2+(2,3); "
  let match = GRAMMAR.spooky.exec(lastMove);
  let player = match[1];
  let turn = Number(match[2]);
  let sq1 = Number(match[3]);
  let sq2 = intent.square;

  placements.push({ // Add connecting move.
    move: turn,
    player: player,
    squares: [sq1, sq2]
  });
  console.log("### placements", placements);

  let str = `,${sq2})`;

  return { type: "placement", str: str }; 
  }
function addCollapse(currentStateString, lastMove, intent) {  // "X3+(3,2)[23|1]; " => "X3+(3,2)[23|1]; O3@O2(2)!X1(1)!O2(2)!X3(3); "
  // Diagnostics:
    console.log("addCollapse");
    console.log("lastMove", lastMove);
    console.log("intent", intent);
    // console.log("cellSq", cellSq);
    console.log("resolved", resolved);
    // console.log("outcome", outcome);

  let token = {}; // { type: "invalid"|"collapse"|"score", str: "", outcome: outcome }
  
  const oldIntent = { squareNum: intent.square, cellNum: intent.cell };
  const cellSq = cellInLoop(oldIntent, placements, cycleMoves);

  if(cellSq === null) {   // Didn't collapse cyclic entanglement (click not on a purple spooky mark).
    token = { type: "invalid", str: "" };
    return token;
  }

  const collapseString = computeResolvedSquares(lastMove, cellSq);  // Side effect, updates resolved map.
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

