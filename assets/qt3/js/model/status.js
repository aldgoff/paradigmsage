// ./assets/qt3/js/model/status.js

/* Examples uses:
  showError(ERROR.squareCollapsed());
  showError(STATUS.squareCollapsed(player));
*/

/* Example uses:
  statusElement.textContent = STATUS.placement("X");
  statusElement.textContent = STATUS.collapse(currentPlayer);
 */

export const ERROR = Object.freeze({
  stem: () =>
    "Cannot collapse spooky marks on stems.",

  loop: (player) =>
    `${player} must first collapse the cyclic entanglement.`,

  squareCollapsed: () =>
    "That square has collapsed.",

  gameOver: () =>
    "Game is over.",

  // These will not occur during play, but may occur during load.
  illegalDegenerate: () =>
    "Illegal degenerate placement.",

  invalidStateString: () =>
    "Invalid state string.",

  wrongPlayerTurn: (expected) =>
    `It is ${expected}'s turn.`,

});

export const STATUS = Object.freeze({
  welcome: () =>
    "Welcome to quantum tic-tac-toe (QT3).",

  newGame: (player) =>
    `Player ${player}: place first spooky mark (click it again to change your mind).`,

  spooky: (player) =>
    `${player}, place first spooky mark (click again to change your mind).`,

  undoSpooky: (player) =>
    `Spooky mark undone. ${player}: restart your placement move, place a spooky mark in any uncollapsed square.`,

  spooky2: (player) =>
    `Continue with rest of placement move. ${player}, place your second spooky mark, or undo the first one.`,

  placement: (player) =>
    `${player}, begin your next placement move, place a spooky mark in any uncollapsed square.`,

  collapse: (player) =>
    `Loop detected. ${player}, select a purple spooky mark to collapse it into that square.`,

  uncollapsed: (player) =>
    `Click on a purple spooky mark.`,

  orange: (player) =>
    `${player} must click on a purple spooky mark, orange marks are stems, their classical value predetermined.`,

  spookyAfterError: (player) =>
    `${player}, place first spooky mark in any uncollapsed square.`,

  alreadyCollapsed: () =>
    "Choose another.",

  degenerate: () =>
    "X: click in lone empty square, no room for a pair of spooky marks. Move will self-collapse.",

  selfCollapse: (score) =>
    `Last move self-collapsed (degenerate). Game over: ${score}.`,

  score: (score) =>
    `Game over: ${score}`,

  gameOver: () =>
    "New Game|Rerun|Undo|Load.",
});

/* List of status strings: 
  statusString = "Game is over. New Game, Rerun, Undo, Load.";
  statusString = "That square has collapsed. Choose another.";
  statusString = `Last move self-collapsed (degenerate). Game over: ${outcome.desc}.`;
  statusString = `Spooky mark undone. ${player}: restart your placement move, place a spooky mark in any uncollapsed square.`
  statusString = `Continue with rest of placement move, ${player}: place your second spooky mark or undo the first one.`
  statusString = `${collapsePlayer} must first collapse the cyclic entanglement. Click on a purple spooky mark.`
  statusString = `${nextPlayer}: begin your next placement move, place a spooky mark in any uncollapsed square.`
  statusString = `Game over: ${outcome.desc}.`;
  statusString = `Player ${player}: place first spooky mark (click it again to change your mind).`;
 */

/*
  statusString = `Player ${player}: place first spooky mark (click it again to change your mind).`;
  statusString = `Continue with rest of placement move, ${player}: place your second spooky mark or undo the first one.`;
  statusString = `${player}: begin your next placement move, place a spooky mark in any uncollapsed square.`;
  
  errorString = `${player} must first collapse the cyclic entanglement.`;
  statusString = `Click on a purple spooky mark.`;

  statusString = `Game over: ${outcome.desc}.`;
  statusString = `Spooky mark undone. ${player}: restart your placement move, place a spooky mark in any uncollapsed square.`
  statusString = "Must click on a purple spooky mark, orange marks are stems, their classical value predetermined."
  statusString = `Last move self-collapsed (degenerate). Game over: ${outcome.desc}.`;

  errorString = "Game is over."
  statusString = "New Game|Rerun|Undo|Load.";

  errorString = "That square has collapsed.";
  statusString = "Choose another.";


 */

// Example use: statusElement.textContent = STATUS.collapse;

export const STATUS2 = {
  empty: "Click a square to begin.",
  spooky: "Select the second square for this move.",
  placement: "Next player must place a move.",
  loop: "Cycle detected — collapse required.",
  collapse: "Select a purple square to collapse.",
  degenerate: "Forced collapse — no choice available.",
  score: "Game over.",

  undoSpooky: "Spooky move undone.",
  undoPlacement: "Placement undone.",
};
