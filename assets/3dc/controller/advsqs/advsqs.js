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

  import * as advsqs from "../../view/advsqs/advsqs.js";
// Seampoint: more imports.

// --- UI ---
export function panelDispatch(payload) {
  const { action, srcTile, quad, perimeter, stride, opacity } = payload;
  console.log("control: advsqs.js - panelDispatch(payload)", payload);

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
// Seampoint: more global functions.

// --- Handle Functions ---
function handlePlace(payload) {
  console.log("control: advsqs.js - handlePlace(payload)", payload);

  let { srcTile, quad, perimeter, stride, opacity } = normalize(payload);   // Unpack primary fields.
  
                                                                            // Manipulate fields.

  const newAdvsq = { srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.
  state.pushAdvSq(newAdvsq);                                                // Change state.
  events.cloneStateHistory();
  }

function handleRemove() {
  console.log("control: advsqs.js - handleRemove()");
  
  state.clearAdvSqs();  // Change state.

  events.cloneStateHistory();
  }

function handleUpdateParam(payload) {
  console.log("control: advsqs.js - handleUpdateParam(payload)", payload);

  let { srcTile, quad, perimeter, stride, opacity } = normalize(payload);   // Unpack primary fields.

  if (payload.name === "advsq-opacity") {   // Short-circuit opacity-only undo updates.
    changeOpacityOnly(payload);
    return;
  }

  const newAdvsq = { srcTile, quad, perimeter, stride, opacity };           // Repack normalized fields.
  state.pushAdvSq(newAdvsq);                                                // Update state.
  events.cloneStateHistory();
  }

function handleNudgeSrc(payload) {
  console.log("control: advsqs.js - handleNudgeSrc(payload)", payload);

  const { axis, delta } = payload;                  // The keyboard entry ( |^ ijk +/-1).

  let newAdvsq = advsqs.getAdvsqPanelParams();      // Need the panel primary values.

  let norm = normalize(newAdvsq);                   // Norm from strings to numbers and arrays.

  if(     axis === "z") norm.srcTile[0] += delta;   // Offset the src tile by 1 tile (z,x,y).
  else if(axis === "x") norm.srcTile[1] += delta;
  else if(axis === "y") norm.srcTile[2] += delta;
  else throw new Error("WTF?");

  state.pushAdvSq(norm);                            // Update state.
  events.cloneStateHistory();                       // Update undo history.
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
  events.cloneStateHistory();
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
  events.cloneStateHistory();
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
  events.cloneStateHistory();
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

function updateAdvsqPanel({ quad, perimeter, stride }) {
  console.log("control: advsqs.js - updateAdvsqPanel(quad, perimeter, stride)", quad, perimeter, stride);

  const panel = document.getElementById("advsq-window");                  // Read.

  panel.querySelector('[name="advsq-quad"]').value      = quad;                           // Update primary fields.
  panel.querySelector('[name="advsq-perimeter"]').value = perimeter;
  panel.querySelector('[name="advsq-stride"]').value    = stride;
  const rec = quads.pqrTable(quad); // { piece, plane, quad:{globalQ,pieceQ,planeQ,rayPair:[r1,r2],quadType,nickname} }.
  console.log("control: advsqs.js - updateAdvsqPanel() - rec", rec);

  panel.querySelector('[name="advsq-nickname"]').textContent = rec.nickname;              // Set derived fields.
  panel.querySelector('[name="advsq-plane"]').textContent = rec.plane;
  panel.querySelector('[name="advsq-quadType"]').textContent = rec.quadType;

  let maxStride = 2*perimeter + 1;
  panel.querySelector('[name="advsq-length"]').textContent = maxStride;

  let apex = "none";
  if(rec?.quadType === "edge") apex = "Apex";
  if(rec?.quadType === "face") apex = "Duplex";
  panel.querySelector('[name="advsq-quadType"]').textContent = apex;

  let tile = "";
  if(stride === 1)                  tile = "E1";
  else if(stride === perimeter + 1) tile = apex;
  else if(stride === maxStride)     tile = "E2";
  else                              tile = "Body";
  panel.querySelector('[name="advsq-tile"]').textContent = tile;
}
// Seampoint: more local functions.

