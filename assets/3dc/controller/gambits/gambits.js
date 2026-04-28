/* File: gambits.js
  Path: ./3dc/gambits/gambits.js
  Purpose: Collects advsqs into a set that stays on the board - gambit analysis.
  Author: Allan Goff
  Date: 4/23/26
  Recommended access: import * as gambits.
  UI: the export functions.
*/

// --- Load JSON ---
import gambitsData from "./gambits.json" assert { type: "json" };
  const gambitsModule = gambitsData.gambits_module;
  const category  = gambitsModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
import * as game    from "../../controller/game/game.js";
import * as cAdvsqs from "../../controller/advsqs/advsqs.js";

import * as state  from "../../model/state/state.js";
import * as coords from "../../foundation/coords/coords.js";  // vtsToNotation().
import * as planes from "../../geometry/planes/planes.js";    // resolveDstTile().

import * as view     from "../../view/view.js";
import * as vAdvsqs  from "../../view/advsqs/advsqs.js";
import * as vGambits from "../../view/gambits/gambits.js";
// Seampoint: more imports...

const groupMap = new Map();

// --- UI ---
export function panelDispatch(payload) {
  const { action } = payload;
  switch (action) {
    case "freezeQ":  handleFreezeQuadrant(); break;
    case "freezeL":  handleFreezeLinear(); break;
    case "freezeO":  handleFreezeOverlap(); break;
    case "delete":   handleDelete(); break;
    default: throw new Error(`Unknown gambit action ${action}.`);  break;
  }
}
// Seampoint: more global functions...

  /* TODO: Gambit additions:
   *  1. ✅ Clear AdvSq buffer
   *  2. ✅ Render (with animation)
   *  3. Compute derived fields
   *  4. ✅ Add to scroll window
   *  5. ✅ Put resolveDstTile under test
   *  6. Move add and scale to utils
   *  7. Test aliases to AI
   *  8. If that passes, port geo into subdirs.
   *  9. ✅ Update specs
   * 10. Freeze Linear
   * 11. Freeze Overlap
   * 12. ✅ Plumbing for test suite
  */

// --- Handle Functions ---
export function handleFreezeQuadrant2() {
  console.log("cntrl: gambits.js - handleFreezeQuadrant().");

  const curr = state.fetchCurrentAdvsq();
  if(!curr) return;

  mAdvsqs.clearBuffer();      // Changes state, derenders, updates panel.
  mGambits.makeGambit(curr);  // Changes state, renders, updates panel.

  game.showUndoStatus();      // Updates game panel (undo).
}

export function handleFreezeQuadrant() {
  console.log("cntrl: gambits.js - handleFreezeQuadrant().");

  const curr = state.fetchCurrentAdvsq();
  if (!curr) return;

  const { srcTile, quad, perimeter, stride, opacity } = curr;
  const dst = planes.resolveDstTile(srcTile, quad, perimeter, stride);  // Derive dst tile.
  const src = coords.vtsToBoard(srcTile); // Convert to positional notation for onboard tiles, vts for rest.

  state.clearBuffer("AdvSqs");      // Things to update: image, undo buffer, advsq panel.
  vAdvsqs.clearAdvsq();       
  vAdvsqs.clearAdvsqPanelParams("Q4,4");

  vGambits.makeGambit(curr);
  const group = makeGambit(curr);   // Things to update: image, undo buffer, gambit panel.
  const gambit = { Q: quad, src, dst };  // Prepare gambit state data.
  const idx = state.pushNewGambit(gambit);  // Undo buffer.
  
  groupMap.set(idx, group);
  appendGambitLine(gambit, perimeter);     // Gambits panel
  vGambits.updatePanel();

  game.showUndoStatus();            // Game (undo) panel.

  return gambit;
  }
export function makeGambitFromSrcDst(gambit, opacity) { // gambit: {Q, src, dst}, opacity.
  console.log("cntrl: gambits.js - makeGambitFromSrcDst(gambit,opacity)", gambit, opacity);
    return;

  const group = view.buildAdvSqGroupFrom(gambit, opacity);

  view.context.scene.add(group);
  animateFreezeTransition(group);

  return group;
  }
export function makeGambit(specs) {
  console.log("cntrl: gambits.js - makeGambit(specs)", specs);

  const group = view.buildAdvSqGroup(specs); // {srcTile: Array(3), quad: 1, perimeter: 0, stride: 0, opacity: 0.5}

  view.context.scene.add(group);
  animateFreezeTransition(group);

  return group;
}
function animateFreezeTransition(group, duration = 0.8) {

  const overlays = group.userData?.overlays || [];
  if (overlays.length === 0) return;

  const start = performance.now();

  function step(now) {
    let t = (now - start) / (duration * 1000);
    if (t > 1) t = 1;

    const pulse = Math.sin(t * Math.PI); // 0 → 1 → 0

    for (const overlay of overlays) {
      if (!overlay.material) continue;

      overlay.material.transparent = true;
      overlay.material.opacity = pulse;
    }

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      finalize();
    }
  }

  function finalize() {
    for (const overlay of overlays) {
      if (overlay.material) {
        overlay.material.opacity = 1.0;
      }
    }
  }

  requestAnimationFrame(step);
}

/*** ----- ----- ----- ***/

function handleFreezeLinear() {
  console.log("cntrl: gambits.js - handleFreezeLinear()");
  // TODO: change state - handleFreezeLinear().
  }

function handleFreezeOverlay() {
  console.log("cntrl: gambits.js - handleFreezeOverlay()");
  // TODO: change state - handleFreezeOverlay().
  }

function handleDelete() {
  console.log("cntrl: gambits.js - handleDelete()");
  // TODO: change state - handleDelete().
}

// --- Helpers ---
function appendGambitLine(gambit, perimeter) {
  console.log("cntrl: gambits.js - appendGambitLine(gambit, perimeter).", gambit, perimeter);

  const el = document.getElementById("gambit-list");
  if (!el) return;

  const { Q, src, dst } = gambit;

  // --- freeze index ---
  const count = state.getBufferCount().Gambits;

  const area = (perimeter+1)*(perimeter+1);

  // --- column widths ---
  const idxCol  = String(count).padStart(2);    // right-aligned
  const qCol    = `Q${Q}`.padEnd(3);            // "Q37  "
  const srcCol  = String(src).padEnd(5);        // "KB4,4  "
  const dstCol  = String(dst).padEnd(8);        // allow offboard arrays
  const areaCol = String(area).padStart(2);     // right-aligned

  // --- final line ---
  const line = `${idxCol} ${qCol} ${srcCol} → ${dstCol}:${areaCol}`;

  const div = document.createElement("div");
  div.textContent = line;

  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}
// Seampoint: more local functions...

