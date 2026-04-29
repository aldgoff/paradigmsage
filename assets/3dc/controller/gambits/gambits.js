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

import * as state   from "../../model/state/state.js";
import * as coords  from "../../foundation/coords/coords.js";  // vtsToNotation().
import * as planes  from "../../geometry/planes/planes.js";    // resolveDstTile().
import * as mAdvsqs from "../../model/advsqs/advsqs.js";
import * as mGambits from "../../model/gambits/gambits.js";
 
import * as view     from "../../view/view.js";
import * as vAdvsqs  from "../../view/advsqs/advsqs.js";
import * as vGambits from "../../view/gambits/gambits.js";
// Seampoint: more imports...

const gambitGroupRegistry = new Map();

// --- UI ---
export function panelDispatch(payload) {
  const { action } = payload;
  switch (action) {
    case "freezeQ":  handleFreezeQuadrant(); break;
    case "freezeL":  handleFreezeLinear(); break;
    case "freezeO":  handleFreezeOverlap(); break;
    case "delete":   handleDelete(); break;
    case "remove":   handleRemoveAll(); break;
    default: throw new Error(`Unknown gambit action ${action}.`);  break;
  }
}

export function getGambitGroup(idx) {
  return gambitGroupRegistry.get(idx);
}

  /* TODO: Gambit additions:
   *  1. ✅ Clear AdvSq buffer
   *  2. ✅ Render (with animation)
   *  3. Compute derived fields
   *  4. ✅ Add to scroll window
   *  5. ✅ Put resolveDstTile under test
   *  6. Move add and scale to utils
   *  7. ✅ Test aliases to AI (skipped)
   *  8. ✅ If that passes, port geo into subdirs.
   *  9. ✅ Update specs
   * 10. Freeze Linear
   * 11. Freeze Overlap
   * 12. ✅ Plumbing for test suite
  */

// --- Handle Functions ---
export function handleFreezeQuadrant() {
  console.log("cntrl: gambits.js - handleFreezeQuadrant().");

  const curr = state.fetchCurrentAdvsq(); // Get current advsq, if any.
  if(!curr) return;

  state.clearBuffer("AdvSqs");                        // Advsq: change state.
  vAdvsqs.clearAdvsq();                               // De-render.
  vAdvsqs.clearAdvsqPanelParams("Q4,4");              // Update panel.

  const {gambit, group} = mGambits.makeGambit(curr);  // Gambit: create.

  state.pushNewGambit(gambit);                        // Change state.
  const idx = state.getBufferCount().Gambits - 1;

  gambitGroupRegistry.set(idx, group);
  vGambits.renderGambit(group, { animate: true });    // Render.
  vGambits.updatePanel(gambit);                       // Update panel.

  game.showUndoStatus();                              // Update game panel (undo).
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

  // --- Get current index ---
  const count = state.getBufferCount().Gambits;
  if (count === 0) return;

  const idx = count - 1;

  // --- Remove group from scene ---
  const group = gambitGroupRegistry.get(idx);
  console.log("cntrl: gambits.js - handleDelete()...group, idx", group, idx);
  if (group) {
    vGambits.clearGambit(group);
    gambitGroupRegistry.delete(idx);
  }

  // --- Remove from state buffer ---
  const gambits = state.getState().Gambits;
  gambits.splice(idx, 1);

  // --- Update buffer count ---
  state.setBufferCount("Gambits", idx);

  // --- Optional: clean panel (simple version: rebuild later) ---
  const panel = document.getElementById("gambit-list");
  if (panel && panel.lastChild) {
    panel.removeChild(panel.lastChild);
  }

  // --- Update undo UI ---
  game.showUndoStatus();
}

function handleRemoveAll() {
  console.log("cntrl: gambits.js - handleRemoveAll()");

  const count = state.getBufferCount().Gambits;
  if (count === 0) return;

  // --- Remove all groups from scene ---
  for (let i = 0; i < count; i++) {
    const group = gambitGroupRegistry.get(i);
    if (group) {
      vGambits.clearGambit(group);
    }
  }

  // --- Clear registry ---
  gambitGroupRegistry.clear();

  // --- Clear state buffer ---
  state.clearBuffer("Gambits");

  // --- Clear panel ---
  const panel = document.getElementById("gambit-list");
  if (panel) {
    panel.textContent = "";
  }

  // --- Update undo UI ---
  game.showUndoStatus();
}
function handleRemoveAll1() {
  console.log("cntrl: gambits.js - handleRemoveAll()");
  // TODO: change state - handleDelete().
}

// --- Helpers ---
// Seampoint: more local functions...

