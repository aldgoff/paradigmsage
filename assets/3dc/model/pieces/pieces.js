/* File: pieces.js
  Path: ./3dc/model/pieces/pieces.js
  Purpose: State for pieces.
  Author: Allan Goff
  Date: 5/03/26
  Recommended access: import * as mPieces from "../../model/pieces/pieces.js";
  UI: the export functions.
*/

// --- Load JSON ---
import piecesData from "./pieces.json" assert { type: "json" };
  const piecesModule = piecesData.pieces_module;
  const eight  = piecesModule.eight;
  const ten    = piecesModule.ten;
  const tens   = piecesModule.tens;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as utils   from "../../../utils/utils.js";
  import * as cSetup  from "../../controller/setup/setup.js";

  import * as mTrays  from "../trays/trays.js";
  import * as mBoards from "../boards/boards.js";
  import * as coords  from "../../foundation/coords/coords.js";

  import * as vPieces from "../../view/pieces/pieces.js";
  import * as vTrays  from "../../view/trays/trays.js";
  import * as vBoard  from "../../view/boards/boards.js";
// Seampoint: more imports...

// --- Globals ---
  const pieceList = {};  // [key: "WQQP"] => piece = { loc: "~|@", curPos: "Q5,5", curCoords: [0,1,1], vts, ... }
  const origin = [4,4,4]; // Q4,4 - for the board occupancy 3D array.
// Seampoint: more globals...

// --- UI ---
export function init(entry) {
  console.log("model: pieces.js - init(entry)", entry);

  const { action, boardSize, trayType, initialPos } = entry;  // Informative.

  clearPieceState();

  createPiecesInTrays(entry);
  }

export function getPieceList() {
  return pieceList;
}

export function movePieceFromTrayToBoard(key, dstStr) {  // "WQQP", "Q1,1". // TODO: assumes 8x8x8 board.
  console.log("model: pieces.js - movePieceFromTrayToBoard(key, dstStr)", key, dstStr);

  // --- Parse ---
    const spec = cSetup.boardSpec;                                  // Support all three board sizes.

    const piece = pieceList[key];                                   // Ensure valid args - should never fail.
    if(!piece) throw new Error(`Piece ${key} not found.`);
    if(!coords.onBoardStr(dstStr, spec)) throw new Error(`Destination ${dstStr} not on board.`);

    const player = key[0];  // W|B.                                 // Parse the piece key.
    const side   = key[1];  // K|Q.
    const level  = key[2];  // R|N|B|K|Q.
    const type   = key[3];  // R|B|D|S|Q|N|P|U|K.

    const { i, j } = mTrays.trayIndices(type, spec);                // Determine tray array indices.
    console.log("*** Parse");

  // --- Update tray occupancy ---
    const whiteTray = mTrays.getWhiteTray();                        // Trays and boards.
    const blackTray = mTrays.getBlackTray();
    const tray = (player === "W")? whiteTray : blackTray;
    const dstTile = coords.normalizeTileToVts(dstStr, spec);        // Determine occupancy indices,
    const k = piece.coords[0];
    if(tray[k][i][j] != key) {                                      // Update occupancy arrays.
      const err = `${key} not in tray ${tray[k][i][j]} at ${k},${i},${j}.`;
      return { ok: false, err };
    }
    tray[k][i][j] = null;
    console.log("*** Update tray occupancy");

  // --- Update board occupancy ---
    const indices = utils.add(origin, dstTile);
    const [z, x, y] = indices;
    const occupancy = mBoards.getBoardOccupancy();
    if(occupancy[z][x][y]) {
      const err = `Cannot move to an occupied ${occupancy[z][x][y]} tile ${dstStr}.`;
      return { ok: false, err };
    }
    occupancy[z][x][y] = key;
    console.log("*** Update board occupancy");

  // --- Update piece ---
    piece.loc    = "@";                                             // Update pieceList.
    piece.pos    = dstStr; 
    piece.coords = dstTile;
    piece.vts    = dstTile;

    vPieces.placePiece(key);                                        // Relocate the piece mesh (group).

  // Debug instrumention.
    console.log("*** tray: ", structuredClone(tray[z]));
    console.log("*** occ:  ", structuredClone(occupancy[z][x][y]));
    console.log("*** rcs:  ", structuredClone(indices));
    console.log("*** dst:  ", structuredClone(dstTile));
    console.log("*** piece:", structuredClone(pieceList[key]));
    console.log("*** spec: ", structuredClone(spec));

    console.log("*** pieceList", structuredClone(pieceList));                // Diagnositcs.
    console.log("*** whiteTray", structuredClone(mTrays.getWhiteTray()));
    console.log("*** blackTray", structuredClone(mTrays.getBlackTray()));

  return { ok: true, err: null };
  }

export function movePieceTileToTile(key, dstStr) {
  console.log("model: pieces.js - movePieceTileToTile(key, dstStr)", key, dstStr);

  // TODO: finish movePieceTileToTile.

  const piece = pieceList[key];
  if(!piece) {
    throw new Error(`Piece ${key} noT found.`);
  }

  console.log("*** MORE TO COME.");

  // const src = utils.add(origin, place.coords);
  
  return { ok: true, err: null };
  }

export function movePieceFromBoardToTray(key) {
  console.log("model: pieces.js - movePieceFromBoardToTray(key)", key);

  // --- Parse ---
    const spec = cSetup.boardSpec;

    const piece = pieceList[key];                               // Ensure valid args - should never fail.
    if(!piece) throw new Error(`Piece ${key} not found.`);

    const player = key[0];  // W|B.                             // Parse the piece key.
    const side   = key[1];  // K|Q.
    const level  = key[2];  // R|N|B|K|Q.
    const type   = key[3];  // R|B|D|S|Q|N|P|U|K.

    const { loc, pos, coords, vts, home } = piece;              // Parse the piece fields.

    // const { i, j } = mTrays.trayIndices(type, spec);                // Determine tray array indices.
    const [k, i, j] = piece.home.trayCoords;
    console.log("*** Parse", k, i, j);

  // return { ok: true, err: null };
  
  // --- Update board occupancy ---
    const indices = utils.add(origin, coords);
    const [z, x, y] = indices;
    const occupancy = mBoards.getBoardOccupancy();
    if(occupancy[z][x][y] != key) {
      const err = `${key} not on board ${occupancy[z][x][y]} at ${z},${x},${y}.`;
      return { ok: false, err };
    }
    occupancy[z][x][y] = null;
    console.log("*** Update board occupancy", indices);

  // --- Update tray occupancy ---
    const tray = (player === "W")
      ? mTrays.getWhiteTray() 
      : mTrays.getBlackTray();
    if(tray[k][i][j] != null) {                                  // Update occupancy arrays.
      const err = `Cannot move to an occupied ${tray[k][i][j]} at ${k},${i},${j}.`;
      return { ok: false, err };
    }
    tray[k][i][j] = key;
    console.log("*** Update tray occupancy", piece.home.trayVts);

  // --- Update piece ---
    piece.loc    = "~";                                            // Update pieceList.
    piece.pos    = piece.home.trayPos; 
    piece.coords = piece.home.trayCoords;

    vPieces.placePieceInTray(key);                                 // Relocate the piece mesh (group).

  // Debug instrumention.
    console.log("*** occ:  ", structuredClone(occupancy[z][x][y]));
    console.log("*** tray: ", structuredClone(tray[z]));
    console.log("*** rcs:  ", structuredClone(indices));
    console.log("*** dst:  ", structuredClone(piece.home));
    console.log("*** piece:", structuredClone(pieceList[key]));
    console.log("*** spec: ", structuredClone(spec));

    console.log("*** pieceList", structuredClone(pieceList));                // Diagnositcs.
    console.log("*** whiteTray", structuredClone(mTrays.getWhiteTray()));
    console.log("*** blackTray", structuredClone(mTrays.getBlackTray()));

  return { ok: true, err: null };
}

export function splitStackInTray(piece) {
  console.log("model: pieces.js - splitStackInTray(piece)", piece);

  // TODO: finish splitStackInTray().

  const place = pieceList[piece];
  if(!place) {
    throw new Error(`Piece ${piece} not to be found.`);
  }
  }

export function combineStackinTray(piece) {
  console.log("model: pieces.js - combineStackinTray(piece)", piece);

  // TODO: finish combineStackinTray().

  const place = pieceList[piece];
  if(!place) {
    throw new Error(`Piece ${piece} not to be found.`);
  }

}
// Seampoint: more global functions...

// --- Helpers ---
function createPiecesInTrays(entry) {
  console.log("model: pieces.js - createPiecesInTrays(entry)", entry);

  const spec = cSetup.boardSpec;
  
  if(     spec === "8x8x8")    { createPiecesForEightBoard();} 
  else if(spec === "10x8x8")   { createPiecesForTenBoards(); }
  else if(spec === "10x10x10") { createPiecesForTensBoards(); }
  else { throw new Error(`Unknown board spec ${spec}.`); }

  console.log("*** pieceList", pieceList);                // Diagnositcs.
  console.log("*** whiteTray", mTrays.getWhiteTray());
  console.log("*** blackTray", mTrays.getBlackTray());

  vPieces.initPieces(pieceList);
  }

function clearPieceState() {
  // console.log("model: pieces.js - clearPieceState()");

  for(const key in pieceList) {
    delete pieceList[key];
  }
  }

function createPiecesForEightBoard() {
  console.log("model: pieces.js - createPiecesForEightBoard()", );
  console.log("*** ", eight);
  
  for(const player of ["White","Black"]) {
    const tray = (player === "White") 
    ? mTrays.getWhiteTray() 
    : mTrays.getBlackTray();
    const trayDef = eight.trays[player];
    const offset  = eight.trays.offset;

    createPiecesForTray(tray, trayDef, offset);
  }
  }

function createPiecesForTenBoards() {
  console.log("model: pieces.js - createPiecesForTenBoards()", );
  console.log("*** ", ten);
  
  for(const player of ["White","Black"]) {
    const tray = (player === "White") 
    ? mTrays.getWhiteTray() 
    : mTrays.getBlackTray();
    const trayDef = ten.trays[player];
    const offset  = ten.trays.offset;

    createPiecesForTray(tray, trayDef, offset);
  }
  }

function createPiecesForTensBoards() {
  console.log("model: pieces.js - createPiecesForTensBoards()", );
  console.log("*** ", tens);
  
  for(const player of ["White","Black"]) {
    const tray = (player === "White") 
    ? mTrays.getWhiteTray() 
    : mTrays.getBlackTray();
    const trayDef = tens.trays[player];
    const offset  = tens.trays.offset;

    createPiecesForTray(tray, trayDef, offset);
  }
  }

function createPiece(key, pos, coords, trayOffset=0) {
  // console.log("model: pieces.js - createPiece(key, pos, coords, trayOffset)", key, pos, coords, trayOffset);

  const [k, i, j] = coords;
  const player = key[0];
  const offset = (player === "W") 
    ? -5 - trayOffset 
    :  6 + trayOffset;
  const vts = (player === "W") 
    ? [k-4, i+offset, j+offset] 
    : [k-4, -i+offset, -j+offset];

  return {  // "WQRP" - player, side, level, type.
    loc: "~",
    pos,
    coords: [...coords],
    vts, 
    home: { trayPos: pos, trayCoords: [...coords], trayVts: [...vts] }
  };
  }

function createPiecesForTray(tray, trayDef, offset=0) {
  // console.log("model: pieces.js - createPiecesForTray(tray, trayDef, offset)", tray, trayDef, offset);

  for(let k=0; k<10; k++) {
    for(let i=0; i<2; i++) {
      for(let j=0; j<2; j++) {
        const key = trayDef[k][i][j];
        if(!key) continue;

        const side  = key[1];
        const level = key[2];
        const LL = (side === level) ? `${side}` : `${side}${level}`;
        const pos = `${LL}${i+1},${j+1}`;  // "QR" <LL>i,j
        const coords = [k,i,j];

        pieceList[key] = createPiece(key, pos, coords, offset);
        tray[k][i][j] = key;
      }
    }
  }
}
// Seampoint: more local functions...

/* piece = {  // Field documentation.
 *   loc,        // "@"|"~" - board or tray (player (W|B in the key) determines which one).
 *   curPos,     // "<LL><x,y>", x,y: 1-8, or 0-9.
 *   curCoords,  // location of piece now.
 *   vts,        // [z,x,y].
 *   home: {     // Fixed at creation time.
 *     trayPos,    // "<LL><i,j>", i,j: 1-2, (pawns on 2,2).
 *     trayCoords, // [k,i,j], k: 1-8, or 0-9, i,j: 0-1, bishop on 1,0, duke on 0,1.
 *     trayVts     // virtual Tile Space location in tray.
 *   }
 *   split: {
 *     bishop: {
 *       trayPos: "KB2,1",
 *       trayCoords: [6,1,0]
 *     },
 *     duke: {
 *       trayPos: "KB1,2",
 *       trayCoords: [6,0,1]
 *     }
 *   }
 * } 
*/

