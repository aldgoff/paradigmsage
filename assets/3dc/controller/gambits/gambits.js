/* File: gambits.js
  Path: ./3dc/controller/gambits/gambits.js
  Purpose: Collects advsqs into a set that stays on the board - gambit analysis.
  Author: Allan Goff
  Date: 4/23/26
  Recommended access: import * as cGambits from ../../controller/gambits/gambits.js
  UI: the export functions.
  Philosophy: Dlete a module by deleting its directory - not so much.
    controller/ model/ view/
    play.md - DOM
    main.js - regressions
    view.js - wire, build payload
    game.js - rewind, FF
    state.js - undo, redo
*/

// --- Load JSON ---
import gambitsData from "./gambits.json" assert { type: "json" };
  const gambitsModule = gambitsData.gambits_module;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as utils    from "../../../utils/utils.js";  

  import * as game     from "../../controller/game/game.js";
  import * as cAdvsqs  from "../../controller/advsqs/advsqs.js";

  import * as state    from "../../model/state/state.js";
  import * as planes   from "../../geometry/planes/planes.js";    // resolveDstTile().
  import * as quads    from "../../geometry/quads/quads.js";
  import * as gAdvsqs  from "../../geometry/advsqs/advsqs.js";
  import * as mAdvsqs  from "../../model/advsqs/advsqs.js";
  import * as mGambits from "../../model/gambits/gambits.js";
  
  import * as view     from "../../view/view.js";
  import * as tiles    from "../../view/tiles/tiles.js";
  import * as vAdvsqs  from "../../view/advsqs/advsqs.js";
  import * as vGambits from "../../view/gambits/gambits.js";
// Seampoint: more imports...

// --- UI ---
export function panelDispatch(payload) {
  console.log("cntrl: gambits.js - panelDispatch(payload):", payload);

  vGambits.cancelAnimation();

  const { action } = payload;

  switch (action) {
    case "nextPlane": handleNextPlane();                        return;
    case "expand":    handleExpand();                           return;
    case "contract":  handleContract();                         return;
    case "delete":    handleDelete();    game.showUndoStatus(); return;
    case "remove":    handleRemoveAll(); game.showUndoStatus(); return;
  }

  const currAdvsq = state.fetchCurrentState("AdvSqs"); // Get current advsq, if any.
  if(!currAdvsq) return;

  const { src, srcTile, quad, perimeter, stride, opacity } = currAdvsq;  // Informative.

  switch (action) {
    case "freezeQ":  handleFreezeQuadrant(currAdvsq); break;
    case "freezeL":  handleFreezeAsLinear(currAdvsq); break;
    case "freezeD":  handleFreezeAsDuplex(currAdvsq); break;
    case "freezeO":  handleFreezeWithOverlaps(currAdvsq); break;

    case "freezeN":  handleFreezeAsKnight(currAdvsq); break;
    case "freezeP":  handleFreezeAsPawn(currAdvsq); break;
    case "freezeK":  handleFreezeAsKing(currAdvsq); break;
    case "asAPlane": handleFreezeAsAPlane(currAdvsq); break;
    default: throw new Error(`Unknown gambit action ${action}.`);  break;
  }

  game.showUndoStatus();                          // Update game panel (undo).
  }

export function buildPayload(panel, action) {
  console.log("     ---------- cntrl: gambits.js");
  return { action };
}
// TEMPORARY:
// rerunGambits is required for undo/redo until incremental undo is implemented
export function rerunGambits() {
  console.log("cntrl: gambits.js - rerunGambits()");

  const count = state.getBufferLength("Gambits");
  const active = state.getCurrentIndex("Gambits");

  // --- Hide ALL gambits ---
  vGambits.clearGambits();

  // --- Re-render all ---
  for (let i = 0; i < active; i++) {
    const entry = mGambits.fetchThisEntry(i);
    if (!entry) continue;

    const group = vGambits.makeGroup(entry);
    vGambits.render(group);
  }

  vGambits.refreshPanel();
}
// Seampoint: more global functions...

// --- Handle Functions ---
function handleFreezeQuadrant(currAdvsq) {
  console.log("cntrl: gambits.js - handleFreezeQuadrant(currAdvsq).", currAdvsq);

  const { src, srcTile, quad, perimeter, stride, opacity } = currAdvsq;

  state.clearBuffer("AdvSqs");                        // Advsq: change state.
  vAdvsqs.removeFromScene();                          // De-render. // TODO: move to view layer.
  vAdvsqs.clearAdvsqPanelParams("Q4,4");              // Update panel.

  const { entry, line } = mGambits.makeQuadrantEntry(currAdvsq); // Transform panel payload into state entry and panel line.
  applyQuadrantEntry({ entry, line });
  }

function handleFreezeAsLinear(currAdvsq) {
  console.log("cntrl: gambits.js - handleFreezeAsLinear(currAdvsq)", currAdvsq);

  const { src, srcTile, quad, perimeter, stride, opacity } = currAdvsq;

  state.clearBuffer("AdvSqs");                        // Advsq: change state.
  vAdvsqs.removeFromScene();                          // De-render. // TODO: move to view layer.
  vAdvsqs.clearAdvsqPanelParams("Q4,4");              // Update panel.

  const { entry, line } = mGambits.makeLinearEntry(currAdvsq);
  applyLinearEntry({ entry, line });
}

// --- Helpers ---
function resolveStrideRay(currAdvsq, rayPair) {
  console.log("cntrl: gambits.js - resolveStrideRay(currAdvsq, rayPair)", currAdvsq, rayPair);

  const { srcTile, quad, perimeter, stride } = currAdvsq;

  const advsq = gAdvsqs.AdvSq.fromQuad(srcTile, quad, perimeter);
  const perims = advsq.getPerims();
  const last = perims[perims.length - 1];

  const strideTile = last.stride[stride - 1];  // <-- actual coord

  if (utils.isSame(strideTile, last.E1)) return rayPair[0];
  if (utils.isSame(strideTile, last.E2)) return rayPair[1];

  const e2 = 2*perimeter + 1;
  throw new Error(`Stride tile was ${stride}, must be E1(1) or E2(${e2})`);
  }

function findQuadsForRay(ray) {
  console.log("cntrl: gambits.js - findQuadsForRay(ray)", ray);

  const result = [];

  for (let Q = 1; Q <= 60; Q++) {
    const rec = quads.pqrTable(Q);
    if (rec.rayPair.includes(ray)) {
      result.push(Q);
    }
  }

  return result;
  }

function groupByPlane(quadsList) {
  console.log("cntrl: gambits.js - groupByPlane(quadsList)", quadsList);

  const map = new Map();

  quadsList.forEach(Q => {
    const plane = quads.quadToPlane(Q);

    if (!map.has(plane)) map.set(plane, []);
    map.get(plane).push(Q);
  });

  return [...map.values()]; // each = one rectangle (2 quads)
  }

function buildAdvRects(srcTile, quadPairs, perimeter, stride, opacity) {
  console.log("cntrl: gambits.js - buildAdvRects(...)", srcTile, quadPairs, perimeter, stride, opacity);

  const area = (perimeter+1)*(perimeter+1);

  return quadPairs.map(pair => {
    return pair.map(Q => ({
      srcTile,
      quad: Q,
      perimeter,
      stride,
      area
    }));
  });
}

function handleFreezeAsDuplex(currAdvsq) {
  console.log("cntrl: gambits.js - handleFreezeAsDuplex(currAdvsq)", currAdvsq);
  // TODO: change state - handleFreezeAsDuplex().

  // applyEntry(entry);  // Eventually.
  }

function handleFreezeWithOverlaps(currAdvsq) {
  console.log("cntrl: gambits.js - handleFreezeOverlay(currAdvsq)", currAdvsq);
  // TODO: change state - handleFreezeOverlay().

  // applyEntry(entry);  // Eventually.
}

function handleFreezeAsKnight(currAdvsq) {
  console.log("cntrl: gambits.js - handleFreezeAsKnight(currAdvsq)", );
  //TODO: Complete handleFreezeAsKnight().
 
  // applyEntry(entry);  // Eventually.
 }
function handleFreezeAsPawn(currAdvsq) {
  console.log("cntrl: gambits.js - handleFreezeAsPawn(currAdvsq)", currAdvsq);
  //TODO: Complete handleFreezeAsPawn().

  // applyEntry(entry);  // Eventually.
  }
function handleFreezeAsKing(currAdvsq) {
  console.log("cntrl: gambits.js - handleFreezeAsKing(currAdvsq)", currAdvsq);
  //TODO: Complete handleFreezeAsKing().

  // applyEntry(entry);  // Eventually.
  }
function handleFreezeAsAPlane(currAdvsq) {
  console.log("cntrl: gambits.js - handleFreezeAsAPlane(currAdvsq)", currAdvsq);
  //TODO: Complete handleFreezeAsAPlane().

  // applyEntry(entry);  // Eventually.
}

let rotation = 0; // 0-12: duke: %4=0 => all, else 1,2,3 - rook|bishop: %3=0 => all, else 1,2.
function handleNextPlane() {
  console.log("cntrl: gambits.js - handleNextPlane()");
  //TODO: Complete handleNextPlane().

  // Get current gambit.
  const entry = state.fetchCurrentState("Gambits");
  if(!entry) return;
  console.log("cntrl: gambits.js - handleNextPlane()...entry:", entry);

  // Is it a linear, duplex, or overlap gambit?
  if (!["linear", "duplex", "overlap"].includes(entry.move)) {
    return;
  }
  vGambits.planeRotation(entry, ++rotation);
  }

function handleExpand() {
  console.log("cntrl: gambits.js - handleExpand()");
  //TODO: Complete handleExpand().
  }

function handleContract() {
  console.log("cntrl: gambits.js - handleContract()");
  //TODO: Complete handleContract().
  }

function handleDelete() {
  console.log("cntrl: gambits.js - handleDelete()");
  // TODO: Write handleDelete() in cGambits.
  }

function handleRemoveAll() {
  console.log("cntrl: gambits.js - handleRemoveAll()");
  // TODO: Write handleRemoveAll() in cGambits.
}
// Seampoint: more helper functions...

// --- Helpers ---
function applyQuadrantEntry({ entry, line }) {   // Group, state, render, panel.
  console.log("cntrl: gambits.js - applyQuadrantEntry(entry)", entry);

  if(!state.isAtEnd("Gambits")) {
    const idx = state.getCurrentIndex("Gambits");
    state.truncateState("Gambits", idx);
  }
  // TODO: if not at end, branch undo buffer. 

  state.pushNewGambit(entry);                     // Change state.
  const group = vGambits.makeGroup(entry);        // Recreate from entry.
  vGambits.render(group, { animate: true });      // Render.
  vGambits.pushPanelLine(line);                   // Add line to panel.

  }

function applyLinearEntry({entry, line}) {   // Group, state, render, panel.
  console.log("cntrl: gambits.js - applyLinearEntry({entry, line})", {entry, line});
 
  // TODO: if not at end, branch undo buffer. 

  state.pushNewGambit(entry);                     // Change state.
  const group = vGambits.makeLinearGroup(entry);  // Recreate from entry.
  vGambits.render(group, { animate: true });      // Render.
  vGambits.pushPanelLine(line);                   // Append line to panel.
}
// Seampoint: more local functions...

/* TODO: Gambit additions:
  *  1. ✅ Clear AdvSq buffer
  *  2. ✅ Render (with animation)
  *  3. Compute derived fields
  *  4. ✅ Add to scroll window
  *  5. ✅ Put resolveDstTile under test
  *  6. ✅ Move add and scale and isSame to utils.
  *  7. ✅ Test aliases to AI (skipped)
  *  8. ✅ If that passes, port geo into subdirs.
  *  9. ✅ Update specs
  * 10. Freeze Linear
  * 11. Freeze Overlap
  * 12. ✅ Plumbing for test suite
*/

