// ./assets/qt3/js/main.js

import { initController } from "./controller/controller.js";

console.log("main.js: qt3/js/main.js");

const isPlayPage = document.getElementById("qt3-game");

if (isPlayPage) {
  initController();
}

// if (import.meta.env?.DEV ?? true) { // Regression tests of the model.
if (location.hostname === "localhost") {
  console.log("Running tests...");
  // Import and run module tests here.
  import("./tests/addSpookyMove.test.js");
  import("./tests/addPlacementMove.test.js");
  import("./tests/addLoop.test.js");
  import("./tests/addCollapseMove.test.js");
  import("./tests/addScore.test.js");

  import("./tests/subSpookyMove.test.js");

  import("./tests/analyzeStateString.test.js");
  import("./tests/scoring.test.js");
  import("./tests/classicalT3.test.js");
  
  import("./tests/parse.test.js");
  import("./tests/collapse.test.js");
  import("./tests/grammar.test.js");
  import("./tests/statusMsgs.test.js");
  import("./tests/tokens.test.js");
}

console.log("--------------------");

