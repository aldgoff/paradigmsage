// qt3/view/controlsView.js

import { QT3_LAYOUT } from "../layout.js";

// Button geometry (view-owned).
const BUTTONS = [
  { label: "New Game", enabled: true  },
  { label: "Undo",     enabled: false },
  { label: "Redo",     enabled: false },
  { label: "Load",     enabled: false },
  { label: "Help",     enabled: true  }
  ];

const BTN_H = 40;
const GAP   = 10;

// Gesture state.
let gestureState = "IDLE";           // IDLE | PRESSED_INSIDE | PRESSED_OUTSIDE
let activeButton = null;             // index into BUTTONS
let onControlCommit = null;          // callback supplied by parent view

// Public hook for controller (passed through view.js).
export function setControlHandler(fn) {
  onControlCommit = fn;
}

// Drawing.
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

// Hit testing.
function hitTestButton(x, y) {
  const { x: bx, y: by, w } = QT3_LAYOUT.controls;

  for (let i = 0; i < BUTTONS.length; i++) {
    const top = by + i * (BTN_H + GAP);

    if ((bx <= x && x <= bx + w)
    && (top <= y && y <= top + BTN_H)) {
      return i;
    }
  }
  return null;
}

// Pointer lifecycle:
export function handlePointerDown(x, y) {
  const hit = hitTestButton(x, y);
  if (hit !== null && BUTTONS[hit].enabled) {
    activeButton = hit;
    gestureState = "PRESSED_INSIDE";
    return true;
  }
  return false;
  }

export function handlePointerMove(x, y) {
  if (gestureState === "IDLE") return false;

  const prevState = gestureState;
  const hit = hitTestButton(x, y);

  if (gestureState === "PRESSED_INSIDE" && hit !== activeButton) {
    gestureState = "PRESSED_OUTSIDE";
  }

  if (gestureState === "PRESSED_OUTSIDE" && hit === activeButton) {
    gestureState = "PRESSED_INSIDE";
  }

  return gestureState !== prevState;
  }

export function handlePointerUp(x, y) {
  let committed = false;

  if (gestureState === "PRESSED_INSIDE" && activeButton !== null) {
    if (onControlCommit) {
      onControlCommit(BUTTONS[activeButton].label);
    }
    committed = true;
  }

  gestureState = "IDLE";
  activeButton = null;

  return committed;
  }
