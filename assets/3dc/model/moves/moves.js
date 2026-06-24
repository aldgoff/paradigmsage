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
  import * as mBoards from "../../model/boards/boards.js";
  import * as coords  from "../../foundation/coords/coords.js";

  import * as vMoves  from "../../view/moves/moves.js";
  import * as vPieces from "../../view/pieces/pieces.js";
// Seampoint: more imports...

// --- Globals ---
// Seampoint: more globals...

// --- UI ---
export function reset() {
  console.log("model: moves.js - reset()");

  vMoves.clearMoves();
}

export function makeMoveEntry(payload, selections) {
  console.log(`model: moves.js - makeMoveEntry(payload, selections):`, payload, selections);

  const { action, player, pieceSelections, tileSelections, turn } = parse(payload, selections);

  const size = cSetup.getCurrBoard().boardSize;           // Parse piece and tile info.
  const pieces = pieceSelections.size;
  const tiles  = tileSelections.size;
  console.log("*** pieces, tiles", pieces, tiles);

  const [key1, key2] = [...pieceSelections];              // Pieces.
  const piece1 = mPieces.getPieceList()[key1];
  const piece2 = mPieces.getPieceList()[key2];

  const [tile1, tile2] = [...tileSelections];             // Tiles.
  const tile1Str = coords.vtsToBoard(tile1, size);
  const tile2Str = tile2
    ? coords.vtsToBoard(tile2, size)
    : null;

  let annotation = "";                                    // Annotation.
  if(pieces === 1 && tiles === 1) annotation = "move";
  if(pieces === 2 && tiles === 1) annotation = "stackMov";
  console.log("*** annotation", annotation);

  const prev  = `@${piece1.pos}`;                         // Assemble.
  const post  = `@${tile1Str}`;  
  const list = [{ key: key1, prev, post }];  // list:[{key:"WKRR", prev:"@KR1,1", post:"@KR3,3"}].
  if(key2) 
    list.push({ key: key2, prev, post });   // list:[{key, prev, post}, {key, prev, post}].

  cleanupSelections();                                    // Cleanup.
  
  return { action, turn, player, list, annotation };                  // Entry.
  }

export function makeCaptureEntry(payload, selections) {
  console.log(`model: gambits.js - makeCaptureEntry(payload, selections):`, payload, selections);

  const { action, player, pieceSelections, tileSelections, turn } = parse(payload, selections);

  const size = cSetup.getCurrBoard().boardSize;           // Parse piece and tile info.
  const pieces = pieceSelections.size;
  const tiles  = tileSelections.size;
  console.log("*** pieces, tiles", pieces, tiles);

  const [key1, key2, key3] = [...pieceSelections];        // Pieces.
  const piece1 = mPieces.getPieceList()[key1];
  const piece2 = mPieces.getPieceList()[key2];
  const piece3 = (pieces === 3) ? mPieces.getPieceList()[key3] : null;

  const [tile1, tile2] = [...tileSelections];             // Tiles.
  const tile1Str = tile1 ? coords.vtsToBoard(tile1, size) : null;
  const tile2Str = tile2 ? coords.vtsToBoard(tile2, size) : null;

  let annotation = "";                                    // Annotation.
  if(pieces === 2 && tiles === 0) annotation = "capture";
  if(pieces === 3 && tiles === 0) annotation = "stackCap";
  console.log("*** annotation", annotation);

  let list = [];                                          // Assemble.
  if(annotation === "capture") {
    const prev   = `@${piece1.pos}`;
    const post   = `@${piece2.pos}`;
    const first  = { key: key1, prev, post };
    const second = { key: key2, prev: post, post: `~${piece2.home.trayPos}` };
    list = [first, second]; // list:[{key,prev,post}, {key,prev,post}].
    }
  else {
    const prev   = `@${piece1.pos}`;
    const post   = `@${piece3.pos}`;
    const first  = { key: key1, prev, post };
    const second = { key: key2, prev, post };
    const third  = { key: key3, prev: post, post: `~${piece3.home.trayPos}` };
    list = [first, second, third]; // list:[{key,prev,post}, {key,prev,post}, {key,prev,post}].
  }

  cleanupSelections();                                    // Cleanup.
  
  return { action, turn, player, list, annotation };      // Entry.
  }

export function makeFissionEntry(payload, selections) {
  console.log(`model: gambits.js - makeFissionEntry(payload, selections):`, payload, selections);

  const { action, player, pieceSelections, tileSelections, turn } = parse(payload, selections);

  const size = cSetup.getCurrBoard().boardSize;           // Parse piece and tile info.
  const pieces = pieceSelections.size;
  const tiles  = tileSelections.size;
  console.log("*** pieces, tiles", pieces, tiles);

  const [key1, key2] = [...pieceSelections];              // Pieces.
  const piece1 = mPieces.getPieceList()[key1];
  const piece2 = mPieces.getPieceList()[key2];

  const [tile1, tile2] = [...tileSelections];             // Tiles.
  const dstStr1 = coords.vtsToBoard(tile1, size);
  const dstStr2 = coords.vtsToBoard(tile2, size);

  const prev  = `@${piece1.pos}`;                         // Assemble.
  const post1 = `@${dstStr1}`;  
  const post2 = `@${dstStr2}`;

  const listS = { key: key1, prev, post: post1 };  // list:[{key,prev,post}]
  const listB = { key: key2, prev, post: post2 };  // list:[{key,prev,post}]
  const list = [listS, listB];

  cleanupSelections();                                    // Cleanup.
  
  return { action, turn, player, list };                  // Entry.
  }

export function makeEnpassantEntry(payload, selections) {
  console.log(`model: gambits.js - makeEnpassantEntry(payload, selections):`, payload, selections);

  const { action, player, pieceSelections, tileSelections, turn } = parse(payload, selections);

  const size = cSetup.getCurrBoard().boardSize;           // Parse piece and tile info.
  const pieces = pieceSelections.size;
  const tiles  = tileSelections.size;
  console.log("*** pieces, tiles", pieces, tiles);

  const [attacker, captured] = [...pieceSelections];      // Pieces.
  const piece1 = mPieces.getPieceList()[attacker];
  const piece2 = mPieces.getPieceList()[captured];

  const [dstTile] = [...tileSelections];                  // Tiles.
  const dstStr = coords.vtsToBoard(dstTile, size);

  const prev   = `@${piece1.pos}`;                        // Assemble.
  const post   = `@${piece2.pos}`;
  const first  = { key: attacker, prev, post: `@${dstStr}` };
  const second = { key: captured, prev: post, post: `~${piece2.home.trayPos}` };
  const list   = [first, second]; // list:[{key,prev,post}, {key,prev,post}].

  cleanupSelections();                                    // Cleanup.
  
  return { action, turn, player, list };                  // Entry.
  }

export function makeCastleEntry(payload, selections) {
  console.log(`model: gambits.js - makeCastleEntry(payload, selections):`, payload, selections);

  const { action, player, pieceSelections, tileSelections, turn } = parse(payload, selections);

  const size = cSetup.getCurrBoard().boardSize;           // Parse piece and tile info.
  const pieces = pieceSelections.size;
  const tiles  = tileSelections.size;
  console.log("*** pieces, tiles", pieces, tiles);

  const [king, rook, rook2] = [...pieceSelections];       // Pieces.
  const piece1 = mPieces.getPieceList()[king];
  const piece2 = mPieces.getPieceList()[rook];
  const piece3 = (pieceSelections.size === 3)
    ? mPieces.getPieceList()[rook2]
    : null;
  
  const [kingDst, rookDst, rook2Dst] = [...tileSelections]; // Tiles.
  const kingStr  = coords.vtsToBoard(kingDst,  size);
  const rookStr  = coords.vtsToBoard(rookDst,  size);
  const rook2Str = (pieceSelections.size === 3)
    ? coords.vtsToBoard(rook2Dst, size)
    : null;

  const prev1  = `@${piece1.pos}`;                        // Assemble.
  const prev2  = `@${piece2.pos}`;
  const first  = { key: king, prev: prev1, post: `@${kingStr}` };
  const second = { key: rook, prev: prev2, post: `@${rookStr}` };
  let list   = [first, second]; // list:[{key,prev,post}, {key,prev,post}].
  if(piece3) {  // Double castle.
    const prev3 = `@${piece3.pos}`;
    const third = { key: rook2, prev: prev3, post: `@${rook2Str}` };
    list.push(third); // list:[{key,prev,post}, {key,prev,post}, {key,prev,post}].
  }

  cleanupSelections();                                    // Cleanup.
  
  return { action, turn, player, list };                  // Entry.
  }

export function makePromoteEntry(payload, selections) {
  console.log(`model: gambits.js - makePromoteEntry(payload, selections):`, payload, selections);

  const { action, player, pieceSelections, tileSelections, turn } = parse(payload, selections);

  const size = cSetup.getCurrBoard().boardSize;           // Parse piece and tile info.
  const pieces = pieceSelections.size;
  const tiles  = tileSelections.size;
  console.log("*** pieces, tiles", pieces, tiles);

  const [key, upgrade] = [...pieceSelections];            // Pieces.
  const pawn = mPieces.getPieceList()[key];

  // TODO: upgrade not used, and it is critical.
  const [dstTile] = [...tileSelections];                  // Tiles.
  const dstStr  = coords.vtsToBoard(dstTile, size);

  const prev  = `@${pawn.pos}`;                          // Assemble.
  const post  = `@${dstStr}`;  
  const list1 = { key, prev, post };    // list:[{key:"WKRP", prev:"@KR7,7", post:"@KR8,8"}]
  const list2 = { key, prev, post };    // list:[{key:"WKRQ", prev:"@KR7,7", post:"@KR8,8"}]
  const list  = [list1, list2];

  cleanupSelections();                                    // Cleanup.
  
  return { action, turn, player, list };                  // Entry.
}

export function makeUpliftEntry(payload, selections) {
  console.log(`model: gambits.js - makeUpliftEntry(payload, selections):`, payload, selections);

  const { action, player, pieceSelections, tileSelections, turn } = parse(payload, selections);

  const size = cSetup.getCurrBoard().boardSize;           // Parse piece and tile info.
  const pieces = pieceSelections.size;
  const tiles  = tileSelections.size;
  console.log("*** pieces, tiles", pieces, tiles);

  const [pawn, subpiece] = [...pieceSelections];     // Pieces.
  const piece1 = mPieces.getPieceList()[pawn];
  const piece2 = mPieces.getPieceList()[subpiece];

  const [dstTile] = [...tileSelections];                  // Tiles.
  const dstStr  = coords.vtsToBoard(dstTile, size);

    // TODO: finish.

  // const prev  = `@${piece1.pos}`;                         // Assemble.
  // const post  = `@${dstStr}`;  
  // const listS = { key, prev, post: null };        // list:[{key:"WKRS", prev:"@KB1,1", post:null}]
  // const listB = { key, prev: null, post: prev };  // list:[{key:"WKRB", prev:null,     post:"@KB3,3"}]
  // const listD = { key, prev: null, post };        // list:[{key:"WKRD", prev:null,     post:"@KB3,3"}]
  // const list = [listS, listB, listD];

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
    panels.enableButton("fission",      true);
    panels.enableButton("uplift",       true);
    }
  else if(situation === "off") {
    panels.enableButton("move",         false);           // Disable all the panel buttons.
    panels.enableButton("capture",      false);
    panels.enableButton("enpassant",    false);
    panels.enableButton("castle",       false);
    panels.enableButton("promote",      false);
    panels.enableButton("fission",      false);
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

function promotePiece(oldKey, upgrade) {  // TODO: questionable approach.
  console.log("model: moves.js - promotePiece(oldKey, upgrade)", oldKey, upgrade);

  const piece = mPieces.getPieceList()[oldKey];
  const home = piece.home;

  const newKey = oldKey.slice(0, 3) + upgrade[3];  // Change oldKey, WKRP->WRKQ.

  const newPiece = mPieces.createPiece(newKey, home.trayPos, home.trayCoords);
  const [z, x, y] = mBoards.pieceLocOnBoard(oldKey);

  mBoards.getBoardOccupancy()[z][x][y] = newKey;

  delete mPieces.getPieceList()[oldKey];           // Update key in occupancies.
  mPieces.getPieceList()[newKey] = piece;

  const pieceGroups = vPieces.getPieceGroups();

  const oldGroup = pieceGroups[oldKey];
  const newGroup = vPieces.createPiece(newKey);

  newGroup.userData.key = newKey;
  pieceGroups[newKey] = newGroup;
  delete pieceGroups[oldKey];

  vPieces.getCurrPiecesGroup().remove(oldGroup);
  vPieces.getCurrPiecesGroup().add(newGroup);

  // console.log("*** oldGroup", oldGroup);
  // console.log("*** newGroup", newGroup);
  // console.log("*** vPieces.getCurrPiecesGroup()", vPieces.getCurrPiecesGroup());
  // console.log("*** vPieces.getPieceGroups()", vPieces.getPieceGroups());

  return newKey;
}
// Seampoint: more local functions...

