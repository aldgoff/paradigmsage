/* File: advsqs.js
  Path: ./3dc/controller/advsqs/advsqs.js
  Purpose: Create and morph advancement squares vis srcTile, quad, perimeter, and stride, w/ opacity for offboard tiles.
  Author: Allan Goff
  Date: 4/21/26
  Recommended access: import * as cAdvsqs from ../../controller/advsqs/advsqa.js
  UI: the export functions.
  Philosophy: Delete a module by deleting its directory - not so much.
    controller/ model/ view/
    play.md - DOM
    main.js - regressions
    view.js - wire, build payload
    game.js - rewind, FF
    state.js - undo, redo
*/

// --- Load JSON ---
import advsqsData from "./advsqs.json" assert { type: "json" };
  const advsqsModule = advsqsData.advsqs_module;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as game     from "../../controller/game/game.js";

  import * as state    from "../../model/state/state.js";
  import * as mAdvsqs  from "../../model/advsqs/advsqs.js";
  import * as coords   from "../../foundation/coords/coords.js";  // normalizeTileToVts().

  import * as vAdvsqs  from "../../view/advsqs/advsqs.js";
  import * as vGambits from "../../view/gambits/gambits.js";
// Seampoint: more imports...

// --- UI ---
export function panelDispatch(payload) {
  // console.log("cntrl: advsqs.js - panelDispatch(payload):", payload);

  vGambits.cancelAnimation(); // TODO: view leakage, need a better solution.

  const { action, 
    src,          // board (positional notation))
    srcTile,      // vts (TODO: inwork)
    quad,         // 1-60
    perimeter,    // 0-N
    stride,       // 0-2*perimeter+1
    opacity       // Offboard tiles (0.00 to 1.00)
  } = payload;

  switch (action) {
    case "place":       handlePlace(payload); break;
    case "remove":      handleRemove(payload); break;
    case "grow":        handleGrow(payload); break;
    case "shrink":      handleShrink(payload); break;
    case "updateParam": handleUpdateParam(payload); break;
    case "nudgeSrc":    handleNudgeSrc(payload); break;
    case "nextQuad":    handleNextQuad(payload); break;
    case "nextPlane":   handleNextPlane(payload); break;
    case "nextPiece":   handleNextPiece(payload); break;
    default: throw new Error(`Unknown advsq action ${action}, payload ${JSON.stringify(payload)}.`);
  }

  game.showUndoStatus();    // Show undo buffer status in game panel.
  }

export function buildPayload(panel, action) {
  console.log("     ---------- cntrl: advsqs.js");
  
  return { action, // TODO: base off new entry in json file.
    src:       panel.querySelector('[name="advsq-src"]')?.value,
    srcTile:   coords.normalizeTileToVts(panel.querySelector('[name="advsq-src"]')?.value),
    quad:      Number(panel.querySelector('[name="advsq-quad"]')?.value),
    perimeter: Number(panel.querySelector('[name="advsq-perimeter"]')?.value),
    stride:    Number(panel.querySelector('[name="advsq-stride"]')?.value),
    opacity:   Number(panel.querySelector('[name="advsq-opacity"]')?.value),
  };
}
// Seampoint: more global functions...

// --- Handle Functions ---
function handlePlace(payload) {
  console.log("cntrl: advsqs.js - handlePlace(payload)", payload);

  let { src, srcTile, quad, perimeter, stride, opacity } = payload;  // Unpack primary fields.

  const nextEntry = mAdvsqs.makeEntry(payload);        // Transform panel payload into state entry.
  applyEntry(nextEntry);
  }

function handleRemove(payload) {
  console.log("cntrl: advsqs.js - handleRemove(payload)", payload);
  
  let { src, srcTile, quad, perimeter, stride, opacity } = payload;  // Unpack primary fields.
                                                                            // Manipulate fields.
  const newAdvsq = blank(payload);           // Repack normalized fields.

  state.clearBuffer("AdvSqs");           // Log state change in undo buffer.
  vAdvsqs.clear();             // Render.
  vAdvsqs.refreshPanel(newAdvsq);   // Update the control panel.
  }

function handleGrow(payload) {
  console.log("cntrl: advsqs.js - handleGrow(payload)", payload);

  let { src, srcTile, quad, perimeter, stride, opacity } = payload;  // Unpack primary fields.
  
  if(perimeter > 0) {                                                 // Stride stability idiom (apex, or fixed distance from E1/E2).
    if(     stride <= 1)               { stride = stride; }           // E1 (or off) - stays on end tile.
    else if(stride < perimeter + 1)    { stride; }                    // Outbound - constant distance from E1.
    else if(stride === perimeter + 1)  { stride++; }                  // Apex - stays on apex tile.
    else if(stride < 2*perimeter + 1)  { stride+=2; }                 // Inbound - constant distance from E2.
    else if(stride >= 2*perimeter + 1) { stride = 2*perimeter + 3; }  // E2 (or off scale) - stays on end tile.
  }
  else {
    stride = 2;
  }
  perimeter++;                                                              // Manipulate fields.

  const nextEntry = { src, srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.

  applyEntry(nextEntry);  // Clear curr, branch, state change, render, refresh panel.
  }

function handleShrink(payload) {
  console.log("cntrl: advsqs.js - handleShrink(payload)", payload);

  let { src, srcTile, quad, perimeter, stride, opacity } = payload;  // Unpack primary fields.
  
  if(perimeter >= 1) {                                                // Stride stability idiom (apex, or fixed distance from E1/E2).
    if(     stride <= 1)               { stride = stride; }           // E1 (or off) - stays on end tile.
    else if(stride < perimeter + 1)    { stride; }                    // Outbound - constant distance from E1.
    else if(stride === perimeter + 1)  { stride--; }                  // Apex - stays on apex tile.
    else if(stride < 2*perimeter + 1)  { stride-=2; }                 // Inbound - constant distance from E2.
    else if(stride >= 2*perimeter + 1) { stride = 2*perimeter - 1; }  // E2 (or off scale) - stays on end tile.
  }
  if(--perimeter < 0) perimeter = 0.                                        // Manipulate fields.

  const nextEntry = { src, srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.

  applyEntry(nextEntry);  // Clear curr, branch, state change, render, refresh panel.
  }

function handleUpdateParam(payload) {
  console.log("cntrl: advsqs.js - handleUpdateParam(payload)", payload);

  let { src, srcTile, quad, perimeter, stride, opacity } = payload;  // Unpack primary fields.

  const maxStride = 2 * perimeter + 1;                                      // Manipulate fields.
  if(stride > maxStride) {  // Is stride panel limited or perimeter limited?
    stride = maxStride;

    const currAdvsq = state.fetchCurrentState("AdvSqs");
    const currPerimeter = currAdvsq.perimeter;

    if(perimeter === currPerimeter) { // Panel limited.
      const corrected = { srcTile, quad, perimeter, stride, opacity };
      vAdvsqs.setAdvsqPanelParams(corrected);    // Update the control panel.
      state.replaceCurrentAdvsq(corrected);     // 🔥 no undo entry, no change in state, no need to render.
      return;
    }
  }
  if(perimeter === 0) stride = 0;

  const nextEntry = { src, srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.

  applyEntry(nextEntry);  // Clear curr, branch, state change, render, refresh panel.
  }

function handleNudgeSrc(payload) {
  console.log("cntrl: advsqs.js - handleNudgeSrc(payload)", payload);

  const { axis, delta } = payload;

  const current = state.fetchCurrentState("AdvSqs");                           // Prepacked normalized fields.
  if (!current) return;

  let nextEntry = {      // Safe clone.
    ...current,
    srcTile: [...current.srcTile]
  };

  if (axis === "z")      nextEntry.srcTile[0] += delta;                      // Manipulate fields.
  else if (axis === "x") nextEntry.srcTile[1] += delta;
  else if (axis === "y") nextEntry.srcTile[2] += delta;
  else throw new Error("Invalid axis");

  applyEntry(nextEntry);  // Clear curr, branch, state change, render, refresh panel.
  }

function handleNextQuad(payload) {
  console.log("cntrl: advsqs.js - handleNewQuad(payload)", payload);

  let { src, srcTile, quad, perimeter, stride, opacity } = payload;  // Unpack primary fields.
                                                                            // Manipulate fields.
  if(      1 <= quad && quad <= 12) { ++quad; if(quad%4 === 1) quad -= 4; }   // Next rook quad.
  else if(13 <= quad && quad <= 36) { ++quad; if(quad%6 === 1) quad -= 6; }   // Next bishop quad.
  else if(37 <= quad && quad <= 60) { ++quad; if(quad%4 === 1) quad -= 4; }   // Next duke quad.
  else {                                                                      // Throw.
    throw new Error("Unknown quad number in control: advsqs.js - handleNextQuad() quad", quad);
  }
  stride = 1; // First stride.

  const nextEntry = { src, srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.

  applyEntry(nextEntry);  // Clear curr, branch, state change, render, refresh panel.
  }

function handleNextPlane(payload) {
  console.log("cntrl: advsqs.js - handleNextPlane(payload)", payload);

  let { src, srcTile, quad, perimeter, stride, opacity } = payload;  // Unpack primary fields.
                                                                            // Manipulate fields.
  if(      1 <= quad && quad <= 12) { quad += 4; if(quad > 12) quad =  1; }   // Change rook plane.
  else if(13 <= quad && quad <= 36) { quad += 6; if(quad > 36) quad = 13; }   // Change bishop plane.
  else if(37 <= quad && quad <= 60) { quad += 4; if(quad > 60) quad = 37; }   // Change duke plane.
  else {                                                                      // Throw.
    throw new Error("Unknown quad number in control: advsqs.js - handleNextPlane() quad", quad);
  }
  stride = 1; // First stride.

  const nextEntry = { src, srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.

  applyEntry(nextEntry);  // Clear curr, branch, state change, render, refresh panel.
  }

function handleNextPiece(payload) {
  console.log("cntrl: advsqs.js - handleNextPiece(payload)", payload);

  let { src, srcTile, quad, perimeter, stride, opacity } = payload;  // Unpack primary fields.
                                                                            // Manipulate fields.
  if(      1 <= quad && quad <= 12) { quad = 13; }                            // Change rook to bishop plane.
  else if(13 <= quad && quad <= 36) { quad = 37; }                            // Change bishop to duke plane.
  else if(37 <= quad && quad <= 60) { quad =  1; }                            // Change duke to rook plane.
  else {                                                                      // Throw.
    throw new Error("Unknown quad number in control: advsqs.js - handleNextPiece() quad", quad);
  }
  stride = 1; // First stride.

  const nextEntry = { src, srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.

  applyEntry(nextEntry);  // Clear curr, branch, state change, render, refresh panel.
}

// --- Helpers ---
function applyEntry(entry) {   // Clear curr, branch, state change, render, refresh panel.
  console.log("cntrl: advsqs.js - applyEntry(entry)", entry);

  const currEntry = state.fetchCurrentState("AdvSqs"); // Clear previous board.
  if(currEntry) {
    vAdvsqs.clear(currEntry);
    if(!state.isAtEnd("AdvSqs")) {    // Branches the undo history, discards original branch.
      const idx = state.getCurrentIndex("AdvSqs");  // Seems to work
      state.truncateState("AdvSqs", idx);
    }
  }

  state.pushNewAdvsq(entry);          // Log state change in undo buffer.
  vAdvsqs.render(entry);              // Render the new advsq.
  vAdvsqs.refreshPanel(entry);        // Only needed by panels with derived fields.
}

function blank(payload) { // Convert panel strings to numbers, arrays, etc.
  let { src, srcTile, quad, perimeter, stride, opacity } = payload;  // Unpack primary fields.

  src       = "Q4,4";
  srcTile   = [0,0,0];  // "Q4,4"
  quad      = 1;  
  perimeter = 0;
  stride    = 0;

  const blank = { src, srcTile, quad, perimeter, stride, opacity }; // Repack primary fields.

  return blank;
}


// Seampoint: more local functions...

