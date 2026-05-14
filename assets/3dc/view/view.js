/* File: view.js
  Path: ./3dc/view/view.js
  Purpose: Interface to the view layer, render board, wire the panels, and add event listeners.
  Author: Allan Goff
  Date: 4/02/26
  Recommended access: import * as view.
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

    decoratePerimeter(lastPerim, perim, piece, quadType, group, opacity, stride, 0.05);
  }

  console.log("view : view.js - buildAdvSqGroup()...group", group);
  return group;
}
// Seampoint: more global functions...

// --- Helpers ---
function decoratePerimeter(lastPerim, perim, piece, quadType, group, opacity, strideNo, zOffset=0.00) {
  // console.log("view : view.js - decoratePerimeter(perim)", perim);

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
    if(lastPerim && (i === strideNo))            decorateTile(stride[j], piece, "dst",  group, opacity, zOffset);
  }
  }

function decorateTile(coords, piece, decorator, group, opacity, zOffset = 0.00) {
  // console.log("view : view.js - decorateTile(...).");

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
    meshTile.userData = { isTile: true, coords: pos, faceColor: tile.faceColor, isOffboard: true, entry: group.userData.entry }; // Ownership tag.

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

