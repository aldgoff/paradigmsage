// qt3/view/controlsView.js

import { QT3_LAYOUT } from "../layout.js";

// The js-website drawing canvas.
const canvas = document.getElementById("qt3-game");
const ctx = canvas.getContext("2d");

// Public hook for controller (passed through view.js).
let onControlCommit = null;          // callback supplied by parent view
export function setButtonHandler(fn) {
  onControlCommit = fn;
}

// Button geometry (view-owned).
const BUTTONS = QT3_LAYOUT.controls.buttons;

// Gesture state.
let gestureState = "IDLE";           // IDLE | PRESSED_INSIDE | PRESSED_OUTSIDE
let activeButton = null;             // index into BUTTONS

// Drawing: only used in view.js.
export function drawButtons() {
  const { x, y, w, gap, buttons } = QT3_LAYOUT.controls;

  ctx.save();

  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  buttons.forEach((button, i) => {
    const isActive = (gestureState === "PRESSED_INSIDE" && activeButton === i);

    drawButton(button, isActive);
  });

  ctx.restore();
  }

function drawButton(button, isActive) {
  ctx.fillStyle = button.enabled
    ? (isActive ? "#dbe9ff" : "#f4f4f4")
    : "#dddddd";

  ctx.strokeStyle = button.enabled
    ? (isActive ? "#4a90e2" : "#999999")
    : "#bbbbbb";

  ctx.fillRect(button.x, button.y, button.w, button.h);
  ctx.strokeRect(button.x, button.y, button.w, button.h);

  ctx.fillStyle = button.enabled ? "#000" : "#777";
  ctx.fillText(button.label, button.x + button.w / 2, button.y + button.h / 2);
}

// Pointer lifecycle: only used in view.js.
export function handlePointerDown(x, y) {
  const hit = hitButtonQ(x, y);
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
  const hit = hitButtonQ(x, y);

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


function hitButtonQ(x_pt, y_pt) { // Hit button?
  for (let i = 0; i < BUTTONS.length; i++) {
    const { x, y, w, h } = BUTTONS[i];

    if((x <= x_pt && x_pt <= x + w)
    && (y <= y_pt && y_pt <= y + h)) {
      return i;
    }
  }

  return null;
}

