/* File: moves.js
  Path: ./3dc/model/moves/moves.js
  Purpose: The moves portion of the state of the game.
  Author: Allan Goff
  Date: 4/30/26
  Recommended access: import * as mMoves from "../../model/moves/moves.js";
  UI: the export functions.
  Philosophy: Delete a module by deleting its directory - not so much.
    controller/ model/ view/
    play.md - DOM
    main.js - regressions
    view.js - wire, build payload
    game.js - rewind, FF
    state.js - undo, redo
*/

// --- Load JSON ---
import movesData from "./moves.json" assert { type: "json" };
  const movesModule = movesData.moves_module;
  const move  = movesModule.Move;
// Seampoint: more objects...

// --- Dependencies ---
  import * as state  from "../../model/state/state.js";
// Seampoint: more imports...

// --- UI ---
export function makeEntry(payload) {
  console.log(`model: moves.js - makeEntry(payload):`, payload);

  let { action, player, piece, src, dst, sec, capture, opts } = payload;

  const index = state.getIndices()["Moves"] + 1;
  let turn = Math.floor((index + 1) / 2);

  let entry = { turn, player, piece, src, dst, action, sec };

  return entry;
}
// Seampoint: more global functions...

// --- Helpers ---
// Seampoint: more local functions...

