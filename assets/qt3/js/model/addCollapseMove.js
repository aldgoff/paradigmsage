// ./assets/qt3/js/model/addCollapseMove.js

// QT3 state: "[357|12]"".
// Add a collapse move to a state string
// Pure function: does not mutate input state
// Caller is responsible for correct use - must be after a cyclic entanglement.

/**
 * Adds a collapse move to a QT3 state string.
 * @param {string} state - existing QT3 state string (must not be empty).
 * @param {'X'|'O'} player - current player performing the collapse.
 * @param {number} turn - (1–9) (the turn on which collapse occurs).
 * @param {number} cell - (1–9) clicked in.
 * @param {number} square - (1–9) the target move collapses into.
 * @param {move: square} resolved - Object of squares moves have collapse in.
 * 
 * @returns {string} new state string: "O3@X3(1)!X1(2)!O2(3)!X3(1); ".
 */
// X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,6); X5+(6,9); O6+(7,8); 
// X7+(4,6)[374|5]; O7@O4(5)!X3(4)!O4(5)!X5(9)!X7(6); 
// O8+(7,8)[68]; X8@O6(7)O8(8); X9+(2,3)[29|1]; O9@X9(2); {score}

export function addCollapseMove(state, player, turn, cell, square, resolved) {
  let trigger = (cell%2) ? 'X': 'O';    // "O3@X3(1)".
  let triggerString = `${player}${turn-1}@${trigger}${cell}(${square})`;

  let resString = "";                   // !X1(2)!O2(3)!X3(1); 
  for (const key in resolved) {
    let player = (key%2) ? 'X': 'O';
    let square = resolved[key];
    resString += `!${player}${key}(${square})`;
  }

  return state += `${triggerString}${resString}; `;  // state + "O3@X3(1)!X1(2)!O2(3)!X3(1); "
}

// Before "X1+(1,2); O2+(2,5); X3+(1,5)[13|2]; ".
// After  "X1+(1,2); O2+(2,5); X3+(1,5)[13|2]; O3@X3(1)!X1(2)!O2(3)!X3(1);  ".
