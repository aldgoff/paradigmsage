/* File: boards.js
  Path: ./3dc/controller/boards/boards.js
  Purpose: Define interface to the boards control module.
  Author: Allan Goff
  Date: 5/19/26
  Recommended access: import * as cBoards from "../../controller/boards/boards.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import boardsData from "./boards.json" assert { type: "json" };
  const boardsModule = boardsData.boards_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as mBoards from "../../model/boards/boards.js";
// Seampoint: more imports...

// --- Globals ---
// Seampoint: more globals...

// --- UI ---
export function init(entry) {
  console.log("cntrl: boards.js - init(entry)", entry);
  
  const { action, boardSize, trayType, trayGap, boardSpec } = entry;
  
  mBoards.init(entry);

  return;
  }

export function destroy(entry) {
  console.log("cntrl: boards.js - destroy(entry)", entry);
  
  const { action, boardSize, trayType, trayGap, boardSpec } = entry;
  
  mBoards.destroy(entry);

  return;
  }
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

