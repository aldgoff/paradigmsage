/* File: unitCells.js
  Path: ./3dc/foundation/unitCells.js
  Purpose: Resolve the canonicalization problem of which concept is most fundamental.
  Author: Allan Goff
  Date: 3/24/26
  Recommended access: import * as unitCells.
  UI: the export functions.
*/

// --- Load module ---
import unitCellsData from "./unitCells.json" assert { type: "json" };
  const unitCellsModule = unitCellsData.unitCells_module;
  const unitCells = unitCellsModule;
// Seampoint: more objects...

// --- UI ---
// -- Dimension access --
export function getUnitCell(dim) {
  const cell = unitCells[dim];
  if (!cell) throw new Error(`Unknown dimension: ${dim}`);
  return cell;
  }

export function getShape(dim) {
  return getUnitCell(dim).shape;
}

// -- Ray types --
export function getRayTypes(dim) {
  return Object.keys(getUnitCell(dim).rayTypes);
  }

export function getRayTypeInfo(dim, rayType) {
  const entry = getUnitCell(dim).rayTypes[rayType];
  if (!entry) throw new Error(`Unknown rayType: ${rayType} for ${dim}`);
  return entry;
  }

export function getAxisChange(dim, rayType) {
  return getRayTypeInfo(dim, rayType).axisChange;
  }

export function getRayCount(dim, rayType) {
  return getRayTypeInfo(dim, rayType).count;
}

// -- Correlations --
export function getCorrelation(dim, rayType) {
  const entry = getUnitCell(dim).correlations[rayType];
  if (!entry) throw new Error(`No correlation for rayType: ${rayType} in ${dim}`);
  return entry;
  }

export function getBasePiece(dim, rayType) {
  return getCorrelation(dim, rayType).basePiece;
  }

export function getLineType(dim, rayType) {
  const c = getCorrelation(dim, rayType);
  return c.lineType ?? null;
  }

export function getPlaneType(dim, rayType) {
  const c = getCorrelation(dim, rayType);
  return c.planeType ?? null;
}
// Seampoint: more global functions.

// --- Helpers ---
// Seampoint: more local functions.

