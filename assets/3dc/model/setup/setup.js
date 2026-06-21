/* File: setup.js
  Path: ./3dc/model/setup/setup.js
  Purpose: State for the setup panel: payload, entry, line.
  Author: Allan Goff
  Date: 5/02/26
  Recommended access: import * as mSetup from "../../model/setup/setup.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import setupData from "./setup.json" assert { type: "json" };
  const setupModule = setupData.setup_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as panels  from "../../panels/panels.js";

  import * as vSetup   from "../../view/setup/setup.js";
// Seampoint: more imports...

// --- Globals ---
// Seampoint: more globals...

// --- UI ---
export function reset() {
  console.log("model: setup.js - reset()");

  vSetup.clearSetup();
  }

export function makeEntry(payload) {
  console.log(`model: setup.js - makeEntry(payload):`, payload);

  const { action, prevBoard, nextBoard, boardSize,trayType,trayGap } = payload;  // Informative.

  const entry = payload;

  return entry;
}

export function buttonAffordances(situation) {
  console.log("model: setup.js - buttonAffordances(situation)", situation);

  switch (situation) {
    case "makeBoard":
      panels.enableButton("makeBoard",   true);
      panels.enableButton("placePiece",  false);
      panels.enableButton("shiftPiece",  false);
      panels.enableButton("returnPiece", false);
      panels.enableButton("freezePuzzle",false);
      panels.enableButton("startingPos", false);
      break;
    case "boardDone":
      panels.enableButton("makeBoard",   true);
      panels.enableButton("placePiece",  true);
      panels.enableButton("shiftPiece",  false);
      panels.enableButton("returnPiece", false);
      panels.enableButton("freezePuzzle",false);
      panels.enableButton("startingPos", true);
      break;
    case "pieces":
      panels.enableButton("placePiece",   true);
      panels.enableButton("shiftPiece",   true);
      panels.enableButton("returnPiece",  true);
      panels.enableButton("freezePuzzle", true);
      panels.enableButton("startingPos",  false);
      break;
    case "emptyTrays":
      panels.enableButton("placePiece",   false);
      panels.enableButton("returnPiece",  true);
      panels.enableButton("shiftPiece",   true);
      panels.enableButton("freezePuzzle", true);
      panels.enableButton("startingPos",  false);
      break;
    case "loaded":
      panels.enableButton("placePiece",   false);
      panels.enableButton("returnPiece",  false);
      panels.enableButton("shiftPiece",   false);
      panels.enableButton("freezePuzzle", false);
      panels.enableButton("startingPos",  false);
      break;
    default:
      throw new Error(`Unknown button situation ${situation} for setup.`);
      break;
  }
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...
