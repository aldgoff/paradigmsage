/* File: game.js
  Path: ./3dc/game/game.js
  Purpose: Game control, including undo.
  Author: Allan Goff
  Date: 4/22/26
  Recommended access: import * as game.
  UI: the export functions.
*/

// --- Load JSON ---
import gameData from "./game.json" assert { type: "json" };
  const gameModule = gameData.game_module;
  const category  = gameModule.category;
  // Seampoint: more objects.

// --- Build upon previous layers ---
import * as state  from "../../model/state/state.js";
// Seampoint: more imports.

// --- UI ---
export function panelDispatch(payload) {
  console.log("control: game.js - panelDispatch(payload):", payload);

  const { action } = payload;
  switch (action) {
    case "newGame": handleNewGame(); break;
    case "rerun":   handleRerun(); break;
    case "undo":    handleUndo(); break;
    case "redo":    handleRedo(); break;
    case "load":    handleLoad(); break;
    case "save":    handleSave(); break;
    default: throw new Error(`Unknown game ***action ${action}.`);  break;
  }
  }
// Seampoint: more global functions.

// --- Handle Functions ---
function handleNewGame() {
  console.log("control: game.js - handleNewGame()");
  // TODO: code game.js - handleNewGame().
  }

function handleRerun() {
  console.log("control: game.js - handleNewGame()");
  // TODO: code game.js - handleNewGame().
  }

function handleUndo() {
  console.log("control: game.js - handleRerun()");
  // TODO: code game.js - handleRerun().
  }

function handleRedo() {
  console.log("control: game.js - handleRedo()");
  // TODO: code game.js - handleRedo().
  }

function handleLoad() {
  console.log("control: game.js - handleLoad()");
  // TODO: code game.js - handleLoad().
  }

function handleSave() {
  console.log("control: game.js - handleSave()");
  // TODO: code game.js - handleSave().
  }
// Seampoint: more global functions.

// --- Helpers ---
function showUndoStatus() {
  const el = document.getElementById("undo-state");

  const keys = state.getStateKeys();
  const undo = state.getUndoIndex();

  const text = keys
    .map((key) => {
      const i   = undo[key];
      const max = state.getBufferLength(key);
      return `${key.padEnd(7)} ${i}/${max}`;
    })
    .join("\n");

  el.textContent = text;
}
// Seampoint: more local functions.

