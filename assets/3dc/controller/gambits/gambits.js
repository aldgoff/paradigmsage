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
// Seampoint: more imports.


// --- UI ---
export function panelDispatch(payload) {
  const { action } = payload;
  switch (action) {
    case "freeze":   handleFreeze(); break;
    case "prev":     handlePrev(); break;
    case "next":     handleNext(); break;
    case "delete":   handleDelete(); break;
    case "deselect": handleDeselect(); break;
    default: throw new Error(`Unknown gambit action ${action}.`);  break;
  }
}
// Seampoint: more global functions.

// --- Handle Functions ---
function handleFreeze() {
  console.log("cntrl: gambits.js - handleFreeze()");

  const curr = state.fetchCurrentAdvsq();
  if (!curr) return;

  const { srcTile, quad, perimeter, stride } = curr;

  // --- derive destination ---
  const dstTile = [2,0,0];  // Made up until function below is written.
  // const dstTile = planes.resolveTile(srcTile, quad, perimeter, stride); // TODO: YOU must implement this!

  // --- convert to notation (likely needed) ---
  const src = coords.vtsToBoard(srcTile); // TODO: Will need size of board (defaults to 8x8x8).
  const dst = coords.vtsToBoard(dstTile);

  const gambit = {
    Q: quad,
    src,
    dst
  };

  state.pushNewGambit(gambit);
  game.showUndoStatus();
}

function handleFreeze1() {
  console.log("cntrl: gambits.js - handleFreeze()");
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

