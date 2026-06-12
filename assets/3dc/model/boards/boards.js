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
  const category  = boardsModule.category;
// Seampoint: more objects...

// --- Dependencies ---
  import * as vBoards from "../../view/boards/boards.js";
// Seampoint: more imports...

// --- Globals ---
  const occupancy =
    Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () =>
        Array(10).fill(null)  // Piece key = null|"WQRP".
      )
    );
// Seampoint: more globals...

export function getBoardOccupancy() { return occupancy; }
// --- UI ---
export function init(entry) {
  console.log("model: boards.js - init(entry)", entry);

  const { action, boardSize, trayType, trayGap, boardSpec } = entry;

  clearOccupancy();
  vBoards.render(entry);
  }

export function destroy(entry) {
  console.log("model: boards.js - destroy(entry)", entry);
  
  const { action, boardSize, trayType, trayGap, boardSpec } = entry;

  clearOccupancy();
  vBoards.clear(entry);
  }

export function getBoardSpecs() {
  const specs = "8x8x8";
  // TODO: finish getBoardSpecs().

  return specs;
  }


export function clearPieceFromBoardOccupancy(key) { // occupancy[z][x][y] = null - O(3).
  const occ = occupancy;

  for(let z = 0; z < occ.length; z++) {
    for(let x = 0; x < occ[z].length; x++) {
      for(let y = 0; y < occ[z][x].length; y++) {
        if(occ[z][x][y] === key) {
          occ[z][x][y] = null;      // Clear.
        }
      }
    }
  }
}
// Seampoint: more global functions...

// --- Helpers ---
function clearOccupancy() {
  console.log("model: boards.js - clearOccupancy()");

  for(let z = 0; z < occupancy.length; z++) {
    for(let x = 0; x < occupancy[z].length; x++) {
      for(let y = 0; y < occupancy[z][x].length; y++) {
        occupancy[z][x][y] = null;
      }
    }
  }
}

function pieceLocOnBoard(key) { // [z, x, y]|null.
  const occ = occupancy;

  for(let z = 0; z < occ.length; z++) {
    for(let x = 0; x < occ[z].length; x++) {
      for(let y = 0; y < occ[z][x].length; y++) {
        if(occ[z][x][y] === key) {
          return [z, x, y];
        }
      }
    }
  }

  return null;
}
// Seampoint: more local functions...

