// View.js.

import { QT3_LAYOUT } from "../layout.js";

export function initView () {
  console.log("qt3/js/View/View.js");
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
