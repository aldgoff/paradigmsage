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

  const { action, prevBoard, nextBoard, boardSize,trayType,trayGap } = payload;

  switch (action) {
    case "makeBoard":    handleMakeBoard(payload); break;
    case "destroyBoard": handleDestroyBoard(payload); break;
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

  const viewerPanel = document.getElementById("viewer-window");

  const boardSize = panel.querySelector('input[name="board-size"]:checked')?.value;
  const trayType  = panel.querySelector('input[name="tray-type"]:checked')?.value;
  const trayGap   = Number(viewerPanel.querySelector('[name="viewer-trayGap"]')?.value);
  const nextBoard = { boardSize, trayType, trayGap };

  return { action, prevBoard: currBoard, nextBoard,
    boardSize:  panel.querySelector('input[name="board-size"]:checked')?.value,
    trayType:   panel.querySelector('input[name="tray-type"]:checked')?.value,
    trayGap:    Number(viewerPanel.querySelector('[name="viewer-trayGap"]')?.value)
  };  // payload
  }

export function rebuildToIndex(idx) {
  console.log("cntrl: setup.js - rebuildToIndex(idx):", idx);

  // ----- Hard clear -----
  // const curr = state.fetchCurrentState("Setup");
  // if(curr) vSetup.clear(curr);

  // cSelections.clearAllSelections?.();

  // ----- Replay -----
  const entries = state.getState().Setup;
  console.log("*** entries", entries);

  for(let i=0; i<idx; i++) {
    vSetup.refreshPanel(entries[i]);
    replayEntry(entries[i]);
  }

  // Rebuild panel text.
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

export function buildBoard(board) {
  console.log("cntrl: setup.js - buildBoard(board):", board);

  const { boardSize, trayType, trayGap } = board;

  cBoards.init(board);
  cTrays.init(board);
  cPieces.init(board); 
}

export function clearBoard(board) {
  console.log("cntrl: setup.js - clearBoard(board):", board);

  const { boardSize, trayType, trayGap } = board;

  if(boardSize != "0x0x0") {
    cBoards.destroy(board);
    cTrays.destroy(board);
    cPieces.destroy(board);
  }
}

// Seampoint: more global functions...

// --- Handle Functions ---
  // BKRR@BR6,6       // Place on board from tray.
  // BKRR:BR6,6>BR4,4 // Shift tiles on board.  
  // BKRR~KR1,1       // Return to tray from board.

function handleMakeBoard(payload) { // Setup handler.
  console.log("cntrl: setup.js - handleMakeBoard(payload):", payload);

  const { action, prevBoard, nextBoard, boardSize,trayType,trayGap } = payload;
  const entry = payload;

  state.pushNewSetup(entry);                    // Log state change in undo buffer.

  vSetup.pushPanelLine(entry);                  // Upate panels.
  vSetup.refreshPanel(nextBoard);         
  setButtonState("boardDone");

  currBoard = structuredClone(nextBoard);       // Capture current board.
}

function handleMakeBoard1(payload) { // Setup handler.
  console.log("cntrl: setup.js - handleMakeBoard(payload):", payload);

  const { action, prevBoard, nextBoard, boardSize,trayType,trayGap } = payload;
  const entry = payload;

  clearBoard(entry.prevBoard);
  buildBoard(entry.nextBoard);

  currBoard = structuredClone(nextBoard);

  // buildBoard(entry);

  // state.pushNewSetup(entry);                    // Log state change in undo buffer.
  // vSetup.pushPanelLine(entry);
  // vSetup.refreshPanel(entry);

  // if(currBoard.boardSize != "0x0x0") {          // Destroy current board.
  //   cBoards.destroy(entry);
  //   cTrays.destroy(entry);
  //   cPieces.destroy(entry);
  // }

  // cBoards.init(entry);                          // Create nextBoard.
  // cTrays.init(entry);   // TODO: (nextBoard).
  // cPieces.init(entry); 
    
  boardSpec = nextBoard.boardSize;

  state.pushNewSetup(entry);                    // Log state change in undo buffer.

  vSetup.pushPanelLine(entry);                  // Upate panels.
  vSetup.refreshPanel(nextBoard);         
  setButtonState("boardDone");

  // console.log("*** scene:", view.getContext().scene.children.map(o => 
  //   ({ type: o.type, name: o.name, children: o.children?.length })));
  }

function handleDestroyBoard(payload) {
  console.log("cntrl: setup.js - handleDestroyBoard(payload):", payload);

  const { action, prevBoard, nextBoard, boardSize,trayType,trayGap } = payload;
  const entry = payload;
  clearBoard(currBoard);

  boardSpec = prevBoard.boardSize;

  vSetup.refreshPanel(prevBoard);         
  setButtonState("makeBoard");
}

function handleDestroyBoard1(payload) {
  console.log("cntrl: setup.js - handleDestroyBoard(payload):", payload);

  const { action, prevBoard, nextBoard, boardSize,trayType,trayGap } = payload;
  const entry = payload;

  cBoards.destroy(entry);  // Initial occupancy depends on board size and tray type. TODO: support factory trays.
  cTrays.destroy(entry);   // Trays bracket the board.
  cPieces.destroy(entry);  // Every piece is in a tray, none are on the board.

  boardSpec = boardSize;

  applyEntry(entry);

  setButtonState("makeBoard");
}

function handlePlacePiece(payload) {
  console.log("cntrl: setup.js - handlePlacePiece(payload):", payload);

  // --- Parse ---
    const spec = boardSpec;

    const { action, prevBoard, nextBoard, boardSize,trayType,trayGap } = payload;
    const { pieceSelections, tileSelections } = cSelections.getSelections();
    // console.log("*** Parse");

  // --- Intent ---
    let task = "nada";      // What to do.
    let key = null;         // "WQQP".
    let piece = {};         // { loc: "~|@", pos: "Q5,5", coords: [0,1,1] }.
    let src = null;         // "QR1,1 - Location of piece already on board, in board coords.
    let dstTile = null;     // [-3,-3,-3] - destination coords on board, in vts coords.
    
    if(     pieceSelections.size === 0)   { task = "noPiece";}  // Determine task implied by the selections.
    else if(pieceSelections.size  >  1)   { task = "pieces"; }
    else if(tileSelections.size  === 0)   { task = "noTile"; }
    else if(tileSelections.size   >  1)   { task = "tiles";  }
    else {
      key     = pieceSelections.values().next().value;
      dstTile = tileSelections.values().next().value;
      piece   = mPieces.getPieceList()[key];
      if(piece.loc === '~')               { task = "place"; }
    }
    console.log("*** Intent", pieceSelections, tileSelections, task);  // Diagnostic.

  // --- Do ---
    let result = {};
    switch (task) {
      case "noPiece": console.log("***", "No piece selected.");         return;
      case "pieces":  console.log("***", "Too many pieces selected.");  return;
      case "noTile":  console.log("***", "No tile selected.");          return;
      case "tiles":   console.log("***", "Too many tiles selected.");   return;
      case "nada":    console.log("***", "Unknown action.");            return;
      case "place":   result = placePieceOnBoard(key, dstTile);      break;
    }
    const { ok, err } = result
    if(!ok) { throw new Error(`${err} - don't log.`); return; }
    // console.log("*** Do");

  // --- Log ---
    let place  = `${key}@${coords.vtsToBoard(dstTile, boardSpec)}`;  // "BKRR@BR6,6".
    const entry = { action, data: place };

    recordSetupAction(entry);
    // console.log("*** Log");

  // --- Buttons ---
    const pieceCount = mBoards.getBoardOccupancy()
      .flat(2)
      .filter(cell => cell !== null)
      .length;
    const max = 40; // TODO: magic number
    (pieceCount === max)
      ? setButtonState("emptyTrays")
      : setButtonState("pieces");
  }

function handleShiftPiece(payload) {
  console.log("cntrl: setup.js - handleShiftPiece(payload):", payload);

  // --- Parse ---
    const spec = boardSpec;                     // TODO: Make code work for all three board sizes.

    const { action, boardSize, trayType } = payload;  // Informative, only action is used.
    const { pieceSelections, tileSelections } = cSelections.getSelections();
    // console.log("*** Parse");

  // --- Intent ---
    let task = "nada";      // What to do.
    let key = null;         // "WQQP".
    let piece = {};         // { loc: "~|@", pos: "Q5,5", coords: [0,1,1] }.
    let src = null;         // "QR1,1 - Location of piece already on board, in board coords.
    let dstTile = null;     // [-3,-3,-3] - destination coords on board, in vts coords.
    
    if(     pieceSelections.size === 0)   { task = "noPiece";}  // Determine task implied by the selections.
    else if(pieceSelections.size  >  1)   { task = "pieces"; }
    else if(tileSelections.size  === 0)   { task = "noTile"; }
    else if(tileSelections.size   >  1)   { task = "tiles";  }
    else {
      key     = pieceSelections.values().next().value;
      dstTile = tileSelections.values().next().value;
      piece   = mPieces.getPieceList()[key];
      src     = piece.pos;
      if(piece.loc === '@')               { task = "shift"; }
    }
    console.log("*** Intent", pieceSelections, tileSelections, task);  // Diagnostic.

  // --- Do ---
    let result = {};
    switch (task) {
      case "noPiece": console.log("***", "No piece selected.");         return;
      case "pieces":  console.log("***", "Too many pieces selected.");  return;
      case "noTile":  console.log("***", "No tile selected.");          return;
      case "tiles":   console.log("***", "Too many tiles selected.");   return;
      case "nada":    console.log("***", "Unknown action.");            return;
      case "shift":   result = shiftPieceToTile(key, dstTile);  break;
    }
    const { ok, err } = result
    if(!ok) { throw new Error(`${err} - don't log.`); return; }
    // console.log("*** Do");

  // --- Log ---
    let prev   = `${src}`;
    let next   = `${coords.vtsToBoard(dstTile, boardSpec)}`;
    let places = `${key}:${prev}>${next}`
    const entry = { action, data: places };

    recordSetupAction(entry);
    console.log("*** Log");
  }

function handleReturnPiece(payload) {
  console.log("cntrl: setup.js - handleReturnPiece(payload):", payload);

  // --- Parse ---
    const spec = boardSpec;                     // TODO: Make code work for all three board sizes.

    const { action, boardSize, trayType } = payload;  // Informative, only action is used.
    const { pieceSelections, tileSelections } = cSelections.getSelections();

  // --- Intent ---
    let task = "nada";      // What to do.
    let key = null;         // "WQQP".
    let piece = {};         // { loc: "~|@", pos: "Q5,5", coords: [0,1,1] }.
    let src = null;         // "QR1,1 - Location of piece already on board, in board coords.
    
    if(     pieceSelections.size === 0)   { task = "noPiece";}  // Determine task implied by the selections.
    else if(pieceSelections.size  >  1)   { task = "pieces"; }
    else if(tileSelections.size   >  0)   { task = "tiles";  }
    else {                               // task = "return|inTray".
      key   = pieceSelections.values().next().value;
      piece = mPieces.getPieceList()[key];
      src   = piece.pos;
      if(piece.loc === '@')               { task = "return"; }
      else                                { task = "inTray"; }
    }
    // console.log("*** ", pieceSelections, tileSelections, task, key);  // Diagnostic.

  // --- Do ---
    let result = {};
    switch (task) {
      case "noPiece": console.log("***", "No piece selected.");         return;
      case "pieces":  console.log("***", "Too many pieces selected.");  return;
      case "tiles":   console.log("***", "Too many tiles selected.");   return;
      case "inTray":  console.log("***", "Piece already in tray.");     return;
      case "nada":    console.log("***", "Unknown action.");            return;
      case "return":  result = returnPieceToTray(key); break;
    }
    const { ok, err } = result
    if(!ok) { throw new Error(`${err} - don't log.`); return; }

  // --- Log ---
    let trayTile = `${key}~${piece.home.trayPos}`;   // "BKRR~KR1,1".
    const entry = { action, data: trayTile };

    recordSetupAction(entry);
    // console.log("*** Log");

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

    console.log("*** occupancy", mBoards.getBoardOccupancy());
    invariants.invariant(pieceCount === boardPieces, "Number of pieces listed on the board must equal the number actually on the board.");

    console.log("*** Buttons");
}

function handleFreeze(payload) {
  console.log("cntrl: setup.js - handleFreeze(payload):", payload);

  const { action, boardSize, trayType } = payload;  // Informative.
  const boardPieces =
    Object.values(mPieces.getPieceList())
      .filter(piece => piece.loc === "@")
      .length;
  const entry = { action, data: boardPieces };

  recordSetupAction(entry);

  setButtonState("loaded");
  }

function handleStartingPos(payload) {  // TODO: Load all the pieces.
  console.log("cntrl: setup.js - handleStartingPos(payload):", payload);

  const { action, boardSize, trayType } = payload;  // Informative.

  const boardPieces =
    Object.values(mPieces.getPieceList())
      .filter(piece => piece.loc === "@")
      .length;
  const entry = { action, data: boardPieces };

  recordSetupAction(entry);
  setButtonState("loaded");
  }

function handlePlay(payload) {
  console.log("cntrl: setup.js - handlePlay(payload):", payload);

  const { action, boardSize, trayType } = payload;  // Informative.

  const entry = { action, data: "game or puzzle" };

  recordSetupAction(entry);

  setButtonState("play");
}
// Seampoint: more handlers...

// --- Helpers ---

function applyEntry(entry) {
  console.log("cntrl: setup.js - applyEntry(entry)", entry);

  const currEntry = state.fetchCurrentState("Setup"); // Clear previous board.
  if(currEntry != null) {
    // vSetup.clear(currEntry);
    if(!state.isAtEnd("Setup")) {     // Branches the undo history, discards original branch.
      // TODO: clear all later setup entries.
      // const idx = state.getCurrentIndex("Setup"); // Not quite working...
      // state.truncateState("Setup", idx);
    }
  }

  recordSetupAction(entry);

  // TODO: remove all entries in the downstream buffers; 
  // a new board invalidates moves, gambits, and advsqs.
}

export function setButtonState(command) {
  console.log("cntrl: setup.js - setButtonState(command)", command);

  const panel = document.getElementById("diags-window");
  panel.querySelector('[name="diags-buttons"]').textContent = command;

  switch (command) {
    case "makeBoard":
      panels.enableButton("makeBoard",   true);
      panels.enableButton("destroyBoard",false);

      panels.enableButton("placePiece",  false);
      panels.enableButton("shiftPiece",  false);
      panels.enableButton("returnPiece", false);
      panels.enableButton("freezePuzzle",false);
      panels.enableButton("startingPos", false);
      panels.enableButton("play",        false);
      break;
    case "boardDone":
      panels.enableButton("makeBoard",   true);
      panels.enableButton("destroyBoard",true);

      panels.enableButton("placePiece",  true);
      panels.enableButton("shiftPiece",  false);
      panels.enableButton("returnPiece", false);
      panels.enableButton("freezePuzzle",false);
      panels.enableButton("startingPos", true);
      panels.enableButton("play",        false);
      break;
    case "pieces":
      panels.enableButton("placePiece",   true);
      panels.enableButton("shiftPiece",   true);
      panels.enableButton("returnPiece",  true);
      panels.enableButton("freezePuzzle", true);
      panels.enableButton("startingPos",  false);
      panels.enableButton("play",         false);
      break;
    case "emptyTrays":
      panels.enableButton("placePiece",   false);
      panels.enableButton("returnPiece",  true);
      panels.enableButton("shiftPiece",   true);
      panels.enableButton("freezePuzzle", true);
      panels.enableButton("startingPos",  false);
      panels.enableButton("play",         false);
      break;
    case "loaded":
      panels.enableButton("placePiece",   false);
      panels.enableButton("returnPiece",  false);
      panels.enableButton("shiftPiece",   false);
      panels.enableButton("freezePuzzle", false);
      panels.enableButton("startingPos",  false);
      panels.enableButton("play",         true);
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

function placePieceOnBoard(key, dstTile) {
  console.log("cntrl: setup.js - placePieceOnBoard(key, dstTile):", key, dstTile);

  const dstStr = coords.vtsToBoard(dstTile, boardSpec);

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

function shiftPieceToTile(key, dstTile) {
  console.log("cntrl: setup.js - shiftPieceToTile(key, dst):", key, dstTile);

  const dstStr = coords.vtsToBoard(dstTile, boardSpec);

  const { ok, err } = mPieces.movePieceTileToTile(key, dstStr);
  if(!ok) return { ok, err };

  vPieces.deHighlight(key);
  cSelections.clearPieceSelections(key);
  cSelections.deselectTile(dstTile);

  return { ok, err: null };
  }

function returnPieceToTray(key) {
  console.log("cntrl: setup.js - returnPieceToTray(key):", key);

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

function replayEntry(entry) {
  console.log("cntrl: setup.js - replayEntry(entry):", entry);

  const { action, data } = entry;

  if(     action === "makeBoard") {
    cBoards.destroy(entry);  // 
    cTrays.destroy(entry);   // Trays bracket the board.
    cPieces.destroy(entry);  // Every piece is in a tray, none are on the board.
    cBoards.init(entry);  // Initial occupancy depends on board size and tray type. TODO: support factory trays.
    cTrays.init(entry);   // Trays bracket the board.
    cPieces.init(entry);  // Every piece is in a tray, none are on the board.
    }
  else if(action === "destroyBoard") { 
    cBoards.destroy(entry);  // 
    cTrays.destroy(entry);   // Trays bracket the board.
    cPieces.destroy(entry);  // Every piece is in a tray, none are on the board.
    }
  else if(action === "placePiece") {    // BKRR@KR8,8
    const [key, dstStr] = data.split("@");
    const dstTile = coords.normalizeTileToVts(dstStr, boardSpec);
    placePieceOnBoard(key, dstTile);
    }
  else if(action === "shiftPiece") {    // BKRP:KR7,7>KR6,6
    const [key, residue]   = data.split(":");
    const [srcStr, dstStr] = residue.split(">");
    const dstTile = coords.normalizeTileToVts(dstStr, boardSpec);
    shiftPieceToTile(key, dstTile);
    }
  else if(action === "returnPiece") {   // BKRR~KR1,1
    const [key] = data.split("~");
    returnPieceToTray(key);
    }
  else if(action === "freezePuzzle") {
    }
  else if(action === "startingPos") {
    throw new Error("Setup piece starting position not implemented.");  // TODO:
    }
  else if(action === "play") {
    }
  else {
    throw new Error(`Unknown setup action: ${action}`);
  }
}

function diagnostic() {
  console.log("cntrl : setup.js - diagnostic()");

  const pieceCount = Object.keys(mPieces.getPieceList()).length;

  const trayCount  = Object.values(mPieces.getPieceList()).filter(piece => piece.loc === "~").length;
  const boardCount = Object.values(mPieces.getPieceList()).filter(piece => piece.loc === "@").length;

  const whiteCount = mTrays.getWhiteTray().flat(2).filter(cell => cell !== null).length;
  const blackCount = mTrays.getBlackTray().flat(2).filter(cell => cell !== null).length;
  const trayInvariant = whiteCount + blackCount;

  const boardOcc = mBoards.getBoardOccupancy().flat(2).filter(cell => cell !== null).length;

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

  panel.querySelector('[name="diags-tileMap"]').textContent = view.getContext().tileMap?.size ?? 0;

  panel.querySelector('[name="diags-currPiecesGroup"]').textContent = vPieces.getCurrPiecesGroup()?.children.length ?? 0;
  panel.querySelector('[name="diags-pieceGroups"]').textContent     = Object.keys(vPieces.getPieceGroups()).length;

  panel.querySelector('[name="diags-whiteTrayGroup"]').textContent  = whiteGroupCount;
  panel.querySelector('[name="diags-blackTrayGroup"]').textContent  = blackGroupCount;

  panel.querySelector('[name="diags-sceneChildren"]').textContent = view.getContext().scene.children.length;
}
// Seampoint: more local functions...

/* TODO: QC checklist✅ 
    1. Load/Save fails to make board.
    2. Corruption if attempt to place a piece on an occupied tile.
    3. Support factory trays.
    4. Make code work for all three board sizes.
    5. Implement startup position.
    6. Implement undo branching.
    7. Undo does not restore buttons.
 */

