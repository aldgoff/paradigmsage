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
  import * as game     from "../../controller/game/game.js";
  import * as cAdvsqs  from "../../controller/advsqs/advsqs.js";

  import * as state    from "../../model/state/state.js";
  import * as planes   from "../../geometry/planes/planes.js";    // resolveDstTile().
  import * as mAdvsqs  from "../../model/advsqs/advsqs.js";
  import * as mGambits from "../../model/gambits/gambits.js";
  
  import * as view     from "../../view/view.js";
  import * as tiles    from "../../view/tiles/tiles.js";
  import * as vAdvsqs  from "../../view/advsqs/advsqs.js";
  import * as vGambits from "../../view/gambits/gambits.js";
// Seampoint: more imports...

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

// --- UI ---
export function panelDispatch(payload) {
  console.log("cntrl: gambits.js - panelDispatch(payload):", payload);

  vGambits.cancelAnimation();

  const { action } = payload;

  switch (action) {
    case "freezeQ":  handleFreezeQuadrant(); break;
    case "freezeL":  handleFreezeAsLinear(); break;
    case "freezeO":  handleFreezeWithOverlaps(); break;
    case "freezeP":  handleFreezeAsAPlane(); break;
    case "delete":   handleDelete(); break;
    case "remove":   handleRemoveAll(); break;
    default: throw new Error(`Unknown gambit action ${action}.`);  break;
  }

  game.showUndoStatus();                          // Update game panel (undo).
  }

export function buildPayload(panel, action) {
  console.log("     ---------- cntrl: gambits.js");
  return { action };
}

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
function handleFreezeQuadrant() {
  // console.log("cntrl: gambits.js - handleFreezeQuadrant().");

  const currAdvsq = state.fetchCurrentState("AdvSqs"); // Get current advsq, if any.
  if(!currAdvsq) return;

  const { src, srcTile, quad, perimeter, stride, opacity } = currAdvsq;  // Informative.

  state.clearBuffer("AdvSqs");                        // Advsq: change state.
  vAdvsqs.clearAdvsq();                               // De-render. // TODO: move to view layer.
  vAdvsqs.clearAdvsqPanelParams("Q4,4");              // Update panel.

  const entry = mGambits.makeEntry(currAdvsq);        // Transform panel payload into state entry.
  applyEntry(entry);
  }

function handleFreezeAsLinear() {
  console.log("cntrl: gambits.js - handleFreezeLinear()");
  // TODO: change state - handleFreezeLinear().
  }

function handleFreezeWithOverlaps() {
  console.log("cntrl: gambits.js - handleFreezeOverlay()");
  // TODO: change state - handleFreezeOverlay().
  }

function handleFreezeAsAPlane() {
  console.log("cntrl: gambits.js - handleFreezeAsAPlane()");
  // TODO: change state - handleFreezeAsAPlane().
}

function handleDelete() {
  console.log("cntrl: gambits.js - handleDelete()");

  const active = state.getCurrentIndex("Gambits");
  if (active === 0) return;

  const idx = active - 1;

  // --- Remove from state ---
  const gambits = state.getState().Gambits;
  gambits.splice(idx, 1);

  // --- Update index ---
  state.setBufferIndex("Gambits", idx);

  // --- Rebuild view + panel ---
  rerunGambits();
  }

function handleRemoveAll() {
  console.log("cntrl: gambits.js - handleRemoveAll()");

  const active = state.getCurrentIndex("Gambits");
  if (active === 0) return;

  // --- Clear state ---
  state.clearBuffer("Gambits");

  // --- Rebuild (clears everything visually + panel) ---
  rerunGambits();
}
// Seampoint: more helper functions...

// --- Helpers ---
function applyEntry(entry) {   // Group, state, render, panel.
  console.log("cntrl: gambits.js - applyEntry(entry)", entry);

  state.pushNewGambit(entry);                     // Change state.
  const group = vGambits.makeGroup(entry);        // Recreate from entry.
  vGambits.render(group, { animate: true });      // Render.
  vGambits.addLineToPanel(entry);                 // Add line to panel.

  // TODO: remove all entries in the downstream buffers; 
  // a new gambit invalidates advsqs. ?? May happen automagically upon advsq ingest.
}
// Seampoint: more local functions...

