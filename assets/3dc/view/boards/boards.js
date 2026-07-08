/* File: boards.js
  Path: ./3dc/view/boards/boards.js
  Purpose: Create a 3D chess board, add to scene, delete previous.
  Author: Allan Goff
  Date: 4/14/26
  QC: 5/8/26
  Recommended access: import * as vBoards from "../../view/boards/boards.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import boardsData from "./boards.json" assert { type: "json" };
  const boardsModule = boardsData.boards_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as foundation from "../../foundation/colors/colors.js";
  import * as view       from "../view.js";
  import * as tiles      from "../tiles/tiles.js";
  import * as decorators from "../decorators/decorators.js";
// Seampoint: more imports...

// --- Globals ---
  let currentBoardGroup = null;
// Seampoint: more globals.

// --- UI ---
export function destroyBoards() {
  console.log("view : boards.js - destroyBoards()");

  clearBoard(currentBoardGroup);
  }


export function render(board) {
  console.log("view : boards.js - render(board)", board);

  const { boardSize, trayType, trayGap } = board;

  const dims = boardSize.split(/[x-]/).map(Number);
  makeBoard(dims);
  }

export function clear(board) {
  console.log("view : boards.js - clear(entry)", board);

  const { boardSize, trayType, trayGap } = board;

  clearBoard(board);
}

export function makeBoard(dimensions) {
  console.log("view : boards.js - makeBoard(dimensions):", dimensions);

  if(currentBoardGroup) { clearBoard(); }

  const Z = dimensions[0]/2;  // 8.
  const X = dimensions[1]/2;  // 8.
  const Y = dimensions[2]/2;  // 8.
  const Sz = Z - dimensions[0] + 1;
  const Sx = X - dimensions[1] + 1;
  const Sy = Y - dimensions[2] + 1;
  // console.log("dims:", Sz, Sx, Sy, Z, X, Y);

  const boardGroup = new THREE.Group();
  boardGroup.name = "Board";

  let count = 0;
  for(let z=Sz; z<=Z; z++) {  // Create the board.
    for(let x=Sx; x<=X; x++) {
      for(let y=Sy; y<=Y; y++) {
        let pos = [z, x, y];
        let tile = tiles.getTileAttributes(pos);
        let meshTile = tiles.createMeshTile(tile, view.getContext().tileGeometry, pos);
        tiles.initTileUserData(meshTile, tile, pos, view.getContext().tileMap);

        if(isPrimaryPlaneMarker(tile, pos)) {        // Primary plane markers.
          const marker = makePrimaryPlaneMarker();
          meshTile.add(marker);
        }
        boardGroup.add(meshTile); // Add tile to board.
        count++;
      }
    }
  }
  view.getContext().scene.add(boardGroup);              // Add board to scene.
  currentBoardGroup = boardGroup;
  }

export function clearBoard(board) {
  console.log("view : boards.js - clearBoard(board):", board);

  if(currentBoardGroup) {
    view.getContext().scene.remove(currentBoardGroup);
    currentBoardGroup = null;
  }

  view.getContext().tileMap.clear();
  }

export function setLevelSep(levelSep) {
  console.log("view : boards.js - setLevelSep(levelSep):", levelSep);

  if(!currentBoardGroup) return;

  view.reprojectGroup(currentBoardGroup, levelSep);
  }

export function decorateTile(meshTile) {
  const face = meshTile.userData.faceColor;
  const layers = decorators.applyBaseZones({
    base: face,
    zones: ["#111111", "#111111", face, face ]
  });

  const overlays = layers.map(layer => {
    const circle = decorators.drawInsetCircle(meshTile, layer.scale, layer.color);
    meshTile.add(circle);
    return circle;
  });

  meshTile.userData.overlays = overlays;
  meshTile.userData.decorated = true;
  }

export function undecorateTile(meshTile) {
  meshTile.userData.overlays.forEach(o => meshTile.remove(o));
  meshTile.userData.overlays = [];
  meshTile.userData.decorated = false;
}
// Seampoint: more global functions...

// --- Helpers ---
function isPrimaryPlaneMarker(tile, pos) {
  // console.log("view : boards.js - isPrimaryPlaneMarker(tile, pos):", tile, pos);

  const [, x, y] = pos;

  if(x !== y) return false; // Primary plane only.

  const dukeColor = foundation.dukeColorVts(pos);    // Duke color depends on position.

  return (dukeColor === "gold");
  }

function makePrimaryPlaneMarker() {
  const THREE = window.THREE;

  const geometry =
    new THREE.SphereGeometry(
      6,      // radius
      16,     // width segs
      16,     // height segs
      0,
      Math.PI * 2,
      0,
      Math.PI / 2
    );

  // TODO: solve the level fighting between dots and decorators.
  const material = new THREE.MeshPhongMaterial({ color: 0x111111 });
  const marker = new THREE.Mesh( geometry, material);

  return marker;
}
// Seampoint: more local functions...

/* TODO: QC checklist
  1) Move addEventListener out of makeBoard into one-time init
  2) ✅ Remove implicit teardown inside makeBoard; enforce clearBoard as sole inverse
  3) Restrict raycasting to currentBoardGroup instead of scene.children
  4) ✅ Eliminate dual use of tileMap (global vs parameter); choose one model
  5) Replace window.THREE with explicit module import
  6) ✅ Ensure tileMap.clear() is always called before new board construction
  7) Add guard for meshTile.userData.overlays before iteration
  8) ✅ Add temporary diagnostics for missed clicks (coords === null)
  9) ✅ Remove unused imports (cameras, renders)
  10) ✅ Ensure event listener is singular (maintain invariant)
  11) Validate no stray scene nodes remain beyond currentBoardGroup
  12) Verify tiles.initTileUserData does not retain cross-board references
  13) Confirm getTileMesh never returns stale mesh after tileMap.clear()
  14) Ensure currentBoardGroup is the only authoritative board reference
  15) Add sanity checks for board dimension consistency during rebuild
*/

