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

