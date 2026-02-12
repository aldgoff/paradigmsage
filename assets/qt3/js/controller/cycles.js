// Cycles.js
// Code to detect cyclic entanglements.

export function buildGraph(placements) {
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

export function findPath(graph, start, target, visited = new Set(), path = []) {

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

export function extractCycle(path, placements, pendingMove) {
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

  return cycleMoves;
}

export function movesForEdge(placements, x, y) {
  return placements.find(p => {
    const [a, b] = p.squares;
    return (a === x && b === y) || (a === y && b === x);
  })?.move;
}

export function extractStems(graph, backboneNodes, placements, cycleMoves) {

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
