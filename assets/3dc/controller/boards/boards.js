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
  const category  = boardsModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as planes from "../geometry/planes/planes.js";
  import * as quads  from "../geometry/quads/quads.js";
// Seampoint: more imports...

// --- UI ---
export function UI() {
  // console.log("cntrl: boards.js - UI()");
  
  return;
  }
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

