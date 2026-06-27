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
  let tile2Str = tile2
    ? coords.vtsToBoard(tile2, size)
    : null;

  const stack = (pieces > 1)
    ? mPieces.isStackMate(key1, key2)
    : false;
  let annotation = "";                                    // Annotation.
  if(pieces === 1 && tiles === 1) {
    if(mPieces.hasOtherStackSubpiece(key1, tile1)) {
      if(stack)   annotation = "tele";
      else        annotation = "join";
    }
    else {
      if(stack)   annotation = "decay";
      else        annotation = "move";
    }
    }
  else if(pieces === 2 && tiles === 1) {
                  annotation = "stack";
  }

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
  if(tiles != 0) return;

  const [key1, key2, key3, key4] = [...pieceSelections];  // Pieces.
  const piece1 = mPieces.getPieceList()[key1];
  const piece2 = mPieces.getPieceList()[key2];
  const piece3 = (pieces >= 3) ? mPieces.getPieceList()[key3] : null;
  const piece4 = (pieces >= 4) ? mPieces.getPieceList()[key4] : null;

  let annotation = "";                                    // Annotation.
  if(pieces === 2 ) annotation = "capture";
  if(pieces === 2 && (mPieces.piecesOnTile(piece1.vts).length === 2)) annotation = "decay";
  if(pieces === 3 && (piece1.pos === piece2.pos)) annotation = "SxC";
  if(pieces === 3 && (piece2.pos === piece3.pos)) annotation = "CxS";
  if(pieces === 4 ) annotation = "SxS";
  console.log("*** annotation", annotation);
  // console.log("*** mPieces.piecesOnTile(piece1.vts)", mPieces.piecesOnTile(piece1.vts));

  let list = [];                                          // Assemble.
  const prev  = `@${piece1.pos}`;
  const post  = `@${piece2.pos}`;
  const first = { key: key1, prev, post };

  if(annotation === "capture") {  // CxC
    const first  = { key: key1, prev: `@${piece1.pos}`, post: `@${piece2.pos}` };
    const second = { key: key2, prev: `@${piece2.pos}`, post: `~${piece2.home.trayPos}` };
    list = [first, second]; // list:[{key,prev,post}, {key,prev,post}].
    }
  else if(annotation === "decay") { // TODO: this decay looks wrong, it is in capture code.
    const first  = { key: key1, prev: `@${piece1.pos}`, post: `@${piece2.pos}` };
    const second = { key: key2, prev: `@${piece2.pos}`, post: `@${piece2.pos}` };
    list = [first, second]; // list:[{key,prev,post}, {key,prev,post}, {key,prev,post}].
    }
  else if(annotation === "SxC") {
    const first  = { key: key1, prev: `@${piece1.pos}`, post: `@${piece3.pos}` };
    const second = { key: key2, prev: `@${piece2.pos}`, post: `@${piece3.pos}` };
    const third  = { key: key3, prev: `@${piece3.pos}`, post: `~${piece3.home.trayPos}` };
    list = [first, second, third]; // list:[{key,prev,post}, {key,prev,post}, {key,prev,post}].
    }
  else if(annotation === "CxS") {
    const first  = { key: key1, prev: `@${piece1.pos}`, post: `@${piece2.pos}` };
    const second = { key: key2, prev: `@${piece2.pos}`, post: `~${piece2.home.trayPos}` };
    const third  = { key: key3, prev: `@${piece3.pos}`, post: `~${piece3.home.trayPos}` };
    list = [first, second, third]; // list:[{key,prev,post}, {key,prev,post}, {key,prev,post}].
    }
  else if(annotation === "SxS") {
    const first  = { key: key1, prev: `@${piece1.pos}`, post: `@${piece3.pos}` };
    const second = { key: key2, prev: `@${piece2.pos}`, post: `@${piece4.pos}` };
    const third  = { key: key3, prev: `@${piece3.pos}`, post: `~${piece3.home.trayPos}` };
    const fourth = { key: key4, prev: `@${piece4.pos}`, post: `~${piece4.home.trayPos}` };
    list = [first, second, third, fourth]; // list:[{key,prev,post}, {key,prev,post}, {key,prev,post}, {key,prev,post}].
    }
  else {
    throw new Error(`Unknown annotation ${annotation}.`);
  }

  console.log("*** mPieces.getPieceList()", mPieces.getPieceList());

  cleanupSelections();                                    // Cleanup.
  
  return { action, turn, player, list, annotation };      // Entry.
  }

export function makeFissionEntry(payload, selections) {
  console.log(`model: gambits.js - makeFissionEntry(payload, selections):`, payload, selections);

  const { action, player, pieceSelections, tileSelections, turn } = parse(payload, selections);

    const size = cSetup.getCurrBoard().boardSize;           // Parse piece and tile info.
    const pieces = pieceSelections.size;
    const tiles  = tileSelections.size;
    const annotation = cSelections.getAnnotation();
    // console.log("*** pieces, tiles, annotation", pieces, tiles, annotation);

    const [key1, key2, key3, key4, key5, key6] = [...pieceSelections];              // Pieces.
    const piece1 = mPieces.getPieceList()[key1];
    const piece2 = mPieces.getPieceList()[key2];
    const piece3 = (pieces >= 3) ? mPieces.getPieceList()[key3] : null;
    const piece4 = (pieces >= 4) ? mPieces.getPieceList()[key4] : null;
    const piece5 = (pieces >= 5) ? mPieces.getPieceList()[key5] : null;
    const piece6 = (pieces >= 6) ? mPieces.getPieceList()[key6] : null;

  const [tile1, tile2] = [...tileSelections];             // Tiles.
  const dstStr1 = coords.vtsToBoard(tile1, size);
  const dstStr2 = coords.vtsToBoard(tile2, size);

  let list = [];                                          // Assemble.
  const prev1 = `@${piece1.pos}`;
  const prev2 = `@${piece2.pos}`;

  if(     annotation === "fissMM") {
    const first  = { key: key1, prev: `@${piece1.pos}`, post: `@${dstStr1}` };
    const second = { key: key2, prev: `@${piece2.pos}`, post: `@${dstStr2}` };
    list = [first, second];   // list:[{},{}].
    }
  else if(annotation === "fissMJ") {
    const first  = { key: key1, prev: `@${piece1.pos}`, post: `@${dstStr1}` };
    const second = { key: key2, prev: `@${piece2.pos}`, post: `@${dstStr2}` };
    list = [first, second];   // list:[{},{}].
    }
  else if(annotation === "fissJM") {
    const first  = { key: key1, prev: `@${piece1.pos}`, post: `@${dstStr1}` };
    const second = { key: key2, prev: `@${piece2.pos}`, post: `@${dstStr2}` };
    list = [first, second];   // list:[{},{}].
    }
  else if(annotation === "fissJJ") {
    const first  = { key: key1, prev: `@${piece1.pos}`, post: `@${dstStr1}` };
    const second = { key: key2, prev: `@${piece2.pos}`, post: `@${dstStr2}` };
    list = [first, second];   // list:[{},{}].
  }
  else if(annotation === "fiss") {

    }
  else if(annotation === "fiss") {

    }
  else if(annotation === "fiss") {

    }
  else if(annotation === "fiss") {

    }
  else if(annotation === "fiss") {

    }
  else if(annotation === "fiss") {

    }
  else if(annotation === "fiss") {

    }
  else if(annotation === "fiss") {

  }
  else if(annotation === "fissCC") {
    const first  = { key: key1, prev: `@${piece1.pos}`, post: `@${piece3.pos}` }; // Piece.
    const second = { key: key2, prev: `@${piece2.pos}`, post: `@${piece4.pos}` }; // Piece.
    const third  = { key: key3, prev: `@${piece3.pos}`, post: `~${piece3.home.trayPos}` };
    const fourth = { key: key4, prev: `@${piece4.pos}`, post: `~${piece4.home.trayPos}` };
    list = [first, second, third, fourth];   // list:[{},{},{},{}].
    }
  else if(annotation === "fissCS") {
    const first  = { key: key1, prev: `@${piece1.pos}`, post: `@${piece3.pos}` }; // Piece.
    const second = { key: key2, prev: `@${piece2.pos}`, post: `@${piece4.pos}` }; // Stack.
    const third  = { key: key3, prev: `@${piece3.pos}`, post: `~${piece3.home.trayPos}` }; // Piece.
    const fourth = { key: key4, prev: `@${piece4.pos}`, post: `~${piece4.home.trayPos}` }; // Stack.
    const fifth  = { key: key5, prev: `@${piece5.pos}`, post: `~${piece5.home.trayPos}` };
    list = [first, second, third, fourth, fifth];   // list:[{},{},{},{},{}].
    }
  else if(annotation === "fissSC") {
    const first  = { key: key1, prev: `@${piece1.pos}`, post: `@${piece3.pos}` }; // Stack.
    const second = { key: key2, prev: `@${piece2.pos}`, post: `@${piece5.pos}` }; // Piece.
    const third  = { key: key3, prev: `@${piece3.pos}`, post: `~${piece3.home.trayPos}` }; // Stack.
    const fourth = { key: key4, prev: `@${piece4.pos}`, post: `~${piece4.home.trayPos}` };
    const fifth  = { key: key5, prev: `@${piece5.pos}`, post: `~${piece5.home.trayPos}` }; // Piece.
    list = [first, second, third, fourth, fifth];  // list:[{},{},{},{},{}].
    }
  else if(annotation === "fissSS") {
    const first  = { key: key1, prev: `@${piece1.pos}`, post: `@${piece3.pos}` }; // Stack.
    const second = { key: key2, prev: `@${piece2.pos}`, post: `@${piece5.pos}` }; // Stack.
    const third  = { key: key3, prev: `@${piece3.pos}`, post: `~${piece3.home.trayPos}` }; // Stack.
    const fourth = { key: key4, prev: `@${piece4.pos}`, post: `~${piece4.home.trayPos}` };
    const fifth  = { key: key5, prev: `@${piece5.pos}`, post: `~${piece5.home.trayPos}` }; // Stack.
    const sixth  = { key: key6, prev: `@${piece6.pos}`, post: `~${piece6.home.trayPos}` };
    list = [first, second, third, fourth, fifth, sixth];  // list:[{},{},{},{},{},{}].
    }
  else {
    throw new Error(`Unknown fission annotation ${annotation}.`);
  }

  // const listS = { key: key1, prev, post: post1 };  // list:[{key,prev,post}]
  // const listB = { key: key2, prev, post: post2 };  // list:[{key,prev,post}]
  // const list = [listS, listB];

  cleanupSelections();                                    // Cleanup.
  
  return { action, turn, player, list, annotation };      // Entry.
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
  // console.log("model: moves.js - buttonAffordances(situation)", situation);

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

