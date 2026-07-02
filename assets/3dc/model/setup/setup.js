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

  import * as cSelects from "../../controller/selections/selections.js";
  import * as cSetup   from "../../controller/setup/setup.js";

  import * as vSetup   from "../../view/setup/setup.js";
// Seampoint: more imports...

// --- Globals ---
// Seampoint: more globals...

// --- UI ---
export function reset() {
  console.log("model: setup.js - reset()");

  vSetup.clearSetup();
}

export function makeBoardEntry(payload) {
  console.log(`model: setup.js - makeBoardEntry(payload):`, payload);

  const { action, prevBoard, nextBoard } = payload;  // Informative.

  const entry = payload;

  return entry;
  }

export function makePlaceEntry(payload, selections) {
  console.log(`model: setup.js - makePlaceEntry(payload, selections):`, payload, selections);

  const { action } = payload;
  const { pieceSelections, tileSelections } = selections;

  const size = cSetup.getCurrBoard().boardSize;           // Parse.
  const pieces = pieceSelections.size;
  const tiles  = tileSelections.size;

  const [key1, key2] = [...pieceSelections];              // Pieces & tiles.
  const { piece1, piece2 } = cSelects.getPieces([...pieceSelections]);
  const { sdStr1 } = cSelects.getTiles([...tileSelections], size);

  const prev1 = `~${piece1.pos}`;                         // Assemble.
  const prev2 = (piece2) ? `~${piece2.pos}` : null;
  const post = `@${sdStr1}`;

  let list = [];
  if(     pieces === 1 && tiles === 1) {                  // Single piece.
    list.push({ key: key1, prev: prev1, post });
    }
  else if(pieces === 2 && tiles === 1) {                  // Stack.
    list.push({ key: key1, prev: prev1, post });
    list.push({ key: key2, prev: prev2, post });
    }
  else { throw new Error(`Unexpected pieces ${pieces} and tiles ${tiles}.`);}

  cleanupSelections();                                    // Cleanup.

  const entry = { action, list };                         // Entry
  return entry;
  }

export function makeShiftEntry(payload, selections) {
  console.log(`model: setup.js - makeShiftEntry(payload, selections):`, payload, selections);

  const { action } = payload;
  const { pieceSelections, tileSelections } = selections;

  const size = cSetup.getCurrBoard().boardSize;           // Parse.
  const pieces = pieceSelections.size;
  const tiles  = tileSelections.size;

  const [key1, key2] = [...pieceSelections];              // Pieces & tiles.
  const { piece1, piece2 } = cSelects.getPieces([...pieceSelections]);
  const { sdStr1 } = cSelects.getTiles([...tileSelections], size);

  const prev1 = `@${piece1.pos}`;                         // Assemble.
  const prev2 = (piece2) ? `@${piece2.pos}` : null;
  const post = `@${sdStr1}`;

  let list = [];
  if(     pieces === 1 && tiles === 1) {                  // Single piece.
    list.push({ key: key1, prev: prev1, post });
    }
  else if(pieces === 2 && tiles === 1) {                  // Stack.
    list.push({ key: key1, prev: prev1, post });
    list.push({ key: key2, prev: prev2, post });
    }
  else { throw new Error(`Unexpected pieces ${pieces} and tiles ${tiles}.`);}

  cleanupSelections();                                    // Cleanup.

  const entry = { action, list };                         // Entry
  return entry;
  }

export function makeReturnEntry(payload, selections) {
  console.log(`model: setup.js - makeReturnEntry(payload, selections):`, payload, selections);

  const { action } = payload;
  const { pieceSelections, tileSelections } = selections;

  const size = cSetup.getCurrBoard().boardSize;           // Parse.
  const pieces = pieceSelections.size;
  const tiles  = tileSelections.size;

  const [key1, key2] = [...pieceSelections];              // Pieces & tiles.
  const { piece1, piece2 } = cSelects.getPieces([...pieceSelections]);
  const { sdStr1 } = cSelects.getTiles([...tileSelections], size);

  const prev1 = `@${piece1.pos}`;                         // Assemble.
  const prev2 = (piece2) ? `~${piece2.pos}` : null;
  const post1 = `~${piece1.home.trayPos}`;
  const post2 = (piece2) ? `~${piece2.home.trayPos}` : null;

  let list = [];
  if(     pieces === 1 && tiles === 0) {                  // Single piece.
    list.push({ key: key1, prev: prev1, post: post1 });
    }
  else if(pieces === 2 && tiles === 0) {                  // Stack.
    list.push({ key: key1, prev: prev1, post: post1 });
    list.push({ key: key2, prev: prev2, post: post2 });
    }
  else { throw new Error(`Unexpected pieces ${pieces} and tiles ${tiles}.`);}

  cleanupSelections();                                    // Cleanup.

  const entry = { action, list };                         // Entry
  return entry;
}

export function buttonAffordances(situation) {
  console.log(`model: setup.js - buttonAffordances(${situation})`);

  switch (situation) {
    case "on":              // Enable all panel buttons.
      panels.enableButton("makeBoard",   true);
      panels.enableButton("placePiece",  true);
      panels.enableButton("shiftPiece",  true);
      panels.enableButton("returnPiece", true);
      panels.enableButton("freezePuzzle",true);
      panels.enableButton("startingPos", true);
    break;

    case "makeBoard":
      buttonAffordances("off");
      panels.enableButton("makeBoard",    true);
      break;
    case "startable":
      buttonAffordances("makeBoard");
      panels.enableButton("freezePuzzle", true);
      panels.enableButton("startingPos",  true);
      break;
    case "placeable":
      buttonAffordances("makeBoard");
      panels.enableButton("placePiece",   true);
      panels.enableButton("startingPos",  false);
      break;
    case "placed":
      buttonAffordances("makeBoard");
      panels.enableButton("placePiece",   false);
      panels.enableButton("freezePuzzle", true);
      panels.enableButton("startingPos",  false);
      break;
    case "shiftable":
      buttonAffordances("makeBoard");
      panels.enableButton("shiftPiece",   true);
      break;
    case "returnable":
      buttonAffordances("makeBoard");
      panels.enableButton("returnPiece",  true);
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

    case "off":              // Disable all panel buttons.
      panels.enableButton("makeBoard",   false);
      panels.enableButton("placePiece",  false);
      panels.enableButton("shiftPiece",  false);
      panels.enableButton("returnPiece", false);
      panels.enableButton("freezePuzzle",false);
      panels.enableButton("startingPos", false);
      break;
    default: throw new Error(`Unknown button situation ${situation} for setup.`);
  }
}
// Seampoint: more global functions...

// --- Helpers ---
function cleanupSelections() {
  cSetup.clearAllPieceSelections();                       // Cleanup.
  cSetup.clearAllTileSelections();
  cSelects.clearSelections();
  }
// Seampoint: more local functions...

/* TODO: QC checklist
  1. tbd
*/

