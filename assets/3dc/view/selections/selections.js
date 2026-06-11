/* File: selections.js
  Path: ./3dc/view/selections/selections.js
  Purpose: Manage raycasting clicks for tiles, pieces, advsqs, gambits, etc.
  Author: Allan Goff
  Date: 6/04/26
  Recommended access: import * as vSelections from "../../view/selections/selections.js";
  UI: the export functions.
*/

// --- Load JSON ---
import selectionsData from "./selections.json" assert { type: "json" };
  const selectionsModule = selectionsData.selections_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as cSelections from "../../controller/selections/selections.js";
  import * as view        from "../view.js";
  import * as tiles       from "../tiles/tiles.js";
// Seampoint: more imports...

// --- Globals ---
  let inited = false; // Make initialization a latch.
// Seampoint: more globals...

// --- UI ---
export function init() {
  console.log("view: selections.js - init()");

  if(inited) throw new Error("Already inited.");
  inited = true;

  // Create the listeners once, at program start.
  addTileEventListener();   // Uses view.getContext().
  addPieceEventListener();
  // Seampoint: more listeners...

  return;
}

function addTileEventListener() {
  let clickHandler = (event) => {
    const { scene, renderer, camera, tileMap } = view.getContext();
    const coords = getTileFromClick(event, camera, scene, renderer);

    cSelections.handleTileClick(coords);
  };

  view.getContext().renderer.domElement.addEventListener("click", clickHandler);
  }

function addPieceEventListener() {
  let clickHandler = (event) => {
    const { scene, renderer, camera, tileMap } = view.getContext();
    const obj = getPieceFromClick(event, camera, scene, renderer);

    cSelections.handlePieceClick(obj);
  };

  view.getContext().renderer.domElement.addEventListener("click", clickHandler);
}

function getTileFromClick(event, camera, scene, renderer) {
  const THREE = window.THREE;

  // --- Mouse → normalized device coords (-1 to +1) ---
  const rect = renderer.domElement.getBoundingClientRect();
  const mouse = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();      // Raycaster.
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);
  if(intersects.length === 0) return null;

  let obj = intersects[0].object;               // Walk up to tile mesh (in case we hit overlay/edges).
  while(obj && !obj.userData?.isTile) {
    obj = obj.parent;
  }
  if(!obj) return null;

  return obj.userData.coords;                   // VTS coords.
  // return obj.userData.vts;                   // VTS coords <- preferred.
  }

function getPieceFromClick(event, camera, scene, renderer) {
  const THREE = window.THREE;

  const rect = renderer.domElement.getBoundingClientRect();

  const mouse = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1
  );

  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children, true);

  for(const hit of intersects) {
    let obj = hit.object;

    while(obj) {
      if(obj.userData?.isPiece)
        return obj;

      obj = obj.parent;
    }
  }

  return null;
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

