// QT3: add a spooky move to a state string
// Pure function: does not mutate input state
// Caller is responsible for correct use.

/**
 * Adds a placement move to a QT3 state string.
 * @param {string} state - existing QT3 state string (may be empty)
 * @param {'X'|'O'} player - current player
 * @param {number} turn - move number (X odd, O even)
 * @param {number} sq1 - first square (1–9)
 * @param {number} sq2 - second square (1–9) (May not be needed, depends on move 9 semmantics.)
 * @returns {string} new state string
 */

export function addSpookyMove(state, player, turn, sq1, sq2=null) {
  let newState = state + `${player}${turn}+(${sq1}`;

  return newState;
}

