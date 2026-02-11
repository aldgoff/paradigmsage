// QT3: add a placement move to a state string
// Pure function: does not mutate input state
// Caller is responsible for correct use.

/**
 * Adds a placement move to a QT3 state string.
 * @param {string} state - existing QT3 state string (may be empty)
 * @param {'X'|'O'} player - current player
 * @param {number} turn - move number (X odd, O even)
 * @param {number} a - first square (1–9)
 * @param {number} b - second square (1–9)
 * @returns {string} new QT3 state string
 */
export function addPlacementMove(state, player, turn, a, b) {
  // canonicalize square order
  const x = Math.min(a, b);
  const y = Math.max(a, b);

  const move = `${player}${turn}+((${x},${y}));`.replace('+((', '+(').replace('))', ')');

  if (!state || state.trim() === "") {
    return move;
  }

  return `${state} ${move}`;
}

// Example:
// state = "";
// state = addPlacementMove(state, 'X',1, 2,1);
// -> "X1+(1,2);"
