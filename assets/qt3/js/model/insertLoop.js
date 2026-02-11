// QT3: insert a loop annotation into the most recent move
// Pure function: does not mutate input state
// Caller is responsible for correct use - must occur after a cyclic entanglement but before collapse.

/**
 * Inserts a loop annotation into the last move of a QT3 state string.
 * Assumes it is called immediately after the placement move that created the loop.
 * @param {string} state - existing QT3 state string (must end with ';')
 * @param {number[]} cycle - ordered list of move numbers forming the cycle (length 2–9)
 * @param {number[]} stems - list of stem move numbers (length 0–7)
 * @returns {string} new QT3 state string
 */
export function insertLoop(state, cycle, stems = []) {
  if (!state || !state.trim().endsWith(';')) {
    throw new Error("insertLoop requires state ending with ';'");
  }

  // remove trailing semicolon
  const trimmed = state.slice(0, -1);

  // build loop string
  const cycleStr = cycle.join('');
  const stemsStr = stems.length > 0 ? `|${stems.join('')}` : '';
  const loopStr = `[${cycleStr}${stemsStr}]`;

  // insert loop before semicolon and restore semicolon
  return `${trimmed}${loopStr};`;
}

// Example:
// state = "...X7+(1,5);";
// state = insertLoop(state, [3,5,7], [1,2]);
// -> "X7+(1,5)[357|12];"