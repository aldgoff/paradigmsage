/* File: templates.js
  Path: ./3dc/templates/templates.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/00/26
  UI: the export functions.
*/

// --- Load JSON ---
import templatesData from "./module.json" assert { type: "json" };
  const templatesModule = templatesData.templates_module;
  const category  = templatesModule.category;
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

