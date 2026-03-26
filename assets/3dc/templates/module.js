/* File: templates.js
  Path: ./3dc/templates/templates.js
  Purpose: desc
  Author: Allan Goff
  Date: 3/00/26
  UI: the export functions.
 */

// --- Load module ---
import templatesData from "./module.json" assert { type: "json" };
  const templatesModule = templatesData.templates_module;
  const category  = templatesModule.category;
  const base      = templatesModule.base;
  // Seampoint: more objects.

// --- Build upon the previous layers ---
import { } from "../foundation/coords/coords.js";
// Seampoint: more imports.


// --- UI ---

export function UI() {
  return "whatever";
}
// Seampoint: more global functions.


// --- Helpers ---

// Seampoint: more local functions.

