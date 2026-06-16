/* File: moves.js
  Path: ./3dc/model/moves/moves.js
  Purpose: The moves portion of the state of the game.
  Author: Allan Goff
  Date: 4/30/26
  Recommended access: import * as mMoves from "../../model/moves/moves.js";
  UI: the export functions.
  Philosophy: Delete a module by deleting its directory - not so much.
    controller/ model/ view/
    play.md - DOM
    main.js - regressions
    view.js - wire, build payload
    game.js - rewind, FF
    state.js - undo, redo
*/

// --- Load JSON ---
  import movesData from "./moves.json" assert { type: "json" };
  const movesModule = movesData.moves_module;
  const move  = movesModule.Move;
// Seampoint: more objects...

// --- Dependencies ---
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

export function makeEntry(payload) {  // Deprecate.
  console.log(`model: moves.js - makeEntry(payload):`, payload);

  let { action, player, piece, src, dst, sec, capture, opts } = payload;

  const index = state.getIndices()["Moves"] + 1;
  let turn = Math.floor((index + 1) / 2);

  let entry = { turn, player, piece, src, dst, action, sec };

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

  return entry;
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

