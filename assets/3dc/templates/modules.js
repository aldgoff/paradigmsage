/* File: modules.js
  Path: ./3dc/modules/modules.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/15/26
  UI: the export functions.
*/

// --- Load JSON ---
import modulesData from "./modules.json" assert { type: "json" };
  const modulesModule = modulesData.modules_module;
  const category  = modulesModule.category;
  // Seampoint: more objects.

// --- Build upon previous layers ---
import {getBoardSpec,} from "../foundation/coords/coords.js";

import * as planes from "../geometry/planes.js";
import * as quads  from "../geometry/quads.js";
// Seampoint: more imports.


// --- UI ---
export function UI() {
  return "whatever";
  }
// Seampoint: more global functions.

