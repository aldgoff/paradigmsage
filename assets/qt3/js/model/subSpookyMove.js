// ./assets/qt3/js/model/subSpookyMove.js

// QT3 state: "X1+(1".
// Subtracts a trailing spooky mark from a state string.
// Pure function: does not mutate input state.???
// Caller is responsible for correct use.

/**
 * Subtracts a spooky move from a QT3 state string.
 * @param {string} state - existing QT3 state string ending with a spooky move.
 * 
 * @returns {string} modified state string.
 */

export function subSpookyMove(state) {
  return state.slice(0, -5);
}

// Before "X1+(1".
// After  "".
