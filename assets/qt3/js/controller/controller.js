// Controller.js.

import { initView } from "../view/view.js";
import { setSquareHandler } from "../view/view.js";
import { setStateString } from "../view/view.js";

export function initController () {
  console.log("Controller: qt3/js/controller/controller.js");

  setSquareHandler( squareKey => {  // Registers function with view so it can be called on square events.
    realHonestToGoodnessLogicCode(squareKey);
  });

  initView(); // Dev scaffolding.
}

let stateString = "";
let pendingMove = 0;
let player = "X";
let spooky = 1;
let sq1 = 0;
let sq2 = 0;
let cycle = false;
let placements = [];   // [{ move, player, squares:[a,b] }]

function realHonestToGoodnessLogicCode(event) {  // This is where the logic lies, keep registration and logic separate.
  console.log("Controller received:", event);
  // ...add more code as needed...
  // Creates canonical string, alternating players, correct move numbers, ordered squares.
  // Also detects cyclic entanglements, and stems, and appends canonical loop string.
  // Need collapse, spooky undo, and prevent moves into classical squares.

  const square = event.square;
  const lastChar = Number(square.slice(-1));

  if (spooky === 1) { // First spooky mark - "X1+(1".
    pendingMove += 1;
    sq1 = lastChar;
    stateString += `${player}${pendingMove}+(${sq1}`;
    spooky = 2;
    }
  else {             // Second spooky mark - "X1+(1,2)"
    sq2 = lastChar;
    if (sq1 < sq2) {   // "(1,5)"
      stateString += `,${sq2})`
      }
    else {             // "(5,1)"
      stateString = stateString.slice(0, -1);
      stateString += `${sq2},${sq1})`
    }

    spooky = 1;
    player = (player === 'X') ? 'O' : 'X';

    // Check for cyclic entanglement.
    const graph = buildGraph(placements);
    const path = findPath(graph, sq1, sq2);

    if (path !== null) {
      // Get the moves on the cycle.
      let cycleMoves = [];
      for (let i = 0; i < path.length - 1; i++) {
        const moveNum = movesForEdge(placements, path[i], path[i + 1]);
        if (moveNum) cycleMoves.push(moveNum);
      }
      cycleMoves.push(pendingMove);

      const minMove = Math.min(...cycleMoves);
      const index = cycleMoves.indexOf(minMove);

      cycleMoves = [
        ...cycleMoves.slice(index),
        ...cycleMoves.slice(0, index)
      ];

      let loop = cycleMoves.join("");

      const backboneNodes = path;

      const stemMoves = extractStems(graph, backboneNodes, placements, cycleMoves);

      if (stemMoves.length > 0) {
        loop += "|" + stemMoves.join("");
      }

      stateString += `[${loop}]; `;
    }
    else {
      stateString += `; `;
    }

    placements.push({
      move: pendingMove,
      player,
      squares: [sq1, sq2]
    });

  }

  setStateString(stateString);
  
  // Diagnostic
  console.log(stateString);
}

// Code to detect cyclic entanglements - tobe moved to its own file:

function buildGraph(placements) {
  const graph = {};

  for (let i = 1; i <= 9; i++) {
    graph[i] = [];
  }

  for (const p of placements) {
    const [a, b] = p.squares;
    graph[a].push(b);
    graph[b].push(a);
  }

  return graph;
}

function pathExists(graph, start, target, visited = new Set()) {
  if (start === target) return true;

  visited.add(start);

  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      if (pathExists(graph, neighbor, target, visited)) {
        return true;
      }
    }
  }

  return false;
}

function findPath(graph, start, target, visited = new Set(), path = []) {

  visited.add(start);
  path.push(start);

  if (start === target) {
    return [...path];
  }

  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      const result = findPath(graph, neighbor, target, visited, path);
      if (result) return result;
    }
  }

  path.pop();
  return null;
}

function movesForEdge(placements, x, y) {
  return placements.find(p => {
    const [a, b] = p.squares;
    return (a === x && b === y) || (a === y && b === x);
  })?.move;
}

function extractStems(graph, backboneNodes, placements, cycleMoves) {

  const backboneSet = new Set(backboneNodes);

  const visited = new Set();
  const stack = [...backboneNodes];

  while (stack.length > 0) {
    const node = stack.pop();
    if (visited.has(node)) continue;
    visited.add(node);

    for (const neighbor of (graph[node] || [])) {
      stack.push(neighbor);
    }
  }

  const componentNodes = visited;

  const cycleMoveSet = new Set(cycleMoves);

  const stemMoves = [];

  for (const p of placements) {
    const [a,b] = p.squares;

    const inComponent =
      componentNodes.has(a) ||
      componentNodes.has(b);

    if (inComponent && !cycleMoveSet.has(p.move)) {
      stemMoves.push(p.move);
    }
  }

  return stemMoves.sort((a,b)=>a-b);
}
