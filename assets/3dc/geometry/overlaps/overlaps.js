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

  const { src, srcTile, quad, perimeter, stride, opacity } = advsq;

  const dstTile = planes.resolveDstTile(srcTile, quad, perimeter, stride);
  const piece = quads.pqrTable(quad).piece;
  console.log("*** piece dstTile", piece, dstTile);

  let spec = null;

  if(     piece === "rook") {  // Given rook advsq, find bishop companion.
    for(const entry of brook) {
      if(entry.rook.perimeter === perimeter) {
        spec = entry;
        break;
      }
    }
    if(!spec) throw new Error("Brook map entry not found for rook.");

    const k = spec.bishop.perimeter;
    for(let quad = 13; quad <= 36; quad++) {
      console.log("*** bishop quad", quad);
      for(const s of spec.bishop.stride) {
        const testDst = planes.resolveDstTile(srcTile, quad, k, s);
        console.log("  *** testDst", testDst);
        if(testDst === dstTile) {
          const companion = { src, srcTile, quad: quad, perimeter: k, stride: s, opacity };
          console.log("*** companion", companion);
          return { src, srcTile, quad: quad, perimeter: k, stride: s, opacity };  // Bishop advsq.
        }
      }
    }
    }
  else if(piece === "bishop") {  // Given bishop advsq, find rook companion.
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
          return { src, srcTile, quad: quad, perimeter: k, stride: s, opacity };  // Rook advsq.
        }
      }
    }
  }
  let companion = null;

  return companion; // Rook or bishop.
  }

export function findQtileCompanion(advsq) {
  console.log(`model: overlaps.js - findQtileCompanion(advsq):`, advsq);

  const { src, srcTile, quad, perimeter, stride, opacity } = advsq;

  const dstTile = planes.resolveDstTile(srcTile, quad, perimeter, stride);
  const piece = quads.pqrTable(quad).piece;
  console.log("*** piece dstTile", piece, dstTile);

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
      console.log("*** bishop quad", quad);
      for(const s of spec.bishop.stride) {
        const testDst = planes.resolveDstTile(srcTile, quad, k, s);
        console.log("  *** testDst", testDst);
        if(testDst === dstTile) {
          return { src, srcTile, quad: quad, perimeter: k, stride: s, opacity };  // Bishop advsq.
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
      console.log("*** duke quad", quad);
      for(const s of spec.duke.stride) {
        const testDst = planes.resolveDstTile(srcTile, quad, k, s);
        console.log("  *** testDst", testDst);
        if(testDst === dstTile) {
          return { src, srcTile, quad: quad, perimeter: k, stride: s, opacity };  // Duke advsq.
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
          return { src, srcTile, quad: quad, perimeter: k, stride: s, opacity };
        }
      }
    }
  }

  let companion = null;
  return companion; // Rook or bishop.
  }

export function findHotspotCompanion(advsq) {
  console.log("geometry: overlaps.js - findHotspotCompanion()", advsq);

  const { src, srcTile, quad, perimeter, stride, opacity } = advsq;

  const dstTile = planes.resolveDstTile(srcTile, quad, perimeter, stride);
  const piece = quads.pqrTable(quad).piece;
  console.log("*** piece dstTile", piece, dstTile);

  let spec = null;

  if(     piece === "rook") {  // Given rook advsq, find duke companion.
    for(const entry of hotspot) {
      if(entry.rook.perimeter === perimeter) {
        spec = entry;
        break;
      }
    }
    if(!spec) throw new Error("Hotspot map entry not found for rook.");

    const k = spec.duke.perimeter;
    for(let dukeQuad = 37; dukeQuad <= 60; dukeQuad++) {
      console.log("*** duke quad", dukeQuad);
      for(const s of spec.duke.stride) {
        const testDst = planes.resolveDstTile(srcTile, dukeQuad, k, s);
        console.log("  *** testDst", testDst);
        if(testDst === dstTile) {
          const companion = { src, srcTile, quad: dukeQuad, perimeter: k, stride: s, opacity };
          console.log("*** companion", companion);
          return { src, srcTile, quad: dukeQuad, perimeter: k, stride: s, opacity };
        }
      }
    }
    }
  else if(piece === "duke") {  // Given duke advsq, find rook companion.
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
          return { src, srcTile, quad: quad, perimeter: k, stride: s, opacity };
        }
      }
    }
  }
  }

export function findFeynmanCompanion(advsq) {
  console.log(`model: overlaps.js - findFeynmanCompanion(advsq):`, advsq);

  const { src, srcTile, quad, perimeter, stride, opacity } = advsq;

  let companion = null;

  const dstTile = planes.resolveDstTile(srcTile, quad, perimeter, stride);
  const piece = quads.pqrTable(quad).piece;
  console.log("*** piece dstTile", piece, dstTile);

  let spec = null;

  if(     piece === "bishop") {
    for(const entry of Feynman) {
      console.log("*** entry", entry);
      if(entry.bishop.perimeter === perimeter) {
        spec = entry;
        break;
      }
    }
    if(!spec) throw new Error("Feynman map entry not found for bishop.");

    const k = spec.duke.perimeter;
    for(let dukeQuad = 37; dukeQuad <= 60; dukeQuad++) {
      console.log("*** duke quad", dukeQuad);
      for(const s of spec.duke.stride) {
        const testDst = planes.resolveDstTile(srcTile, dukeQuad, k, s);
        console.log("  *** testDst", testDst);
        if(testDst === dstTile) {
          const companion = { src, srcTile, quad: dukeQuad, perimeter: k, stride: s, opacity };
          console.log("*** companion", companion);
          return { src, srcTile, quad: dukeQuad, perimeter: k, stride: s, opacity };
        }
      }
    }
  }
  else if(piece === "duke") {
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
        // if(utils.isSame(testDst, dstTile)) {
          return { src, srcTile, quad: bishopQuad, perimeter: k, stride: s, opacity };
        }
      }
    }
  }

  // TODO: tbd.

  throw new Error("Unable to locate Feynman companion.");

  return companion; // Rook or bishop.
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

