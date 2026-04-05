
/* File: tiles.js
  Path: ./3dc/tiles/tiles.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/03/26
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

  // Flat face and edge materials.
  const white  = new THREE.MeshBasicMaterial({ color: face.white  }); // "#f2f2f2"
  const black  = new THREE.MeshBasicMaterial({ color: face.black  });
  const gold   = new THREE.MeshBasicMaterial({ color: edge.gold   }); // "#c9a227"
  const silver = new THREE.MeshBasicMaterial({ color: edge.silver });
  const ruby   = new THREE.MeshBasicMaterial({ color: edge.ruby   });
  const jade   = new THREE.MeshBasicMaterial({ color: edge.jade   });
  // Seampoint: more objects...

// --- Build upon previous layers ---
import * as foundation from "../../foundation/colors/colors.js";

// --- Load view modules ---

// --- UI ---
export function createTile(coords) {
  let z = tile.size.height;               // Size.
  let x = tile.size.width;
  let y = tile.size.depth;
  const size = [z, x, y];

  const bishopColor = foundation.bishopColorVts(coords);  // Bishop color depends on position.
  const dukeColor   = foundation.dukeColorVts(coords);    // Duke color depends on position.

  let faceColor;
  switch(bishopColor) { // "white"|"black".
    case 'white': faceColor = tile.face.colors.white; break;
    case 'black': faceColor = tile.face.colors.black; break;
    default:
      throw new Error(`Bad color choice ${bishopColor} for bishop in 3dc/view/tiles.js/createTiles().`);
  }

  let edgeColor;
  switch(dukeColor) { // "gold"|"ruby"|"jade"|"silver".
    case 'gold':   edgeColor = tile.edge.colors.gold;   break;
    case 'silver': edgeColor = tile.edge.colors.silver; break;
    case 'ruby':   edgeColor = tile.edge.colors.ruby;   break;
    case 'jade':   edgeColor = tile.edge.colors.jade;   break;
    default:
      throw new Error(`Bad color choice ${dukeColor} for duke in 3dc/view/tiles.js/createTiles().`);
  }

  return { size, faceColor, edgeColor };  // [6, 87,87], "#f2f2f2", "#8b0000".
}

// --- Helpers ---

