/* File: compasses.js
  Path: ./3dc/compasses/compasses.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/27/26
  Recommended access: import * as compasses.
  UI: the export functions.
*/

// --- Load JSON ---
import compassesData from "./compasses.json" assert { type: "json" };
  const compassesModule = compassesData.compasses_module;
  const category  = compassesModule.category;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as game     from "../../controller/game/game.js";

  import * as vGambits from "../../view/gambits/gambits.js";
// Seampoint: more imports...

// --- UI ---
export function panelDispatch(payload) {
  console.log("cntrl: compasses.js - panelDispatch(payload):", payload);

  vGambits.cancelAnimation();

  const { action, 
    rays,
    apexes,
  } = payload;

  switch (action) {
    case "rays":     handleRays(payload); break;
    case "apexes":   handleApexes(payload); break;
    default: throw new Error(`Unknown compasses action ${action}, payload ${JSON.stringify(payload)}.`);
  }

  game.showUndoStatus();    // Show undo buffer status in game panel.
}

export function buildPayload(panel, action) {
  console.log("     ---------- cntrl: compasses.js");
  return { action };
}

// Seampoint: more global functions...

// --- Helpers ---
function handleRays(payload) {
  console.log("cntrl: compasses.js - handleRays(payload):", payload);
  }

function handleApexes(payload) {
  console.log("cntrl: compasses.js - handleApexes(payload):", payload);
}
// Seampoint: more local functions...

