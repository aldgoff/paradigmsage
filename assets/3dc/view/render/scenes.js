/* File: scenes.js
  Path: ./3dc/view/render/scenes.js
  Purpose: Interface to the scene features of the THREE render engine.
  Author: Allan Goff
  Date: 4/09/26
  Recommended access: import * as scenes from "../../view/render/scenes.js";
  UI: the export functions.
*/

// --- Load Libraries ---
const THREE = window.THREE;

// --- Load JSON ---
import scenesData from "./scenes.json" assert { type: "json" };
  const scenesModule = scenesData.scenes_module;
  const background  = scenesModule.background;
// Seampoint: more objects...

// --- Build upon previous layers ---
// Seampoint: more imports...

// --- UI ---
export function init() {
  const scene = new THREE.Scene();
  
  scene.background = new THREE.Color(background.color); // #dcecff - a light blue background.

  return scene;
}
// Seampoint: global functions...

// --- Helpers ---
// Seampoint: more local functions...


