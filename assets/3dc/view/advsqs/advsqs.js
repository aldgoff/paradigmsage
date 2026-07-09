/* File: advsqs.js
  Path: ./3dc/view/advsqs/advsqs.js
  Purpose: Place the decorators on the board for the advsq.
  Author: Allan Goff
  Date: 4/15/26
  Recommended access: import * as vAdvsqs from "../../view/advsqs/advsqs.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import advsqsData from "./advsqs.json" assert { type: "json" };
  const advsqsModule = advsqsData.advsqs_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as utils  from "../../../utils/debug.js";

  import * as state    from "../../model/state/state.js";
  import * as coords   from "../../foundation/coords/coords.js";
  import * as planes   from "../../geometry/planes/planes.js";
  import * as quads    from "../../geometry/quads/quads.js";
  import * as overlaps from "../../geometry/overlaps/overlaps.js";
  import * as advsqs   from "../../geometry/advsqs/advsqs.js";

  import * as view       from "../view.js";
  import * as decorators from "../decorators/decorators.js";
  import * as cameras    from "../render/cameras.js";
  import * as renders    from "../render/renders.js";
// Seampoint: more imports...

// --- Globals ---
  let advsqPanelInitialParams = null;
  let currAdvsqGroup = null;
// Seampoint: more globals...

// --- UI ---
export function clearAdvsqs() {
  console.log("view : advsqs.js - clearAdvsqs()");

  setAdvsqPanelInitialParams();

  if(!currAdvsqGroup) return;

  if(currAdvsqGroup.userData?.overlays) {  // Remove overlays from ALL tiles (board + offboard).
    currAdvsqGroup.userData.overlays.forEach(o => {
      if (o.parent) o.parent.remove(o);
    });
  }
  view.getContext().scene.remove(currAdvsqGroup);  // Remove offboard tiles (group children).

  currAdvsqGroup = null;
  }

export function removeFromScene() {
  console.log("view : advsqs.js - removeFromScene():");

  if (!currAdvsqGroup) return;

  if(currAdvsqGroup.userData?.overlays) {  // Remove overlays from ALL tiles (board + offboard).
    currAdvsqGroup.userData.overlays.forEach(o => {
      if (o.parent) o.parent.remove(o);
    });
  }

  view.getContext().scene.remove(currAdvsqGroup);  // Remove offboard tiles (group children).

  currAdvsqGroup = null;
  }

export function render(advsq) {
  console.log("view : advsqs.js - render(advsq)", advsq);

  if(!advsq) return;

  makeAdvsq(advsq);
  } 

export function renderKnight(entry) {
  console.log("view : advsqs.js - renderKnight(entry)", entry);

  if(!entry) return;

  makeKnightShell(entry);
  } 

export function refreshPanel(advsq) {
  console.log("view : advsqs.js - refreshPanel(advsq):", advsq);

  const panel = document.getElementById("advsq-window");
  if (!panel) return;

  const { srcTile, quad, perimeter, stride, opacity } = advsq;

  let derived = null;                                     // Compute derived fields.
  if(0<= quad && quad <= 60)
    derived = computeAdvsqDerived({quad, perimeter, stride});
  else
    derived = computeKnightDerived(quad, perimeter, stride);

  panel.querySelector('[name="advsq-nickname"]').textContent  = derived.nickname;     // Update quad derived fields.
  panel.querySelector('[name="advsq-pieceQuad"]').textContent = derived.pieceQuad;
  panel.querySelector('[name="advsq-planeQuad"]').textContent = derived.planeQuad;
  panel.querySelector('[name="advsq-plane"]').textContent     = derived.plane;
  panel.querySelector('[name="advsq-quadType"]').textContent  = derived.quadType;

  panel.querySelector('[name="advsq-length"]').textContent   = derived.length;        // Update perimeter derived fields.
  panel.querySelector('[name="advsq-area"]').textContent     = derived.area;
  panel.querySelector('[name="advsq-onboard"]').textContent  = derived.onboard;
  
  panel.querySelector('[name="advsq-strideType"]').textContent  = derived.strideType; // Update stride derived fields.
  panel.querySelector('[name="advsq-moveType"]').textContent    = derived.moveType;
  panel.querySelector('[name="advsq-overlap"]').textContent     = derived.overlap;
  panel.querySelector('[name="advsq-piece"]').textContent       = derived.piece;

  const srcTileStr = coords.vtsToBoard(advsq.srcTile);
  panel.querySelector('[name="advsq-src"]').value          = srcTileStr;              // Update the primary fields.
  panel.querySelector('[name="advsq-quad"]').value         = quad
  panel.querySelector('[name="advsq-perimeter"]').value    = perimeter;
  panel.querySelector('[name="advsq-stride"]').value       = stride;
  panel.querySelector('[name="advsq-opacity"]').value      = opacity;
  }

export function refreshEntry(entry) {
  console.log("view : advsqs.js - refreshEntry(entry):", entry);
  
  clearAdvsqPanelParams("KR4,4"); // Just to prove load is working.

  // const advsq = entry; // Same code as in Setup, Moves, & Gambits.
  // refreshPanel(advsq);
}

export function setAdvsqPanelInitialParams() {
  advsqPanelInitialParams = getAdvsqPanelParams();
  }

export function getAdvsqPanelInitialParams() {
  return advsqPanelInitialParams;
  }

export function clearAdvsqPanelParams(srcTile) {
  console.log("view : advsqs.js - clearAdvsqPanelParams(srcTile):", srcTile); // srcTile: positional notation.

  const panel = document.getElementById("advsq-window");
  if (!panel) return;

  panel.querySelector('[name="advsq-nickname"]').textContent  = "";       // Update quad derived fields.
  panel.querySelector('[name="advsq-pieceQuad"]').textContent = 0;
  panel.querySelector('[name="advsq-planeQuad"]').textContent = 0;
  panel.querySelector('[name="advsq-plane"]').textContent     = "";
  panel.querySelector('[name="advsq-quadType"]').textContent  = "";

  panel.querySelector('[name="advsq-length"]').textContent   = 0;         // Update perimeter derived fields.
  panel.querySelector('[name="advsq-area"]').textContent     = 0;   
  panel.querySelector('[name="advsq-onboard"]').textContent  = 0;
  
  panel.querySelector('[name="advsq-strideType"]').textContent  = "";     // Update stride derived fields.
  panel.querySelector('[name="advsq-moveType"]').textContent    = "";
  panel.querySelector('[name="advsq-overlap"]').textContent     = "";
  panel.querySelector('[name="advsq-piece"]').textContent       = "";

  panel.querySelector('[name="advsq-src"]').value          = srcTile;     // Update the primary fields.
  panel.querySelector('[name="advsq-quad"]').value         = 1;
  panel.querySelector('[name="advsq-perimeter"]').value    = 0;
  panel.querySelector('[name="advsq-stride"]').value       = 0;
  // panel.querySelector('[name="advsq-opacity"]').value      = params.opacity;

  return;
  }

export function setAdvsqPanelParams(params) {
  console.log("view : advsqs.js - setAdvsqPanelParams(params):", utils.snapshot(params));

  const panel = document.getElementById("advsq-window");
  if (!panel) return;

  const quad      = params.quad;                                                    // Use the passed in primary fields.
  const perimeter = params.perimeter;;
  const stride    = params.stride;

  const derived = computeAdvsqDerived({quad, perimeter, stride});                   // Compute derived fields.

  panel.querySelector('[name="advsq-nickname"]').textContent  = derived.nickname;     // Update quad derived fields.
  panel.querySelector('[name="advsq-pieceQuad"]').textContent = derived.pieceQuad;
  panel.querySelector('[name="advsq-planeQuad"]').textContent = derived.planeQuad;
  panel.querySelector('[name="advsq-plane"]').textContent     = derived.plane;
  panel.querySelector('[name="advsq-quadType"]').textContent  = derived.quadType;

  panel.querySelector('[name="advsq-length"]').textContent   = derived.length;        // Update perimeter derived fields.
  panel.querySelector('[name="advsq-area"]').textContent     = derived.area;
  panel.querySelector('[name="advsq-onboard"]').textContent  = derived.onboard;
  
  panel.querySelector('[name="advsq-strideType"]').textContent  = derived.strideType; // Update stride derived fields.
  panel.querySelector('[name="advsq-moveType"]').textContent    = derived.moveType;
  panel.querySelector('[name="advsq-overlap"]').textContent     = derived.overlap;
  panel.querySelector('[name="advsq-piece"]').textContent       = derived.piece;

  const srcTileStr = coords.vtsToBoard(params.srcTile);
  panel.querySelector('[name="advsq-src"]').value          = srcTileStr;            // Update the primary fields.
  panel.querySelector('[name="advsq-quad"]').value         = params.quad;
  panel.querySelector('[name="advsq-perimeter"]').value    = params.perimeter;
  panel.querySelector('[name="advsq-stride"]').value       = params.stride;
  panel.querySelector('[name="advsq-opacity"]').value      = params.opacity;
  }

export function setLevelSep(levelSep) {
  console.log("view : advsqs.js - setLevelSep(levelSep):", levelSep);

  if(!currAdvsqGroup) return;

  view.reprojectGroup(currAdvsqGroup, levelSep);
}
// Seampoint: more global functions...

// --- Helpers ---
function computeAdvsqDerived({ quad, perimeter, stride }) {
  // console.log("view : advsqs.js - computeAdvsqDerived()", { quad, perimeter, stride });

  // --- normalize types ---
  const q = Number(quad);
  const k = Number(perimeter);
  const s = Number(stride);

  const quadDerives = quadDerived(q,k,s);
  const perimDerives = perimDerived(q,k,s);
  const strideDerives = strideDerived(q,k,s);

  return {
    ...quadDerives,
    ...perimDerives,
    ...strideDerives
  };
  }

function quadDerived(q, k, s) {
  const rec = quads.pqrTable(q);
  const nickname = rec?.nickname ?? "";
  const plane    = rec?.plane ?? "";
  const quadType = rec?.quadType ?? "";

  const pieceQuad = quads.quadToPieceQuad(q);   // 1-12/24.
  const planeQuad = quads.quadToPlaneQuad(q);   // 1-4/6.

  return { nickname, plane, quadType, pieceQuad, planeQuad };
  }

function perimDerived(q, k, s) {
  const length = 2 * k + 1;
  const area = (k+1)*(k+1);
  let onboard = area; // Area of an advsq should be between 1 and area.

  const panel = document.getElementById("advsq-window");
  const srcTile = panel.querySelector('[name="advsq-src"]')?.value;
  const source = coords.normalizeTileToVts(srcTile);
  const advSq = advsqs.AdvSq.fromQuad(source, q, k);

  onboard = advSq.getOnboardCount();

  return { length, area, onboard };
  }

function strideDerived(q, k, s) {
  const rec = quads.pqrTable(q);  // { piece, plane, quad:{globalQ,pieceQ,planeQ,rayPair:[r1,r2],quadType,nickname}
  const maxStride = 2 * k + 1;

  let strideType = "";                                    // Tile: source|E1|Body|Apex|Duplex|E2.
  let apex = "Apex";
  let body = "Body"
  if(rec?.quadType === "face") { 
    apex = "Duplex";
    const shell = k/3;
    if(k%3 === 0 && (s === shell+1 || s === 2*k+1 - shell))
      body = "Third";
  }
  if (s === 0)              strideType = "Source";
  else if (s === 1)         strideType = "E1";
  else if (s === k + 1)     strideType = apex;
  else if (s === maxStride) strideType = "E2";
  else                      strideType = body;

  let moveType = "quadrant";                        // Move type: quadrant|linear|duplex.
  if(strideType === "E1" || strideType === "E2")
    moveType = "linear";
  else if(strideType === "Duplex") { // Duke quad.
    moveType = "duplex";
  }

  let overlap = "qtile";                            // Overlap: source|end2|end3|body|apex|brook|qtile|hotspot|Feynman.
  const basePiece = quads.quadToPiece(q);
  if(s === 0) overlap = "source";
  else {
    let quadType = "all";
    if(rec?.quadType === "edge") quadType = "edge";
    if(rec?.quadType === "face") quadType = "face";
    overlap = overlaps.getOverlapType(basePiece, quadType, k, s-1);
  }

  let piece = "";                                   // Piece: rook|bishop|duke|stack|queen
  if(     overlap === "qtile" || overlap === "Feynman") piece = "stack"
  else if(overlap === "brook" || overlap === "hotspot") piece = "queen"
  else                                                  piece = basePiece;

  return { strideType, moveType, overlap, piece };
}

function computeKnightDerived(quad, perimeter, stride) {
  console.log("view : advsqs.js - computeKnightDerived(quad, perimeter, stride):", quad, perimeter, stride);

  const panel = document.getElementById("advsq-window");
  const srcTile = panel.querySelector('[name="advsq-src"]')?.value;
  const source = coords.normalizeTileToVts(srcTile);

  console.log("*** quads: 61-66: faces");
  console.log("*** quads: 67-78: edges");
  console.log("*** quads: 79-84: corners");
  console.log("*** quads: 85-85: all 24 knight moves");

  console.log("*** TODO: write view : advsqs.js - computeKnightDerived().");

  let plane;
  if(61 <= quad && quad <= 66) {
    plane = "faces";
    }
  else if(67 <= quad && quad <= 78) {
    plane = "edges";
    }
  else if(79 <= quad && quad <= 84) {
    plane = "corners";
    }
  else if(85 <= quad && quad <= 85) {
    plane = "all";
  }
  else throw new Error(`Unsupported knight quad ${quad}.`);

  const derived = { nickname: "knight", plane, moveType: "jump", piece: "knight" };
  // TODO: knight nicknames, if any?

  return derived;
}

function makeAdvsq(advsq) {
  console.log("view : advsqs.js - makeAdvsq(advsq):", advsq);

  removeFromScene();  // Derenders.

  const group = view.buildAdvSqGroup(advsq);

  view.getContext().scene.add(group);
  currAdvsqGroup = group;
}

function makeKnightShell(advsq) {
  console.log("view : advsqs.js - makeKnightShell(advsq):", advsq);

  removeFromScene();  // Derenders.

  const group = view.buildKnightShellGroup(advsq);

  view.getContext().scene.add(group);
  currAdvsqGroup = group;
  }

function getAdvsqPanelParams() {
  // console.log("view : advsqs.js - getAdvsqPanelParams():");

  const panel = document.getElementById("advsq-window");
  if (!panel) return;

  const params = {
    srcTile:   panel.querySelector('[name="advsq-src"]')?.value,
    quad:      panel.querySelector('[name="advsq-quad"]')?.value,
    perimeter: panel.querySelector('[name="advsq-perimeter"]')?.value,
    stride:    panel.querySelector('[name="advsq-stride"]')?.value,
    opacity:   panel.querySelector('[name="advsq-opacity"]')?.value,
  };

  return params;
  }
// Seampoint: more local functions...

