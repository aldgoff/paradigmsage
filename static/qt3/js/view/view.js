// View.js.

const canvas = document.getElementById("qt3-game");
const ctx = canvas.getContext("2d");

import { QT3_LAYOUT } from "../layout.js";

export function initView () { // Dev scaffolding.
  console.log("qt3/js/View/View.js");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawLayoutBounds(ctx);  // Dev scaffolding. 
  drawControls(ctx);

}

export function drawLayoutBounds(ctx, layout = QT3_LAYOUT) {
  ctx.save();
  ctx.setLineDash([6, 4]);
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 1;

  for (const key in layout) {
    const el = layout[key];
    if (!el || el.x === undefined) continue;

    ctx.strokeRect(el.x, el.y, el.w, el.h);
    ctx.fillStyle = "#888";
    ctx.font = "12px sans-serif";
    ctx.fillText(key, el.x + 4, el.y + 14);
  }

  ctx.restore();
}

// function logHitTest(label, block, x, y) { // DEPRECATED.
//   console.log(label);
//   console.log([ block.x, "<", x, "<", block.x + block.w ]);
//   console.log([ block.y, "<", y, "<", block.y + block.h ]);
// }

// canvas.addEventListener("click", e => { // DEPRECATED.
//   const rect = canvas.getBoundingClientRect();
//   const x = Math.round(e.clientX - rect.left);
//   const y = Math.round(e.clientY - rect.top);

//   const block = QT3_LAYOUT.controls;
//   const controlHit =
//     block.x <= x && x <= block.x + block.w &&
//     block.y <= y && y <= block.y + block.h

//   if (controlHit) {
//     // logHitTest("QT3_LAYOUT.controls", QT3_LAYOUT.controls, x, y);
//     let button = hitInButton(x, y);
//     if (button != null) {
//       console.log("Button:", button);
//     }
//   }
// });

// Button geometry (view-owned)
const BUTTONS = [
  { label: "New Game", enabled: true  },
  { label: "Undo",     enabled: false },
  { label: "Redo",     enabled: false },
  { label: "Load",     enabled: false },
  { label: "Help",     enabled: true  }
  ];

const BTN_H = 40;
const GAP   = 10;

// Gesture state (view-owned)
let gestureState = "IDLE";           // IDLE | PRESSED_INSIDE | PRESSED_OUTSIDE
let activeButton = null;             // index into BUTTONS
let onControlCommit = null;          // callback supplied by controller

// Public hook for controller
export function setControlHandler(fn) {
  onControlCommit = fn;
}

// Drawing
export function drawControls(ctx) {
  const { x, y, w } = QT3_LAYOUT.controls;

  ctx.save();
  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  BUTTONS.forEach((btn, i) => {
    const bx = x;
    const by = y + i * (BTN_H + GAP);

    const isActive =
      (gestureState === "PRESSED_INSIDE" && activeButton === i);

    ctx.fillStyle = btn.enabled
      ? (isActive ? "#dbe9ff" : "#f4f4f4")
      : "#dddddd";
    ctx.strokeStyle = btn.enabled
      ? (isActive ? "#4a90e2" : "#999999")
      : "#bbbbbb";

    ctx.fillRect(bx, by, w, BTN_H);
    ctx.strokeRect(bx, by, w, BTN_H);

    ctx.fillStyle = btn.enabled ? "#000" : "#777";
    ctx.fillText(btn.label, bx + w / 2, by + BTN_H / 2);
  });

  ctx.restore();
}

// Test if mouse hit in a button.
function hitInButton(x, y) {
  const { x: bx, y: by, w } = QT3_LAYOUT.controls;

  for (let i = 0; i < BUTTONS.length; i++) {
    const top = by + i * (BTN_H + GAP);
    if ((bx <= x && x <=  bx + w) 
    && (top <= y && y <= top + BTN_H)) {
      return i;
    }
  }
  return null;
}

// Pointer handlers (view-owned semantics)
export function handlePointerDown(x, y) {
  const hit = hitInButton(x, y);
  if (hit !== null && BUTTONS[hit].enabled) {
    activeButton = hit;
    gestureState = "PRESSED_INSIDE";
  }
  }

export function handlePointerMove(x, y) {
  if (gestureState === "IDLE") return;

  const hit = hitInButton(x, y);

  if (gestureState === "PRESSED_INSIDE" && hit !== activeButton) {
    gestureState = "PRESSED_OUTSIDE";
  }

  if (gestureState === "PRESSED_OUTSIDE" && hit === activeButton) {
    gestureState = "PRESSED_INSIDE";
  }
  }

export function handlePointerUp(x, y) {
  if (gestureState === "PRESSED_INSIDE" && activeButton !== null) {
    if (onControlCommit) {
      onControlCommit(BUTTONS[activeButton].label);
    }
  }

  // Reset (commit or cancel)
  gestureState = "IDLE";
  activeButton = null;
}

// State Machine:
canvas.addEventListener("mousedown", e => {
  const { x, y } = getCanvasCoords(e);
  handlePointerDown(x, y);
  drawControls(ctx); // re-render highlight
  });

canvas.addEventListener("mousemove", e => {
  const { x, y } = getCanvasCoords(e);
  handlePointerMove(x, y);
  drawControls(ctx); // re-render highlight
  });

canvas.addEventListener("mouseup", e => {
  const { x, y } = getCanvasCoords(e);
  handlePointerUp(x, y);
  drawControls(ctx); // re-render
});

function getCanvasCoords(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.round(e.clientX - rect.left),
    y: Math.round(e.clientY - rect.top)
  };
}

