/* File: setup.js
  Path: ./3dc/view/setup/setup.js
  Purpose: desc
  Author: Allan Goff
  Date: 5/03/26
  Recommended access: import * as setup from ../../view/setup/setup.js
  UI: the export functions.
*/

// --- Load JSON ---
import setupData from "./setup.json" assert { type: "json" };
  const setupModule = setupData.setup_module;
  // const category  = setupModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as planes from "../../geometry/planes/planes.js";
  import * as quads  from "../../geometry/quads/quads.js";

  import * as vBoards from "../../view/boards/boards.js"
  import * as vTrays  from "../../view/trays/trays.js"
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
  // TODO: write refreshPanel(entry).
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
// Seampoint: more local functions...

