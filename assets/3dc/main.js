// ./3dc/main.js

// import { initController } from "./controller/controller.js";

console.log("main.js: 3dc/main.js");

// initController();

if (location.hostname === "localhost") {
  console.log("Running tests...");
  // Import and run tests here.
  import("./tests/foundation/coords/coords.test.js").then(m => m.run());}

console.log("--------------------");

