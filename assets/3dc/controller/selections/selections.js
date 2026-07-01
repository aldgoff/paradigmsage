/* File: selections.js
  Path: ./3dc/controller/selections/selections.js
  Purpose: Manage raycasting clicks for tiles, pieces, advsqs, gambits, etc.
  Author: Allan Goff
  Date: 6/04/26
  Recommended access: import * as cSelects from "../../controller/selections/selections.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import selectionsData from "./selections.json" assert { type: "json" };
  const selectionsModule = selectionsData.selections_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as utils   from "../../../utils/utils.js";       // isSame(a,b).
  import * as panels  from "../../panels/panels.js";

  import * as cSelections from "../../controller/selections/selections.js";
  import * as cSetup      from "../../controller/setup/setup.js";

  import * as state    from "../../model/state/state.js";
  import * as mSetup   from "../../model/setup/setup.js";
  import * as mMoves   from "../../model/moves/moves.js";
  import * as mGambits from "../../model/gambits/gambits.js";
  import * as mAdvsqs  from "../../model/advsqs/advsqs.js";
  import * as mPieces  from "../../model/pieces/pieces.js";
  import * as mBoards  from "../../model/boards/boards.js";
  import * as coords   from "../../foundation/coords/coords.js";

  import * as view    from "../../view/view.js";            // view.getContext().
  import * as vBoards from "../../view/boards/boards.js";   // decorate tile meshes.
  import * as vPieces from "../../view/pieces/pieces.js";   // highlight a piece.
  import * as vTiles  from "../../view/tiles/tiles.js";     // tile meshes.
// Seampoint: more imports...

// --- Globals ---
  const pieceSelections = new Set();  // Holds piece key - "WKRP".
  const tileSelections  = new Set();  // Holds tile vts - [z,x,y].
  let tileFirst = false; // Required for fission line listings.
  let annotation = "";
// Seampoint: more globals...

export function getTileFirst() { return tileFirst; }
export function getAnnotation() { return annotation; }
// --- UI ---
export function getSelections() {               // O(1).
  return { pieceSelections, tileSelections };
 }
export function getPieceSelection() {           // O(1).
  return pieceSelections;
 }
export function getTileSelection() {            // O(1).
  return tileSelections;
  }

export function clearSelections() {
  console.log("cntrl: selections.js - clearSelections()");

  clearPieceSelections();
  clearTileSelections();
  manageSetupButtons();
  manageMoveButtons();
  manageGambitButtons();
  manageAdvsqButtons();
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
  console.log("cntrl: selections.js - clearPieceSelections()");

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

  if(tileSelections.size === 1) {
    if(pieceSelections.size === 2)  tileFirst = true;
    else                            tileFirst = false;
  }
  }

export function deselectTile(vts) {             // O(3).
  console.log("cntrl: selections.js - deselectTile(vts)", vts);

  tileSelections.delete(vts);
  const panel = document.getElementById("diagnostics-window");
  panel.querySelector('[name="diags-tileSels"]').textContent = tileSelections.size;

  const mesh = vTiles.getTileMesh(view.getContext().tileMap, vts);
  vBoards.undecorateTile(mesh);

  if(tileSelections.size === 1) {
    if(pieceSelections.size === 2)  tileFirst = true;
    else                            tileFirst = false;
  }
  }

export function clearTileSelections() {         // O(1).
  // console.log("cntrl: selections.js - clearTileSelections()");

  for(const tile of [...tileSelections]) deselectTile(tile)
  tileSelections.clear();

  const panel = document.getElementById("diagnostics-window");
  panel.querySelector('[name="diags-tileSels"]').textContent = tileSelections.size;

  tileFirst = false;
}

export function handlePieceClick(group) {       // O(1).
  console.log("cntrl: selections.js - handlePieceClick(group)", group?.userData);
  
  if(!group) {
    console.log("Ray casting: click off piece.");
    return;
  }

  const key = group.userData.key;
  (pieceSelections.has(key))
    ? deselectPiece(key)
    : selectPiece(key);

  if(cSetup.getStillPlacingPieces()) // Still placing pieces...
    manageSetupButtons();
  else
    manageMoveButtons();
  
  manageGambitButtons();
  manageAdvsqButtons();

  return;
  }

export function handleTileClick(vts) {          // O(n).
  console.log("cntrl: selections.js - handleTileClick(vts)", vts);
  
  if(!vts) {
    console.log("*** Ray casting: click off tile.");
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

  if(cSetup.getStillPlacingPieces()) // Still placing pieces...
    manageSetupButtons();
  else
    manageMoveButtons();
  
  manageGambitButtons();
  manageAdvsqButtons();

  return;
}
// Seampoint: more global functions...

// --- Button Managers ---
export function manageSetupButtons() {
  console.log("cntrl: selections.js - manageSetupButtons()");

  /* Questions:
   * 1. Piece on board or tray?
   * 2. Tile occupied?
   * 3. Subpiece on occupied tile?
   * 4. Stack selected?
   * 5. Is board empty?
   * 6. is there a board?
   */

  // --- Selections Access ---
    const size = cSetup.getCurrBoard().boardSize;           // Parse piece and tile selections.
    const [key1, key2] = [...pieceSelections];
    const [tile1]      = [...tileSelections];
    const pieces = pieceSelections.size;
    const tiles  = tileSelections.size;
    console.log("*** pieces, tiles, size", pieces, tiles, size);

    const { piece1, piece2 } = getPieces([...pieceSelections]);
    const { sdStr1 }         = getTiles([...tileSelections], size);
    const { player: player1, side: side1, level: level1, type: type1 } = utils.parsePieceKey(key1);
    const { player: player2, side: side2, level: level2, type: type2 } = utils.parsePieceKey(key2);

  // --- Panel Access ---
    const panel = document.getElementById("setup-window");   // Update panel fields.
    panel.querySelector('[name="setup-selPieces"]').textContent = [...pieceSelections];
    panel.querySelector('[name="setup-selTiles"]').textContent  = `${sdStr1}`;

  // --- Decision Values ---
    const onBoard1  = (piece1 && (piece1.loc === "@"));     // Location of piece(s).
    const onBoard2  = (piece2 && (piece2.loc === "@"));
    const inTray1   = (piece1 && (piece1.loc === "~"));
    const inTray2   = (piece2 && (piece2.loc === "~"));

    const occupants = (tile1) ? mPieces.piecesOnTile(tile1) : [];   // Status of tile.
    const [occupant1, occupant2] = occupants;
    const occupied = occupants.length > 0;

    const stack     = (key1 && key2) ? mPieces.isStackMate(key1, key2) : false;
    const full      = stack || (occupants.length === 1);

    const diagPanel = document.getElementById("diagnostics-window");
    const pieceCount = Number(diagPanel.querySelector('[name="diags-pieceCount"]')?.value);
    const trayCount  = Number(diagPanel.querySelector('[name="diags-trayCount"]')?.value);
    const emptyBoard = (trayCount === pieceCount);

    const currBoard = cSetup.getCurrBoard();
    const isBoard = (cSetup.getCurrBoard().boardSize != "0x0x0") ? true : false;

    const joinable = (key1 && tile1) ? mPieces.canOccupyTile(key1, tile1) : false;

  // --- Development Diagnostics ---
    console.log("*** onBoard1, onBoard2", onBoard1, onBoard2);
    console.log("*** inTray1, inTray2",   inTray1, inTray2);
    console.log("*** occupants, occupied", occupants, occupied);
    console.log("*** stack, full", stack, full);
    console.log("*** emptyBoard", emptyBoard);
    console.log("*** emptyBoard", emptyBoard);
    console.log("*** currBoard.boardSize", currBoard.boardSize);
    console.log("*** isBoard", isBoard);
    console.log("*** joinable", joinable);

  // --- Selection Permutations ---
    if(     pieces === 0 && tiles === 0) {  // Click off board.
      console.log("*** 0 x 0");

      mSetup.buttonAffordances("makeBoard");
      if(isBoard) {
        panels.enableButton("freezePuzzle", true);
        if(emptyBoard) panels.enableButton("startingPos", true);
      }
      }
    else if(pieces === 1 && tiles === 0) {  // 1 piece no dst: returnable.
      console.log("*** 1 x 0");

      if(onBoard1)   mSetup.buttonAffordances("returnable");
      if(emptyBoard) panels.enableButton("startingPos", true);
      }
    else if(pieces === 1 && tiles === 1) {  // 1 piece 1 tile: placeable or shiftable.
      console.log("*** 1 x 1");

      if(     inTray1 && !occupied) mSetup.buttonAffordances("placeable");
      else if(inTray1 && joinable)  mSetup.buttonAffordances("placeable");
      else if(onBoard1 && !occupied) mSetup.buttonAffordances("shiftable");
      else if(onBoard1 && joinable)  mSetup.buttonAffordances("shiftable");
      }
    else if(pieces === 2 && tiles === 0) {  // 2 pieces no dst: if stack, returnable.
      console.log("*** 2 x 0");

      // TODO: Convert place, shift, and return to take a list of {key, prev, post}.

      // if(stack) {
      //   if(onBoard1 && onBoard2)      mSetup.buttonAffordances("returnable");
      // }
      }
    else if(pieces === 2 && tiles === 1) {  // 2 pieces 1 tile: if stack, placeable or shiftable.
      console.log("*** 2 x 1");

      // TODO: Convert place, shift, and return to take a list of {key, prev, post}.
      
      // if(stack) {
      //   if(inTray1 && inTray2)        mSetup.buttonAffordances("placeable");
      //   else if(onBoard1 && onBoard2) mSetup.buttonAffordances("shiftable");
      // }
    }
  }

export function manageMoveButtons() {
  console.log("cntrl: selections.js - manageMoveButtons()");

  // --- Selections Access ---
    const size = cSetup.getCurrBoard().boardSize;           // Parse piece and tile info.
    const [key1, key2, key3, key4, key5, key6] = [...pieceSelections];
    const [tile1, tile2, tile3]    = [...tileSelections];
    const pieces = pieceSelections.size;
    const tiles  = tileSelections.size;
    // console.log("*** pieces, tiles", pieces, tiles);

    const { piece1, piece2, piece3, piece4, piece5, piece6 } = getPieces([...pieceSelections]);
    const { sdStr1, sdStr2, sdStr3, sdStr4, sdStr5, sdStr6 } = getTiles([...tileSelections], size);
    const { player: player1, side: side1, level: level1, type: type1 } = utils.parsePieceKey(key1);
    const { player: player2, side: side2, level: level2, type: type2 } = utils.parsePieceKey(key2);
    const { player: player3, side: side3, level: level3, type: type3 } = utils.parsePieceKey(key3);
    const { player: player4, side: side4, level: level4, type: type4 } = utils.parsePieceKey(key4);
    const { player: player5, side: side5, level: level5, type: type5 } = utils.parsePieceKey(key5);
    const { player: player6, side: side6, level: level6, type: type6 } = utils.parsePieceKey(key6);

    const panel = document.getElementById("move-window");   // Update panel fields.
    panel.querySelector('[name="move-selPieces"]').textContent = [...pieceSelections];
    panel.querySelector('[name="move-selTiles"]').textContent  = `${sdStr1} ${sdStr2} ${sdStr3}`;

  // --- Decision Values ---
    if(piece1?.pos === sdStr1)  return;                     // Piece can't be on dst tile.
    const occupied = mPieces.isOccupied(tile1);             // Dst tile might be occupied.

  // --- Development Diagnostics ---
    console.log("*** occupied", occupied);

  // --- Players Alternate ---
    const index = state.getIndices()["Moves"] + 1;          // Players take turns.
    if((index%2 === 1 && player1 === 'B')
    || (index%2 === 0 && player1 === 'W')) {  
      return;
    }

  // --- Blank Affordances ---
    mMoves.buttonAffordances("off");                        // Reset all the panel buttons.

  // --- Selection Permutations ---
    if(     pieces === 1 && tiles === 1) {  // Move, decayMovs. promoteMov.
      console.log("*** 1 x 1");
      if(!mPieces.canOccupyTile(key1, tile1))
        return;
      panels.enableButton("move", true);
      annotation = "move";
      }
    else if(pieces === 2 && tiles === 0) {  // Capture, decayCaps. promoteCap.
      console.log("*** 2 x 0");
      if(player1 != player2) {                              // CxC
        console.log("*** target", mPieces.piecesOnTile(piece2.vts).length);
        if(mPieces.piecesOnTile(piece2.vts).length === 1) {
          panels.enableButton("capture", true);
          annotation = "stack";
        }
      }
      }
    else if(pieces === 3 && tiles === 0) {  // Stack captures.
      console.log("*** 3 x 0");
      if(     (player1 === player2 && player1 != player3)   // SxC.
      && ((key1[3] === 'B' && key2[3] === 'D') || (key1[3] === 'D' && key2[3] === 'B'))
      && (piece1.pos === piece2.pos)
      && (mPieces.piecesOnTile(piece3.vts).length === 1)) {
        panels.enableButton("capture", true);
        annotation = "stack";
        }
      else if((player1 !=  player2 && player2 === player3)  // CxS.
      && ((key2[3] === 'B' && key3[3] === 'D') || (key2[3] === 'D' && key3[3] === 'B'))
      && (piece2.pos === piece3.pos)) {
        panels.enableButton("capture", true);
        annotation = "stack";
      }
      }
    else if(pieces === 2 && tiles === 1) {  // Tele, join. StackMov, Enpassant.
      console.log("*** 2 x 1");
      const promotable = (type1 === "P") && lastCol(sdStr1, size, player1);
      const piece2 = mPieces.getPieceList()[key2];
      if(     player1 != player2                  // En Passant.
        && type1  === 'P'
        && type2  === 'P') {
        panels.enableButton("enpassant", true);
        annotation = "e.p.";
        }
      else if(player1 === player2                 // Stack.
        && ( type1  === 'D' && type2  === 'B'
          || type1  === 'B' && type2  === 'D')) {
        if(piece1.pos === piece2.pos) // Stack move.
          panels.enableButton("move", true);
        else {} // Fusion unspecified.
        annotation = "stack";
        }
      else if(player1 === player2                 // Uplift.
        && ( type1  === 'P' && type2  === 'B'
          || type1  === 'P' && type2  === 'D')
        && lastCol(sdStr1, size, player1)
        && piece2.pos === sdStr1) {
        panels.enableButton("uplift", true);
        annotation = "uplift";
        }
      else if(player1 === player2                 // Promote.
        && promotable
        && type2 != 'P' 
        && type2 != 'K') {
        panels.enableButton("promote", true);
        annotation = "promote";
        }
      }
    else if(pieces === 2 && tiles === 2) {  // FissionMM, castle, royal.
      console.log("*** 2 x 2");
      const fissMove = fissionMove(key1, key2, tile1, tile2);
      console.log("*** fissMove", fissMove);
      if(fissMove) {
        panels.enableButton("fission", true);
        annotation = fissMove;
        }
      else if((type1 === 'K' && type2 === 'R'))        // Castle.
        panels.enableButton("castle", true);
        // annotation = "cstal"; // TODO: strange bug.
      }
    else if(pieces === 3 && tiles === 1) {  // FissionCM, fissionMC.
      console.log("*** 3 x 1");
      if(key3[0] === key1[0]) return;     // Not an opponent ('W' != 'B').
      const fissSplit = fissionSplit(key1, key2, piece3, tile1);
      console.log("*** fissSplit", fissSplit);
      if(fissSplit) {
        panels.enableButton("fission", true);
        annotation = fissSplit;
      }
      }
    else if(pieces === 4 && tiles === 0) {  // FissionCC. SxS.
      console.log("*** 4 x 0");
      if(player3 === player1) return;           // Not an opponent ('W' != 'B').
      if(player4 === player1) return;

      if(piece3.pos === piece4.pos) {           // Target is a stack.
        panels.enableButton("capture", true);
        annotation = "fissSS";
        }
      else {
        const fissCapture = fissionCapture(piece1, piece2, piece3, piece4);
        console.log("*** fissCapture", fissCapture);
        if(fissCapture) {
          panels.enableButton("fission", true);
          annotation = fissCapture;
        }
      }
      }
    else if(pieces === 4 && tiles === 1) {  // Fission: SxS-M|S-MxS
      console.log("*** 4 x 1");
      if(player3 === player1) return;           // Not an opponent ('W' != 'B').
      if(player4 === player1) return;
      const fissSplit = fissionSplit(key1, key2, piece3, tile1, piece4);
      console.log("*** fissSplit", fissSplit);
      if(fissSplit) {
        panels.enableButton("fission", true);
        annotation = fissSplit;
      }
      }
    else if(pieces === 5 && tiles === 0) {  // Fission: SxSxC|SxCxS.
      console.log("*** 5 x 0");
      if(player3 === player1) return;           // Not an opponent ('W' != 'B').
      if(player4 === player1) return;
      if(player5 === player1) return;
      const fissCapture = fissionCapture(piece1, piece2, piece3, piece4, piece5);
      console.log("*** fissCapture", fissCapture);
      if(fissCapture) {
        panels.enableButton("fission", true);
        annotation = fissCapture;
      }
      }
    else if(pieces === 6 && tiles === 0) {  // Fission: SxSxS.
      console.log("*** 6 x 0");
      if(player3 === player1) return;           // Not an opponent ('W' != 'B').
      if(player4 === player1) return;
      if(player5 === player1) return;
      const fissCapture = fissionCapture(piece1, piece2, piece3, piece4, piece5, piece6);
      console.log("*** fissCapture", fissCapture);
      if(fissCapture) {
        panels.enableButton("fission", true);
        annotation = fissCapture;
      }
      }
    else if(pieces === 3 && tiles === 3) {  // DoubleCastle.
      console.log("*** 3 x 3");
      if(player1 != player2) return;
      if((type1 === 'K' && type2 === 'R' && type3 === 'R'))
        panels.enableButton("castle", true);
        annotation = "dble";
      }
  }

export function manageGambitButtons() {
  console.log("cntrl: selections.js - manageGambitButtons()");

  // --- Selections Access ---
    const size = cSetup.getCurrBoard().boardSize;           // Parse piece and tile info.
    const [key1,  key2,  key3,  key4]  = [...pieceSelections];
    const [tile1, tile2, tile3, tile4] = [...tileSelections];
    const pieces = pieceSelections.size;
    const tiles  = tileSelections.size;
    // console.log("*** pieces, tiles", pieces, tiles);

    const { piece1, piece2, piece3, piece4 } = getPieces([...pieceSelections]);
    const { sdStr1, sdStr2, sdStr3, sdStr4 } = getTiles([...tileSelections, size]);
    const { player: player1, side: side1, level: level1, type: type1 } = utils.parsePieceKey(key1);
    const { player: player2, side: side2, level: level2, type: type2 } = utils.parsePieceKey(key2);
    const { player: player3, side: side3, level: level3, type: type3 } = utils.parsePieceKey(key3);
    const { player: player4, side: side4, level: level4, type: type4 } = utils.parsePieceKey(key4);

  // --- Panel Access ---
    const panel = document.getElementById("gambit-window");   // Update panel fields.
    panel.querySelector('[name="gambit-selPieces"]').textContent = [...pieceSelections];
    panel.querySelector('[name="gambit-selTiles"]').textContent  = `${sdStr1} ${sdStr2} ${sdStr3}`;

    // --- Default Affordances ---
    mGambits.buttonAffordances("off");                        // Disable all buttons.

  // --- Selection Permutations ---
    if(     pieces === 0 && tiles === 0) {  // Usage tbd.

      }
    else if(pieces === 0 && tiles === 1) {  // Usage tbd.

      }
    else if(pieces === 0 && tiles === 2) {  // Usage tbd.

      }
    else if(pieces === 1 && tiles === 0) {  // Usage tbd.

      }
    else if(pieces === 1 && tiles === 1) {  // Usage tbd.

      }
    else if(pieces === 1 && tiles === 2) {

      }
    else if(pieces === 2 && tiles === 0) {

      }
    else if(pieces === 2 && tiles === 1) {

      }
    else if(pieces === 2 && tiles === 2) {

      }
    else {}  // Selection permutation not germain.
    // Seampoint for more affordance permutations.
  }

export function manageAdvsqButtons() {
  console.log("cntrl: selections.js - manageAdvsqButtons()");

  // --- Selections Access ---
    const size = cSetup.getCurrBoard().boardSize;           // Parse piece and tile info.
    const [key1,  key2,  key3,  key4]  = [...pieceSelections];
    const [tile1, tile2, tile3, tile4] = [...tileSelections];
    const pieces = pieceSelections.size;
    const tiles  = tileSelections.size;
    // console.log("*** pieces, tiles", pieces, tiles);

    const { piece1, piece2, piece3, piece4 } = getPieces([...pieceSelections]);
    const { sdStr1, sdStr2, sdStr3, sdStr4 } = getTiles([...tileSelections, size]);
    const { player: player1, side: side1, level: level1, type: type1 } = utils.parsePieceKey(key1);
    const { player: player2, side: side2, level: level2, type: type2 } = utils.parsePieceKey(key2);
    const { player: player3, side: side3, level: level3, type: type3 } = utils.parsePieceKey(key3);
    const { player: player4, side: side4, level: level4, type: type4 } = utils.parsePieceKey(key4);

  // --- Panel Access ---
    const panel = document.getElementById("advsq-window");   // Update panel fields.
    panel.querySelector('[name="advsq-selPieces"]').textContent = [...pieceSelections];
    panel.querySelector('[name="advsq-selTiles"]').textContent  = `${sdStr1} ${sdStr2} ${sdStr3}`;

  // --- Default Affordances ---
    mAdvsqs.buttonAffordances("default");                        // Reset to the default buttons.

  // --- Selection Permutations ---
    if(     pieces === 0 && tiles === 0) {  // Use input fields on the panel itself.

      }
    else if(pieces === 0 && tiles === 1) {  // A source tile, decorator determined by panel.

      }
    else if(pieces === 0 && tiles === 2) {  // A source and destination tile.

      }
    else if(pieces === 1 && tiles === 0) {  // Piece from which to...

      }
    else if(pieces === 1 && tiles === 1) {  // Draw advsq from piece to tile.

      }
    else if(pieces === 1 && tiles === 2) {

      }
    else if(pieces === 2 && tiles === 0) {

      }
    else if(pieces === 2 && tiles === 1) {

      }
    else if(pieces === 2 && tiles === 2) {

      }
    else {}  // Selection permutation not germain.
    // Seampoint for more affordance permutations.
}

// --- Helpers ---
function getPieces(pieceSelections) {
  console.log("cntrl: selections.js - getPieces(pieceSelections)", pieceSelections);

  const [key1, key2, key3, key4, key5, key6]  = [...pieceSelections];

  const piece1 = (key1) ? mPieces.getPieceList()[key1] : null;
  const piece2 = (key2) ? mPieces.getPieceList()[key2] : null;
  const piece3 = (key3) ? mPieces.getPieceList()[key3] : null;
  const piece4 = (key4) ? mPieces.getPieceList()[key4] : null;
  const piece5 = (key5) ? mPieces.getPieceList()[key5] : null;
  const piece6 = (key6) ? mPieces.getPieceList()[key6] : null;

  return { piece1, piece2, piece3, piece4, piece5, piece6 };
  }

function getTiles(tileSelections, size) {
  console.log("cntrl: selections.js - getTiles(tileSelections, size)", tileSelections, size);

  const [tile1, tile2, tile3, tile4, tile5, tile6]  = [...tileSelections];

  // if(!size) return;   // Need a board to have clicks on tiles.
  // if(!size) size = "0x0x0"; // return;   // Need a board to have clicks on tiles.

  const sdStr1 = (size && tile1) ? coords.vtsToBoard(tile1, size) : "";
  const sdStr2 = (size && tile2) ? coords.vtsToBoard(tile2, size) : "";
  const sdStr3 = (size && tile3) ? coords.vtsToBoard(tile3, size) : "";
  const sdStr4 = (size && tile4) ? coords.vtsToBoard(tile4, size) : "";
  const sdStr5 = (size && tile5) ? coords.vtsToBoard(tile5, size) : "";
  const sdStr6 = (size && tile6) ? coords.vtsToBoard(tile6, size) : "";

  return { sdStr1, sdStr2, sdStr3, sdStr4, sdStr5, sdStr6 };
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
  let fissType = null;  // fissMC, fissMS, fissJC, fissJS, fissCM, fissSM, fissCJ, fissSJ.

  const piece1 = mPieces.getPieceList()[key1];  // The stack.
  const piece2 = mPieces.getPieceList()[key2];
  if(piece1.pos != piece2.pos)  return null;    // Attacker not a stack.

  let stack = (piece4 && (piece3.pos === piece4.pos)) ? [[piece3, piece4]] : null;
  if(!stack && (mPieces.piecesOnTile(piece3.vts).length === 2))  // Haven't selected all of stack.
    return null;
  
  const sub1 = `${piece1.key[3]}`;        // B|D.
  const sub2 = `${piece2.key[3]}`;        // D|B.

  const movCap = cSelections.getTileFirst();

  console.log("*** sub1", sub1);
  console.log("*** sub2", sub2);
  console.log("*** stack", stack);
  console.log("*** movCap", movCap);

  if(movCap) {  // First subpiece moves, second captures (fissMC, fissMS, fissJC, fissJS).
    if(mPieces.isOccupied(tile1)) {   // fissJC, fissJS.
      const subpiece1 = mPieces.hasOtherStackSubpiece(key1, tile1);
      console.log("*** subpiece1", subpiece1);

      if(     subpiece1 &&  stack) fissType = "fissJS";
      else if(subpiece1 && !stack) fissType = "fissJC";
      else fissType = null;
      }
    else {                            // fissMC, fissMS.
      if(      stack) fissType = "fissMS";
      else if(!stack) fissType = "fissMC";
      else fissType = null;
    }
    }
  else {        // First subpiece captures, second moves (fissCM, fissSM, fissCJ, fissSJ).
    if(mPieces.isOccupied(tile1)) {   // fissCJ, fissSJ.
      const subpiece2 = mPieces.hasOtherStackSubpiece(key2, tile1);
      console.log("*** subpiece2", subpiece2);

      if(      stack && subpiece2) fissType = "fissSJ";
      else if(!stack && subpiece2) fissType = "fissCJ";
      else fissType = null;
    }
    else {                            // fissCM, fissSM.
      if(      stack) fissType = "fissSM";
      else if(!stack) fissType = "fissCM";
      else fissType = null;
    }
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

/* TODO: QC checklist
  1. PromoteMov
  2. PromoteCap
  3. Uplift
  4. ✅ Castles
  5. Castle annotations
 */

