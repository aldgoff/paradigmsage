/* File: coords.js
  Path: ./3dc/foundation/coords/coords.js
  Purpose: Establish the 3 integral coordinate systems for 3D chess (left-handed).
  Author: Allan Goff
  Date: 3/18/26
  UI: the export functions.
 */

import coordsData from "./coords.json" assert { type: "json" };

// As this is the most foundational layer, no other imports are required.

const boardSpecs = coordsData.coords_module.board_specs;

export function getBoardSpec(specName) {
  const spec = boardSpecs.find(s => s.name === specName);

  if (!spec) {
    throw new Error(`Unknown board spec: ${specName}`);
  }

  return spec;
}

export function boardToRcs(loc, specName) {
  const spec = getBoardSpec(specName);
  const levelMap = spec.level_map;

  // Match: <LL>X,Y
  const match = loc.match(/^([A-Z]+)(\d+),(\d+)$/);

  if (!match) {
    throw new Error(`Invalid board location: ${loc}`);
  }

  const [, LL, xStr, yStr] = match;

  const Z = levelMap[LL];
  if (!Z) {
    throw new Error(`Unknown level prefix: ${LL}`);
  }

  const X = parseInt(xStr, 10);
  const Y = parseInt(yStr, 10);

  return [Z, X, Y];
  }

export function rcsToVts(rcs, specName) {
  const spec = getBoardSpec(specName);

  // Anchor defines origin in VTS
  const anchorRcs = boardToRcs(spec.anchor_board, specName);

  const z = rcs[0] - anchorRcs[0];
  const x = rcs[1] - anchorRcs[1];
  const y = rcs[2] - anchorRcs[2];

  return [z, x, y];
  }

export function vtsToRcs(vts, specName) {
  const spec = getBoardSpec(specName);

  // Anchor defines origin in VTS
  const anchorRcs = boardToRcs(spec.anchor_board, specName);

  const Z = vts[0] + anchorRcs[0];
  const X = vts[1] + anchorRcs[1];
  const Y = vts[2] + anchorRcs[2];

  return [Z, X, Y];
}

