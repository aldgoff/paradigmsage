// ./assets/qt3/js/model/addPlacementMove.js

// QT3 state: ",2); ".
// Add a placement move to a state string.
// Pure function: does not mutate input state.
// Caller is responsible for correct use.

/**
 * Adds a placement move to a QT3 state string.
 * @param {string} state - existing QT3 state string (must not be empty).
 * @param {'X'|'O'} player - current player.
 * @param {number} turn - move number (1-9) (X odd, O even).
 * @param {number} sq1 - first square (1–9).
 * @param {number} sq2 - second square (1–9).
 * @returns {string} new QT3 state string
 */

export function addPlacementMove(state, player, turn, sq1, sq2) {
  if (sq1 < sq2) {            // "(1,5)"
    state += `,${sq2})`
    }
  else {     // Canonical order: "(5,1)"
    state = state.slice(0, -1);
    state += `${sq2},${sq1})`
  }

  return state;
}

// Before: "X1+(1".
// After : "X1+(1,2); ".
