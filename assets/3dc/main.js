// ./3dc/main.js
/* File: main.js
  Path: ./3dc/main.js
  Purpose: Entry point for game and for regression tests.
  Author: Allan Goff
  Date: 4/02/26
  UI: the export functions.
*/

import * as control from "./controller/controller.js";

console.log("main.js: 3dc/main.js");

const playBoard = document.getElementById("3dc-board"); // 3D canvas (Three render engine).

if (playBoard) {
  control.init(playBoard);
}

if (location.hostname === "localhost") {
  console.log("Running tests...");
  // Import and run module tests here.
  import("./tests/templates/modules.test.js").then(m => m.run());

  import("./tests/foundation/coords.test.js").then(m => m.run());
  import("./tests/foundation/colors.test.js").then(m => m.run());
  import("./tests/foundation/unitCells.test.js").then(m => m.run());
  import("./tests/foundation/rays.test.js").then(m => m.run());

  import("./tests/geometry/planes.test.js").then(m => m.run());
  import("./tests/geometry/quads.test.js").then(m => m.run());
  import("./tests/geometry/perims.test.js").then(m => m.run());
  import("./tests/geometry/overlapTiles.test.js").then(m => m.run());
  import("./tests/geometry/advSqs.test.js").then(m => m.run());

  import("./tests/model/state.test.js").then(m => m.run());
  import("./tests/controller/gambits.test.js").then(m => m.run());
  import("./tests/view/gambits.test.js").then(m => m.run());
  // Seampoint: more module tests.
}

console.log("--------------------");

