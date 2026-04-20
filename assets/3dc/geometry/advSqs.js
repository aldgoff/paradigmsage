/* File: advSqs.js
  Path: ./3dc/geometry/advSqs.js
  Purpose: desc
  Author: Allan Goff
  Date: 3/29/26
  Recommended access: import * as advsqs.
  UI: the export functions.
*/

// --- Load module ---
import advSqsData from "./advSqs.json" assert { type: "json" };
  const advSqsModule = advSqsData.advSqs_module;
  const category  = advSqsModule.category;
  // Seampoint: more objects.


// --- Build upon the previous layers ---
import {getBoardSpec,
} from "../foundation/coords/coords.js";
import {bishopColor,
        dukeColor,
} from "../foundation/colors/colors.js";

import {nextPlane,
        prevPlane,
} from "../geometry/planes.js";

import {rayPairToQuad,
        quadToRayPair,
        quadToPiece,
        quadToPlane,
        planeToQuad,
        quadToPlaneQuad,
        nextQuadInPlane,
        prevQuadInPlane,
} from "../geometry/quads.js";
import {getStride,
} from "../geometry/perims.js";
// Seampoint: more imports.

const _private = Symbol("AdvSq");

function add(a, b) {  // belongs in perims as a feature.
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

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
      this.perims[i] = getStride({ quad, k: i }); // return {k, stride, E1, apex, E2 };
      let perim = this.perims[i];
      perim.E1   = add(source, perim.E1);
      perim.apex = add(source, perim.apex);
      perim.E2   = add(source, perim.E2);
      for(let s=0; s<this.perims[i].stride.length; s++) {
        this.perims[i].stride[s] = add(source, this.perims[i].stride[s]);
      }
    }
  }

  // Static constructors.
  static fromQuad(source, quad, k) {
    const rayPair = quadToRayPair(quad);
    return new AdvSq(_private, { source, quad, rayPair, k });
    }

  static fromRayPair(source, rayPair, k) {
    const quad = rayPairToQuad(rayPair);
    return new AdvSq(_private, { source, quad, rayPair, k });
  }

  // Accessors:
  getPiece()     { return quadToPiece(this.quad); }
  getPlane()     { return quadToPlane(this.quad); }
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
      const b = bishopColor(tile, spec);
      const d = dukeColor(tile, spec);

      tally[b]++;
      tally[d]++;
    }

    return tally;
  }

  // Morphers:
  nextQuad() {
    return AdvSq.fromQuad(this.source, nextQuadInPlane(this.quad), this.k);
    }

  prevQuad() {
    return AdvSq.fromQuad(this.source, prevQuadInPlane(this.quad), this.k);
    }

  nextPlane() {
    const plane = quadToPlane(this.quad);
    const planeQ = quadToPlaneQuad(this.quad);

    const newPlane = nextPlane(plane);
    const newQuad = planeToQuad(newPlane, planeQ);

    return AdvSq.fromQuad(this.source, newQuad, this.k);
    }

  prevPlane() {
    const plane = quadToPlane(this.quad);
    const planeQ = quadToPlaneQuad(this.quad);

    const newPlane = prevPlane(plane);
    const newQuad = planeToQuad(newPlane, planeQ);

    return AdvSq.fromQuad(this.source, newQuad, this.k);
  }

  // Relationships:
}

export function isEqual(a,b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
// Seampoint: more global functions.

// --- Helpers ---
function isValidVtsTile(tile) {
  const spec = getBoardSpec("10x10x10");  // Max board size.
  const max = 3*spec.Nz/2;                // Includes max vts shell.
  const min = -max + 1;

  if(!Array.isArray(tile) || tile.length !== 3) { return false; }
  const [z, x, y] = tile;

  return (
    tile.every(n => Number.isInteger(n)) &&
    tile.every(n => min <= n && n <= max)
  );
}

// Seampoint: more local functions.

