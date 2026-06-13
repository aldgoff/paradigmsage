/* File: trays.js
  Path: ./3dc/model/trays/trays.js
  Purpose: Define interface to the trays model module.
  Author: Allan Goff
  Date: 5/19/26
  Recommended access: import * as mTrays from "../../model/trays/trays.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import traysData from "./trays.json" assert { type: "json" };
  const traysModule = traysData.trays_module;
  const category  = traysModule.category;
// Seampoint: more objects...

// --- Dependencies ---
  import * as vTrays from "../../view/trays/trays.js";
// Seampoint: more imports...

// --- Globals ---
  const whiteTray =
    Array.from({ length: 10 }, () =>
      Array.from({ length: 2 }, () =>
        Array(2).fill(null)  // Piece key = null|"WQRP".
      )
    );

  const blackTray =
    Array.from({ length: 10 }, () =>
      Array.from({ length: 2 }, () =>
        Array(2).fill(null)  // Piece key = null|"WQRP".
      )
    );
// Seampoint: more globals...

export function getWhiteTray() { return whiteTray; }
export function getBlackTray() { return blackTray; }
// --- UI ---
export function init(entry) {
  console.log("model: trays.js - init(entry)", entry);
  
  const { action, boardSize, trayType, trayGap, boardSpec } = entry;

  clearTrays();
  vTrays.makeTrays(entry);
  }

export function destroy(entry) {
  console.log("model: trays.js - destroy(entry)", entry);
  
  const { action, boardSize, trayType, trayGap, boardSpec } = entry;

  clearTrays();
  vTrays.destroyTrays(entry);
  }

export function trayIndices(type, spec="8x8x8") {
  console.log("model: trays.js - trayIndices(type, spec)", type, spec);

  let i;
  let j;

  if(spec === "8x8x8") {
    if(     type === "P") { i = 1; j = 1; }
    else if(type === "B") { i = 1; j = 0; }
    else if(type === "D") { i = 0; j = 1; }
    else                  { i = 0; j = 0; }
    }
  else {
    if(     type === "P") { i = 1; j = 1; }
    else                  { i = 0; j = 0; }
  }

  return { i, j };
}
// Seampoint: more global functions...

// --- Helpers ---
function clearTrays() {
  // console.log("model: trays.js - clearTrays()");

  for(let z = 0; z < whiteTray.length; z++) { // White tray.
    for(let i = 0; i < whiteTray[z].length; i++) {
      for(let j = 0; j < whiteTray[z][i].length; j++) {
        whiteTray[z][i][j] = null;
        blackTray[z][i][j] = null;
      }
    }
  }
}
// Seampoint: more local functions...

