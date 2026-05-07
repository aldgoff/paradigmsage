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

// --- Globals ---
const gambitGroupRegistry = new Map();  // Holds mesh data for re-rendering gambits.

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

// Suspicious code
export function getGambitGroup(idx) {
  return gambitGroupRegistry.get(idx);
  }

export function rerunGambits() {
  console.log("cntrl: gambits.js - rerunGambits()");

  const count = state.getBufferLength("Gambits");
  const active = state.getBufferIndex().Gambits; // ← KEY LINE

  // --- Hide ALL gambits ---
  for (let i = 0; i < count; i++) {
    const group = gambitGroupRegistry.get(i);
    if (group) {
      vGambits.derenderGambit(group);
    }
  }

  // --- Re-render ACTIVE ones (usually just index 0) ---
  for (let i = 0; i < active; i++) {
    const group = gambitGroupRegistry.get(i);
    if (group) {
      vGambits.renderGambit(group); // no animation
    }
  }

  vGambits.refreshPanel();
  }

export function getLastActiveGambitIndex() {
  const count = state.getBufferIndex().Gambits;
  return count; // after undo, this is the removed one
  }
export function rebindOverlaysToBoard() {
  console.log("cntrl: gambits.js - rebindOverlaysToBoard()");

  const tileMap = view.context.tileMap;
  if (!tileMap) return;

  for (const [idx, group] of gambitGroupRegistry.entries()) {
    if (!group?.userData?.overlays) continue;

    for (const overlay of group.userData.overlays) {
      const oldTile = overlay.userData?.parentTile;
      if (!oldTile) continue;

      const coords = oldTile.userData?.coords;
      if (!coords) continue;

      // --- lookup NEW tile ---
      const newTile = tiles.getTileMesh(tileMap, coords);
      if (!newTile) {
        console.warn("Rebind failed: no tile for coords", coords);
        continue;
      }

      // --- detach from old tile (if still attached) ---
      if (overlay.parent) {
        overlay.parent.remove(overlay);
      }

      // --- rebind ---
      newTile.add(overlay);
      overlay.userData.parentTile = newTile;
    }
  }
}
// Seampoint: more global functions...

// --- Handle Functions ---
function handleFreezeQuadrant() {
  // console.log("cntrl: gambits.js - handleFreezeQuadrant().");

  const currAdvsq = state.fetchCurrentAdvsq(); // Get current advsq, if any.
  if(!currAdvsq) return;

  const { srcTile, quad, perimeter, stride, opacity } = currAdvsq;  // Informative.

  state.clearBuffer("AdvSqs");                        // Advsq: change state.
  vAdvsqs.clearAdvsq();                               // De-render.
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

  // --- Get current index ---
  const count = state.getBufferIndex().Gambits;
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
  state.setBufferIndex("Gambits", idx);

  // --- Optional: clean panel (simple version: rebuild later) ---
  const panel = document.getElementById("gambit-list");
  if (panel && panel.lastChild) {
    panel.removeChild(panel.lastChild);
  }

  // --- Update undo UI ---
  }

function handleRemoveAll() {
  console.log("cntrl: gambits.js - handleRemoveAll()");

  const count = state.getBufferIndex().Gambits;
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
}
// Seampoint: more helper functions...

// --- Helpers ---
function applyEntry(entry) {   // Group, state, render, panel.
  console.log("cntrl: gambits.js - applyEntry(entry)", entry);

  state.pushNewGambit(entry);                     // Change state.
    const idx = state.getBufferIndex().Gambits - 1; // Create and register group.
    const group = vGambits.makeGroup(entry);
    gambitGroupRegistry.set(idx, group);        // TODO: should not need both.
    vGambits.setGroupRegistry(idx, group);
  vGambits.render(group, { animate: true });      // Render.
  vGambits.addLineToPanel(entry);                 // Add line to panel.
}
// Seampoint: more local functions...

