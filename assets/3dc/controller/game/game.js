/* File: game.js
  Path: ./3dc/game/game.js
  Purpose: Game control: undo/redo, rewind/FF, load/save.
  Author: Allan Goff
  Date: 4/22/26
  Recommended access: import * as cGame from "../../controller/game/game.js";
  UI: the export functions.
*/

// --- Load JSON ---
import gameData from "./game.json" assert { type: "json" };
  const gameModule = gameData.game_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as cSetup      from "../../controller/setup/setup.js";
  import * as cGambits    from "../../controller/gambits/gambits.js";
  import * as cSelections from "../../controller/selections/selections.js";

  import * as state    from "../../model/state/state.js";

  import * as vAdvsqs  from "../../view/advsqs/advsqs.js";
  import * as vGambits from "../../view/gambits/gambits.js";
  import * as vMoves   from "../../view/moves/moves.js";
  import * as vSetup   from "../../view/setup/setup.js";
  import * as vBoards  from "../../view/boards/boards.js";
// Seampoint: more imports...

// --- UI ---
export function panelDispatch(payload) {
  // console.log("cntrl: game.js - panelDispatch(payload):", payload);

  vGambits.cancelAnimation();

  const { action } = payload;
  switch (action) {
    case "undo":    handleUndo(); break;
    case "redo":    handleRedo(); break;
    case "rewind":  handleRewind(); break;
    case "forward": handleFastForward(); break;
    case "load":    handleLoad(); break;
    case "save":    handleSave(); break;
    default: throw new Error(`Unknown game action ${action}.`);  break;
  }
  }

export function buildPayload(panel, action) {
  console.log("     ---------- cntrl: game.js");
  return { action };
  }

export function showUndoStatus() {  // Show undo buffers in Game panel.
  console.log("cntrl: game.js - showUndoStatus():");

  const panel = document.getElementById("undo-state");
  if (!panel) return;

  const keys = state.getStateKeys();
  const undo = state.getIndices();

  const text = keys
    .map((key) => {
      const i   = undo[key];
      const max = state.getBufferLength(key);
      return `${key.padEnd(7)} ${i}/${max}`;
    })
    .join("\n");

  panel.textContent = text;
}
// Seampoint: more global functions...

// --- Handle Functions ---
function handleUndo() {
  const reverseKeys = [...state.getStateKeys()].reverse();
  let bottom = true;

  for(const key of reverseKeys) {
    const idx = state.getCurrentIndex(key);
    if(idx === 0) continue;
    bottom = false;

    if(processUndoBuffer(key, idx)) {
      break;
    }
  }
  showUndoStatus();
  assertStateConsistency();

  if(bottom) { console.log("Bottom Sentry"); }
  }

function handleRedo() {
  let buffer = state.getCurrBuffer();

  if (buffer === null) {
    buffer = state.getNextBuffer();
    if (!buffer) return console.log("Top Sentry");
  }

  const idx = state.getCurrentIndex(buffer);
  const len = state.getBufferLength(buffer);

  if (idx < len) {
    processRedoBuffer(buffer, idx);
  } else {
    buffer = state.getNextBuffer();
    if (!buffer) return console.log("Top Sentry");
    processRedoBuffer(buffer, 0);
  }

  showUndoStatus();
  assertStateConsistency();
  }

function handleRewind() {
  const keys = state.getStateKeys();
  let buffer = state.getCurrBuffer();

  if(buffer === null) { // Bottom Sentry.
    return console.log("Bottom Sentry");
  }

  for(let attempt = 0; attempt < keys.length; attempt++) {  // Rewind until next breakpoint.
    const idx = state.getCurrentIndex(buffer);
    const len = state.getBufferLength(buffer);
  
    if(     isEmpty(len)) {           // crossDown;
      buffer = state.getPrevBuffer();
      if(!buffer) return console.log("Bottom Sentry");
      const N = state.getBufferLength(buffer);
      processUndoBuffer(buffer, N);
      break;
      }
    else if(canCollapseDown(idx)) {   // collapseDown;
      rewindCurrentBuffer(buffer);
      break;
      }
    else if(canStepDown(idx)) {       // stepDown;
      processUndoBuffer(buffer, idx);
      break;
      }
    else if(canCrossDown(idx)) {      // crossDown;
      buffer = state.getPrevBuffer();
      if(!buffer) return console.log("Bottom Sentry");
      const N = state.getBufferLength(buffer);
      processUndoBuffer(buffer, N);
      break;
      }
    else {
      throw new Error("Impossible rewind state.");
    }
  }

  showUndoStatus();
  assertStateConsistency();
  }

function handleFastForward() {
  const keys = state.getStateKeys();
  let buffer = state.getCurrBuffer();  // Can be null if all indexes are zero.

  if(buffer === null) {  // If nothing active, start at first non-empty buffer.
    buffer = state.getNextBuffer();
    if(!buffer) return console.log("Top Sentry");
  }

  for(let attempt = 0; attempt < keys.length; attempt++) {
    const idx = state.getCurrentIndex(buffer);
    const len = state.getBufferLength(buffer);

    if(   isEmpty(len)) {               // crossUp;
      buffer = state.getNextBuffer();
      if (!buffer) return console.log("Top Sentry");
      processRedoBuffer(buffer, 0);
      break;
      }
    else if(canStepUp(idx, len)) {      // stepUp;
      processRedoBuffer(buffer, idx);
      break;
      }
    else if(canCollapseUp(idx, len)) {  // collapseUp;
      fastForwardCurrentBuffer(buffer);
      break;
      }
    else if(canCrossUp(idx, len)) {     // crossUp;
      buffer = state.getNextBuffer();
      if (!buffer) return console.log("Top Sentry");
      processRedoBuffer(buffer, 0);
      break;
      }
    else {
      throw new Error("Impossible FF state.");
    }
  }

  showUndoStatus();
  assertStateConsistency();
  }

async function handleLoad() {
  console.log("cntrl: game.js - handleLoad()");

  hardReset();

  try {
    const text = await navigator.clipboard.readText();
    const newState = JSON.parse(text);

    state.setNull();      // Reset state completely.

    // --- Clear panels before repopulating ---
    const moveEl = document.getElementById("move-list");
    if (moveEl) moveEl.innerHTML = "";

    const gambitEl = document.getElementById("gambit-list");
    if (gambitEl) gambitEl.innerHTML = "";

    for(const key of state.getStateKeys()) {   // Load all buffers (no rendering).
      const entries = newState[key] || [];

      for(const entry of entries) {
        state.pushNewState(key, entry);
        if(key === "Moves") {
          vMoves.pushPanelLine(entry);
        }
        else if(key === "Gambits") {
          vGambits.pushPanelLine(entry);
        }
      }

      state.setBufferIndex(key, 0); // Reset all indexes to 0.
    }

    // vSetup.refreshPanel(setup);
    vMoves.refreshPanel();
    vGambits.refreshPanel();
    vAdvsqs.clearAdvsqPanelParams("KR4,4");

    showUndoStatus(); // Good visual indicator of successful load.
  } catch (err) {
    console.error("Load failed:", err);
  }
  }

function handleSave() {
  console.log("cntrl: game.js - handleSave()");

  diagnostic(true);
  
  const stateStr = JSON.stringify(state.getState());  // One long single string.
  console.log(stateStr);
  
  const stateString = JSON.stringify(state.getState(), null, 2);  // Pretty print with 2 space idents.
  navigator.clipboard.writeText(stateString)
    .then(() => {
      console.log("State copied to clipboard");
    })
    .catch(err => {
      console.error("Clipboard write failed:", err);
    });
  }
// Seampoint: more handle functions...

// --- Helpers ---
function isEmpty(len) { return len === 0; }

function canCollapseDown(idx)     { return idx > 1; }
function canStepDown(idx)         { return idx === 1; }
function canCrossDown(idx)        { return idx === 0; }

function canCollapseUp(idx, len)  { return 0 < idx && idx < len; }
function canStepUp(idx, len)      { return idx === 0 && len > 0; }
function canCrossUp(idx, len)     { return idx === len; }

/* ----- ----- ----- ----- */

function rewindCurrentBuffer(buffer) {
  console.log("cntrl: game.js - rewindCurrentBuffer(buffer):", buffer);

  const idx = state.getCurrentIndex(buffer);

  if(     buffer === "Setup") {
    cSetup.clearAllTileSelections();
    cSetup.clearAllPieceSelections();
    cSetup.returnAllPiecesToHomeTray();

    state.setBufferIndex("Setup", 1);
    const entries = state.getState().Setup;
    vSetup.refreshPanel(entries[0]);
    }
  else if(buffer === "AdvSqs") {  // Snapshot buffer.
    const first = state.getState().AdvSqs[0];

    vAdvsqs.removeFromScene();
    vAdvsqs.render(first);
    vAdvsqs.refreshPanel(first);

    state.setBufferIndex("AdvSqs", 1);
    }
  else if(buffer === "Moves") {
    while (state.getCurrentIndex("Moves") > 1) {
      const idx = state.getCurrentIndex("Moves");
      if (!processUndoBuffer("Moves", idx)) break;
    }
    }
  else if(buffer === "Gambits") {
    while (state.getCurrentIndex("Gambits") > 1) {
      const idx = state.getCurrentIndex("Gambits");
      if (!processUndoBuffer("Gambits", idx)) break;
    }
    }
  else {
    throw new Error(`Unknown buffer ${buffer}.`);
  }
  }

function fastForwardCurrentBuffer(buffer) {
  console.log("cntrl: game.js - fastForwardCurrentBuffer(buffer):", buffer);

  const len = state.getBufferLength(buffer);

  if(     buffer === "Setup") {
    while(state.getCurrentIndex("Setup") < len) {
      const idx = state.getCurrentIndex("Setup");
      if(!processRedoBuffer("Setup", idx)) 
        break;
    }

    state.setBufferIndex("Setup", len);
    const entries = state.getState().Setup;
    vSetup.refreshPanel(entries[len-1]);
    }
  else if(buffer === "AdvSqs") {  // Snapshot buffer.
    const last = state.getState().AdvSqs[len - 1];

    vAdvsqs.removeFromScene();
    vAdvsqs.render(last);
    vAdvsqs.refreshPanel(last);

    state.setBufferIndex("AdvSqs", len);
    }

  else if(buffer === "Moves") {
    while (state.getCurrentIndex("Moves") < len) {
      const idx = state.getCurrentIndex("Moves");
      if (!processRedoBuffer("Moves", idx)) break;
    }

    vMoves.refreshPanel();
    state.setBufferIndex("Moves", len);
    }
  else if(buffer === "Gambits") {
    while (state.getCurrentIndex("Gambits") < len) {
      const idx = state.getCurrentIndex("Gambits");
      if (!processRedoBuffer("Gambits", idx)) break;
    }    

    vGambits.refreshPanel();
    state.setBufferIndex("Gambits", len);
    }
  else {
    throw new Error(`Unknown buffer ${buffer}`);
  }
  }

function processUndoBuffer(key, idx) {
  console.log("cntrl: game.js - processUndoBuffer(key, idx):", key, idx);

  if(     key === "AdvSqs") {
    const prev = state.fetchPrevState("AdvSqs");
    const curr = state.fetchCurrentState("AdvSqs");

    if(     prev === null && curr === null) {
      }
    else if(prev === null && curr !=  null) {
      vAdvsqs.removeFromScene();       // Clear current advsq.
      vAdvsqs.clearAdvsqPanelParams("Q4,4");
      state.setBufferIndex("AdvSqs", idx-1);
      return true;
      }
    else if(prev !=  null && curr === null) {
      vAdvsqs.render(prev);      // Render previous advsq.
      vAdvsqs.refreshPanel(prev);
      state.setBufferIndex("AdvSqs", idx-1);
      return true;
      }
    else if(prev !=  null && curr !=  null) {
      vAdvsqs.removeFromScene();       // Clear current advsq.
      vAdvsqs.render(prev);      // Render previous advsq.
      vAdvsqs.refreshPanel(prev);
      state.setBufferIndex("AdvSqs", idx-1);
      return true;
    }
    }
  else if(key === "Gambits") {
    const gambit = state.fetchCurrentState("Gambits");
    if (gambit != null) {
      // vGambits.undo(gambit);
      state.setBufferIndex("Gambits", idx - 1); // Update from state.
      cGambits.rerunGambits();                  // Rebuild from state.
      vGambits.refreshPanel();
      return true;
    }
  }
  else if(key === "Moves") {
    const move = state.fetchCurrentState("Moves");
    if(move != null) {
      vMoves.undo(move);
      state.setBufferIndex("Moves", idx-1);
      vMoves.refreshPanel();
      return true;
    }
    }
  else if(key === "Setup") {
    state.setBufferIndex("Setup", idx-1);

    cSetup.clearAllTileSelections();
    cSetup.clearAllPieceSelections();
    cSetup.returnAllPiecesToHomeTray();
    cSetup.rebuildToIndex(state.getCurrentIndex("Setup"));

    return true;
    }
  else {  // Unreachable.
    throw new Error(`Unknown or missing key in undo ${key}`);
  }
  }

function processRedoBuffer(key, idx) {
  console.log("cntrl: game.js - processRedoBuffer(key, idx):", key, idx);

  if(     key === "AdvSqs") {
    const curr = state.fetchCurrentState("AdvSqs");
    const next = state.fetchNextState("AdvSqs");

    if(     curr === null && next === null) {
      }
    else if(curr === null && next != null) {
      vAdvsqs.render(next);      // Render first advsq.
      vAdvsqs.refreshPanel(next);
      state.setBufferIndex("AdvSqs", idx + 1);
      return true;
      }
    else if(curr != null && next === null) {
      vAdvsqs.refreshPanel(curr); // At top, nothing new to render.
      }
    else if(curr != null && next != null) {
      vAdvsqs.removeFromScene();       // Clear current advsq.
      vAdvsqs.render(next);      // Render next advsq.
      vAdvsqs.refreshPanel(next);
      state.setBufferIndex("AdvSqs", idx + 1);
      return true;
    }
    }
  else if(key === "Gambits") {
    const gambit = state.fetchNextState("Gambits");
    if (gambit != null) {
      state.setBufferIndex("Gambits", idx + 1); // Update from state.
      cGambits.rerunGambits();                  // Rebuild from state.
      // vGambits.redo(gambit);
      vGambits.refreshPanel();
      return true;
    }
  }
  else if(key === "Moves") {
    const move = state.fetchNextState("Moves");
    if(move != null) {
      state.setBufferIndex("Moves", idx + 1);
      vMoves.redo(move);
      vMoves.refreshPanel();
      return true;
    }
    }
  else if(key === "Setup") {
    state.setBufferIndex("Setup", idx + 1);

    cSetup.rebuildToIndex(state.getCurrentIndex("Setup"));

    return true;
    }
  else {
    throw new Error(`Unknown or missing key in redo ${key}`);
  }
}

function diagnostic(enabled=false) {
  // console.log("cntrl: game.js - diagnostic(enabled=false):", enabled);

  if(!enabled) return;

  const bufferList = [ "Setup", "Moves", "Gambits", "AdvSqs"];

  for(const buffer of bufferList) {
    console.log("  ", buffer, state.getState()[buffer]);
  }

  for(const buffer of bufferList) {
    const idx = state.getIndices()[buffer]; 
    const currEntry = state.fetchCurrentState(buffer);
    console.log("  ", idx, currEntry);
  }
  }

function assertStateConsistency() {
  // console.log("cntrl: game.js - assertStateConsistency():");

  for (const key of state.getStateKeys()) {
    const i = state.getCurrentIndex(key);
    const len = state.getBufferLength(key);

    if (!Number.isFinite(i)) {
      console.error("Index not finite (NaN/Inf)", key, i);
      continue;
    }

    if (i < 0 || i > len) {
      console.error("Index out of bounds", key, i, len);
    }
  }
}

function hardReset() {
  // console.log("cntrl: game.js - hardReset():");

  // --- View ---
  vAdvsqs.removeFromScene();
  vGambits.clearGambits();
  vMoves.clearMoves?.();
  vBoards.clearBoard();

  // --- Derived / caches ---
  cGambits.reset?.();

  // --- Model ---
  state.setState({
    Setup: [],
    Moves: [],
    Gambits: [],
    AdvSqs: []
  });

  for (const key of state.getStateKeys()) {
    state.setBufferIndex(key, 0);
  }
}
// Seampoint: more local functions...

/* TODO: QC checklist✅ 
    1. Load/Save fails to make board.
    2. Still have gambit issues.
    3. Undo from play throws an error.
 */

