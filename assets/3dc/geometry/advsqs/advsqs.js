/* File: advsqs.js
  Path: ./3dc/geometry/advsqs/advsqs.js
  Purpose: desc
  Author: Allan Goff
  Date: 3/29/26
  Recommended access: import * as gAdvsqs from "../../geometry/advsqs/advsqs.js";
  UI: the export functions.
*/

// --- Load module ---
  import advsqsData from "./advsqs.json" assert { type: "json" };
  const advsqsModule = advsqsData.advsqs_module;
  const category  = advsqsModule.category;
// Seampoint: more objects...

// --- Build upon the previous layers ---
  import * as utils  from "../../../utils/utils.js";
  import * as coords from "../../foundation/coords/coords.js";
  import * as colors from "../../foundation/colors/colors.js";
  import * as planes from "../../geometry/planes/planes.js";
  import * as quads  from "../../geometry/quads/quads.js";
  import * as perims from "../../geometry/perims/perims.js";
// Seampoint: more imports...

// --- Globals ---
  const _private = Symbol("AdvSq");
// Seampoint: more globals...

// --- UI ---
export class AdvSq {
  constructor(token, { source, quad, rayPair, k }) {
    if(token !== _private) { throw new Error("Use static constructors"); }
    if(!isValidVtsTile(source)) { throw new Error(`Source tile ${source} not in vts space.`); }
    if( k<0 || 10<k) { throw new Error(`perimeter ${k} out of range.`); }

    this.source = source; // Need range test for [z, x, y].
    this.quad = quad;
    this.rayPair = rayPair;
    this.k = k;
    // For k = 0, degenerate perimeter: all roles (E1, Apex, E2) coincide at source tile.

    this.perims = [];

    // Offset the perimeters by source - belongs in perims as a feature.
    for (let i=0; i<=k; i++) {        // Each successive perimeter.
      this.perims[i] = perims.getStride({ quad, k: i }); // return {k, stride, E1, apex, E2 };
      let perim = this.perims[i];
      perim.E1   = utils.add(source, perim.E1);
      perim.apex = utils.add(source, perim.apex);
      perim.E2   = utils.add(source, perim.E2);
      for(let s=0; s<this.perims[i].stride.length; s++) {
        this.perims[i].stride[s] = utils.add(source, this.perims[i].stride[s]);
      }
    }
  }

  // Static constructors.
  static fromQuad(source, quad, k) {
    const rayPair = quads.quadToRayPair(quad);
    return new AdvSq(_private, { source, quad, rayPair, k });
    }

  static fromRayPair(source, rayPair, k) {
    const quad = quads.rayPairToQuad(rayPair);
    return new AdvSq(_private, { source, quad, rayPair, k });
  }

  // Accessors:
  getPiece()     { return quads.quadToPiece(this.quad); }
  getPlane()     { return quads.quadToPlane(this.quad); }
  getQuad()      { return this.quad; }
  getRayPair()   { return this.rayPair; }
  getRange()     { return this.k; }
  getArea()      { const n=this.k+1; return n*n; }
  getPerims()    { return this.perims; }  // Not under test.
  getEnd1Tiles() { return this.perims.map(p => p.E1); }
  getApexTiles() { return this.perims.map(p => p.apex); }
  getEnd2Tiles() { return this.perims.map(p => p.E2); }

  // Properties:
  colors(spec = "8x8x8") {
    const tally = {
      white: 0,
      black: 0,
      gold: 0,
      silver: 0,
      ruby: 0,
      jade: 0
    };

    const tiles = this.perims.flatMap(p => p.stride);

    for (const tile of tiles) {
      const b = colors.bishopColor(tile, spec);
      const d = colors.dukeColor(tile, spec);

      tally[b]++;
      tally[d]++;
    }

    return tally;
  }

  // Morphers:
  nextQuad() {
    return AdvSq.fromQuad(this.source, quads.nextQuadInPlane(this.quad), this.k);
    }

  prevQuad() {
    return AdvSq.fromQuad(this.source, quads.prevQuadInPlane(this.quad), this.k);
    }

  nextPlane() {
    const plane = quads.quadToPlane(this.quad);
    const planeQ = quads.quadToPlaneQuad(this.quad);

    const newPlane = planes.nextPlane(plane);
    const newQuad = quads.planeToQuad(newPlane, planeQ);

    return AdvSq.fromQuad(this.source, newQuad, this.k);
    }

  prevPlane() {
    const plane = quads.quadToPlane(this.quad);
    const planeQ = quads.quadToPlaneQuad(this.quad);

    const newPlane = planes.prevPlane(plane);
    const newQuad = quads.planeToQuad(newPlane, planeQ);

    return AdvSq.fromQuad(this.source, newQuad, this.k);
  }

  // Relationships:
  getOnboardCount() {
    let onboard = 0;
    let k = 0;
    for(const perim of this.perims) {
      const perimOnboard = perims.onboardTiles(this.source, this.quad, k);
      // console.log("this.source, this.quad, this.k", this.source, this.quad, k, perimOnboard);
      onboard += perimOnboard;
      k++;
    }

    return onboard;
  }
}

export function isEqual(a,b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
// Seampoint: more global functions...

// --- Helpers ---
function isValidVtsTile(tile) {
  const spec = coords.getBoardSpec("10x10x10");  // Max board size.
  const max = 3*spec.Nz/2;                // Includes max vts shell.
  const min = -max + 1;

  if(!Array.isArray(tile) || tile.length !== 3) { return false; }
  const [z, x, y] = tile;

  return (
    tile.every(n => Number.isInteger(n)) &&
    tile.every(n => min <= n && n <= max)
  );
}
// Seampoint: more local functions...

