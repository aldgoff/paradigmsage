// ./assets/qt3/js/model/structure.js

import {GRAMMAR} from "./grammar.js";

import {
  parseStateTranscript,
  parseSpookyMove,
  parsePlacementMove,
  parseLoopMove,
  parseCollapseMove,
  parseDegenerateMove,
  parseScoreBlock,
} from "./parse.js";

import {
  buildGraph,
  findPath,
  extractCycle,
  extractStems
} from "./cycles.js";

import { analyzeStateString } from "./analyzeStateString.js";

import {cellInLoop,
        computeCollapseResolution,
} from "./collapse.js";

export function processStateString(stateString) {
  const placements = [];
  let cycleMoves = [];
  let stemMoves = [];
  let score = null;

  const transcript = parseStateTranscript(stateString);

  for (const move of transcript) {
    if (move.type === "spooky") {
      const parse = parseSpookyMove(move.change);

      // Nothing to do in this case.
    }
    else if (move.type === "placement") {
      const parse = parsePlacementMove(move.change);

      placements.push({
        move: parse.turn,
        player: parse.player,
        squares: [parse.sq1, parse.sq2]
      });
    }
    else if (move.type === "degenerate") {
      const parse = parseDegenerateMove(move.change);

      placements.push({
        move: parse.turn,
        player: parse.player,
        squares: [parse.sq, parse.sq]
      });
    }
    else if (move.type === "loop") {
      const parse = parseLoopMove(move.change);

      const graph = buildGraph(placements);
      const path = findPath(graph, parse.sq1, parse.sq2);

      if (path !== null) {
        cycleMoves = extractCycle(path, placements, parse.turn);
        stemMoves  = extractStems(graph, path, placements, cycleMoves);
      }

      placements.push({
        move: parse.turn,
        player: parse.player,
        squares: [parse.sq1, parse.sq2]
      });
    }
    else if (move.type === "collapse") {
      const parse = parseCollapseMove(move.change);

      const resolved = computeCollapseResolution(
        placements,
        cycleMoves,
        stemMoves,
        parse.triggerMove,
        parse.triggerSquare
      );

      // Remove component moves from placements
      const componentMoves = new Set([
        ...cycleMoves,
        ...stemMoves
      ]);

      for (let i = placements.length - 1; i >= 0; i--) {
        if (componentMoves.has(placements[i].move)) {
          placements.splice(i, 1);
        }
      }

      // Clear entanglement
      cycleMoves = [];
      stemMoves = [];
    }
    else if (move.type === "score") {
      score = parseScoreBlock(move.change);
    }
  }

  const analyzedState = analyzeStateString(stateString);

  return {
    placements,
    cycleMoves,
    stemMoves,
    score,
    analyzedState
  };
}

export function parsePlacements(stateString) { // TODO: Duplicate in view.
  const placements = [];  // [{ move, player, squares:[a,b] }]

  if (!stateString || stateString.trim() === "") {
    return placements;
  }

  // 1️⃣ Parse all complete placements: X1+(1,2)
  let match;
  while ((match = GRAMMAR.placement.exec(stateString)) !== null) {
    placements.push({
      player:  match[1],
      move:    Number(match[2]),
      squares:[ Number(match[3]), Number(match[4])],
      partial:false
    });
  }

  // 2️⃣ Detect trailing partial placement: X1+(1
  const partialMatch = stateString.match(GRAMMAR.spooky);

  if (partialMatch) {
    placements.push({
      player:  partialMatch[1],
      move:    Number(partialMatch[2]),
      squares: [Number(partialMatch[3])],
      partial: true
    });
  }

  return placements;
}


export function buildSquareMap(placements, collapsedMoves) {
  /** Builds a square → uncollapsed move map.
   *
   * @param {Array<{move:number, sq1:number, sq2:number}>} placements
   * @param {Set<number>} collapsedMoves
   *
   * @returns {Map<number, Set<number>>}
   *   square → set of uncollapsed move numbers occupying that square
   */

  const squareMap = new Map();

  for (const p of placements) {
    if (collapsedMoves.has(p.move)) continue;

    if (!squareMap.has(p.sq1)) squareMap.set(p.sq1, new Set());
    if (!squareMap.has(p.sq2)) squareMap.set(p.sq2, new Set());

    squareMap.get(p.sq1).add(p.move);
    squareMap.get(p.sq2).add(p.move);
  }

  return squareMap;
}

export function isSquareClassical(stateString, squareNum) {
  let match;

  while ((match = GRAMMAR.collapseResolve.exec(stateString)) !== null) {
    const collapsedSquare = Number(match[3]);
    if (collapsedSquare === squareNum) return true;
  }

  return false;
}
