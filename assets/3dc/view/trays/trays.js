/* File: trays.js
  Path: ./3dc/view/trays/trays.js
  Purpose: Render trays.
  Author: Allan Goff
  Date: 5/05/26
  Recommended access: import * as vTrays from "../../view/trays/trays.js";
  UI: the export functions.
*/

// --- Load JSON ---
import traysData from "./trays.json" assert { type: "json" };
  const traysModule = traysData.trays_module;
  const traySpecs = traysModule.tray_specs;
  const eight     = traysModule["8x8x8"];
  const ten       = traysModule["10x8x8"];
  const tens      = traysModule["10x10x10"];
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as state      from "../../model/state/state.js";
  import * as view       from "../view.js";
  import * as tiles      from "../tiles/tiles.js";
  import * as coordsMaps from "../../view/render/coordsMaps.js";
  import * as vPieces    from "../../view/pieces/pieces.js";
// Seampoint: more imports...

// --- Globals ---
  const THREE = window.THREE;

  let whiteTrayGroup = null;
  let blackTrayGroup = null;
  let lastTrayGap    = 0;
  let lastLevelSep   = 1.0;

  let traysVisible = true;
// Seampoint: more globals.

// --- UI ---
export function makeTrays(gap) {
  console.log("view : trays.js - makeTrays(gap)", gap);

  destroyTrays();

  whiteTrayGroup = makeTrayGroup("White", gap);
  blackTrayGroup = makeTrayGroup("Black", gap);

  view.context.scene.add(whiteTrayGroup);
  view.context.scene.add(blackTrayGroup);

  traysVisible = true;
  }

export function destroyTrays() {
  if(whiteTrayGroup) {
    view.context.scene.remove(whiteTrayGroup);
    whiteTrayGroup = null;
  }

  if(blackTrayGroup) {
    view.context.scene.remove(blackTrayGroup);
    blackTrayGroup = null;
  }
  }

export function setLevelSep(levelSep) {
  // console.log("view : trays.js - setLevelSep(levelSep)", levelSep);

  lastLevelSep = levelSep;

  if(!traysVisible) return;

  reprojectTray(whiteTrayGroup, levelSep, -lastTrayGap);
  reprojectTray(blackTrayGroup, levelSep,  lastTrayGap);
  }

export function setTrayGap(trayGap) {
  // console.log("view : trays.js - setTrayGap(trayGap)", trayGap);

  lastTrayGap = trayGap;

  if(!traysVisible) return;

  reprojectTray(whiteTrayGroup, lastLevelSep, -trayGap);
  reprojectTray(blackTrayGroup, lastLevelSep,  trayGap);

  vPieces.reprojectTrayPieces(lastLevelSep, lastTrayGap);
  }

function reprojectTray(group, levelSep, trayGap) {
  console.log("view : trays.js - reprojectTray(group, levelSep, trayGap))", group, levelSep, trayGap);

  group.traverse(tile => {
    if(tile.userData?.isTrayTile) {
      reprojectMesh(tile, levelSep, trayGap);
    }
  });  
}
// Seampoint: more global functions...

// --- Helpers ---
function makeTrayGroup(side, gap) {
  // console.log("view : trays.js - makeTrayGroup(side)", side);

  const trayGroup = new THREE.Group();

  const setup = state.fetchCurrentState("Setup");
  if(!setup) return trayGroup;

  const { boardSize } = setup;

  const trayData = traysModule[boardSize][side];

  buildTrayColumn(trayGroup, trayData.pieces, side, gap);
  buildTrayColumn(trayGroup, trayData.pawns,  side, gap);

  return trayGroup;
  }

function buildTrayColumn(trayGroup, columnData, side, gap) {
  // console.log("view : trays.js - buildTrayColumn(...)", columnData, side, gap);

  Object.entries(columnData)
    .forEach(([key, pos]) => {

      const shifted = applyGap(pos, side, gap);
      const meshTile = makeTrayTile(pos, shifted);      // preserve logical bishop parity?

      meshTile.userData.isTrayTile = true;
      meshTile.userData.side = side;
      meshTile.userData.key = key;
      meshTile.userData.vts = pos;

      trayGroup.add(meshTile);
    });
  }

function applyGap(pos, side, gap) {
  const [z, x, y] = pos;

  const sign = (side === "White") ? -1 : 1;

  return [z, x + sign * gap, y + sign * gap];
  }

function makeTrayTile(logicalPos, renderPos) {
  const geometry = view.context.tileGeometry;
  const tile = tiles.getTileAttributes(logicalPos);  // Bishop/duke colors derive from logical coords (vts).
  const meshTile = tiles.createMeshTile(tile, geometry, renderPos); // Create mesh in the render position.

  meshTile.material.forEach((mat, idx) => {
    if(idx === 2 || idx === 3) {    // Tint face surfaces only.
      mat.color.set(traySpecs.color);
    }
  });

  return meshTile;
  }

function reprojectMesh(tile, levelSep, trayGap) {
  // console.log("view : trays.js - reprojectMesh(tile, levelSep, trayGap))", tile.userData, levelSep, trayGap);

  const [z,x,y] = tile.userData.vts;

  const shifted = [
    z,
    x + trayGap,
    y + trayGap
  ];

  const pixels = coordsMaps.vts2pixels(shifted, levelSep);

  tile.position.set(...pixels);
}
// Seampoint: more local functions...

