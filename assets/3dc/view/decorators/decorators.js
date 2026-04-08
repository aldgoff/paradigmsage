/* File: decorators.js
  Path: ./3dc/view/decorators.js
  Purpose: Apply decorators to tiles.
  Author: Allan Goff
  Date: 4/00/26
  UI: the export functions.
  #ff1a1a Use FSC color interface to pick colors.
*/

// --- Load JSON ---
import decoratorsData from "./decorators.json" assert { type: "json" };
  const decoratorsModule = decoratorsData.decorators_module;
  const scales     = decoratorsModule.scales;
  const pallet     = decoratorsModule.pallet;
  const decorators = decoratorsModule.decorators;
  // Seampoint: more objects.

// --- Build upon previous layers ---
import * as quads  from "../../geometry/quads.js";  // Example import, not used.
// Seampoint: more imports.


// --- UI ---
export function decorate(color, meshTile, piece, decorator) {
  const base = color;
  const list = decorators[piece][decorator];
  const zones = resolveColors(list, pallet);
  const layers = decorateTile({ base, zones });

  layers.forEach(layer => {
    const overlay = drawInsetQuad(meshTile, layer.scale, layer.color);
    meshTile.add(overlay);   // attach to meshTile (not scene)
  });
  }

export function decorateTile({ base, zones=[] }) {
  return [base, ...zones]
    .slice(0, 5)
    .map((color, i) => ({
      color,
      scale: scales[i]
    }));
  }

export function drawInsetQuad(mesh, scale, color) {
  const THREE = window.THREE;

  const geom = new THREE.PlaneGeometry(1, 1);

  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide
  });

  const overlay = new THREE.Mesh(geom, mat);

  // --- Match tile size ---
  const box = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  box.getSize(size);

  overlay.scale.set(size.x * scale, size.z * scale, 1);

  // --- Position on top face ---
  overlay.position.set(0, size.y / 2 + 0.1, 0);

  // --- Rotate to lie flat ---
  overlay.rotation.x = -Math.PI / 2;

  return overlay;
  }

export function resolveColors(names, pallet) {
  return names.map(name => {
    const color = pallet[name];
    if (!color) {
      throw new Error(`Unknown color '${name}' in pallet`);
    }
    return color;
  });
}
// Seampoint: more global functions.

