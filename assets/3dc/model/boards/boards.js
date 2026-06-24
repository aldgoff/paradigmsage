/* File: boards.js
  Path: ./3dc/model/boards/boards.js
  Purpose: Define interface to the boards model module.
  Author: Allan Goff
  Date: 5/19/26
  Recommended access: import * as mBoards from "../../model/boards/boards.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import boardsData from "./boards.json" assert { type: "json" };
  const boardsModule = boardsData.boards_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as utils   from "../../../utils/utils.js";       // isSame(a,b).

  import * as mPieces from "../../model/pieces/pieces.js";
  import * as vBoards from "../../view/boards/boards.js";
// Seampoint: more imports...

// --- Globals ---
  const occupancy =
    Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () =>
        Array(10).fill(null)  // Piece key = null|"WKRP".
      )
    );
  const origin = [4,4,4]; // Q4,4 - for the board occupancy 3D array.
// Seampoint: more globals...

export function getBoardOccupancy() { return occupancy; }
export function getOrigin() { return origin; }
// --- UI ---
export function init(board) {
  console.log("model: boards.js - init(board)", board);

  // const { action, boardSize, trayType, trayGap, boardSpec } = entry;
  const { boardSize, trayType, trayGap } = board;

  vBoards.render(board);
  }

export function destroy(board) {
  console.log("model: boards.js - destroy(board)", board);
  
  // const { action, boardSize, trayType, trayGap, boardSpec } = entry;
  const { boardSize, trayType, trayGap } = board;

  vBoards.clear(board);
  }

export function getBoardSpecs() {
  const specs = "8x8x8";
  // TODO: finish getBoardSpecs().

  return specs;
  }

// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

