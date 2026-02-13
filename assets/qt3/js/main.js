// main.js

import { initController } from "./controller/controller.js";

console.log("main.js: qt3/js/main.js");

initController();

if (import.meta.env?.DEV ?? true) {
  import("./tests/addPlacementMove.test.js");
  import("./tests/addCollapseMove.test.js");
  import("./tests/insertLoop.test.js");
  import("./tests/addScore.test.js");
  import("./tests/classicalT3.test.js");
}
