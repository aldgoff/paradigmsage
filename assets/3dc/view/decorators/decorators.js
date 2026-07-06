/* File: decorators.js
  Path: ./3dc/view/decorators/decorators.js
  Purpose: Apply decorators to tiles.
  Author: Allan Goff
  Date: 4/08/26
  Recommended access: import * as vDecorators from "../../view/decorators/decorators.js";
  UI: the export functions.
  #ff1a1a Use FSC color interface to pick colors.
*/

// --- Load JSON ---
  import decoratorsData from "./decorators.json" assert { type: "json" };
  const decoratorsModule = decoratorsData.decorators_module;
  const scales     = decoratorsModule.scales;
  const pallet     = decoratorsModule.pallet;
  const decorators = decoratorsModule.decorators;
// Seampoint: more objects...

// --- Dependencies ---
// Seampoint: more imports...

// --- UI ---
export function module() {
  return decoratorsModule;
}

export function decorate(baseColor, meshTile, piece, decoratorName, zOffset=0.00) {
  // console.log("view : decorators.js - decorate(baseColor, meshTile, piece, decoratorName)", baseColor, meshTile, piece, decoratorName);
  const defRaw = decorators[piece][decoratorName];
  if (!defRaw || Object.keys(defRaw).length === 0) {
    return []; // Silently ignore json placeholders like "_trailing"
  }

  const resolved = resolveDefinition(defRaw, pallet);

  const overlays = renderDecorator(meshTile, baseColor, resolved, zOffset);

  return overlays;
  }

export function applyBaseZones({ base, zones=[] }) {
  return [base, ...zones]
    .slice(0, 5)
    .map((color, i) => ({
      color,
      scale: scales[i]
    }));
  }

export function drawInsetQuad(mesh, scale, color, zOffset=0.00) { // For source, body, end1,2,3, and apex tiles.
  const THREE = window.THREE;
  const geom = new THREE.PlaneGeometry(1, 1);
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.95,
    side: THREE.DoubleSide
  });

  const overlay = new THREE.Mesh(geom, mat);            // New mesh.

  const box = new THREE.Box3().setFromObject(mesh);     // Match tile size.
  const size = new THREE.Vector3();
  box.getSize(size);

  overlay.scale.set(size.x * scale, size.z * scale, 1);     // Scale.
  overlay.position.set(0, size.y / 2 + 0.12 + zOffset, 0);  // Position on top face.

  overlay.rotation.x = -Math.PI / 2;                        // Rotate to lie flat.

  return overlay;
  }

export function drawInsetDualDiamonds(mesh, scale, def) {
  const THREE = window.THREE;
  const group = new THREE.Group();

  const box = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  box.getSize(size);

  // --- 1. Background (body fill) ---
  if (def.background) {
    const bgGeom = new THREE.PlaneGeometry(1, 1);
    const bgMat = new THREE.MeshBasicMaterial({
      color: def.background,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });

    const bg = new THREE.Mesh(bgGeom, bgMat);

    bg.scale.set(size.x * scale, size.z * scale, 1);
    bg.position.set(0, size.y / 2 + 0.09, 0);
    bg.rotation.x = -Math.PI / 2;

    group.add(bg);
  }

  // --- 2. Diamonds along diagonal ---
  const positions = [
    [-0.18, -0.18],  // bottom-left → top-right diagonal
    [ 0.18,  0.18]
  ];

  const sides = ["left", "right"];

  sides.forEach((side, i) => {
    const colors = def[side];  // e.g. ["black", "red"]

    colors.forEach((color, j) => {
      const geom = new THREE.PlaneGeometry(1, 1);
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
      });

      const diamond = new THREE.Mesh(geom, mat);

      // --- Outer bigger, inner smaller ---
      const shrink = 1 - j * 0.4;   // 1.0, 0.6, etc.

      diamond.scale.set(
        size.x * scale * 0.63* shrink,
        size.z * scale * 0.63* shrink,
        1
      );

      diamond.rotation.set(-Math.PI / 2, 0, Math.PI / 2);

      diamond.position.set(
        positions[i][0] * size.x,
        size.y / 2 + 0.11 + j * 0.01, // slight lift to avoid z-fighting
        positions[i][1] * size.z
      );

      group.add(diamond);
    });
  });

  return group;
  }

export function drawInsetTriDiamonds(mesh, scale, def) {
  const THREE = window.THREE;
  const group = new THREE.Group();

  const box = new THREE.Box3().setFromObject(mesh);
  const size = new THREE.Vector3();
  box.getSize(size);

  // --- 1. Background ---
  if (def.background) {
    const bgGeom = new THREE.PlaneGeometry(1, 1);
    const bgMat = new THREE.MeshBasicMaterial({
      color: def.background,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide
    });

    const bg = new THREE.Mesh(bgGeom, bgMat);

    bg.scale.set(size.x * scale, size.z * scale, 1);
    bg.position.set(0, size.y / 2 + 0.09, 0);
    bg.rotation.x = -Math.PI / 2;

    group.add(bg);
  }

  // --- 2. Positions (diagonal spread, 3 points) ---
  const positions = [
    [-0.35, -0.35],  // left
    [ 0.0,   0.0 ],  // center
    [ 0.35,  0.35]   // right
  ];

  const sides = ["left", "center", "right"];

  sides.forEach((side, i) => {
    const colors = def[side];
    if (!colors) return;

    colors.forEach((color, j) => {
      const geom = new THREE.PlaneGeometry(1, 1);
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.95,
        side: THREE.DoubleSide
      });

      const diamond = new THREE.Mesh(geom, mat);

      // --- Layered scaling (outer → inner) ---
      const shrink = 1 - j * 0.4;

      diamond.scale.set(
        size.x * scale * 0.6 * shrink,
        size.z * scale * 0.6 * shrink,
        1
      );

      // --- Rotate flat + diamond ---
      diamond.rotation.set(-Math.PI / 2, 0, Math.PI / 2);

      diamond.position.set(
        positions[i][0] * size.x,
        size.y / 2 + 0.11 + j * 0.01,
        positions[i][1] * size.z
      );

      group.add(diamond);
    });
  });

  return group;
  }

export function drawInsetCircle(mesh, scale, color, zOffset=0) { // For src & dst tiles, toggled by mouse clicks.
  // console.log("view : decorators.js - drawInsetCircle(mesh, scale, color, zOffset=0)", mesh, scale, color, zOffset=0);
  const THREE = window.THREE;
  const geom = new THREE.CircleGeometry(0.5, 32);
  const mat = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.95,
    side: THREE.DoubleSide
  });

  const circle = new THREE.Mesh(geom, mat);               // New mesh.

  const box = new THREE.Box3().setFromObject(mesh);       // Match tile size.
  const size = new THREE.Vector3();
  box.getSize(size);

  circle.scale.set(size.x * scale, size.z * scale, 1);    // Scale.
  circle.position.set(0, size.y / 2 + 0.12 + zOffset, 0); // Position on top face.
  circle.rotation.x = -Math.PI / 2;                       // Rotate to lie flat.

  return circle;
}

export function resolveColors(names, pallet) {  // Convert pallet color names to hexadecimal.
  // console.log("view : decorators.js - resolveColors(names, pallet)", names, pallet);
  return names.map(name => {
    const color = pallet[name];
    if (!color) {
      throw new Error(`Unknown color '${name}' in pallet`);
    }
    return color;
  });
}
// Seampoint: more global functions...

// --- Helpers ---
function resolveDefinition(def, pallet) {
  // --- CASE 1: linear array ---
  if (Array.isArray(def)) {
    return {
      type: "linear",
      zones: resolveColors(def, pallet)
    };
  }

  // --- CASE 2: structured object ---
  if (typeof def === "object") {
    const out = {};

    for (const key in def) {
      if (Array.isArray(def[key])) {
        out[key] = resolveColors(def[key], pallet);
      } else {
        out[key] = pallet[def[key]];
      }
    }

    // classify type
    if (out.left && out.right && !out.center) {
      return { type: "dual", ...out };
    }

    if (out.left && out.center && out.right) {
      return { type: "tri", ...out };
    }

    return { type: "custom", ...out };
  }

  throw new Error("Invalid decorator definition");
  }

function renderDecorator(meshTile, baseColor, def, zOffset=0.00) {
  const overlays = [];

  switch (def.type) {

    case "linear": {
      const layers = applyBaseZones({
        base: baseColor,
        zones: def.zones
      });

      layers.forEach(layer => {
        const overlay = drawInsetQuad(meshTile, layer.scale, layer.color, zOffset);
        meshTile.add(overlay);
        overlays.push(overlay);
      });

      break;
    }

    case "dual": {
      const group = drawInsetDualDiamonds(meshTile, scales[1], def);
      meshTile.add(group);
      overlays.push(group);
      break;
    }

    case "tri": {
      const group = drawInsetTriDiamonds(meshTile, scales[1], def);
      meshTile.add(group);
      overlays.push(group);
      break;
    }

    case "stride": {
      const group = drawInsetCircle(meshTile, scales[1], def);
      meshTile.add(group);
      overlays.push(group);
      break;
    }

    default:
      throw new Error(`Unsupported decorator type '${def.type}'`);
  }

  return overlays;
}
// Seampoint: more local functions...

