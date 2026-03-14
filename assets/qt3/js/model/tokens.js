// ./assets/qt3/js/model/tokens.js

import { GRAMMAR } from "../model/grammar.js";

export function tokenize(stateString) {   // Returns: [{ type: "spooky", token: "" }, ...];
  const trimmed = stateString.trim();

  const tokens = [];
  let working = trimmed;

  // --- Deal with the empty string edge case.
  if (trimmed === "") {
    tokens.push({ type: "empty", token: "" });
    return tokens;
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

