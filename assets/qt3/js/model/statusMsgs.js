// ./assets/qt3/js/model/status.js

/* Example uses:
  statusElement.textContent = ERROR.gameOver();
  statusElement.textContent = STATUS.placement("X");
  statusElement.textContent = STATUS.collapse(currentPlayer);
*/

export const ERROR = Object.freeze({
  /* Example pairs of error and status strings: 
    errorString = `${collapsePlayer} must first collapse the cyclic entanglement.`
    statusString = "Click on a purple spooky mark."

    errorString = "Cannot collapse spooky marks on stems (shown in orange), their classical value is determined."
    statusString = "Click on a purple spooky mark."

    errorString = "That square has collapsed.";
    statusString = "Choose another.";

    errorString = "Game is over."
    statusString = "New Game|Rerun|Undo|Load.";
    */

  loop: (collapsePlayer) => `${collapsePlayer} must first collapse the cyclic entanglement.`,
  stem: () =>               "Cannot collapse spooky marks on stems (shown in orange), their classical value is determined.",
  squareCollapsed: () =>    "That square has collapsed.",
  gameOver: () =>           "Game is over.",

  // Potentiall useful...
  badStart: () =>           "Invalid spooky intent.",
  badPlacement: () =>       "Invalid completion of placement move.",

  /* Example pairs: will not occur during play, but may occur during load.
    errorString = "No game in the state string box to load."
    statusString = "Start playing or try something like this, 'X1+(1,2); O2+(2,3); '."
    */
  emptyLoad: () =>          "No game in the state string box to load.",

  // Still to put under test.
  invalidStateString: () => "Invalid state string.",
});

export const STATUS = Object.freeze({
  welcome: () =>          "Welcome to quantum tic-tac-toe (QT3).",
  newGame: (player) =>    `Player ${player}: place first spooky mark (click it again to change your mind).`,

  spooky:     (player) => `${player}, place first spooky mark (click again to change your mind).`,
  undoSpooky: (player) => `Spooky mark undone. ${player}: restart your placement move, place a spooky mark in any uncollapsed square.`,
  spooky2:    (player) => `Continue with rest of placement move. ${player}, place your second spooky mark, or undo the first one.`,
  placement:  (player) => `${player}, begin your next placement move, place a pair of spooky marks in any pair of uncollapsed squares.`,

  collapse: (player) =>         `Loop detected. ${player}, select a purple spooky mark to collapse it into that square.`,
  uncollapsed: () =>            `Click on a purple spooky mark.`,
  orange: (player) =>           `${player} must click on a purple spooky mark, orange marks are stems, their classical value predetermined.`,
  spookyAfterError: (player) => `${player}, place first spooky mark in any uncollapsed square.`,
  alreadyCollapsed: () =>       "Choose another.",

  degenerate: () =>        "X: click in lone empty square, no room for a pair of spooky marks. Move will self-collapse.",
  selfCollapse: (score) => `Last move self-collapsed (degenerate). Game over: ${score}.`,

  score: (score) => `Game is over: ${score}`,
  gameOver: () =>   "New Game|Rerun|Undo|Load.",

  rerun: () =>   "Ready to rerun game.",
  syntax: () =>   "Check syntax of the state string.",

  // Load specific.
  playOrLoad: () => "Start playing, or redo (if enabled), or load a game; 'X1+(1,2); O2+(2,3); '.",
});

export const STATUS2 = {  // Not currently used, but very concise status messages.
  empty:      "Click a square to begin.",
  spooky:     "Select the second square for this move.",
  undoSpooky: "Spooky move undone.",
  placement:  "Next player to move; place a pair of spooky marks.",
  loop:       "Cycle detected — collapse required.",
  collapse:   "Select a purple mark to collapse.",
  degenerate: "Forced collapse — no choice available.",
  score:      "Game over.",
};

