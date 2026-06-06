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

// --- Build upon previous layers ---
  import * as coords  from "../../foundation/coords/coords.js";
  import * as mTrays  from "../../model/trays/trays.js";
  import * as mPieces from "../../model/pieces/pieces.js";
  import * as view    from "../../view/view.js";
  import * as vBoards from "../../view/boards/boards.js";
  import * as tiles   from "../../view/tiles/tiles.js";
  import * as vPieces from "../../view/pieces/pieces.js";
// Seampoint: more imports...

// --- Globals ---
  // const selections = new Set(); // Deprecated.
  const pieceSelections = new Set();  // Holds piece key - "WKRP".
  const tileSelections = new Set();   // Holds tile vts - [z,x,y].
// Seampoint: more globals...

// --- UI ---
export function getSelections() {
  return { pieceSelections, tileSelections };
  }
export function clearPieceSelections() {
  pieceSelections.clear();
  }
export function clearTileSelections() {
  tileSelections.clear();
  }

export function handleTileClick(vts) { // TODO: make this a state machine.
  console.log("cntrl: selections.js - handleTileClick(coords)", vts);
  
  if(!vts) {
    console.log("Ray casting: click off board.");
    return;
  }

  tileSelections.add(vts);

  // TODO: Refactor for use by cSetup.

  const meshTile = tiles.getTileMesh(view.context.tileMap, vts);
  if(!meshTile) throw new Error("This should be impossible?");

  vBoards.toggleDecorator(meshTile);  // TODO: POC, not final logic.

  if(pieceSelections.size != 1) return;

  console.log(`*** ${pieceSelections.size} possible pieces.`, pieceSelections);
  const iterator = pieceSelections.values();
  const key = iterator.next().value;
  const piece = mPieces.getPieceList()[key];
  const { loc, pos, coord } = piece;
  const dstStr = coords.vtsToBoard(vts);

  console.log(`*** move ${key} from ${loc} ${pos} to ${vts} ala ${dstStr}`);
  if(loc ==='~')
    mPieces.movePieceFromTrayToBoard(key, dstStr);
  else
    mPieces.movePieceFromTileToTile(key, dstStr);

  vPieces.deHighlight(key);
  pieceSelections.delete(key);
  vBoards.toggleDecorator(meshTile);  // TODO: POC, not final logic.

  console.log("*** mPieces.getPieceList()", mPieces.getPieceList());
  console.log("*** mTrays.getWhiteTray()", mTrays.getWhiteTray());
  console.log("*** mTrays.getBlackTray()", mTrays.getBlackTray());

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
function toggleDecorator(meshTile) {
  if (meshTile.userData.decorated) {      // --- REMOVE overlays ---
    meshTile.userData.overlays.forEach(o => meshTile.remove(o));
    meshTile.userData.overlays = [];
    meshTile.userData.decorated = false;
  } else {                                // --- ADD overlays ---
    const face = meshTile.userData.faceColor;
    const layers = decorators.applyBaseZones({
      base: face,
      zones: ["#111111", "#111111", face, face ]
    });

    const overlays = layers.map(layer => {
      const circle = decorators.drawInsetCircle(meshTile, layer.scale, layer.color);
      meshTile.add(circle);
      return circle;
    });

    meshTile.userData.overlays = overlays;
    meshTile.userData.decorated = true;
  }
}
// Seampoint: more local functions...

