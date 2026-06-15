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

  import * as coords   from "../../foundation/coords/coords.js";
  import * as state    from "../../model/state/state.js";
  import * as mSetup   from "../../model/setup/setup.js";
  import * as mBoards  from "../../model/boards/boards.js";
  import * as mTrays   from "../../model/trays/trays.js";
  import * as mPieces  from "../../model/pieces/pieces.js";

  import * as view     from "../../view/view.js";
  import * as vSetup   from "../../view/setup/setup.js";
  import * as vGambits from "../../view/gambits/gambits.js";  // Cancel animation.
  import * as vPieces  from "../../view/pieces/pieces.js";    // Dehighlight selected pieces.
  import * as vTrays   from "../../view/trays/trays.js";

  import * as invariants from "../../tests/core/invariants.js";
// Seampoint: more imports...

// --- Globals ---
  export let boardSpec = "0x0x0"; // Deprecate.
  let currBoard = { boardSize: "0x0x0", trayType: "None", trayGap: 0 };
// Seampoint: more globals...

export function getCurrBoard() { return currBoard; }
// --- UI ---
export function panelDispatch(payload) {    // Dispatch payload from panel to handle event functions.
  console.log("cntrl: setup.js - panelDispatch(payload):", payload);

  vGambits.cancelAnimation();

  const { action, prevBoard, nextBoard } = payload;

  switch (action) {
    case "makeBoard":    handleMakeBoard(payload); break;
    case "placePiece":   handlePlacePiece(payload); break;
    case "shiftPiece":   handleShiftPiece(payload); break;
    case "returnPiece":  handleReturnPiece(payload); break;
    case "freezePuzzle": handleFreeze(payload); break;
    case "startingPos":  handleStartingPos(payload); break;
    case "play":         handlePlay(payload); break;
    case "updateParam": break;

    default: throw new Error(`Unknown setup action ${action}.`);
  }

  diagnostic();
  game.showUndoStatus();                          // Update game panel (undo).
  }

export function buildPayload(panel, action) {
  console.log("     ---------- cntrl: setup.js");

  if(     action === "makeBoard") {
    const viewerPanel = document.getElementById("viewer-window");

    const boardSize = panel.querySelector('input[name="board-size"]:checked')?.value;
    const trayType  = panel.querySelector('input[name="tray-type"]:checked')?.value;
    const trayGap   = Number(viewerPanel.querySelector('[name="viewer-trayGap"]')?.value);
    const nextBoard = { boardSize, trayType, trayGap };

    return { action, prevBoard: currBoard, nextBoard };
    }
  else if(action === "placePiece") {
    const { pieceSelections, tileSelections } = cSelections.getSelections();

    const key     = pieceSelections.values().next().value;
    const dstTile = tileSelections.values().next().value;
    const dstStr = coords.vtsToBoard(dstTile, boardSpec);

    const piece   = mPieces.getPieceList()[key];
    console.log("***", piece);  // loc, pos, coords, vts, home: trayPos, trayCoords, trayVts.
    if(piece.loc === '~') { 
      const prev = `~${piece.pos}`;
      const post = `@${dstStr}`;
      return { action, key, prev, post };
      }
    else {
      console.log(`Piece not in tray, cannot place on board.`);
      return { action, key, prev: "miss", post: dstStr };
    }
    }
  else if(action === "shiftPiece") {
    const { pieceSelections, tileSelections } = cSelections.getSelections();

    const key     = pieceSelections.values().next().value;
    const dstTile = tileSelections.values().next().value;
    const dstStr = coords.vtsToBoard(dstTile, boardSpec);

    const piece = mPieces.getPieceList()[key];
    const prev  = `@${piece.pos}`;
    const post  = `@${dstStr}`;
    return { action, key, prev, post };
    }
  else if(action === "returnPiece") {
    const { pieceSelections, tileSelections } = cSelections.getSelections();

    const key   = pieceSelections.values().next().value;
    const piece = mPieces.getPieceList()[key];  // loc, pos, coords, vts, home: trayPos, trayCoords, trayVts.
    const prev  = `@${piece.pos}`;
    const post  = `~${piece.home.trayPos}`;
    return { action, key, prev, post };
    }
  else if(action === "freezePuzzle") {
    clearAllPieceSelections();
    clearAllTileSelections();

    return { action };
    }
  else if(action === "startingPos") {
    clearAllPieceSelections();
    clearAllTileSelections();

    return { action };
    }
  else if(action === "play") {
    clearAllPieceSelections();
    clearAllTileSelections();

    return { action };
    }
  else if(action === "updateParam") {
    console.log("*** Radio buttons capture state but are not actionable.");

    return { action };
    }
  else { throw new Error(`Unknown setup action ${action}`);
  }
  }

export function buildSetup(entry) {       // Handle.
  console.log("cntrl: setup.js - buildSetup(entry)", entry);

  const { action, prevBoard, nextBoard } = entry;

  clearBoard(entry.prevBoard);
  buildBoard(entry.nextBoard);

  }

export function buildForward(entry) {     // Redo.
  console.log("cntrl: setup.js - buildForward(entry)", entry);

  const { action, prevBoard, nextBoard } = entry;
  if(     action === "makeBoard") {
    clearBoard(entry.prevBoard);
    buildBoard(entry.nextBoard);
    currBoard = structuredClone(entry.nextBoard);

    boardSpec = currBoard.boardSize;

    setButtonState("boardDone");
    vSetup.refreshPanel(entry.nextBoard);         
    }
  else if(action === "placePiece") {
    const { action, key, prev, post } = entry;
    placePieceOnBoard(key, prev, post);
    setButtonState("pieces");
    vSetup.refreshPanel(currBoard);         
    }
  else if(action === "shiftPiece") {
    const { action, key, prev, post } = entry;
    shiftPieceAroundBoard(key, prev, post);
    setButtonState("pieces");
    vSetup.refreshPanel(currBoard);         
    }
  else if(action === "returnPiece") {
    const { action, key, prev, post } = entry;
    returnPieceToTray(key, prev, post);
    setButtonState("pieces");
    vSetup.refreshPanel(currBoard);         
    }
  else if(action === "freezePuzzle") {
    const { action } = entry;
    setButtonState("loaded");
    vSetup.refreshPanel(currBoard);         
    }
  else if(action === "startingPos") {
    const { action } = entry;
    setButtonState("loaded");
    vSetup.refreshPanel(currBoard);         
    }
  else if(action === "play") {
    const { action } = entry;
    setButtonState("play");
    vSetup.refreshPanel(currBoard);         
    }
  else {
  }
  diagnostic();
  }

export function buildBackward(entry) {    // Undo.
  console.log("cntrl: setup.js - buildBackwards(entry)", entry);

  const { action, prevBoard, nextBoard } = entry;
  if(     action === "makeBoard") {
    clearBoard(nextBoard);
    buildBoard(prevBoard);
    currBoard = structuredClone(prevBoard);

    boardSpec = currBoard.boardSize;

    (prevBoard.boardSize === "0x0x0")
      ? setButtonState("makeBoard")
      : setButtonState("boardDone");
    vSetup.refreshPanel(entry.prevBoard);         
    }
  else if(action === "placePiece") {
    const { action, key, prev, post } = entry;
    returnPieceToTray(key, post, prev);
    setButtonState("pieces");
    vSetup.refreshPanel(currBoard);         
    }
  else if(action === "shiftPiece") {
    const { action, key, prev, post } = entry;
    shiftPieceAroundBoard(key, post, prev);
    setButtonState("pieces");
    vSetup.refreshPanel(currBoard);         
    }
  else if(action === "returnPiece") {
    const { action, key, prev, post } = entry;
    placePieceOnBoard(key, post, prev);
    setButtonState("pieces");
    vSetup.refreshPanel(currBoard);         
    }
  else if(action === "freezePuzzle") {
    const { action } = entry;
    setButtonState("pieces");
    vSetup.refreshPanel(currBoard);         
    }
  else if(action === "startingPos") {
    const { action } = entry;
    setButtonState("pieces");
    vSetup.refreshPanel(currBoard);         
    }
  else if(action === "play") {
    const { action } = entry;
    setButtonState("loaded");
    vSetup.refreshPanel(currBoard);         
    }
  else {
  }
  diagnostic();
}

export function returnAllPiecesToHomeTray() {
  console.log("cntrl: game.js - returnAllPiecesToHomeTray()");

  for(const key in mPieces.getPieceList()) {    // "WKRR", ...
    const piece = mPieces.getPieceList()[key];
    const { loc, pos, coords, vts, home } = piece;              // Parse the piece fields.
    if(loc === '@')
      mPieces.movePieceFromBoardToTray(key);
  }
  const entries = state.getState().Setup;
  vSetup.refreshPanel(entries[0]);

  console.log("***", mPieces.getPieceList());
  console.log("***", mTrays.getWhiteTray());
  console.log("***", mTrays.getBlackTray());
  console.log("***", mBoards.getBoardOccupancy());
  }

export function clearAllTileSelections() {
  console.log("cntrl: game.js - clearAllTileSelections()");

  const { pieceSelections, tileSelections } = cSelections.getSelections();
  for(const vts of tileSelections) {            // vts, ...
    cSelections.deselectTile(vts);
    console.log("***", vts);
  }
  cSelections.clearTileSelections();            // Set of tile locations, indexed by vts.
  }

export function clearAllPieceSelections() {
  console.log("cntrl: game.js - clearAllPieceSelections()");

  const { pieceSelections, tileSelections } = cSelections.getSelections();
  for(const key of pieceSelections) {           // "WKRR", ...
    vPieces.deHighlight(key);
    console.log("***", key);
  }
  cSelections.clearPieceSelections();           // Set of pieces highlighted, indexed by key.
}
// Seampoint: more global functions...

function handleMakeBoard(payload) { // Setup handler.
  console.log("cntrl: setup.js - handleMakeBoard(payload):", payload);

  const { action, prevBoard, nextBoard, boardSize,trayType,trayGap } = payload;
  const entry = payload;

  state.pushNewSetup(entry);                    // Log state change in undo buffer.

  clearBoard(entry.prevBoard);
  buildBoard(entry.nextBoard);

  boardSpec = nextBoard.boardSize;

  vSetup.pushPanelLine(entry);                  // Upate panels.
  vSetup.refreshPanel(nextBoard);         
  setButtonState("boardDone");

  currBoard = structuredClone(nextBoard);       // Capture current board.
  }

function handlePlacePiece(payload) {
  console.log("cntrl: setup.js - handlePlacePiece(payload):", payload);
   
  let result = createPieceEntry(payload);
  const { entry, err } = result;
  if(!entry) { throw new Error(`${err} - don't log.`); return; }

  buildForward(entry);

  recordSetupAction(entry);

  // --- Buttons ---
    const pieceCount = mBoards.getBoardOccupancy().flat(2).filter(cell => cell !== null).length;
    const max = 40; // TODO: magic number
    (pieceCount === max)
      ? setButtonState("emptyTrays")
      : setButtonState("pieces");
  
  clearAllPieceSelections();
  clearAllTileSelections();
  }

function handleShiftPiece(payload) {
  console.log("cntrl: setup.js - handleShiftPiece(payload):", payload);

  let result = createPieceEntry(payload);
  const { entry, err } = result;
  if(!entry) { throw new Error(`${err} - don't log.`); return; }

  buildForward(entry);

  recordSetupAction(entry);

  clearAllPieceSelections();
  clearAllTileSelections();
  }

function handleReturnPiece(payload) {
  console.log("cntrl: setup.js - handleReturnPiece(payload):", payload);

  let result = createPieceEntry(payload);
  const { entry, err } = result;
  if(!entry) { throw new Error(`${err} - don't log.`); return; }

  buildForward(entry);

  recordSetupAction(entry);

  clearAllPieceSelections();
  clearAllTileSelections();

  // --- Buttons ---
    const pieceCount = mBoards.getBoardOccupancy()
      .flat(2)
      .filter(cell => cell !== null)
      .length;
    const boardPieces =
      Object.values(mPieces.getPieceList())
        .filter(piece => piece.loc === "@")
        .length;
    (pieceCount === 0)
      ? setButtonState("boardDone")
      : setButtonState("pieces");
  }

function handleFreeze(payload) {
  console.log("cntrl: setup.js - handleFreeze(payload):", payload);

  const { action, boardSize, trayType } = payload;  // Informative.

  const numBoardPieces =
    Object.values(mPieces.getPieceList())
      .filter(piece => piece.loc === "@")
      .length;  // Count number of pieces on the board.
  const entry = { action, data: numBoardPieces };

  recordSetupAction(entry);
  setButtonState("loaded");
  }

function handleStartingPos(payload) {  // TODO: Load all the pieces.
  console.log("cntrl: setup.js - handleStartingPos(payload):", payload);

  const { action, boardSize, trayType } = payload;  // Informative.

  let board = eights;
  if(currBoard.boardSize === "10x8x8") board = ten;
  if(currBoard.boardSize === "10x10x10") board = tens;

  for(const player of ["White", "Black"]) {
    console.log("***", player);
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

  const boardPieces =
    Object.values(mPieces.getPieceList())
      .filter(piece => piece.loc === "@")
      .length;  // Count number of pieces on the board.
  const entry = { action, data: boardPieces };

  recordSetupAction(entry);
  setButtonState("loaded");
  }

function handlePlay(payload) {
  console.log("cntrl: setup.js - handlePlay(payload):", payload);

  const { action, boardSize, trayType } = payload;  // Informative.

  const numBoardPieces =
    Object.values(mPieces.getPieceList())
      .filter(piece => piece.loc === "@")
      .length;  // Count number of pieces on the board?
  const data = (numBoardPieces > 0)
    ? `puzzle of ${numBoardPieces} pieces.`
    : "game." ;
  const entry = { action, data };

  recordSetupAction(entry);
  setButtonState("play");
}
// Seampoint: more handlers...

// --- Helpers ---
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

function setButtonState(command) {
  console.log("cntrl: setup.js - setButtonState(command)", command);

  const panel = document.getElementById("diags-window");
  panel.querySelector('[name="diags-buttons"]').textContent = command;

  switch (command) {
    case "makeBoard":
      panels.enableButton("makeBoard",   true);

      panels.enableButton("placePiece",  false);
      panels.enableButton("shiftPiece",  false);
      panels.enableButton("returnPiece", false);
      panels.enableButton("freezePuzzle",false);
      panels.enableButton("startingPos", false);
      panels.enableButton("play",        false);

      panels.enableButton("move", false);
      break;
    case "boardDone":
      panels.enableButton("makeBoard",   true);

      panels.enableButton("placePiece",  true);
      panels.enableButton("shiftPiece",  false);
      panels.enableButton("returnPiece", false);
      panels.enableButton("freezePuzzle",false);
      panels.enableButton("startingPos", true);
      panels.enableButton("play",        false);

      panels.enableButton("move", false);
      break;
    case "pieces":
      panels.enableButton("placePiece",   true);
      panels.enableButton("shiftPiece",   true);
      panels.enableButton("returnPiece",  true);
      panels.enableButton("freezePuzzle", true);
      panels.enableButton("startingPos",  false);
      panels.enableButton("play",         false);

      panels.enableButton("move", false);
      break;
    case "emptyTrays":
      panels.enableButton("placePiece",   false);
      panels.enableButton("returnPiece",  true);
      panels.enableButton("shiftPiece",   true);
      panels.enableButton("freezePuzzle", true);
      panels.enableButton("startingPos",  false);
      panels.enableButton("play",         false);

      panels.enableButton("move", false);
      break;
    case "loaded":
      panels.enableButton("placePiece",   false);
      panels.enableButton("returnPiece",  false);
      panels.enableButton("shiftPiece",   false);
      panels.enableButton("freezePuzzle", false);
      panels.enableButton("startingPos",  false);
      panels.enableButton("play",         true);

      panels.enableButton("move", false);
      break;
    case "play":
      panels.enableButton("placePiece",   false);
      panels.enableButton("returnPiece",  false);
      panels.enableButton("shiftPiece",   false);
      panels.enableButton("freezePuzzle", false);
      panels.enableButton("startingPos",  false);
      panels.enableButton("play",         false);

      panels.enableButton("move", true);
      break;
    default:
      throw new Error(`Unknown button state command ${command}.`);
      break;
  }
}

function createPieceEntry(payload) {
  console.log("cntrl: setup.js - createPieceEntry(payload):", payload);

  let { action, key, prev, post } = payload;
  let entry = { action, key, prev, post };
  let err = null;

  return { entry, err };
  }

function placePieceOnBoard(key, prev, post) {
  console.log("cntrl: setup.js - placePieceOnBoard(key, prev, post):", key, prev, post);

  const [, dstStr] = post.split("@");
  const dstTile = coords.normalizeTileToVts(dstStr, boardSpec);

  const { ok, err } = mPieces.movePieceFromTrayToBoard(key, dstStr);
  if(!ok) {
    console.log("*** err:", err);
    return { ok, err };
  }

  vPieces.deHighlight(key);
  cSelections.clearPieceSelections(key);
  cSelections.deselectTile(dstTile);

  return { ok, err: null };
  }

function shiftPieceAroundBoard(key, prev, post) {
  console.log("cntrl: setup.js - shiftPieceAroundBoard(key, prev, post):", key, prev, post);

  const [, dstStr] = post.split("@");
  const dstTile = coords.normalizeTileToVts(dstStr, boardSpec);

  const { ok, err } = mPieces.movePieceTileToTile(key, dstStr);
  if(!ok) return { ok, err };

  vPieces.deHighlight(key);
  cSelections.clearPieceSelections(key);
  cSelections.deselectTile(dstTile);

  return { ok, err: null };
  }

function returnPieceToTray(key, prev, post) {
  console.log("cntrl: setup.js - returnPieceToTray(key, prev, post):", key, prev, post);

  const { ok, err } = mPieces.movePieceFromBoardToTray(key);
  if(!ok) return { ok, err };

  vPieces.deHighlight(key);
  cSelections.clearPieceSelections(key);

  return { ok, err: null };
}

function recordSetupAction(entry) {
  console.log("cntrl: setup.js - recordSetupAction(entry):", entry);

  state.pushNewSetup(entry);          // Log state change in undo buffer.
  vSetup.pushPanelLine(entry);        // Add line to panel.
  vSetup.refreshPanel(entry);         // Only needed by panels with derived fields.
  }

function diagnostic() {
  console.log("cntrl : setup.js - diagnostic()");

  const pieceCount = Object.keys(mPieces.getPieceList()).length;

  const trayCount  = Object.values(mPieces.getPieceList()).filter(piece => piece.loc === "~").length;
  const boardCount = Object.values(mPieces.getPieceList()).filter(piece => piece.loc === "@").length;

  const whiteCount = mTrays.getWhiteTray().flat(2).filter(cell => cell !== null).length;
  const blackCount = mTrays.getBlackTray().flat(2).filter(cell => cell !== null).length;

  const boardOcc = mBoards.getBoardOccupancy().flat(2).filter(cell => cell !== null).length;

  const { pieceSelections, tileSelections } = cSelections.getSelections();

  const whiteGroupCount = vTrays.getWhiteTrayGroup()
    ? vTrays.getWhiteTrayGroup().children.length
    : "null";

  const blackGroupCount = vTrays.getBlackTrayGroup()
    ? vTrays.getBlackTrayGroup().children.length
    : "null";

  const panel = document.getElementById("diags-window");

  panel.querySelector('[name="diags-pieceCount"]').textContent = pieceCount;
  panel.querySelector('[name="diags-trayCount"]').textContent  = trayCount;

  panel.querySelector('[name="diags-whiteTray"]').textContent  = whiteCount;
  panel.querySelector('[name="diags-blackTray"]').textContent  = blackCount;

  panel.querySelector('[name="diags-boardCount"]').textContent = boardCount;
  panel.querySelector('[name="diags-boardOcc"]').textContent   = boardOcc;

  panel.querySelector('[name="diags-pieceSels"]').textContent  = tileSelections.size;
  panel.querySelector('[name="diags-tileSels"]').textContent   = pieceSelections.size;

  panel.querySelector('[name="diags-tileMap"]').textContent = view.getContext().tileMap?.size ?? 0;

  panel.querySelector('[name="diags-currPiecesGroup"]').textContent = vPieces.getCurrPiecesGroup()?.children.length ?? 0;
  panel.querySelector('[name="diags-pieceGroups"]').textContent     = Object.keys(vPieces.getPieceGroups()).length;

  panel.querySelector('[name="diags-whiteTrayGroup"]').textContent  = whiteGroupCount;
  panel.querySelector('[name="diags-blackTrayGroup"]').textContent  = blackGroupCount;

  panel.querySelector('[name="diags-sceneChildren"]').textContent = view.getContext().scene.children.length;
}
// Seampoint: more local functions...

/* TODO: QC checklist✅ 
    1. ✅ Load/Save fails to make board.
    2. Corruption if attempt to place a piece on an occupied tile.
    3. Support factory trays.
    4. ✅ Make code work for all three board sizes.
    5. ✅ Implement startup position.
    6. Implement undo branching.
    7. ✅ Undo does not restore buttons.
 */

