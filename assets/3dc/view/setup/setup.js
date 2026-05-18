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
  // const category  = setupModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as planes from "../../geometry/planes/planes.js";
  import * as quads  from "../../geometry/quads/quads.js";

  import * as vBoards  from "../../view/boards/boards.js"
  import * as vTrays   from "../../view/trays/trays.js"
  import * as cGambits from "../../controller/gambits/gambits.js"
// Seampoint: more imports...

// --- UI ---
export function clear(entry) {
  console.log("view: setup.js - clear(entry)", entry);

  const { action, boardSize, trayType, initialPos } = entry;  // Informative.

  vBoards.clear(entry);
  vTrays.clear(entry);
  }
  
export function render(entry) {
  console.log("view: setup.js - render(entry)", entry);

  const { action, boardSize, trayType, initialPos } = entry;  // Informative.

  vBoards.render(entry);
  vTrays.render(entry);
  }
  
export function refreshPanel(entry) {
  console.log("view : setup.js - refreshPanel(entry):", entry);

  const panel = document.getElementById("setup-window");
  if(!panel) return;

  const { action, boardSize, trayType, initialPos } = entry;

  const sizeRadio     = panel.querySelector( `input[name="board-size"][value="${boardSize}"]`);
  const trayTypeRadio = panel.querySelector( `input[name="tray-type"][value="${trayType}"]`);
  const initPosRadio  = panel.querySelector( `input[name="initial-pos"][value="${initialPos}"]`);

  if(sizeRadio) sizeRadio.checked = true;
  if(trayTypeRadio) trayTypeRadio.checked = true;
  if(initPosRadio) initPosRadio.checked = true;
}

export function pushPanelLine(entry) {
  console.log("view : setup.js - pushPanelLine(entry)", entry);

  const el = document.getElementById("setup-list");
  if(!el) return;

  const line = assembleLine(entry);

  const div = document.createElement("div");
  div.textContent = line;

  // Write to the scroll box.
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
  }

export function clearSetupPanelParams(params) {
  console.log("view : setup.js - clearSetupPanelParams(params):", params);

  const panel = document.getElementById("setup-window");
  if(!panel) return;

  const { boardSize, trayType, initialPos } = params;

  const sizeRadio     = panel.querySelector( `input[name="board-size"][value="${boardSize}"]`);
  const trayTypeRadio = panel.querySelector( `input[name="tray-type"][value="${trayType}"]`);
  const initPosRadio  = panel.querySelector( `input[name="initial-pos"][value="${initialPos}"]`);

  if(sizeRadio) sizeRadio.checked = true;
  if(trayTypeRadio) trayTypeRadio.checked = true;
  if(initPosRadio) initPosRadio.checked = true;
}
// Seampoint: more global functions...

// --- Helpers ---
function assembleLine(entry) {
  const { action } = entry;

  if(action === "makeBoard") {
    const { action, boardSize, trayType, initialPos } = entry;
  
    const sizeCol = `${boardSize}`.padEnd(8);
    const typeCol = `${trayType}`.padEnd(7);
    const posCol = `${initialPos}`.padEnd(4);
    const line = `${sizeCol} ${typeCol} ${posCol}`;

    return line;
  }
  else if(action === "lock") {
    const { action, boardSize, trayType, initialPos, pieceList } = entry;

    const White = pieceList.white;
    const Black = pieceList.black;
    const wPieceCol = pieceList.white.pieces.length;
    const wPawnCol  = pieceList.white.pawns.length;
    const bPieceCol = pieceList.black.pieces.length;
    const bPawnCol  = pieceList.black.pawns.length;
    const line = `W:[${wPieceCol}],[${wPawnCol}] - B[${bPieceCol}],[${bPawnCol}]`;

    return line;
  }
  else {
    throw new Error(`Unknown setup action: ${action}.`);
  }
}

// Seampoint: more local functions...

