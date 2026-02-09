// QT3: add a collapse move to a state string
// Pure function: does not mutate input state

/**
 * @typedef {Object} Trigger
 * @property {'X'|'O'} player
 * @property {number} turn
 * @property {number} square
 */

/**
 * Adds a collapse move to a QT3 state string.
 * @param {string} state - existing QT3 state string (must not be empty)
 * @param {'X'|'O'} player - current player performing the collapse
 * @param {number} turn - current turn number (the turn on which collapse occurs)
 * @param {'X'|'O'} targetPlayer - player whose move is being collapsed
 * @param {number} targetTurn - move number being collapsed
 * @param {number} square - square (1–9) the target move collapses into
 * @param {Trigger|null} trigger - optional click trigger
 * 
 * @returns {string} new QT3 state string
 */
export function addCollapseMove(
  state,
  player,
  turn,
  targetPlayer,
  targetTurn,
  square,
  trigger = null
) {
  const core = `${player}${turn}!${targetPlayer}${targetTurn}(${square})`;

  let move = core;

  if (trigger) {
    move += `@${trigger.player}${trigger.turn}(${trigger.square})`;
  }

  move += ";";

  if (!state || state.trim() === "") {
    throw new Error("Collapse move cannot be the first action in a QT3 state");
  }

  return `${state} ${move}`;
}

// Example:
// state = "X1+(1,2); O2+(2,5); X3+(1,5);";
// state = addCollapseMove(state, 'O', 4, 'X', 3, 5, { player: 'X', turn: 1, square: 1 });
// -> "X1+(1,2); O2+(2,5); X3+(1,5); O4!X3(5)@X1(1);"
