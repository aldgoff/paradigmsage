// qt3/view/moves.js

import { QT3_LAYOUT } from "../layout.js";
import { buildGraph } from "../model/cycles.js";

const QT3_PALETTE = {
  separable: "black",
  entanglement: ["red","green","blue"],
  cycle: "purple",
  stem: "orange"
};

export function drawMoves(ctx, stateString) {
  let placements = parsePlacements(stateString);
  let moveSets = separateResolvedAndUnresolved(placements, stateString);

  let graph = buildEntanglementGraph(moveSets.unresolved);
  let components = computeConnectedComponents(graph);
  let colorMap = assignComponentColors(components, moveSets.unresolved);
  colorMap = overrideCycleColors(stateString, colorMap);

  console.log("drawMoves()", moveSets);
  console.log("graph = buildEntanglementGraph(moveSets.unresolved)", graph);
  console.log("components = computeConnectedComponents(graph)", components);
  console.log("colorMap = assignComponentColors(components, moveSets.unresolved)", colorMap);

  drawSpookyMarks(ctx, moveSets.unresolved, colorMap);

  drawClassicalMarks(ctx, moveSets.resolved);
}

function parsePlacements(stateString) {
  const placements = [];  // [{ move, player, squares:[a,b] }]

  if (!stateString || stateString.trim() === "") {
    return placements;
  }

  // 1️⃣ Parse all complete placements: X1+(1,2)
  const completeRegex = /([XO])(\d+)\+\((\d),(\d)\)/g;

  let match;
  while ((match = completeRegex.exec(stateString)) !== null) {
    placements.push({
      move:   Number(match[2]),
      player: match[1],
      squares:[Number(match[3]), Number(match[4])],
      partial:false
    });
  }

  // 2️⃣ Detect trailing partial placement: X1+(1
  const partialRegex = /([XO])(\d+)\+\((\d)$/;

  const partialMatch = stateString.match(partialRegex);

  if (partialMatch) {
    placements.push({
      move:   Number(partialMatch[2]),
      player: partialMatch[1],
      squares:[Number(partialMatch[3])],
      partial:true
    });
  }

  return placements;
  }

function separateResolvedAndUnresolved(placements, stateString) {
  const resolvedMoves = new Set();

  // Find all collapse targets: !X3(5)
  const collapseRegex = /!([XO])(\d+)\(/g;
  let match;

  while ((match = collapseRegex.exec(stateString)) !== null) {
    const moveNum = Number(match[2]);
    resolvedMoves.add(moveNum);
  }

  const resolved = [];
  const unresolved = [];

  for (const p of placements) {
    if (resolvedMoves.has(p.move)) {
      resolved.push(p);
    } else {
      unresolved.push(p);
    }
  }

  return { resolved, unresolved };
  }

function buildEntanglementGraph(unresolved) {
  // Only complete placements form edges
  const completePlacements = unresolved
    .filter(p => !p.partial && p.squares.length === 2)
    .map(p => ({
      move: p.move,
      squares: p.squares
    }));

  let graph = buildGraph(completePlacements); // { 1:[2,5], 2:[1], ..., 9:[] }
  return graph;
  }

function computeConnectedComponents(graph) {
  const visited = new Set();
  const components = [];

  for (let node = 1; node <= 9; node++) {

    if (visited.has(node)) continue;

    const stack = [node];
    const component = [];

    while (stack.length > 0) {
      const current = stack.pop();

      if (visited.has(current)) continue;

      visited.add(current);
      component.push(current);

      const neighbors = graph[current] || [];

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }

    components.push(component);
  }

  return components;
  }

function assignComponentColors(components, unresolved) {
  const colorMap = {};

  let entanglementIndex = 0;

  for (const component of components) {

    // Collect moves belonging to this square component
    const movesInComponent = unresolved.filter(p =>
      p.squares.some(sq => component.includes(sq))
    );

    // Ignore isolated squares with no moves
    if (movesInComponent.length === 0) continue;

    // If component has only one move → separable
    if (movesInComponent.length === 1) {
      colorMap[movesInComponent[0].move] = QT3_PALETTE.separable;
      continue;
    }

    // Entangled component
    const color = QT3_PALETTE.entanglement[entanglementIndex] 
                  || QT3_PALETTE.entanglement[QT3_PALETTE.entanglement.length - 1];

    for (const p of movesInComponent) {
      colorMap[p.move] = color;
    }

    entanglementIndex++;
  }

  return colorMap;
  }


function overrideCycleColors(stateString, baseColorMap) {
  // Clone base map so we do not mutate it
  const colorMap = { ...baseColorMap };

  // Match bracket section: [243|1] or [243]
  const bracketRegex = /\[(\d+)(?:\|(\d+))?\]/;

  const match = stateString.match(bracketRegex);

  if (!match) {
    return colorMap;  // no cycle annotation present
  }

  const cycleDigits = match[1];
  const stemDigits  = match[2] || "";

  // Convert digit string to move numbers
  const cycleMoves = cycleDigits.split("").map(n => Number(n));
  const stemMoves  = stemDigits.split("").map(n => Number(n)).filter(n => !isNaN(n));

  // Override cycle colors → purple
  for (const move of cycleMoves) {
    colorMap[move] = QT3_PALETTE.cycle;
  }

  // Override stem colors → orange
  for (const move of stemMoves) {
    colorMap[move] = QT3_PALETTE.stem;
  }

  return colorMap;
  }


function drawSpookyMarks(ctx, unresolved, colorMap) {
  if (!unresolved || unresolved.length === 0) return;

  ctx.save();

  for (const placement of unresolved) {
    const { move, player, squares, partial } = placement;

    const cellKey = `m${move}`;
    // const color   = palette.separable;  // black for now
    const color = colorMap?.[move] || QT3_PALETTE.separable;


    ctx.fillStyle = color;

    for (const squareNum of squares) {
      const squareKey = `square${squareNum}`;
      const square = QT3_LAYOUT.board.squares[squareKey];

      if (!square) continue;

      const cell = square.spookyCells[cellKey];
      if (!cell) continue;

      const centerX = cell.x + cell.w / 2;
      const centerY = cell.y + cell.h / 2;

      // Main letter
      ctx.font = "22px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.fillText(player, centerX - 2, centerY + 2);

      // Subscript number
      ctx.font = "14px monospace";
      ctx.textBaseline = "alphabetic";

      ctx.fillText(
        move.toString(),
        centerX + 8,
        centerY + 10
      );
    }
  }

  ctx.restore();
}

function drawClassicalMarks(ctx, resolved) {}

