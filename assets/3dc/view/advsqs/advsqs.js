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
import {vts2xyz,
        xyz2vts,
        vts2pixels,
        pixels2vts,
} from "../render/coordsMaps.js"

import * as view from "../view.js";
import * as tiles from "../tiles/tiles.js";
import * as decorators from "../decorators/decorators.js";
import * as cameras    from "../render/cameras.js";
import * as renders    from "../render/renders.js";

import * as state  from "../../model/state/state.js";
import * as coords from "../../foundation/coords/coords.js";
import * as planes from "../../geometry/planes.js";
import * as quads  from "../../geometry/quads.js";
import * as overlaps from "../../geometry/overlapTiles.js";
import { AdvSq } from "../../geometry/advSqs.js";
// Seampoint: more imports.

// --- Globals ---
let advsqPanelInitialParams = null;
let currentAdvsq = null;

// --- UI ---
export function setAdvsqPanelInitialParams() {
  advsqPanelInitialParams = getAdvsqPanelParams();
  }

export function getAdvsqPanelInitialParams() {
  return advsqPanelInitialParams;
  }

export function getAdvsqPanelParams() {
  console.log("view: advsqs.js - getAdvsqPanelParams():");

  const panel = document.getElementById("advsq-window");
  if (!panel) return;

  const params = {
    srcTile:   panel.querySelector('[name="advsq-src"]')?.value,
    quad:      panel.querySelector('[name="advsq-quad"]')?.value,
    perimeter: panel.querySelector('[name="advsq-perimeter"]')?.value,
    stride:    panel.querySelector('[name="advsq-stride"]')?.value,
    opacity:   panel.querySelector('[name="advsq-opacity"]')?.value,
  };

  return params;
  }

export function setAdvsqPanelParams(params) {
  console.log("view: advsqs.js - setAdvsqPanelParams(params):", params);

  const panel = document.getElementById("advsq-window");
  if (!panel) return;

  panel.querySelector('[name="advsq-src"]').value       = params.srcTile;
  panel.querySelector('[name="advsq-quad"]').value      = params.quad;
  panel.querySelector('[name="advsq-perimeter"]').value = params.perimeter;
  panel.querySelector('[name="advsq-stride"]').value    = params.stride;
  panel.querySelector('[name="advsq-opacity"]').value   = params.opacity;
  }

export function specsToPanelParams(specs) {
  if(!specs) return getAdvsqPanelInitialParams();

  const spec = getActiveBoardSpec();
  // const spec = coords.getBoardSpec("8x8x8");  // TODO: get boardspec from setup panel.
  console.log("   specs", specs);
  let src = coords.vtsToBoard(specs.srcTile, spec);
  console.log("   spec", spec);
  console.log("   denormalizeQuad(specs.quad)", denormalizeQuad(specs.quad));

  return {
    srcTile: coords.vtsToBoard(specs.srcTile, spec),
    quad:    denormalizeQuad(specs.quad),
    perimeter: specs.perimeter,
    stride:    specs.stride,
    opacity:   specs.opacity
  };
  }

export function makeAdvsq(specs) {
  console.log("view: advsqs.js - makeAdvsq(specs):", specs);

  clearAdvsq();

  const group = new THREE.Group();

  const { srcTile, quad, perimeter, stride } = specs;

  // --- 1. Build geometric AdvSq ---
  const advsq = AdvSq.fromQuad(srcTile, quad, perimeter);

  const piece = advsq.getPiece();   // rook / bishop / duke
  const perims = advsq.getPerims();

  // --- 2. Traverse all tiles ---
  for(let k = 0; k < perims.length; k++) {
    const p = perims[k];
    const perim = perims[k];

    // Source tile (k=0)
    if(k === 0) {
      decorateTile(p.stride[0], piece, "source", group, specs.opacity);
      continue;
    }

    let quadNo = quad;
    if(typeof quad === "string" && specs.quad.startsWith("Q")) {
      quadNo = Number(specs.quad.slice(1));
    }
    let quadType = quads.quadToQuadType(quadNo);

    const lastPerim = (k === perims.length - 1);
    const zOffset = 0.05;
    decoratePerimeter(lastPerim, perim, piece, quadType, group, specs.opacity, stride, zOffset);
  }

  view.context.scene.add(group);
  currentAdvsq = group;
  }

export function clearAdvsq() {
  console.log("view: advsqs.js - clearAdvsq():");

  if (!currentAdvsq) return;

  if(currentAdvsq.userData?.overlays) {  // Remove overlays from ALL tiles (board + offboard).
    currentAdvsq.userData.overlays.forEach(o => {
      if (o.parent) o.parent.remove(o);
    });
  }

  view.context.scene.remove(currentAdvsq);  // Remove offboard tiles (group children).

  currentAdvsq = null;
}
// Seampoint: more global functions.

// --- Helpers ---
function decoratePerimeter(lastPerim, perim, piece, quadType, group, opacity, strideNo, zOffset=0.00) {
  console.log("view: advsqs.js - decoratePerimeter(perim)", perim);
  const end  = (piece    === "duke") ? "end3":   "end2";
  const apex = (quadType === "face") ? "duplex": "apex";

  const stride = perim.stride;
  for(let i=1; i<=stride.length; i++) {
    const j = i - 1;
    if(     isSame(stride[j], perim.E1)  ) decorateTile(stride[j], piece, end,  group, opacity);
    else if(isSame(stride[j], perim.apex)) decorateTile(stride[j], piece, apex, group, opacity);
    else if(isSame(stride[j], perim.E2)  ) decorateTile(stride[j], piece, end,  group, opacity);
    else {
      decorateTile(stride[j], piece, "body", group, opacity);
    }
    if(lastPerim && (i === strideNo)) decorateTile(stride[j], piece, "dst", group, opacity, zOffset);
  }
}

function decorateTile(coords, piece, decorator, group, opacity, zOffset=0.00) {
  let meshTile = tiles.getTileMesh(view.context.tileMap, coords);
  if (!meshTile) {
    // TODO: Need to create a tile mesh for this tile with high transparency.

    const tileGeometry = new THREE.BoxGeometry(...vts2xyz(tiles.tileSize()));

    let pos = coords;
    let tile = tiles.getTileAttributes(pos);
    meshTile = tiles.createMeshTile(tile, tileGeometry, pos);
    meshTile.material.forEach(mat => {      // Faces and edges.
      mat.transparent = true;
      mat.opacity = opacity;   // tweak as desired
    });
    meshTile.children.forEach(child => {     // Frame.
      if (child.type === "LineSegments") {
        child.material.transparent = true;
        child.material.opacity = opacity  // match tile or slightly higher (e.g. 0.4)
      }
    });

    meshTile.userData = {
      isTile: true,
      coords: pos,
      faceColor: tile.faceColor,
      isOffboard: true
    };

    group.add(meshTile);
  }

  const faceColor = meshTile.userData.faceColor;

  const overlays = decorators.decorate(faceColor, meshTile, piece, decorator, zOffset);

  if (overlays) {
    group.userData.overlays = group.userData.overlays || [];
    group.userData.overlays.push(...overlays);
  }
}

function getActiveBoardSpec() {
  const setupArray = state.getState().Setup;

  if (!setupArray || setupArray.length === 0) {
    return coords.getBoardSpec("8x8x8"); // fallback
  }

  const latest = setupArray[setupArray.length - 1];
  const board = latest.board; // [z,x,y]

  const boardStr = board.join("x"); // "8x8x8"

  return coords.getBoardSpec(boardStr);
}
// Seampoint: more local functions.

// --- Utilities ---
function isSame(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

function denormalizeQuad(q) {
  if (typeof q === "string" && q.startsWith("Q")) {
    return Number(q.slice(1));
  }
  return q;
}
// Seampoint: more utility functions.

