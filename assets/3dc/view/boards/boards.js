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

// --- Build upon previous layers ---
  import * as foundation from "../../foundation/colors/colors.js";
  import * as view       from "../view.js";
  import * as tiles      from "../tiles/tiles.js";
  import * as decorators from "../decorators/decorators.js";
  import * as coordsMaps from "../../view/render/coordsMaps.js";
// Seampoint: more imports...

// --- Globals ---
  let currentBoard = null;
  let clickHandler = null;
// Seampoint: more globals.

// --- UI ---
export function render(setup) {
  console.log("view : boards.js - render(setup)", setup);

  const dims = setup.boardSize.split("x").map(Number);
  makeBoard(dims);
  }

export function clear(setup) {
  console.log("view : boards.js - clear(setup)", setup);

  clearBoard();
}

// --- UI ---
export function makeBoard(dimensions) {
  console.log("view : boards.js - makeBoard(dimensions):", dimensions);

  if(currentBoard) { clearBoard(); }

  const Z = dimensions[0]/2;  // 8.
  const X = dimensions[1]/2;  // 8.
  const Y = dimensions[2]/2;  // 8.
  const Sz = Z - dimensions[0] + 1;
  const Sx = X - dimensions[1] + 1;
  const Sy = Y - dimensions[2] + 1;
  // console.log("dims:", Sz, Sx, Sy, Z, X, Y);

  const boardGroup = new THREE.Group();

  let count = 0;
  for(let z=Sz; z<=Z; z++) {  // Create the board.
    for(let x=Sx; x<=X; x++) {
      for(let y=Sy; y<=Y; y++) {
        let pos = [z, x, y];
        let tile = tiles.getTileAttributes(pos);
        let meshTile = tiles.createMeshTile(tile, view.context.tileGeometry, pos);
        tiles.initTileUserData(meshTile, tile, pos, view.context.tileMap);

        if(isPrimaryPlaneMarker(tile, pos)) {        // Primary plane markers.
          const marker = makePrimaryPlaneMarker();
          meshTile.add(marker);
        }
        boardGroup.add(meshTile); // Add tile to board.
        count++;
      }
    }
  }
  view.context.scene.add(boardGroup);              // Add board to scene.
  currentBoard = boardGroup;

  addEventListener(view.context.scene, view.context.renderer, view.context.camera, view.context.tileMap);
  }

export function clearBoard() {
  console.log("view : boards.js - clearBoard()...view.context:", view.context);
  if (currentBoard) {
    view.context.scene.remove(currentBoard);
    console.log(
      "Scene children:",
      view.context.scene.children.map(c => c.type)
    );
    // console.log("scene.children.length", view.context.scene.children.length);
    currentBoard = null;
  }

  view.context.tileMap.clear();
  }

export function setBoardSep(levelSep) {
  console.log("view : boards.js - setBoardSep(levelSep):", levelSep);

  if(!currentBoard) return;

  view.reprojectGroup(currentBoard, levelSep);

  /* TODO: Board level separaion control flow
   * 1.
   */

  // currentBoard.traverse(tile => {
  //   if(!tile.userData?.isTile) return;

  //   const pixels = coordsMaps.vts2pixels(tile.userData.vts, levelSep);
  //   tile.position.set(...pixels);
  // });
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

function addEventListener(scene, renderer, camera, tileMap) {
  if (clickHandler) {
    renderer.domElement.removeEventListener("click", clickHandler);
  }

  clickHandler = (event) => {
    const coords = getTileFromClick(event, camera, scene, renderer);
    if (!coords) {
      console.log("Ray casting: click off board.");
      return;
    }

    const meshTile = tiles.getTileMesh(tileMap, coords);
    if (meshTile) {
      toggleDecorator(meshTile);
    }
  };

  renderer.domElement.addEventListener("click", clickHandler);
  }

function getTileFromClick(event, camera, scene, renderer) {
  const THREE = window.THREE;

  // --- Mouse → normalized device coords (-1 to +1) ---
  const rect = renderer.domElement.getBoundingClientRect();

  const mouse = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );

  // --- Raycast ---
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length === 0) return null;

  // --- Get first hit ---
  let obj = intersects[0].object;

  // Walk up to tile mesh (in case we hit overlay/edges)
  while (obj && !obj.userData?.isTile) {
    obj = obj.parent;
  }

  if (!obj) return null;

  return obj.userData.coords;  // ← your VTS coords
  }

function toggleDecorator(meshTile) {
  if (meshTile.userData.decorated) {      // --- REMOVE overlays ---
    meshTile.userData.overlays.forEach(o => meshTile.remove(o));
    meshTile.userData.overlays = [];
    meshTile.userData.decorated = false;
  } else {                                // --- ADD overlays ---
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
}
// Seampoint: more local functions...

/* TODO: QC checklist
  1) Move addEventListener out of makeBoard into one-time init
  2) ✅ Remove implicit teardown inside makeBoard; enforce clearBoard as sole inverse
  3) Restrict raycasting to currentBoard instead of scene.children
  4) ✅ Eliminate dual use of tileMap (global vs parameter); choose one model
  5) Replace window.THREE with explicit module import
  6) ✅ Ensure tileMap.clear() is always called before new board construction
  7) Add guard for meshTile.userData.overlays before iteration
  8) ✅ Add temporary diagnostics for missed clicks (coords === null)
  9) ✅ Remove unused imports (cameras, renders)
  10) ✅ Ensure event listener is singular (maintain invariant)
  11) Validate no stray scene nodes remain beyond currentBoard
  12) Verify tiles.initTileUserData does not retain cross-board references
  13) Confirm getTileMesh never returns stale mesh after tileMap.clear()
  14) Ensure currentBoard is the only authoritative board reference
  15) Add sanity checks for board dimension consistency during rebuild
*/

