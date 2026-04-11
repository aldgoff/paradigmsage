// view.js
// Jargon: DOM: Document Object Model.

// --- Load JSON ---
import panelData from "./view.json" assert { type: "json" };
  const panel = panelData.panel_module;
  const threeDCanvas = panel.threeDCanvas;    // 3D canvas, fixed, background.
  const gamePanel   = panel.gamePanel;        // 2D canvi, floating, draggable.
  const cameraPanel = panel.cameraPanel;
  const trayPanel   = panel.trayPanel;
  const movePanel   = panel.movePanel;
  const gambitPanel = panel.gambitPanel;
// Seampoint: more json objects...

const callBacks = { // Array of event functions located in control.js
  "game": null,
  "camera": null,
  "tray": null,
  "move": null,
  "gambit": null
  // Seampoint - reserve space for additional event functions...
};

export function registerCallback(panel, fn) { // panel: game, camera, tray, move, gambit...
  callBacks[panel] = fn;
}

export function testCallbacks() { // To be replaced with button events.
  console.log("view.testCallbacks()");

  callBacks["game"]("Undo");
  callBacks["camera"]("Redo");
  callBacks["tray"]("Undo");
  callBacks["move"]("Redo");
  callBacks["gambit"]("Undo");
}

