/* File: setup.js
  Path: ./3dc/view/setup/setup.js
  Purpose: Render board, tray, and initial piece positions.
  Author: Allan Goff
  Date: 5/03/26
  Recommended access: import * as vSetup from "../../view/setup/setup.js";
  UI: the export functions.
  Philosophy: Delete a module by deleting its directory - not so much.
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
  import * as cGambits from "../../controller/gambits/gambits.js"

  import * as state    from "../../model/state/state.js";
  import * as planes   from "../../geometry/planes/planes.js";
  import * as quads    from "../../geometry/quads/quads.js";

  import * as mPieces  from "../../model/pieces/pieces.js"

  import * as vBoards  from "../../view/boards/boards.js"
  import * as vTrays   from "../../view/trays/trays.js"
  import * as vPieces  from "../../view/pieces/pieces.js"
// Seampoint: more imports...

// --- Globals ---
// Seampoint: more globals...

// --- UI ---
export function clearSetup() {  // TODO: Empty function.
  console.log("view : setup.js - clearSetup()");

  vPieces.destroyPieces(mPieces.getPieceList());
  vTrays.destroyTrays();
  vBoards.destroyBoards();
  }

export function pushPanelLine(entry) {
  console.log("view : setup.js - pushPanelLine(entry)", entry);

  const { action, prevBoard, nextBoard } = entry;

  const scroll = document.getElementById("setup-list");
  if(!scroll) return;

  const line = assembleLine(entry);

  const div = document.createElement("div");
  div.textContent = line;

  // Write to the scroll box.
  scroll.appendChild(div);
  scroll.scrollTop = scroll.scrollHeight;
  }

export function popPanelLine() {
  console.log("view : setup.js - popPanelLine()");

  const scroll = document.getElementById("setup-list");
  if(!scroll) return;

  const last = scroll.lastElementChild;
  if(!last) return;

  scroll.removeChild(last);
  }
  
export function refreshPanel(board) {
  console.log("view : setup.js - refreshPanel(board):", board);

  // const { boardSize, trayType, trayGap } = board;

  let scroll = document.getElementById("setup-list");     // Scroll list.
  if(!scroll) return;

  const count = state.getIndices().Setup;                 // Scroll text box.
  const children = scroll.children;
  for(let i = 0; i < children.length; i++) {
    const opacity = (i < count)
      ? "1.0"     // active
      : "0.5";    // future
    children[i].style.opacity = opacity;
  }

  const panel = document.getElementById("setup-window");   // Radio buttons.
  if(!panel) return;
  const sizeRadio     = (board)
    ? panel.querySelector( `input[name="board-size"][value="${board.boardSize}"]`)
    : panel.querySelector( `input[name="board-size"][value="8x8x8"]`);
  const trayTypeRadio = (board) 
    ? panel.querySelector( `input[name="tray-type"][value="${board.trayType}"]`)
    : panel.querySelector( `input[name="tray-type"][value="Real"]`);
  if(sizeRadio) sizeRadio.checked = true;
  if(trayTypeRadio) trayTypeRadio.checked = true;  
}

export function refreshEntry(entry) {
  console.log("view : setup.js - refreshEntry(entry):", entry);

  const board = entry;
  refreshPanel(board);
}

export function clear(entry) {
  console.log("view : setup.js - clear(entry)", entry);

  const { action, boardSize, trayType, trayGap } = entry;

  vBoards.clear(entry);
  vTrays.destroyTrays();
  }
  
export function render(entry) {
  console.log("view : setup.js - render(entry)", entry);

  const { action, boardSize, trayType, trayGap } = entry;  // Informative.
}

export function clearSetupPanelParams(params) {
  console.log("view : setup.js - clearSetupPanelParams(params):", params);

  const panel = document.getElementById("setup-window");
  if(!panel) return;

  const { boardSize, trayType, initialPos } = params;

  const sizeRadio     = panel.querySelector( `input[name="board-size"][value="${boardSize}"]`);
  const trayTypeRadio = panel.querySelector( `input[name="tray-type"][value="${trayType}"]`);
  // const initPosRadio  = panel.querySelector( `input[name="initial-pos"][value="${initialPos}"]`);

  if(sizeRadio) sizeRadio.checked = true;
  if(trayTypeRadio) trayTypeRadio.checked = true;
  // if(initPosRadio) initPosRadio.checked = true;
}
// Seampoint: more global functions...

// --- Helpers ---
function assembleLine(entry) {
  console.log("view : setup.js - assembleLine(entry)", entry);

  const { action, boardSpec } = entry;

  switch (action) {
    case "makeBoard": {
      // const { boardSize, trayType } = entry;
      const { action, prevBoard, nextBoard, boardSize,trayType,trayGap } = entry;
      const prevCol = `${prevBoard.boardSize}`.padEnd(8);
      const currCol = `${nextBoard.boardSize}`.padEnd(8);
      const typeCol = `${nextBoard.trayType}`.padEnd(4);
      const line    = `${prevCol} ${currCol} ${typeCol}`;
      return line; }
    case "destroyBoard": {
      const { boardSize, trayType } = entry;
      const sizeCol = `${boardSize}`.padEnd(8);
      const typeCol = `${trayType}`.padEnd(7);
      const line    = `${sizeCol} ${typeCol}`;
      return line; }
    case "placePiece": 
    case "shiftPiece": 
    case "returnPiece": {
      const { key, prev, post } = entry;
      const line = `${key} ${prev} ${post}`;
      return line; }
    case "freezePuzzle": 
    case "startingPos": {
      const line = `${action}`;
      // const { data } = entry;
      // const line = `${action} ${data} pieces`;
      return line; }
    default:
      throw new Error(`Unknown setup action: ${action}.`);
    break;
  }
  }
// Seampoint: more local functions...

