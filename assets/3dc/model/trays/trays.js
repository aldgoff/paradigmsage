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

// --- Globals ---
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
// Seampoint: more globals...

// --- Build upon previous layers ---
  import * as quads  from "../../geometry/quads/quads.js";
// Seampoint: more imports...

// --- UI ---
export function init(entry) {
  console.log("model: trays.js - init(entry)", entry);

  const { action, boardSize, trayType, initialPos } = entry;  // Informative.

  clearTrays();
}

export function getWhiteTray() {
  return whiteTray;
  }

export function getBlackTray() {
  return blackTray;
}

export function getGap() {
  const gap = 0;  // TODO: get gap from panel.

  return gap;
}
// Seampoint: more global functions...

// --- Helpers ---
function clearTrays() {
  console.log("model: trays.js - clearTrays()");

  let tally = 0;

  // --- White Tray ---
  for(let z = 0; z < whiteTray.length; z++) {
    for(let i = 0; i < whiteTray[z].length; i++) {
      for(let j = 0; j < whiteTray[z][i].length; j++) {

        if(whiteTray[z][i][j] !== null) {
          tally++;
        }

        whiteTray[z][i][j] = null;
      }
    }
  }

  // --- Black Tray ---
  for(let z = 0; z < blackTray.length; z++) {
    for(let i = 0; i < blackTray[z].length; i++) {
      for(let j = 0; j < blackTray[z][i].length; j++) {

        if(blackTray[z][i][j] !== null) {
          tally++;
        }

        blackTray[z][i][j] = null;
      }
    }
  }

  console.log(`model: trays.js - cleared ${tally} tray slots.`);
}
// Seampoint: more local functions...

