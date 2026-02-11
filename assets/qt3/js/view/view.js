// qt3/view/view.js

import { QT3_LAYOUT } from "../layout.js";
import {
  drawControls,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp,
  setControlHandler
} from "./controlsView.js";

const canvas = document.getElementById("qt3-game");
const ctx = canvas.getContext("2d");

export function initView() {
  render();
  installPointerHandlers();
}

export function setViewControlHandler(fn) {
  setControlHandler(fn);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLayoutBounds(ctx);
  drawControls(ctx);
}

function installPointerHandlers() {
  canvas.addEventListener("mousedown", e => {
    const { x, y } = getCanvasCoords(e);
    if (handlePointerDown(x, y)) render();
  });

  canvas.addEventListener("mousemove", e => {
    const { x, y } = getCanvasCoords(e);
    if (handlePointerMove(x, y)) render();
  });

  canvas.addEventListener("mouseup", e => {
    const { x, y } = getCanvasCoords(e);
    handlePointerUp(x, y);
    render();
  });
}

function getCanvasCoords(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.round(e.clientX - rect.left),
    y: Math.round(e.clientY - rect.top)
  };
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
