/* File: controller.js
  Path: ./3dc/controller/controller.js
  Purpose: The player's interface to setting up, exploring, and playing the game.
  Author: Allan Goff
  Date: 4/02/26
  Recommended access: import * as cCntrl from "../../controller/controller.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import controllerData from "./controller.json" assert { type: "json" };
  const controllerModule = controllerData.controller_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as panels   from "../panels/panels.js";
  import * as model    from "../model/model.js";
  import * as view     from "../view/view.js";
// Seampoint: more imports...

// --- Globals ---
// Seampoint: more globals...

// --- UI ---
export function init(playBoard) {
  console.log("control.init(): 3dc/controller/controller.js");

  panels.init();
  model.init(playBoard);
  view.init(playBoard);
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

