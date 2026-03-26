/* File: coords.js
  Path: ./3dc/foundation/coords/coords.js
  Purpose: Establish the 3 integral coordinate systems for 3D chess (left-handed).
  Author: Allan Goff
  Date: 3/18/26
  UI: the export functions.
  Terminology:
    - "tile" = any valid tile representation (string "<LL>X,Y" OR vts [z,x,y])
    - "loc"  = strictly board notation string "<LL>X,Y"
 */

import coordsData from "./coords.json" assert { type: "json" };

// As this is the most foundational layer, no other imports are required.

const coordsModule = coordsData.coords_module;
const boardSpecs = coordsModule.board_specs;

// -- Helpers --

export function getBoardSpec(specName) {
  const spec = boardSpecs.find(s => s.name === specName);

  if (!spec) {
    throw new Error(`Unknown board spec: ${specName}`);
  }

  return spec;
  }

export function normalizeTileToVts(tile, specOrName = "8x8x8") {
  if (typeof tile === "string") {
    const rcs = boardToRcs(tile, specOrName);
    return rcsToVts(rcs, specOrName);
  }

  return tile;
  }

export function tileToRcs(tile, specOrName = "8x8x8") {
  if (typeof tile === "string") {
    return boardToRcs(tile, specOrName);
  }

  return vtsToRcs(tile, specOrName);
}

// -- Canonical --

export function boardToRcs(loc, specOrName) {
  let spec = specOrName;

  if (typeof spec === "string") {
    spec = getBoardSpec(spec);
  }

  const levelMap = spec.level_map;

  // Match: <LL>X,Y
  const match = loc.match(/^([A-Z]+)(\d+),(\d+)$/);

  if (!match) {
    throw new Error(`Invalid board location: ${loc}`);
  }

  const [, LL, xStr, yStr] = match;

  const Z = levelMap[LL];
  if (Z === undefined) {
    throw new Error(`Unknown level prefix: ${LL}`);
  }

  const X = parseInt(xStr, 10);
  const Y = parseInt(yStr, 10);

  return [Z, X, Y];
  }

export function rcsToVts(rcs, specOrName) {
  let spec = specOrName;

  if (typeof spec === "string") {
    spec = getBoardSpec(spec);
  }

  // VTS origin defined by board center (Nz/2, Nx/2, Ny/2)  
  const { Nz, Nx, Ny } = spec;

  const z = rcs[0] - Nz / 2;
  const x = rcs[1] - Nx / 2;
  const y = rcs[2] - Ny / 2;

  return [z, x, y];
  }

export function vtsToRcs(vts, specOrName) {
  let spec = specOrName;

  if (typeof spec === "string") {
    spec = getBoardSpec(spec);
  }

  // VTS origin defined by board center (Nz/2, Nx/2, Ny/2)  
  const { Nz, Nx, Ny } = spec;

  const Z = vts[0] + Nz / 2;
  const X = vts[1] + Nx / 2;
  const Y = vts[2] + Ny / 2;

  return [Z, X, Y];
  }

export function rcsToBoard(rcs, specOrName) {
  let spec = specOrName;

  if (typeof spec === "string") {
    spec = getBoardSpec(spec);
  }

  const inv = spec.inverse_level_map;

  const [Z, X, Y] = rcs;

  const LL = inv[String(Z)];
  if (LL === undefined) {
    throw new Error(`Invalid Z level: ${Z}`);
  }

  return `${LL}${X},${Y}`;
}

// -- On board tests --

export function onBoardRcs(rcs, specName = "8x8x8") {
  let spec = specName;

  if (typeof spec === "string") {
    spec = getBoardSpec(spec);
  }

  const [Z, X, Y] = rcs;

  return (
    (1 <= Z && Z <= spec.Nz) &&
    (1 <= X && X <= spec.Nx) &&
    (1 <= Y && Y <= spec.Ny)
  );
  }

export function onBoardVts(vts, specName = "8x8x8") {
  let spec = specName;

  if (typeof spec === "string") {
    spec = getBoardSpec(spec);
  }

  const rcs = vtsToRcs(vts, spec);

  return onBoardRcs(rcs, spec);
}

