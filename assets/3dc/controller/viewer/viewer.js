/* File: viewer.js
  Path: ./3dc/controller/viewer/viewer.js
  Purpose: Adjust elements which affect view: gap, jitter, and level separation.
  Author: Allan Goff
  Date: 4/27/26
  Recommended access: import * as cViewer from "../../controller/viewer/viewer.js";
  UI: the export functions.
*/

// --- Load JSON ---
import viewerData from "./viewer.json" assert { type: "json" };
  const viewerModule = viewerData.viewer_module;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as cameras  from "../../view/render/cameras.js";
  import * as vGambits from "../../view/gambits/gambits.js";
  import * as vViewer  from "../../view/viewer/viewer.js";
  import * as vTrays   from "../../view/trays/trays.js";
  import * as vBoards  from "../../view/boards/boards.js";
  import * as vAdvsqs  from "../../view/advsqs/advsqs.js";
  import * as vPieces  from "../../view/pieces/pieces.js";
// Seampoint: more imports...

// --- Globals ---
  let lastClickTime = 0;
  let clickTimer = null;
  const DOUBLE_CLICK_MS = 200;  // TODO: Belongs in a json file.
  let lastTrayGap  = 0;
  let lastLevelSep = 1.0;
// Seampoint: more globals.

// --- UI ---
export function panelDispatch(payload) {    // Dispatch payload from panel to handle event functions.
  console.log("cntrl: viewer.js - panelDispatch(payload)", payload);

  vGambits.cancelAnimation();

  let { action, trayGap, levelSep, range, speed } = payload;

  switch (action) {
    case "ShowTrays":       handleShowTrays(payload); break;
    case "HideTrays":       handleHideTrays(payload); break;
    case "ToggleAnimation": handleToggleAnimation(payload); break;
    case "updateParam":     handleViewerParams(payload); break;
    
    default: throw new Error(`Unknown viewer action ${action} payload ${payload}.`); break;
  }
  }

export function buildPayload(panel, action) { // Not subject to undo.
  console.log("     ---------- cntrl: viewer.js");

  return { // payload
    action,
    trayGap:  Number(panel.querySelector('[name="viewer-trayGap"]')?.value),
    levelSep: Number(panel.querySelector('[name="viewer-levelSep"]')?.value),
    range:    Number(panel.querySelector('[name="viewer-range"]')?.value),
    speed:    Number(panel.querySelector('[name="viewer-speed"]')?.value),
  };
}

export function getTrayGap(panelId = "viewer-window") {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  return Number(panel.querySelector('[name="viewer-trayGap"]')?.value);
  }

export function getLevelSep(panelId = "viewer-window") {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  return Number(panel.querySelector('[name="viewer-levelSep"]')?.value);
  } 

export function getJitterValues(panelId = "viewer-window") {
  const panel = document.getElementById(panelId);
  if (!panel) return;

  const range = Number(panel.querySelector('[name="viewer-range"]')?.value);
  const speed = Number(panel.querySelector('[name="viewer-speed"]')?.value);

  return { range, speed };
}
// Seampoint: more global functions...

// --- Handle Functions ---
function handleShowTrays(payload) {   // Viewer handlers. Not subject to undo.
  console.log("cntrl: viewer.js - handleShowTrays(payload)", payload);

  const { trayGap, levelSep, range, speed } = payload;

  vTrays.makeTrays(trayGap); // Makes trays anew.
  }

function handleHideTrays(payload) {
  console.log("cntrl: viewer.js - handleHideTrays(payload)", payload);

  const { trayGap, levelSep, range, speed } = payload;

  vTrays.destroyTrays();
  }

function handleToggleAnimation(payload) {
  console.log("cntrl: viewer.js - handleToggleAnimation(payload)", payload);

  const { trayGap, levelSep, range, speed } = payload;

  const now = Date.now();

  // --- DOUBLE CLICK ---
  if (now - lastClickTime < DOUBLE_CLICK_MS) {
    clearTimeout(clickTimer);   // ← CRITICAL FIX
    clickTimer = null;

    cameras.reverseJitter();

    lastClickTime = 0;
    return;
  }

  // --- SINGLE CLICK ---
  lastClickTime = now;

  clickTimer = setTimeout(() => {
    if (cameras.isJitterEnabled()) {
      cameras.stopJitter();
    } else {
      cameras.startJitter();
    }
    clickTimer = null;
  }, DOUBLE_CLICK_MS);
  }

function handleViewerParams(payload) {
  console.log("cntrl: viewer.js - handleViewerParams(payload)", payload);

  const { trayGap, levelSep, range, speed } = payload;

  cameras.setJitter(range, speed);    // Board jitter.

  if(trayGap !== lastTrayGap) {       // Tray Gap
    vTrays.setTrayGap(trayGap);
    lastTrayGap = trayGap;
  }
  if(levelSep !== lastLevelSep) {     // Level sep: trays, boards, advsqs, gambits, pieces.
    vTrays.setLevelSep(levelSep);
    vBoards.setLevelSep(levelSep);
    vAdvsqs.setLevelSep(levelSep);
    vGambits.setLevelSep(levelSep);
    vPieces.setLevelSep(levelSep);

    lastLevelSep = levelSep;
  }
}
// Seampoint: more handlers...

// --- Helpers ---
// Seampoint: more local functions...

