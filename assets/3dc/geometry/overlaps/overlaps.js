/* File: overlaps.js
  Path: ./3dc/geometry/overlaps/overlaps.js
  Purpose: desc
  Author: Allan Goff
  Date: 3/30/26
  Recommended access: import * as overlaps from "../../geometry/overlaps/overlaps.js";
  UI: the export functions.
*/

// --- Load module ---
import overlapsData from "./overlaps.json" assert { type: "json" };
  const overlaps = overlapsData.overlaps_module;
// Seampoint: more objects...

// --- Build upon the previous layers ---
  import { } from "../../foundation/coords/coords.js";
// Seampoint: more imports...

// --- UI ---
export function getStride({ piece, subType = null, quadType, k }) {
  /** Get stride (overlap roles) for a given piece, quad type, and perimeter k
   *
   * @param {string} piece - 'rook' | 'bishop' | 'duke' | 'queen'
   * @param {string} subType - for queen: 'rook' | 'bishop' | 'duke' (ignored otherwise)
   * @param {string} quadType - 'all' | 'edge' | 'face'
   * @param {number} k - perimeter index (0..10)
   * @returns {string[]} array of role names (e.g. ['end2','body','apex',...])
   */
  if (0>k || k>10) { throw new Error(`Invalid perimeter k=${k}. Supported range is 0..10`); }

  let node;

  if (piece === 'queen') {
    if (!subType) { throw new Error('Queen requires subType: rook | bishop | duke'); }
    node = overlaps.queen[subType];
  } else {
    node = overlaps.basePieces[piece];
  }
  if (!node) { throw new Error(`Unknown piece: ${piece}`); }

  const quad = node.quads[quadType];
  if (!quad) { throw new Error(`Invalid quadType '${quadType}' for piece '${piece}'`); }

  const strides = quad.strides;
  if (!strides[k]) { throw new Error(`Stride not defined for k=${k}`); }

  return strides[k];
  }

export function getRoles({ piece, subType = null, quadType }) {
  /** Get roles (name + multiplicity) for a given piece/subType and quadType
   *
   * @param {string} piece - 'rook' | 'bishop' | 'duke' | 'queen'
   * @param {string} subType - for queen: 'rook' | 'bishop' | 'duke' (ignored otherwise)
   * @param {string} quadType - 'all' | 'edge' | 'face'
   * @returns {{name:string, multiplicity:number}[]}
   */
  let node;

  if (piece === 'queen') {
    if (!subType) { throw new Error('Queen requires subType: rook | bishop | duke'); }

    node = overlaps.queen[subType];
  } else {
    node = overlaps.basePieces[piece];
  }
  if (!node) { throw new Error(`Unknown piece: ${piece}`); }

  const quad = node.quads[quadType];
  if (!quad) { throw new Error(`Invalid quadType '${quadType}' for piece '${piece}'`); }

  return quad.roles;
}

export function getOverlapType(basePiece, quadType, perim, stride) {
  const type = overlaps.queen[basePiece].quads[quadType].strides[perim][stride];
  // console.log("model: getOverlapType(basePiece, quadType, perim, stride)...type - ", basePiece, quadType, perim, stride, type);

  return type; // source|end2|end3|body|apex|brook|qtile|hotspot|Feynman
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

