// qt3/view/moves.js

import { QT3_LAYOUT } from "../layout.js";
import { GRAMMAR } from "../model/grammar.js";
import { parsePlacements } from "../model/structure.js";

// The js-website drawing canvas.
const canvas = document.getElementById("qt3-game");
const ctx = canvas.getContext("2d");

const QT3_PALETTE = {
  separable: "black",
  entanglement: ["red", "green", "blue"],
  cycle: "purple",
  stem: "orange"
};

export function drawMoves(stateString) {
  let placements = parsePlacements(stateString);
  let moveSets = separateResolvedAndUnresolved(placements, stateString);
  let colorMap = assignComponentColors(moveSets.unresolved);

  colorMap = overrideCycleColors(stateString, colorMap);

  drawSpookyMarks(moveSets.unresolved, colorMap);
  drawClassicalMarks(placements, stateString);
}

// Local functions called by drawMoves().
function separateResolvedAndUnresolved(placements, stateString) { // return { resolved, unresolved }
  const resolvedMoves = new Set();

  // Find all collapse targets: !X3(5)
  let match;

  while ((match = GRAMMAR.collapseResolve.exec(stateString)) !== null) {
    const player  = match[1];
    const moveNum = Number(match[2]);
    const square  = Number(match[3]);
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

  return { resolved, unresolved };  // Unresolved is used, but not resolved.
  }

function assignComponentColors(unresolved) {                      // return moveColorMap
  /* Chronological entanglement reconstruction.
   * Rules:
   *  - Separable → black
   *  - First entanglement born → red
   *  - Second → green
   *  - Third → blue
   *  - Extending keeps color
   *  - Merging keeps earlier-born color
   */

  const palette = QT3_PALETTE.entanglement;

  const moveColorMap = {};                 // move → color
  const moveToComponent = new Map();       // move → componentId
  const components = new Map();            // componentId → {moves:Set, color, birthMove}

  const squareMap = new Map();             // square → Set<moves>
  let nextComponentId = 1;
  let nextPaletteIndex = 0;

  // Only complete placements participate
  const placements = unresolved
    .filter(p => !p.partial && p.squares.length === 2)
    .sort((a, b) => a.move - b.move);

  for (const placement of placements) {
    const { move, squares } = placement;
    const [a, b] = squares;

    // Find prior moves sharing square a or b
    const neighbors = new Set();

    for (const sq of squares) {
      const movesAtSquare = squareMap.get(sq);
      if (movesAtSquare) {
        for (const m of movesAtSquare) {
          neighbors.add(m);
        }
      }
    }

    // Determine which components those neighbors belong to
    const touchedComponents = new Set();

    for (const neighborMove of neighbors) {
      const compId = moveToComponent.get(neighborMove);
      if (compId !== undefined) {
        touchedComponents.add(compId);
      }
    }

    // CASE 1 — No neighbors → separable
    if (neighbors.size === 0) {
      moveColorMap[move] = QT3_PALETTE.separable;
    }

    // CASE 2 — Neighbors exist but none in components → birth of new entanglement
    else if (touchedComponents.size === 0) {
      const color = palette[nextPaletteIndex] ||
                    palette[palette.length - 1];

      const compId = nextComponentId++;

      components.set(compId, {
        moves: new Set([...neighbors, move]),
        color,
        birthMove: move
      });

      for (const m of neighbors) {
        moveToComponent.set(m, compId);
        moveColorMap[m] = color;
      }

      moveToComponent.set(move, compId);
      moveColorMap[move] = color;

      nextPaletteIndex++;
    }

    // CASE 3 — Extends exactly one existing component
    else if (touchedComponents.size === 1) {  // Test game: X1+(1,2); O2+(2,3); X3+(4,5); O4+(7,8); X5+(8,9); O6+(5,9);
      const compId = [...touchedComponents][0];
      const comp = components.get(compId);

      // Absorb any separable neighbors
      for (const neighborMove of neighbors) {
        if (!moveToComponent.has(neighborMove)) {
          comp.moves.add(neighborMove);
          moveToComponent.set(neighborMove, compId);
          moveColorMap[neighborMove] = comp.color;
        }
      }

      // Add current move
      comp.moves.add(move);
      moveToComponent.set(move, compId);
      moveColorMap[move] = comp.color;
    }

    // CASE 4 — Connects multiple components → merge
    else {
      // Find earliest-born component
      let earliestCompId = null;
      let earliestBirth = Infinity;

      for (const compId of touchedComponents) {
        const comp = components.get(compId);
        if (comp.birthMove < earliestBirth) {
          earliestBirth = comp.birthMove;
          earliestCompId = compId;
        }
      }

      const primary = components.get(earliestCompId);

      // Merge others into primary
      for (const compId of touchedComponents) {
        if (compId === earliestCompId) continue;

        const comp = components.get(compId);

        for (const m of comp.moves) {
          primary.moves.add(m);
          moveToComponent.set(m, earliestCompId);
          moveColorMap[m] = primary.color;
        }

        components.delete(compId);
      }

      // Add new move to primary
      primary.moves.add(move);
      moveToComponent.set(move, earliestCompId);
      moveColorMap[move] = primary.color;
    }

    // Update square map AFTER processing
    for (const sq of squares) {
      if (!squareMap.has(sq)) {
        squareMap.set(sq, new Set());
      }
      squareMap.get(sq).add(move);
    }
  }

  return moveColorMap;
  }

function overrideCycleColors(stateString, moveColorMap) {         // Return color map.
  // Clone base map so we do not mutate it
  const colorMap = { ...moveColorMap };

  // Match bracket section: [243|1] or [243]

  const matches = [...stateString.matchAll(GRAMMAR.loop)];
  if (matches.length === 0) return colorMap;

  const match = matches[matches.length - 1];

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

function drawSpookyMarks(unresolved, colorMap) {
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

function drawClassicalMarks(placements, stateString) {
  // Build resolved move → square map from stateString

  const resolvedMap = {};   // move → square

  let match;
  while ((match = GRAMMAR.collapseResolve.exec(stateString)) !== null) {
    const player = match[1];
    const move   = Number(match[2]);
    const square = Number(match[3]);
    resolvedMap[move] = square;
  }

  if (Object.keys(resolvedMap).length === 0) return;

  ctx.save();

  for (const moveStr in resolvedMap) {
    const move = Number(moveStr);
    const squareNum = resolvedMap[move];

    const p = placements.find(p => p.move === move);
    if (!p) continue;

    const player = p.player;

    const squareKey = `square${squareNum}`;
    const squareData = QT3_LAYOUT.board.squares[squareKey];
    if (!squareData) continue;

    const square = squareData.square;
    ctx.fillStyle = "#fff";  // board background color
    ctx.fillRect(square.x, square.y, square.w, square.h);

    const centerX = square.x + square.w / 2;
    const centerY = square.y + square.h / 2;

    // Main classical letter
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "64px monospace";
    ctx.fillStyle = "#000";

    ctx.fillText(player, centerX - 4, centerY + 4);

    // Subscript move number
    ctx.font = "20px monospace";
    ctx.textBaseline = "alphabetic";

    ctx.fillText(
      move.toString(),
      centerX + 24,
      centerY + 26
    );
  }

  ctx.restore();
}

