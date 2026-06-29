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
  // ChangePoint:
  const eight  = piecesModule.eight;
  const ten    = piecesModule.ten;
  const tens   = piecesModule.tens;
// Seampoint: more objects...

// --- Dependencies ---
  import * as asserts from "../../tests/core/asserts.js";

  import * as utils   from "../../../utils/utils.js";
  import * as cSetup  from "../../controller/setup/setup.js";

  import * as mTrays  from "../trays/trays.js";
  import * as mBoards from "../boards/boards.js";
  import * as coords  from "../../foundation/coords/coords.js";

  import * as view    from "../../view/view.js";
  import * as vPieces from "../../view/pieces/pieces.js";
  import * as vTrays  from "../../view/trays/trays.js";
  import * as vBoard  from "../../view/boards/boards.js";
// Seampoint: more imports...

// --- Globals ---
  const pieceList = {};  // [key: "WQQP"] => piece = { loc: "~|@", pos: "Q5,5", coords: [0,1,1], vts, ... }
// Seampoint: more globals...

export function getPieceList() { return pieceList; }
// --- UI ---
export function init(entry) {
  console.log("model: pieces.js - init(entry)", entry);
  
  const { action, boardSize, trayType, trayGap, boardSpec } = entry;

  clearPieceState();
  createPiecesInTrays(entry);
  }
  
export function clearPieceState() {
  console.log("model: pieces.js - clearPieceState()");

  for(const key in pieceList) {
    delete pieceList[key];
  }
  }

export function destroy(entry) {
  console.log("model: pieces.js - destroy(entry)", entry);
  
  const { action, boardSize, trayType, trayGap, boardSpec } = entry;

  vPieces.destroyPieces(pieceList);

  for(const key in pieceList) {
    delete pieceList[key];
  }
  }

export function movePieceFromTrayToBoard(key, dstStr) {  // "WQQP", "Q1,1". // TODO: assumes 8x8x8 board.
  // console.log("model: pieces.js - movePieceFromTrayToBoard(key, dstStr)", key, dstStr);

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
    // console.log("*** Parse spec, piece", spec, piece);

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
    // console.log("*** Update tray occupancy");

  // --- Update piece ---
    piece.loc    = "@";                                             // Update pieceList.
    piece.pos    = dstStr; 
    piece.coords = dstTile;
    piece.vts    = dstTile;

    vPieces.placePiece(key);                                        // Relocate the piece mesh (group).

  // Debug instrumention.
    // console.log("*** tray: ", structuredClone(tray[z]));
    // console.log("*** rcs:  ", structuredClone(indices));
    // console.log("*** dst:  ", structuredClone(dstTile));
    // console.log("*** piece:", structuredClone(pieceList[key]));
    // console.log("*** spec: ", structuredClone(spec));

    // console.log("*** pieceList", structuredClone(pieceList));                // Diagnositcs.
    // console.log("*** whiteTray", structuredClone(mTrays.getWhiteTray()));
    // console.log("*** blackTray", structuredClone(mTrays.getBlackTray()));

  return { ok: true, err: null };
  }

export function movePieceTileToTile(key, dstStr) {
  console.log("model: pieces.js - movePieceTileToTile(key, dstStr)", key, dstStr);

  // --- Parse ---
    const spec = cSetup.boardSpec;                                  // Support all three board sizes.

    const piece = pieceList[key];                                   // Ensure valid args - should never fail.
    if(!piece) throw new Error(`Piece ${key} not found.`);
    if(!coords.onBoardStr(dstStr, spec)) throw new Error(`Destination ${dstStr} not on board.`);
    const dstTile = coords.normalizeTileToVts(dstStr, spec);        // Determine occupancy indices.
    // console.log("*** Parse", piece);

  // --- Update piece ---
    piece.loc    = "@";                                             // Update pieceList.
    piece.pos    = dstStr; 
    piece.coords = dstTile;
    piece.vts    = dstTile;

    vPieces.placePiece(key);                                        // Relocate the piece mesh (group).

  // Debug instrumention.
    // console.log("*** rcs:  ", structuredClone(indices));
    // console.log("*** dst:  ", structuredClone(dstTile));
    // console.log("*** piece:", structuredClone(piece));
    // console.log("*** spec: ", structuredClone(spec));

    // console.log("*** pieceList", structuredClone(pieceList));                // Diagnositcs.

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
    // console.log("*** Parse", k, i, j);

  // --- Update tray occupancy ---
    const tray = (player === "W")
      ? mTrays.getWhiteTray() 
      : mTrays.getBlackTray();
    if(tray[k][i][j] != null) {                                  // Update occupancy arrays.
      const err = `Cannot move to an occupied ${tray[k][i][j]} at ${k},${i},${j}.`;
      return { ok: false, err };
    }
    tray[k][i][j] = key;
    // console.log("*** Update tray occupancy", piece.home.trayVts);

  // --- Update piece ---
    piece.loc    = "~";                                            // Update pieceList.
    piece.pos    = piece.home.trayPos; 
    piece.coords = piece.home.trayCoords;

    vPieces.placePieceInTray(key);                                 // Relocate the piece mesh (group).

  // Debug instrumention.
    // console.log("*** tray: ", structuredClone(tray[z]));
    // console.log("*** rcs:  ", structuredClone(indices));
    // console.log("*** dst:  ", structuredClone(piece.home));
    // console.log("*** piece:", structuredClone(pieceList[key]));
    // console.log("*** spec: ", structuredClone(spec));

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

export function createPiece(key, pos, coords, trayOffset=0) { // Needed by promote.
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
    key,
    loc: "~",
    pos,
    coords: [...coords],
    vts, 
    home: { trayPos: pos, trayCoords: [...coords], trayVts: [...vts] }
  };
}

export function piecesOnTile(vts) {
  // console.log("model: pieces.js - piecesOnTile(vts)", vts);

  const keys = [];

  for(const [key, piece] of Object.entries(pieceList)) {
    if(piece.loc !== "@") continue;              // Only board pieces.
    if(utils.isSame(piece.vts, vts)) {
      keys.push(key);
    }
  }

  return keys;
  }

export function isOccupied(vts) {
  if(!vts)  return false;
  return piecesOnTile(vts).length > 0;
  }

export function containsPiece(key, vts) {
  return piecesOnTile(vts).includes(key);
  }

export function canOccupyTile(key, vts) {
  if(isOccupied(vts)) {
    const stackable = hasOtherStackSubpiece(key, vts);
    return stackable;
  }
  return true;
  }

export function hasOtherStackSubpiece(key, vts) {
  // console.log("model: pieces.js - hasOtherStackSubpiece(key, vts)", key, vts);

  return piecesOnTile(vts).some(k => k !== key && isStackMate(key, k));
  }

export function isStackMate(key1, key2) {
  const player1 = key1[0];
  const player2 = key2[0];
  return ((player1 === player2) && (
      (key1[3] === "B" && key2[3] === "D") ||
      (key1[3] === "D" && key2[3] === "B"))
  );
  }

export function test_isStackMate() {
  let count = 0;
  if(asserts.assertEqual(isStackMate("WKBB", "WKBB"), false, "stackMate()")) count++;
  if(asserts.assertEqual(isStackMate("WKBB", "WKBD"), true,  "stackMate()")) count++;
  if(asserts.assertEqual(isStackMate("WKBD", "WKBB"), true,  "stackMate()")) count++;
  if(asserts.assertEqual(isStackMate("WKBD", "WKBD"), false, "stackMate()")) count++;
  console.log("*** count of isStackMate()", count);

  return (count === 4);
}

export function pieceLocOnBoard(key) {
  return pieceList[key].vts;
}
// Seampoint: more global functions...

// --- Helpers ---
function createPiecesInTrays(entry) {
  console.log("model: pieces.js - createPiecesInTrays(entry)", entry);
  
  const { action, boardSize, trayType, trayGap, boardSpec } = entry;
  
  // ChangePoint:
  if(     boardSize === "8x8x8")    { createPiecesForEightBoard(trayGap); } 
  else if(boardSize === "10x8x8")   { createPiecesForTenBoards(trayGap);  }
  else if(boardSize === "10x10x10") { createPiecesForTensBoards(trayGap); }
  else { throw new Error(`Unknown board spec ${spec}.`); }

  console.log("*** pieceList", pieceList);                // Diagnositcs.
  console.log("*** whiteTray", mTrays.getWhiteTray());
  console.log("*** blackTray", mTrays.getBlackTray());

  vPieces.initPieces(pieceList);

  return pieceList;
  }

function destroyPieces(entry) {
  console.log("model: pieces.js - destroyPieces(entry)", entry);
  
  const { action, boardSize, trayType, trayGap, boardSpec } = entry;

  vPieces.destroyPieces(pieceList);

  for(const key in pieceList) {
    delete pieceList[key];
  }
  }

function createPiecesForEightBoard(trayGap) {
  console.log("model: pieces.js - createPiecesForEightBoard(trayGap)", trayGap);
  // console.log("***", eight);
  
  for(const player of ["White","Black"]) {
    const tray = (player === "White") 
    ? mTrays.getWhiteTray() 
    : mTrays.getBlackTray();
    const trayDef = eight.trays[player];
    const offset  = eight.trays.offset + trayGap;

    createPiecesForTray(tray, trayDef, offset);
  }
  }

function createPiecesForTenBoards(trayGap) {
  console.log("model: pieces.js - createPiecesForTenBoards(trayGap)", trayGap);
  // console.log("*** ", ten);
  
  for(const player of ["White","Black"]) {
    const tray = (player === "White") 
    ? mTrays.getWhiteTray() 
    : mTrays.getBlackTray();
    const trayDef = ten.trays[player];
    const offset  = ten.trays.offset + trayGap;

    createPiecesForTray(tray, trayDef, offset);
  }
  }

function createPiecesForTensBoards(trayGap) {
  console.log("model: pieces.js - createPiecesForTensBoards(trayGap)", trayGap);
  // console.log("*** ", tens);

  for(const player of ["White","Black"]) {
    const tray = (player === "White") 
    ? mTrays.getWhiteTray() 
    : mTrays.getBlackTray();
    const trayDef = tens.trays[player];
    const offset  = tens.trays.offset;

    createPiecesForTray(tray, trayDef, offset + trayGap);
  }
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
 *   key,       // WKRP.
 *   loc,       // "@"|"~" - board or tray (player (W|B in the key) determines which one).
 *   pos,       // "<LL><x,y>", x,y: 1-8, or 0-9.
 *   coord,     // location of piece now.
 *   vts,       // [z,x,y].
 *   home: {    // Fixed at creation time.
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

