/* File: boards.js
  Path: ./3dc/boards/boards.js
  Purpose: Create a 3D chess board, add to scene, delete previous.
  Author: Allan Goff
  Date: 4/14/26
  UI: the export functions.
*/

// --- Load JSON ---
import boardsData from "./boards.json" assert { type: "json" };
  const boardsModule = boardsData.boards_module;
  const category  = boardsModule.category;
  // Seampoint: more objects.

// --- Build upon previous layers ---
import {vts2xyz,
        xyz2vts,
        vts2pixels,
        pixels2vts,
} from "../render/coordsMaps.js"

import * as tiles from "../tiles/tiles.js";
import * as view from "../view.js";
import * as decorators from "../decorators/decorators.js";
import * as cameras from "../render/cameras.js";
import * as renders from "../render/renders.js";
// Seampoint: more imports.

let currentBoard = null;

// --- UI ---
export function makeBoard(dimensions) {
  console.log("view: boards.js - makeBoard(dimensions):", dimensions);

  if(currentBoard) { view.context.scene.remove(currentBoard); }

  const Z = dimensions[0]/2;  // 8.
  const X = dimensions[1]/2;  // 8.
  const Y = dimensions[2]/2;  // 8.
  const Sz = Z - dimensions[0] + 1;
  const Sx = X - dimensions[1] + 1;
  const Sy = Y - dimensions[2] + 1;
  // console.log("dims:", Sz, Sx, Sy, Z, X, Y);

  const boardGroup = new THREE.Group();

  const tileGeometry = view.context.tileGeometry  // ✅
  const tileMap = view.context.tileMap;   // ✅ SHARED

  let count = 0;
  for(let z=Sz; z<=Z; z++) {  // Create the board.
    for(let x=Sx; x<=X; x++) {
      for(let y=Sy; y<=Y; y++) {
        let pos = [z, x, y];
        let tile = tiles.getTileAttributes(pos);
        let meshTile = tiles.createMeshTile(tile, tileGeometry, pos);
        initTileUserData(meshTile, tile, pos, tileMap);
        boardGroup.add(meshTile); // Add tile to board.
        count++;
      }
    }
  }
  view.context.scene.add(boardGroup);              // Add board to scene.
  currentBoard = boardGroup;

  addEventListener(view.context.scene, view.context.renderer, view.context.camera, tileMap);
  }

export function clearBoard() {
  if (currentBoard) {
    view.context.scene.remove(currentBoard);
    currentBoard = null;
  }
}
// Seampoint: more global functions.

// --- Helpers ---
function initTileUserData(meshTile, tile, pos, tileMap) {
  meshTile.userData.isTile = true;
  meshTile.userData.coords = pos;
  meshTile.userData.decorated = false;
  meshTile.userData.overlays = [];
  meshTile.userData.faceColor = tile.faceColor;

  tileMap.set(pos.join(","), meshTile);
  }

function addEventListener(scene, renderer, camera, tileMap) {
  renderer.domElement.addEventListener("click", (event) => {
  const coords = getTileFromClick(event, camera, scene, renderer);

  if (!coords) return;

  // → here you trigger decorator logic
  const meshTile = tiles.getTileMesh(tileMap, coords);

  if (meshTile) {
    toggleDecorator(meshTile);  // Hard coded for now as src or dst.
  }
  });
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

