/* File: view.js
  Path: ./3dc/view/view.js
  Purpose: Interface to the view layer, render board, wire the panels, and add event listeners.
  Author: Allan Goff
  Date: 4/02/26
  Recommended access: import * as view from "../view/view.js";
  UI: the export functions.
*/

// --- Load JSON ---
// Seampoint: more objects...

// --- Dependencies ---
  import * as renders    from "./render/renders.js";
  import * as coordsMaps from "./render/coordsMaps.js";
  import * as tiles      from "./tiles/tiles.js";

  import * as utils      from "../../../utils/utils.js";

  import * as game       from "../controller/game/game.js";
  import * as viewer     from "../controller/viewer/viewer.js";

  import * as gAdvsqs    from "../geometry/advsqs/advsqs.js";
  import * as decorators from "./decorators/decorators.js";
  import * as quads      from "../geometry/quads/quads.js";

  import * as mPieces     from "../model/pieces/pieces.js";
  import * as vPieces     from "../view/pieces/pieces.js";

  import * as vSelections from "./selections/selections.js";
  import * as cameras     from "../view/render/cameras.js";
  import * as vAdvsqs     from "../view/advsqs/advsqs.js";
// Seampoint: more imports...

// --- Globals ---
  let context = null;   // Contains: scene, renderer, camera, tileMap...
// Seampoint: more globals...

export function getContext() { return context; }
// --- UI ---
export function init(playBoard) {
  console.log("view : view.js - init(playBoard)");

  context = renders.init(playBoard);
  context.tileMap = new Map();
  context.tileGeometry = new THREE.BoxGeometry(...coordsMaps.vts2xyz(tiles.tileSize()));

  vAdvsqs.setAdvsqPanelInitialParams();

  vSelections.init();

  game.showUndoStatus();
  const {range, speed} = viewer.getJitterValues();
  cameras.setJitter(range, speed);
}

// --- Plane Group Builders ---
  // Each presentation plane is represented by one child group
  // and stored in group.userData.planes.
  // planeRotation() operates solely on this list.

export function buildAdvSqGroup(specs) { // Params: srcTile, quad, perimeter, stride, opacity.
  console.log("view : view.js - buildAdvSqGroup(specs).", specs);

  const { gambit, action, src, srcTile, quad, perimeter, stride, opacity } = specs;

  const group = new THREE.Group();                                  // Initialize the mesh group.
  group.userData = group.userData || {};
  group.userData.overlays = [];

  const advsq = gAdvsqs.AdvSq.fromQuad(srcTile, quad, perimeter);   // Advsq.
  const piece = advsq.getPiece();
  const perims = advsq.getPerims();

  for(let k = 0; k < perims.length; k++) {                          // Decorate advsq perimeter by perimeter.
    const perim = perims[k];
    if(k === 0) {
      decorateTile(perim.stride[0], piece, "source", group, opacity);
      continue;
    }
    const quadType = quads.quadToQuadType(quad);
    const lastPerim = (k === perims.length - 1);

    decorateQuadPerimeter(lastPerim, perim, piece, quadType, group, opacity, stride, 0.05);
  }

  console.log("*** group.userData", group.userData);
  return group;
  }

export function buildAdvRectGroups(entry) { // Params: srcTile, quad, perimeter, stride, opacity.
  console.log("view : view.js - buildAdvRectGroups(entry).", entry);

  const group = new THREE.Group();                                  // Initialize the mesh group.
  group.userData = group.userData || {};
  group.userData.overlays = [];
  group.userData.planes = [];

  const { move, piece, src, dst, ray, advsqs, opacity } = entry;    // Advsq parameters.
  const { srcTile, quad, perimeter, stride, area } = advsqs[0][0];
  const advsq = gAdvsqs.AdvSq.fromQuad(srcTile, quad, perimeter);
  const perims = advsq.getPerims();

  decorateTile(perims[0].stride[0], piece, "source", group, opacity); // Source tile.
  const linear = (piece  === "duke") ? "linear3" : "linear2";         // Linear tiles.
  for (let k=1; k<perims.length; k++) {
    decorateTile(perims[k].stride[2*k], piece, linear, group, opacity);
  }

  const planes = advsqs.length;                                       // For each plane.
  buildRectPlaneGroups(piece, srcTile, dst, advsqs, planes, stride, opacity, group)

  return group;
  }

export function buildDuplexGroup(entry) { // Params: srcTile, quad, perimeter, stride, opacity.
  console.log("view : view.js - buildDuplexGroup(entry).", entry);

  const group = new THREE.Group();                                    // The mesh groups.
  group.userData = group.userData || {};
  group.userData.overlays = [];
  group.userData.planes = [];

  const { move, piece, src, dst, ray, advsqs, opacity } = entry;      // Advsq parameters.
  const { srcTile, quad, perimeter, stride, area } = advsqs[0];
  const advsq = gAdvsqs.AdvSq.fromQuad(srcTile, quad, perimeter);
  const perims = advsq.getPerims();

  decorateTile(perims[0].stride[0], piece, "source", group, opacity); // Source tile.
  const duplex = "duplex";                                            // Duplex tiles.
  for(let k=1; k<perims.length; k++) {
    const perim = perims[k];
    decorateTile(perims[k].stride[k], piece, duplex, group, opacity);
  }

  const planes = advsqs.length;                                       // For each plane.
  buildDuplexPlaneGroups(piece, srcTile, dst, advsqs, planes, stride, opacity, group);

  return group;
  }

export function buildOverlapGroup(entry) { // Params: srcTile, quad, perimeter, stride, opacity.
  console.log("view : view.js - buildOverlapGroup(entry).", entry);

  const group = new THREE.Group();                                  // The mesh groups.
  group.userData = group.userData || {};
  group.userData.overlays = [];
  group.userData.planes = [];

  const { gambit, action, value, piece, src, dst, rays, advsqs, opacity } = entry;    // Advsq parameters.

  let firstAdvsq = (value === "Feynman") ? advsqs[0] : advsqs[0][0];
  const { srcTile, quad, perimeter, stride, area } = firstAdvsq;
  
  const advsq = gAdvsqs.AdvSq.fromQuad(srcTile, quad, perimeter);
  let perims = advsq.getPerims();

  decorateTile(perims[0].stride[0], "queen", "source", group, opacity); // Source tile.
  const linear = (piece  === "duke") ? "linear3" : "linear2";         // Linear tiles.

  console.log("*** advsqs.length", advsqs.length);
  switch (value) {
    case "brook":   // Advsq [ [], [[,], [,]] ].
      for(let k=1; k<perims.length; k++) {
        (k%2 === 1)
          ? decorateTile(perims[k].stride[k], "queen", "brook", group, opacity)
          : decorateTile(perims[k].stride[k], "queen", "qtile", group, opacity);
      }

      buildRectPlaneGroups("bishop", srcTile, dst, advsqs[1], 2, stride, opacity, group);

      const planeGroup = new THREE.Group();
      planeGroup.userData = planeGroup.userData || {};
      planeGroup.userData.overlays = [];
      for(let k = 1; k < perims.length; k++) {                          // Decorate advsq perimeter by perimeter.
        const perim = perims[k];
        const quadType = quads.quadToQuadType(quad);
        decorateQuadPerimeterNoApex(perim, "rook", quadType, planeGroup, opacity, 0.05);
      }

      group.add(planeGroup);
      group.userData.planes.push(planeGroup);
      break;
    case "qtile":   // Advsq [ [], [[,], [,]], [] ].
      let rookAdvsq = advsqs[0][0];
      let thirdAdvsq = advsqs[2][0];

      for(let k=1; k<perims.length; k++) {
        (k%2 === 1)
          ? decorateTile(perims[k].stride[k], "queen", "brook", group, opacity)
          : decorateTile(perims[k].stride[k], "queen", "qtile", group, opacity);
      }

      {
        const { srcTile, quad, perimeter, stride, area } = rookAdvsq;
        const advsq = gAdvsqs.AdvSq.fromQuad(srcTile, quad, perimeter);
        let perims = advsq.getPerims();

        const planeGroup = new THREE.Group();
        planeGroup.userData = planeGroup.userData || {};
        planeGroup.userData.overlays = [];
        for(let k = 1; k < perims.length; k++) {                          // Decorate advsq perimeter by perimeter.
          const perim = perims[k];
          const quadType = quads.quadToQuadType(quad);
          decorateQuadPerimeterNoApex(perim, "rook", quadType, planeGroup, opacity, 0.05);
        }
        group.add(planeGroup);
        group.userData.planes.push(planeGroup);
      }

      buildRectPlaneGroups("bishop", srcTile, dst, advsqs[1], 2, stride, opacity, group);

      {
        const { srcTile, quad, perimeter, stride, area } = thirdAdvsq;
        const advsq = gAdvsqs.AdvSq.fromQuad(srcTile, quad, perimeter);
        let perims = advsq.getPerims();

        const planeGroup = new THREE.Group();
        planeGroup.userData = planeGroup.userData || {};
        planeGroup.userData.overlays = [];
        for(let k = 1; k < perims.length; k++) {                          // Decorate advsq perimeter by perimeter.
          const perim = perims[k];
          const quadType = quads.quadToQuadType(quad);
          decorateQuadPerimeterNoApex(perim, "duke", quadType, planeGroup, opacity, 0.05);
        }
        group.add(planeGroup);
        group.userData.planes.push(planeGroup);
      }
      break;
    case "hotspot": // Advsq [ [[,], [,]], [,] ].
      for(let k=1; k<perims.length; k++) {
        (k%2 === 1)
          ? decorateTile(perims[k].stride[2*k], piece, linear, group, opacity)
          : decorateTile(perims[k].stride[2*k], "queen", "hotspot", group, opacity);
      }
      buildRectPlaneGroups(piece, srcTile, dst, advsqs, 2, stride, opacity, group);
      buildDuplexPlaneGroups("duke", srcTile, dst, advsqs[2], 2, stride, opacity, group);
      console.log("*** group.length", group.length);
      console.log("*** group.size", group.size);
      console.log("*** group.children.length", group.children.length);
      break;
    case "Feynman": // Advsq [ [], [] ].
      buildBishopQuadGroup(srcTile, quad, perimeter, stride, opacity, group);
      const dukeAdvsq = advsqs[1];
      buildDukeQuadGroup(dukeAdvsq, group);
      for(let k=2; k<perims.length; k+=2) {
        decorateTile(perims[k].stride[k], "queen", "feynman", group, opacity);
      }
      break;
    default:
      throw new Error(`Unknown overlap type ${value}.`);
      break;
  }

  return group;
}

export function reprojectGroup(group, levelSep) {
  // console.log("view : view.js - reprojectGroup(group, levelSep).", group, levelSep);

  group.traverse(obj => {
    if(!obj.userData?.vts) return;

    const pixels = coordsMaps.vts2pixels(obj.userData.vts, levelSep);
    obj.position.set(...pixels);
  });
  }

export function reprojectPiecesGroup(group, levelSep) {
  console.log("view : view.js - reprojectPiecesGroup(group, levelSep).", group, levelSep);

  group.traverse(obj => {
    if(!obj.userData?.vts) return;

    const grid2 = coordsMaps.vts2pixels(obj.userData.vts, levelSep);  // Level sep.
    const tileSize = tiles.tileSize();          // Place just above tile.
    const tileHeight = tileSize[0];  // Z.
    const zOffset = tileHeight / 2;
    const decoratorGap = 2;
    obj.position.set(grid2[0], grid2[1] + zOffset+decoratorGap, grid2[2]);

    const keys = mPieces.piecesOnTile(obj.userData.vts);
    if(keys.length === 2) {
      let duke = (obj.userData.key[3] === 'D') ? keys[0] : null;

      if(duke) {
        if(mPieces.hasOtherStackSubpiece(duke, obj.userData.vts)) {
          const stackOffset = 26; // TODO: magic number.
          vPieces.setDukeHeight(obj, obj.userData.vts, zOffset+decoratorGap, stackOffset);
        }
      }
    }
  });
}
// Seampoint: more global functions...

// --- Helpers ---
function buildRectPlaneGroups(piece, srcTile, dst, advsqs, planes, stride, opacity, group) {
  console.log("view : view.js - buildRectPlaneGroups(...).", piece, srcTile, dst, advsqs, planes, stride, opacity, group);

  for(let p=0; p<planes; p++) {
    const planeGroup = new THREE.Group();
    planeGroup.userData = planeGroup.userData || {};
    planeGroup.userData.overlays = [];

    for(let q=0; q<2; q++) {                                          // For each advsq.
      const { quad, perimeter } = advsqs[p][q];
      const advsq = gAdvsqs.AdvSq.fromQuad(srcTile, quad, perimeter);
      const perims = advsq.getPerims();
      const linear = (q%2) ? true : false;

      for(let k=1; k<perims.length; k++) {                            // For each perimeter.
        const perim = perims[k];
        const quadType = quads.quadToQuadType(quad);
        const lastPerim = (k === perims.length - 1);
        const dst = stride;
        decorateRectPerimeter(lastPerim, perim, piece, quadType, planeGroup, opacity, dst, linear, 0.05);
      }
    }
    group.add(planeGroup);
    group.userData.planes.push(planeGroup);
  }
  }

function buildDuplexPlaneGroups(piece, srcTile, dst, advsqs, planes, stride, opacity, group) {
  console.log("view : view.js - buildDuplexPlaneGroups(...).", piece, srcTile, dst, advsqs, planes, stride, opacity, group);

  for(let p=0; p<planes; p++) { // Will always equal 2.               // For each advsq.
    const planeGroup = new THREE.Group();
    planeGroup.userData = planeGroup.userData || {};
    planeGroup.userData.overlays = [];

    const { quad, perimeter } = advsqs[p];
    const advsq = gAdvsqs.AdvSq.fromQuad(srcTile, quad, perimeter);
    const perims = advsq.getPerims();

    for(let k=1; k<perims.length; k++) {                              // For each perimeter.
      const perim = perims[k];
      const dst = stride;
      decorateDuplexPerimeter(perim, piece, planeGroup, opacity, dst, 0.05);  // Skips source & duplex tiles.
    }
    group.add(planeGroup);
    group.userData.planes.push(planeGroup);
  }
  }

function buildBishopQuadGroup(srcTile, quad, perimeter, stride, opacity, group) {
  console.log("view : view.js - buildBishopQuadGroup(...).", srcTile, quad, perimeter, stride, opacity, group);

  const planeGroup = new THREE.Group();
  planeGroup.userData = planeGroup.userData || {};
  planeGroup.userData.overlays = [];

  const advsq = gAdvsqs.AdvSq.fromQuad(srcTile, quad, perimeter, stride, opacity);
  const perims = advsq.getPerims();
  const quadType = quads.quadToQuadType(quad);

  // TODO: skip every other apex tile.
  for(let k=1; k<perims.length; k++) {                              // For each perimeter.
    const perim = perims[k];
    const lastPerim = (k === perims.length - 1);
    decoratePerimeterAlternateApex(k, perim, "bishop", planeGroup, opacity, stride, 0.05);
  }
  group.add(planeGroup);
  group.userData.planes.push(planeGroup);
  }

function buildDukeQuadGroup(dukeAdvsq, group) {
  console.log("view : view.js - buildDukeQuadGroup(dukeAdvsq, group).", dukeAdvsq, group);

  const { srcTile, quad, perimeter, stride, opacity } = dukeAdvsq;

  const planeGroup = new THREE.Group();
  planeGroup.userData = planeGroup.userData || {};
  planeGroup.userData.overlays = [];

  const advsq = gAdvsqs.AdvSq.fromQuad(srcTile, quad, perimeter, stride, opacity);
  const perims = advsq.getPerims();
  const quadType = quads.quadToQuadType(quad);

  // Skip every 'third' tile.
  for(let k=1; k<perims.length; k++) {                              // For each perimeter.
    const perim = perims[k];
    const lastPerim = (k === perims.length - 1);
    decoratePerimeterSkipThirds(perim, "duke", planeGroup, opacity, stride, 0.05);
  }
  group.add(planeGroup);
  group.userData.planes.push(planeGroup);
}

function decorateQuadPerimeter(lastPerim, perim, piece, quadType, group, opacity, dst, zOffset=0.00) {
  // console.log("view : view.js - decorateQuadPerimeter(perim)", perim);

  const end  = (piece    === "duke") ? "end3":   "end2";
  const apex = (quadType === "face") ? "duplex": "apex";

  const stride = perim.stride;
  for(let i=1; i<=stride.length; i++) {
    const j = i - 1;
    if(     utils.isSame(stride[j], perim.E1)  ) decorateTile(stride[j], piece, end,    group, opacity);
    else if(utils.isSame(stride[j], perim.apex)) decorateTile(stride[j], piece, apex,   group, opacity);
    else if(utils.isSame(stride[j], perim.E2)  ) decorateTile(stride[j], piece, end,    group, opacity);
    else {                                       decorateTile(stride[j], piece, "body", group, opacity);
    }
    if(lastPerim && (i === dst))                 decorateTile(stride[j], piece, "dst",  group, opacity, zOffset);
  }
  }

function decorateQuadPerimeterNoApex(perim, piece, quadType, group, opacity, zOffset=0.00) {
  // console.log("view : view.js - decorateQuadPerimeterNoApex(...)", perim);

  const end  = (piece    === "duke") ? "end3":   "end2";
  const apex = (quadType === "face") ? "duplex": "apex";

  const stride = perim.stride;
  for(let i=1; i<=stride.length; i++) {
    const j = i - 1;
    if(     utils.isSame(stride[j], perim.E1)  ) decorateTile(stride[j], piece, end,    group, opacity);
    else if(utils.isSame(stride[j], perim.apex)) ;
    else if(utils.isSame(stride[j], perim.E2)  ) decorateTile(stride[j], piece, end,    group, opacity);
    else {                                       decorateTile(stride[j], piece, "body", group, opacity);
    }
  }
  }

function decorateRectPerimeter(lastPerim, perim, piece, quadType, group, opacity, dst, quad2, zOffset=0.00) {
  // console.log("view : view.js - decorateRectPerimeter(perim)", perim);

  const end  = (piece    === "duke") ? "end3":   "end2";
  const apex = (quadType === "face") ? "duplex": "apex";

  const stride = perim.stride;
  for(let i=1; i<=stride.length; i++) {
    const j = i - 1;

    if(quad2) {
      if(     utils.isSame(stride[j], perim.E1)  ) ; // Skip.
      else if(utils.isSame(stride[j], perim.apex)) decorateTile(stride[j], piece, apex,   group, opacity);
      else if(utils.isSame(stride[j], perim.E2)  ) decorateTile(stride[j], piece, end,    group, opacity);
      else {                                       decorateTile(stride[j], piece, "body", group, opacity);
      }
    }
    else {
      if(     utils.isSame(stride[j], perim.E1)  ) decorateTile(stride[j], piece, end,    group, opacity);
      else if(utils.isSame(stride[j], perim.apex)) decorateTile(stride[j], piece, apex,   group, opacity);
      else if(utils.isSame(stride[j], perim.E2)  ) ; // Skip.
      else {                                       decorateTile(stride[j], piece, "body", group, opacity);
      }
    }
  }
  }

function decorateDuplexPerimeter(perim, piece, group, opacity, dst, zOffset=0.00) {
  // console.log("view : view.js - decorateDuplexPerimeter(perim)", perim);

  const stride = perim.stride;
  for(let i=1; i<=stride.length; i++) {
    const j = i - 1;
    if(     utils.isSame(stride[j], perim.E1)  ) decorateTile(stride[j], piece, "end3", group, opacity);
    else if(utils.isSame(stride[j], perim.apex)) ; // Skip.
    else if(utils.isSame(stride[j], perim.E2)  ) decorateTile(stride[j], piece, "end3", group, opacity);
    else {                                       decorateTile(stride[j], piece, "body", group, opacity);
    }
  }
  }

function decoratePerimeterAlternateApex(k, perim, piece, group, opacity, dst, zOffset=0.00) {
  // console.log("view : view.js - decoratePerimeterAlternateApex(...)", k, perim, piece, group, opacity, dst, zOffset);

  const end = (piece  === "duke") ? "end3": "end2";

  const stride = perim.stride;
  for(let i=1; i<=stride.length; i++) { // Skip even apex tiles (feynman).
    const j = i - 1;
    if(     utils.isSame(stride[j], perim.E1)  ) decorateTile(stride[j], piece, end, group, opacity);
    else if(utils.isSame(stride[j], perim.apex)) {
            if(k%2 === 1)                        decorateTile(stride[j], piece, "apex", group, opacity);
      }
    else if(utils.isSame(stride[j], perim.E2)  ) decorateTile(stride[j], piece,  end,   group, opacity);
    else {                                       decorateTile(stride[j], piece, "body", group, opacity);
    }
  }
}

function decoratePerimeterSkipThirds(perim, piece, group, opacity, dst, zOffset=0.00) {
  // console.log("view : view.js - decoratePerimeterAlternateApex(...)", k, perim, piece, group, opacity, dst, zOffset);

  const end = (piece  === "duke") ? "end3": "end2";

  const stride = perim.stride;
  for(let i=1; i<=stride.length; i++) { // Skip even apex tiles (feynman).
    const j = i - 1;
    if(     utils.isSame(stride[j], perim.E1)  ) decorateTile(stride[j], piece, end, group, opacity);
    // else if(utils.isSame(stride[j], perim.third)) ;  // TODO: fix duke third tiles.
    else if(utils.isSame(stride[j], perim.apex)) decorateTile(stride[j], piece, "apex", group, opacity);
    else if(utils.isSame(stride[j], perim.E2)  ) decorateTile(stride[j], piece,  end,   group, opacity);
    else {                                       decorateTile(stride[j], piece, "body", group, opacity);
    }
  }
}

function decorateTile(coords, piece, decorator, group, opacity, zOffset = 0.00) {
  // console.log("view : view.js - decorateTile(...)", coords, piece, decorator);

  let meshTile = tiles.getTileMesh(context.tileMap, coords);

  if (!meshTile) {
    const pos = coords;
    const tile = tiles.getTileAttributes(pos);

    meshTile = tiles.createMeshTile(tile, context.tileGeometry, pos);

    meshTile.material.forEach(mat => {      // Visual setup.
      mat.transparent = true;
      mat.opacity = opacity;
    });

    meshTile.children.forEach(child => {
      if (child.type === "LineSegments") {
        child.material.transparent = true;
        child.material.opacity = opacity;
      }
    });

    // Tile identity.
    meshTile.userData = { isTile: true, vts: pos, coords: pos, faceColor: tile.faceColor, isOffboard: true, entry: group.userData.entry }; // Ownership tag.

    group.add(meshTile);  // Attach to group (ownership root).
  }

  const faceColor = meshTile.userData.faceColor;

  const overlays = decorators.decorate(faceColor, meshTile, piece, decorator, zOffset);

  if (overlays) {
    overlays.forEach(o => {
      o.userData = o.userData || {};

      o.userData.parentTile = meshTile;
      o.userData.isOverlay  = true;
      o.userData.entry      = group.userData.entry;  // Ownership tag.
    });

    group.userData.overlays.push(...overlays);  // Tracked overlays for fast removal.

    // console.log("view : view.js - decorateTile(...)...group.userData.overlays", group.userData.overlays);
    // console.log("decorator:", decorator, "count:", group.userData.overlays.length);
  }
}
// Seampoint: more local functions...

/* TODO: QC checklist
  1. tbd
*/

