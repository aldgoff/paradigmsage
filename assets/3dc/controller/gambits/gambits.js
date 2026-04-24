/* File: gambits.js
  Path: ./3dc/gambits/gambits.js
  Purpose: Collects advsqs into a set that stays on the board - gambit analysis.
  Author: Allan Goff
  Date: 4/23/26
  Recommended access: import * as gambits.
  UI: the export functions.
*/

// --- Load JSON ---
import gambitsData from "./gambits.json" assert { type: "json" };
  const gambitsModule = gambitsData.gambits_module;
  const category  = gambitsModule.category;
  // Seampoint: more objects.

// --- Build upon previous layers ---
import * as game   from "../../controller/game/game.js";

import * as state  from "../../model/state/state.js";
import * as coords from "../../foundation/coords/coords.js";  // vtsToNotation().
import * as planes from "../../geometry/planes.js";    // resolveDstTile().
// Seampoint: more imports.


// --- UI ---
export function panelDispatch(payload) {
  const { action } = payload;
  switch (action) {
    case "freezeQ":  handleFreezeQuadrant(); break;
    case "freezeL":  handleFreezeLinear(); break;
    case "freezeO":  handleFreezeOverlap(); break;
    case "prev":     handlePrev(); break;
    case "next":     handleNext(); break;
    case "delete":   handleDelete(); break;
    case "deselect": handleDeselect(); break;
    default: throw new Error(`Unknown gambit action ${action}.`);  break;
  }
}
// Seampoint: more global functions.

// --- Handle Functions ---
function handleFreezeQuadrant() {
  console.log("cntrl: gambits.js - handleFreezeQuadrant()");

  const curr = state.fetchCurrentAdvsq();
  if (!curr) return;

  const { srcTile, quad, perimeter, stride } = curr;

  // --- derive destination ---
  const dst = planes.resolveDstTile(srcTile, quad, perimeter, stride); // TODO: YOU must implement this!

  // --- convert to notation (likely needed) ---
  const src = coords.vtsToBoard(srcTile); // TODO: Will need size of board (defaults to 8x8x8).

  const gambit = {
    Q: quad,
    src,      // Board coordinates (positional notation).
    dst       // Board if on board (KR8,8), vts if off board ([6,6,6]).
  };

  /* TODO: 3 gambit additions:
   * 1. Clear AdvSq buffer
   * 2. Render
   * 3. Compute derived fields
   * 4. Add to scroll window
   * 5. ✅ Put resolveDstTile under test
   * 6. Move add and scale to utils
   * 7. Test aliases to AI
   * 8. If that passes, port geo into subdirs.
   * 9. Update specs.
   */

  state.pushNewGambit(gambit);
  game.showUndoStatus();
}

function handleFreezeLinear() {
  console.log("cntrl: gambits.js - handleFreezeLinear()");
  // TODO: change state.
  }

function handleFreezeOverlay() {
  console.log("cntrl: gambits.js - handleFreezeOverlay()");
  // TODO: change state.
  }

function handlePrev() {
  console.log("cntrl: gambits.js - handlePrev()");
 // TODO: change state.
  }

function handleNext() {
  console.log("cntrl: gambits.js - handleNext()");
  // TODO: change state.
  }

function handleDelete() {
  console.log("cntrl: gambits.js - handleDelete()");
  // TODO: change state.
  }

function handleDeselect() {
  console.log("cntrl: gambits.js - handleDeselect()");
  // TODO: change state.
}
// Seampoint: more local functions.

