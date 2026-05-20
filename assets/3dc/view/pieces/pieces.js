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

  geometry.translate(0, (height/2), 0);

  const material = new THREE.MeshPhongMaterial({ color });

  const mesh = new THREE.Mesh(geometry, material);

  mesh.castShadow = true;
  mesh.receiveShadow = false;

  return mesh;
}

// --- UI (Pieces) ---
export function renderPiece(key) {  // "WKR".
  console.log("view: pieces.js - renderPiece(key)", key);

  const piece = mPieces.getPieceList()[key];              // Parse args.
  if(!piece) throw Error(`No such piece ${key}.`);
  const { loc, pos, coords } = piece;
  const player = key[0];  // W|B.
  const side   = key[1];  // K|Q.
  const type   = key[2];  // R|B|D|S|Q|N|P|U|K.

  if(     loc === "~") {                                  // Render in tray.
    const tray = (player === "W") 
      ? mTrays.getWhiteTray() 
      : mTrays.getBlackTray();
      renderInTray(player, type, tray, pos);
    }
  else if(loc === "@") {                                  // Render on board.
      renderOnBoard(player, type, pos);
    }
  else {
    throw new Error(`Piece ${key} was neither on board, nor in a tray.`);
  }
  }

export function derenderPiece(piece) {
  console.log("view: pieces.js - derenderPiece(piece)", piece);
  // TODO: write function derenderPiece.

}

export function renderPieceChanges() {  // TODO: Finish or deprecate.
  console.log("view: pieces.js - renderPieceChanges()");

  let tally = 0;

  for(const key in mPieces.pieceList) {
    const piece = mPieces.pieceList[key];

    const player = piece[0];  // W|B.
    const side   = piece[1];  // K|Q.
    const type   = piece[2];  // R|B|D|S|Q|N|P|U|K.

    const tray = (player === "White") ? mTrays.getWhiteTray() : mTrays.getBlackTray();
    // If was in tray and still in tray - continue.
    // If was on board and still on board:
      // If was at tile X and is at tile X - continue.
      // If was at tile X and but now at tile X:
        // Derender 

    tally++;
  }
}
// Seampoint: more global functions...

// --- Helpers ---
function renderInTray(player, type, tray, pos) {
  console.log("view: pieces.js - renderInTray(player, type, tray, pos)", player, type, tray, pos);
  // TODO: finish renderInTray().

  let gap = cViewer.getGap();

  if(type === "P")  gap += 1; // First tray column.
  else              gap += 2; // Second tray column.

  const vts = trayToVts(player, pos, gap);

  let mesh = null;

  if(type === "R") {
    mesh = makeRookMesh({
      color: (player === "W") ? 0xffffff : 0x111111
    });
  }

  if(!mesh) return;

  const grid = [150,100,100]; // TODO: get from some json file.
  const tileHeight = 6;       // TODO: get from some json file.
  const zOffset = -grid[0]/2 + (tileHeight/2);
  const decoratorGap = 2;
  mesh.position.set(grid[2]*vts[2]-grid[2]/2, grid[0]*vts[0]+zOffset+decoratorGap, grid[1]*vts[1]-grid[2]/2);

  view.context.scene.add(mesh);

  console.log("*** rook mesh:", mesh);
  console.log("*** rook vts:", vts);
}

function trayToVts(player, pos, gap) {
  console.log("view: pieces.js - trayToVts(player, pos, gap)", player, pos, gap);
  // TODO: finish trayToVts().

  const specOrName = "8x8x8"; // TODO: get board size from setup.
  let vts = coords.normalizeTileToVts(pos, specOrName); // [4,-3,-3]=>[4,-4,-4] and [-3,-3,-3]=>[-3,-4,-4]
  console.log("view: pieces.js: vts", vts);
  let displacement = [0, 0, 0];

  if(player === "W") {
    displacement = [0, -gap, -gap];
    vts = utils.add(vts, displacement);
  }

  console.log("view: pieces.js:", specOrName, displacement, vts);

  return vts;
}

function renderOnBoard(player, type, pos) {
  console.log("view: pieces.js - renderOnBoard(player, type, pos)", player, type, pos);

  const coords = coords.boardToVts(pos);  // TODO: may need to add this function to coords.
  // TODO: write function renderOnBoard.
}

// Seampoint: more local functions...

