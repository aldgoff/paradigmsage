/* File: selections.js
  Path: ./3dc/controller/selections/selections.js
  Purpose: Manage raycasting clicks for tiles, pieces, advsqs, gambits, etc.
  Author: Allan Goff
  Date: 6/04/26
  Recommended access: import * as cSelections from "../../controller/selections/selections.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import selectionsData from "./selections.json" assert { type: "json" };
  const selectionsModule = selectionsData.selections_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as panels  from "../../panels/panels.js";
  import * as utils   from "../../../utils/utils.js";       // isSame(a,b).

  import * as cSetup  from "../../controller/setup/setup.js";

  import * as mPieces from "../../model/pieces/pieces.js";
  import * as coords  from "../../foundation/coords/coords.js";

  import * as view    from "../../view/view.js";            // view.getContext().
  import * as vBoards from "../../view/boards/boards.js";   // decorate tile meshes.
  import * as vPieces from "../../view/pieces/pieces.js";   // highlight a piece.
  import * as vTiles  from "../../view/tiles/tiles.js";     // tile meshes.
// Seampoint: more imports...

// --- Globals ---
  const pieceSelections = new Set();  // Holds piece key - "WKRP".
  const tileSelections  = new Set();  // Holds tile vts - [z,x,y].
// Seampoint: more globals...

// --- UI ---
export function getSelections() {               // O(1).
  return { pieceSelections, tileSelections };
 }
export function getPieceSelection() {           // O(1).
  return pieceSelections;
 }
export function getTileSelection() {            // O(1).
  return tileSelections ;
}

export function clearSelections() {
  clearPieceSelections();
  clearTileSelections();
  manageMoveButtons();
}

export function isSelectedPiece(key) {          // O(1).
  console.log("cntrl: selections.js - isSelectedPiece(key)", key);

  return pieceSelections.has(key);
  }

export function selectPiece(key) {              // O(1).
  console.log("cntrl: selections.js - selectPiece(key)", key);

  const panel = document.getElementById("diags-window");

  vPieces.highlight(key);
  pieceSelections.add(key);
  panel.querySelector('[name="diags-pieceSels"]').textContent = pieceSelections.size;
  }

export function deselectPiece(key) {            // O(1).
  console.log("cntrl: selections.js - deselectPiece(key)", key);

  const panel = document.getElementById("diags-window");

  vPieces.deHighlight(key);
  pieceSelections.delete(key);
  panel.querySelector('[name="diags-pieceSels"]').textContent = pieceSelections.size;
  }

export function clearPieceSelections() {        // O(1).
  for(const key of [...pieceSelections]) deselectPiece(key)
  pieceSelections.clear();

  const panel = document.getElementById("diags-window");
  panel.querySelector('[name="diags-pieceSels"]').textContent = pieceSelections.size;
}

export function isSelectedTile(vts) {           // O(n).
  console.log("cntrl: selections.js - isSelectedTile(vts)", vts);

  for(const sel of tileSelections) {
    if(utils.isSame(sel, vts)) {  // Since js can't compare arrays.
      return true;
    }
  }

  return false;
  }

export function selectTile(vts) {               // O(3).
  console.log("cntrl: selections.js - selectTile(vts)", vts);

  tileSelections.add(vts);
  const panel = document.getElementById("diags-window");
  panel.querySelector('[name="diags-tileSels"]').textContent = tileSelections.size;

  const mesh = vTiles.getTileMesh(view.getContext().tileMap, vts);
  vBoards.decorateTile(mesh);
  }

export function deselectTile(vts) {             // O(3).
  console.log("cntrl: selections.js - deselectTile(vts)", vts);

  tileSelections.delete(vts);
  const panel = document.getElementById("diags-window");
  panel.querySelector('[name="diags-tileSels"]').textContent = tileSelections.size;

  const mesh = vTiles.getTileMesh(view.getContext().tileMap, vts);
  vBoards.undecorateTile(mesh);
  }

export function clearTileSelections() {         // O(1).
  for(const tile of [...tileSelections]) deselectTile(tile)
  tileSelections.clear();

  const panel = document.getElementById("diags-window");
  panel.querySelector('[name="diags-tileSels"]').textContent = tileSelections.size;
}

export function handlePieceClick(group) {       // O(1).
  console.log("cntrl: selections.js - handlePieceClick(group)", group?.userData);
  
  if(!group) {
    console.log("Ray casting: click off piece.");
    return;
  }

  // console.log("cntrl: selections.js - handlePieceClick(...)", group.userData);
  const key = group.userData.key;
  (pieceSelections.has(key))
    ? deselectPiece(key)
    : selectPiece(key);

  manageMoveButtons();

  return;
  }

export function handleTileClick(vts) {          // O(n).
  console.log("cntrl: selections.js - handleTileClick(vts)", vts);
  
  if(!vts) {
    console.log("Ray casting: click off tile.");
    return;
  }

  let alreadySelected = false;
  for(const sel of tileSelections) {
    if(utils.isSame(sel, vts)) {
      alreadySelected = true;
      break;
    }
  }
  if(alreadySelected)
    deselectTile(vts);
  else
    selectTile(vts);

  manageMoveButtons();

  return;
}
// Seampoint: more global functions...

// --- Helpers ---
export function manageMoveButtons() {
  console.log("cntrl: selections.js - manageMoveButtons()");

  const size = cSetup.getCurrBoard().boardSize;           // Parse piece and tile info.
  const [key1,  key2]  = [...pieceSelections];
  const [tile1, tile2] = [...tileSelections];
  const piece1 = (key1) ? mPieces.getPieceList()[key1] : null;
  const piece2 = (key2) ? mPieces.getPieceList()[key2] : null;
  const dstStr1 = (tile1) ? coords.vtsToBoard(tile1, size) : "";
  const dstStr2 = (tile2) ? coords.vtsToBoard(tile2, size) : "";
  const { player: player1, side: side1, level: level1, type: type1 } = utils.parsePieceKey(key1);
  const { player: player2, side: side2, level: level2, type: type2 } = utils.parsePieceKey(key2);

  const panel = document.getElementById("move-window");   // Update panel fields.
  panel.querySelector('[name="move-selPieces"]').textContent = [...pieceSelections];
  panel.querySelector('[name="move-selTiles"]').textContent  = `${dstStr1} ${dstStr2}`;

  if(piece1?.pos === dstStr1)  return;                     // Piece can't be on tile.

  panels.enableButton("move",        false);              // Reset all the panel buttons.
  panels.enableButton("capture",     false);
  panels.enableButton("enpassant",   false);
  panels.enableButton("castle",      false);
  panels.enableButton("promote",     false);
  panels.enableButton("duke-decay",  false);
  panels.enableButton("bishop-decay",false);
  panels.enableButton("fission",     false);

  const pieces = pieceSelections.size;          // 1st level button restraints.
  const tiles  = tileSelections.size;

  if(     pieces === 1 && tiles === 1) {        // Move, promote, or decay.
    const [, prefix, x, y] = dstStr1.match(/^([A-Z]+)(\d+),(\d+)$/);
    const i = Number(x);
    const j = Number(y);

    const dims = Number(size.split("x")[2]); // Should be 8 or 10.
    const first = (dims === 10) ? 0: 1; // TODO: check for standards drift.
    const last  = (dims === 10) ? 9: 8;

    const lastCol = (i === j)
                && ( (player1 === "W" && i === last) 
                  || (player1 === "B" && i === first) );
    const promotable = (type1 === "P") && lastCol;

    if(type1 === 'S') {  // TODO: figure out how to specify stack subpieces.
      panels.enableButton("move",        true);
      panels.enableButton("duke-decay",  true);
      panels.enableButton("bishop-decay",true);
    }
    else if(promotable) {
      panels.enableButton("promote", true);
    }
    else {
      panels.enableButton("move", true);
    }
    }
  else if(pieces === 2 && tiles === 0) {        // Capture.
    if(player1 === player2) return;
      
    panels.enableButton("capture", true);
    }
  else if(pieces === 2 && tiles === 1) {        // En Passant.
    if(player1 === player2) return;
    if(type1 != 'P') return;
    if(type2 != 'P') return;
    
    panels.enableButton("enpassant", true);
    }
  else if(pieces === 2 && tiles === 2) {        // Castle.
    if(player1 != player2) return;
    if((type1 === 'K' && type2 === 'R') || (type1 === 'R' && type2 === 'K'))
      panels.enableButton("castle", true);
    }
  else if(pieces === 1 && tiles === 2) {        // Stack fission.
    if(type1 != 'S') return;
    panels.enableButton("fission", true);
  }
}
// Seampoint: more local functions...

