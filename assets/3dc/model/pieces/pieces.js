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
  const ten    = piecesModule.ten;
  const tens   = piecesModule.tens;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as mState  from "../state/state.js";
  import * as coords  from "../../foundation/coords/coords.js";
  import * as vPieces from "../../view/pieces/pieces.js";
// Seampoint: more imports...

// --- Example only ---
  // const {
  //   side     = "White|Black",        // More concise, "W|B".
  //   piece    = "R|B|D|S|Q|N|P|K",
  //   location = "@|~", // Board or tray.
  //   coords   = "K2,2",
  //   ref      = "absolute|relative"  // If relative is the standard, uneeded, Black disambiguates.
  // };  // Subtle point, B, D & S are color restricted, and stacks can even be crossed.

// --- Global ---
  const pieceList = {};

  // All sized for 10x10x10 board, thus:
  // 8x8x8 is 1 offset, 10x10x10 is 0 offset, and 10x8x8 is mixed.
  const whiteTray =
    Array.from({ length: 10 }, () =>
      Array.from({ length: 2 }, () =>
        Array(2).fill(null)
      )
    );

  const blackTray =
    Array.from({ length: 10 }, () =>
      Array.from({ length: 2 }, () =>
        Array(2).fill(null)
      )
    );

  const occupancy =
    Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () =>
        Array(10).fill(null)
      )
    );

  const origin = [4,4,4]; // Q4,4.
  // Seampoint: more globals.

// --- UI ---
export function init() {
  console.log("model: pieces.js - init(boardSize)", boardSize);

  const setup = mState.fetchCurrentSetup();                   // Make code work for all three board sizes.
  if(!setup) {
    throw new Error("No active setup state.");
  }
  const spec = coords.getBoardSpec(setup.boardSize);  

  pieceList["WKR"] = { loc: "~", pos: "KR1,1", coords: [4,0,0] }; // Place one demo piece in the white tray.
  whiteTray[8][0][0] = "WKR";

  console.log("*** ", whiteTray);                           // Debug instrumention.
  console.log("*** ", pieceList);
}

export function exampleCode() {
  console.log("model: pieces.js - exampleCode()");
  
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
  movePieceFromTileToTile("BKR");
  movePieceFromBoardToTray("WQS");

  splitStackInTray("WQS");
  combineStackinTray("WQS");

  return;
  }

export function movePieceFromTrayToBoard(piece, dstStr) {  // "WQP", "Q1,1" // TODO: assumes 8x8x8 board.
  console.log("model: pieces.js - movePieceFromTrayToBoard(piece)", piece);
  // pieceList["WQP"] = { loc: "~|@", pos: "Q2,2", coords: [0,-2,-2] }; // Document the data structure.

  const setup = mState.fetchCurrentSetup();                   // Make code work for all three board sizes.
  if(!setup) {
    throw new Error("No active setup state.");
  }
  const spec = coords.getBoardSpec(setup.boardSize);  

  const place = pieceList[piece];                             // Ensure valid args - should never fail.
  if(!place) {
    throw new Error(`Piece ${piece} not found.`);
    }
  if(!coords.onBoardRcs(coords.boardToRcs(dstStr, setup.boardSize), setup.boardSize)) {
    throw new Error(`Destination ${dstStr} not on board.`);
  }

  const player = piece[0];  // W|B.
  const side   = piece[1];  // K|Q.
  const type   = piece[2];  // R|B|D|S|Q|N|P|U|K.

  let i;                                                      // Determine tray and array indices.
  let j;
  if(setup.boardSize === "8x8x8") {
    if(     type === "P") { i = 1; j = 1; }
    else if(type === "B") { i = 1; j = 0; }
    else if(type === "D") { i = 0; j = 1; }
    else                  { i = 0; j = 0; }
    }
  else {
    if(     type === "P") { i = 1; j = 1; }
    else                  { i = 0; j = 0; }
  }
  const tray = (player ==="W")? whiteTray : blackTray;

  const dstTile = coords.normalizeTileToVts(dstStr, setup.boardSize);    // Determine occupancy indices,
  const indices = utils.add(origin, dstTile);
  const [z, x, y] = indices;

  if(tray[z][i][j] != piece) {                                // Update occupancy arrays.
    throw new Error(`${piece} not in tray ${tray[z][i][j]}.`);
    }
  if(occupancy[z][x][y]) {
    throw new Error(`Cannot move to an occupied ${occupancy[z][x][y]} tile ${dstStr}.`);
  }
  tray[z][i][j] = null;
  occupancy[z][x][y] = piece;

  place.loc = "@";                                            // Update pieceList.
  place.pos = dstStr; 
  place.coords = dstTile;

  console.log("*** ", tray[z]);                               // Debug instrumention.
  console.log("*** ", indices);
  console.log("*** ", occupancy[z][x][y]);
  console.log("*** ", dstTile);
  console.log("*** ", place);
  console.log("*** ", pieceList[piece]);
  console.log("*** ", spec);
}

export function movePieceFromTileToTile(piece) {
  console.log("model: pieces.js - movePieceFromTileToTile(piece)", piece);

  const place = pieceList[piece];
  if(!place) {
    throw new Error(`Piece ${piece} not to be found.`);
  }

  const src = utils.add(origin, place.coords);

  }

export function movePieceFromBoardToTray(piece) {
  console.log("model: pieces.js - movePieceFromBoardToTray(piece)", piece);

  const place = pieceList[piece];
  if(!place) {
    throw new Error(`Piece ${piece} not to be found.`);
  }

}

export function splitStackInTray(piece) {
  console.log("model: pieces.js - splitStackInTray(piece)", piece);

  const place = pieceList[piece];
  if(!place) {
    throw new Error(`Piece ${piece} not to be found.`);
  }

  }

export function combineStackinTray(piece) {
  console.log("model: pieces.js - combineStackinTray(piece)", piece);

  const place = pieceList[piece];
  if(!place) {
    throw new Error(`Piece ${piece} not to be found.`);
  }

}
// Seampoint: more global functions...

// --- Helpers ---
/* ----- Reset Piece State ----- */
/* Purpose:
 * Null all spatial occupancy structures and piece identity mappings.
 * Intended for:
 *   - new board creation
 *   - load()
 *   - hard reset
 *   - test setup
 *
 * Invariants after reset:
 *   - pieceList contains no entries
 *   - occupancy contains only null
 *   - trays contain only null
 */
export function clearPieceState() {
  console.log("model: pieces.js - clearPieceState()");

  const counts = {
    pieceList: { tally: 0 },
    occupancy: { tally: 0 },
    whiteTray: { tally: 0 },
    blackTray: { tally: 0 }
  };

  // --- Clear canonical identity map ---
  for(const key in pieceList) {
    delete pieceList[key];
    counts.pieceList.tally++;
  }

  // --- Clear board occupancy ---
  for(let z = 0; z < occupancy.length; z++) {
    for(let x = 0; x < occupancy[z].length; x++) {
      for(let y = 0; y < occupancy[z][x].length; y++) {

        if(occupancy[z][x][y] !== null) {
          counts.occupancy.tally++;
        }

        occupancy[z][x][y] = null;
      }
    }
  }

  // --- Clear White tray occupancy ---
  for(let z = 0; z < whiteTray.length; z++) {
    for(let i = 0; i < whiteTray[z].length; i++) {
      for(let j = 0; j < whiteTray[z][i].length; j++) {

        if(whiteTray[z][i][j] !== null) {
          counts.whiteTray.tally++;
        }

        whiteTray[z][i][j] = null;
      }
    }
  }

  // --- Clear Black tray occupancy ---
  for(let z = 0; z < blackTray.length; z++) {
    for(let i = 0; i < blackTray[z].length; i++) {
      for(let j = 0; j < blackTray[z][i].length; j++) {

        if(blackTray[z][i][j] !== null) {
          counts.blackTray.tally++;
        }

        blackTray[z][i][j] = null;
      }
    }
  }

  console.log("clearPieceState() tallies:", counts);
}
// Seampoint: more local functions...

