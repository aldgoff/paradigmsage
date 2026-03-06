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

export function tokensToString(tokens) {  // return tokenString.
  let tokenString = "";

  for( const token of tokens) {   // tokens: [{ type: "spooky", token: "" }];
    if(token.type != "invalid") {
      if(     token.type === "score")  tokenString += token.token;
      else if(token.type === "spooky") tokenString += token.token;
      else                             tokenString += token.token + "; ";
    }
    else {
      tokenString += token.token + "; ";
      break;
    }
  }

  return tokenString; // "X9+(2,3); ", "{X=2.0, O=0.0}", "X9+(2", etc.
}

