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
  import * as panels      from "../../panels/panels.js";

  import * as cSelects from "../../controller/selections/selections.js";
  import * as cSetup   from "../../controller/setup/setup.js";
  import * as cMoves   from "../../controller/moves/moves.js";
  import * as cGambits from "../../controller/gambits/gambits.js";

  import * as state    from "../../model/state/state.js";
  import * as mAdvsqs  from "../../model/advsqs/advsqs.js";
  import * as mGambits from "../../model/gambits/gambits.js";
  import * as mMoves   from "../../model/moves/moves.js";
  import * as mSetup   from "../../model/setup/setup.js";
  import * as mPieces  from "../../model/pieces/pieces.js";
  import * as mTrays   from "../../model/trays/trays.js";
  import * as mBoards  from "../../model/boards/boards.js";

  import * as view     from "../../view/view.js";
  import * as vAdvsqs  from "../../view/advsqs/advsqs.js";
  import * as vGambits from "../../view/gambits/gambits.js";
  import * as vMoves   from "../../view/moves/moves.js";
  import * as vSetup   from "../../view/setup/setup.js";
  import * as vBoards  from "../../view/boards/boards.js";
// Seampoint: more imports...

// --- Globals ---
// Seampoint: more globals...

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

  // No input panel fields.

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
    const edge = 0;
    if(idx === edge) continue;
    bottom = false;

    if(processUndoBuffer(key, idx)) break;
  }
  showUndoStatus();
  assertStateConsistency();

  if(bottom) { console.log("Bottom Sentry"); }
  }

function handleRedo() {
  const forwardKeys = state.getStateKeys();
  let top = true;

  for(const key of forwardKeys) {
    const idx = state.getCurrentIndex(key);
    const edge = state.getBufferLength(key);
    if(idx === edge) continue;
    top = false;

    if(processRedoBuffer(key, idx)) break;
  }
  showUndoStatus();
  assertStateConsistency();

  if(top) { console.log("Top Sentry"); }
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
      const edge = state.getBufferLength(buffer);
      processUndoBuffer(buffer, edge);
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
      const edge = state.getBufferLength(buffer);
      processUndoBuffer(buffer, edge);
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

    if(     isEmpty(len)) {             // crossUp;
      buffer = state.getNextBuffer();
      if (!buffer) return console.log("Top Sentry");
      const edge = 0;
      processRedoBuffer(buffer, edge);
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
      const edge = 0;
      processRedoBuffer(buffer, edge);
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
    const setupEl = document.getElementById("setup-list");
    if(setupEl) setupEl.innerHTML = "";

    const moveEl = document.getElementById("move-list");
    if(moveEl) moveEl.innerHTML = "";

    const gambitEl = document.getElementById("gambit-list");
    if(gambitEl) gambitEl.innerHTML = "";

    for(const key of state.getStateKeys()) {   // Load all buffers (no rendering).
      const entries = newState[key] || [];

      for(const entry of entries) {
        state.pushNewState(key, entry);
        if(     key === "Setup")   { vSetup.pushPanelLine(entry); }
        else if(key === "Moves")   { vMoves.pushPanelLine(entry); }
        else if(key === "Gambits") { 
          const line  = cGambits.convertEntryToLine(entry)
          vGambits.pushPanelLine(line);
        }
        else if(key === "AdvSqs")  { /* Has no scroll list. */ }
        else  { throw new Error(`Unknown entry key ${key}.`); }
      }

      state.setBufferIndex(key, 0); // Reset all indexes to 0.
    }

    vSetup.refreshEntry(null);        // Reset panels.
    vMoves.refreshEntry(null);
    vGambits.refreshEntry(null);
    vAdvsqs.refreshEntry(null);

    mPieces.clearPieceState();        // Reset occupancies.
    mTrays.clearTrays();
    mSetup.buttonAffordances("makeBoard");
    mMoves.buttonAffordances("off");
    mGambits.buttonAffordances("off");
    mAdvsqs.buttonAffordances("default");
    panels.diagnostics();

    showUndoStatus();                 // Visual indicator of successful load.
  } catch (err) {
    console.error("Load failed:", err);
  }
  }

function handleSave() {
  console.log("cntrl: game.js - handleSave()");

  undoBufferDiagnostic(true);
  
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

  if(     buffer === "AdvSqs") {  // Snapshot buffer.
    const first = state.getState().AdvSqs[0];
    vAdvsqs.removeFromScene();
    vAdvsqs.render(first);

    state.setBufferIndex("AdvSqs", 1);
    vAdvsqs.refreshPanel(first);
    }
  else if(buffer === "Gambits") {
    const first = state.getState().Gambits[0];
    while (state.getCurrentIndex("Gambits") > 1) {
      const idx = state.getCurrentIndex("Gambits");
      if (!processUndoBuffer("Gambits", idx)) break;
    }

    state.setBufferIndex("Gambits", 1);
    vGambits.refreshPanel(first);
    }
  else if(buffer === "Moves") {
    const first = state.getState().Moves[0];
    while (state.getCurrentIndex("Moves") > 1) {
      const idx = state.getCurrentIndex("Moves");
      if (!processUndoBuffer("Moves", idx)) break;
    }

    state.setBufferIndex("Moves", 1);
    vMoves.refreshPanel(first);
    }
  else if(buffer === "Setup") {
    const first = state.getState().Setup[0];
    while(state.getCurrentIndex("Setup") > 1) {
      const idx = state.getCurrentIndex("Setup");
      if(!processUndoBuffer("Setup", idx)) 
        break;
    }

    state.setBufferIndex("Setup", 1);
    vSetup.refreshPanel(first);
    }
  else {  // Unreachable.
    throw new Error(`Unknown or missing buffer ${buffer} in rewind.`);
  }
  }

function fastForwardCurrentBuffer(buffer) {
  console.log("cntrl: game.js - fastForwardCurrentBuffer(buffer):", buffer);

  const len = state.getBufferLength(buffer);

  if(     buffer === "Setup") {
    const last = state.getState().Setup[len - 1];
    while(state.getCurrentIndex("Setup") < len) {
      const idx = state.getCurrentIndex("Setup");
      if(!processRedoBuffer("Setup", idx)) 
        break;
    }

    state.setBufferIndex("Setup", len);
    vSetup.refreshPanel(last);
    }
  else if(buffer === "Moves") {
    const last = state.getState().Moves[len - 1];
    while (state.getCurrentIndex("Moves") < len) {
      const idx = state.getCurrentIndex("Moves");
      if (!processRedoBuffer("Moves", idx)) break;
    }

    state.setBufferIndex("Moves", len);
    vMoves.refreshPanel(last);
    }
  else if(buffer === "Gambits") {
    const last = state.getState().Gambits[len - 1];
    while (state.getCurrentIndex("Gambits") < len) {
      const idx = state.getCurrentIndex("Gambits");
      if (!processRedoBuffer("Gambits", idx)) break;
    }    

    state.setBufferIndex("Gambits", len);
    vGambits.refreshPanel(last);
    }
  else if(buffer === "AdvSqs") {  // Snapshot buffer.
    const last = state.getState().AdvSqs[len - 1];
    vAdvsqs.removeFromScene();
    vAdvsqs.render(last);

    state.setBufferIndex("AdvSqs", len);
    vAdvsqs.refreshPanel(last);
    }
  else {  // Unreachable.
    throw new Error(`Unknown or missing buffer ${buffer} in FF>>.`);
  }
  }

function processUndoBuffer(key, idx) {
  console.log("cntrl: game.js - processUndoBuffer(key, idx):", key, idx);

  if(     key === "AdvSqs") {
    const prev = state.fetchPrevState("AdvSqs");
    const curr = state.fetchCurrentState("AdvSqs");

    if(     prev === null && curr === null) {   // Nothing to do.
      }
    else if(prev === null && curr !=  null) {   // Clear first advsq.
      vAdvsqs.removeFromScene();
      vAdvsqs.clearAdvsqPanelParams("Q4,4");
      state.setBufferIndex("AdvSqs", idx-1);
      return true;
      }
    else if(prev !=  null && curr === null) {   // Render previous advsq.
      vAdvsqs.render(prev);
      vAdvsqs.refreshPanel(prev);
      state.setBufferIndex("AdvSqs", idx-1);
      return true;
      }
    else if(prev !=  null && curr !=  null) {   // Clear current, render previous.
      vAdvsqs.removeFromScene(); 
      vAdvsqs.render(prev);
      vAdvsqs.refreshPanel(prev);
      state.setBufferIndex("AdvSqs", idx-1);
      return true;
    }

    cSelects.manageAdvsqButtons();

    }
  else if(key === "Gambits") {
    const entry = state.fetchCurrentState("Gambits");

    if(!entry) {
      console.log("*** No prev gambit.");
      return false;
    }
    state.setBufferIndex("Gambits", idx-1);
    vGambits.undo(entry);
    vGambits.refreshPanel(entry);

    cSelects.manageGambitButtons();

    return true;
    }
  else if(key === "Moves") {
    const entry = state.fetchCurrentState("Moves");

    if(!entry) {
      console.log("*** No prev move.");
      return false;
    }
    state.setBufferIndex("Moves", idx-1);
    cMoves.buildBackward(entry);

    cSetup.clearAllTileSelections();
    cSetup.clearAllPieceSelections();
    
    cSelects.manageMoveButtons();

    return true;
    }
  else if(key === "Setup") {
    const entry = state.fetchCurrentState("Setup");

    if(entry) {
      state.setBufferIndex("Setup", idx-1);
      cSetup.buildBackward(entry);

      cSetup.clearAllTileSelections();
      cSetup.clearAllPieceSelections();
    }

    cSelects.manageSetupButtons();

    return true;
    }
  else {  // Unreachable.
    throw new Error(`Unknown or missing key in undo ${key}.`);
  }
  }

function processRedoBuffer(key, idx) {
  console.log("cntrl: game.js - processRedoBuffer(key, idx):", key, idx);

  if(     key === "Setup") {
    state.setBufferIndex("Setup", idx + 1);

    const entry = state.fetchCurrentState("Setup");
    if(!entry) {
      console.log("*** No next setup.");
      return false;
    }
    cSetup.buildForward(entry);

    cSetup.clearAllTileSelections();
    cSetup.clearAllPieceSelections();
    
    cSelects.manageSetupButtons();

    return true;
    }
  else if(key === "Moves") {
    state.setBufferIndex("Moves", idx + 1);

    const entry = state.fetchCurrentState("Moves");
    if(!entry) {
      console.log("*** No next move.");
      return false;
    }
    cMoves.buildForward(entry);

    cSetup.clearAllTileSelections();
    cSetup.clearAllPieceSelections();
    
    cSelects.manageMoveButtons();

    return true;
    }
  else if(key === "Gambits") {
    state.setBufferIndex("Gambits", idx + 1);

    const entry = state.fetchCurrentState("Gambits");
    if(!entry) {
      console.log("*** No next gambit.");
      return false;
    }

    const group = view.buildAdvSqGroup(entry); // {srcTile: Array(3), quad: 1, perimeter: 0, stride: 0, opacity: 0.5}
    vGambits.getGambitGroups()[entry.gambitId] = group;
    console.log("*** gambitGroups.length", vGambits.getGambitGroups().length);
    group.userData.entry = entry;
    vGambits.render(group, { animate: false });      // Render.

    vGambits.refreshPanel();         
        
    cSelects.manageGambitsButtons();

    return true;
    }
  else if(key === "AdvSqs") {
    const curr = state.fetchCurrentState("AdvSqs");
    const next = state.fetchNextState("AdvSqs");

    if(     curr === null && next === null) {   // Nothing to do.
      }
    else if(curr === null && next !=  null) {   // Render first advsq.
      vAdvsqs.render(next);
      vAdvsqs.refreshPanel(next);
      state.setBufferIndex("AdvSqs", idx + 1);
      return true;
      }
    else if(curr !=  null && next === null) {   // At top, nothing new to render.
      vAdvsqs.refreshPanel(curr);
      }
    else if(curr !=  null && next !=  null) {   // Clear current, render next.
      vAdvsqs.removeFromScene();
      vAdvsqs.render(next);
      vAdvsqs.refreshPanel(next);
      state.setBufferIndex("AdvSqs", idx + 1);
      return true;
    }
        
    cSelects.manageAdvsqButtons();

    }
  else {  // Unreachable.
    throw new Error(`Unknown or missing key in redo ${key}.`);
  }
}

function hardReset() {
  console.log("cntrl: game.js - hardReset():");

  // --- Model Layer ---
  mAdvsqs.reset();
  mGambits.reset();
  mMoves.reset();
  mSetup.reset();

  // --- Derived / caches ---
  // cGambits.reset?.();

  // --- State ---
  state.setState({
    Setup: [],
    Moves: [],
    Gambits: [],
    AdvSqs: []
  });

  console.log("====================");
  }

function undoBufferDiagnostic(enabled=false) {
  // console.log("cntrl: game.js - undoBufferDiagnostic(enabled):", enabled);

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
// Seampoint: more local functions...

/* ✅ TODO: QC checklist
  1. ✅ Load/Save fails to make board.
  2. ✅ Still have gambit issues.
  3. ✅ Undo from play throws an error, play removed.
  4. ✅ Load does not clear the scene.
 */

