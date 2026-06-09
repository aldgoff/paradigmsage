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
  import * as utils   from "../../../utils/utils.js";       // isSame(a,b).
  
  import * as view    from "../../view/view.js";            // view.context.
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

export function isSelectedPiece(key) {          // O(1).
  console.log("cntrl: selections.js - isSelectedPiece(key)", key);

  return pieceSelections.has(key);
  }

export function selectPiece(key) {              // O(1).
  console.log("cntrl: selections.js - selectPiece(key)", key);

  pieceSelections.add(key);
  vPieces.highlight(key);
  }

export function deselectPiece(key) {            // O(1).
  console.log("cntrl: selections.js - deselectPiece(key)", key);

  pieceSelections.delete(key);
  vPieces.deHighlight(key);
  }

export function clearPieceSelections() {        // O(1).
  pieceSelections.clear();
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

  const mesh = vTiles.getTileMesh(view.context.tileMap, vts);
  vBoards.decorateTile(mesh);
  }

export function deselectTile(vts) {             // O(3).
  console.log("cntrl: selections.js - deselectTile(vts)", vts);

  tileSelections.delete(vts);

  const mesh = vTiles.getTileMesh(view.context.tileMap, vts);
  vBoards.undecorateTile(mesh);
  }

export function clearTileSelections() {         // O(1).
  tileSelections.clear();
}

export function handlePieceClick(group) {       // O(1).
  console.log("cntrl: selections.js - handlePieceClick(group)", group);
  
  if(!group) {
    console.log("Ray casting: click off piece.");
    return;
  }

  // console.log("cntrl: selections.js - handlePieceClick(...)", group.userData);
  const key = group.userData.key;
  if(pieceSelections.has(key)) {
    vPieces.deHighlight(key);
    pieceSelections.delete(key);
  }
  else {
    vPieces.highlight(key);
    pieceSelections.add(key);
  }

  return;
  }

export function handleTileClick(vts) {          // O(n).
  console.log("cntrl: selections.js - handleTileClick(vts)", vts);
  
  if(!vts) {
    console.log("Ray casting: click off board.");
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

  return;
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

