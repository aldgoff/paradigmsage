/* File: advsqs.js
  Path: ./3dc/advsqs/advsqs.js
  Purpose: Place the decorators on the board for the advsq.
  Author: Allan Goff
  Date: 4/15/26
  Recommended access: import * as advsqs.
  UI: the export functions.
*/

// --- Load JSON ---
import advsqsData from "./advsqs.json" assert { type: "json" };
  const advsqsModule = advsqsData.advsqs_module;
  const category  = advsqsModule.category;
  // Seampoint: more objects.

// --- Build upon previous layers ---
import * as utils  from "../../../utils/debug.js";            // snapshot(obj) - (debugging as needed).

  import * as state    from "../../model/state/state.js";
  import * as coords   from "../../foundation/coords/coords.js";
  import * as planes   from "../../geometry/planes.js";
  import * as quads    from "../../geometry/quads.js";
  import * as overlaps from "../../geometry/overlapTiles.js";
  import * as advSqs   from "../../geometry/advSqs.js";

  import * as view       from "../view.js";
  import * as tiles      from "../tiles/tiles.js";
  import * as decorators from "../decorators/decorators.js";
  import * as cameras    from "../render/cameras.js";
  import * as renders    from "../render/renders.js";
  import * as coordsMaps from "../render/coordsMaps.js"
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
  console.log("view : advsqs.js - getAdvsqPanelParams():");

  const panel = document.getElementById("advsq-window");
  if (!panel) return;

  const params = {
    srcTile:   panel.querySelector('[name="advsq-src"]')?.value,
    quad:      panel.querySelector('[name="advsq-quad"]')?.value,
    // plane:     panel.querySelector('[name="advsq-plane"]')?.textContent,
    perimeter: panel.querySelector('[name="advsq-perimeter"]')?.value,
    // length:    panel.querySelector('[name="advsq-length"]')?.textContent,
    stride:    panel.querySelector('[name="advsq-stride"]')?.value,
    // tile:      panel.querySelector('[name="advsq-tile"]')?.textContent,
    opacity:   panel.querySelector('[name="advsq-opacity"]')?.value,
  };

  return params;
  }

export function setAdvsqPanelParams(params) {
  console.log("view : advsqs.js - setAdvsqPanelParams(params):", utils.snapshot(params));

  const panel = document.getElementById("advsq-window");
  if (!panel) return;

  const quad      = params.quad;                                                  // Use the passed in primary fields.
  const perimeter = params.perimeter;;
  const stride    = params.stride;

  const derived = computeAdvsqDerived({quad, perimeter, stride});                 // Compute derived fields.
  // console.log("derived", derived);

  panel.querySelector('[name="advsq-nickname"]').textContent = derived.nickname;  // Update derived fields.
  panel.querySelector('[name="advsq-plane"]').textContent    = derived.plane;
  panel.querySelector('[name="advsq-quadType"]').textContent = derived.quadType;
  panel.querySelector('[name="advsq-length"]').textContent   = derived.length;
  panel.querySelector('[name="advsq-tile"]').textContent     = derived.tile;

  const srcTileStr = coords.vtsToBoard(params.srcTile);
  panel.querySelector('[name="advsq-src"]').value          = srcTileStr;          // Update the primary fields.
  panel.querySelector('[name="advsq-quad"]').value         = params.quad;
  panel.querySelector('[name="advsq-perimeter"]').value    = params.perimeter;
  panel.querySelector('[name="advsq-stride"]').value       = params.stride;
  panel.querySelector('[name="advsq-opacity"]').value      = params.opacity;
  }

export function specsToPanelParams(specs) {
  console.log("view : advsqs.js - specsToPanelParams(specs):", specs);

  if(!specs) return getAdvsqPanelInitialParams();

  const spec = getActiveBoardSpec();
  // TODO: get boardspec from setup panel.
  // const spec = coords.getBoardSpec("8x8x8");
  console.log("   specs", specs);
  let src = coords.vtsToBoard(specs.srcTile, spec);
  console.log("   spec", spec);

  return {
    srcTile:   specs.srcTile,
    quad:      specs.quad,
    perimeter: specs.perimeter,
    stride:    specs.stride,
    opacity:   specs.opacity
  };
  }

export function makeAdvsq(specs) {
  console.log("view : advsqs.js - makeAdvsq(specs):", specs);

  clearAdvsq();

  const group = view.buildAdvSqGroup(specs);


  view.context.scene.add(group);
  currentAdvsq = group;
  }

export function clearAdvsq() {
  // console.log("view : advsqs.js - clearAdvsq():");

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

export function computeAdvsqDerived({ quad, perimeter, stride }) {
  // console.log("view : advsqs.js - computeAdvsqDerived()", { quad, perimeter, stride });

  // --- normalize types ---
  const q = Number(quad);
  const k = Number(perimeter);
  const s = Number(stride);
  // const q = quad;
  // const k = perimeter;
  // const s = stride;

  const rec = quads.pqrTable(q);
  const nickname = rec?.nickname ?? "";
  const plane    = rec?.plane ?? "";
  const quadType = rec?.quadType ?? "";

  const length = 2 * k + 1;

  const maxStride = 2 * k + 1;

  let apex = "Apex";
  if (rec?.quadType === "face") apex = "Duplex";

  let tile = "";
  if (s === 1)               tile = "E1";
  else if (s === k + 1)      tile = apex;
  else if (s === maxStride)  tile = "E2";
  else                       tile = "Body";

  return { nickname, plane, quadType, length, tile };
}
// Seampoint: more local functions.

// --- Utilities ---
function isSame(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

// Seampoint: more utility functions.

