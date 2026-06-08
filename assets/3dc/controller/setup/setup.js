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

  import * as vSetup   from "../../view/setup/setup.js";
  import * as vGambits from "../../view/gambits/gambits.js";  // Cancel animation.
  import * as vPieces  from "../../view/pieces/pieces.js";    // Dehighlight selected pieces.

  import * as invariants from "../../tests/core/invariants.js";
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
  // BKRR@BR6,6       // Place on board from tray.
  // BKRR:BR6,6>BR4,4 // Shift tiles on board.  
  // BKRR~KR1,1       // Return to tray from board.

function handleMakeBoard(payload) { // Setup handler.
  console.log("cntrl: setup.js - handleMakeBoard(payload):", payload);

  // --- Parse ---
    const { action, boardSize, trayType } = payload;  // Informative.
    boardSpec = boardSize;

  // --- Intent ---
    const entry = mSetup.makeEntry(payload);    // Transform panel payload into state entry.
  
  // --- Log ---
    applyEntry(entry);  // TODO: Must occur prior to init boards, trays, & pieces, but is a bug that should be fixed.

  // --- Do ---
    cBoards.init(entry);  // Initial occupancy depends on board size and tray type. TODO: support factory trays.
    cTrays.init(entry);   // Trays bracket the board.
    cPieces.init(entry);  // Every piece is in a tray, none are on the board.

  // --- Buttons ---
    panels.enableButton("makeBoard",   false);
    panels.enableButton("placePiece",  true);
    panels.enableButton("shiftPiece",  false);
    panels.enableButton("returnPiece", false);
    panels.enableButton("freezePuzzle",false);
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
    }
    console.log("*** Intent", pieceSelections, tileSelections, task);  // Diagnostic.

  // --- Do ---
    let result = {};
    switch (task) {
      case "noPiece": console.log("cntrl: setup.js - handlePlacePiece(...):", "No piece selected.");         return;
      case "pieces":  console.log("cntrl: setup.js - handlePlacePiece(...):", "Too many pieces selected.");  return;
      case "noTile":  console.log("cntrl: setup.js - handlePlacePiece(...):", "No tile selected.");          return;
      case "tiles":   console.log("cntrl: setup.js - handlePlacePiece(...):", "Too many tiles selected.");   return;
      case "nada":    console.log("cntrl: setup.js - handlePlacePiece(...):", "Unknown action.");            return;
      case "place":   result = placePieceOnBoard(key, dstTile);      break;
      // case "shift":   result = shiftPieceToTile(key, dstTile);  break;
    }
    const { ok, err } = result
    if(!ok) { throw new Error(`${err} - don't log.`); return; }
    console.log("*** Do");

  // --- Log ---
    let place  = `${key}@${coords.vtsToBoard(dstTile, boardSpec)}`;  // "BKRR@BR6,6".
    const entry = { action, place };

    recordSetupAction(entry);
    console.log("*** Log");

  // --- Buttons ---
    panels.enableButton("placePiece",   true);
    panels.enableButton("shiftPiece",   true);
    panels.enableButton("returnPiece",  true);
    panels.enableButton("freezePuzzle", true);
    panels.enableButton("startingPos",  false);
    panels.enableButton("play",         false);
    console.log("*** Buttons");
  }

function handleShiftPiece(payload) {
  console.log("cntrl: setup.js - handleShiftPiece(payload):", payload);

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
      src     = piece.pos;
      if(piece.loc === '@')               { task = "shift"; }
    }
    console.log("*** Intent", pieceSelections, tileSelections, task);  // Diagnostic.

  // --- Do ---
    let result = {};
    switch (task) {
      case "noPiece": console.log("cntrl: setup.js - handlePlacePiece(...):", "No piece selected.");         return;
      case "pieces":  console.log("cntrl: setup.js - handlePlacePiece(...):", "Too many pieces selected.");  return;
      case "noTile":  console.log("cntrl: setup.js - handlePlacePiece(...):", "No tile selected.");          return;
      case "tiles":   console.log("cntrl: setup.js - handlePlacePiece(...):", "Too many tiles selected.");   return;
      case "nada":    console.log("cntrl: setup.js - handlePlacePiece(...):", "Unknown action.");            return;
      // case "place":   result = placePieceOnBoard(key, dstTile);      break;
      case "shift":   result = shiftPieceToTile(key, dstTile);  break;
    }
    const { ok, err } = result
    if(!ok) { throw new Error(`${err} - don't log.`); return; }
    console.log("*** Do");

  // --- Log ---
    let prev   = `${src}`;
    let next   = `${coords.vtsToBoard(dstTile, boardSpec)}`;
    let places = `${key}:${prev}-${next}`
    const entry = { action, places };

    recordSetupAction(entry);
    console.log("*** Log");

  // --- Buttons ---
    panels.enableButton("placePiece",   true);
    panels.enableButton("returnPiece",  true);
    panels.enableButton("shiftPiece",   true);
    panels.enableButton("freezePuzzle", true);
    panels.enableButton("startingPos",  false);
    panels.enableButton("play",         false);
    console.log("*** Buttons");
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
    let side   = key[1];  // Parse key.
    let level  = key[2];
    let type   = key[3];
    const { i, j } = mTrays.trayIndices(type, spec);
    let tile     = `${side}${level}${i},${j}`;
    let trayTile = `${key}~${tile}`;   // "BKRR~KR1,1".
    const entry = { action, trayTile };

    recordSetupAction(entry);
    console.log("*** Log");

  // --- Buttons ---
    const pieceCount = mBoards.getBoardOccupancy()
      .flat(2)
      .filter(cell => cell !== null)
      .length;
    const boardPieces =
      Object.values(mPieces.getPieceList())
        .filter(piece => piece.loc === "@")
        .length;
    console.log("*** occupancy", mBoards.getBoardOccupancy());

    invariants.invariant(pieceCount === boardPieces, "Number of pieces listed on the board must equal the number actually on the board.");

    if(pieceCount === 0) {
      panels.enableButton("placePiece",   true);
      panels.enableButton("returnPiece",  false);
      panels.enableButton("shiftPiece",   false);
      panels.enableButton("freezePuzzle", false);
      panels.enableButton("startingPos",  true);
      panels.enableButton("play",         false);
    } 
    else {
      panels.enableButton("placePiece",   true);
      panels.enableButton("returnPiece",  true);
      panels.enableButton("shiftPiece",   true);
      panels.enableButton("freezePuzzle", true);
      panels.enableButton("startingPos",  false);
      panels.enableButton("play",         false);
    }
    console.log("*** Buttons");
  }

function handleFreeze(payload) {
  console.log("cntrl: setup.js - handleFreeze(payload):", payload);

  const { action, boardSize, trayType } = payload;  // Informative.

  const entry = { action, count: 3 };

  recordSetupAction(entry);

  // --- Buttons ---
    panels.enableButton("placePiece",   false);
    panels.enableButton("returnPiece",  false);
    panels.enableButton("shiftPiece",   false);
    panels.enableButton("freezePuzzle", false);
    panels.enableButton("startingPos",  false);
    panels.enableButton("play",         true);
    console.log("*** Buttons");
  }

function handleStartingPos(payload) {
  console.log("cntrl: setup.js - handleStartingPos(payload):", payload);

  const { action, boardSize, trayType } = payload;  // Informative.

  const entry = { action, startingPos: "Standard starting pos" };

  recordSetupAction(entry);

  // --- Buttons ---
    panels.enableButton("placePiece",   false);
    panels.enableButton("returnPiece",  false);
    panels.enableButton("shiftPiece",   false);
    panels.enableButton("freezePuzzle", false);
    panels.enableButton("startingPos",  false);
    panels.enableButton("play",         true);
    console.log("*** Buttons");
  }

function handlePlay(payload) {
  console.log("cntrl: setup.js - handlePlay(payload):", payload);

  const { action, boardSize, trayType } = payload;  // Informative.

  const entry = { action, play: "Begin play" };

  recordSetupAction(entry);

  // --- Buttons ---
    panels.enableButton("placePiece",   false);
    panels.enableButton("returnPiece",  false);
    panels.enableButton("shiftPiece",   false);
    panels.enableButton("freezePuzzle", false);
    panels.enableButton("startingPos",  false);
    panels.enableButton("play",         false);
    console.log("*** Buttons");

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

  recordSetupAction(entry);

  // TODO: remove all entries in the downstream buffers; 
  // a new board invalidates moves, gambits, and advsqs.
}

function placePieceOnBoard(key, dstTile) {
  console.log("cntrl: setup.js - placePieceOnBoard(key, dstTile):", key, dstTile);

  const dstStr = coords.vtsToBoard(dstTile, boardSpec);

  const { ok, err } = mPieces.movePieceFromTrayToBoard(key, dstStr);
  if(!ok) return { ok, err };

  vPieces.deHighlight(key);
  cSelections.clearPieceSelections(key);
  cSelections.deselectTile(dstTile);

  return { ok, err: null };
  }

function shiftPieceToTile(key, dstTile) {
  console.log("cntrl: setup.js - shiftPieceToTile(key, dst):", key, dstTile);

  const dstStr = coords.vtsToBoard(dstTile);

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
  state.pushNewSetup(entry);          // Log state change in undo buffer.
  vSetup.pushPanelLine(entry);        // Add line to panel.
  vSetup.refreshPanel(entry);         // Only needed by panels with derived fields.
}
// Seampoint: more local functions...

