// ./assets/qt3/js/model/addSpooky.js

// QT3 state: "X1+(1".
// Add the first spooky mark to a state string.
// Pure function: does not mutate input state.
// Caller is responsible for correct use.

/**
 * Adds a placement move to a QT3 state string.
 * @param {string} state - existing QT3 state string (may be empty).
 * @param {'X'|'O'} player - current player.
 * @param {number} turn - move number (1-9) (X odd, O even).
 * @param {number} sq1 - first square (1–9).
 * @returns {string} new state string.
 */

export function addSpookyMove(state, player, turn, sq1, sq2=null) {
  return state = `${state}${player}${turn}+(${sq1}`;
}

// Before "".
// After  "X1+(1".

