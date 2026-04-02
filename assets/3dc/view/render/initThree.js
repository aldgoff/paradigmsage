/* File: initThree.js
  Path: ./3dc/initThree/initThree.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/02/26
  UI: the export functions.
*/

// --- Load Libraries ---
// import * as THREE from "three";
// import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
const THREE = window.THREE;
// --- Load JSON ---
// Seampoint: more objects...

// --- Build upon previous layers ---
// Seampoint: more imports...


// --- UI ---
export function initThree(container) {
  const scene = new THREE.Scene();

  const camera = new THREE.OrthographicCamera(
    -500, 500, 500, -500,
    1, 2000
  );

  camera.position.set(400, 400, 800);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);

  container.appendChild(renderer.domElement);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  animate();

  return { scene, camera, renderer };
}
// Seampoint: more global functions...

