// Controller.js.

import { QT3_LAYOUT } from "../layout.js";
import { initView } from "../view/view.js";

import { drawLayoutBounds } from "../view/view.js";  // Dev scaffolding. 
import { drawControls } from "../view/view.js";

export function initController ({ canvas, ctx }) {
  console.log("qt3/js/controller/controller.js");

  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // drawLayoutBounds(ctx);  // Dev scaffolding. 
  // drawControls(ctx);

  initView(); // Dev scaffolding.
}
