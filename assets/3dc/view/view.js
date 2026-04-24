/* File: view.js
  Path: ./3dc/view/view.js
  Purpose: Interface to the view layer, render board, wire the panels, and add event listeners.
  Author: Allan Goff
  Date: 4/02/26
  Recommended access: import * as view.
  UI: the export functions.
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
import * as game       from "../controller/game/game.js";

  import * as advSqs   from "../geometry/advSqs.js";
  import * as decorators from "./decorators/decorators.js";
  import * as quads    from "../geometry/quads.js";

// Seampoint: more imports...

export let context;

// --- Demo for development ---
function demo(playBoard) {
  if (!playBoard) return false;

  const context = renders.init(playBoard);

  demos.run(context);

  return;
}

// --- UI ---
export function init(playBoard) { // PlayBoard is the 3D canvas from the THREE renderer.
  console.log("view.init(): 3dc/view/init.js");

  if(false) {  // POC.
    const context = demo(playBoard); // Display POC board, decorators, raycasting.
  }
  else {      // Growing the panel and undo features.
    context = renders.init(playBoard);
    context.tileMap = new Map();
    context.tileGeometry = new THREE.BoxGeometry(...coordsMaps.vts2xyz(tiles.tileSize()));
    // demos.run(context);
  }

  // Listeners: (The move listing is purely output, no input, therefore no wiring todo.)

  // wireSimplePanel("tray-window",   "tray",   buildTrayPayload);  // btn.disabled = false;

  wireSetupPanel( "setup-window",  "setup",  buildSetupPayload);
  wireSimplePanel("game-window",   "game",   buildGamePayload);
  wireSimplePanel("gambit-window", "gambit", buildGambitPayload);
  wireAdvsqPanel( "advsq-window",  "advsq",  buildAdvsqPayload);

  window.addEventListener("keydown", handleAdvsqKeys);

  wireSimplePanel("camera-window", "camera", buildCameraPayload); // Not subject to the undo arch.
  // Seampoint - more listeners...

  game.showUndoStatus();

  return;
}

export function buildAdvSqGroup(specs) {
  const group = new THREE.Group();

  const { srcTile, quad, perimeter, stride, opacity } = specs;

  const advsq = advSqs.AdvSq.fromQuad(srcTile, quad, perimeter);
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
// --- Helpers ---
// TODO: consolidate duplicated functions.
function decoratePerimeter(lastPerim, perim, piece, quadType, group, opacity, strideNo, zOffset=0.00) {
  // console.log("view : advsqs.js - decoratePerimeter(perim)", perim);
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
  let meshTile = tiles.getTileMesh(context.tileMap, coords);
  // let meshTile = tiles.getTileMesh(view.context.tileMap, coords);
  if (!meshTile) {
    // TODO: Need to create a tile mesh for this tile with high transparency.

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
    group.userData.overlays = group.userData.overlays || [];
    group.userData.overlays.push(...overlays);
  }
}

// --- Utilities ---
function isSame(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

// Seampoint: more global functions...

// --- Helpers ---
function wireSimplePanel(panelId, callbackName, buildPayload) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  const cb = run.callback[callbackName];
  if (!cb) return;

  // --- Radios (change → immediate action) ---
  panel.addEventListener("change", (e) => {
    const radio = e.target.closest('input[type="radio"]');
    if (!radio) return;

    const action = radio.dataset.action;
    if (!action) return;

    cb({
      action,
      value: radio.value
    });
  });

  // --- Buttons (click → full payload) ---
  panel.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    if (!action) return;

    const payload = buildPayload(panel, action);
    cb(payload);
  });
  }

function wireSetupPanel(panelId, callbackName, buildPayload) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  const cb = run.callback[callbackName];
  if (!cb) return;

  // --- Change events (ALL inputs → full payload) ---
  panel.addEventListener("change", (e) => {
    // const input = e.target.closest("input");
    const input = e.target.closest('input[name="tray-gap"]');
    if (!input) return;

    const payload = buildPayload(panel, "updateParam");
    cb(payload);
  });

  // --- Click events (buttons → full payload with action) ---
  panel.addEventListener("click", (e) => {
    // ignore radios (handled in change)
    if (e.target.closest('input[type="radio"]')) return;

    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    if (!action) return;

    const payload = buildPayload(panel, action);
    cb(payload);
  });
  }

function wireAdvsqPanel(panelId, callbackName, buildPayload) {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  const cb = run.callback[callbackName];
  if (!cb) return;

  // --- Change events (ALL inputs → full payload) ---
  panel.addEventListener("change", (e) => {
    const input = e.target.closest("input");
    if (!input) return;

    const payload = buildPayload(panel, "updateParam");
    cb(payload);
  });

  // --- Click events (buttons → full payload with action) ---
  panel.addEventListener("click", (e) => {
    // ignore radios (handled in change)
    if (e.target.closest('input[type="radio"]')) return;

    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    if (!action) return;

    const payload = buildPayload(panel, action);
    cb(payload);
  });
}

function handleAdvsqKeys(e) {
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

function buildSetupPayload(panel, action) {
  console.log("     ---------- view: view.js");
  return {
    action,
    boardSize:  panel.querySelector('input[name="board-size"]:checked')?.value,
    trayType:   panel.querySelector('input[name="tray-type"]:checked')?.value,
    visible:    panel.querySelector('input[name="tray-visible"]')?.value,
    initialPos: panel.querySelector('input[name="initial-pos"]')?.value,
    trayGap:    panel.querySelector('input[name="tray-gap"]')?.value,
  };
  }

function buildTrayPayload(panel, action) {
  const selected = panel.querySelector('input[name="tray-type"]:checked')?.value;

  console.log("     ---------- view: view.js");
  return {
    action,
    trayType: selected?.value
  };
  }

function buildGamePayload(panel, action) {
  console.log("     ---------- view: view.js");
  return { action };
  }

function buildGambitPayload(panel, action) {
  console.log("     ---------- view: view.js");
  return { action };
  }

function buildAdvsqPayload(panel, action) {
  console.log("     ---------- view: view.js");
  return {
    action,
    srcTile:  panel.querySelector('[name="advsq-src"]')?.value,
    quad:     panel.querySelector('[name="advsq-quad"]')?.value,
    perimeter:panel.querySelector('[name="advsq-perimeter"]')?.value,
    stride:   panel.querySelector('[name="advsq-stride"]')?.value,
    opacity:  panel.querySelector('[name="advsq-opacity"]')?.value,
  };
}

function buildCameraPayload(panel, action) { // Not subject to the undo arch.
  return { action };
}

// Seampoint: more local functions...

