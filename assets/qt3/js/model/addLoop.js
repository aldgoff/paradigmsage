// ./assets/qt3/js/model/addLoop.js

// QT3 state: "[357|12]"".
// Add a loop annotation as part of the most recent move.
// Pure function: does not mutate input state.
// Caller is responsible for correct use - must occur after a cyclic entanglement but before collapse.

/**
 * Adds a loop annotation into the last move of a QT3 state string.
 * Assumes it is called immediately after the placement move that created the loop.
 * @param {string} state - existing QT3 state string (must end with ';')
 * @param {number[]} cycle - ordered list of move numbers forming the cycle (length 2–9)
 * @param {number[]} stems - list of stem move numbers (length 0–7)
 * @returns {string} new QT3 state string
 */

export function addLoop(state, cycle, stems = []) {
  if (cycle.length === 0) {   // No loop, just add semicolon and space.
    return `${state}; `;
  }

  // Build loop string with stems (if any).
  const cycleStr = cycle.join('');
  const stemsStr = stems.length > 0 ? `|${stems.join('')}` : '';
  const loopStr = `[${cycleStr}${stemsStr}]`;

  // Add semicolon and space after loop.
  return `${state}${loopStr}; `;
}

// Before: "...X7+(1,5); ".
// After : "...X7+(1,5)[357|12]; ".

