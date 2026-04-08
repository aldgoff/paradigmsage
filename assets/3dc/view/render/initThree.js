/* File: initThree.js
  Path: ./3dc/initThree/initThree.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/08/26
  UI: the export functions.
*/

// --- Load Libraries ---
const THREE = window.THREE;

// --- Load JSON ---
// Seampoint: more objects...

// --- Build upon previous layers ---
import {vts2xyz,
        xyz2vts,
        vts2pixels,
        pixels2vts,
} from "../render/coordsMap.js"

import * as tiles from "../tiles/tiles.js";
import * as decorators from "../decorators/decorators.js";
// Seampoint: more imports...

// --- UI ---
export function initThree(container) {  // TODO: Currently a POC - most of this belongs somewhere else.
  const scene = new THREE.Scene();
  /* A 3D env needs these three things to create an 3D context.
   * scene
   * camera
   * renderer
   */
  scene.background = new THREE.Color(0xdcecff); // #dcecff - a light blue background.

  const zoom = 1000; // 400 - 1500.
  const camera = new THREE.OrthographicCamera( -zoom, zoom, zoom, -zoom,   1, 2000 ); 
    const pov = { white: [-800, 150, -800], neutral: [900, 170, -900], black: [800, 160, 800], negative: [-800, 160, 800] };
    camera.position.set(...pov.neutral);
    camera.lookAt(0, 0, 0);

  // --- TILE (hardcoded test) ---
    const tileMap = new Map();
    // geometry: width, height, depth
    let tileSize = tiles.tileSize();
    const geometry = new THREE.BoxGeometry(...vts2xyz(tileSize));

    // Tile edges.
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));

    for(let z=-3; z<=4; z++) {  // Create an 8x8x8 board.
      for(let x=-3; x<=4; x++) {
        for(let y=-3; y<=4; y++) {
          let pos = [z, x, y];
          let tile = tiles.getTileAttributes(pos);
          let meshTile = tiles.createMeshTile(tile, geometry, pos);
          meshTile.userData.isTile = true;
          meshTile.userData.coords = pos;  // [z,x,y]
          meshTile.userData.decorated = false;
          meshTile.userData.overlays = []; 
          meshTile.userData.faceColor = tile.faceColor;
          tileMap.set(pos.join(","), meshTile);
          scene.add(meshTile);                            // Add to scene.
        }
      }
    }

    // Create offboard tiles to test decorators.
    demoDecorators(geometry, scene);

    demoAdvSq(tileMap);

    demoDualDiamond(tileMap, [3,-2,-2], "rook", "linear2");
    demoDualDiamond(tileMap, [4,-2,-2], "rook", "linear1");
    demoDualDiamond(tileMap, [3,-1,-1], "bishop", "linear2");
    demoDualDiamond(tileMap, [4,-1,-1], "bishop", "linear1");
    
    demoTriDiamond(tileMap, [2,0,0], "duke", "linear3");
    demoTriDiamond(tileMap, [3,0,0], "duke", "linear2");
    demoTriDiamond(tileMap, [4,0,0], "duke", "linear1");
    demoDualDiamond(tileMap, [3,1,1], "duke", "duplex");
    demoDualDiamond(tileMap, [4,1,1], "duke", "simplex");

    demoKnight(tileMap);

    // Key light (main direction) (TODO: LIGHTING NOT WORKING WELL, only need for shiny metal edges.)
      const key = new THREE.DirectionalLight(0xffffff, 0.9);
      key.position.set(400, 600, 400);
      scene.add(key);

      // Fill light (softens shadows)
      const fill = new THREE.DirectionalLight(0xffffff, 0.5);
      fill.position.set(-400, 300, -400);
      scene.add(fill);

      // Ambient (base visibility)
      scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const renderer = new THREE.WebGLRenderer({
    canvas: container,
    antialias: true
  });

  renderer.setSize(container.width, container.height);
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  // Add event listener.
    renderer.domElement.addEventListener("click", (event) => {
    const coords = getTileFromClick(event, camera, scene, renderer);

    if (!coords) return;

    console.log("Clicked tile:", coords);

    // → here you trigger decorator logic
    const meshTile = tiles.getTileMesh(tileMap, coords);
    if (meshTile) {
      toggleDecorator(meshTile);  // Hard coded for now as src or dst.
    }
    });

  return { scene, camera, renderer }; // Context.
}
// Seampoint: more global functions...

// --- Demos ---
function demoDecorators(geometry, scene) {
  const examples = [
    { pos: [4,-4,-4], piece: "rook", decorator: "end2" },
    { pos: [3,-4,-4], piece: "bishop", decorator: "end1" },
    { pos: [2,-4,-4], piece: "duke", decorator: "apex" },
    { pos: [1,-4,-4], piece: "rook", decorator: "body" },
    { pos: [0,-4,-4], piece: "bishop", decorator: "source" },
    { pos: [-1,-4,-4], piece: "queen", decorator: "qtile" },
    { pos: [-2,-4,-4], piece: "queen", decorator: "brook" },
    { pos: [-3,-4,-4], piece: "queen", decorator: "hotspot" },
    { pos: [-4,-4,-4], piece: "queen", decorator: "feynman" },
  ]

  for(const example of examples) {
    let tile = tiles.getTileAttributes(example.pos);
    let meshTile = tiles.createMeshTile(tile, geometry, example.pos);
    meshTile.userData.isTile = true;
    meshTile.userData.coords = example.pos;  // [z,x,y]
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

  const module = decorators.decoratorsModule;

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

  const module = decorators.decoratorsModule;

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
// Seampoint: more local functions...

