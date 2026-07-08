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
  const basePieces = overlaps.basePieces;
  const queen = overlaps.queen;
  const map = overlaps.map;
  const brook   = map.brook;
  const qtile   = map.qtile;
  const hotspot = map.hotspot;
  const Feynman = map.Feynman;
// Seampoint: more objects...

// --- Dependencies ---
  import * as utils    from "../../../utils/utils.js";  

  import * as planes   from "../../geometry/planes/planes.js";
  import * as quads    from "../../geometry/quads/quads.js";
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

export function findBrookCompanion(advsq) {
  console.log(`model: overlaps.js - findBrookCompanion(advsq):`, advsq);

  const { src, srcTile, quad, perimeter, stride, area, opacity } = advsq;
  const dstTile = planes.resolveDstTile(srcTile, quad, perimeter, stride);
  const piece = quads.pqrTable(quad).piece;
  let spec = null;

  if(     piece === "rook") {   // Given rook advsq, find bishop companion.
    for(const entry of brook) {
      if(entry.rook.perimeter === perimeter) {
        spec = entry;
        break;
      }
    }
    if(!spec) throw new Error("Brook map entry not found for rook.");

    const k = spec.bishop.perimeter;
    for(let quad = 13; quad <= 36; quad++) {
      for(const s of spec.bishop.stride) {
        const testDst = planes.resolveDstTile(srcTile, quad, k, s);
        if(testDst === dstTile) {
          return { src, srcTile, quad: quad, perimeter: k, stride: s, area, opacity };  // Bishop advsq.
        }
      }
    }
    }
  else if(piece === "bishop") { // Given bishop advsq, find rook companion.
    for(const entry of brook) {
      if(entry.bishop.perimeter === perimeter) {
        spec = entry;
        break;
      }
    }
    if(!spec) throw new Error("Brook map entry not found for bishop.");

    const k = spec.rook.perimeter;
    for(let quad = 1; quad <= 12; quad++) {
      for(const s of spec.rook.stride) {
        const testDst = planes.resolveDstTile(srcTile, quad, k, s);
        if(testDst === dstTile) {
          return { src, srcTile, quad: quad, perimeter: k, stride: s, area, opacity };  // Rook advsq.
        }
      }
    }
    }
  else throw new Error("Unable to locate Brook companion.");
  }

export function findQtileCompanion(advsq) {
  console.log(`model: overlaps.js - findQtileCompanion(advsq):`, advsq);

  const { src, srcTile, quad, perimeter, stride, area, opacity } = advsq;
  const dstTile = planes.resolveDstTile(srcTile, quad, perimeter, stride);
  const piece = quads.pqrTable(quad).piece;
  let spec = null;

  if(     piece === "rook") {   // Given rook advsq, find bishop companion.
    for(const entry of qtile) {
      if(entry.rook.perimeter === perimeter) {
        spec = entry;
        break;
      }
    }
    if(!spec) throw new Error("Qtile map entry not found for rook.");

    const k = spec.bishop.perimeter;
    for(let quad = 13; quad <= 36; quad++) {
      for(const s of spec.bishop.stride) {
        const testDst = planes.resolveDstTile(srcTile, quad, k, s);
        if(testDst === dstTile) {
          return { src, srcTile, quad: quad, perimeter: k, stride: s, area, opacity };  // Bishop advsq.
        }
      }
    }
    }
  else if(piece === "bishop") { // Given bishop advsq, find duke companion.
    for(const entry of qtile) {
      if(entry.bishop.perimeter === perimeter) {
        spec = entry;
        break;
      }
    }
    if(!spec) throw new Error("Qtile map entry not found for bishop.");

    const k = spec.duke.perimeter;
    for(let quad = 37; quad <= 60; quad++) {
      for(const s of spec.duke.stride) {
        const testDst = planes.resolveDstTile(srcTile, quad, k, s);
        if(testDst === dstTile) {
          return { src, srcTile, quad: quad, perimeter: k, stride: s, area, opacity };  // Duke advsq.
        }
      }
    }
    }
  else if(piece === "duke") {   // Given duke advsq, find rook companion.
    for(const entry of qtile) {
      if(entry.duke.perimeter === perimeter) {
        spec = entry;
        break;
      }
    }
    if(!spec) throw new Error("Qtile map entry not found for duke.");

    const k = spec.rook.perimeter;
    for(let quad = 1; quad <= 12; quad++) {
      for(const s of spec.rook.stride) {
        const testDst = planes.resolveDstTile(srcTile, quad, k, s);
        if(testDst === dstTile) {
          return { src, srcTile, quad: quad, perimeter: k, stride: s, area, opacity };
        }
      }
    }
    }
  else throw new Error("Unable to locate Qtile companion.");
  }

export function findHotspotCompanion(advsq) {
  console.log("geometry: overlaps.js - findHotspotCompanion()", advsq);

  const { src, srcTile, quad, perimeter, stride, area, opacity } = advsq;
  const dstTile = planes.resolveDstTile(srcTile, quad, perimeter, stride);
  const piece = quads.pqrTable(quad).piece;
  let spec = null;

  if(     piece === "rook") {   // Given rook advsq, find duke companion.
    for(const entry of hotspot) {
      if(entry.rook.perimeter === perimeter) {
        spec = entry;
        break;
      }
    }
    if(!spec) throw new Error("Hotspot map entry not found for rook.");

    const k = spec.duke.perimeter;
    for(let quad = 37; quad <= 60; quad++) {
      for(const s of spec.duke.stride) {
        const testDst = planes.resolveDstTile(srcTile, quad, k, s);
        if(testDst === dstTile) {
          return { src, srcTile, quad: quad, perimeter: k, stride: s, area, opacity };
        }
      }
    }
    }
  else if(piece === "duke") {   // Given duke advsq, find rook companion.
    for(const entry of hotspot) {
      if(entry.duke.perimeter === perimeter) {
        spec = entry;
        break;
      }
    }
    if(!spec) throw new Error("Hotspot map entry not found for duke.");

    const k = spec.rook.perimeter;
    for(let quad = 1; quad <= 12; quad++) {
      for(const s of spec.rook.stride) {
        const testDst = planes.resolveDstTile(srcTile, quad, k, s);
        if(testDst === dstTile) {
          return { src, srcTile, quad: quad, perimeter: k, stride: s, area, opacity };
        }
      }
    }
    }
  else throw new Error("Unable to locate Hotspot companion.");
  }

export function findFeynmanCompanion(advsq) {
  console.log(`model: overlaps.js - findFeynmanCompanion(advsq):`, advsq);

  const { src, srcTile, quad, perimeter, stride, area, opacity } = advsq;
  const dstTile = planes.resolveDstTile(srcTile, quad, perimeter, stride);
  const piece = quads.pqrTable(quad).piece;
  let spec = null;

  if(     piece === "bishop") { // Given bishop advsq, find duke companion.
    for(const entry of Feynman) {
      if(entry.bishop.perimeter === perimeter) {
        spec = entry;
        break;
      }
    }
    if(!spec) throw new Error("Feynman map entry not found for bishop.");

    const k = spec.duke.perimeter;
    for(let quad = 37; quad <= 60; quad++) {
      for(const s of spec.duke.stride) {
        const testDst = planes.resolveDstTile(srcTile, quad, k, s);
        if(testDst === dstTile) {
          const area = (k+1)*(k+1);
          return { src, srcTile, quad: quad, perimeter: k, stride: s, area, opacity };
        }
      }
    }
    }
  else if(piece === "duke") {   // Given duke advsq, find bishop companion.
    for(const entry of Feynman) {
      if(entry.duke.perimeter === perimeter) {
        spec = entry;
        break;
      }
    }
    if(!spec) throw new Error("Feynman map entry not found for duke.");

    const k = spec.bishop.perimeter;
    for(let bishopQuad = 13; bishopQuad <= 36; bishopQuad++) {
      for(const s of spec.bishop.stride) {
        const testDst = planes.resolveDstTile(srcTile, bishopQuad, k, s);
        if(testDst === dstTile) {
          return { src, srcTile, quad: bishopQuad, perimeter: k, stride: s, area, opacity };
        }
      }
    }
    }
  else throw new Error("Unable to locate Feynman companion.");
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

