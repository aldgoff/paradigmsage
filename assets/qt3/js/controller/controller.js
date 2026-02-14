// Controller.js.

import { initView } from "../view/view.js";
import { setSquareHandler } from "../view/view.js";
import {setStateString,
        setStatusString,
  } from "../view/view.js";
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
        extractStems } from "../model/cycles.js";

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

  /* Code for collapse moves. */
let collapseMovePending = false;
let cycleMoves = [];
let stemMoves = [];

function computeCollapseResolution(cycleMoves, stemMoves, triggerString) {
  // Parse trigger "@X1(4)"
  const match = triggerString.match(/@([XO])(\d+)\((\d)\)/);
  if (!match) return null;

  const triggerMove = Number(match[2]);
  const triggerSquare = Number(match[3]);

  // Only moves in this entangled component matter
  const componentMoves = new Set([
    ...cycleMoves,
    ...stemMoves
  ]);

  // Map: move -> resolvedSquare
  const resolved = {};

  // Stack for propagation
  const stack = [];

  // Seed with trigger
  resolved[triggerMove] = triggerSquare;
  stack.push(triggerMove);

  while (stack.length > 0) {
    const move = stack.pop();
    const square = resolved[move];

    // For every other move in component
    for (const p of placements) {

      if (!componentMoves.has(p.move)) continue;
      if (p.move === move) continue;
      if (resolved[p.move] !== undefined) continue;

      const [a, b] = p.squares;

      // If this move shares the resolved square
      if (a === square || b === square) {

        // It must collapse to its other square
        const forcedSquare = (a === square) ? b : a;

        resolved[p.move] = forcedSquare;
        stack.push(p.move);
      }
    }
  }

  return resolved;  
}

function inCell(event,  cycleMoves) {
  console.log("event:", event, "cycleMoves:", cycleMoves );

  let cellNo = Number(event.cell.slice(-1));
  let squareNo = Number(event.square.slice(-1));
  for (let i = 0; i<cycleMoves.length; i++) {
    console.log("Compare", cellNo, cycleMoves[i]);
    if (cellNo === cycleMoves[i]) {
      console.log("Hit spooky mark", cellNo, "on the loop, in square", squareNo);
      return { cell: cellNo, square: squareNo};
    }
  }
  console.log("No hit on the loop.");
  
  return null;
}

function handleSquareCellClick(event) {  // Respond to clicks in squares down to the cell level.
  // event - {square: 'square1', cell: 'm1'}
  console.log("Controller received:", event);
  // TADONE:
  // Creates canonical string, alternating players, correct move numbers, ordered squares.
  // Also detects cyclic entanglements, and stems, and appends canonical loop string.
  // TODO:
  // Need collapse, spooky undo, and prevent moves into classical squares.

  const square = event.square;
  const cell = event.cell;
  const lastChar = Number(square.slice(-1));

  /* Code for collapse moves. */

  if (collapseMovePending) {
    console.log("collapseMovePending()", collapseMovePending);

    let cellSq = inCell(event, cycleMoves);
    if (cellSq != null) {
      console.log("Clicked on spooky mark", cellSq.cell, "in square", cellSq.square);
      let trigger = (cellSq.cell%2) ? 'X': 'O';
      let triggerString = `@${trigger}${cellSq.cell}(${cellSq.square})`

      // Code to collapse the cyclic entanglement.
      let resolved = computeCollapseResolution(cycleMoves, stemMoves, triggerString);
      console.log("resolved", resolved);

      let resString = "";
      for (const key in resolved) {
        console.log(key, resolved[key]);
        let player = (key%2) ? 'X': 'O';
        let square = resolved[key];
        resString += `!${player}${key}(${square})`;
      }
      console.log(resString);
      stateString += `${triggerString}${resString}; `;
      setStateString(stateString);
      console.log(stateString);

      collapseMovePending = false;
    }
    else {
      console.log ("No spooky mark in cell", cell, "in square", square);
      collapseMovePending = true;
    }

    return;
  }

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
      cycleMoves = extractCycle(path, placements, pendingMove); // [].
      let loop = cycleMoves.join("");

      const backboneNodes = path;
      stemMoves = extractStems(graph, backboneNodes, placements, cycleMoves); // [].

      stateString = addLoop(stateString, cycleMoves, stemMoves);

      let collapsePlayer = (player === 'X') ? 'O' : 'X'; // Must be other player who chooses the collapse..

      setStatusString(`${collapsePlayer} needs to make a collapse move - select one purple spooky mark.`);
      collapseMovePending = true;
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

