/* File: selections.js
  Path: ./3dc/controller/selections/selections.js
  Purpose: Manage raycasting clicks for tiles, pieces, advsqs, gambits, etc.
  Author: Allan Goff
  Date: 6/04/26
  Recommended access: import * as cSelections from "../../controller/selections/selections.js";
  UI: the export functions.
*/

// --- Load JSON ---
import selectionsData from "./selections.json" assert { type: "json" };
  const selectionsModule = selectionsData.selections_module;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as view    from "../../view/view.js";
  import * as vBoards from "../../view/boards/boards.js";
  import * as tiles   from "../../view/tiles/tiles.js";
// Seampoint: more imports...

// --- Globals ---
// Seampoint: more globals...

// --- UI ---
export function handleTileClick(coords) { // TODO: make this a state machine.
  console.log("cntrl: selections.js - handleTileClick(coords)", coords);
  
  if(!coords) {
    console.log("Ray casting: click off board.");
    return;
  }

  const meshTile = tiles.getTileMesh(view.context.tileMap, coords);
  if(!meshTile) throw new Error("This should be impossible?");

  vBoards.toggleDecorator(meshTile);  // TODO: POC, not final logic.

  // TODO: cntrl: selections.js - handleTileClick(coords).

  return;
  }
// Seampoint: more global functions...

// --- Helpers ---
function toggleDecorator(meshTile) {
  if (meshTile.userData.decorated) {      // --- REMOVE overlays ---
    meshTile.userData.overlays.forEach(o => meshTile.remove(o));
    meshTile.userData.overlays = [];
    meshTile.userData.decorated = false;
  } else {                                // --- ADD overlays ---
    const face = meshTile.userData.faceColor;
    const layers = decorators.applyBaseZones({
      base: face,
      zones: ["#111111", "#111111", face, face ]
    });

    const overlays = layers.map(layer => {
      const circle = decorators.drawInsetCircle(meshTile, layer.scale, layer.color);
      meshTile.add(circle);
      return circle;
    });

    meshTile.userData.overlays = overlays;
    meshTile.userData.decorated = true;
  }
}
// Seampoint: more local functions...

