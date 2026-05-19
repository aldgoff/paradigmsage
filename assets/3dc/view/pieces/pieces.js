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
  import * as planes from "../../geometry/planes/planes.js";

  import * as tiles  from "../../view/tiles/tiles.js";
// Seampoint: more imports...

// --- UI ---
export function makeRookMesh(params = {}) {
  const THREE = window.THREE;

  const {
    aspect  = rook.aspect,
    breadth = rook.breadth,
    color   = 0xffffff
  } = params;

  let [tileHeight, tileWidth] = tiles.tileSize();   // Canonical size fills tile.

  const base = tileWidth * breadth;                   // Canonical tile footprint.
  const height = base * aspect;

  const geometry = new THREE.BoxGeometry(base, height, base);

  // const tileHeight = tiles.tileSize().z;              // Sit flush on tile plane.
  geometry.translate(0, (height/2) + (tileHeight/2), 0);

  const material = new THREE.MeshPhongMaterial({ color });

  const mesh = new THREE.Mesh(geometry, material);

  mesh.castShadow = true;
  mesh.receiveShadow = false;

  return mesh;
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

