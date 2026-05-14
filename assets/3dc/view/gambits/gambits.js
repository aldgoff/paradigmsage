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
  group.userData.entry = entry;

  return group;
}
export function makeLinearGroup(entry) {
  console.log("view : gambits.js - makeLinearGroup(entry).", entry);

  const { move, piece, src, dst, ray, advsqs, opacity } = entry;

  const group = view.buildAdvRectGroups(entry);
  group.userData.entry = entry;

  return group;
}

export function undo(gambit) {
  const scene = view.context.scene;

  const group = scene.children.find(
    g => g.userData?.entry === gambit
  );

  if (group) {
    derenderGambit(group);
  }
  }

export function redo(gambit) {
  const group = makeGroup(gambit);

  group.userData.entry = gambit;

  render(group);
}

export function pushPanelLine(line) {
  console.log("view : gambits.js - pushPanelLine(line)", line);

  const el = document.getElementById("gambit-list");
  if(!el) return;

  const row = assembleLine(line);

  const div = document.createElement("div");
  div.textContent = row;

  // Write to the scroll box.
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
  }

export function popPanelLine() {
  console.log("view : gambits.js - popPanelLine()");

  const el = document.getElementById("gambit-list");
  if(!el) return;

  const last = el.lastElementChild;
  if(!last) return;

  el.removeChild(last);
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

export function cancelAnimation() {
  if (activeAnimation) {
    activeAnimation.cancelled = true;
    activeAnimation = null;
  }
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

function derenderGambit(group) {
  console.log("view : gambits.js - derenderGambit(...)",);
  console.log("derender entry:", group.userData.entry);
  console.log("overlays tracked:", group.userData.overlays?.length);

  if (!group) return;

  // --- Remove overlays (THIS is what clears onboard visuals) ---
  if (group.userData?.overlays) {
    group.userData.overlays.forEach(o => {
      if (o.parent) o.parent.remove(o);
    });
  }

  // ✅ INSERT HERE (right after overlay loop)

  // --- Remove any missed overlays by entry ---
  const tileMap = view.context.tileMap;

  for (const tile of tileMap.values()) {
    if (!tile.children) continue;

    tile.children
      .filter(child => child.userData?.entry === group.userData.entry)
      .forEach(child => tile.remove(child));
  }

  // --- Remove offboard tiles ---
  if (group.parent) {
    group.parent.remove(group);
  } else {
    view.context.scene.remove(group);
  }
}

function assembleLine(line) {
  const { symbol, value, piece, src, dst, feedback } = line;

  // const { Q, src, dst, area } = gambit;

  const count = state.getIndices().Gambits;

  // --- column widths ---
  const idxCol  = String(count).padStart(2);    // right-aligned
  const qCol    = `${symbol}${value} ${piece}`.padEnd(6);            // "Q37 R "
  const srcCol  = String(src).padEnd(5);        // "KB4,4  "
  const dstCol  = String(dst).padEnd(8);        // allow offboard arrays
  const areaCol = String(feedback).padStart(2);     // right-aligned

  const row = `${idxCol} ${qCol} ${srcCol} → ${dstCol}:${areaCol}`;

  return row;
}
// Seampoint: more local functions...

/* TODO: Gambit additions:
 * 1. Review rendering code.
 * 2. Upgrade rows format to new standard.
 * 3. Write updateDerived data function.
 * 4. Expose button enable functions.
 * 5. Code to extract quads from the gambit.
*/

