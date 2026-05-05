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
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as cGambits from "../../controller/gambits/gambits.js";

  import * as state    from "../../model/state/state.js";

  import * as boards   from "../../view/boards/boards.js";
  import * as vAdvsqs  from "../../view/advsqs/advsqs.js";
  import * as vGambits from "../../view/gambits/gambits.js";
  import * as vMoves   from "../../view/moves/moves.js";
  import * as vSetup   from "../../view/setup/setup.js";
// Seampoint: more imports...

// --- UI ---
export function panelDispatch(payload) {
  // console.log("cntrl: game.js - panelDispatch(payload):", payload);

  vGambits.cancelAnimation();

  const { action } = payload;
  switch (action) {
    case "newGame": handleNewGame(); break;
    case "undo":    handleUndo(); break;
    case "redo":    handleRedo(); break;
    case "rewind":  handleRewind(); break;
    case "forward": handleFastForward(); break;
    case "load":    handleLoad(); break;
    case "save":    handleSave(); break;
    default: throw new Error(`Unknown game ***action ${action}.`);  break;
  }
  }

export function showUndoStatus() {  // Show undo buffers in Game panel.
  // console.log("cntrl: game.js - showUndoStatus():");

  const el = document.getElementById("undo-state");

  const keys = state.getStateKeys();
  const undo = state.getBufferIndex();

  const text = keys
    .map((key) => {
      const i   = undo[key];
      const max = state.getBufferLength(key);
      return `${key.padEnd(7)} ${i}/${max}`;
    })
    .join("\n");

  el.textContent = text;
}
// Seampoint: more global functions...

// --- Handle Functions ---
function handleNewGame() {
  console.log("cntrl: game.js - handleNewGame()");
  // TODO: game.js - handleNewGame().

  console.log(state.getStateKeys());
}

function handleUndo3() {
  const keyIndex = state.prevKeyIndex();  // { arrayKey: key, index: i } - decrements index.

  if(!keyIndex) { // Descended from somewhere in the buffer stack to the bottom senty.
    console.log("Bottom Sentry");
  }
  else {
    const { buffer, idx } = keyIndex;
    if(     buffer === "AdvSqs") {
      } 
    else if(buffer === "Gambits") {
      } 
    else if(buffer === "Moves") {
      const move = state.fetchCurrentState("Moves");
      if(move) {
        vMoves.undo(move);
        vMoves.refreshPanel();
      }
      else { throw new Error("Undo move attempt w/o a move:", move) }
      } 
    else if(buffer === "Setup") {
    }
  }
  showUndoStatus();
  }

function handleRedo3() {
  const keyIndex = state.nextKeyIndex();  // { arrayKey: key, index: i - 1 } - increments index.

  if(!keyIndex) { // Ascended from somewhere in the buffer stack to the top sentry.
    console.log("Top Sentry");
  }
  else {
    const { buffer, idx } = keyIndex;
    if(     buffer === "Setup") {
      }
    else if(buffer === "Moves") {
      const move = state.fetchCurrentState("Moves");
      if(move) {
        vMoves.redo(move);
        vMoves.refreshPanel();
      }
      else { throw new Error("Undo move attempt w/o a move:", move) }
      } 
    else if(buffer === "Gambits") {
      } 
    else if(buffer === "AdvSqs") {
    } 
  }
  showUndoStatus();
}

function handleUndo() {
  const reverseKeys = [...state.getStateKeys()].reverse();
  let bottom = true;

  for(const key of reverseKeys) {
    const idx = state.getCurrentIndex(key);
    const len = state.getBufferLength(key);
    if(idx === 0) continue;
    bottom = false;

    if(     key === "AdvSqs") {
      const prev = state.fetchPrevState("AdvSqs");
      const curr = state.fetchCurrentState("AdvSqs");

      if(     prev === null && curr === null) {
        }
      else if(prev === null && curr !=  null) {
        vAdvsqs.clear(curr);       // Clear current advsq.
        vAdvsqs.clearAdvsqPanelParams("Q4,4");
        state.setBufferIndex("AdvSqs", idx-1);
        break;
        }
      else if(prev !=  null && curr === null) {
        vAdvsqs.render(prev);      // Render previous advsq.
        vAdvsqs.refreshPanel(prev);
        state.setBufferIndex("AdvSqs", idx-1);
        break;
        }
      else if(prev !=  null && curr !=  null) {
        vAdvsqs.clear(curr);       // Clear current advsq.
        vAdvsqs.render(prev);      // Render previous advsq.
        vAdvsqs.refreshPanel(prev);
        state.setBufferIndex("AdvSqs", idx-1);
        break;
      }
      }
    else if(key === "Gambits") {
      const gambit = state.fetchCurrentState("Gambits");
      if(gambit != null) {
        state.setBufferIndex("Gambits", idx-1);
        vGambits.undo(gambit);
        vGambits.refreshPanel();
        break;
      }
      }
    else if(key === "Moves") {
      const move = state.fetchCurrentState("Moves");
      if(move != null) {
        state.setBufferIndex("Moves", idx-1);
        vMoves.undo(move);
        vMoves.refreshPanel();
        break;
      }
      }
    else if(key === "Setup") {
      const prev = state.fetchPrevState("Setup");
      const curr = state.fetchCurrentState("Setup");

      if(     prev === null && curr === null) {
        continue;
        }
      else if(prev === null && curr !=  null) {
        vSetup.clear(curr);       // Clear current setup (board and trays), if any.
        const params = {boardSize: "10x10x10", trayType: "factory", initialPos: "manual"};
        vSetup.clearSetupPanelParams(params)
        state.setBufferIndex("Setup", idx-1);
        }
      else if(prev !=  null && curr === null) {
        vSetup.render(prev);      // Render previous setup (board and trays), if any.
        vSetup.refreshPanel(prev);
        state.setBufferIndex("Setup", idx-1);
        }
      else if(prev !=  null && curr !=  null) {
        vSetup.clear(curr);       // Clear current setup (board and trays).
        vSetup.render(prev);      // Render previous setup (board and trays), if any.
        vSetup.refreshPanel(prev);
        state.setBufferIndex("Setup", idx-1);
      }
      }
    else {  // Unreachable.
      throw new Error("Unknown or missing key in undo", key);
    }
  }
  showUndoStatus();
  assertStateConsistency();

  if(bottom) { console.log("Bottom Sentry"); }
  }

function handleRedo() {
  const keys = state.getStateKeys();
  let top = true;

  for(const key of keys) {
    const idx = state.getCurrentIndex(key);
    const len = state.getBufferLength(key);
    if(idx === len) continue;
    top = false;

    if(     key === "Setup") {
      const curr = state.fetchCurrentState("Setup");
      const next = state.fetchNextState("Setup");

      if(     curr === null && next === null) { // No boards or trays in load at all.
        continue;
        }
      else if(curr === null && next != null) {  // Transition to first board.
        vSetup.render(next);
        state.setBufferIndex("Setup", idx+1);
        vSetup.refreshPanel(next);
        }
      else if(curr != null && next === null) {  // At top of Setup buffer.
        vSetup.refreshPanel(curr);
        }
      else if(curr != null && next != null) {
        vSetup.clear(curr);   // Clear current setup (board and trays).
        vSetup.render(next);  // Render next setup (board and trays).
        state.setBufferIndex("Setup", idx+1);
        vSetup.refreshPanel(next);
      }
      // top = false;
      break;
      }
    else if(key === "Moves") {
      const move = state.fetchNextState("Moves");
      if(move != null) {
        state.setBufferIndex("Moves", idx+1);
        vMoves.redo(move);
        vMoves.refreshPanel();
        // top = false;
        break;
      }
      }
    else if(key === "Gambits") {
      const gambit = state.fetchNextState("Gambits");
      if(gambit != null) {
        state.setBufferIndex("Gambits", idx+1);
        vGambits.redo(gambit);
        vGambits.refreshPanel();
        // top = false;
        break;
      }
      }
    else if(key === "AdvSqs") {
      const curr = state.fetchCurrentState("AdvSqs");
      const next = state.fetchNextState("AdvSqs");

      if(     curr === null && next === null) {
        continue;
        }
      else if(curr === null && next != null) {
        vAdvsqs.render(next);
        state.setBufferIndex("AdvSqs", idx+1);
        vAdvsqs.refreshPanel(next);
        }
      else if(curr != null && next === null) {
        vAdvsqs.refreshPanel(curr);
        }
      else if(curr != null && next != null) {
        vAdvsqs.clear(curr);
        vAdvsqs.render(next);
        state.setBufferIndex("AdvSqs", idx+1);
        vAdvsqs.refreshPanel(next);
      }
      // top = false;
      break;
      // const curr = state.fetchCurrentState("AdvSqs");
      // if(curr != null) {
      //   vSetup.clear(curr);   // Clear current setup (board and trays).
      // }
      // const next = state.fetchNextState("AdvSqs");
      // if(next != null) {
      //   vSetup.render(next);
      //   state.setBufferIndex("AdvSqs", idx+1);
      //   top = false;
      // }
      // vAdvsqs.refreshPanel(next);
      // break;
      }
    else {  // Unreachable.
      throw new Error("Unknown or missing key in redo", key);
    }
  }
  showUndoStatus();
  assertStateConsistency();

  if(top) { console.log("Top Sentry"); }
}

function handleUndo1() {
  const setup  = state.fetchCurrentSetup();
  const move   = state.fetchCurrentMove();
  const gambit = state.fetchCurrentGambit();
  const advsq  = state.fetchCurrentAdvsq();
  
  const keyIndex = state.prevKeyIndex();  // Decrements index.

  if(!keyIndex) { // Edge case, blank canvas, "Bottom Sentry".
    const idx = state.getCurrentIndex("Moves");
    if(idx === 1) {
      const entry = state.fetchCurrentMove();
      if(entry) {
        vMoves.undo(entry);
        vMoves.refreshPanel();
      }
    }
    console.log("Bottom Sentry");

    // TODO: clear other buffers.
    vAdvsqs.clearAdvsq();
    boards.clearBoard();
    showUndoStatus();
    return;
  }

  if(     keyIndex.arrayKey === "AdvSqs") {
    vAdvsqs.clearAdvsq();
    const specs = state.fetchCurrentState("AdvSqs");
    if(specs) {
      vAdvsqs.makeAdvsq(specs);
      vAdvsqs.setAdvsqPanelParams(specs);
    }
    }
  else if(keyIndex.arrayKey === "Gambits") {
    vAdvsqs.clearAdvsq();

    const idx = state.getBufferIndex().Gambits;
    const group = cGambits.getGambitGroup(idx);
    if (group) {
      vGambits.derenderGambit(group);
      vGambits.refreshPanel();
    }
    }
  else if(keyIndex.arrayKey === "Moves") {
    // vAdvsqs.clearAdvsq();
    // vGambits.clearGambits();

    // const entry = state.fetchCurrentMove();

    if(move) {
      vMoves.undo(move);
      vMoves.refreshPanel();
    }
    }
  else if(keyIndex.arrayKey === "Setup") {
    vAdvsqs.clearAdvsq();
    vGambits.clearGambits().
    // clear moves.

    boards.clearBoard();
    const specs = state.fetchCurrentState("Setup");
    console.log("specs", specs);
    if(specs) {
      boards.makeSetup(specs);
    }
    showUndoStatus();  // Show undo status in the panel.
    }
  else { throw new Error("Unknown undo buffer:", keyIndex.arrayKey);
  }

  showUndoStatus();
  }

function handleRedo1() {
  const keyIndex = state.nextKeyIndex();

  if(!keyIndex) {   // Edge case, at latest,= "Top Sentry"
    vMoves.refreshPanel();
    console.log("Top Sentry");
    return;
  }

  if(keyIndex.arrayKey === "Setup") {
    const specs = state.fetchCurrentState("Setup");
    boards.clearBoard(specs);
    if(specs) {
      boards.makeSetup(specs);
    }
    }
  else if(keyIndex.arrayKey === "Moves") {
    // const specs = state.fetchCurrentState("Moves");
    // TODO: clear Moves.

    const move = state.fetchCurrentMove();
    if(move) {
      vMoves.redo(move);
      vMoves.refreshPanel();
    }
    }
  else if(keyIndex.arrayKey === "Gambits") {
    const specs = state.fetchCurrentState("Gambits");
    // TODO: clear Gambits.

    const count = state.getBufferIndex().Gambits;
    const idx = count - 1; // newly active item

    vGambits.refreshPanel();
    const group = cGambits.getGambitGroup(idx);
    if (group) {
      vGambits.renderGambit(group); // Default animation is false.
    }
    }
  else if(keyIndex.arrayKey === "AdvSqs") {
    const specs = state.fetchCurrentState("AdvSqs");
    vAdvsqs.clearAdvsq();
    if(specs) {
      vAdvsqs.makeAdvsq(specs);
      vAdvsqs.setAdvsqPanelParams(specs);
    }
    }
  else { throw new Error("Unknown undo buffer:", keyIndex.arrayKey);
  }

  showUndoStatus();
}

function handleRewind() {
  console.log("cntrl: game.js - handleRewind()");

  const keyIndex = state.collapseKeyIndex();  // Go to first element, if one.

  if (!keyIndex) { // Bottom Sentry
    console.log("Bottom Sentry");
    vMoves.refreshPanel();

    vAdvsqs.clearAdvsq();
    boards.clearBoard();
    showUndoStatus();
    return;
  }

  if (keyIndex.arrayKey === "AdvSqs") {
    vAdvsqs.clearAdvsq();
    const specs = state.fetchCurrentState("AdvSqs");
    if (specs) {
      vAdvsqs.makeAdvsq(specs);
      vAdvsqs.setAdvsqPanelParams(specs);
    }
    }
  else if (keyIndex.arrayKey === "Gambits") {
    vAdvsqs.clearAdvsq();
    state.setBufferIndex("AdvSqs", 0);
    cGambits.rerunGambits();
    }
  else if (keyIndex.arrayKey === "Moves") {
    vMoves.refreshPanel();

    vAdvsqs.clearAdvsq();
    // TODO: clear gambits if implemented
    }
  else if (keyIndex.arrayKey === "Setup") {
    boards.clearBoard();
    const specs = state.fetchCurrentState("Setup");
    if (specs) {
      boards.makeSetup(specs);
    }
    }
  else {
    throw new Error("Unknown rerun buffer:", keyIndex.arrayKey);
  }

  showUndoStatus();  
  }

function handleFastForward() {
  console.log("cntrl: game.js - handleFastForward()");

  const counts = state.getBufferIndex();

  let startKey = null;

  if (counts.AdvSqs > 0) startKey = "AdvSqs";
  else if (counts.Gambits > 0) startKey = "Gambits";
  else if (counts.Moves > 0) startKey = "Moves";
  else if (counts.Setup > 0) startKey = "Setup";

  if (!startKey) return;

  let keyIndex;

  while (true) {
    keyIndex = state.nextKeyIndex();
    if (!keyIndex) break;

    // --- APPLY SAME LOGIC AS handleRedo ---
    if (keyIndex.arrayKey === "Setup") {
      const specs = state.fetchCurrentState("Setup");
      boards.clearBoard();
      if (specs) {
        boards.makeSetup(specs);
        cGambits.rebindOverlaysToBoard();
      }
      // if (specs) boards.makeBoard(specs);
      }
    else if (keyIndex.arrayKey === "Moves") {
      const specs = state.fetchCurrentState("Moves");
      // TODO: fastforward moves.
      vMoves.refreshPanel();
      }
    else if (keyIndex.arrayKey === "Gambits") {
      vGambits.refreshPanel();

      const count = state.getBufferIndex().Gambits;
      const idx = count - 1;

      const group = cGambits.getGambitGroup(idx);
      if (group) {
        vGambits.renderGambit(group);
      }
      }
    else if (keyIndex.arrayKey === "AdvSqs") {
      const specs = state.fetchCurrentState("AdvSqs");
      vAdvsqs.clearAdvsq();
      if (specs) {
        vAdvsqs.makeAdvsq(specs);
        vAdvsqs.setAdvsqPanelParams(specs);
      }
      }

    else {
      throw new Error("Unknown buffer:", keyIndex.arrayKey);
    }

    // --- STOP when we hit next buffer ---
    if (keyIndex.arrayKey !== startKey) break;
  }

  showUndoStatus();
}

async function handleLoad() {
  console.log("cntrl: game.js - handleLoad()");

  try {
    const text = await navigator.clipboard.readText();
    const newState = JSON.parse(text);

    state.setNull();      // Reset state completely.

    for(const key of state.getStateKeys()) {   // Load all buffers (no rendering).
      const entries = newState[key] || [];

      for(const entry of entries) {
        state.pushNewState(key, entry);
        if(key === "Moves") {
          vMoves.addLineToPanel(entry);
        }
        else if(key === "Gambits") {
          vGambits.addLineToPanel(entry);
        }
      }

      state.setBufferIndex(key, 0); // Reset all indexes to 0.
    }

    // vSetup.refreshPanel(setup);
    vMoves.refreshPanel();
    vGambits.refreshPanel();
    // vAdvsqs.refreshPanel(advsq);

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
function diagnostic(enabled=false) {
  if(!enabled) return;

  const bufferList = [ "Setup", "Moves", "Gambits", "AdvSqs"];

  for(const buffer of bufferList) {
    console.log("  ", buffer, state.getState()[buffer]);
  }

  for(const buffer of bufferList) {
    const idx = state.getBufferIndex()[buffer]; 
    const currEntry = state.fetchCurrentState(buffer);
    console.log("  ", idx, currEntry);
  }
}

function assertStateConsistency() {
  for (const key of state.getStateKeys()) {
    const i = state.getCurrentIndex(key);
    const len = state.getBufferLength(key);

    if (i < 0 || i > len) {
      console.error("Index out of bounds", key, i, len);
    }
  }
}
// Seampoint: more local functions...

