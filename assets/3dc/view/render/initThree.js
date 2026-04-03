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

  const camera = new THREE.OrthographicCamera(
    -500, 500, 500, -500,
    1, 2000
    );
    const pov = { white: [-600, 130, -600], neutral: [600, 130, -600], black: [-600, 130, 600] };
    camera.position.set(...pov.black);
    camera.lookAt(0, 0, 0);


  // --- TILE (hardcoded test) ---
    // geometry: width, height, depth
    const tileTrial = [6, 87, 87];
    const geometry = new THREE.BoxGeometry(...vts2xyz(tileTrial));

    // Tile edges.
      const edges = new THREE.EdgesGeometry(geometry);
      const line = new THREE.LineSegments(
        edges,
        new THREE.LineBasicMaterial({ color: 0x000000 })
      );

    // Face materials, flat.
    const white  = new THREE.MeshBasicMaterial({ color: 0xf2f2f2 });
    const black  = new THREE.MeshBasicMaterial({ color: 0x626262 });
    const gold   = new THREE.MeshBasicMaterial({ color: 0xc9a227 });
    const silver = new THREE.MeshBasicMaterial({ color: 0xc0c0c0 });
    const ruby   = new THREE.MeshBasicMaterial({ color: 0x8b0000 });
    const jade   = new THREE.MeshBasicMaterial({ color: 0x006400 });

    // Side materials, shiny.
    // const gold = new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.9, roughness: 0.2 });
    const MATERIALS = {
      gold:   new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 0.9, roughness: 0.2 }),
      silver: new THREE.MeshStandardMaterial({ color: 0xc0c0c0, metalness: 0.9, roughness: 0.25 }),
      ruby:   new THREE.MeshStandardMaterial({ color: 0x8b0000, metalness: 0.6, roughness: 0.3 }),
      jade:   new THREE.MeshStandardMaterial({ color: 0x006400, metalness: 0.6, roughness: 0.35 })
    };

    // Mesh.
    // const sideMat = MATERIALS.gold;   // or whichever duke color
    // const sideMat = jade;   // or whichever duke color
    // const topMat  = white;

    // const materials = [
    //   sideMat, // right
    //   sideMat, // left
    //   topMat,  // top
    //   topMat,  // bottom
    //   sideMat, // front
    //   sideMat  // back
    // ];

    // const materials1 = [silver, silver, white, white, silver, silver];
    // const materials2 = [gold, gold, black, black, gold, gold];

    const tileProps = [
      { pos: [0,0,0], mat: [silver, silver, white, white, silver, silver] },
      { pos: [0,1,0], mat: [ruby,   ruby,   black, black, ruby,   ruby] },
      { pos: [0,0,1], mat: [jade,   jade,   black, black, jade,   jade] },
      { pos: [0,1,1], mat: [gold,   gold,   white, white, gold,   gold] },
      { pos: [1,0,0], mat: [gold,   gold,   black, black, gold,   gold] },
      { pos: [1,1,0], mat: [jade,   jade,   white, white, jade,   jade] },
      { pos: [1,0,1], mat: [ruby,   ruby,   white, white, ruby,   ruby] },
      { pos: [1,1,1], mat: [silver, silver, black, black, silver, silver] },
    ];
    let tiles = [];
    for(const props of tileProps) {
      const pos = props.pos;
      const mat = props.mat;
      let tile = new THREE.Mesh(geometry, mat);   // Colors.
      tile.add(makeEdges(geometry));              // Edges.
      tile.position.set(...vts2pixels(pos));      // Position.
      scene.add(tile);                            // Add to scene.
    }

    // const tile1 = new THREE.Mesh(geometry, materials1);
    // const tile2 = new THREE.Mesh(geometry, materials2);

    // tile1.add(makeEdges(geometry));
    // tile2.add(makeEdges(geometry));

    // // Position.
    // const pos1 = [0, 0, 0];
    // const pos2 = [1, 0, 0];
    // tile1.position.set(...vts2pixels(pos1));
    // tile2.position.set(...vts2pixels(pos2));

    // Add to scene.
    // scene.add(tile1);
    // scene.add(tile2);

    // Light
    // const light = new THREE.DirectionalLight(0xffffff, 1.0);
    // light.position.set(500, 500, 500);
    // scene.add(light);
    // scene.add(new THREE.AmbientLight(0xffffff, 0.4));

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
// Seampoint: more global functions...

// --- Helplers ---

function makeEdges(geometry) {
  const edges = new THREE.EdgesGeometry(geometry);
  return new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x000000 })
  );
}
// Seampoint: more local functions...

