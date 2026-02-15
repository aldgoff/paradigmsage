// Controller.js.

import {addSpookyMove,
        addPlacementMove,
        addLoop,
        addCollapseMove,
        addScore,
} from "../model/barrel.js";
import {buildGraph,
        findPath,
        extractCycle,
        movesForEdge,
        extractStems 
} from "../model/cycles.js";
import {initView,
        setSquareHandler,
        setStateString,
        setStatusString,
} from "../view/view.js";
import {parsePlacements
} from "../view/moves.js"
import {cellInLoop,
        computeCollapseResolution,
        isSquareClassical
} from "../controller/collapse.js"

/* State string example.  
  X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,6); X5+(6,9); O6+(7,8); 
  X7+(4,6)[347|5]; @X3(4)!X3(4)!O4(5)!X5(9)!X7(6); 
  O8+(7,8)[68]; @O6(8)!O6(8)!O8(7); 
  X9+(1,3)[192]; @O2(2)!X1(1)!O2(2)!X9(3); 
*/

// Progressive changes:
let stateString = ""; // X1+(1,2); O2+(...
let turn = 0;  // 1 - 9.
let player = "X";     // 'X'|'O'.
let sq1, sq2 = 0;     // 1 - 9.
let placements = [];  // [{ move, player, squares:[a,b] }]

/* Code for collapse moves. */
let cycleMoves = [];
let stemMoves = [];

export function initController () {
  console.log("Controller: qt3/js/controller/controller.js");

  setSquareHandler( squareKey => {  // Registers function with view so it can be called on square events.
    handleSquareCellClick(squareKey);
  });

  initView(); // Dev scaffolding.
}

// State changes:
let gameOver = false;
let collapse = false;
let spooky = 1;       // 1, 2.

function handleSquareCellClick(event) {  // Respond to clicks in squares down to the cell level.
  // event - {square: 'square1', cell: 'm1'}
  // console.log("Click", event);

  // TADONE:
  // Creates canonical string, alternating players, correct move numbers, ordered squares.
  // Also detects cyclic entanglements, stems, and appends canonical loop string.
  // Supports collapse and appends canonical collapse string.
  // Enforces end of game.
  // TODO:
  // Spooky undo, and prevent moves into classical squares.

  const square = event.square;
  const cell = event.cell;
  const squareNum = Number(square.slice(-1)); // Last char of 'square' is the move number.

  // Prevent placement into classical squares (but allow collapse selection).
  if (isSquareClassical(stateString, squareNum)) {
    setStatusString("That square has collapsed. Choose another.");
    return;
  }

  if(     gameOver) {           // Game over.
    setStatusString("Game is over. New Game, Restart, Undo.");
    return;
    }
  else if(collapse) {           // Collapse move required - "...X7+(4,6)[347|5]; => @X3(4)!X3(4)!O4(5)..."."
    let cellSq = cellInLoop(event, placements, cycleMoves);
    if (cellSq != null) {
      let triggerSquare = cellSq.square;
      let resolved = computeCollapseResolution(placements, cycleMoves, stemMoves, cellSq.cell, triggerSquare);
      stateString = addCollapseMove(stateString, player, turn, cellSq.cell, cellSq.square, resolved);

      setStateString(stateString);

      collapse = false;
      gameOver = (turn == 9) && (spooky === 1);
    }
    else {
      console.log ("No spooky mark in cell", cell, "in square", square);
      collapse = true;
    }
    }
  else if(spooky === 1) {       // First spooky mark - "X1+(1".
    turn += 1;
    sq1 = squareNum; // Last char of 'square1' is the move number.
    stateString = addSpookyMove(stateString, player, turn, sq1);
    spooky = 2;
    }
  else if(spooky === 2) {       // Second spooky mark - "X1+(1,2)" - Completes a placement move.
    sq2 = squareNum; // Last char 'square2';
    stateString = addPlacementMove(stateString, player, turn, sq1, sq2);

    // Check for cyclic entanglement.
    const graph = buildGraph(placements);
    const path = findPath(graph, sq1, sq2);

    if (path !== null) { // Sq1 & sq2 already connected.
      cycleMoves = extractCycle(path, placements, turn); // [] - just the path, does not include connecting move.
      stemMoves  = extractStems(graph, path, placements, cycleMoves); // [].

      collapse = true;

      let collapsePlayer = (player === 'X') ? 'O' : 'X'; // Must be other player who chooses the collapse..
      setStatusString(`${collapsePlayer} needs to make a collapse move - select one purple spooky mark.`);

      stateString = addLoop(stateString, cycleMoves, stemMoves);
    }
    else {
      stateString += `; `;
    }

    placements.push({ // Add connecting move.
      move: turn,
      player: player,
      squares: [sq1, sq2]
    });

    spooky = 1;   // Ready for next placement move.
    player = (player === 'X') ? 'O' : 'X'; // Toggle player..
    }
  else {                        // Can't happen.
    console.log("CAN'T HAPPEN - OOPS!");
  }

  setStateString(stateString);  // Update state string so view can show it.
  console.log(stateString);     // Diagnostic.
}

