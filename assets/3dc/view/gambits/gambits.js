/* File: gambits.js
  Path: ./3dc/view/gambits/gambits.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/15/26
  Recommended access: import * as vGambits.
  UI: the export functions.
*/

// --- Load JSON ---
import gambitsData from "./gambits.json" assert { type: "json" };
  const gambitsModule = gambitsData.gambits_module;
  const category  = gambitsModule.category;
// Seampoint: more objects.

// --- Build upon previous layers ---
import * as state   from "../../model/state/state.js";

import * as view   from "../../view/view.js";
// Seampoint: more imports.

// --- UI ---
export function UI() {  // Under test, rather stupid.
  console.log("view: gambits.js - UI()");
  
  return "whatever";
}

export function renderGambit(group, { animate = false } = {}) {
  console.log("view: gambits.js - renderGambit(group)", group);

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
export function renderGambit2(group) {
  console.log("view: gambits.js - renderGambit(group)", group);

  view.context.scene.add(group);

  // --- Re-attach overlays to tiles ---
  if (group.userData?.overlays) {
    group.userData.overlays.forEach(o => {
      const tile = o.userData?.parentTile;
      if (tile && !o.parent) {
        tile.add(o);
      }
    });
  }

  animateFreezeTransition(group);
}
export function renderGambit1(group) {
  console.log("view: gambits.js - renderGambit(group)", group);

  view.context.scene.add(group);
  animateFreezeTransition(group);

  return
}

export function derenderGambit(group) {
  console.log("view: gambits.js - derenderGambit(group)", group);

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
export function derenderGambit2(group) {
  console.log("view: gambits.js - derenderGambit(group)", group);

  if (!group) return;

  // --- ONLY remove offboard tiles ---
  if (group.parent) {
    group.parent.remove(group);
  } else {
    view.context.scene.remove(group);
  }

  // DO NOT touch overlays
}
export function derenderGambit1(group) {
  console.log("view: gambits.js - derenderGambit(group)", group);

  if (!group) return;

  // --- Hide overlays ---
  if (group.userData?.overlays) {
    group.userData.overlays.forEach(o => {
      if (o.parent) o.parent.remove(o);
    });
  }

  // --- Detach group from scene ---
  if (group.parent) {
    group.parent.remove(group);
  } else {
    view.context.scene.remove(group);
  }
}

export function clearGambit(group) {
  console.log("view: gambits.js - clearGambit(group)", group);

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

export function refreshPanel() {
  const el = document.getElementById("gambit-list");
  if (!el) return;

  const count = state.getBufferCount().Gambits;

  const children = el.children;

  for (let i = 0; i < children.length; i++) {
    if (i < count) {
      children[i].style.opacity = "1.0";   // active
    } else {
      children[i].style.opacity = "0.3";   // future
    }
  }
}

export function updatePanel(gambit) {
  console.log("view: gambits.js - updatePanel(gambit)", gambit);

  const el = document.getElementById("gambit-list");
  if (!el) return;

  const { Q, src, dst, area } = gambit;

  // --- freeze index ---
  const count = state.getBufferCount().Gambits;

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

  const start = performance.now();

  function step(now) {
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
    for (const overlay of overlays) {
      applyOpacity(overlay, 1.0);
    }
  }

  requestAnimationFrame(step);
}
// Seampoint: more local functions...

