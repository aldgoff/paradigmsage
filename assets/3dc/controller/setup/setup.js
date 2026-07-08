/* File: setup.js
  Path: ./3dc/controller/setup/setup.js
  Purpose: Controller code to setup board and trays.
  Author: Allan Goff
  Date: 4/22/26
  Recommended access: import * as cSetup from "../../controller/setup/setup.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import setupData from "./setup.json" assert { type: "json" };
  const setupModule = setupData.setup_module;
  const eights = setupModule.eights;
  const ten    = setupModule.ten;
  const tens   = setupModule.tens;
// Seampoint: more objects...

// --- Dependencies ---
  import * as panels   from "../../panels/panels.js";

  import * as game        from "../../controller/game/game.js";
  import * as cBoards     from "../../controller/boards/boards.js";
  import * as cTrays      from "../../controller/trays/trays.js";
  import * as cPieces     from "../../controller/pieces/pieces.js";
  import * as cSelections from "../../controller/selections/selections.js";

  import * as state    from "../../model/state/state.js";
  import * as mSetup   from "../../model/setup/setup.js";
  import * as mTrays   from "../../model/trays/trays.js";
  import * as mPieces  from "../../model/pieces/pieces.js";
  import * as mViewer  from "../../model/viewer/viewer.js";

  import * as vSetup   from "../../view/setup/setup.js";
  import * as vMoves   from "../../view/moves/moves.js";
  import * as vGambits from "../../view/gambits/gambits.js";
  import * as vAdvsqs  from "../../view/advsqs/advsqs.js";
  import * as vPieces  from "../../view/pieces/pieces.js";    // Dehighlight selected pieces.
// Seampoint: more imports...

// --- Globals ---
  export let boardSpec = "0x0x0"; // Deprecate.
  let currBoard = { boardSize: "0x0x0", trayType: "None", trayGap: 0 };
  let frozenPlacement = false;
// Seampoint: more globals...

export function getCurrBoard() { return currBoard; }
export function getFrozenPlacement() { return frozenPlacement; }
// --- UI ---
export function panelDispatch(payload) {    // Dispatch payload from panel to handle event functions.
  console.log("cntrl: setup.js - panelDispatch(payload):", payload);

  vGambits.cancelAnimation();

  const { action } = payload;
  const selections = cSelections.getSelections();

  switch (action) {
    case "makeBoard":    handleMakeBoard(payload);    break;
    case "placePiece":   handlePlacePiece(payload, selections);   break;
    case "shiftPiece":   handleShiftPiece(payload, selections);   break;
    case "returnPiece":  handleReturnPiece(payload, selections);  break;
    case "freezePuzzle": handleFreeze(payload);       break;
    case "startingPos":  handleStartingPos(payload);  break;
    case "updateParam":                               break;
    default: throw new Error(`Unknown setup action ${action}.`); break;
  }

  panels.diagnostics();
  game.showUndoStatus();                          // Update game panel (undo).
  }

export function buildPayload(panel, action) {
  console.log("     ---------- cntrl: setup.js, action", action);

  switch (action) {
    case "makeBoard":
      const viewerPanel = document.getElementById("viewer-window");

      const boardSize = panel.querySelector('input[name="board-size"]:checked')?.value;
      const trayType  = panel.querySelector('input[name="tray-type"]:checked')?.value;
      const trayGap   = Number(viewerPanel.querySelector('[name="viewer-trayGap"]')?.value);
      const nextBoard = { boardSize, trayType, trayGap };

      return { action, prevBoard: currBoard, nextBoard };
    break;
    case "placePiece":
    case "shiftPiece":
    case "returnPiece":
      return { action };
    case "freezePuzzle":
    case "startingPos":
      return { action };
    break;
    case "updateParam":
      console.log("*** Radio buttons capture state but are not actionable.");
      return { action };
    break;
    default: throw new Error(`Unknown setup action ${action}`); break;
  }
}

export function buildForward(entry) {     // Redo.
  console.log("cntrl: setup.js - buildForward(entry)", entry);

  const { action } = entry;

  if(     action === "makeBoard") {
    const { action, prevBoard, nextBoard } = entry;
    clearBoard(prevBoard);
    buildBoard(nextBoard);
    currBoard = structuredClone(nextBoard);
      boardSpec = currBoard.boardSize;  // Deprecate.

    vSetup.refreshPanel(nextBoard);         

    frozenPlacement = false;
    mSetup.buttonAffordances("startable");
    mViewer.buttonAffordances("canHide");
    }
  else if(action === "placePiece") {
    const { action, list } = entry;
    placePieceOnBoard(list);
    vSetup.refreshPanel(currBoard);         
    }
  else if(action === "shiftPiece") {
    const { action, list } = entry;
    shiftPieceAroundBoard(list);
    vSetup.refreshPanel(currBoard);         
    }
  else if(action === "returnPiece") {
    const { action, list } = entry;
    returnPieceToTray(list);
    vSetup.refreshPanel(currBoard);         
    }
  else if(action === "freezePuzzle") {
    const { action } = entry;
    mSetup.buttonAffordances("loaded");
    frozenPlacement = true;

    vSetup.refreshPanel(currBoard);         
    }
  else if(action === "startingPos") {
    const { action } = entry;
    initialLineup(entry);
    frozenPlacement = true;
    mSetup.buttonAffordances("makeBoard");
    vSetup.refreshPanel(currBoard);         
    }
  else { throw new Error(`Unknown setup action ${action}`); }
  
  cSelections.manageSetupButtons();

  panels.diagnostics();
  }

export function buildBackward(entry) {    // Undo.
  console.log("cntrl: setup.js - buildBackwards(entry)", entry);

  const { action } = entry;

  if(     action === "makeBoard") {
    const { action, prevBoard, nextBoard } = entry; // Informative.
    clearBoard(nextBoard);
    buildBoard(prevBoard);
    currBoard = structuredClone(prevBoard);
      boardSpec = currBoard.boardSize;
    
    vSetup.refreshPanel(prevBoard);         

    frozenPlacement = false;
    if(currBoard.boardSize === "0x0x0")
      mSetup.buttonAffordances("makeBoard");
    else
      mSetup.buttonAffordances("startable");
    mViewer.buttonAffordances("off");
    }
  else if(action === "placePiece") {
    const { action, list } = entry;
    returnPieceToTray(list);
    vSetup.refreshPanel(currBoard);         
    }
  else if(action === "shiftPiece") {
    const { action, list } = entry;
    revertPieceAroundBoard(list);
    vSetup.refreshPanel(currBoard);         
    }
  else if(action === "returnPiece") {
    const { action, list } = entry;
    const { key, prev, post } = list[0]
    const [, backwardStr] = post.split("~");
    if(backwardStr) {
      const listR =[{ key, prev: post, post: prev }]; // Swap prev and post.
      placePieceOnBoard(listR);
    }
    else {
      placePieceOnBoard(list);
    }
  
    vSetup.refreshPanel(currBoard);         
    }
  else if(action === "freezePuzzle") {
    const { action } = entry;
    frozenPlacement = false;
    vSetup.refreshPanel(currBoard);         
    }
  else if(action === "startingPos") {
    const { action } = entry;
    returnAllPiecesToHomeTray();
    frozenPlacement = false;
    mSetup.buttonAffordances("startable");
    vSetup.refreshPanel(currBoard);         
    }
  else { throw new Error(`Unknown setup action ${action}`); }

  cSelections.manageSetupButtons();

  panels.diagnostics();
}

export function returnAllPiecesToHomeTray() {
  console.log("cntrl: setup.js - returnAllPiecesToHomeTray()");

  for(const key in mPieces.getPieceList()) {    // "WKRR", ...
    const piece = mPieces.getPieceList()[key];
    if(piece.loc === '@')
      mPieces.movePieceFromBoardToTray(key);
  }
  const entries = state.getState().Setup;
  vSetup.refreshPanel(entries[0]);

  console.log("***", mPieces.getPieceList());
  console.log("***", mTrays.getWhiteTray());
  console.log("***", mTrays.getBlackTray());
  }

export function clearAllTileSelections() {
  // console.log("cntrl: setup.js - clearAllTileSelections()");

  const { pieceSelections, tileSelections } = cSelections.getSelections();
  for(const vts of tileSelections) {            // vts, ...
    cSelections.deselectTile(vts);
  }
  cSelections.clearTileSelections();            // Set of tile locations, indexed by vts.
  }

export function clearAllPieceSelections() {
  // console.log("cntrl: setup.js - clearAllPieceSelections()");

  const { pieceSelections, tileSelections } = cSelections.getSelections();
  for(const key of pieceSelections) {           // "WKRR", ...
    vPieces.deHighlight(key);
  }
  cSelections.clearPieceSelections();           // Set of pieces highlighted, indexed by key.
}
// Seampoint: more global functions...

function handleMakeBoard(payload) {
  console.log("cntrl: setup.js - handleMakeBoard(payload):", payload);

  const { action, prevBoard, nextBoard } = payload; // Informative.
  
  const entry = mSetup.makeBoardEntry(payload);     // Create entry.

  buildForward(entry);                          // Build board, trays, and pieces.
  branchHistory(entry);
  applyEntry(entry);

  clearAllPieceSelections();
  clearAllTileSelections();
  cSelections.clearSelections();  
  }

function handlePlacePiece(payload, selections) {
  console.log("cntrl: setup.js - handlePlacePiece(payload, selections):", payload, selections);

  const entry = mSetup.makePlaceEntry(payload, selections);
  pieceSetup(entry);
  }

function handleShiftPiece(payload, selections) {
  console.log("cntrl: setup.js - handleShiftPiece(payload, selections):", payload, selections);

  const entry = mSetup.makeShiftEntry(payload, selections);
  pieceSetup(entry);
  }

function handleReturnPiece(payload, selections) {
  console.log("cntrl: setup.js - handleReturnPiece(payload, selections):", payload, selections);

  const entry = mSetup.makeReturnEntry(payload, selections);
  pieceSetup(entry);
  }

function handleFreeze(payload) {
  console.log("cntrl: setup.js - handleFreeze(payload):", payload);

  const { action } = payload;  // Informative.

  const numBoardPieces =
    Object.values(mPieces.getPieceList())
      .filter(piece => piece.loc === "@")
      .length;  // Count number of pieces on the board.
  const entry = { action, data: numBoardPieces };

  buildForward(entry);
  branchHistory(entry);
  applyEntry(entry);

  clearAllPieceSelections();
  clearAllTileSelections();
  cSelections.clearSelections();

  mSetup.buttonAffordances("loaded");
  }

function handleStartingPos(payload) {
  console.log("cntrl: setup.js - handleStartingPos(payload):", payload);

  const { action, boardSize, trayType } = payload;

  const numBoardPieces = 
    Object.values(mPieces.getPieceList())
      .filter(piece => piece.loc === "@")
      .length;  // Count number of pieces on the board.
  const entry = { action, boardSize, trayType, data: numBoardPieces };

  buildForward(entry);
  branchHistory(entry);
  applyEntry(entry);

  clearAllPieceSelections();
  clearAllTileSelections();
  cSelections.clearSelections();
  
  mSetup.buttonAffordances("loaded");
  }

// Seampoint: more handlers...

// --- Helpers ---
function pieceSetup(entry) {
  console.log("cntrl: setup.js - pieceSetup(entry):", entry);

  buildForward(entry);
  branchHistory(entry);
  applyEntry(entry);

  clearAllPieceSelections();
  clearAllTileSelections();
  cSelections.clearSelections();

  mSetup.buttonAffordances("placed");
}

function buildBoard(board) {
  console.log("cntrl: setup.js - buildBoard(board):", board);

  const { boardSize, trayType, trayGap } = board;

  if(boardSize != "0x0x0") {
    cBoards.init(board);
    cTrays.init(board);
    cPieces.init(board); 
  }
  }

function clearBoard(board) {
  console.log("cntrl: setup.js - clearBoard(board):", board);

  const { boardSize, trayType, trayGap } = board;

  if(boardSize != "0x0x0") {
    cBoards.destroy(board);
    cTrays.destroy(board);
    cPieces.destroy(board);
  }
}

function placePieceOnBoard(list) {
  console.log("cntrl: setup.js - placePieceOnBoard(list):", list);

  const mover = list[0]; // list: [{key,prev,post}].
  const stack = list[1]; // list: [{key,prev,post}, {key,prev,post}].

  const [, dstStr] = mover.post.split("@");                 // Move(s).
  mPieces.movePieceFromTrayToBoard(mover.key, dstStr);
  if(stack) {
    mPieces.movePieceFromTrayToBoard(stack.key, dstStr);
  }
  
  return;
  }

function shiftPieceAroundBoard(list) {
  console.log("cntrl: setup.js - shiftPieceAroundBoard(list):", list);

  const mover = list[0]; // list: [{key,prev,post}].
  const stack = list[1]; // list: [{key,prev,post}, {key,prev,post}].

  const [, dstStr] = mover.post.split("@");                 // Move(s).
  mPieces.movePieceTileToTile(mover.key, dstStr);
  if(stack) {
    mPieces.movePieceTileToTile(stack.key, dstStr);
  }

  return;
  }

function revertPieceAroundBoard(list) {
  console.log("cntrl: setup.js - revertPieceAroundBoard(list):", list);

  const mover = list[0]; // list: [{key,prev,post}].
  const stack = list[1]; // list: [{key,prev,post}, {key,prev,post}].

  const [, dstStr] = mover.prev.split("@");                 // Move(s).
  mPieces.movePieceTileToTile(mover.key, dstStr);
  if(stack) {
    mPieces.movePieceTileToTile(stack.key, dstStr);
  }

  return;
  }

function returnPieceToTray(list) {
  console.log("cntrl: setup.js - returnPieceToTray(list):", list);

  const mover = list[0]; // list: [{key,prev,post}].
  const stack = list[1]; // list: [{key,prev,post}, {key,prev,post}].

  mPieces.movePieceFromBoardToTray(mover.key);              // Move(s).
  if(stack) {
    mPieces.movePieceFromBoardToTray(stack.key);
  }

  return;
}

function initialLineup(entry) {
  console.log("cntrl: setup.js - initialLineup(entry):", entry);

  const { action, boardSize, trayType } = entry;

  let board;
  if(currBoard.boardSize === "8x8x8") board = eights;
  if(currBoard.boardSize === "10x8x8") board = ten;
  if(currBoard.boardSize === "10x10x10") board = tens;

  for(const player of ["White", "Black"]) {
    for(const key in board[player].pieces) {
      const dstStr = board[player].pieces[key]
      const { ok, err } = mPieces.movePieceFromTrayToBoard(key, dstStr);
      if(!ok) {
        console.log("*** err:", err);
        return { ok, err };
      }
    }
    for(const key in board[player].pawns) {
      const dstStr = board[player].pawns[key]
      const { ok, err } = mPieces.movePieceFromTrayToBoard(key, dstStr);
      if(!ok) {
        console.log("*** err:", err);
        return { ok, err };
      }
    }
  }
  }

function branchHistory(entry) {
  console.log("cntrl: setup.js - branchHistory(entry):", entry);

  if(!state.isAtEnd("Setup")) {               // Undo branch.
    let top = state.getBufferLength("Setup");
    const idx = state.getCurrentIndex("Setup");
    state.truncateState("Setup", idx);
    while(top > idx) {
      vSetup.popPanelLine();
      top--;
    }
    vSetup.refreshPanel(entry);
  }

  vMoves.clearMoves();                // Remove all entries in downstream buffers.
  state.clearBuffer("Moves");

  vGambits.clearGambits();
  state.clearBuffer("Gambits");

  vAdvsqs.clearAdvsqs();
  state.clearBuffer("AdvSqs");
  }

function applyEntry(entry) {
  console.log("cntrl: setup.js - applyEntry(entry):", entry);

  state.pushNewSetup(entry);          // Log state change in undo buffer.
    vSetup.pushPanelLine(entry);        // Add line to panel.
    vSetup.refreshPanel(entry);         // Refresh panel (dimmed future rows).
  game.showUndoStatus();
}
// Seampoint: more local functions...

/* TODO: QC checklist
  1. ✅ Load/Save fails to make board.
  2. ✅ Corruption if attempt to place a piece on an occupied tile.
  3. Support factory trays.
  4. ✅ Make code work for all three board sizes.
  5. ✅ Implement startup position.
  6. ✅ Implement undo branching.
  7. ✅ Undo does not restore buttons.
  8. const max = 40;
  9. ✅ Stack management.
  10. Disable Place Piece button when trays empty.
  11. ✅ Turn off return piece when trays are full.
  12. ✅ Undo branching appears broken, again.
  13. ✅ Not sure how to include in entry.
  14. ✅ Button management during undo/redo.
  15. ✅ Floating duke.
*/

