// ./assets/qt3/js/main.js

/* MVC - Model, View, Controller
  Model: holds the state (and history) of the game.
    The entire history and state of the game is held in stateString.
    Other model level variables may hold processed data derived from this string.
  
  View: presents the state graphically, on a JS/HTML canvas, to the players.
    Elements:
      Status string
      Buttons
      Board
      Quantum listing
      Classical listing
      State string
      Ensemble

  Controller: Changes the state.
    Causes: Buttons and clicks.
      Buttons: New Game, Rerun, Undo, Redo, Load, Help.
      Clicks: Moves in the QT3 main board.
 */

/* Model (model)
  New game: Model should know stateString = "";
  Load game: Model should know stateString = loadString.
  Click intent: Model has to figure out new stateString.

  Given a changed stateString, model can update its state objects.
  Given a changed stateString and updated state objects, it can deduce its statusString.
 */

/* View (view/)
  Seven visual elements in 4 rows
  1 - Status string
  2 - The game proper
    Buttons (6)
    QT3 board
    Quantum listing
    Classical listing
  3 - State string
  4 - Classical ensemble (512)
 */

/* Controller (controller/)
  Initialize the game.
  Respond to buttons.
  Respond to clicks in the quantum board.
  Respond to clicks in the ensemble, TODO.
 */

/* Regressions (tests/)
 * addSpookyMove()       2/ 2 tests passed
 * addPlacementMove()    3/ 3 tests passed
 * addLoop()             8/ 8 tests passed
 * addCollapseMove()     4/ 4 tests passed
 * addScore()            1/ 1 tests passed
 * subSpookyMove()       1/ 1 tests passed
 * analyzeStateString() 27/27 tests passed
 * scoring()            11/11 tests passed
 * classical tic-tac-toe 6/ 6 tests passed
 */
//

function schema() {
  changeState();
  updateView();
}

function changeState() {
  newGame();
  reRun();  // These three will need a historyString and a move number.
  undo();
  redo();
  loadGame();
  processEvent();
}

/* Need these at top of every view file.
  view.js           - 57
  controlsView.js   - 25
  ensemble.js       - 39
  listings.js       - 25
  moves.js          - 27
  squareClicks.js   -  0
 */
const canvas = document.getElementById("qt3-game");
const ctx = canvas.getContext("2d");

function updateView() {
  const statusString = modelGetStatusString();
  const stateString = modelGetStateString();

  drawLayoutBounds(ctx);
  drawStatusString(ctx, statusString);
  drawButtons(ctx)

  drawBoardGrid(ctx, QT3_LAYOUT);
  drawSquareNumbers(ctx, QT3_LAYOUT);
  drawMarks(ctx, stateString);

  drawQuantumMoves(QT3_LAYOUT.moveListQT3, stateString);
  drawClassicalMoves(QT3_LAYOUT.moveListQT3, stateString);

  drawStateString(stateString);

  drawEnsemble(stateString);
}

/* AI's Plan.
processStateString(stateString)
    →
    {
        placements,
        cycleMoves,
        stemMoves,
        analyzedState,
        status,
    }

Then:
  processClick() becomes:
    compute next canonical string
    call processStateString()
  loadGame() becomes:
    call processStateString()
*/

/* State string validity hierarchy according to AI:
  Syntax only           - grammar.js
  Token extraction      - parse.js
  Structural Derivation - processStateString.js
  Game law              - validateStateString.js
 */

