/* File: advsqs.js
  Path: ./3dc/advsqs/advsqs.js
  Purpose: Place the decorators on the board for the advsq.
  Author: Allan Goff
  Date: 4/15/26
  UI: the export functions.
*/

// --- Load JSON ---
import advsqsData from "./advsqs.json" assert { type: "json" };
  const advsqsModule = advsqsData.advsqs_module;
  const category  = advsqsModule.category;
  // Seampoint: more objects.

// --- Build upon previous layers ---
import {getBoardSpec,} from "../../foundation/coords/coords.js";

import * as view from "../view.js";
import * as tiles from "../tiles/tiles.js";
import * as decorators from "../decorators/decorators.js";
import * as cameras from "../render/cameras.js";
import * as renders from "../render/renders.js";

import * as planes from "../../geometry/planes.js";
import * as quads  from "../../geometry/quads.js";
import { AdvSq } from "../../geometry/advSqs.js";
// Seampoint: more imports.

let currentAdvsq = null;

// --- UI ---
export function UI() {
  return "whatever";
  }

export function makeAdvsq(specs) {
  console.log("view: advsqs.js - makeAdvsq(specs):", specs);

  if (currentAdvsq?.userData?.overlays) {
    currentAdvsq.userData.overlays.forEach(o => {
      if (o.parent) o.parent.remove(o);
    });
  }

  if (currentAdvsq) {
    if (currentAdvsq.userData?.overlays) {
      currentAdvsq.userData.overlays.forEach(o => {
        if (o.parent) o.parent.remove(o);
      });
    }

    view.context.scene.remove(currentAdvsq);
  }

  const group = new THREE.Group();

  const { srcTile, quad, perimeter } = specs;

  // --- 1. Build geometric AdvSq ---
  const advsq = AdvSq.fromQuad(srcTile, quad, perimeter);

  const piece = advsq.getPiece();   // rook / bishop / duke
  const perims = advsq.getPerims();

  // --- 2. Traverse all tiles ---
  for (let i = 0; i < perims.length; i++) {
    const p = perims[i];

    // Source tile (k=0)
    if (i === 0) {
      decorateTile(p.stride[0], piece, "source", group);
      continue;
    }

    // E1, apex, E2
    decorateTile(p.E1,   piece, "end2", group);
    decorateTile(p.apex, piece, "apex", group);
    decorateTile(p.E2,   piece, "end2", group);

    // Body tiles (everything else in stride)
    for (const tile of p.stride) {
      if (isSame(tile, p.E1) || isSame(tile, p.apex) || isSame(tile, p.E2)) continue;

      decorateTile(tile, piece, "body", group);
    }
  }

  view.context.scene.add(group);
  currentAdvsq = group;
}

export function makeAdvsq1(specs) {
  console.log("view: advsqs.js - makeAdvsq(specs):", specs);

  if(currentAdvsq) { view.context.scene.remove(currentAdvsq); }

  // TODO: Using the geometry layer, place an advsq on the board.
}

export function clearAdvsq() {
  if (currentAdvsq) {
    view.context.scene.remove(currentAdvsq);
    currentAdvsq = null;
  }
}
// Seampoint: more global functions.

// --- Helpers ---
function decorateTile(coords, piece, decorator, group) {
  const meshTile = tiles.getTileMesh(view.context.tileMap, coords);
  if (!meshTile) return;

  const faceColor = meshTile.userData.faceColor;

  const overlays = decorators.decorate(faceColor, meshTile, piece, decorator);

  if (overlays) {
    group.userData.overlays = group.userData.overlays || [];
    group.userData.overlays.push(...overlays);
  }
}
// Seampoint: more local functions.

// --- Utilities ---
function isSame(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}// Seampoint: more utility functions.

