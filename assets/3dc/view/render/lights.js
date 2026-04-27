/* File: lights.js
  Path: ./3dc/view/render/lights.js
  Purpose: Interface to the lighting features of the THREE render engine.
  Author: Allan Goff
  Date: 4/09/26
  Recommended access: import * as lights.
  UI: the export functions.
*/

// --- Load Libraries ---
const THREE = window.THREE;

// --- Load JSON ---
import lightsData from "./lights.json" assert { type: "json" };
  const lightsModule = lightsData.lights_module;
  const key     = lightsModule.key;
  const fill    = lightsModule.fill;
  const ambient = lightsModule.ambient;
// Seampoint: more objects...

// --- UI ---
export function init(scene) {
  // Key light (main direction), fill light, and ambient (positionless).
  // TODO: LIGHTING NOT WORKING WELL, only need for shiny metal edges.
  // No change if this function is never called.

  let light = null; // Place holder for now.

  const keylight = new THREE.DirectionalLight(key.color, key.intensity);          // Main direction.
  keylight.position.set(key.position);
  scene.add(keylight);

  const fillLight = new THREE.DirectionalLight(fill.color, fill.intensity);       // Fill light (softens shadows).
  fillLight.position.set(fill.position);
  scene.add(fillLight);

  const ambientLight = new THREE.AmbientLight(ambient.color, ambient.intensity);  // Ambient (base visibility)
  scene.add(ambientLight);

  return light;
}
// Seampoint: global functions...

