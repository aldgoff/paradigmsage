/* File: controller.js
  Path: ./3dc/controller/controller.js
  Purpose: The player's interface to setting up, exploring, and playing the game.
  Author: Allan Goff
  Date: 4/02/26
  Recommended access: import * as cCntrl from "../../controller/controller.js";
  UI: the export functions.
*/

/** Roles:
 * Layer: Controller (State Transition Orchestration)
 *
 * Purpose:
 * - Coordinates interaction between model and engine.
 * - Selects and applies legal transitions.
 *
 * Ontology:
 * - Does not "execute moves" in a procedural sense
 * - Resolves valid state transitions
 *
 * Responsibilities:
 * - Request manifold generation from engine
 * - Filter/select valid transitions
 * - Apply atomic state updates
 * - Manage turn sequence
 *
 * Does NOT:
 * - Define rules
 * - Compute manifolds
 * - Render UI
 *
 * Inputs:
 * - Current game state
 * - Player input
 *
 * Outputs:
 * - New canonical state
 * - Transition descriptors
 *
 * Notes:
 * - The controller must not infer legality—it must defer to the engine.
*/

// --- Load JSON ---
import controllerData from "./controller.json" assert { type: "json" };
  const controllerModule = controllerData.controller_module;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as panels   from "../panels/panels.js";

  import * as model    from "../model/model.js";

  import * as view     from "../view/view.js";
  import * as vAdvsqs  from "../view/advsqs/advsqs.js";
// Seampoint: more imports...

// --- UI ---
export function init(playBoard) {
  console.log("control.init(): 3dc/controller/controller.js");

  panels.init();
  model.init(playBoard);
  view.init(playBoard);

  vAdvsqs.setAdvsqPanelInitialParams(); // TODO: why is this here instead of in the view layer?
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

