/* File: events.js
  Path: ./3dc/controller/events.js
  Purpose: Register functions with the view layer for callbacks.
  Author: Allan Goff
  Date: 4/07/26
  Recommended access: import * as events.
  UI: the export functions.
*/

import * as control  from "../controller/controller.js";

import * as state    from "../model/state/state.js";
import * as coords   from "../foundation/coords/coords.js";
import * as quads    from "../geometry/quads.js";
import * as overlaps from "../geometry/overlapTiles.js";

import * as register from "../view/registerHandlers.js";
import * as boards   from "../view/boards/boards.js";
import * as advsqs   from "../view/advsqs/advsqs.js";

// --- UI ---
export function callbacks() {
  register.setupControlDispatcher(setupPanelDispatch);    // Make board.
  register.trayControlDispatcher(trayPanelDispatch);      // Make tray
  register.gameControlDispatcher(gameButtonDispatch);     // Undo interface.
                                                          // Move panel is display only, no inputs.
  register.gambitControlDispatcher(gambitButtonDispatch); // Build a gambit.
  register.advsqControlDispatcher(advsqPanelDispatch);    // Manipulate an advancement square.

  register.cameraControlDispatcher(cameraPanelDispatch);  // Not subject to the undo arch.
  // Seampoint - register another dispatcher.
}

function setupPanelDispatch(payload) {    // Dispatch payload from panel to handle event functions.
  const { action, boardSize } = payload;
  switch (action) {
    case "makeBoard": handleMakeBoard(boardSize); break;
    default: throw new Error(`Unknown setup action ${action}.`);
  }
  }

function trayPanelDispatch(payload) {
  const { action, trayType } = payload;
  switch (action) {
    case "makeTrays": handleMakeTrays(trayType); break;
    case "showTray": handleShowTray(); break;
    case "hideTray": handleHideTray(); break;
    case "cycleGap": handleCycleGap(); break;
    default: throw new Error(`Unknown tray action ${action}.`);
  }
  }

function gameButtonDispatch(payload) {
  // console.log("gameButtonDispatch()", payload);
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

function gambitButtonDispatch(payload) {
  const { action } = payload;
  switch (action) {
    case "freeze": handleFreeze(); break;
    case "prev": handlePrev(); break;
    case "next": handleNext(); break;
    case "delete": handleDelete(); break;
    case "deselect": handleDeselect(); break;
    default: throw new Error(`Unknown gambit action ${action}.`);  break;
  }
}

function advsqPanelDispatch(payload) {
  const { action, srcTile, quad, perimeter, stride, opacity } = payload;
  console.log("control: events.js - advsqPanelDispatch(payload)", payload);

  switch (action) {
    case "place":       handlePlace(payload); break;
    case "remove":      handleRemove(); break;
    case "updateParam": handleUpdateParam(payload); break;
    case "nudgeSrc":    handleNudgeSrc(payload); break;
    case "nextQuad":    handleNextQuad(payload); break;
    case "nextPlane":   handleNextPlane(payload); break;
    case "nextPiece":   handleNextPiece(payload); break;
    default: throw new Error(`Unknown advsq action ${action}, payload ${JSON.stringify(payload)}.`);
  }
}

function cameraPanelDispatch(payload) { // Not subject to the undo arch.
  const { action, value, offboardOpacity } = payload;

  switch (action) {
    case "ZoomIn":  handleZoomIn(); break;
    case "ZoomOut": handleZoomOut(); break;
    case "Ascend":  handleAscend(); break;
    case "Descend": handleDescend(); break;
    case "SetPOV":  handlePOV(value); break;
    default: throw new Error(`Unknown camera action ${action} value ${value}.`); break;
  }
  // <input type="range" name="offboard-opacity" min="0" max="1" step="0.01" value="0.5"> </label>
}
// Seampoint - more dispatchers...

// Handle event functions.
function handleMakeBoard(boardSize) { // Setup handlers.
  console.log("control: events.js - handleMakeBoard(boardSize):", boardSize);
  const board = boardSize.split("x").map(n => Number(n));
  const newBoard = { "board": board, "play": "off", "trays": "none", "gap": 0, "initialPos": "std" };

  trimStateToUndoIndex();
  state.setup(newBoard);

  captureState();
  }

function handleMakeTrays(trayType) {  // Tray handlers.
  console.log("Tray Make-Tray:", trayType);
  // TODO: change state.
  }

function handleShowTray() {
  console.log("Tray Show:");
  // TODO: change state.
  }

function handleHideTray() {
  console.log("Tray Hide");
  // TODO: change state.
  }

function handleCycleGap() {
  console.log("Tray Cycle-Gap:");
  // TODO: change state.
}
/*** ---------- ---------- ---------- ---------- ***/

function handleNewGame() {            // Game handlers.
  // console.log("Game New-Game:");
  // TODO: change state.
  captureState();
  statusUndoIndex();
  }

function handleRerun() {
  const order = ["AdvSqs", "Gambits", "Moves", "Setup"];
  const curr = currentKeyIndex();
  let { arrayKey, index } = curr;
  const k = order.indexOf(arrayKey);

  if(arrayKey === "Sentry") { // 🔥 Case 0: already at Sentry
    boards.clearBoard();
    statusUndoIndex();
    return;
    }
  else if(index > 0) {        // 🔥 Case 1: collapse current key to first element.
    undoIndex[arrayKey][0] = 1;
    } 
  else {                      // 🔥 Case 2: move to next lower-priority key.
    let found = false;
    for(let j = k + 1; j < order.length; j++) { // Check each undo category.
      const key = order[j];
      const i = undoIndex[key][0];

      if(i > 0) {
        undoIndex[key][0] = 0;   // Jump to empty state of that key.
        arrayKey = key;
        found = true;
        break;
      }
    }

    // 🔥 Fall through to Sentry
    if(!found) {
      undoIndex.Setup[0] = 0;      // Zero Setup explicitly (important for display).
      boards.clearBoard();
      statusUndoIndex();
      return;
    }
  }

  // 🔥 Render logic (Sentry-aware)
  if(     arrayKey === "AdvSqs") {
    if(undoIndex.AdvSqs[0] === 0) {
      advsqs.clearAdvsq();
    } else {
      const specs = undoState.AdvSqs[undoIndex.AdvSqs[0] - 1];
      advsqs.makeAdvsq(specs);
      advsqs.setAdvsqPanelParams(advsqs.specsToPanelParams(specs));
    }
    }
  else if(arrayKey === "Setup") {
    if(undoIndex.Setup[0] === 0) {
      boards.clearBoard();
    } else {
      const setup = undoState.Setup[undoIndex.Setup[0] - 1];
      boards.makeBoard(setup.board);
    }
  }
  // Seampoint for the rest of the undo elements.


  statusUndoIndex();
  }

function handleUndo() {
  const keyIndex = prevKeyIndex();
  if(!keyIndex) { // Bottom sentry.
    boards.clearBoard();
    statusUndoIndex();
    return;
  }

  if(     keyIndex.arrayKey === "AdvSqs") {
    const specs = undoState.AdvSqs[keyIndex.index];
    console.log("control: events.js - HandleUndo(advsq)", specs);
    advsqs.makeAdvsq(specs);
    advsqs.setAdvsqPanelParams(advsqs.specsToPanelParams(specs));
    }
  else if(keyIndex.arrayKey === "Gambits") {
    const specs = undoState.Gambits[keyIndex.index];
    console.log("control: events.js - HandleUndo(gambit)", specs);
    // TODO: call the view routine to render the gambit.
    }
  else if(keyIndex.arrayKey === "Moves") {
    const specs = undoState.Moves[keyIndex.index];
    console.log("control: events.js - HandleUndo(move)", specs);
    // TODO: call the view routine to render the move.
    }
  else if(keyIndex.arrayKey === "Setup") {
    const setup = undoState.Setup[keyIndex.index];
    console.log("control: events.js - HandleUndo(setup)", setup);
    boards.makeBoard(setup.board);
  }

  statusUndoIndex();
  }

function handleRedo() {
  const keyIndex = nextKeyIndex();
  if(!keyIndex) {   // Top sentry.
    console.log("Heat death - no more state history.");
    return;
  }

  if(keyIndex.arrayKey === "AdvSqs") {
    const specs = undoState.AdvSqs[keyIndex.index];
    console.log("control: events.js - HandleRedo(advsq)", specs);
    advsqs.makeAdvsq(specs);
    advsqs.setAdvsqPanelParams(advsqs.specsToPanelParams(specs));
    }
  else if(keyIndex.arrayKey === "Gambits") {
    const specs = undoState.Gambits[keyIndex.index];
    console.log("control: events.js - HandleRedo(gambit)", specs);
    // TODO: call the view routine to render the gambit.
    }
  else if(keyIndex.arrayKey === "Moves") {
    const specs = undoState.Moves[keyIndex.index];
    console.log("control: events.js - HandleRedo(move)", specs);
    // TODO: call the view routine to render the move.
    }
  else if(keyIndex.arrayKey === "Setup") {
    const setup = undoState.Setup[keyIndex.index];
    console.log("control: events.js - HandleRedo(setup)", setup);
    boards.makeBoard(setup.board);
  }

  statusUndoIndex();
  }
  
function handleLoad() {
  console.log("Game Load:", state.getState());
  // TODO: change state.
  }
  
function handleSave() {
  // console.log("Game Save:");
  // TODO: change state.
  console.log("statusUndoIndex:");
  statusUndoIndex();  // TODO: Deprecate, now shows up in the Game Control panel.
}

// --- Helpers ---
let undoState = { // This is the undo state of the game: local to controller.
  Setup:   [],
  Moves:   [],
  Gambits: [],
  AdvSqs:  []
  };

let undoIndex = { // undoIndex[key][0] = pointer to NEXT item to apply.
  Setup:   [],
  Moves:   [],
  Gambits: [],
  AdvSqs:  []
}

function statusUndoIndex() {    // Game helpers.
  const el = document.getElementById("undo-list");

  const rows = [
    ["Setup",   undoIndex.Setup],
    ["Moves",   undoIndex.Moves],
    ["Gambits", undoIndex.Gambits],
    ["AdvSqs",  undoIndex.AdvSqs]
  ];

  const text = rows
    .map(([label, [i, max]]) =>
      `${label.padEnd(7)} ${i}/${max}`
    )
    .join("\n");

  el.textContent = text;
  }

function currentKeyIndex() {
  const order = ["AdvSqs", "Gambits", "Moves", "Setup"];

  for (const key of order) {
    const i = undoIndex[key][0];
    if (i > 0) {
      return { arrayKey: key, index: i - 1 };
    }
  }

  return { arrayKey: "Sentry", index: -1 };  // 🔥 explicit
  }

function prevKeyIndex() {
  const order = ["AdvSqs", "Gambits", "Moves", "Setup"];

  for (let k = 0; k < order.length; k++) {
    const key = order[k];
    let i = undoIndex[key][0];

    // Only consider arrays that have any applied state
    if (i > 0) {
      i = i - 1;

      if (i >= 0) {      // Case 1: still within same array
        undoIndex[key][0] = i;
        if(i-1 >= 0)
          return { arrayKey: key, index: i-1 };
      }

      for (let j = k + 1; j < order.length; j++) {      // Case 2: retreat to previous arrays
        const prevKey = order[j];
        const prevI = undoIndex[prevKey][0];

        if (prevI > 0) {
          return { arrayKey: prevKey, index: prevI - 1 };
        }
      }

      return null; // nothing left anywhere
    }
  }

  return null; // no arrays had state
  }

function nextKeyIndex() {
  const order = ["Setup", "Moves", "Gambits", "AdvSqs"];

  for (let k = 0; k < order.length; k++) {
    const key = order[k];
    let i = undoIndex[key][0];
    const max = undoIndex[key][1];

    // Only consider arrays that have remaining redo
    if (i < max) {      // Case 1: advance within same array
      undoIndex[key][0] = i + 1;
      return { arrayKey: key, index: i };
    }

    for (let j = k + 1; j < order.length; j++) {    // Case 2: move forward to next arrays
      const nextKey = order[j];
      const nextI = undoIndex[nextKey][0];
      const nextMax = undoIndex[nextKey][1];

      if (nextI < nextMax) {
        undoIndex[nextKey][0] = nextI + 1;
        return { arrayKey: nextKey, index: nextI };
      }
    }

    // If we checked this key and forward keys, nothing found
    if (i < max) break;
  }

  return null;
  }

function trimStateToUndoIndex() {
  const curr = state.getState();
  const next = {};

  for (const key in curr) {
    const cutoff = undoIndex[key][0];   // pointer to NEXT
    next[key] = curr[key].slice(0, cutoff);
  }

  state.setState(next);
  }

function captureState() {
  undoState = structuredClone(state.getState());  // A deep copy for undo to traverse.
  for(const key in undoState) {
    const array = undoState[key];
    undoIndex[key][0] = array.length;
    undoIndex[key][1] = array.length;
  }
  const keyIndex = currentKeyIndex();

  statusUndoIndex();
}
/*** ---------- ---------- ---------- ---------- ***/

function handleFreeze() {             // Gambit handlers.
  console.log("Gambit Freeze-AdvSq:");
  // TODO: change state.
  }

function handlePrev() {
   console.log("Gambit Prev:");
 // TODO: change state.
  }

function handleNext() {
  console.log("Gambit Next:");
  // TODO: change state.
  }

function handleDelete() {
  console.log("Gambit Delete:");
  // TODO: change state.
  }

function handleDeselect() {
  console.log("Gambit Deselect:");
  // TODO: change state.
}
/*** ---------- ---------- ---------- ---------- ***/

import { normalizeTileToVts } from "../foundation/coords/coords.js";

function handlePlace(payload) {       // Advsq handlers.
  console.log("control: events.js - handlePlace(payload):", payload);

  const panel = document.getElementById("advsq-window");                  // Read.
  let quadNo = Number(panel.querySelector('[name="advsq-quad"]').value);

  let { srcTile, quad, perimeter, stride, opacity } = payload;            // Render.
  payload = { srcTile, quad: quadNo, perimeter, stride, opacity };
  changeAdvSq(payload);
  }

function handleRemove() {
  console.log("control: events.js - handleRemove()");

  state.clearAdvSqs();

  undoState.AdvSqs = [];
  undoIndex.AdvSqs = [0, 0];

  const initial = advsqs.getAdvsqPanelInitialParams();
  advsqs.setAdvsqPanelParams(initial);

  statusUndoIndex();
  }

function handleUpdateParam(payload) {
  console.log("control: events.js - handleUpdateParam(payload):", payload);

  const panel = document.getElementById("advsq-window");

  if (payload.name === "advsq-opacity") {   // Short-circuit opacity-only undo updates.
    changeOpacityOnly(payload);
    return;
  }

  const quad = Number(panel.querySelector('[name="advsq-quad"]').value);  // Plane name from quad.
  const rec = quads.pqrTable(quad);
  panel.querySelector('[name="advsq-plane"]').textContent = rec.plane;

  const perimeter = panel.querySelector('[name="advsq-perimeter"]').value;  // Length from perimeter.
  let length = 2*Number(perimeter) + 1;
  panel.querySelector('[name="advsq-length"]').value = length;

  let stride = Number(panel.querySelector('[name="advsq-stride"]').value);  // Max stride.
  const k = Number(perimeter);
  const maxStride = 2*k + 1;
  if(stride > maxStride) {
    panel.querySelector('[name="advsq-stride"]').value = maxStride;
    stride = maxStride;
    return;
  }

  let apex = "Apex";                                                        // Duke duplex/apex tiles.
  if(rec.quadType === "face") apex = "Duplex";
  else if(rec.quadType === "face") apex = "Apex";

  const perim = Number(perimeter);
  const dukeThirds = false;
  // const dukeThirds = isThirdsTile(quad, perim, stride);
  let tileType = "";                                                        // Tile type from stride.
  if(     stride === 1)         tileType = "E1";
  else if(stride === k + 1)     tileType = apex;
  else if(stride === maxStride) tileType = "E2";
  else if(dukeThirds)           tileType = "Thirds";  // TODO: Test for duke 'thirds' tile.
  else                          tileType = "Body";
  panel.querySelector('[name="advsq-tile"]').value = tileType;

  const updatedPayload = {
    srcTile:  panel.querySelector('[name="advsq-src"]').value,
    quad:     panel.querySelector('[name="advsq-quad"]').value,
    perimeter:panel.querySelector('[name="advsq-perimeter"]').value,
    stride:   panel.querySelector('[name="advsq-stride"]').value,
    opacity:  panel.querySelector('[name="advsq-opacity"]').value
  };

  changeAdvSq(updatedPayload);
  }

function handleNudgeSrc(payload) {
  const { axis, delta } = payload;

  console.log(`Advsq Nudge-Src ${axis} by ${delta}`);

  const panel = document.getElementById("advsq-window");

  // 1. Read current srcTile (board notation)
  const srcStr = panel.querySelector('[name="advsq-src"]').value;

  // 2. Convert to VTS
  let vts = normalizeTileToVts(srcStr);  // [z,x,y]

  // 3. Apply delta
  if (axis === "z") vts[0] += delta;
  if (axis === "x") vts[1] += delta;
  if (axis === "y") vts[2] += delta;

  // 4. Convert back to board notation
  const newSrc = coords.vtsToBoard(vts);   // 🔥 you just built this

  // 5. Write back to panel
  panel.querySelector('[name="advsq-src"]').value = newSrc;

  // 6. Reuse existing pipeline
  const updatedPayload = {
    srcTile:  newSrc,
    quad:     panel.querySelector('[name="advsq-quad"]').value,
    perimeter:panel.querySelector('[name="advsq-perimeter"]').value,
    stride:   panel.querySelector('[name="advsq-stride"]').value,
    opacity:  panel.querySelector('[name="advsq-opacity"]').value
  };

  changeAdvSq(updatedPayload);
  }

function handleNextQuad(payload) {
  console.log("control: events.js - handleNextQuad(payload):", payload);

  const panel = document.getElementById("advsq-window");                  // Read.
  let quadNo = Number(panel.querySelector('[name="advsq-quad"]').value);

  if(      1 <= quadNo && quadNo <= 12) { // Next rook quad.
    quadNo += 1;
    if(quadNo % 4 === 1) quadNo -= 4;
    }
  else if(13 <= quadNo && quadNo <= 36) { // Next bishop quad.
    quadNo += 1;
    if(quadNo % 6 === 1) quadNo -= 6;
    }
  else if(37 <= quadNo && quadNo <= 60) { // Next duke quad.
    quadNo += 1;
    if(quadNo % 4 === 1) quadNo -= 4;
    }
  else {
    throw new Error("Unknown quad number in control: events.js - handleNextQuad().", quadNo);
  }

  // const quadValue = Number(panel.querySelector('[name="advsq-quad"]').value);  // Plane name from quad.
  // const rec = quads.pqrTable(quadValue);
  // panel.querySelector('[name="advsq-plane"]').textContent = rec.plane;

  panel.querySelector('[name="advsq-quad"]').value   = quadNo;            // Write.
  const firstStride = 1;
  panel.querySelector('[name="advsq-stride"]').value = firstStride;

  let { srcTile, quad, perimeter, stride, opacity } = payload;            // Render.
  payload = { srcTile, quad: quadNo, perimeter, stride: firstStride, opacity };
  changeAdvSq(payload);
  }

function handleNextPlane(payload) {
  console.log("control: events.js - handleNextPlane(payload):", payload);

  const panel = document.getElementById("advsq-window");                  // Read.
  let quadNo = Number(panel.querySelector('[name="advsq-quad"]').value);

  if(      1 <= quadNo && quadNo <= 12) { // Change rook plane.
    quadNo += 4;  
    if(quadNo > 12) quadNo = 1;
    }
  else if(13 <= quadNo && quadNo <= 36) { // Change bishop plane.
    quadNo += 6;
    if(quadNo > 36) quadNo = 13;
    }
  else if(37 <= quadNo && quadNo <= 60) { // Change duke plane.
    quadNo += 4;
    if(quadNo > 60) quadNo = 37;
    }
  else {
    throw new Error("Unknown quad number in control: events.js - handleNextPlane().", quadNo);
  }

  panel.querySelector('[name="advsq-quad"]').value = quadNo;              // Write.
  const firstStride = 1;
  panel.querySelector('[name="advsq-stride"]').value = firstStride;

  const rec = quads.pqrTable(quadNo);                                     // Plane name from quad.
  panel.querySelector('[name="advsq-plane"]').textContent = rec.plane;

  let { srcTile, quad, perimeter, stride, opacity } = payload;            // Render.
  payload = { srcTile, quad: quadNo, perimeter, stride: firstStride, opacity };
  changeAdvSq(payload);
  }

function handleNextPiece(payload) {
  console.log("control: events.js - handleNextPiece(payload):", payload);

  const panel = document.getElementById("advsq-window");                  // Read.
  let quadNo = Number(panel.querySelector('[name="advsq-quad"]').value);

  if(      1 <= quadNo && quadNo <= 12) { // Change from rook to bishop plane.
    quadNo = 13;  
    }
  else if(13 <= quadNo && quadNo <= 36) { // Change from bishop to duke plane.
    quadNo = 37;
    }
  else if(37 <= quadNo && quadNo <= 60) { // Change from duke to rook plane.
    quadNo = 1;
    // if(quadNo > 60) quadNo -= 60;
    }
  else {
    throw new Error("Unknown quad number in control: events.js - handleNextPiece().", quadNo);
  }

  panel.querySelector('[name="advsq-quad"]').value = quadNo;              // Write.
  const firstStride = 1;
  panel.querySelector('[name="advsq-stride"]').value = firstStride;

  const rec = quads.pqrTable(quadNo);                                     // Plane name from quad.
  panel.querySelector('[name="advsq-plane"]').textContent = rec.plane;

  let { srcTile, quad, perimeter, stride, opacity } = payload;            // Render.
  payload = { srcTile, quad: quadNo, perimeter, stride: firstStride, opacity };
  changeAdvSq(payload);
}

// --- Helpers ---
function changeAdvSq(payload) {
  const { srcTile, quad, perimeter, stride, opacity } = payload;

  console.log("control: events.js - changeAdvSq(payload):", payload);

  const newAdvsq = {
    srcTile: normalizeTileToVts(srcTile),   // 🔥 KEY FIX
    quad: normalizeQuad(quad),
    perimeter: Number(perimeter),
    stride: Number(stride),
    opacity: Number(opacity),
  };
  console.log("control: events.js - newAdvsq:", newAdvsq);

  trimStateToUndoIndex();
  state.pushAdvSq(newAdvsq);
  captureState();
  }

function normalizeQuad(q) {
  if (typeof q === "number") return q;
  if (typeof q === "string" && q.startsWith("Q")) return q;
  if (typeof q === "string") return `Q${q}`;
  throw new Error(`Invalid quad: ${q}`);
  }

function clearAdvSqState() {
  // --- Clear model ---
  const curr = state.getState();
  curr.AdvSqs = [];
  state.setState(curr);

  // --- Clear undo history ---
  undoState.AdvSqs = [];

  // --- Reset pointers ---
  undoIndex.AdvSqs[0] = 0;  // current index
  undoIndex.AdvSqs[1] = 0;  // max index
  }

function syncAdvsqPanel(specs) {
  const panel = document.getElementById("advsq-window");
  if (!panel) return;

  panel.querySelector('[name="advsq-src"]').value =
    specs?.srcTile ?? "";

  panel.querySelector('[name="advsq-quad"]').value =
    specs?.quad ?? 1;

  panel.querySelector('[name="advsq-perimeter"]').value =
    specs?.perimeter ?? 1;

  panel.querySelector('[name="advsq-stride"]').value =
    specs?.stride ?? 1;

  panel.querySelector('[name="advsq-opacity"]').value =
    specs?.opacity ?? 0.5;
  }

function changeOpacityOnly(payload) {
  const panel = document.getElementById("advsq-window");

  const opacity = Number(
    panel.querySelector('[name="advsq-opacity"]').value
  );

  const last = state.getState().AdvSqs.slice(-1)[0];
  if (!last) return;

  // 🔥 VIEW ONLY — no state mutation
  advsqs.makeAdvsq({
    ...last,
    opacity
  });
}

function isThirdsTile(quad, perim, strideIndex) { // TODO: fix.
  console.log("control: events.js - isThirdsTile(quad, perim, strideIndex):", quad, perim, strideIndex);
  
  const stride = overlaps.getStride({ quad, k: perim });
  if (!stride) return false;

  return stride[strideIndex] === "third";
}

/*** ---------- ---------- ---------- ---------- ***/

import * as cameras from "../view/render/cameras.js";

function handleZoomIn() {             // Camera handlers. Not subject to the undo arch.
  console.log("Camera Zoom-In:");
  const delta = 0.1;
  cameras.zoomIn(delta);
  }

function handleZoomOut() {
  const delta = -0.1;
  cameras.zoomIn(delta);
  }

function handleAscend() {
  const tilt = 10;
  cameras.shiftVertical(tilt);
  }

function handleDescend() {
  const tilt = -10;
  cameras.shiftVertical(tilt);
  }

function handlePOV(pov) {
  cameras.selectPOV(pov, [0, 0, 0]);
}

// Seampoint - more handle functions, to be grouped by panel.

