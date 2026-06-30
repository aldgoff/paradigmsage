/* File: viewer.js
  Path: ./3dc/model/viewer/viewer.js
  Purpose: template for code files.
  Author: Allan Goff
  Date: 5/03/26
  Recommended access: import * as viewer from "../../model/viewer/viewer.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import viewerData from "./viewer.json" assert { type: "json" };
  const viewerModule = viewerData.viewer_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as panels   from "../../panels/panels.js";

  import * as quads  from "../../geometry/quads/quads.js";
// Seampoint: more imports...

// --- Globals ---
// Seampoint: more globals...

// --- UI ---
export function UI() {
  // console.log("model: viewer.js - UI()");
  
  return "whatever";
}

export function buttonAffordances(situation) {
  console.log("model: viewer.js - buttonAffordances(situation)", situation);

  switch (situation) {
    case "off":
      panels.enableButton("ShowTrays",       false);
      panels.enableButton("HideTrays",       false);
      panels.enableButton("ToggleAnimation", false);
      break;
    case "on":
      panels.enableButton("ShowTrays",       true);
      panels.enableButton("HideTrays",       true);
      panels.enableButton("ToggleAnimation", true);
      break;
    case "canShow":
      panels.enableButton("ShowTrays",       true);
      panels.enableButton("HideTrays",       false);
      panels.enableButton("ToggleAnimation", true);
      break;
    case "canHide":
      panels.enableButton("ShowTrays",       false);
      panels.enableButton("HideTrays",       true);
      panels.enableButton("ToggleAnimation", true);
      break;
    default:
      throw new Error(`Unknown button situation ${situation} for viewer.`);
      break;
  }
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

