/* File: view.js
  Path: ./3dc/view/view.js
  Purpose: Interface to the view layer, render board, wire the panels, and add event listeners.
  Author: Allan Goff
  Date: 4/02/26
  Recommended access: import * as view from "../view/view.js";
  UI: the export functions.
  Philosophy: Delete a module by deleting its directory - not so much.
    controller/ model/ view/
    play.md - DOM
    main.js - regressions
    view.js - wire, build payload
    game.js - rewind, FF
    state.js - undo, redo
*/

// --- Load JSON ---
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as renders    from "./render/renders.js";
  import * as coordsMaps from "./render/coordsMaps.js";
  import * as tiles      from "./tiles/tiles.js";

  import * as utils      from "../../../utils/utils.js";

  import * as game       from "../controller/game/game.js";
  import * as viewer     from "../controller/viewer/viewer.js";

  import * as gAdvsqs    from "../geometry/advsqs/advsqs.js";
  import * as decorators from "./decorators/decorators.js";
  import * as quads      from "../geometry/quads/quads.js";

  import * as cameras    from "../view/render/cameras.js";
// Seampoint: more imports...

// --- Globals ---
export let context;   // Contains things like: scene, renderer, camera, tileMap...

// --- UI ---
export function init(playBoard) {
  console.log("view : view.js - init(playBoard).", playBoard);

  context = renders.init(playBoard);
  context.tileMap = new Map();
  context.tileGeometry = new THREE.BoxGeometry(...coordsMaps.vts2xyz(tiles.tileSize()));

  game.showUndoStatus();
  const {range, speed} = viewer.getJitterValues();
  cameras.setJitter(range, speed);
  }

export function buildAdvSqGroup(specs) { // Params: srcTile, quad, perimeter, stride, opacity.
  console.log("view : view.js - buildAdvSqGroup(specs).", specs);

  const group = new THREE.Group();

  group.userData = group.userData || {};
  group.userData.overlays = [];

  const { src, srcTile, quad, perimeter, stride, opacity } = specs;

  const advsq = gAdvsqs.AdvSq.fromQuad(srcTile, quad, perimeter);
  const piece = advsq.getPiece();
  const perims = advsq.getPerims();

  for (let k = 0; k < perims.length; k++) {
    const perim = perims[k];

    if (k === 0) {
      decorateTile(perim.stride[0], piece, "source", group, opacity);
      continue;
    }

    const quadType = quads.quadToQuadType(quad);
    const lastPerim = (k === perims.length - 1);

    decorateQuadPerimeter(lastPerim, perim, piece, quadType, group, opacity, stride, 0.05);
  }

  console.log("view : view.js - buildAdvSqGroup()...group", group);
  return group;
  }

export function buildAdvRectGroups(entry) { // Params: srcTile, quad, perimeter, stride, opacity.
  console.log("view : view.js - buildAdvRectGroups(entry).", entry);

  const group = new THREE.Group();                                  // The mesh groups.
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
    const perim = perims[k];
    decorateTile(perims[k].stride[2*k], piece, linear, group, opacity);
  }

  const planes = advsqs.length;                                       // For each plane.
  for(let p=0; p<planes; p++) {
    const planeGroup = new THREE.Group();
    planeGroup.userData = planeGroup.userData || {};
    planeGroup.userData.overlays = [];

    for(let q=0; q<2; q++) {                                          // For each advsq/
      const { quad, perimeter } = advsqs[p][q];
      const advsq = gAdvsqs.AdvSq.fromQuad(srcTile, quad, perimeter);
      const perims = advsq.getPerims();
      const linear = (q%2) ? true : false;

      for (let k=1; k<perims.length; k++) {                           // For each perimeter.
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

  return group;
  }

export function buildDuplexGroup(entry) { // Params: srcTile, quad, perimeter, stride, opacity.
  console.log("view : view.js - buildDuplexGroup(entry).", entry);

  const group = new THREE.Group();                                  // The mesh groups.
  group.userData = group.userData || {};
  group.userData.overlays = [];
  group.userData.planes = [];

  const { move, piece, src, dst, ray, advsqs, opacity } = entry;    // Advsq parameters.
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
  for(let p=0; p<planes; p++) { // Will always equal 2.
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

  return group;
}

export function reprojectGroup(group, levelSep) {
  group.traverse(obj => {
    if (!obj.userData?.vts) return;

    const pixels = coordsMaps.vts2pixels(obj.userData.vts, levelSep);

    obj.position.set(...pixels);
  });
}
// Seampoint: more global functions...

// --- Helpers ---
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

function decorateRectPerimeter(lastPerim, perim, piece, quadType, group, opacity, dst, quad2, zOffset=0.00) {
  // console.log("view : view.js - decorateRectPerimeter(perim)", perim);

  const end  = (piece    === "duke") ? "end3":   "end2";
  const apex = (quadType === "face") ? "duplex": "apex";

  const stride = perim.stride;
  for(let i=1; i<=stride.length; i++) {
    const j = i - 1;

    if(quad2) {
      if(     utils.isSame(stride[j], perim.E1)  ) ;
      else if(utils.isSame(stride[j], perim.apex)) decorateTile(stride[j], piece, apex,   group, opacity);
      else if(utils.isSame(stride[j], perim.E2)  ) decorateTile(stride[j], piece, end,    group, opacity);
      else {                                       decorateTile(stride[j], piece, "body", group, opacity);
      }
    }
    else {
      if(     utils.isSame(stride[j], perim.E1)  ) decorateTile(stride[j], piece, end,    group, opacity);
      else if(utils.isSame(stride[j], perim.apex)) decorateTile(stride[j], piece, apex,   group, opacity);
      else if(utils.isSame(stride[j], perim.E2)  ) ;//decorateTile(stride[j], piece, end,    group, opacity);
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
    else if(utils.isSame(stride[j], perim.apex)) ;
    else if(utils.isSame(stride[j], perim.E2)  ) decorateTile(stride[j], piece, "end3", group, opacity);
    else {                                       decorateTile(stride[j], piece, "body", group, opacity);
    }
  }
  }

function decorateTile(coords, piece, decorator, group, opacity, zOffset = 0.00) {
  console.log("view : view.js - decorateTile(...)", coords, piece, decorator);

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

