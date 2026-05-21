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
// Seampoint: more imports...

// --- Globals ---
  let lastClickTime = 0;
  let clickTimer = null;
  const DOUBLE_CLICK_MS = 200;
  let Gap = 0;  // TODO: Default value, must match play.md (DOM) value.
  // Seampoint: more globals.

// --- UI ---
export function panelDispatch(payload) {
  console.log("cntrl: viewer.js - panelDispatch(payload)", payload);

  vGambits.cancelAnimation();

  let { action, gap, sep, range, speed } = payload;
  gap   = Number(gap);
  sep   = Number(sep);
  range = Number(range);
  speed = Number(speed);

  Gap = gap;

  switch (action) {
    case "ShowTrays":       handleShowTrays(payload); break;
    case "HideTrays":       handleHideTrays(payload); break;
    case "ToggleAnimation": handleToggleAnimation(payload); break;
    case "updateParam":     handleViewerParams({ gap, sep, range, speed }); break;
    default: throw new Error(`Unknown viewer action ${action} payload ${payload}.`); break;
  }
  }

export function buildPayload(panel, action) { // Not subject to undo.
  console.log("     ---------- cntrl: viewer.js");
  return { 
    action,
    gap:   panel.querySelector('[name="viewer-trayGap"]')?.value,
    sep:   panel.querySelector('[name="viewer-traySep"]')?.value,
    range: panel.querySelector('[name="viewer-range"]')?.value,
    speed: panel.querySelector('[name="viewer-speed"]')?.value,
  };
}

export function getGap() {
  return Gap;
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

  vViewer.showTrays(Gap);
  }

function handleHideTrays(payload) {
  console.log("cntrl: viewer.js - handleHideTrays(payload)", payload);

  vViewer.hideTrays();
  }

function handleToggleAnimation(payload) {
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

function handleViewerParams(params) {
  console.log("cntrl: viewer.js - handleViewerParams(params)", params);

  const { gap, sep, range, speed } = params;

  cameras.setJitter(params.range, params.speed);

  // tray controls
  vViewer.setTrayGap(gap);

  // future
  // vViewer.setTraySep(sep);
}
// Seampoint: more handlers...

// --- Helpers ---
// Seampoint: more local functions...

