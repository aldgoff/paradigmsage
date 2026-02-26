// ./assets/qt3/js/model/parse.js

//--- AI prompts ---//
/* Specs
  Draft a method that given a state string will return an array of objects { type, string } where
  type is "spooky|placement|loop|collapse|degenerate|score" and
  string is a move element "X1+(1,2);". 

  Some examples: Given...

  "X1+(1,2); O2+(2,3); X3+(4,5); O4+(6"
    return [
      {type: "placement", change: "X1+(1,2);"}, 
      {type: "placement", change: "O2+(2,3);"}, 
      {type: "placement", change: "X3+(4,5);"}, 
      {type: "spooky",    change: "O4+(6"}, 
    ]

  "X1+(1,2); O2+(1,2)[12]; X2@X1(1)!X1(1)!O2(2); X3+(4,5); O4+(4,5)[34]; X4@X3(4)!X3(4)!O4(5); X5+(7,8); O6+(7,8)[56]; X6@X5(7)!X5(7)!O6(8); {X-1, O-0.5}"
    return [
      {type: "placement", change: "X1+(1,2);"}, 
      {type: "loop",      change: "O2+(1,2)[12];"}, 
      {type: "collapse",  change: "X2@X1(1)!X1(1)!O2(2);"}, 
      {type: "placement", change: "X3+(4,5);"}, 
      {type: "loop",      change: "O4+(4,5)[34]"}, 
      {type: "collapse",  change: "X4@X3(4)!X3(4)!O4(5);"}, 
      {type: "placement", change: "X5+(7,8);"}, 
      {type: "loop",      change: "O6+(7,8)[56];"}, 
      {type: "collapse",  change: "X6@X5(7)!X5(7)!O6(8);"}, 
      {type: "score",     change: "{X-1, O-0.5}"} 
    ]

  "X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(8,9); O6+(7,8); X7+(4,7); O8+(1,4)[18765432]; X8@X1(1)!X1(1)!O2(2)!X3(3)!O4(6)!X5(9)!O6(8)!X7(7)!O8(4); X9+(5,5); O9@X9(5)!X9(5); {X-2, O-0}"
    return [
      {type: "placement", change: "X1+(1,2);"},
      {type: "placement", change: "O2+(2,3);"},
      {type: "placement", change: "X3+(3,6);"},
      {type: "placement", change: "O4+(6,9);"},
      {type: "placement", change: "X5+(8,9);"},
      {type: "placement", change: "O6+(7,8);"},
      {type: "placement", change: "X7+(4,7);"},
      {type: "loop",      change: "O8+(1,4)[18765432];"},
      {type: "collapse",  change: "X8@X1(1)!X1(1)!O2(2)!X3(3)!O4(6)!X5(9)!O6(8)!X7(7)!O8(4);"},
      {type: "degenerate",change: "X9+(5,5);"},
      {type: "collapse",  change: "O9@X9(5)!X9(5);"},
      {type: "score",     change: "{X-2, O-0}"},
    ] 
*/

export function parseStateTranscript(stateString) { // Returns: [ {type, change}, {type, change}... ]
  const result = [];  // type: "spooky|placement|loop|collapse|degenerate|score".

  if (!stateString || typeof stateString !== "string") {
    return result;
  }

  const trimmed = stateString.trim();

  // ---------------------------------------------------
  // 1. Extract score block (must be final if present)
  // ---------------------------------------------------
  let mainPart = trimmed;
  const scoreMatch = trimmed.match(/\{[^}]+\}$/);

  if (scoreMatch) {
    mainPart = trimmed.slice(0, scoreMatch.index).trim();
  }

  // ---------------------------------------------------
  // 2. Split by semicolons, preserving incomplete tail
  // ---------------------------------------------------
  const rawSegments = mainPart.split(";");

  rawSegments.forEach((seg, index) => {
    const s = seg.trim();
    if (!s) return;

    const hasSemicolon = index < rawSegments.length - 1 || mainPart.endsWith(";");
    const change = hasSemicolon ? s + ";" : s;

    // -----------------------------------------------
    // Collapse
    // -----------------------------------------------
    if (s.includes("@")) {
      result.push({ type: "collapse", change });
      return;
    }

    // -----------------------------------------------
    // Placement-family ( + )
    // -----------------------------------------------
    if (s.includes("+")) {
      // Incomplete placement (spooky)
      if (!s.includes(")") || !s.includes("(")) {
        result.push({ type: "spooky", change });
        return;
      }

      // Loop (has bracket annotation)
      if (/\[[^\]]+\]/.test(s)) {
        result.push({ type: "loop", change });
        return;
      }

      // Extract squares for degenerate check
      const sqMatch = s.match(/\((\d+),(\d+)\)/);
      if (sqMatch) {
        const sq1 = Number(sqMatch[1]);
        const sq2 = Number(sqMatch[2]);

        if (sq1 === sq2) {
          result.push({ type: "degenerate", change });
          return;
        }
      }

      // Normal placement
      result.push({ type: "placement", change });
      return;
    }
  });

  // ---------------------------------------------------
  // 3. Score (always last if present)
  // ---------------------------------------------------
  if (scoreMatch) {
    result.push({
      type: "score",
      change: scoreMatch[0]
    });
  }

  return result;
}

export function parseSpookyMove(moveString) {     // Given "X1+(3:"                return { player, turn:, sq1, null }
  // Given "X1+(3" return { player, turn, sq1, sq2: null }

  if (!moveString || typeof moveString !== "string") {
    throw new Error("Invalid spooky move");
  }

  const trimmed = moveString.trim();

  // Remove trailing semicolon if present
  const noSemicolon = trimmed.endsWith(";")
    ? trimmed.slice(0, -1)
    : trimmed;

  // Remove optional loop annotation if partially present
  const core = noSemicolon.replace(/\[[^\]]*$/, "");

  // Match incomplete placement pattern
  const match = core.match(/^([XO])(\d+)\+\((\d+)$/);

  if (!match) {
    throw new Error(`Malformed spooky move: ${moveString}`);
  }

  const [, player, turnStr, sq1Str] = match;

  return {
    player,
    turn: Number(turnStr),
    sq1: Number(sq1Str),
    sq2: null
  };

  /* Regex Breakdown.
    ^([XO])(\d+)\+\((\d+)$
   */
  }

export function parsePlacementMove(moveString) {  // Given "X1+(3,5):"             return { player, turn:, sq1, sq2 }
  if (!moveString || typeof moveString !== "string") {
    throw new Error("Invalid placement move");
  }

  const trimmed = moveString.trim();

  // Remove trailing semicolon if present
  const noSemicolon = trimmed.endsWith(";")
    ? trimmed.slice(0, -1)
    : trimmed;

  // Remove optional loop annotation [....]
  const core = noSemicolon.replace(/\[[^\]]+\]$/, "");

  // Match placement pattern
  const match = core.match(/^([XO])(\d+)\+\((\d+),(\d+)\)$/);

  if (!match) {
    throw new Error(`Malformed placement move: ${moveString}`);
  }

  const [, player, turnStr, sq1Str, sq2Str] = match;

  return {
    player,
    turn: Number(turnStr),
    sq1: Number(sq1Str),
    sq2: Number(sq2Str)
  };

  /* Regex Breakdown.
    ^
      ([XO])        → Player
      (\d+)         → Turn
      \+            → "+"
      \(            → "("
        (\d+)       → Square 1
        ,           → ","
        (\d+)       → Square 2
      \)
    $
   */
  }

export function parseLoopMove(moveString) {       // Given "O6+(3,7)[165|432];"    return { player, turn:, sq1, sq2, cycle, stems }
  if (!moveString || typeof moveString !== "string") {
    throw new Error("Invalid loop move");
  }

  const trimmed = moveString.trim();

  // Remove trailing semicolon if present
  const noSemicolon = trimmed.endsWith(";")
    ? trimmed.slice(0, -1)
    : trimmed;

  // Pattern:
  // Player + turn + +(sq1,sq2)[cycle(|stems)?]
  const match = noSemicolon.match(
    /^([XO])(\d+)\+\((\d+),(\d+)\)\[([^|\]]+)(?:\|([^\]]+))?\]$/
  );

  if (!match) {
    throw new Error(`Malformed loop move: ${moveString}`);
  }

  const [
    ,
    player,
    turnStr,
    sq1Str,
    sq2Str,
    cycle,
    stems
  ] = match;

  return {
    player,
    turn: Number(turnStr),
    sq1: Number(sq1Str),
    sq2: Number(sq2Str),
    cycle,
    stems: stems || null
  };

  /* Regex Breakdown.
    \[                     → opening bracket
    ([^|\]]+)              → cycle (required)
    (?:\|([^\]]+))?        → optional "|stems"
    \]                     → closing bracket
   */
  }

export function parseCollapseMove(moveString) {   // Given "X2@X1(1)!X1(1)!O2(2);" return { player, turn, triggerMove, triggerSquare, sequence }
  if (!moveString || typeof moveString !== "string") {
    throw new Error("Invalid collapse move");
  }

  const trimmed = moveString.trim();

  // Remove trailing semicolon
  const noSemicolon = trimmed.endsWith(";")
    ? trimmed.slice(0, -1)
    : trimmed;

  // Pattern:
  // InitiatorPlayer InitiatorTurn @ TriggerMove(Square) RestOfSequence
  const match = noSemicolon.match(
    /^([XO])(\d+)@([XO]\d+)\((\d+)\)(!.*)?$/
  );

  if (!match) {
    throw new Error(`Malformed collapse move: ${moveString}`);
  }

  const [
    ,
    player,
    turnStr,
    triggerMove,
    triggerSquareStr,
    remainder
  ] = match;

  return {
    player,
    turn: Number(turnStr),
    triggerMove,
    triggerSquare: Number(triggerSquareStr),
    sequence: remainder || ""
  };

  /* Regex Breakdown.
    ^
    ([XO])(\d+)        → collapse initiator (player + turn)
    @
    ([XO]\d+)          → first resolved move (triggerMove)
    \((\d+)\)          → trigger square
    (!.*)?             → remainder of collapse chain (optional)
    $
   */
  }

export function parseDegenerateMove(moveString) { // Given "X9+(5,5);"             return { player, turn, sq }
  if (!moveString || typeof moveString !== "string") {
    throw new Error("Invalid degenerate move");
  }

  const trimmed = moveString.trim();

  // Remove trailing semicolon if present
  const noSemicolon = trimmed.endsWith(";")
    ? trimmed.slice(0, -1)
    : trimmed;

  // Remove optional loop annotation [....]
  const core = noSemicolon.replace(/\[[^\]]+\]$/, "");

  // Match degenerate pattern (same square twice)
  const match = core.match(/^([XO])(\d+)\+\((\d+),(\d+)\)$/);

  if (!match) {
    throw new Error(`Malformed degenerate move: ${moveString}`);
  }

  const [, player, turnStr, sq1Str, sq2Str] = match;

  const sq1 = Number(sq1Str);
  const sq2 = Number(sq2Str);

  if (sq1 !== sq2) {
    throw new Error(`Not a degenerate move: ${moveString}`);
  }

  return {
    player,
    turn: Number(turnStr),
    sq: sq1
  };

  /* Regex Breakdown.
    ^
      ([XO])        → Player
      (\d+)         → Turn
      \+            → "+"
      \(            → "("
        (\d+)       → Square 1
        ,           → ","
        (\d+)       → Square 2
      \)
    $
   */
  }

export function parseScoreBlock(scoreString) {    // Given "{X-1, O-0.5}"          return { X: "1", O: "0.5" }
  if (!scoreString || typeof scoreString !== "string") {
    throw new Error("Invalid score block");
  }

  const trimmed = scoreString.trim();

  // Strict pattern:
  // {X-<value>, O-<value>}
  const match = trimmed.match(
    /^\{\s*X-([^,}]+)\s*,\s*O-([^}]+)\s*\}$/
  );

  if (!match) {
    throw new Error(`Malformed score block: ${scoreString}`);
  }

  const [, xValue, oValue] = match;

  return {
    X: xValue.trim(),
    O: oValue.trim()
  };

  /* Regex Breakdown.
    ^
    \{                    → opening brace
    \s*                   → optional whitespace
    X-([^,}]+)            → capture X value (until comma or })
    \s*,\s*               → comma with optional whitespace
    O-([^}]+)             → capture O value
    \s*
    \}
    $
   */
}

//--- AI prompts ---//
/* Specs - parsePlacementMove(moveString):
  Draft a function to parse a placement move into {player, turn, sq1, sq2}. 
  Thus "X1+(3,5);" becomes { player: 'X', turn: 1, sq1: 3, sq2: 5 }.
  */

/* Specs - parseSpookyMove("moveString"):
  Draft a method to take a spooky move element "X1+(3" and 
  return an object {player, turn, sq1, sq2}. sq2 will be null. 
  Model it on the parsePlacementMove you wrote earlier and is below for reference...
  */

/* Specs - parseLoopMove(moveString):
  Draft a method to take a loop move element "O8+(1,4)[18765|432];" and 
  return an object {player, turn, sq1, sq2, cycle, stems}, where cycle and stems are simple strings
  "18765" and "432".
  Model it on the parsePlacementMove you wrote earlier and is below for reference...
  */

/* Specs - parseCollapseMove(moveString):
  Draft a method to take a collapse move element "X2@X1(1)!X1(1)!O2(2);" and 
  return an object {player, turn, triggerMove, triggerSquare, sequence}, where
  triggerMove = "X2", triggerSquare = 1, and sequence = "!X1(1)!O2(2)".
  Model it on the parsePlacementMove you wrote earlier and is below for reference...
  */

/* Specs - parseDegenerateMove(moveString):
  Draft a method to take a degenerate move element "X9+(5,5);" and 
  return an object {player, turn, sq}.
  Model it on the parsePlacementMove you wrote earlier and is below for reference...
  */

/* Specs - parseScoreBlock(moveString):
  Draft a method to take a degenerate move element "{X-1, O-0.5}" and 
  return an object {X: "1", O: "0.5"}, as strings not numbers, to keep subtle formatting.
  Model it on the parsePlacementMove you wrote earlier and is below for reference...
*/

