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

export function makeMoveEntry(payload, selections) {
  console.log(`model: moves.js - makeMoveEntry(payload, selections):`, payload, selections);

  const { action, player, pieceSelections, tileSelections, turn } = parse(payload, selections);

  const [key] = [...pieceSelections];                     // Pieces.
  const piece = mPieces.getPieceList()[key];

  const [dstTile] = [...tileSelections];                  // Tiles.
  const dstStr  = coords.vtsToBoard(dstTile, cSetup.getCurrBoard().boardSize);

  const prev  = `@${piece.pos}`;                          // Assemble.
  const post  = `@${dstStr}`;  
  const list  = [{ key, prev, post }]; // list:[{key:"WKRR", prev:"@KR1,1", post:"@KR3,3"}]

  cleanupSelections();                                    // Cleanup.
  
  return { action, turn, player, list };                  // Entry.
  }

export function makeCaptureEntry(payload, selections) {
  console.log(`model: gambits.js - makeCaptureEntry(payload, selections):`, payload, selections);

  const { action, player, pieceSelections, tileSelections, turn } = parse(payload, selections);

  const [attacker, captured] = [...pieceSelections];     // Pieces.
  const piece1 = mPieces.getPieceList()[attacker];
  const piece2 = mPieces.getPieceList()[captured];

  const prev   = `@${piece1.pos}`;                        // Assemble.
  const post   = `@${piece2.pos}`;
  const first  = { key: attacker, prev, post };
  const second = { key: captured, prev: post, post: `~${piece2.home.trayPos}` };
  const list   = [first, second]; // list:[{key,prev,post}, {key,prev,post}].

  cleanupSelections();                                    // Cleanup.
  
  return { action, turn, player, list };                  // Entry.
}

export function makeEnpassantEntry(payload, selections) {
  console.log(`model: gambits.js - makeEnpassantEntry(payload, selections):`, payload, selections);

  const { action, player, pieceSelections, tileSelections, turn } = parse(payload, selections);

  const [attacker, captured] = [...pieceSelections];      // Pieces.
  const piece1 = mPieces.getPieceList()[attacker];
  const piece2 = mPieces.getPieceList()[captured];

  const [dstTile] = [...tileSelections];                  // Tiles.
  const dstStr  = coords.vtsToBoard(dstTile, cSetup.getCurrBoard().boardSize);

  const prev   = `@${piece1.pos}`;                        // Assemble.
  const post   = `@${piece2.pos}`;
  const first  = { key: attacker, prev, post: `@${dstStr}` };
  const second = { key: captured, prev: post, post: `~${piece2.home.trayPos}` };
  const list   = [first, second]; // list:[{key,prev,post}, {key,prev,post}].

  cleanupSelections();                                    // Cleanup.
  
  return { action, turn, player, list };                  // Entry.
}
// SeampointAdd: more Entry functions...

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
function cleanupSelections() {
  cSetup.clearAllPieceSelections();                       // Cleanup.
  cSetup.clearAllTileSelections();
  cSelections.clearSelections();
}

function parse(payload, selections) {
  const { action, player } = payload;
  const { pieceSelections, tileSelections } = selections;
  const index = state.getIndices()["Moves"] + 1;
  const turn = Math.floor((index + 1) / 2);

  return { action, player, pieceSelections, tileSelections, turn };
}
// Seampoint: more local functions...

