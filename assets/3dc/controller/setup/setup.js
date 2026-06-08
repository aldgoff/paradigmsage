/* File: setup.js
  Path: ./3dc/controller/setup/setup.js
  Purpose: Controller code to setup board and trays.
  Author: Allan Goff
  Date: 4/22/26
  Recommended access: import * as cSetup from "../../controller/setup/setup.js";
  UI: the export functions.
  Philosophy: Dlete a module by deleting its directory - not so much.
    controller/ model/ view/
    play.md - DOM
    main.js - regressions
    view.js - wire, build payload
    game.js - rewind, FF
    state.js - undo, redo
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
  import * as mPieces  from "../../model/pieces/pieces.js";
  import * as mTrays   from "../../model/trays/trays.js";

  import * as vSetup   from "../../view/setup/setup.js";
  import * as vGambits from "../../view/gambits/gambits.js";
  import * as vPieces  from "../../view/pieces/pieces.js";
// Seampoint: more imports...

// --- Globals ---
  export let boardSpec = null;
// Seampoint: more globals...

// --- UI ---
export function panelDispatch(payload) {    // Dispatch payload from panel to handle event functions.
  // console.log("cntrl: setup.js - panelDispatch(payload):", payload);

  vGambits.cancelAnimation();

  const { action, boardSize, trayType } = payload;

  switch (action) {
    case "makeBoard":   handleMakeBoard(payload); break;
    case "placePiece":  handlePlacePiece(payload); break;
    case "return":      handleReturnPieceToTray(payload); break;
    case "freeze":      handleFreeze(payload); break;
    case "startingPos": handleStartingPos(payload); break;
    case "play":        handlePlay(payload); break;
    case "updateParam": break;

    default: throw new Error(`Unknown setup action ${action}.`);
  }

  game.showUndoStatus();                          // Update game panel (undo).
  }

export function buildPayload(panel, action) {
  console.log("     ---------- cntrl: setup.js");
  return {  // payload
    action,
    boardSize:  panel.querySelector('input[name="board-size"]:checked')?.value,
    trayType:   panel.querySelector('input[name="tray-type"]:checked')?.value,
  };
}
// Seampoint: more global functions...

// --- Handle Functions ---
function handleMakeBoard(payload) { // Setup handler.
  console.log("cntrl: setup.js - handleMakeBoard(payload):", payload);

  const { action, boardSize, trayType } = payload;  // Informative.
  boardSpec = boardSize;

  const entry = mSetup.makeEntry(payload);    // Transform panel payload into state entry.
  applyEntry(entry);

  cTrays.init(entry);   // New Game (games.js) moves them from tray to board, play may begin.
  cBoards.init(entry);  // Initial occupancy depends on board size and tray type.
  cPieces.init(entry);  // Every piece is in a tray, none are on the board.

  panels.enableButton("makeBoard",   false);
  panels.enableButton("placePiece",  true);
  panels.enableButton("return",      false);
  panels.enableButton("freeze",      false);
  panels.enableButton("startingPos", true);
  panels.enableButton("play",        false);
  }

function handlePlacePiece(payload) {
  console.log("cntrl: setup.js - handlePlacePiece(payload):", payload);

  // --- Parse ---
    const spec = boardSpec;                     // TODO: Make code work for all three board sizes.

    const { action, boardSize, trayType } = payload;  // Informative, only action is used.
    const { pieceSelections, tileSelections } = cSelections.getSelections();
    console.log("*** Parse");

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
    else {                               // task = "place|shift".
      key     = pieceSelections.values().next().value;
      dstTile = tileSelections.values().next().value;
      piece   = mPieces.getPieceList()[key];
      if(piece.loc === '~')               { task = "place"; }
      else { src = piece.pos;               task = "shift"; }
    }
    console.log("*** ", pieceSelections, tileSelections, task);  // Diagnostic.

  // --- Do ---
    let result = {};
    switch (task) {
      case "noPiece": console.log("cntrl: setup.js - handlePlacePiece(...):", "No piece selected.");         return;
      case "pieces":  console.log("cntrl: setup.js - handlePlacePiece(...):", "Too many pieces selected.");  return;
      case "noTile":  console.log("cntrl: setup.js - handlePlacePiece(...):", "No tile selected.");          return;
      case "tiles":   console.log("cntrl: setup.js - handlePlacePiece(...):", "Too many tiles selected.");   return;
      case "nada":    console.log("cntrl: setup.js - handlePlacePiece(...):", "Unknown action.");            return;
      case "place":   result = placePieceOnBoard(key, dstTile);      break;
      case "shift":   result = shiftPieceToTile(key, src, dstTile);  break;
    }
    const { ok, err } = result
    if(!ok) { throw new Error(`${err} - don't log.`); return; }
    console.log("*** Do");

  // --- Log ---
    let player = key[0];  // Parse key, only player & type used.
    let side   = key[1];
    let level  = key[2];
    let type   = key[3];
    let place  = (src) 
    ? `${player}${type}-${src}`                                     // "WP-K4,4".
    : `${player}${type}@${coords.vtsToBoard(dstTile, boardSpec)}`;  // "WP@KR2,2".
    const entry = { action, place };

    state.pushNewSetup(entry);          // Log state change in undo buffer.
    vSetup.pushPanelLine(entry);        // Add line to panel.
    vSetup.refreshPanel(entry);         // Only needed by panels with derived fields.
    console.log("*** Log");

  // --- Buttons ---
    panels.enableButton("return",      true);
    panels.enableButton("freeze",      true);
    panels.enableButton("startingPos", false);
    console.log("*** Buttons");
  }

function handleReturnPieceToTray(payload) {
  console.log("cntrl: setup.js - handleReturnPieceToTray(payload):", payload);

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
      case "noPiece": console.log("cntrl: setup.js - handlePlacePiece(...):", "No piece selected.");         return;
      case "pieces":  console.log("cntrl: setup.js - handlePlacePiece(...):", "Too many pieces selected.");  return;
      case "tiles":   console.log("cntrl: setup.js - handlePlacePiece(...):", "Too many tiles selected.");   return;
      case "inTray":  console.log("cntrl: setup.js - handlePlacePiece(...):", "Piece already in tray.");     return;
      case "nada":    console.log("cntrl: setup.js - handlePlacePiece(...):", "Unknown action.");            return;
      case "return":  result = returnPieceToTray(key); break;
    }
    const { ok, err } = result
    if(!ok) { throw new Error(`${err} - don't log.`); return; }

  // --- Log ---
    let player = key[0];  // Parse key, only player & type used.
    let side   = key[1];
    let level  = key[2];
    let type   = key[3];
    const { i, j } = mTrays.trayIndices(type, spec);
    let tile     = `${side}${level}${i},${j}`;
    let trayTile = `${player}${side}${level}${type}~${tile}`;   // "WQRP~QR1,1".
    const entry = { action, trayTile };

    state.pushNewSetup(entry);          // Log state change in undo buffer.
    vSetup.pushPanelLine(entry);        // Add line to panel.
    vSetup.refreshPanel(entry);         // Only needed by panels with derived fields.

  // --- Buttons ---
    // panels.enableButton("freeze",      false); // FIXME: False if all pieces in tray.
    // panels.enableButton("startingPos", true);
  }

function handleFreeze(payload) {
  console.log("cntrl: setup.js - handleFreeze(payload):", payload);

  const { action, boardSize, trayType } = payload;  // Informative.

  const entry = { action, count: 3 };

  state.pushNewSetup(entry);          // Log state change in undo buffer.
  vSetup.pushPanelLine(entry);        // Add line to panel.
  vSetup.refreshPanel(entry);         // Only needed by panels with derived fields.

  panels.enableButton("placePiece",  false);
  panels.enableButton("return",      false);
  panels.enableButton("freeze",      false);
  panels.enableButton("startingPos", false);
  panels.enableButton("play",        true);
  }

function handleStartingPos(payload) {
  console.log("cntrl: setup.js - handleStartingPos(payload):", payload);

  const { action, boardSize, trayType } = payload;  // Informative.

  const entry = { action, startingPos: "Standard starting pos" };

  state.pushNewSetup(entry);          // Log state change in undo buffer.
  vSetup.pushPanelLine(entry);        // Add line to panel.
  vSetup.refreshPanel(entry);         // Only needed by panels with derived fields.

  panels.enableButton("placePiece",  false);
  panels.enableButton("return",      false);
  panels.enableButton("freeze",      false);
  panels.enableButton("startingPos", false);
  panels.enableButton("play",        true);
  }

function handlePlay(payload) {
  console.log("cntrl: setup.js - handlePlay(payload):", payload);

  const { action, boardSize, trayType } = payload;  // Informative.

  const entry = { action, play: "Begin play" };

  state.pushNewSetup(entry);          // Log state change in undo buffer.
  vSetup.pushPanelLine(entry);        // Add line to panel.
  vSetup.refreshPanel(entry);         // Only needed by panels with derived fields.

  panels.enableButton("play",        false);

  panels.enableButton("move", true);
}
// Seampoint: more handlers...

// --- Helpers ---
function applyEntry(entry) {
  console.log("cntrl: setup.js - applyEntry(entry)", entry);

  const currEntry = state.fetchCurrentState("Setup"); // Clear previous board.
  if(currEntry != null) {
    vSetup.clear(currEntry);
    if(!state.isAtEnd("Setup")) {     // Branches the undo history, discards original branch.
      // TODO: clear all later setup entries.
      // const idx = state.getCurrentIndex("Setup"); // Not quite working...
      // state.truncateState("Setup", idx);
    }
  }

  state.pushNewSetup(entry);          // Log state change in undo buffer.
  vSetup.render(entry);               // Render the new board and trays.
  vSetup.pushPanelLine(entry);        // Add line to panel.
  vSetup.refreshPanel(entry);         // Only needed by panels with derived fields.

  // TODO: remove all entries in the downstream buffers; 
  // a new board invalidates moves, gambits, and advsqs.
}

function placePieceOnBoard(key, dstTile) {
  console.log("cntrl: setup.js - placePieceOnBoard(key, dstTile):", key, dstTile);

  const piece = mPieces.getPieceList()[key];
  const { loc, pos, coord } = piece;
  const dstStr = coords.vtsToBoard(dstTile, boardSpec);

  const { ok, err } = mPieces.movePieceFromTrayToBoard(key, dstStr);
  if(!ok) return { ok, err };

  vPieces.deHighlight(key);
  cSelections.clearPieceSelections(key);
  cSelections.deselectTile(dstTile);

  return { ok, err: null };
  }

function shiftPieceToTile(key, src, dstTile) {
  console.log("cntrl: setup.js - shiftPieceToTile(key, src, dst):", key, src, dstTile);

  const piece = mPieces.getPieceList()[key];
  const { loc, pos, coord } = piece;
  const dstStr = coords.vtsToBoard(dstTile);

  const { ok, err } = mPieces.movePieceTileToTile(key, src, dstStr);
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
// Seampoint: more local functions...

