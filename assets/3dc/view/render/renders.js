/* File: renders.js
  Path: ./3dc/view/renders.js
  Purpose: Creat the renderer.
  Author: Allan Goff
  Date: 4/09/26
  UI: the export functions.
*/

export function init(container, scene, camera) {
  const renderer = new THREE.WebGLRenderer({
    canvas: container,
    antialias: true
  });

  renderer.setSize(container.width, container.height);
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();

  return renderer;
}

