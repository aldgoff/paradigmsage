/* File: moves.js
  Path: ./3dc/model/moves/moves.js
  Purpose: The moves portion of the state of the game.
  Author: Allan Goff
  Date: 4/30/26
  Recommended access: import * as mMoves from "../../model/moves/moves.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import movesData from "./moves.json" assert { type: "json" };
  const movesModule = movesData.moves_module;
  const move  = movesModule.Move;
// Seampoint: more objects...

// --- Dependencies ---
  import * as panels  from "../../panels/panels.js";

  import * as cSetup      from "../../controller/setup/setup.js";
  import * as cSelections from "../../controller/selections/selections.js";

  import * as state   from "../../model/state/state.js";
  import * as mPieces from "../../model/pieces/pieces.js";
  import * as coords  from "../../foundation/coords/coords.js";

  import * as vMoves  from "../../view/moves/moves.js";
// Seampoint: more imports...

// --- Globals ---
// Seampoint: more globals...

// --- UI ---
export function reset() {
  console.log("model: moves.js - reset()");

  vMoves.clearMoves();
  }

export function makeEntry(payload) {  // Never called, specialized versions below.
  console.log(`model: gambits.js - makeEntry(payload):`, payload);

  const { action, src, srcTile, quad, perimeter, stride, opacity } = payload;  // Informative.

  const entry = payload;

  return entry;
  }

export function makeMoveEntry(selections, payload) {
  console.log(`model: moves.js - makeMoveEntry(selections, payload):`, selections, payload);

  const { action, player } = payload;
  const { pieceSelections, tileSelections } = selections;

  const boardSpec = cSetup.getCurrBoard().boardSize;

  const index = state.getIndices()["Moves"] + 1;
  let turn = Math.floor((index + 1) / 2);

  const key     = pieceSelections.values().next().value;
  const dstTile = tileSelections.values().next().value;
  const dstStr  = coords.vtsToBoard(dstTile, boardSpec);

  const piece = mPieces.getPieceList()[key];
  const prev  = `@${piece.pos}`;
  const post  = `@${dstStr}`;  

  let entry = { action, turn, player, key, prev, post };
  let err = null;
  console.log("*** entry", entry);

  cSetup.clearAllPieceSelections();
  cSetup.clearAllTileSelections();
  cSelections.clearSelections();
  
  return entry; // {"action":"move","turn":1,"player":"White","list":[{"key":"WKRR","prev":"@KR1,1","post":"@KR3,3"}]}.
}
// Seampoint: more Entry functions...

export function buttonAffordances(situation) {
  console.log("model: moves.js - buttonAffordances(situation)", situation);

  if(situation === "on") {
    panels.enableButton("move",         true);            // Enable all the panel buttons.
    panels.enableButton("capture",      true);
    panels.enableButton("enpassant",    true);
    panels.enableButton("castle",       true);
    panels.enableButton("promote",      true);
    panels.enableButton("duke-decay",   true);
    panels.enableButton("bishop-decay", true);
    panels.enableButton("fission",      true);
    panels.enableButton("teleportation",true);
    panels.enableButton("uplift",       true);
    }
  else if(situation === "off") {
    panels.enableButton("move",         false);           // Disable all the panel buttons.
    panels.enableButton("capture",      false);
    panels.enableButton("enpassant",    false);
    panels.enableButton("castle",       false);
    panels.enableButton("promote",      false);
    panels.enableButton("duke-decay",   false);
    panels.enableButton("bishop-decay", false);
    panels.enableButton("fission",      false);
    panels.enableButton("teleportation",false);
    panels.enableButton("uplift",       false);
    }
  else {
    throw new Error(`Unknown button situation ${situation} for moves.`);
  }
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

