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
const BUTTONS = [
  { label: "New Game", enabled: true  },
  { label: "Rerun",    enabled: false },
  { label: "Undo",     enabled: false },
  { label: "Redo",     enabled: false },
  { label: "Load",     enabled: true  },
  { label: "Help",     enabled: true  }
  ];

const BTN_H = 40;
const GAP = 10;

// Gesture state.
let gestureState = "IDLE";           // IDLE | PRESSED_INSIDE | PRESSED_OUTSIDE
let activeButton = null;             // index into BUTTONS

// Drawing: only used in view.js.
export function drawButtons() {
  const { x, y, w, gap, buttons } = QT3_LAYOUT.controls;
  console.log("Button", buttons, gap);

  ctx.save();

  ctx.font = "14px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // let yy = y;
  // buttons.forEach((button, i) => {
  //   console.log("Button", button.name, button.h);
  //   const bx = x;
  //   const by = y + i * (button.h + gap);

  //   const isActive =
  //     (gestureState === "PRESSED_INSIDE" && activeButton === i);

  //   ctx.fillStyle = button.enabled
  //     ? (isActive ? "#dbe9ff" : "#f4f4f4")
  //     : "#dddddd";

  //   ctx.strokeStyle = button.enabled
  //     ? (isActive ? "#4a90e2" : "#999999")
  //     : "#bbbbbb";

  //   ctx.fillRect(bx, yy, button.w, button.h);
  //   ctx.strokeRect(bx, yy, button.w, button.h);

  //   ctx.fillStyle = button.enabled ? "#000" : "#777";
  //   ctx.fillText(button.label, bx + button.w / 2, yy + button.h / 2);

  //   yy += button.h + gap;
  // });

  // let button = buttons[1];
  // button.enabled = false;
  // drawButton(button);

  BUTTONS.forEach((btn, i) => {
    const bx = x;
    const by = y + i * (BTN_H + gap);

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

// function drawButton(button, ctx) {
//   ctx.strokeStyle = button.enabled
//     ? (isActive ? "#4a90e2" : "#999999")
//     : "#bbbbbb";
//   ctx.fillStyle = button.enabled ? "#000" : "#777";
//   ctx.fillText(button.label, button.x + button.w / 2, button.y + button.h / 2);

//   ctx.fillStyle = button.enabled
//     ? (isActive ? "#dbe9ff" : "#f4f4f4")
//     : "#dddddd";
//   ctx.fillStyle = button.enabled ? "#000" : "#777";
//   ctx.fillText(button.label, button.x + button.w / 2, button.y + button.h / 2);
// }

// Pointer lifecycle: only used in view.js.
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

