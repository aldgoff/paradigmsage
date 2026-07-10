/* File: advsqs.js
  Path: ./3dc/model/advsqs/advsqs.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/15/26
  Recommended access: import * as mAdvsqs from "../../model/advsqs/advsqs.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import advsqsData from "./advsqs.json" assert { type: "json" };
  const advsqsModule = advsqsData.advsqs_module;
  const category  = advsqsModule.category;
// Seampoint: more objects...

// --- Dependencies ---
  import * as panels   from "../../panels/panels.js";

  import * as vAdvsqs  from "../../view/advsqs/advsqs.js";
// Seampoint: more imports...

// --- Globals ---
// Seampoint: more globals...

// --- UI ---
export function reset() {
  console.log("model: advsqs.js - reset()");

  vAdvsqs.clearAdvsqs();
}

export function makeEntry(payload) {
  console.log(`model: advsqs.js - makeEntry(payload):`, payload);

  let { action, src, srcTile, quad, perimeter, stride, opacity } = payload;  // Informative.

  const entry = payload;

  return entry;
}

export function buttonAffordances(situation) {
  console.log("model: advsqs.js - buttonAffordances(situation)", situation);

  if(     situation === "on") {         // Enable all panel buttons.
    panels.enableButton("place",     true);
    panels.enableButton("remove",    true);
    panels.enableButton("grow",      true);
    panels.enableButton("shrink",    true);

    panels.enableButton("nextQuad",  true);
    panels.enableButton("nextPlane", true);
    panels.enableButton("nextPiece", true);
    }
  else if(situation === "default") {         // Place or grow (implied place).
    buttonAffordances("off");
    panels.enableButton("place",     true);
    panels.enableButton("grow",      true);
    panels.enableButton("nextPiece", true);
    }
  else if(situation === "build") {      // Initial values, ready to build advsqs.
    buttonAffordances("off");
    panels.enableButton("place",     true);
    panels.enableButton("grow",      true);
    }
  else if(situation === "src-tile") {   // Single tile, perimeter 0, src tile.
    buttonAffordances("off");
    panels.enableButton("remove",    true);
    panels.enableButton("grow",      true);
    panels.enableButton("nextQuad",  true);
    panels.enableButton("nextPlane", true);
    panels.enableButton("nextPiece", true);
    }
  else if(situation === "adv-sq") {     // Advsq.
    buttonAffordances("off");
    panels.enableButton("remove",    true);
    panels.enableButton("grow",      true);
    panels.enableButton("shrink",    true);
    panels.enableButton("nextQuad",  true);
    panels.enableButton("nextPlane", true);
    panels.enableButton("nextPiece", true);
    }
  else if(situation === "off") {        // Disable all panel buttons.
    panels.enableButton("place",     false);
    panels.enableButton("remove",    false);
    panels.enableButton("grow",      false);
    panels.enableButton("shrink",    false);

    panels.enableButton("nextQuad",  false);
    panels.enableButton("nextPlane", false);
    panels.enableButton("nextPiece", false);
    }
  else { throw new Error(`Unknown button situation ${situation} for advsqs.`); }
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

/* TODO: QC checklist
  1. tbd
*/

