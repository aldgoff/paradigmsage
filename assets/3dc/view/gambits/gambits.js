/* File: gambits.js
  Path: ./3dc/view/gambits/gambits.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/15/26
  Recommended access: import * as vGambits from ../../view/gambits/gambits.js
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
  const category  = gambitsModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as cGambits from "../../controller/gambits/gambits.js";

  import * as state  from "../../model/state/state.js";
  import * as coords from "../../foundation/coords/coords.js";

  import * as view   from "../../view/view.js";
// Seampoint: more imports...

/* TODO: Gambit additions:
 * 1. Review rendering code.
 * 2. Upgrade rows format to new standard.
 * 3. Write updateDerived data function.
 * 4. Expose button enable functions.
 * 5. Code to extract quads from the gambit.
*/

// --- Globals ---
let activeAnimation = null;

// --- UI ---
export function makeGroup(entry) {
  console.log("view : gambits.js - makeGroup(entry).", entry);

  const { Q, src, dst, area, advsqs } = entry;

  const advsq = advsqs?.[0];
  if (!advsq) {
    console.error("Invalid gambit entry (no advsq):", entry);
    return;
  }

  const group = view.buildAdvSqGroup(advsq); // {srcTile: Array(3), quad: 1, perimeter: 0, stride: 0, opacity: 0.5}

  return group;
}

export function undo() {
  cGambits.rerunGambits();
  }

export function redo() {
  cGambits.rerunGambits();
}

export function addLineToPanel(gambit) {
  console.log("view : gambits.js - addLineToPanel(gambit)", gambit);

  const el = document.getElementById("gambit-list");
  if (!el) return;

  const { Q, src, dst, area } = gambit;

  // --- freeze index ---
  const count = state.getIndices().Gambits;

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

  // --- Dim future entries ---
  const idx = count - 1; // current entry index
  const thisIdx = state.getBufferLength("Gambits") - 1;
  if (thisIdx >= count) {
    div.style.opacity = "0.3";
  }

  el.appendChild(div);
  el.scrollTop = el.scrollHeight;

  return;
  }

export function refreshPanel() {
  // console.log("view : gambits.js - refreshPanel()");
  const el = document.getElementById("gambit-list");
  if (!el) return;

  const count = state.getIndices().Gambits;

  const children = el.children;

  for (let i = 0; i < children.length; i++) {
    if (i < count) {
      children[i].style.opacity = "1.0";   // active
    } else {
      children[i].style.opacity = "0.3";   // future
    }
  }
}

export function clear() { // Canonical arch.
  console.log("view : gambits.js - clearGambits()");
  // TODO: write clearGambits().
}

export function clearGambits() {  // Still in use.
  console.log("view : gambits.js - clearGambits()");

  const scene = view.context.scene;

  // --- 1. Remove ALL groups (offboard + containers) ---
  scene.children
    .filter(obj => obj.userData?.overlays)
    .forEach(group => {
      derenderGambit(group);
    });

  // --- 2. Remove ANY stray overlays still attached to tiles ---
  const tileMap = view.context.tileMap;
  if (!tileMap) return;

  for (const tile of tileMap.values()) {
    if (!tile.children) continue;

    tile.children
      .filter(child => child.userData?.isOverlay)
      .forEach(overlay => {
        tile.remove(overlay);
      });
  }
}

export function cancelAnimation() {
  if (activeAnimation) {
    activeAnimation.cancelled = true;
    activeAnimation = null;
  }
}

export function render(group, { animate = false } = {}) {
  console.log("view : gambits.js - render( not shown)");

  view.context.scene.add(group);

  // --- Re-attach overlays ---
  if (group.userData?.overlays) {
    group.userData.overlays.forEach(o => {
      const tile = o.userData?.parentTile;
      if (tile && !o.parent) {
        tile.add(o);
      }
    });
  }

  if (animate) {
    animateFreezeTransition(group);
  }
  }

export function derenderGambit(group) {
  console.log("view : gambits.js - derenderGambit(...)",);

  if (!group) return;

  // --- Remove overlays (THIS is what clears onboard visuals) ---
  if (group.userData?.overlays) {
    group.userData.overlays.forEach(o => {
      if (o.parent) o.parent.remove(o);
    });
  }

  // --- Remove offboard tiles ---
  if (group.parent) {
    group.parent.remove(group);
  } else {
    view.context.scene.remove(group);
  }
  }

export function clearGambit(group) {
  console.log("view : gambits.js - clearGambit(group)", group);

  if (!group) return;

  // --- Remove overlays from ALL tiles (board + offboard) ---
  if (group.userData?.overlays) {
    group.userData.overlays.forEach(o => {
      if (o.parent) o.parent.remove(o);
    });
  }

  // --- Remove the group itself (offboard tiles, etc.) ---
  if (group.parent) {
    group.parent.remove(group);
  } else {
    // fallback (shouldn't usually happen, but safe)
    view.context.scene.remove(group);
  }
  }

export function updatePanel(gambit) {
  console.log("view : gambits.js - updatePanel(gambit)", gambit);

  const el = document.getElementById("gambit-list");
  if (!el) return;

  const { Q, src, dst, area } = gambit;

  // --- freeze index ---
  const count = state.getIndices().Gambits;

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

  // --- Dim future entries ---
  const idx = count - 1; // current entry index

  const thisIdx = state.getBufferLength("Gambits") - 1;

  if (thisIdx >= count) {
    div.style.opacity = "0.3";
  }

  el.appendChild(div);
  el.scrollTop = el.scrollHeight;

  return;
}
// Seampoint: more global functions...

//--- Helpers ---
function applyOpacity(obj, opacity) {
  if (obj.material) {
    obj.material.transparent = true;
    obj.material.opacity = opacity;
  }

  if (obj.children && obj.children.length > 0) {
    obj.children.forEach(child => applyOpacity(child, opacity));
  }
  }

function animateFreezeTransition(group, duration = 0.8) {
  const overlays = group.userData?.overlays || [];
  if (overlays.length === 0) return;

  // --- CANCEL any existing animation ---
  if (activeAnimation) {
    activeAnimation.cancelled = true;
  }

  const anim = { cancelled: false };
  activeAnimation = anim;

    const start = performance.now();

  function step(now) {
    if (anim.cancelled) return;   // 🔥 STOP if invalidated

    let t = (now - start) / (duration * 1000);
    if (t > 1) t = 1;

    const pulse = Math.sin(t * Math.PI); // 0 → 1 → 0

    for (const overlay of overlays) {
      applyOpacity(overlay, pulse);
    }

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      finalize();
    }
  }

  function finalize() {
    if (anim.cancelled) return;
    for (const overlay of overlays) {
      applyOpacity(overlay, 1.0);
    }
  }

  requestAnimationFrame(step);
}
// Seampoint: more local functions...

