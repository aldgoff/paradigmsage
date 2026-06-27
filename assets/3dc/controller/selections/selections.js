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

  import * as state   from "../../model/state/state.js";
  import * as mMoves  from "../../model/moves/moves.js";
  import * as mPieces from "../../model/pieces/pieces.js";
  import * as mBoards from "../../model/boards/boards.js";
  import * as coords  from "../../foundation/coords/coords.js";

  import * as view    from "../../view/view.js";            // view.getContext().
  import * as vBoards from "../../view/boards/boards.js";   // decorate tile meshes.
  import * as vPieces from "../../view/pieces/pieces.js";   // highlight a piece.
  import * as vTiles  from "../../view/tiles/tiles.js";     // tile meshes.
// Seampoint: more imports...

// --- Globals ---
  const pieceSelections = new Set();  // Holds piece key - "WKRP".
  const tileSelections  = new Set();  // Holds tile vts - [z,x,y].
  let annotation = "";
// Seampoint: more globals...

export function getAnnotation() { return annotation; }
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
  // console.log("cntrl: selections.js - clearSelections()");

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

  const panel = document.getElementById("diagnostics-window");

  vPieces.highlight(key);
  pieceSelections.add(key);
  panel.querySelector('[name="diags-pieceSels"]').textContent = pieceSelections.size;
  }

export function deselectPiece(key) {            // O(1).
  console.log("cntrl: selections.js - deselectPiece(key)", key);

  const panel = document.getElementById("diagnostics-window");

  vPieces.deHighlight(key);
  pieceSelections.delete(key);
  panel.querySelector('[name="diags-pieceSels"]').textContent = pieceSelections.size;
  }

export function clearPieceSelections() {        // O(1).
  // console.log("cntrl: selections.js - clearPieceSelections()");

  for(const key of [...pieceSelections]) deselectPiece(key)
  pieceSelections.clear();

  const panel = document.getElementById("diagnostics-window");
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
  const panel = document.getElementById("diagnostics-window");
  panel.querySelector('[name="diags-tileSels"]').textContent = tileSelections.size;

  const mesh = vTiles.getTileMesh(view.getContext().tileMap, vts);
  vBoards.decorateTile(mesh);
  }

export function deselectTile(vts) {             // O(3).
  console.log("cntrl: selections.js - deselectTile(vts)", vts);

  tileSelections.delete(vts);
  const panel = document.getElementById("diagnostics-window");
  panel.querySelector('[name="diags-tileSels"]').textContent = tileSelections.size;

  const mesh = vTiles.getTileMesh(view.getContext().tileMap, vts);
  vBoards.undecorateTile(mesh);
  }

export function clearTileSelections() {         // O(1).
  // console.log("cntrl: selections.js - clearTileSelections()");

  for(const tile of [...tileSelections]) deselectTile(tile)
  tileSelections.clear();

  const panel = document.getElementById("diagnostics-window");
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
function manageMoveButtons() {
  console.log("cntrl: selections.js - manageMoveButtons()");

  const size = cSetup.getCurrBoard().boardSize;           // Parse piece and tile info.
  const [key1, key2, key3, key4, key5, key6] = [...pieceSelections];
  const [tile1, tile2, tile3]    = [...tileSelections];
  const pieces = pieceSelections.size;
  const tiles  = tileSelections.size;
  // console.log("*** pieces, tiles", pieces, tiles);

  const piece1 = (key1) ? mPieces.getPieceList()[key1] : null;
  const piece2 = (key2) ? mPieces.getPieceList()[key2] : null;
  const piece3 = (key3) ? mPieces.getPieceList()[key3] : null;
  const piece4 = (key4) ? mPieces.getPieceList()[key4] : null;
  const piece5 = (key5) ? mPieces.getPieceList()[key5] : null;
  const piece6 = (key6) ? mPieces.getPieceList()[key6] : null;
  const dstStr1 = (tile1) ? coords.vtsToBoard(tile1, size) : "";
  const dstStr2 = (tile2) ? coords.vtsToBoard(tile2, size) : "";
  const dstStr3 = (tile3) ? coords.vtsToBoard(tile3, size) : "";
  const { player: player1, side: side1, level: level1, type: type1 } = utils.parsePieceKey(key1);
  const { player: player2, side: side2, level: level2, type: type2 } = utils.parsePieceKey(key2);
  const { player: player3, side: side3, level: level3, type: type3 } = utils.parsePieceKey(key3);
  const { player: player4, side: side4, level: level4, type: type4 } = utils.parsePieceKey(key4);
  const { player: player5, side: side5, level: level5, type: type5 } = utils.parsePieceKey(key5);
  const { player: player6, side: side6, level: level6, type: type6 } = utils.parsePieceKey(key6);

  const panel = document.getElementById("move-window");   // Update panel fields.
  panel.querySelector('[name="move-selPieces"]').textContent = [...pieceSelections];
  panel.querySelector('[name="move-selTiles"]').textContent  = `${dstStr1} ${dstStr2} ${dstStr3}`;

  if(piece1?.pos === dstStr1)  return;                    // Piece can't be on dst tile.
  const occupied = mPieces.isOccupied(tile1);             // Dst tile might be occupied.

  const index = state.getIndices()["Moves"] + 1;          // Players take turns.
  if((index%2 === 1 && player1 === 'B')
  || (index%2 === 0 && player1 === 'W')){  
    return;
  }

  mMoves.buttonAffordances("off");                        // Reset all the panel buttons.
  // console.log("*** all move buttons off.");

  if(     pieces === 1 && tiles === 1) {  // Move, decayMovs. promoteMov.
    console.log("*** 1 x 1");
    if(!mPieces.canOccupyTile(key1, tile1))
      return;
    panels.enableButton("move", true);
    }
  else if(pieces === 2 && tiles === 0) {  // Capture, decayCaps. promoteCap.
    console.log("*** 2 x 0");
    if(player1 != player2) {                              // CxC
      console.log("*** target", mPieces.piecesOnTile(piece2.vts).length);
      if(mPieces.piecesOnTile(piece2.vts).length === 1)
        panels.enableButton("capture", true);
    }
    }
  else if(pieces === 3 && tiles === 0) {  // Stack captures.
    console.log("*** 3 x 0");
    if(     (player1 === player2 && player1 != player3)   // SxC.
     && ((key1[3] === 'B' && key2[3] === 'D') || (key1[3] === 'D' && key2[3] === 'B'))
     && (piece1.pos === piece2.pos)
     && (mPieces.piecesOnTile(piece3.vts).length === 1)) {
      panels.enableButton("capture", true);
      }
    else if((player1 !=  player2 && player2 === player3)  // CxS.
     && ((key2[3] === 'B' && key3[3] === 'D') || (key2[3] === 'D' && key3[3] === 'B'))
     && (piece2.pos === piece3.pos)) {
      panels.enableButton("capture", true);
    }
    }
  else if(pieces === 2 && tiles === 1) {  // Tele, join. StackMov, Enpassant.
    console.log("*** 2 x 1");
    const promotable = (type1 === "P") && lastCol(dstStr1, size, player1);
    const piece2 = mPieces.getPieceList()[key2];
    if(     player1 != player2                  // En Passant.
      && type1  === 'P'
      && type2  === 'P')
      panels.enableButton("enpassant", true);
    else if(player1 === player2                 // Stack.
      && ( type1  === 'D' && type2  === 'B'
        || type1  === 'B' && type2  === 'D')) {
      if(piece1.pos === piece2.pos) // Stack move.
        panels.enableButton("move", true);
      else {} // Fusion unspecified.
      }
    else if(player1 === player2                 // Uplift.
      && ( type1  === 'P' && type2  === 'B'
        || type1  === 'P' && type2  === 'D')
      && lastCol(dstStr1, size, player1)
      && piece2.pos === dstStr1)
      panels.enableButton("uplift", true);
    else if(player1 === player2                 // Promote.
      && promotable
      && type2 != 'P' 
      && type2 != 'K')
      panels.enableButton("promote", true);
    }
  else if(pieces === 2 && tiles === 2) {  // FissionMM, castle, royal.
    console.log("*** 2 x 2");
    const fissMove = fissionMove(key1, key2, tile1, tile2);
    console.log("*** fissMove", fissMove);
    if(fissMove)
      panels.enableButton("fission", true);
    else if((type1 === 'K' && type2 === 'R'))        // Castle.
      panels.enableButton("castle", true);
    }
  else if(pieces === 3 && tiles === 1) {  // FissionCM, fissionMC.
    console.log("*** 3 x 1");
    if(key3[0] === key1[0]) return;     // Not an opponent ('W' != 'B').
    const fissSplit = fissionSplit(key1, key2, piece3, tile1);
    console.log("*** fissSplit", fissSplit);
    if(fissSplit)
      panels.enableButton("fission", true);
    }
  else if(pieces === 4 && tiles === 0) {  // FissionCC. SxS.
    console.log("*** 4 x 0");
    if(player3 === player1) return;           // Not an opponent ('W' != 'B').
    if(player4 === player1) return;

    if(piece3.pos === piece4.pos) {           // Target is a stack.
      panels.enableButton("capture", true);
    }

    const fissCapture = fissionCapture(piece1, piece2, piece3, piece4);
    console.log("*** fissCapture", fissCapture);
    if(fissCapture)
      panels.enableButton("fission", true);
    }
  else if(pieces === 4 && tiles === 1) {  // Fission: SxS-M|S-MxS
    console.log("*** 4 x 1");
    if(player3 === player1) return;           // Not an opponent ('W' != 'B').
    if(player4 === player1) return;
    const fissSplit = fissionSplit(key1, key2, piece3, tile1, piece4);
    console.log("*** fissSplit", fissSplit);
    if(fissSplit)
      panels.enableButton("fission", true);
    }
  else if(pieces === 5 && tiles === 0) {  // Fission: SxSxC|SxCxS.
    console.log("*** 5 x 0");
    if(player3 === player1) return;           // Not an opponent ('W' != 'B').
    if(player4 === player1) return;
    if(player5 === player1) return;
    const fissCapture = fissionCapture(piece1, piece2, piece3, piece4, piece5);
    console.log("*** fissCapture", fissCapture);
    if(fissCapture)
      panels.enableButton("fission", true);
    }
  else if(pieces === 6 && tiles === 0) {  // Fission: SxSxS.
    console.log("*** 6 x 0");
    if(player3 === player1) return;           // Not an opponent ('W' != 'B').
    if(player4 === player1) return;
    if(player5 === player1) return;
    const fissCapture = fissionCapture(piece1, piece2, piece3, piece4, piece5, piece6);
    console.log("*** fissCapture", fissCapture);
    if(fissCapture)
      panels.enableButton("fission", true);
    }
  else if(pieces === 3 && tiles === 3) {  // DoubleCastle.
    console.log("*** 3 x 3");
    if(player1 != player2) return;
    if((type1 === 'K' && type2 === 'R' && type3 === 'R'))
      panels.enableButton("castle", true);
    }
  }

function lastCol(dstStr1, size, player1) {
  const [, prefix, x, y] = dstStr1.match(/^([A-Z]+)(\d+),(\d+)$/);
  const i = Number(x);
  const j = Number(y);

  const dims = Number(size.split("x")[2]); // Should be 8 or 10.
  const first = (dims === 10) ? 0: 1; // TODO: check for standards drift.
  const last  = (dims === 10) ? 9: 8;

  const last_col = (i === j)
    && ((player1==="W" && i===last)  || (player1==="B" && i===first));
  
  return last_col;
}

function fissionMove(key1, key2, tile1, tile2) {
  console.log("cntrl: selections.js - fissionMove(...)", key1, key2, tile1, tile2);

  annotation = "";
  let fissType = null;  // fissMM, fissMJ, fissJM, fissJJ.

  const piece1 = mPieces.getPieceList()[key1];
  const piece2 = mPieces.getPieceList()[key2];
  if(piece1.pos != piece2.pos)  return null;  // Attacker not a stack.
  const player1 = key1[0];

  const occupied1 = mPieces.isOccupied(tile1);
  const occupied2 = mPieces.isOccupied(tile2);
  const key3 = mPieces.piecesOnTile(tile1)[0];
  const key4 = mPieces.piecesOnTile(tile2)[0];

  let char1 = 'M';
  if(occupied1) {
    const player3 = key3[0];
    if(player3 != player1)                        return null;  // Opponent on tile 1.
    if(mPieces.piecesOnTile(tile1).length === 2)  return null;  // Stack on tile 1.
    if(!mPieces.isStackMate(key1, key3))          return null;  // Not a stack mate.
    char1 = 'J';
  }
  let char2 = 'M';
  if(occupied2) {
    const player4 = key4[0];
    if(player4 != player1)                        return null; // Opponent on tile 2.
    if(mPieces.piecesOnTile(tile2).length === 2)  return null; // Stack on tile 2.
    if(!mPieces.isStackMate(key2, key4))          return null;  // Not a stack mate.
    char2 = 'J';
  }

  fissType = `fiss${char1}${char2}`;  // fissMM, fissMJ, fissJM, fissJJ.

  annotation = fissType;
  return fissType;
  }

function fissionSplit(key1, key2, piece3, tile1, piece4=null) {
  console.log("cntrl: selections.js - fissionSplit(...)", key1, key2, piece3, tile1, piece4);

  annotation = "";
  let fissType = null;  // fissMC, fissMS, fissJC, fissJS, fissCM, fissSM, fissCJ, fissSJ

  const piece1 = mPieces.getPieceList()[key1];
  const piece2 = mPieces.getPieceList()[key2];
  if(piece1.pos != piece2.pos)  return null;  // Attacker not a stack.

  let stackA = (piece4 && (piece3.pos === piece4.pos)) ? [[piece3, piece4]] : null;
  if(!stackA && (mPieces.piecesOnTile(piece3.vts).length === 2))  // Haven't selected all of stack.
    return null;
  if(mPieces.isOccupied(tile1)) {  // Capture piece or stack plus blocked or teleport.
    const subpiece1 = mPieces.hasOtherStackSubpiece(key2, tile1);
    const subpiece2 = mPieces.hasOtherStackSubpiece(key2, tile1);
    console.log("*** subpiece1", subpiece1);
    console.log("*** subpiece2", subpiece2);
    if(      stackA && subpiece1) fissType = "fissSJ";
    else if(!stackA && subpiece1) fissType = "fissCJ";
    else if( stackA && subpiece2) fissType = "fissJS";
    else if(!stackA && subpiece2) fissType = "fissJC";
    else fissType = null;
  }
  else if(!stackA && piece3 && piece4) { // Too many targets.
    return null;
  }
  else {  // Capture piece or stack plus move: fissMC, fissMS, fissFM, fissSM.
    const subpiece1 = key1[3];
    const subpiece2 = key2[3];
    if(      stackA && subpiece1 === 'B') fissType = "fissSM";
    else if(!stackA && subpiece1 === 'B') fissType = "fissCM";
    else if( stackA && subpiece2 === 'B') fissType = "fissMS";
    else if(!stackA && subpiece2 === 'B') fissType = "fissMC";
    else fissType = null;
  }

  annotation = fissType;
  return fissType;
  }

function fissionCapture(piece1, piece2, piece3, piece4, piece5=null, piece6=null) {
  console.log("cntrl: selections.js - fissionCapture(...)", piece1, piece2, piece3, piece4, piece5, piece6);

  annotation = "";
  let fissType = null;  // fissCC, fissCS, fissSC, fissSS.
  if(piece1.pos != piece2.pos)  return null;  // Not a stack.

  let stackA = (                    (piece3.pos === piece4.pos)) ? [[piece3, piece4]] : null;
  let stackB = (piece5 &&           (piece4.pos === piece5.pos)) ? [[piece4, piece5]] : null;
  let stackC = (piece5 && piece6 && (piece5.pos === piece6.pos)) ? [[piece5, piece6]] : null;

  if(!stackA && !stackB && !stackC && (piece5 || piece6)) return null;  // 3+ targets - sss|ssss.
  else if(stackA && !stackC && (piece5 && piece6))        return null;  // 3 targets - Sss.
  else if(stackB && piece6)                               return null;  // 3 targets - sSs.
  else if(!stackA && !stackB && !stackC) {          // Can't capture subpieces - ss.
    if((mPieces.piecesOnTile(piece3.vts).length === 2))   return null;
    if((mPieces.piecesOnTile(piece4.vts).length === 2))   return null;
    }
  else if(stackA && piece5 && !stackC) {            // Can't capture subpieces - Ss.
    if((mPieces.piecesOnTile(piece5.vts).length === 2))   return null;
    }
  else if(stackB) {                                 // Can't capture subpieces - sS.
    if((mPieces.piecesOnTile(piece3.vts).length === 2))   return null;
  }

  if(     stackA && stackC)             fissType = "fissSS";
  else if(stackA && !stackC && piece5)  fissType = "fissSC";
  else if(stackB)                       fissType = "fissCS";
  else if(!stackA && !stackC)           fissType = "fissCC";

  annotation = fissType;
  return fissType;
}
// Seampoint: more local functions...

// Move, decayMovs, promoteMov.
// Combines,, promoteCap, uplifts.
// Enpassant.
// Castle, royal.
// DoubleCastle.

