/* File: tiles.js
  Path: ./3dc/tiles/tiles.js
  Purpose: Code for building the tiles.
  Author: Allan Goff
  Date: 4/03/26
  Recommended access: import * as tiles from "../../view/tiles/tiles.js";
  UI: the export functions.
*/

// --- Load Libraries ---
const THREE = window.THREE;

// --- Load JSON ---
import tilesData from "./tiles.json" assert { type: "json" };
  const tilesModule = tilesData.tiles_module;
  const tile = tilesModule.tile;
  const face = tile.face.colors;
  const edge = tile.edge.colors;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as foundation from "../../foundation/colors/colors.js";
  import * as coordsMaps from "../render/coordsMaps.js"
// Seampoint: more imports...

// --- UI ---
export function tileSize() {
  let z = tile.size.height;
  let x = tile.size.width;
  let y = tile.size.depth;

  return [z, x, y];
  }

export function getTileAttributes(coords) {
  const size = tileSize();               // Tile size.

  const bishopColor = foundation.bishopColorVts(coords);  // Bishop color depends on position.
  const dukeColor   = foundation.dukeColorVts(coords);    // Duke color depends on position.

  let faceColor;
  switch(bishopColor) {                   // Tile face color (bishop).
    case 'white': faceColor = face.white; break;
    case 'black': faceColor = face.black; break;
    default:
      throw new Error(`Bad color choice ${bishopColor} for bishop in 3dc/view/tiles.js/createTiles().`);
  }

  let edgeColor;
  switch(dukeColor) {                     // Tile edge color (duke).
    case 'gold':   edgeColor = edge.gold;   break;
    case 'silver': edgeColor = edge.silver; break;
    case 'ruby':   edgeColor = edge.ruby;   break;
    case 'jade':   edgeColor = edge.jade;   break;
    default:
      throw new Error(`Bad color choice ${dukeColor} for duke in 3dc/view/tiles.js/createTiles().`);
  }

  return { size, faceColor, edgeColor };  // [6, 87,87], "#f2f2f2", "#8b0000".
  }

export function createMeshTile(tile, geometry, pos) {
  let faceColor = new THREE.MeshBasicMaterial({ color: tile.faceColor });
  let edgeColor = new THREE.MeshBasicMaterial({ color: tile.edgeColor });
  let mat = [edgeColor, edgeColor, faceColor, faceColor, edgeColor, edgeColor];

  let meshTile = new THREE.Mesh(geometry, mat);         // Colors.
  meshTile.add(makeEdges(geometry));                    // Edges.
  meshTile.position.set(...coordsMaps.vts2pixels(pos)); // Position.

  return(meshTile);
  }

export function getTileMesh(tileMap, pos) {
  return tileMap.get(pos.join(","));
}

export function initTileUserData(meshTile, tile, pos, tileMap) {
  meshTile.userData.isTile = true;
  meshTile.userData.vts = pos;
  meshTile.userData.coords = pos;
  meshTile.userData.decorated = false;
  meshTile.userData.overlays = [];
  meshTile.userData.faceColor = tile.faceColor;

  tileMap.set(pos.join(","), meshTile);
  }

// Seampoint: more global functions...

// --- Helpers ---
function makeEdges(geometry) {
  const edges = new THREE.EdgesGeometry(geometry);
  const lines = new THREE.LineSegments( edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
  return lines;
}
// Seampoint: more local functions...

