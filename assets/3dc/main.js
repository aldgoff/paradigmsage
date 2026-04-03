// ./3dc/main.js

import * as control from "./controller/controller.js";

console.log("main.js: 3dc/main.js");

const isPlayBoard = document.getElementById("3dc-game");
const isPlayUI    = document.getElementById("3dc-ui");

if (isPlayBoard && isPlayUI) {
  control.init();
}

if (location.hostname === "localhost") {
  console.log("Running tests...");
  // Import and run module tests here.
  import("./tests/templates/module.test.js").then(m => m.run());

  import("./tests/foundation/coords.test.js").then(m => m.run());
  import("./tests/foundation/colors.test.js").then(m => m.run());
  import("./tests/foundation/unitCells.test.js").then(m => m.run());
  import("./tests/foundation/rays.test.js").then(m => m.run());

  import("./tests/geometry/planes.test.js").then(m => m.run());
  import("./tests/geometry/quads.test.js").then(m => m.run());
  import("./tests/geometry/perims.test.js").then(m => m.run());
  import("./tests/geometry/overlapTiles.test.js").then(m => m.run());
  import("./tests/geometry/advSqs.test.js").then(m => m.run());
  // Seampoint: more module tests.
}

console.log("--------------------");

