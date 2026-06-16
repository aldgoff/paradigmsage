/* File: panels.js
  Path: ./3dc/panels/panels.js
  Purpose: Arch discipline, reduce touch points to add/delete a panel.
  Author: Allan Goff
  Date: 5/09/26
  Recommended access: import * as panels from "../../panels/panels.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import panelsData from "./panels.json" assert { type: "json" };
  const panelsModule = panelsData.panels_module;
  const panels = panelsModule.panels;
  const help   = panelsModule.help;
  const setupText       = help.setupText;
  const moveText        = help.moveText;
  const gambitText      = help.gambitText;
  const advsqText       = help.advsqText;
  const gameText        = help.gameText;
  const cameraText      = help.cameraText;
  const compassText     = help.compassText;
  const viewerText      = help.viewerText;
  const diagnosticsText = help.diagnosticsText;
  // Seampoint - another panel.
// Seampoint: more objects...

// --- Dependencies ---
  import * as setup     from "../controller/setup/setup.js";
  import * as moves     from "../controller/moves/moves.js";
  import * as gambits   from "../controller/gambits/gambits.js";
  import * as advsqs    from "../controller/advsqs/advsqs.js";
  import * as compasses from "../controller/compasses/compasses.js";

  import * as game      from "../controller/game/game.js";

  import * as camera    from "../controller/camera/camera.js";
  import * as viewer    from "../controller/viewer/viewer.js";
// Seampoint: more imports...

// --- Globals ---
  const dispatchers = {
    setup,
    move:    moves,
    gambit:  gambits,
    advsq:   advsqs,
    compass: compasses,
    game,
    camera,
    viewer,
    // Seampoint - another panel.
  };

  let activeDrag = null;
  let topZ = 100;

  window.addEventListener("pointermove", (e) => {
    if (!activeDrag) return;

    const { element, offsetX, offsetY } = activeDrag;

    element.style.left = `${e.pageX - offsetX}px`;
    element.style.top  = `${e.pageY - offsetY}px`;
    });

  window.addEventListener("pointerup", () => {
    activeDrag = null;
    });

  document.addEventListener("click", event => {
    if(event.target.matches(".help-btn")) {
      const btn = event.target;
      const key = btn.dataset.help;

      const popup = document.getElementById("help-popup");

      document.getElementById("help-title").textContent = helpText[key].title;
      document.getElementById("help-body").textContent = helpText[key].body;

      const rect = btn.getBoundingClientRect();

      popup.style.left = `${rect.right + 10}px`;
      popup.style.top  = `${rect.top}px`;

      popup.hidden = false;
    }
    });    

  const helpText = {
    setup:   setupText,
    move:    moveText,
    gambit:  gambitText,
    advsq:   advsqText,
    game:    gameText,
    camera:  cameraText,
    compass: compassText,
    viewer:  viewerText,
    diagnostics: diagnosticsText,
    // Seampoint - another panel.
  };
// Seampoint: more globals...

// --- UI ---
export function init() {
  console.log("panel: panels.js - init()");

  for(const panel of panels) {
    const domName = `${panel}-window`;
    const panelEl = document.getElementById(domName);

    const module = dispatchers[panel];

    if(panelEl) {
      makeDraggable(panelEl);
      if(module)
        wirePanel(panelEl, module, panel);
    }
  }
  // console.log(dispatchers); // Keep for now, future me needs to see control flow.

  window.addEventListener("keydown", handleAdvsqKeys);

  document.getElementById("help-close")
    .addEventListener("click", () => {

      document.getElementById("help-popup").hidden = true;
  });

  makeHelpPopupDraggable();

  return;
  }

export function enableButton(action, enabled=true) {
  const button = document.querySelector(`[data-action="${action}"]`);

  if(button)
    button.disabled = !enabled;
}
// Seampoint: more global functions...

// --- Helpers ---
function makeDraggable(element) {
  element.addEventListener("pointerdown", (e) => {
    if (["BUTTON", "TEXTAREA", "INPUT"].includes(e.target.tagName)) return;

    const rect = element.getBoundingClientRect();
    const elemX = rect.left + window.scrollX;
    const elemY = rect.top  + window.scrollY;

    activeDrag = {
      element,
      offsetX: e.pageX - elemX,
      offsetY: e.pageY - elemY
    };

    element.style.zIndex = ++topZ;
  });
  }

function wirePanel(panelEl, module, panel) {  // data-action means command; no data-action means parameter (DOM in play.md).
  const dispatch = module.panelDispatch;
  const build    = module.buildPayload;

  if (!panelEl || !dispatch) return;

  // --- CHANGE ---
  panelEl.addEventListener("change", (e) => {
    const radio = e.target.closest('input[type="radio"]');

    // --- RADIO: restore original contract ---
    if (radio && radio.dataset.action) {
      const action = radio.dataset.action;

      // Skip if module does not support this action
      if (!build) return;

      // Only dispatch if builder produces a VALID action for module
      const payload = build(panelEl, action);

      // Reject non-command actions (like "Player")
      if (!payload || payload.action !== action) return;

      // Hard guard: only dispatch if module handles it
      try {
        dispatch(payload);
      } catch {
        console.warn("Invalid panel action:", payload.action);
      }

      return;
    }

    // --- GENERIC CHANGE: only for param panels ---
    if (!build) return;

    // Skip updateParam for action-only panels (moves, game)
    const actionOnlyPanels = ["move", "game"];

    const moduleName = panel;

    if (actionOnlyPanels.includes(moduleName)) return;

    dispatch(build(panelEl, "updateParam"));
  });

  // --- CLICK ---
  panelEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    if (!action) return;

    const payload = build
      ? build(panelEl, action)
      : { action };

    dispatch(payload);
  });
  }

function handleAdvsqKeys(e) {
  // console.log("KEY EVENT", e.key);

  if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

  const cb = dispatchers.advsq?.panelDispatch;
  if (!cb) return;

  let axis = null;
  let delta = 0;

  const shift = e.shiftKey;

  switch (e.key.toLowerCase()) {
    case "k": axis = "z"; delta = shift ? -1 : +1; break;
    case "i": axis = "x"; delta = shift ? -1 : +1; break;
    case "j": axis = "y"; delta = shift ? -1 : +1; break;
    default: return;
  }

  e.preventDefault(); // <-- ALSO IMPORTANT

  cb({
    action: "nudgeSrc",
    axis,
    delta
  });
  }

function makeHelpPopupDraggable() {
  const popup  = document.getElementById("help-popup");
  const header = document.getElementById("help-header");

  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  header.addEventListener("mousedown", event => {
    dragging = true;

    offsetX = event.clientX - popup.offsetLeft;
    offsetY = event.clientY - popup.offsetTop;
  });

  document.addEventListener("mousemove", event => {
    if(!dragging) return;

    popup.style.left = `${event.clientX - offsetX}px`;
    popup.style.top  = `${event.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
  });
}
// Seampoint: more local functions...

