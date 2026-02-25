// ./assets/qt3/js/model/parse.js

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

export function parseStateTranscript(stateString) {
  const result = [];

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

