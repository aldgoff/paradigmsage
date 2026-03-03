// ./assets/qt3/js/model/tokens.js

import { GRAMMAR } from "../model/grammar.js";

export function tokenize(stateString) {
  const trimmed = stateString.trim();

  const tokens = [];
  let working = trimmed;

  // --- Deal with the empty string edge case.
  if (trimmed === "") {
    tokens.push({ type: "empty", token: "" });
    console.log("tokens", tokens);
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

  // console.log("scoreToken ", scoreToken);

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
      } else if (GRAMMAR.loopToken.test(fragment)) {         type = "loop"; // Shadowed, can't happen.
      } else if (GRAMMAR.selfCollapseToken.test(fragment)) { type = "selfCollapse";
      } else if (GRAMMAR.collapseToken.test(fragment)) {     type = "collapse";
      } else if (GRAMMAR.scoreToken.test(fragment)) {        type = "score";  // Path taken only on multiple tokens.
      } else {                                               type = "invalid";
      }

      tokens.push({ type, token: fragment });

      // if(type === "invalid") {
      //   return tokens;
      // }
    }
  }

  // --- Append score last (if present).
  if (scoreToken.type != "missing") {
    tokens.push(scoreToken);
    // tokens.push(scoreToken);
  }

  console.log("tokens", tokens);

  // --- Return list of token types and strings.
  return tokens;
}
