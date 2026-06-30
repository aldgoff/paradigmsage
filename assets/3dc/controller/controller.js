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
  import * as mSetup   from "../model/setup/setup.js";
  import * as mMoves   from "../model/moves/moves.js";
  import * as mGambits from "../model/gambits/gambits.js";
  import * as mAdvsqs  from "../model/advsqs/advsqs.js";
  import * as mViewer  from "../model/viewer/viewer.js";

  import * as view     from "../view/view.js";
// Seampoint: more imports...

// --- Globals ---
// Seampoint: more globals...

// --- UI ---
export function init(playBoard) {
  console.log("cntrl: controller.js - init(playBoard):", playBoard);

  panels.init();
  model.init(playBoard);
  view.init(playBoard);

  mSetup.buttonAffordances("makeBoard");
  mMoves.buttonAffordances("off");
  mGambits.buttonAffordances("off");
  mAdvsqs.buttonAffordances("build");
  mViewer.buttonAffordances("off");

  panels.diagnostics();
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

