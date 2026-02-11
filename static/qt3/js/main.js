// main.js

console.log("qt3/js/main.js - THIS");

const canvas = document.getElementById("qt3-game");
const ctx = canvas.getContext("2d");

import { initController } from "./controller/controller.js";

initController({ canvas, ctx });
