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

// --- Dependencies ---
  import * as state      from "../../model/state/state.js";
  import * as view       from "../view.js";
  import * as vTiles     from "../tiles/tiles.js";
  import * as vPieces    from "../../view/pieces/pieces.js";
  import * as coordsMaps from "../../view/render/coordsMaps.js";
// Seampoint: more imports...

// --- Globals ---
  let whiteTrayGroup = null;
  let blackTrayGroup = null;
  let lastTrayGap    = 0;
  let lastLevelSep   = 1.0;
  let traysVisible   = true;
// Seampoint: more globals.

export function getWhiteTrayGroup() { return whiteTrayGroup; }
export function getBlackTrayGroup() { return blackTrayGroup; }
// --- UI ---
export function makeTrays(entry) {
  console.log("view : trays.js - makeTrays(entry)", entry);

  const { action, boardSize, trayType, trayGap } = entry;

  // destroyTrays();

  whiteTrayGroup = makeTrayGroup("White", entry);
  blackTrayGroup = makeTrayGroup("Black", entry);

  view.getContext().scene.add(whiteTrayGroup);
  view.getContext().scene.add(blackTrayGroup);

  traysVisible = true;
  }

export function destroyTrays() {
  console.log("view : trays.js - destroyTrays()");

  if(whiteTrayGroup) {
    view.getContext().scene.remove(whiteTrayGroup);
    whiteTrayGroup = null;
  }

  if(blackTrayGroup) {
    view.getContext().scene.remove(blackTrayGroup);
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
// Seampoint: more global functions...

// --- Helpers ---
function makeTrayGroup(side, entry) {
  console.log("view : trays.js - makeTrayGroup(side, entry)", side, entry);

  const { action, boardSize, trayType, trayGap } = entry;

  const trayGroup = new window.THREE.Group();
  trayGroup.name = `${side}`;
  console.log("*** side, trayGroup.name, boardSize", side, trayGroup.name, boardSize);

  const trayData = traysModule[boardSize][side];

  buildTrayColumn(trayGroup, trayData.pieces, side, trayGap);
  buildTrayColumn(trayGroup, trayData.pawns,  side, trayGap);

  return trayGroup;
  }

function buildTrayColumn(trayGroup, columnData, side, gap) {
  console.log("view : trays.js - buildTrayColumn(...)", columnData, side, gap);

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
  const geometry = view.getContext().tileGeometry;
  const tile = vTiles.getTileAttributes(logicalPos);  // Bishop/duke colors derive from logical coords (vts).
  const meshTile = vTiles.createMeshTile(tile, geometry, renderPos); // Create mesh in the render position.

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

function reprojectTray(group, levelSep, trayGap) {
  console.log("view : trays.js - reprojectTray(group, levelSep, trayGap))", group, levelSep, trayGap);

  group.traverse(tile => {
    if(tile.userData?.isTrayTile) {
      reprojectMesh(tile, levelSep, trayGap);
    }
  });  
}
// Seampoint: more local functions...

