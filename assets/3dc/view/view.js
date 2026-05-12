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

/** Roles:
 * Layer: View (Projection & Visualization)
 *
 * Purpose:
 * Projects the abstract constraint system into human-readable form.
 *
 * Ontology:
 * - The board is a projection, not the system itself
 * - Visuals are approximations of higher-dimensional relations
 *
 * Responsibilities:
 * - Render board state
 * - Visualize manifolds (planes, perimeters)
 * - Display transitions and highlights
 *
 * Does NOT:
 * - Contain game logic
 * - Validate moves
 * - Define rules
 *
 * Inputs:
 * - Canonical state
 * - Transition descriptors
 * - Optional manifold traces
 *
 * Notes:
 * Avoid encoding logic assumptions in visuals (e.g., paths).
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

  import * as vAdvsqs    from "../geometry/advsqs/advsqs.js";
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

  // const group = new THREE.Group();
  const group = new THREE.Group();

  group.userData = group.userData || {};
  group.userData.overlays = [];

  const { srcTile, quad, perimeter, stride, opacity } = specs;

  const advsq = vAdvsqs.AdvSq.fromQuad(srcTile, quad, perimeter);
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

    decoratePerimeter(
      lastPerim,
      perim,
      piece,
      quadType,
      group,
      opacity,
      stride,
      0.05
    );
  }

  return group;
}
// Seampoint: more global functions...

// --- Helpers ---
function decoratePerimeter(lastPerim, perim, piece, quadType, group, opacity, strideNo, zOffset=0.00) {
  // console.log("view : advsqs.js - decoratePerimeter(perim)", perim);
  const end  = (piece    === "duke") ? "end3":   "end2";
  const apex = (quadType === "face") ? "duplex": "apex";

  const stride = perim.stride;
  for(let i=1; i<=stride.length; i++) {
    const j = i - 1;
    if(     utils.isSame(stride[j], perim.E1)  ) decorateTile(stride[j], piece, end,  group, opacity);
    else if(utils.isSame(stride[j], perim.apex)) decorateTile(stride[j], piece, apex, group, opacity);
    else if(utils.isSame(stride[j], perim.E2)  ) decorateTile(stride[j], piece, end,  group, opacity);
    else {
      decorateTile(stride[j], piece, "body", group, opacity);
    }
    if(lastPerim && (i === strideNo)) decorateTile(stride[j], piece, "dst", group, opacity, zOffset);
  }
  }
 
function decorateTile(coords, piece, decorator, group, opacity, zOffset = 0.00) {
  let meshTile = tiles.getTileMesh(context.tileMap, coords);

  if (!meshTile) {
    const pos = coords;
    const tile = tiles.getTileAttributes(pos);

    meshTile = tiles.createMeshTile(tile, context.tileGeometry, pos);

    // --- Visual setup ---
    meshTile.material.forEach(mat => {
      mat.transparent = true;
      mat.opacity = opacity;
    });

    meshTile.children.forEach(child => {
      if (child.type === "LineSegments") {
        child.material.transparent = true;
        child.material.opacity = opacity;
      }
    });

    // --- Tile identity ---
    meshTile.userData = {
      isTile: true,
      coords: pos,
      faceColor: tile.faceColor,
      isOffboard: true,

      // ✅ REQUIRED: ownership tag
      entry: group.userData.entry
    };

    // --- Attach to group (ownership root) ---
    group.add(meshTile);
  }

  const faceColor = meshTile.userData.faceColor;

  const overlays = decorators.decorate(faceColor, meshTile, piece, decorator, zOffset);

  if (overlays) {
    overlays.forEach(o => {
      o.userData = o.userData || {};

      o.userData.parentTile = meshTile;
      o.userData.isOverlay = true;

      // ✅ REQUIRED: ownership tag
      o.userData.entry = group.userData.entry;
    });

    // ✅ REQUIRED: tracked overlays for fast removal
    group.userData.overlays.push(...overlays);
  }
}
function decorateTile1(coords, piece, decorator, group, opacity, zOffset=0.00) {
  let meshTile = tiles.getTileMesh(context.tileMap, coords);
  if (!meshTile) {

    let pos = coords;
    let tile = tiles.getTileAttributes(pos);
    meshTile = tiles.createMeshTile(tile, context.tileGeometry, pos);
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
    overlays.forEach(o => {
      o.userData = o.userData || {};
      o.userData.parentTile = meshTile;
      o.userData.isOverlay = true;
      o.userData.entry = group.userData.entry;
    });

    group.userData.overlays.push(...overlays);
  }
}
// Seampoint: more local functions...

