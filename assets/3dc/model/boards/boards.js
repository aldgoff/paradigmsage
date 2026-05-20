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

// --- Build upon previous layers ---
  import * as planes from "../../geometry/planes/planes.js";
// Seampoint: more imports...

// --- Globals ---
  const occupancy =
    Array.from({ length: 10 }, () =>
      Array.from({ length: 10 }, () =>
        Array(10).fill(null)
      )
    );
// Seampoint: more globals...

// --- UI ---
export function init(entry) {
  console.log("model: boards.js - init(entry)", entry);

  const { action, boardSize, trayType, initialPos } = entry;  // Informative.

  clearBoard();
}

export function getBoardSpecs() {
  const specs = "8x8x8";
  // TODO: finish getBoardSpecs().

  return specs;
}

export function getBoardOccupancy() {
  return occupancy;
}

// Seampoint: more global functions...

// --- Helpers ---
function clearBoard() {
  console.log("model: boards.js - clearBoard()");

  let tally = 0;

  for(let z = 0; z < occupancy.length; z++) {
    for(let x = 0; x < occupancy[z].length; x++) {
      for(let y = 0; y < occupancy[z][x].length; y++) {

        if(occupancy[z][x][y] !== null) {
          tally++;
        }

        occupancy[z][x][y] = null;
      }
    }
  }

  console.log(`model: boards.js - cleared ${tally} board slots.`);
}

// Seampoint: more local functions...

