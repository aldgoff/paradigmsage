/* File: renders.js
  Path: ./3dc/view/render/renders.js
  Purpose: Create the renderer.
  Author: Allan Goff
  Date: 4/09/26
  Recommended access: import * as renders from "../../view/render/renders.js";
  UI: the export functions.
*/

// --- Load Libraries ---
const THREE = window.THREE;

// --- Load JSON ---
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as cameras from "./cameras.js";
  import * as scenes  from "./scenes.js";
  import * as lights  from "./lights.js";
// Seampoint: more imports...

// --- UI ---
export function init(container) {
  const renderer = new THREE.WebGLRenderer({
    canvas: container,
    antialias: true
  });

  const scene  = scenes.init();                           // A light blue background.
  const camera = cameras.init(container, 1800, "neutral", [0,0,0]);  // Zoom, POV, and focalPoint (at board center).
  const light  = lights.init(scene);

  renderer.setSize(container.width, container.height);

  let lastTime = performance.now();

  function animate(now = performance.now()) {
    requestAnimationFrame(animate);

    const deltaTime = (now - lastTime) / 1000; // seconds
    lastTime = now;

    cameras.updateJitter(deltaTime);  // ← ADD THIS

    renderer.render(scene, camera);
  }
  function animate1() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  return {renderer, scene, camera};
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...
