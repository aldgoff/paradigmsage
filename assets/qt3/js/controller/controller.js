// Controller.js.

import { QT3_LAYOUT } from "../layout.js";
import { initView } from "../view/view.js";

// import { drawLayoutBounds } from "../view/view.js";  // Dev scaffolding. 
// import { drawControls } from "../view/view.js";

export function initController ({ canvas, ctx }) {
  console.log("qt3/js/controller/controller.js");

  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // drawLayoutBounds(ctx);  // Dev scaffolding. 
  // drawControls(ctx);

  initView(); // Dev scaffolding.
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
