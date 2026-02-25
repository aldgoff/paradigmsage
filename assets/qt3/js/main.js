// ./assets/qt3/js/main.js

import { initController } from "./controller/controller.js";

console.log("main.js: qt3/js/main.js");

initController();

if (import.meta.env?.DEV ?? true) { // Regression tests of the model.
  import("./tests/addSpookyMove.test.js");
  import("./tests/addPlacementMove.test.js");
  import("./tests/addLoop.test.js");
  import("./tests/addCollapseMove.test.js");
  import("./tests/addScore.test.js");

  import("./tests/subSpookyMove.test.js");

  import("./tests/analyzeStateString.test.js");
  import("./tests/scoring.test.js");
  import("./tests/classicalT3.test.js");
}

console.log("--------------------");

