// ./assets/qt3/js/model/tokens.js

import { GRAMMAR } from "../model/grammar.js";
import {ERROR,
        STATUS,
} from "../model/statusMsgs.js";

let prevPlayer = "O";
let prevTurn   = 0;

export function tokenize(stateString) {   // Returns: [{ type: "spooky", token: "" }, ...];
  prevPlayer = "O";
  prevTurn   = 0;

  const trimmed = stateString.trim();

  const tokens = [];
  let working = trimmed;

  // --- Deal with the empty string edge case.
  if (trimmed === "") {
    tokens.push({ type: "empty", token: "" });
    return tokens;
  }
/* Test string for move order.
X1+(1,2); O2+(2,1)[12]; X2@X1(1)!X1(1)!O2(2); X3+(4,5); O4+(5,4)[34]; X4@X3(4)!X3(4)!O4(5); X5+(7,8); O6+(8,7)[56]; X6@X5(7)!X5(7)!O6(8); {X=1,O=0.5}
*/
  // --- Parse move fragments.
  if (working !== "") {
    const parts = working.split(";");

    let prevPlayer = "O";
    let prevTurn   = 0;

    for (let raw of parts) {
      let fragment = raw.trim();
      if (!fragment) continue;

      let type = null;
      let match = [];

      if(false) { // Order dependence trumps logical sequence.
      } else if (GRAMMAR.spookyToken.test(fragment)) {       type = "spooky";
      } else if (GRAMMAR.degenerateToken.test(fragment)) {   type = "degenerate";
      } else if (GRAMMAR.pureLoopToken.test(fragment)) {
        if(isSequential(fragment))                           type = "pureLoop";
        else                                                 type = "invalid";
      } else if (GRAMMAR.stemLoopToken.test(fragment)) {
        if(isSequential(fragment))                           type = "stemLoop";
        else                                                 type = "invalid";
      } else if (GRAMMAR.loopToken.test(fragment)) {
        if(isSequential(fragment))                           type = "loop"; // Shadowed by previous pair of blocks.
        else                                                 type = "invalid";
      } else if (GRAMMAR.placementToken.test(fragment)) {
        if(isSequential(fragment))                           type = "placement";
        else                                                 type = "invalid";
      } else if (GRAMMAR.selfCollapseToken.test(fragment)) { type = "selfCollapse";
      } else if (GRAMMAR.collapseToken.test(fragment)) {     type = "collapse";
      } else if (GRAMMAR.scoreToken.test(fragment)) {        type = "score";  // Path taken only on multiple tokens.
      } else {                                               type = "invalid";
      }

      tokens.push({ type, token: fragment });
      if(type === "invalid") {
        break;
      } 
    }
  }

  return tokens;   // Returns: [{ type: "spooky", token: "" }];
}

function isSequential(fragment) {
  let sequential = true;
  let match = [];
  let player = "";
  let turn   = 0;

  match = GRAMMAR.placementToken.exec(fragment);
  if(match != null) {
    player = match[1];
    turn   = Number(match[2]);
  }
  match = GRAMMAR.pureLoopToken.exec(fragment);
  if(match != null) {
    player = match[1];
    turn   = Number(match[2]);
  }
  match = GRAMMAR.stemLoopToken.exec(fragment);
  if(match != null) {
    player = match[1];
    turn   = Number(match[2]);
  }
  // match = GRAMMAR.loopToken.exec(fragment);
  // if(match != null) {
  //   player = match[1];
  //   turn   = Number(match[2]);
  // }

  if((player === prevPlayer)
  || (turn != prevTurn + 1)) {
    sequential = false;
  }
  prevPlayer = player;
  prevTurn   = turn;

  return sequential;
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

