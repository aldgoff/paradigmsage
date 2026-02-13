// Controller.js.

import { initView } from "../view/view.js";
import { setSquareHandler } from "../view/view.js";
import { setStateString } from "../view/view.js";
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
        extractStems } from "../controller/cycles.js";

export function initController () {
  console.log("Controller: qt3/js/controller/controller.js");

  setSquareHandler( squareKey => {  // Registers function with view so it can be called on square events.
    handleSquareCellClick(squareKey);
  });

  initView(); // Dev scaffolding.
}

let stateString = "";
let pendingMove = 0;
let player = "X";
let spooky = 1;
let sq1 = 0;
let sq2 = 0;
let placements = [];   // [{ move, player, squares:[a,b] }]

function handleSquareCellClick(event) {  // Respond to clicks in squares down to the cell level.
  // event - {square: 'square1', cell: 'm1'}
  console.log("Controller received:", event);
  // TADONE:
  // Creates canonical string, alternating players, correct move numbers, ordered squares.
  // Also detects cyclic entanglements, and stems, and appends canonical loop string.
  // TODO:
  // Need collapse, spooky undo, and prevent moves into classical squares.

  const square = event.square;
  const lastChar = Number(square.slice(-1));

  if (spooky === 1) { // First spooky mark - "X1+(1".
    pendingMove += 1;
    sq1 = lastChar;
    stateString = addSpookyMove(stateString, player, pendingMove, sq1);
    spooky = 2;
    }
  else {             // Second spooky mark - "X1+(1,2)"
    sq2 = lastChar;
    stateString = addPlacementMove(stateString, player, pendingMove, sq1, sq2);
    spooky = 1;

    // Check for cyclic entanglement.
    const graph = buildGraph(placements);
    const path = findPath(graph, sq1, sq2);

    if (path !== null) { // Sq1 & sq2 already connected.
      let cycleMoves = extractCycle(path, placements, pendingMove); // [].
      let loop = cycleMoves.join("");

      const backboneNodes = path;
      const stemMoves = extractStems(graph, backboneNodes, placements, cycleMoves); // [].

      stateString = addLoop(stateString, cycleMoves, stemMoves);
    }
    else {
      stateString += `; `;
    }

    placements.push({
      move: pendingMove,
      player,
      squares: [sq1, sq2]
    });

    player = (player === 'X') ? 'O' : 'X'; // Must be last, do not move up.
  }

  setStateString(stateString);
  
  // Diagnostic
  console.log(stateString);
}

