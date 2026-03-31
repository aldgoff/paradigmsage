/* File: advSqs.js
  Path: ./3dc/geometry/advSqs.js
  Purpose: desc
  Author: Allan Goff
  Date: 3/29/26
  UI: the export functions.
 */

// --- Load module ---
import advSqsData from "./advSqs.json" assert { type: "json" };
  const advSqsModule = advSqsData.advSqs_module;
  const category  = advSqsModule.category;
  // Seampoint: more objects.

// --- Build upon the previous layers ---
import {rayPairToQuad,
        quadToRayPair,
} from "../geometry/quads.js";
import {getStride,
} from "../geometry/perims.js";
// Seampoint: more imports.

const _private = Symbol("AdvSq");

// --- UI ---
export class AdvSq {
  constructor(token, { source, quad, rayPair, k }) {
    if (token !== _private) { throw new Error("Use static constructors"); }

    this.source = source; // Need range test for [z, x, y].
    this.quad = quad;
    this.rayPair = rayPair;
    this.k = k;
    if( k<0 || 10<k) { throw new Error(`perimeter ${k} out of range.`); }
    // For k = 0, degenerate perimeter: all roles (E1, Apex, E2) coincide at origin.

    this.perims = [];                  // Source tile.
    // this.perims[0] = source;

    for (let i=0; i<=k; i++) {        // Each successive perimeter.
      this.perims[i] = getStride({ quad, k: i });
    }
  }

  static fromQuad(source, quad, k) {
    const rayPair = quadToRayPair(quad);
    return new AdvSq(_private, { source, quad, rayPair, k });
    }

  static fromRayPair(source, rayPair, k) {
    const quad = rayPairToQuad(rayPair);
    return new AdvSq(_private, { source, quad, rayPair, k });
  }
}

export function UI() {  // Place holder so tests run prior to code dev.
  return "whatever";
}
// Seampoint: more global functions.


// --- Helpers ---

// Seampoint: more local functions.

