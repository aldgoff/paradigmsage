/* File: initThree.js
  Path: ./3dc/initThree/initThree.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/02/26
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
  /*
    0xeaf4ff   // softer, more white
    0xdcecff   // slightly stronger blue
    0xf5faff   // almost white (eggshell feel)
    */
  scene.background = new THREE.Color(0xdcecff);

  const zoom = 1000; // 400 - 1500.
  const camera = new THREE.OrthographicCamera( -zoom, zoom, zoom, -zoom,   1, 2000 ); 
    const pov = { white: [-800, 150, -800], neutral: [900, 170, -900], black: [800, 160, 800], negative: [-800, 160, 800] };
    camera.position.set(...pov.neutral);
    camera.lookAt(0, 0, 0);

  // --- TILE (hardcoded test) ---
    // geometry: width, height, depth
    let rawTile = tiles.createTile([0,0,0]).size;
    const geometry = new THREE.BoxGeometry(...vts2xyz(rawTile));

    // Tile edges.
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));

    for(let z=-3; z<=4; z++) {  // Create an 8x8x8 board.
      for(let x=-3; x<=4; x++) {
        for(let y=-3; y<=4; y++) {
          let pos = [z, x, y];
          let tile = tiles.createTile(pos);
          let meshTile = createMeshTile(tile, geometry, pos);
          scene.add(meshTile);                            // Add to scene.
        }
      }
    }

    // Create offboard tiles to test decorators.
    demoDecorators(geometry, scene);

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

  return { scene, camera, renderer }; // Context.
}

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
  ]

  for(const example of examples) {
    let tile = tiles.createTile(example.pos);
    let meshTile = createMeshTile(tile, geometry, example.pos);
    scene.add(meshTile);                            // Add to scene.
    decorators.decorate(tile.faceColor, meshTile, example.piece, example.decorator);
  }
}
// Seampoint: more global functions...

// --- Helplers ---
function createMeshTile(tile, geometry, pos) {
  let faceColor = new THREE.MeshBasicMaterial({ color: tile.faceColor });
  let edgeColor = new THREE.MeshBasicMaterial({ color: tile.edgeColor });
  let mat = [edgeColor, edgeColor, faceColor, faceColor, edgeColor, edgeColor];

  let meshTile = new THREE.Mesh(geometry, mat);       // Colors.
  meshTile.add(makeEdges(geometry));              // Edges.
  meshTile.position.set(...vts2pixels(pos));      // Position.

  return(meshTile);
  }

function makeEdges(geometry) {
  const edges = new THREE.EdgesGeometry(geometry);
  return new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x000000 })
  );
}
// Seampoint: more local functions...

