// Controller.js.

import { QT3_LAYOUT } from "../layout.js";
import { initView } from "../view/view.js";

import { drawLayoutBounds } from "../view/view.js";  // Dev scaffolding. 

export function initController ({ canvas, ctx }) {
  console.log("qt3/js/controller/controller.js");

  drawLayoutBounds(ctx);  // Dev scaffolding. 

  initView();
}
