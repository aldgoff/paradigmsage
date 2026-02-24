// ./assets/qt3/js/model/addScore.js

// QT3: add a score annotation to a completed QT3 state string
// Pure function: does not mutate input state
// Caller is responsible for ensuring the game is complete before scoring.

/**
 * Adds a terminal score annotation to a QT3 state string.
 * Score semantics:
 *   {X-0, O-0}   : draw (cat's game)
 *   {X-1, O-0}   : X wins
 *   {X-0, O-1}   : O wins
 *   {X-1, O-0.5} : X quantum win (chronoblock overlap)
 *   {X-0.5, O-1} : O quantum win (chronoblock overlap)
 *   {X-1.5, O-0} : late double win (X only)
 *   {X-2.0, O-0} : full double win (X only)
 *
 * The score is appended after the final move and does not end with ';'.
 * @param {string} state - existing QT3 state string (must not be empty)
 * @param {{X:number, O:number}} score - canonical score object
 * 
 * @returns {string} new QT3 state string with score appended
 * 
 * Example:
 *  state = "X1+(1,2); O2=(4,5); X3+(2,3); O4+(5,6); X5+(3,1); O6!X5(3);";
 *  state = addScore(state, { X: 1, O: 0 });
 *  -> "X1+(1,2); O2=(4,5); X3+(2,3); O4+(5,6); X5+(3,1); O6!X5(3); {X-1, O-0}"
 * X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(1,3)[153]; O5@X5(3)!X1(1)!X3(2)!X5(3); {X-1, O-0}
 */

export function addScore(state, score) {
  if (!state || state.trim() === "") {
    throw new Error("addScore requires a non-empty QT3 state");
  }

  // prevent double-scoring (score has no trailing semicolon)
  if (!state.trim().endsWith(';')) {
    throw new Error("QT3 state already appears to be scored");
  }

  if (
    typeof score !== 'object' ||
    typeof score.X !== 'number' ||
    typeof score.O !== 'number'
  ) {
    throw new Error("Score must be an object of the form {X:number, O:number}");
  }

  const scoreStr = `{X-${score.X}, O-${score.O}}`;
  return `${state}${scoreStr}`;
}

