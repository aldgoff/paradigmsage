/* File: advsqs.js
  Path: ./3dc/advsqs/advsqs.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/21/26
  Recommended access: import * as cAdvsqs.
  UI: the export functions.
*/

// --- Load JSON ---
import advsqsData from "./advsqs.json" assert { type: "json" };
  const advsqsModule = advsqsData.advsqs_module;
  const category  = advsqsModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
import * as game   from "../../controller/game/game.js";

import * as state  from "../../model/state/state.js";
import * as coords from "../../foundation/coords/coords.js";  // normalizeTileToVts().

import * as vAdvsqs from "../../view/advsqs/advsqs.js";
// Seampoint: more imports...

// --- UI ---
export function panelDispatch(payload) {
  const { action, srcTile, quad, perimeter, stride, opacity } = payload;
  console.log("cntrl: advsqs.js - panelDispatch(payload)", payload);

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
// Seampoint: more global functions...

// --- Handle Functions ---
function handlePlace(payload) {
  console.log("cntrl: advsqs.js - handlePlace(payload)", payload);

  let { srcTile, quad, perimeter, stride, opacity } = normalize(payload);   // Unpack primary fields.
                                                                            // Manipulate fields.
  const newAdvsq = { srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.

  applyAdvsq(newAdvsq); // Log state change, render, update control panel.}
  }

function handleRemove(payload) {
  console.log("cntrl: advsqs.js - handleRemove()");
  
  let { srcTile, quad, perimeter, stride, opacity } = blank(payload);       // Unpack primary fields.
                                                                            // Manipulate fields.
  const newAdvsq = { srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.

  state.clearBuffer("AdvSqs");           // Log state change in undo buffer.
  vAdvsqs.clearAdvsq();             // Render.
  vAdvsqs.setAdvsqPanelInitialParams(newAdvsq);   // Update the control panel.
  }

function handleGrow(payload) {
  console.log("cntrl: advsqs.js - handleGrow(payload)", payload);

  let { srcTile, quad, perimeter, stride, opacity } = normalize(payload);   // Unpack primary fields.
  
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

  const newAdvsq = { srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.

  applyAdvsq(newAdvsq); // Log state change, render, update control panel.}
  }

function handleShrink(payload) {
  console.log("cntrl: advsqs.js - handleShrink(payload)", payload);

  let { srcTile, quad, perimeter, stride, opacity } = normalize(payload);   // Unpack primary fields.
  
  if(perimeter >= 1) {                                                // Stride stability idiom (apex, or fixed distance from E1/E2).
    if(     stride <= 1)               { stride = stride; }           // E1 (or off) - stays on end tile.
    else if(stride < perimeter + 1)    { stride; }                    // Outbound - constant distance from E1.
    else if(stride === perimeter + 1)  { stride--; }                  // Apex - stays on apex tile.
    else if(stride < 2*perimeter + 1)  { stride-=2; }                 // Inbound - constant distance from E2.
    else if(stride >= 2*perimeter + 1) { stride = 2*perimeter - 1; }  // E2 (or off scale) - stays on end tile.
  }
  if(--perimeter < 0) perimeter = 0.                                        // Manipulate fields.

  const newAdvsq = { srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.

  applyAdvsq(newAdvsq); // Log state change, render, update control panel.}
  }

function handleUpdateParam(payload) {
  console.log("cntrl: advsqs.js - handleUpdateParam(payload)", payload);

  let { srcTile, quad, perimeter, stride, opacity } = normalize(payload);   // Unpack primary fields.

  const maxStride = 2 * perimeter + 1;                                      // Manipulate fields.
  if(stride > maxStride) {  // Is stride panel limited or perimeter limited?
    stride = maxStride;

    const currAdvsq = state.fetchCurrentAdvsq();
    const currPerimeter = currAdvsq.perimeter;

    if(perimeter === currPerimeter) { // Panel limited.
      const corrected = { srcTile, quad, perimeter, stride, opacity };
      vAdvsqs.setAdvsqPanelParams(corrected);    // Update the control panel.
      state.replaceCurrentAdvsq(corrected);     // 🔥 no undo entry, no change in state, no need to render.
      return;
    }
  }
  if(perimeter === 0) stride = 0;

  const newAdvsq = { srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.

  applyAdvsq(newAdvsq); // Log state change, render, update control panel.}
  }

function handleNudgeSrc(payload) {
  console.log("cntrl: advsqs.js - handleNudgeSrc(payload)", payload);

  const { axis, delta } = payload;

  const current = state.fetchCurrentAdvsq();                           // Prepacked normalized fields.
  if (!current) return;

  let newAdvsq = {      // Safe clone.
    ...current,
    srcTile: [...current.srcTile]
  };

  if (axis === "z")      newAdvsq.srcTile[0] += delta;                      // Manipulate fields.
  else if (axis === "x") newAdvsq.srcTile[1] += delta;
  else if (axis === "y") newAdvsq.srcTile[2] += delta;
  else throw new Error("Invalid axis");

  applyAdvsq(newAdvsq); // Log state change, render, update control panel.}
  }

function handleNextQuad(payload) {
  console.log("cntrl: advsqs.js - handleNewQuad(payload)", payload);

  let { srcTile, quad, perimeter, stride, opacity } = normalize(payload);   // Unpack primary fields.
                                                                            // Manipulate fields.
  if(      1 <= quad && quad <= 12) { ++quad; if(quad%4 === 1) quad -= 4; }   // Next rook quad.
  else if(13 <= quad && quad <= 36) { ++quad; if(quad%6 === 1) quad -= 6; }   // Next bishop quad.
  else if(37 <= quad && quad <= 60) { ++quad; if(quad%4 === 1) quad -= 4; }   // Next duke quad.
  else {                                                                      // Throw.
    throw new Error("Unknown quad number in control: advsqs.js - handleNextQuad() quad", quad);
  }
  stride = 1; // First stride.

  const newAdvsq = { srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.

  applyAdvsq(newAdvsq); // Log state change, render, update control panel.}
  }

function handleNextPlane(payload) {
  console.log("cntrl: advsqs.js - handleNextPlane(payload)", payload);

  let { srcTile, quad, perimeter, stride, opacity } = normalize(payload);   // Unpack primary fields.
                                                                            // Manipulate fields.
  if(      1 <= quad && quad <= 12) { quad += 4; if(quad > 12) quad =  1; }   // Change rook plane.
  else if(13 <= quad && quad <= 36) { quad += 6; if(quad > 36) quad = 13; }   // Change bishop plane.
  else if(37 <= quad && quad <= 60) { quad += 4; if(quad > 60) quad = 37; }   // Change duke plane.
  else {                                                                      // Throw.
    throw new Error("Unknown quad number in control: advsqs.js - handleNextPlane() quad", quad);
  }
  stride = 1; // First stride.

  const newAdvsq = { srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.

  applyAdvsq(newAdvsq); // Log state change, render, update control panel.}
  }

function handleNextPiece(payload) {
  console.log("cntrl: advsqs.js - handleNextPiece(payload)", payload);

  let { srcTile, quad, perimeter, stride, opacity } = normalize(payload);   // Unpack primary fields.
                                                                            // Manipulate fields.
  if(      1 <= quad && quad <= 12) { quad = 13; }                            // Change rook to bishop plane.
  else if(13 <= quad && quad <= 36) { quad = 37; }                            // Change bishop to duke plane.
  else if(37 <= quad && quad <= 60) { quad =  1; }                            // Change duke to rook plane.
  else {                                                                      // Throw.
    throw new Error("Unknown quad number in control: advsqs.js - handleNextPiece() quad", quad);
  }
  stride = 1; // First stride.

  const newAdvsq = { srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.

  applyAdvsq(newAdvsq); // Log state change, render, update control panel.}
}

// --- Helpers ---
export function normalize(payload) { // Convert panel strings to numbers, arrays, etc.
  let { srcTile, quad, perimeter, stride, opacity } = payload;  // Unpack primary fields.

  srcTile   = coords.normalizeTileToVts(srcTile);               // Convert numeric fields.
  quad      = Number(quad);  
  perimeter = Number(perimeter);
  stride    = Number(stride);
  opacity   = Number(opacity);

  const normed = { srcTile, quad, perimeter, stride, opacity }; // Repack primary fields.

  return normed;
  }

function blank(payload) { // Convert panel strings to numbers, arrays, etc.
  let { srcTile, quad, perimeter, stride, opacity } = payload;  // Unpack primary fields.

  srcTile   = [0,0,0];  // "Q4,4"
  quad      = 1;  
  perimeter = 0;
  stride    = 0;

  const blank = { srcTile, quad, perimeter, stride, opacity }; // Repack primary fields.

  return blank;
}

function applyAdvsq(newAdvsq) { // Log state change, render, update control panel.
  state.pushNewAdvsq(newAdvsq);           // Log state change in undo buffer.
  vAdvsqs.makeAdvsq(newAdvsq);             // Render.
  vAdvsqs.setAdvsqPanelParams(newAdvsq);   // Update the control panel.
}
// Seampoint: more local functions...

