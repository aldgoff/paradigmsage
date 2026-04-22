/* File: advsqs.js
  Path: ./3dc/advsqs/advsqs.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/21/26
  Recommended access: import * as advsqs.
  UI: the export functions.
*/

// --- Load JSON ---
import advsqsData from "./advsqs.json" assert { type: "json" };
  const advsqsModule = advsqsData.advsqs_module;
  const category  = advsqsModule.category;
// Seampoint: more objects.

// --- Build upon previous layers ---
import * as utils  from "../../../utils/debug.js";            // snapshot(obj) - (debugging as needed).

  import * as events from "../events.js";                       // cloneStateHistory().

  import * as coords from "../../foundation/coords/coords.js";  // normalizeTileToVts().
  import * as quads  from "../../geometry/quads.js";
  import * as state  from "../../model/state/state.js";
// Seampoint: more imports.

// --- UI ---
export function panelDispatch(payload) {
  const { action, srcTile, quad, perimeter, stride, opacity } = payload;
  console.log("control: advsqs.js - panelDispatch(payload)", payload);

  switch (action) {
    case "place":       handlePlace(payload); break;
    case "remove":      handleRemove(); break;
    case "grow":        handleGrow(payload); break;
    case "shrink":      handleShrink(payload); break;
    case "updateParam": handleUpdateParam(payload); break;
    case "nudgeSrc":    handleNudgeSrc(payload); break;
    case "nextQuad":    handleNextQuad(payload); break;
    case "nextPlane":   handleNextPlane(payload); break;
    case "nextPiece":   handleNextPiece(payload); break;
    default: throw new Error(`Unknown advsq action ${action}, payload ${JSON.stringify(payload)}.`);
  }
}
// Seampoint: more global functions.

// --- Handle Functions ---
function handlePlace(payload) {
  console.log("control: advsqs.js - handlePlace(payload)", payload);

  let { srcTile, quad, perimeter, stride, opacity } = normalize(payload);   // Unpack primary fields.
  
                                                                            // Manipulate fields.

  const newAdvsq = { srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.
  state.pushAdvSq(newAdvsq);                                                // Change state.
  events.cloneStateHistory();                                               // Undo buffer lives in control layer.

  //*** New State Based Undo System ***/
  state.pushNewAdvsq(newAdvsq);
  }

function handleRemove() {
  console.log("control: advsqs.js - handleRemove()");
  
  state.clearAdvSqs();  // Change state.

  events.cloneStateHistory();

  //*** New State Based Undo System ***/
  
  }

function handleGrow(payload) {
  console.log("control: advsqs.js - handleGrow(payload)", payload);

  let { srcTile, quad, perimeter, stride, opacity } = normalize(payload);   // Unpack primary fields.
  
  perimeter++;                                                              // Manipulate fields.

  const newAdvsq = { srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.
  state.pushAdvSq(newAdvsq);                                                // Change state.
  events.cloneStateHistory();                                               // Undo buffer lives in control layer.

  //*** New State Based Undo System ***/
  state.pushNewAdvsq(newAdvsq);

  }

function handleShrink(payload) {
  console.log("control: advsqs.js - handleShrink(payload)", payload);

  let { srcTile, quad, perimeter, stride, opacity } = normalize(payload);   // Unpack primary fields.
  
  if(--perimeter < 0) perimeter = 0.                                        // Manipulate fields.

  const newAdvsq = { srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.
  state.pushAdvSq(newAdvsq);                                                // Change state.
  events.cloneStateHistory();     
                                            // Undo buffer lives in control layer.
  //*** New State Based Undo System ***/
  state.pushNewAdvsq(newAdvsq);
  
  }

function handleUpdateParam(payload) {
  console.log("control: advsqs.js - handleUpdateParam(payload)", payload);

  let { srcTile, quad, perimeter, stride, opacity } = normalize(payload);   // Unpack primary fields.

  // if(perimeter === 0) stride = 0;
  // if(stride >= 2*perimeter + 1) {
  //   stride = 2*perimeter + 1;
  //   return;   // No change, don't update anything.
  // }

  const maxStride = 2 * perimeter + 1;

  if(perimeter === 0) stride = 0;

  if(stride > maxStride) {
    stride = maxStride;

    const corrected = { srcTile, quad, perimeter, stride, opacity };

    state.replaceCurrentAdvsq(corrected);   // 🔥 no undo entry
    return;
  }

  const newAdvsq = { srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.
  state.pushAdvSq(newAdvsq);                                                // Update state.
  events.cloneStateHistory();                                               // Undo buffer lives in control layer.

  //*** New State Based Undo System ***/
  state.pushNewAdvsq(newAdvsq);

  }

function handleNudgeSrc(payload) {
  console.log("control: advsqs.js - handleNudgeSrc(payload)", payload);

  const { axis, delta } = payload;                  // The keyboard entry ( |^ ijk +/-1).

  let current = state.getCurrentAdvsq();
  if (!current) return; // No advsq to nudge, quit trying.

  let advsq = {
    ...current,
    srcTile: [...current.srcTile]   // 🔥 critical clone
  };
  
  if(     axis === "z") advsq.srcTile[0] += delta;   // Offset the src tile by 1 tile (z,x,y).
  else if(axis === "x") advsq.srcTile[1] += delta;
  else if(axis === "y") advsq.srcTile[2] += delta;
  else throw new Error("WTF?");

  console.log("control: advsqs.js - handleNudgeSrc()...advsq", utils.snapshot(advsq));

  state.pushAdvSq(advsq);                            // Update state.
  events.cloneStateHistory();                        // Update undo history.

  //*** New State Based Undo System ***/
  state.pushNewAdvsq(newAdvsq);

} 

function handleNextQuad(payload) {
  console.log("control: advsqs.js - handleNewQuad(payload)", payload);

  let { srcTile, quad, perimeter, stride, opacity } = normalize(payload);   // Unpack primary fields.
                                                                            // Manipulate fields.
  if(      1 <= quad && quad <= 12) { ++quad; if(quad%4 === 1) quad -= 4; }   // Next rook quad.
  else if(13 <= quad && quad <= 36) { ++quad; if(quad%6 === 1) quad -= 6; }   // Next bishop quad.
  else if(37 <= quad && quad <= 60) { ++quad; if(quad%4 === 1) quad -= 4; }   // Next duke quad.
  else {                                                                      // Throw.
    throw new Error("Unknown quad number in control: events.js - handleNextQuad() quad", quad);
  }
  stride = 1; // First stride.

  const newAdvsq = { srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.
  state.pushAdvSq(newAdvsq);                                                // Update state.
  events.cloneStateHistory();                                               // Undo buffer lives in control layer.

  //*** New State Based Undo System ***/
  state.pushNewAdvsq(newAdvsq);

}

function handleNextPlane(payload) {
  console.log("control: advsqs.js - handleNextPlane(payload)", payload);

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
  state.pushAdvSq(newAdvsq);                                                // Update state.
  events.cloneStateHistory();                                               // Undo buffer lives in control layer.

  //*** New State Based Undo System ***/
  state.pushNewAdvsq(newAdvsq);

}

function handleNextPiece(payload) {
  console.log("control: advsqs.js - handleNextPiece(payload)", payload);

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
  state.pushAdvSq(newAdvsq);                                                // Update state.
  events.cloneStateHistory();                                               // Undo buffer lives in control layer.

  //*** New State Based Undo System ***/
  state.pushNewAdvsq(newAdvsq);

}

// --- Helpers ---
function normalize(payload) { // Convert panel strings to numbers, arrays, etc.
  let { srcTile, quad, perimeter, stride, opacity } = payload;  // Unpack primary fields.

  srcTile   = coords.normalizeTileToVts(srcTile);               // Convert numeric fields.
  quad      = Number(quad);  
  perimeter = Number(perimeter);
  stride    = Number(stride);
  opacity   = Number(opacity);

  const normed = { srcTile, quad, perimeter, stride, opacity }; // Repack primary fields.

  return normed;
}

// Seampoint: more local functions.

