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
export function addPlacementMove(state, player, turn, sq1, sq2) {
  // canonicalize square order
  if (sq1 < sq2) {            // "(1,5)"
    state += `,${sq2})`
    }
  else {     // Canonical order: "(5,1)"
    state = state.slice(0, -1);
    state += `${sq2},${sq1})`
  }

  return state;
}

// Example:
// state = "X1+(2";
// state = addPlacementMove(state, 'X',1, 2,1);
// -> "X1+(1,2);"
