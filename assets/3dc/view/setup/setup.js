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
// Seampoint: more imports...

// --- UI ---
export function render(setup) {
  console.log("view: setup.js - render(setup)", setup);
  // TODO: write render().
  }
  
export function clear(setup) {
  console.log("view: setup.js - clear(setup)", setup);
  // TODO: write clear().
}

export function undo(setup) {
  console.log("view: setup.js - undo(setup)", setup);
  // TODO: write undo().
  }

export function redo(setup) {
  console.log("view: setup.js - redo(setup)", setup);
  // TODO: write redo().
}
  
export function refreshPanel(setup) {
  // TODO: write refreshPanel(setup).
  console.log("view : setup.js - refreshPanel(setup):", setup);

  const panel = document.getElementById("setup-window");
  if(!panel) return;

  const { action, boardSize, trayType, initialPos } = setup;

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

export function clearSetupPanelParams1(params) {
  console.log("view : setup.js - clearSetupPanelParams(params):", params);

  const panel = document.getElementById("setup-window");
  if (!panel) return;

  panel.querySelector('[name="setup-board-size"]').value         = 1;

}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

