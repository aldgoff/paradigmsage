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
  import * as utils   from "../../../utils/utils.js";
  import * as coords  from "../../foundation/coords/coords.js";
  import * as mTrays  from "../../model/trays/trays.js";
  import * as mPieces from "../../model/pieces/pieces.js";
  
  import * as view    from "../../view/view.js";
  import * as vBoards from "../../view/boards/boards.js";
  import * as tiles   from "../../view/tiles/tiles.js";
  import * as vPieces from "../../view/pieces/pieces.js";
// Seampoint: more imports...

// --- Globals ---
  const pieceSelections = new Set();  // Holds piece key - "WKRP".
  const tileSelections  = new Set();  // Holds tile vts - [z,x,y].
// Seampoint: more globals...

// --- UI ---
export function getSelections() {
  return { pieceSelections, tileSelections };
  }

export function clearPieceSelections() {
  pieceSelections.clear();
  }

export function selectTile(vts) {
  tileSelections.add(vts);

  const meshTile =
    tiles.getTileMesh(view.context.tileMap, vts);

  vBoards.decorateTile(meshTile);
  }

export function deselectTile(vts) {
  clearTileSelection(vts);

  const meshTile =
    tiles.getTileMesh(view.context.tileMap, vts);

  vBoards.undecorateTile(meshTile);
  }

export function clearTileSelections() {
  tileSelections.clear();
  }

export function clearTileSelection(vts) {
  for(const sel of tileSelections) {
    if(utils.isSame(sel, vts)) {
      tileSelections.delete(sel);
      return;
    }
  }
}

export function handleTileClick(vts) { // TODO: make this a state machine.
  console.log("cntrl: selections.js - handleTileClick(coords)", vts);
  
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

export function handlePieceClick(obj) { // TODO: make this a state machine.
  console.log("cntrl: selections.js - handlePieceClick(...)");
  
  if(!obj) {
    console.log("Ray casting: click off piece.");
    return;
  }

  console.log("cntrl: selections.js - handlePieceClick(...)", obj.userData);
  const key = obj.userData.key;
  if(pieceSelections.has(key)) {
    vPieces.deHighlight(key);
    pieceSelections.delete(key);
  }
  else {
    vPieces.highlight(key);
    pieceSelections.add(key);
  }


  // TODO: cntrl: selections.js - handleTileClick(coords).

  return;
  }
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

