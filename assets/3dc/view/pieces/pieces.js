/* File: pieces.js
  Path: ./3dc/view/pieces/pieces.js
  Purpose: desc
  Author: Allan Goff
  Date: 5/03/26
  Recommended access: import * as vPieces from "../../view/pieces/pieces.js";
  UI: the export functions.
*/

// --- Load JSON ---
import piecesData from "./pieces.json" assert { type: "json" };
  const piecesModule = piecesData.pieces_module;
  const rook   = piecesModule.rook;
  const bishop = piecesModule.bishop;
  const duke   = piecesModule.duke;
  const stack  = piecesModule.stack;
  const queen  = piecesModule.queen;
  const knight = piecesModule.knight;
  const pawn   = piecesModule.pawn;
  const king   = piecesModule.king;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as utils   from "../../../utils/utils.js";

  import * as planes  from "../../geometry/planes/planes.js";
  import * as coords  from "../../foundation/coords/coords.js";
  import * as cViewer from "../../controller/viewer/viewer.js";
  import * as mPieces from "../../model/pieces/pieces.js";
  import * as mTrays  from "../../model/trays/trays.js";
  import * as mBoards from "../../model/boards/boards.js";

  import * as view    from "../../view/view.js";
  import * as tiles   from "../../view/tiles/tiles.js";
// Seampoint: more imports...

// --- Globals ---
  const THREE = window.THREE;
// Seampoint: more globals...

// --- UI ---
export function renderPiece(key) {  // "WKR".
  // console.log("view : pieces.js - renderPiece(key)", key);

  const piece = mPieces.getPieceList()[key];              // Parse args.
  if(!piece) throw Error(`No such piece ${key}.`);
  const { loc, pos, coords } = piece;
  const player = key[0];  // W|B.
  const side   = key[1];  // K|Q.
  const level  = key[2];  // R|N|B|Q|K.
  const type   = key[3];  // R|B|D|S|Q|N|P|U|K.

  if(     loc === "~") {                                  // Render in tray.
    const tray = (player === "W") 
      ? mTrays.getWhiteTray() 
      : mTrays.getBlackTray();
      renderInTray(player, side, type, tray, pos);
    }
  else if(loc === "@") {                                  // Render on board.
      renderOnBoard(player, side, type, pos);
    }
  else {
    throw new Error(`Piece ${key} was neither on board, nor in a tray.`);
  }
  }

export function derenderPiece(piece) {
  console.log("view : pieces.js - derenderPiece(piece)", piece);
  // TODO: write function derenderPiece.

}
// Seampoint: more global functions...

// --- Helpers ---
function renderInTray(player, side, type, tray, pos) {
  // console.log("view : pieces.js - renderInTray(player, type, tray, pos)", player, type, tray, pos);
  // TODO: finish renderInTray().

  let gap = cViewer.getGap();

  if(type === "P")  gap += 1; // First tray column.
  else              gap += 2; // Second tray column.

  const vts = trayToVts(player, pos, gap);

  let group = null;

  const color = (player === "W") ? 0xffffff : 0x111111;
  switch(type) {
    case "R": group = makeRookObject(  {color}); break;
    case "B": group = makeBishopObject({color}); break;
    case "D": group = makeDukeObject(  {color}); break;
    // case "Q": group = makeQueenObject( {color}); break;
    case "K": group = makeKingObject(  {color}); break;
    // case "S": group = makeStackObject({color}); break;
    case "P": group = makePawnObject({color}); break;
    // case "N": group = makeKnightObject({color, side}); break;
    // Seampoint: no more pieces.
    default:
      console.log(`view : pieces.js - Unknown piece type ${type}`); return; 
      break;
  }

  if(!group) return;

  const grid = [100,100,100]; // TODO: get from some json file.
  const tileHeight = 5;       // TODO: get from some json file.
  const zOffset = -grid[0]/2 + (tileHeight/2);
  const decoratorGap = 2;
  group.position.set(grid[2]*vts[2]-grid[2]/2, grid[0]*vts[0]+zOffset+decoratorGap, grid[1]*vts[1]-grid[2]/2);

  view.context.scene.add(group);
  }

function trayToVts(player, pos, gap) {
  // console.log("view : pieces.js - trayToVts(player, pos, gap)", player, pos, gap);
  // TODO: finish trayToVts().

  const specOrName = "8x8x8"; // TODO: get board size from setup.
  let vts = coords.normalizeTileToVts(pos, specOrName); // [4,-3,-3]=>[4,-4,-4] and [-3,-3,-3]=>[-3,-4,-4]
  let displacement = [0, 0, 0];

  if(player === "W") {
    displacement = [0, -gap, -gap];
    vts = utils.add(vts, displacement);
  }

  return vts;
  }

function renderOnBoard(player, side, type, pos) {
  console.log("view : pieces.js - renderOnBoard(player, type, pos)", player, type, pos);

  const coords = coords.boardToVts(pos);  // TODO: may need to add this function to coords.
  // TODO: write function renderOnBoard.
}

// function make<piece>Object(params = {}) {
  //   console.log("view : pieces.js - makeObject(params)", params);

  //   const { tileWidth, colors } = parseParams(params);
  //   const geometry = make<piece>Geo(tileWidth, piece);
  //   const edges = bevel<piece>Edges();
  //   const material = makeSkin();
  //   const group = makePiece(geometry, edges, material);

  //   return group;
  // }

function makeRookObject(params = {}) {
  // console.log("view : pieces.js - makeRookObject(params)", params);

  const { color } = params;
  let [tileHeight, tileWidth] = tiles.tileSize();       // Canonical size fills tile.

  const geometry = makeRookGeo(tileWidth, rook);        // Mesh.
  const mesh = createMesh(geometry, color);

  const group = new THREE.Group();                      // Group.
  group.add(mesh);

  return group;
  }

function makeBishopObject(params = {}) {
  // console.log("view : pieces.js - makeBishopObject(params)", params);

  const { color } = params;
  let [tileHeight, tileWidth] = tiles.tileSize();       // Canonical size fills tile.

  const geometry = makeBishopGeo(tileWidth, bishop);    // Mesh.
  const mesh     = createMesh(geometry, color);

  const group = new THREE.Group();                      // Group.
  group.add(mesh);

  return group;
  }

function makeDukeObject(params = {}) {
  // console.log("view : pieces.js - makeDukeObject(params)", params);

  const { color } = params;
  let [tileHeight, tileWidth] = tiles.tileSize();       // Canonical size fills tile.

  const geometry = makeDukeGeo(tileWidth, duke);        // Mesh.
  const mesh     = createMesh(geometry, color);

  const group = new THREE.Group();                      // Group.
  group.add(mesh);

  return group;
  }

function makeQueenObject(params = {}) {
  // console.log("view : pieces.js - makeQueenObject(params)", params);

  const { color } = params;
  let [tileHeight, tileWidth] = tiles.tileSize();       // Canonical size fills tile.

  const geometry = makeQueenGeo(tileWidth, queen);      // Mesh.
  const mesh     = createMesh(geometry, color);

  const group = new THREE.Group();                      // Group.
  group.add(mesh);

  return group;
  }

function makeKingObject(params = {}) {
  // console.log("view : pieces.js - makeKingObject(params)", params);

  const { color } = params;
  let [tileHeight, tileWidth] = tiles.tileSize();       // Canonical size fills tile.

  const geometry = makeKingGeo(tileWidth, king);        // Mesh.
  const mesh     = createMesh(geometry, color, true);

  // --- Recompute canonical dimensions ---
  const radius = (tileWidth * king.breadth) / 2;        // Edges.
  const height = tileWidth * king.breadth * king.aspect;
  addCylinderEdges(mesh, radius, height);

  const group = new THREE.Group();                      // Group.
  group.add(mesh);

  return group;
}

function makeStackObject(params = {}) {
  // console.log("view : pieces.js - makeStackObject(params)", params);

  const { color, side } = params;
  let [tileHeight, tileWidth] = tiles.tileSize();   // Canonical size fills tile.

  const group = makeStackMeshGroup(tileWidth, stack);
  decorateGroup(group, color);

  return group;
  }

function makePawnObject(params = {}) {
  // console.log("view : pieces.js - makePawnObject(params)", params);

  const { color, side } = params;
  let [tileHeight, tileWidth] = tiles.tileSize();   // Canonical size fills tile.

  const group = makePawnMeshGroup(tileWidth, pawn);
  decorateGroup(group, color);

  return group;
  }

function makeKnightObject(params = {}) {
  // console.log("view : pieces.js - makeKnightObject(params)", params);

  const { color, side } = params;
  let [tileHeight, tileWidth] = tiles.tileSize();   // Canonical size fills tile.

  const group = makeKnightMeshGroup(tileWidth, knight, side);
  decorateGroup(group, color);

  return group;
}
// Seampoint: no more pieces.

function makeRookGeo(tileWidth, rook) {
  const { aspect, breadth } = rook;
  const base = tileWidth * breadth;
  const height = base * aspect;
  const geometry = new THREE.BoxGeometry(base, height, base);       // Cannonical cube.
  geometry.translate(0, (height/2), 0);

  return geometry;
  }

function makeBishopGeo(tileWidth, bishop) {
  const { aspect, breadth } = bishop;
  const radius = tileWidth * breadth;
  const height = aspect * radius;
  const geometry = new THREE.ConeGeometry(radius, height, 3);       // Triangular base.
  geometry.scale(1.0, aspect, 1.0);   // Scale vertically for bishop silhouette.
  geometry.computeBoundingBox();      // Center-bottom origin invariant.
  const bbox = geometry.boundingBox;
  const yOffset = -bbox.min.y;
  geometry.translate(0, yOffset, 0);

  return geometry;
  }

function makeDukeGeo(tileWidth, duke) {
  let geometry = null;
  // TODO: define duke geometry.

  return geometry;
  }

function makeQueenGeo(tileWidth, queen) {
  let geometry = null;
  // TODO: define queen geometry.

  return geometry;
  }
function makeKingGeo(tileWidth, king) {
  const { aspect, breadth } = king;

  // --- Canonical dimensions ---
  const radius = (tileWidth * breadth) / 2;
  const height = tileWidth * breadth * aspect;

  // --- Primitive geometry ---
  const geometry = new THREE.CylinderGeometry(
    radius,   // top radius
    radius,   // bottom radius
    height,
    32        // radial segments
  );

  // --- Center-bottom origin invariant ---
  geometry.translate(0, height/2, 0);

  return geometry;
}

function makeStackMeshGroup(tileWidth, stack) {
  let group = null;
  // TODO: define stack group.

  return group;
  }
function makePawnMeshGroup(tileWidth, pawn) {
  const { aspect, breadth } = pawn;

  // --- Canonical dimensions ---

  const baseRadius = (tileWidth * breadth) / 2;

  // Sphere sits visually inside torus ring.
  const sphereRadius = baseRadius * 0.72;

  // Torus:
  //   major radius = centerline radius
  //   tube radius  = torus thickness
  const torusRadius = baseRadius * 0.78;

  // Aspect controls torus thickness.
  const tubeRadius = torusRadius * 0.22 * aspect;

  // --- Primitive geometries ---

  const sphereGeo = new THREE.SphereGeometry(
    sphereRadius,
    32,
    24
  );

  const torusGeo = new THREE.TorusGeometry(
    torusRadius,
    tubeRadius,
    16,
    48
  );

  // --- Primitive meshes ---

  const sphereMesh = new THREE.Mesh(
    sphereGeo,
    new THREE.MeshBasicMaterial()
  );

  const torusMesh = new THREE.Mesh(
    torusGeo,
    new THREE.MeshBasicMaterial()
  );
  torusMesh.rotation.x = Math.PI / 2;

  // --- Placement ---

  // Raise sphere so it visually nests into torus.
  sphereMesh.position.y =
    sphereRadius + tubeRadius * 0.35;

  // --- Group assembly ---

  const group = new THREE.Group();

  group.add(torusMesh);
  group.add(sphereMesh);

  // --- Center-bottom origin invariant ---

  const box = new THREE.Box3().setFromObject(group);

  const centerX = (box.min.x + box.max.x) / 2;
  const centerZ = (box.min.z + box.max.z) / 2;

  group.position.set(
    -centerX,
    -box.min.y,
    -centerZ
  );

  return group;
}
function makePawnMeshGroup1(tileWidth, pawn) {
  let group = null;
  // TODO: define pawn group.

  return group;
  }

function makeKnightMeshGroup(tileWidth, knight, side) {
  const cubeSize = 40;

  const geometry = new THREE.BoxGeometry(
    cubeSize,
    cubeSize,
    cubeSize
  );

  // Chirality:
  //   K = right-handed
  //   Q = left-handed
  const lateral = (side === "K") ? 1 : -1;

  // Canonical knight move polycube.
  const positions = [
    [0, 0, 0],                           // origin
    [cubeSize, 0, 0],                   // 1 out
    [2*cubeSize, 0, 0],                 // 2 out
    [2*cubeSize, cubeSize, 0],          // 1 up
    [2*cubeSize, cubeSize, lateral*cubeSize] // side cube
  ];

  const knightGeo = new THREE.Group();

  for(const [x,y,z] of positions) {

    const cube = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial()
    );

    cube.position.set(x,y,z);

    knightGeo.add(cube);
  }

  // --- Normalize to center-bottom origin invariant ---

  const box = new THREE.Box3().setFromObject(knightGeo);

  const centerX = (box.min.x + box.max.x) / 2;
  const centerZ = (box.min.z + box.max.z) / 2;

  knightGeo.position.set(
    -centerX,
    -box.min.y,
    -centerZ
  );

  return knightGeo;
}
// Seampoint: no more pieces.

function createMesh(geometry, color, suppress=false) {
  const material = new THREE.MeshBasicMaterial({ color });
  const mesh = new THREE.Mesh(geometry, material);

  if(!suppress) {
    const edges = new THREE.EdgesGeometry(mesh.geometry);
    const lines = new THREE.LineSegments( edges, new THREE.LineBasicMaterial({ color: 0x101010 }));
    mesh.add(lines);
  }

  mesh.castShadow = true;
  mesh.receiveShadow = false;

  return mesh;
  }

function decorateGroup(group, color) {
  // TODO: Write decorateGroup().
  }

function addCylinderEdges(mesh, radius, height) {
  const curve = new THREE.EllipseCurve(
    0, 0, radius, radius, 0, 2 * Math.PI, false, 0
  );

  const points = curve.getPoints(64);
  const geometry = new THREE.BufferGeometry().setFromPoints(
    points.map(p => new THREE.Vector3(p.x, 0, p.y))
  );

  const material = new THREE.LineBasicMaterial({ color: 0x111111 });

  // --- Bottom ring ---
  const bottomRing = new THREE.LineLoop(geometry, material);
  bottomRing.position.y = 0;

  // --- Top ring ---
  const topRing = new THREE.LineLoop(geometry, material);
  topRing.position.y = height;
  mesh.add(bottomRing);
  mesh.add(topRing);
}
// Seampoint: more local functions...

/* TODO: piece meshes & interaction
  === Phase 1: Mesh Semantics ===
    1. Piece/ghost distinction.
    2. Common mesh helpers.
    3. White/Black materials.
    4. Confirm black tray placement.
    5. Ghost visibility + occupancy inversion.
    6. Piece edge conventions.

  === Phase 2: Interaction Semantics ===
    7. Raycast ghost interaction.
    8. Decorator interaction.
    9. Demo move tray → board.
    10. Move piece around board.
    11. Return piece to tray.
    12. Ghost ↔ real mesh replacement invariant.
    13. Pieces/ghosts move with tray as gap changes.

  === Phase 3: Piece System Expansion ===
    14. Meshes for remaining pieces.
    15. Canonical piece scaling/aspect language.
    16. Piece silhouette QC against movement semantics.

  === Phase 4: Render Architecture Cleanup ===
    17. Canonical VTS → world projection helper.
    18. Shared edge/material decorators.
    19. Separate geometry factories from render modes.
    20. Mesh registries / lookup helpers.
    21. Remove remaining model→view tension.
*/
