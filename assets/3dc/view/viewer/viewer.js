/* File: viewer.js
  Path: ./3dc/view/viewer/viewer.js
  Purpose: desc
  Author: Allan Goff
  Date: 5/17/26
  Recommended access: import * as vViewer from ../../view/viewer/viewer.js
  UI: the export functions.
*/

// --- Load JSON ---
import viewerData from "./viewer.json" assert { type: "json" };
  const viewerModule = viewerData.viewer_module;
  const eight = viewerModule["8x8x8"];
  const ten   = viewerModule["10x8x8"];
  const tens  = viewerModule["10x10x10"];
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as game       from "../../controller/game/game.js";
  import * as state      from "../../model/state/state.js";
  import * as view       from "../view.js";
  import * as tiles      from "../tiles/tiles.js";
  import * as coordsMaps from "../render/coordsMaps.js";
// Seampoint: more imports...

// --- Globals ---
const THREE = window.THREE;

let whiteTrayGroup = null;
let blackTrayGroup = null;

let traysVisible = false;

let gap = 1;
const minGap = 0;
const maxGap = 3;

let tileColor = 0xd8c0a8;  // Light brown.

// --- UI ---
export function showTrays() {
  console.log("view: viewer.js - showTrays()");

  clearTrays();

  whiteTrayGroup = makeTrayGroup("White");
  blackTrayGroup = makeTrayGroup("Black");

  view.context.scene.add(whiteTrayGroup);
  view.context.scene.add(blackTrayGroup);

  traysVisible = true;
  }

export function hideTrays() {
  console.log("view: viewer.js - hideTrays()");

  clearTrays();

  traysVisible = false;
  }

export function setTrayGap(newGap) {
  console.log("view: viewer.js - setTrayGap(newGap)", newGap);

  gap = Math.max(minGap, Math.min(maxGap, newGap));

  if (!traysVisible) return;

  showTrays(); // rebuild at new gap
  }

export function setTraySep(sep) {
  console.log("view: viewer.js - setTraySep(sep)", sep);
  // TODO: write setTraySep function.

  }

export function refreshTrays() {
  console.log("view: viewer.js - refreshTrays()");
  if(!traysVisible) return;

  showTrays();
}
// Seampoint: more global functions...

// --- Helpers ---
function clearTrays() {
  if(whiteTrayGroup) {
    view.context.scene.remove(whiteTrayGroup);
    whiteTrayGroup = null;
  }

  if(blackTrayGroup) {
    view.context.scene.remove(blackTrayGroup);
    blackTrayGroup = null;
  }
  }

function makeTrayGroup(side) {
  console.log("view: viewer.js - makeTrayGroup(side)", side);

  const trayGroup = new THREE.Group();

  const setup = state.fetchCurrentState("Setup");
  if(!setup) return trayGroup;

  const { boardSize } = setup;

  const trayData = viewerModule[boardSize][side];

  buildTrayColumn(trayGroup, trayData.pieces, side);
  buildTrayColumn(trayGroup, trayData.pawns, side);

  return trayGroup;
  }

function buildTrayColumn(trayGroup, columnData, side) {
  console.log("view: viewer.js - buildTrayColumn(...)", trayGroup, columnData, side);

  Object.entries(columnData)
    .forEach(([key, pos]) => {

      const shifted = applyGap(pos, side);

      // preserve logical bishop parity?
      const meshTile = makeTrayTile(pos, shifted);

      meshTile.userData.isTrayTile = true;
      meshTile.userData.side = side;
      meshTile.userData.key = key;

      trayGroup.add(meshTile);
    });
  }

function applyGap(pos, side) {
  const [z, x, y] = pos;

  const sign = (side === "White") ? -1 : 1;

  return [z, x + sign * gap, y + sign * gap];
  }

function makeTrayTile(logicalPos, renderPos) {
  const geometry = view.context.tileGeometry;

  // bishop/duke colors derive from ORIGINAL logical coords
  const tile = tiles.getTileAttributes(logicalPos);

  // render position uses shifted coords
  const meshTile = tiles.createMeshTile(tile, geometry, renderPos);

  meshTile.material.forEach((mat, idx) => {
    // face surfaces only
    if(idx === 2 || idx === 3) {
      mat.color.set(tileColor);
    }
  });

  return meshTile;
}
// Seampoint: more local functions...

