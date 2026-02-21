// ./assets/qt3/js/model/structure.js

import {GRAMMAR} from "./grammer.js";

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
