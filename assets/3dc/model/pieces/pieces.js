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
  const eights = piecesModule.eights;
  const eight  = piecesModule.eight;
  const ten    = piecesModule.ten;
  const tens   = piecesModule.tens;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as cSetup  from "../../controller/setup/setup.js";
  import * as utils   from "../../../utils/utils.js";
  import * as mState  from "../state/state.js";
  import * as mTrays  from "../trays/trays.js";
  import * as mBoards from "../boards/boards.js";
  import * as coords  from "../../foundation/coords/coords.js";
  import * as vPieces from "../../view/pieces/pieces.js";
  import * as vTrays  from "../../view/trays/trays.js";
  import * as vBoard  from "../../view/boards/boards.js";
// Seampoint: more imports...

// --- Example only ---
  // const {
  //   side     = "White|Black",        // More concise, "W|B".
  //   piece    = "R|B|D|S|Q|N|P|K",
  //   location = "@|~", // Board or tray.
  //   coords   = "K2,2",
  //   ref      = "absolute|relative"  // If relative is the standard, uneeded, Black disambiguates.
  // };  // Subtle point, B, D & S are color restricted, and stacks can even be crossed.

// --- Globals ---
  const pieceList = {};  // [key: "WQQP"] => piece = { loc: "~|@", pos: "Q5,5", coords: [0,1,1] }
  const origin = [4,4,4]; // Q4,4 - for the occupancy 3D array.
  // Seampoint: more globals.

// --- UI ---
export function init(entry) {
  console.log("model: pieces.js - init(entry)", entry);

  const { action, boardSize, trayType, initialPos } = entry;  // Informative.

  clearPieceState();

  stdInitialPos(entry);

  console.log("model: pieces.js - whiteTray", mTrays.getWhiteTray());
  console.log("model: pieces.js - blackTray", mTrays.getBlackTray());
  }

export function getPieceList() {
  return pieceList;
  }

export function movePieceFromTrayToBoard(key, dstStr) {  // "WQQP", "Q1,1" // TODO: assumes 8x8x8 board.
  console.log("model: pieces.js - movePieceFromTrayToBoard(key)", key);
  // pieceList[key: "WQQP"] => piece = { loc: "~|@", pos: "Q2,2", coords: [0,-2,-2] }; // Document the data structure.

  // --- Parse ---
    const spec = cSetup.boardSpec;                     // TODO: Make code work for all three board sizes.

    const piece = pieceList[key];                               // Ensure valid args - should never fail.
    if(!piece) throw new Error(`Piece ${key} not found.`);
    if(!coords.onBoardStr(dstStr, spec)) throw new Error(`Destination ${dstStr} not on board.`);

    const player = key[0];  // W|B.                             // Parse the piece key.
    const side   = key[1];  // K|Q.
    const level  = key[2];  // R|N|B|K|Q.
    const type   = key[3];  // R|B|D|S|Q|N|P|U|K.

    const { i, j } = mTrays.trayIndices(type, spec);                     // Determine tray array indices.

  // --- Update tray occupancy ---
    const whiteTray = mTrays.getWhiteTray();                    // Trays and boards.
    const blackTray = mTrays.getBlackTray();
    const tray = (player === "W")? whiteTray : blackTray;
    const dstTile = coords.normalizeTileToVts(dstStr, spec);    // Determine occupancy indices,
    const k = piece.coords[0];
    if(tray[k][i][j] != key) {                                  // Update occupancy arrays.
      const err = `${key} not in tray ${tray[k][i][j]} at ${k},${i},${j}.`;
      return { ok: false, err };
    }
    tray[k][i][j] = null;

  // --- Update board occupancy ---
    const indices = utils.add(origin, dstTile);
    const [z, x, y] = indices;
    const occupancy = mBoards.getBoardOccupancy();
    if(occupancy[z][x][y]) {
      const err = `Cannot move to an occupied ${occupancy[z][x][y]} tile ${dstStr}.`;
      return { ok: false, err };
    }
    occupancy[z][x][y] = key;

  // --- Update piece ---
    piece.loc = "@";                                            // Update pieceList.
    piece.pos = dstStr; 
    piece.coords = dstTile;

    vPieces.placePiece(key);                                 // Relocate the piece mesh (group).

  // Debug instrumention.
    console.log("*** tray: ", tray[z]);
    console.log("*** rcs:  ", indices);
    console.log("*** key:  ", occupancy[z][x][y]);
    console.log("*** dst:  ", dstTile);
    console.log("*** key:  ", pieceList[key]);
    console.log("*** spec: ", spec);

  return { ok: true, err: null };
  }

export function movePieceTileToTile(key, dstStr) {
  console.log("model: pieces.js - movePieceTileToTile(key, dstStr)", key, dstStr);

  // TODO: code movePieceTileToTile.

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
    const spec = cSetup.boardSpec;                     // TODO: Make code work for all three board sizes.

    const piece = pieceList[key];                               // Ensure valid args - should never fail.
    if(!piece) throw new Error(`Piece ${key} not found.`);

    // traySlot(key, spec);

    const player = key[0];  // W|B.                             // Parse the piece key.
    const side   = key[1];  // K|Q.
    const level  = key[2];  // R|N|B|K|Q.
    const type   = key[3];  // R|B|D|S|Q|N|P|U|K.

    const { i, j } = mTrays.trayIndices(type, spec);                     // Determine tray array indices.
  
  return { ok: true, err: null };
  
  // --- Update board occupancy ---
    const indices = utils.add(origin, dstTile);
    const [z, x, y] = indices;
    const occupancy = mBoards.getBoardOccupancy();
    if(occupancy[z][x][y] != key) {
      const err = `${key} not on board ${occupancy[z][x][y]} at ${z},${x},${y}.`;
      return { ok: false, err };
    }
    occupancy[z][x][y] = null;

  // --- Update tray occupancy ---
    const whiteTray = mTrays.getWhiteTray();                    // Trays and boards.
    const blackTray = mTrays.getBlackTray();
    const tray = (player === "W")? whiteTray : blackTray;
    const dstTile = coords.normalizeTileToVts(dstStr, spec);    // Determine occupancy indices,
    const k = piece.coords[0];
    if(tray[k][i][j] != key) {                                  // Update occupancy arrays.
      const err = `Cannot move to an occupied ${tray[k][i][j]} at ${k},${i},${j}.`;
      return { ok: false, err };
    }
    tray[k][i][j] = key;

  // --- Update piece ---
    piece.loc = "~";                                            // Update pieceList.
    piece.pos = dstStr; 
    piece.coords = dstTile;

    vPieces.placePiece(key);                                 // Relocate the piece mesh (group).

  // Debug instrumention.
    console.log("*** tray: ", tray[z]);
    console.log("*** rcs:  ", indices);
    console.log("*** key:  ", occupancy[z][x][y]);
    console.log("*** dst:  ", dstTile);
    console.log("*** key:  ", pieceList[key]);
    console.log("*** spec: ", spec);

  return { ok: true, err: null };
}

export function splitStackInTray(piece) {
  console.log("model: pieces.js - splitStackInTray(piece)", piece);

  // TODO: code splitStackInTray.

  const place = pieceList[piece];
  if(!place) {
    throw new Error(`Piece ${piece} not to be found.`);
  }
  }

export function combineStackinTray(piece) {
  console.log("model: pieces.js - combineStackinTray(piece)", piece);

  // TODO: code combineStackinTray.

  const place = pieceList[piece];
  if(!place) {
    throw new Error(`Piece ${piece} not to be found.`);
  }

}
// Seampoint: more global functions...

// --- Helpers ---
function traySlot(key, spec="8x8x8") {
  console.log("model: pieces.js - traySlot(key, spec)", key, spec);

  let board = null;
  switch(spec) {
    case "8x8x8":    board = eights; break;
    case "8x10x10":  board = ten;    break;
    case "10x10x10": board = tens;   break;
    default: throw new Error(`Unsupported board spec ${spec}.`); break;
  }

  const player = key[0];  // W|B.                             // Parse the piece key.
  const side   = key[1];  // K|Q.
  const level  = key[2];  // R|N|B|K|Q.
  const type   = key[3];  // R|B|D|S|Q|N|P|U|K.

  const tray = (player === 'W') ? board.trays.White: board.trays.Black;
  const column = (type === 'P') ? tray.pawns: tray.pieces;

  console.log("*** tray:", tray);
  console.log("*** column:", column);
  console.log("*** player, type:", player, type);
  // ['R~KR1,1', 'N~KN1,1', 'B~KB1,1', 'K~K1,1', 'Q~Q1,1', 'D~QB1,2', 'N~QN1,1', 'R~QR1,1']

  console.log("*** White:", mTrays.getWhiteTray());
  console.log("*** Black:", mTrays.getBlackTray());

  return { k, i, j };
}

function stdInitialPos(entry) {
  console.log("model: pieces.js - stdInitialPos(entry)", entry);

  const whiteTray = mTrays.getWhiteTray();
  const blackTray = mTrays.getBlackTray();

  const spec = cSetup.boardSpec;
  
  if(true) { // New code, refactored and board size aware.
    if(     spec === "8x8x8")    { createPiecesForEightBoard();} 
    else if(spec === "10x8x8")   { createPiecesForTenBoards(); }
    else if(spec === "10x10x10") { createPiecesForTensBoards(); }
    else { throw new Error(`Unknown board spec ${spec}.`); }
  }
  else {  // Old code, assumed 8x8x8.
    const whitePieces = ["WQRR", "WQNN", "WQBS", "WQQQ", "WKKK", "WKBS", "WKNN", "WKRR"];
    let positions = ["QR1,1", "QN1,1", "QB1,1", "Q1,1", "K1,1", "KB1,1", "KN1,1", "KR1,1"];
    for(let k=1; k<=8; k++) {
      const piece = whitePieces[k-1];
      const pos = positions[k-1];
      pieceList[piece] = { loc: "~", pos, coords: [k,0,0] }; // Place demo pieces in the white tray.
      whiteTray[k][0][0] = piece;
    }

    const whitePawns = ["WQRP", "WQNP", "WQBP", "WQQP", "WKKP", "WKBP", "WKNP", "WKRP"];
    positions = ["QR2,2", "QN2,2", "QB2,2", "Q2,2", "K2,2", "KB2,2", "KN2,2", "KR2,2"];
    for(let k=1; k<=8; k++) {
      const piece = whitePawns[k-1];
      const pos = positions[k-1];
      pieceList[piece] = { loc: "~", pos, coords: [k,1,1] }; // Place demo pieces in the white tray.
      whiteTray[k][1][1] = piece;
    }

    const blackPieces = ["BQRR", "BQNN", "BQBS", "BQQQ", "BKKK", "BKBS", "BKNN", "BKRR"];
    positions = ["QR8,8", "QN8,8", "QB8,8", "Q8,8", "K8,8", "KB8,8", "KN8,8", "KR8,8"];
    for(let k=1; k<=8; k++) {
      const piece = blackPieces[k-1];
      const pos = positions[k-1];
      pieceList[piece] = { loc: "~", pos, coords: [k,0,0] }; // Place demo pieces in the black tray.
      blackTray[k][0][0] = piece;
    }

    const blackPawns = ["BQRP", "BQNP", "BQBP", "BQQP", "BKKP", "BKBP", "BKNP", "BKRP"];
    positions = ["QR7,7", "QN7,7", "QB7,7", "Q7,7", "K7,7", "KB7,7", "KN7,7", "KR7,7"];
    for(let k=1; k<=8; k++) {
      const piece = blackPawns[k-1];
      const pos = positions[k-1];
      pieceList[piece] = { loc: "~", pos, coords: [k,1,1] }; // Place demo pieces in the black tray.
      blackTray[k][1][1] = piece;
    }

    // Test stack subpieces for White.
    pieceList["WKBB"] = { loc: "~", pos: "KB2,1", coords: [6,0,0] };  whiteTray[6][1][0] = "WKBB";
    pieceList["WKBD"] = { loc: "~", pos: "KB1,2", coords: [6,0,0] };  whiteTray[6][0][1] = "WKBD";
    pieceList["WQBB"] = { loc: "~", pos: "QB2,1", coords: [3,0,0] };  whiteTray[3][1][0] = "WQBB";
    pieceList["WQBD"] = { loc: "~", pos: "QB1,2", coords: [3,0,0] };  whiteTray[3][0][1] = "WQBD";

    // Test stack subpieces for Black.
    pieceList["BKBB"] = { loc: "~", pos: "KB7,8", coords: [6,0,0] };  blackTray[6][1][0] = "BKBB";
    pieceList["BKBD"] = { loc: "~", pos: "KB8,7", coords: [6,0,0] };  blackTray[6][0][1] = "BKBD";
    pieceList["BQBB"] = { loc: "~", pos: "QB7,8", coords: [3,0,0] };  blackTray[3][1][0] = "BQBB";
    pieceList["BQBD"] = { loc: "~", pos: "QB8,7", coords: [3,0,0] };  blackTray[3][0][1] = "BQBD";
  }

  console.log("*** pieceList", pieceList);
  console.log("*** whiteTray", mTrays.getWhiteTray());
  console.log("*** blackTray", mTrays.getBlackTray());

  vPieces.initPieces(pieceList);
  }

function clearPieceState() {
  // console.log("model: pieces.js - clearPieceState()");

  let tally = 0;

  for(const key in pieceList) {
    delete pieceList[key];
    tally++;
  }
  }

function createPiecesForEightBoard() {
  console.log("model: pieces.js - createPiecesForEightBoard()", );

  console.log("*** ", eight);

  const whiteTray = mTrays.getWhiteTray();
  const blackTray = mTrays.getBlackTray();
  
  for(const player of ["White","Black"]) {
    const tray = (player === "White") ? whiteTray : blackTray;
    const trayDef = eight.trays[player];

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
          pieceList[key] = createPiece(key, pos, coords);
          tray[k][i][j] = key;
        }
      }
    }
  }
  }

function createPiecesForTenBoards() {
  console.log("model: pieces.js - createPiecesForTenBoards()", );

  console.log("*** ", ten);

  const whiteTray = mTrays.getWhiteTray();
  const blackTray = mTrays.getBlackTray();
  
  for(const player of ["White","Black"]) {
    const tray = (player === "White") ? whiteTray : blackTray;
    const trayDef = ten.trays[player];

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
          pieceList[key] = createPiece(key, pos, coords);
          tray[k][i][j] = key;
        }
      }
    }
  }
  }

function createPiecesForTensBoards() {  // TODO: adjust the tray offsets.
  console.log("model: pieces.js - createPiecesForTensBoards()", );

  console.log("*** ", tens);

  const whiteTray = mTrays.getWhiteTray();
  const blackTray = mTrays.getBlackTray();
  
  for(const player of ["White","Black"]) {
    const tray = (player === "White") ? whiteTray : blackTray;
    const trayDef = tens.trays[player];

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
          pieceList[key] = createPiece(key, pos, coords, 1);
          tray[k][i][j] = key;
        }
      }
    }
  }
  }

function createPiece(key, pos, coords, trayOffset=0) {
  const [k, i, j] = coords;
  const player = key[0];
  const type = key[3];
  const offset = (player === "W") ? -5-trayOffset : 6+trayOffset;
  return {  // "WQRP" - player, side, level, type.
    loc: "~",
    pos,
    coords: [...coords],
    vts: (player === "W") ? [k-4, i+offset, j+offset] : [k-4, -i+offset, -j+offset],
    home: { trayPos: pos, trayCoords: [...coords] }
  };
}
/*
  piece = {
    loc,        // "@"|"~" - board or tray (player (W|B in the key) determines which one).
    curPos,     // "<LL><x,y>", x,y: 1-8, or 0-9.
    curCoords,  // location of piece now: either [r,x,y] = vts + origin ([4,4,4]), or [k,i,j].
    vts,        // [z,x,y].
    home: {     // Fixed at creation time.
      trayPos,    // "<LL><i,j>", i,j: 1-2, (pawns on 2,2).
      trayCoords  // [k,i,j], k: 1-8, or 0-9, i,j: 0-1, bishop on 1,0, duke on 0,1.
    }
    split: {
      bishop: {
        trayPos: "KB2,1",
        trayCoords: [6,1,0]
      },
      duke: {
        trayPos: "KB1,2",
        trayCoords: [6,0,1]
      }
    }
  } 

*/

function exampleCode() {
  console.log("model: pieces.js - exampleCode()");

  const whiteTray = mTrays.getWhiteTray();
  const blackTray = mTrays.getBlackTray();

  // Example, exploratory code...
  pieceList["WQP"] = { loc: "~", pos: "Q2,2", coords: [0,-2,-2] };  // Q pawn starts life in white tray.

  // Move White queen pawn from tray to board.
  pieceList["WQP"].loc = "@";
  whiteTray[4][1][1] = null; // 0,0 would be a major piece, 1,0 a stack sub piece.
  occupancy[4][2][2] = "WQP";  // Places White pawn on Q2,2.
  // The White queen pawn is on the board at Q2,2, ala vts=[0,-2,-2].

  // When captured...
  occupancy[4][2][2] = null;  // Removes White pawn from Q2,2.
  whiteTray[4][1][1] = "WQP"; // 0,0 would be a major piece, 1,0 a stack sub piece.
  pieceList["WQP"].loc = "~";

  movePieceFromTrayToBoard("WQP");
  movePieceTileToTile("BKR");
  movePieceFromBoardToTray("WQS");

  splitStackInTray("WQS");
  combineStackinTray("WQS");

  return;
}
// Seampoint: more local functions...

/* TODO QC:
  All sized for 10x10x10 board, thus:
  8x8x8 is 1 offset, 10x10x10 is 0 offset, and 10x8x8 is mixed.
 */
