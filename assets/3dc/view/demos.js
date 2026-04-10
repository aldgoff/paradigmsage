
/* File: view.js
  Path: ./3dc/view/view.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/02/26
  UI: the export functions.
*/

// --- Load JSON ---
// Seampoint: more objects...

// --- Build upon previous layers ---
import { LAYOUT_3DC } from "../layout.js";

import {vts2xyz,
        xyz2vts,
        vts2pixels,
        pixels2vts,
} from "./render/coordsMaps.js"

import * as tiles from "./tiles/tiles.js";
import * as decorators from "./decorators/decorators.js";
import * as cameras from "./render/cameras.js";

import * as renders from "./render/renders.js";
// Seampoint: more imports...

// --- Demo for development ---
export function run(context) {
  const scene = context.scene;
  const camera = context.camera;
  const renderer = context.renderer;

  // Create frame for tiles, and a map to hold all the instantiated tiles.
  const tileGeometry = new THREE.BoxGeometry(...vts2xyz(tiles.tileSize()));
  const tileMap = new Map();

  runDemos(scene, renderer, camera, tileGeometry, tileMap);
}

// --- Demos ---
function runDemos(scene, renderer, camera, tileGeometry, tileMap) {
  demoBoard(scene, tileGeometry, tileMap);

  demoDecorators(scene, tileGeometry, tileMap);    // Create offboard tiles to test decorators.

  demoAdvSq(tileMap);

  demoDualDiamond(tileMap, [3,-2,-2], "rook", "linear2");
  demoDualDiamond(tileMap, [4,-2,-2], "rook", "linear1");
  demoDualDiamond(tileMap, [3,-1,-1], "bishop", "linear2");
  demoDualDiamond(tileMap, [4,-1,-1], "bishop", "linear1");
  
  demoTriDiamond(tileMap,  [2,0,0], "duke", "linear3");
  demoTriDiamond(tileMap,  [3,0,0], "duke", "linear2");
  demoTriDiamond(tileMap,  [4,0,0], "duke", "linear1");
  demoDualDiamond(tileMap, [3,1,1], "duke", "duplex");
  demoDualDiamond(tileMap, [4,1,1], "duke", "simplex");

  demoKnight(tileMap);

  demoCamera();

  addEventListener(scene, renderer, camera, tileMap);
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

function demoBoard(scene, tileGeometry, tileMap) {
  for(let z=-3; z<=4; z++) {  // Create an 8x8x8 board.
    for(let x=-3; x<=4; x++) {
      for(let y=-3; y<=4; y++) {
        let pos = [z, x, y];
        let tile = tiles.getTileAttributes(pos);
        let meshTile = tiles.createMeshTile(tile, tileGeometry, pos);
        initTileUserData(meshTile, tile, pos, tileMap);
        scene.add(meshTile);                            // Add to scene.
      }
    }
  }
  }

function demoDecorators(scene, tileGeometry, tileMap) {
  const examples = [
    { pos: [4,-4,-4], piece: "rook",   decorator: "end2" },
    { pos: [3,-4,-4], piece: "bishop", decorator: "end1" },
    { pos: [2,-4,-4], piece: "duke",   decorator: "apex" },
    { pos: [1,-4,-4], piece: "rook",   decorator: "body" },
    { pos: [0,-4,-4], piece: "bishop", decorator: "source" },
    { pos: [-1,-4,-4], piece: "queen", decorator: "qtile" },
    { pos: [-2,-4,-4], piece: "queen", decorator: "brook" },
    { pos: [-3,-4,-4], piece: "queen", decorator: "hotspot" },
    { pos: [-4,-4,-4], piece: "queen", decorator: "feynman" },
  ]

  for(const example of examples) {
    let pos = example.pos;
    let tile = tiles.getTileAttributes(pos);
    let meshTile = tiles.createMeshTile(tile, tileGeometry, example.pos);
    initTileUserData(meshTile, tile, pos, tileMap);
    scene.add(meshTile);                            // Add to scene.
    decorators.decorate(tile.faceColor, meshTile, example.piece, example.decorator);
  }
  }

function demoAdvSq(tileMap) {
  const advsqTiles = [
    { decorator: "source", coords: [0,0,0]}, 
    { decorator: "end2",   coords: [0,1,0]}, 
    { decorator: "apex",   coords: [0,1,1]}, 
    { decorator: "end2",   coords: [0,0,1]}, 
    { decorator: "end1",   coords: [0,2,0]},
    { decorator: "body",   coords: [0,2,1]},
    { decorator: "apex",   coords: [0,2,2]},
    { decorator: "body",   coords: [0,1,2]},
    { decorator: "end2",   coords: [0,0,2]}, 
  ]

  for(const tile of advsqTiles) {
    const meshTile = tiles.getTileMesh(tileMap, tile.coords);
    const faceColor = meshTile.userData.faceColor;
    decorators.decorate(faceColor, meshTile, "rook", tile.decorator);
  }
  }

function demoKnight(tileMap) {
  const advsqTiles = [
    { decorator: "source", coords: [ 1,-3,-3]}, 
    { decorator: "lite",   coords: [ 0,-1,-1]}, 
    { decorator: "lite",   coords: [-1,-2,-1]}, 
    { decorator: "lite",   coords: [-1,-1,-2]}, 
  ]

  for(const tile of advsqTiles) {
    const meshTile = tiles.getTileMesh(tileMap, tile.coords);
    const faceColor = meshTile.userData.faceColor;
    decorators.decorate(faceColor, meshTile, "knight", tile.decorator);
  }
  }

function demoDualDiamond(tileMap, pos, piece="rook", variant="linear1") {
  const meshTile = tileMap.get(pos.join(","));
  if (!meshTile) return;

  const module = decorators.module();

  const defRaw = module.decorators[piece][variant];
  const pallet = module.pallet;

  // --- Resolve full structure ---
  const def = {
    background: pallet[defRaw.background],
    left: decorators.resolveColors(defRaw.left, pallet),
    right: decorators.resolveColors(defRaw.right, pallet)
  };

  // --- Use your draw function ---
  const group = decorators.drawInsetDualDiamonds(meshTile, 0.85, def);

  meshTile.add(group);
  }

function demoTriDiamond(tileMap, pos, piece="duke", variant="linear2") {
  const meshTile = tileMap.get(pos.join(","));
  if (!meshTile) return;

  const module = decorators.module();

  const defRaw = module.decorators[piece][variant];
  const pallet = module.pallet;

  // --- Resolve full structure ---
  const def = {
    background: pallet[defRaw.background],
    left: decorators.resolveColors(defRaw.left, pallet),
    center: decorators.resolveColors(defRaw.center, pallet),
    right: decorators.resolveColors(defRaw.right, pallet)
  };

  // --- Use your draw function ---
  const group = decorators.drawInsetTriDiamonds(meshTile, 0.85, def);

  meshTile.add(group);
  }

function demoCamera() {
  cameras.UI("neutral", [0,0,0]);
  // cameras.UI("white", [-80,0,0]);
  // cameras.UI("negative", [0,0,0]);
  // cameras.UI("black", [-80,0,0]);
}

// --- Helpers ---
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

function initTileUserData(meshTile, tile, pos, tileMap) {
  meshTile.userData.isTile = true;
  meshTile.userData.coords = pos;
  meshTile.userData.decorated = false;
  meshTile.userData.overlays = [];
  meshTile.userData.faceColor = tile.faceColor;

  tileMap.set(pos.join(","), meshTile);
}
// Seampoint: more local functions...

