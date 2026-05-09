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
  import * as run        from "./registerHandlers.js";
  import * as renders    from "./render/renders.js";
  import * as coordsMaps from "./render/coordsMaps.js";
  import * as demos      from "./demos.js";
  import * as tiles      from "./tiles/tiles.js";

  import * as utils      from "../../../utils/utils.js";

  import * as game       from "../controller/game/game.js";
  import * as viewer     from "../controller/viewer/viewer.js";

  import * as vAdvsqs    from "../geometry/advsqs/advsqs.js";
  import * as decorators from "./decorators/decorators.js";
  import * as quads      from "../geometry/quads/quads.js";

  import * as cameras    from "../view/render/cameras.js";
// Seampoint: more imports...

export let context;   // Contains things like: scene, renderer, camera, tileMap...

// --- Demo for development ---
function demo(playBoard) {
  if (!playBoard) return false;

  const context = renders.init(playBoard);

  demos.run(context);

  return;
}

// --- UI ---
export function init(playBoard) {
  context = renders.init(playBoard);
  context.tileMap = new Map();
  context.tileGeometry = new THREE.BoxGeometry(...coordsMaps.vts2xyz(tiles.tileSize()));

  window.addEventListener("keydown", handleAdvsqKeys);  // TODO: find better home.

  game.showUndoStatus();
  const {range, speed} = viewer.getJitterValues();
  cameras.setJitter(range, speed);
}

export function buildAdvSqGroup(specs) { // Params: srcTile, quad, perimeter, stride, opacity.
  console.log("view : gambits.js - buildAdvSqGroup(specs).", specs);

  const group = new THREE.Group();

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
function decorateTile(coords, piece, decorator, group, opacity, zOffset=0.00) {
  let meshTile = tiles.getTileMesh(context.tileMap, coords);
  if (!meshTile) {
    const tileGeometry = new THREE.BoxGeometry(...coordsMaps.vts2xyz(tiles.tileSize()));

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
    overlays.forEach(o => {
      o.userData = o.userData || {};
      o.userData.parentTile = meshTile;
    });

    group.userData.overlays = group.userData.overlays || [];
    group.userData.overlays.push(...overlays);
  }
}

// function wirePanel(panelId, callbackName, buildPayload, options = {}) {
//   const panel = document.getElementById(panelId);
//   if (!panel) return;

//   const cb = run.callback[callbackName];
//   if (!cb) return;

//   panel.addEventListener("change", (e) => {
//     if (!options.onChangeFull) return;

//     const payload = buildPayload(panel, "updateParam");
//     cb(payload);
//   });

//   panel.addEventListener("click", (e) => {
//     const btn = e.target.closest("button");
//     if (!btn) return;

//     const action = btn.dataset.action;
//     if (!action) return;

//     const cb = run.callback[callbackName];
//     if (typeof cb !== "function") return;

//     const payload = buildPayload(panel, action);
//     cb(payload);
//   });
//   }

// function wirePanelButtons(panelId, callbackName, buildPayload, options = {}) {
//   const panel = document.getElementById(panelId);
//   if (!panel) return;

//   const cb = run.callback[callbackName];
//   if (!cb) return;

//   panel.addEventListener("click", (e) => {
//     const btn = e.target.closest("button");
//     if (!btn) return;

//     const action = btn.dataset.action;
//     if (!action) return;

//     const cb = run.callback[callbackName];
//     if (typeof cb !== "function") return;

//     const payload = buildPayload(panel, action);
//     cb(payload);
//   });
//   }

// function wireSimplePanel(panelId, callbackName, buildPayload) {
//   const panel = document.getElementById(panelId);
//   if (!panel) return;

//   const cb = run.callback[callbackName];
//   if (!cb) return;

//   // --- Radios (change → immediate action) ---
//   panel.addEventListener("change", (e) => {
//     const cb = run.callback[callbackName];
//     if (!cb) return;

//     const radio = e.target.closest('input[type="radio"]');
//     if (!radio) return;

//     const action = radio.dataset.action;
//     if (!action) return;

//     cb({
//       action,
//       value: radio.value
//     });
//   });

//   // --- Buttons (click → full payload) ---
//   panel.addEventListener("click", (e) => {
//     const btn = e.target.closest("button");
//     if (!btn) return;

//     const action = btn.dataset.action;
//     if (!action) return;

//     const payload = buildPayload(panel, action);
//     cb(payload);
//   });
// }

function handleAdvsqKeys(e) {
  // console.log("KEY EVENT", e.key);

  if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

  const cb = run.callback.advsq;
  if (!cb) return;

  let axis = null;
  let delta = 0;

  const shift = e.shiftKey;

  switch (e.key.toLowerCase()) {
    case "k": axis = "z"; delta = shift ? -1 : +1; break;
    case "i": axis = "x"; delta = shift ? -1 : +1; break;
    case "j": axis = "y"; delta = shift ? -1 : +1; break;
    default: return;
  }

  e.preventDefault(); // <-- ALSO IMPORTANT

  cb({
    action: "nudgeSrc",
    axis,
    delta
  });
}
// Seampoint: more local functions...

