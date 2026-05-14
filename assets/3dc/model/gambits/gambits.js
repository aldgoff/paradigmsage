/* File: gambits.js
  Path: ./3dc/gambits/gambits.js
  Purpose: desc
  Author: Allan Goff
  Date: 4/15/26
  Recommended access: import * as mGambits from ../../model/gambits/gambits.js
  UI: the export functions.
  Philosophy: Dlete a module by deleting its directory - not so much.
    controller/ model/ view/
    play.md - DOM
    main.js - regressions
    view.js - wire, build payload
    game.js - rewind, FF
    state.js - undo, redo
*/

// --- Load JSON ---
import gambitsData from "./gambits.json" assert { type: "json" };
  const gambitsModule = gambitsData.gambits_module;
// Seampoint: more objects...

// --- Build upon previous layers ---
  import * as utils    from "../../../utils/utils.js";  

  import * as state  from "../../model/state/state.js";
  import * as planes from "../../geometry/planes/planes.js";
  import * as coords from "../../foundation/coords/coords.js";
  import * as quads    from "../../geometry/quads/quads.js";
  import * as gAdvsqs  from "../../geometry/advsqs/advsqs.js";

  import * as view   from "../../view/view.js";
// Seampoint: more imports..

// --- UI ---
export function makeQuadrantEntry(advsq) {
  console.log(`model: gambits.js - makeQuadrantEntry(advsq):`, advsq);

  const { src, srcTile, quad, perimeter, stride, opacity } = advsq;

  // const src = coords.vtsToBoard(srcTile); // Convert to positional notation for onboard tiles, vts for rest.
  const dst = planes.resolveDstTile(srcTile, quad, perimeter, stride);  // Derive dst tile.
  const area = (perimeter+1)*(perimeter+1);

  const advsqs = [{ src, srcTile, quad, perimeter, stride, opacity }];
  const entry = { Q: quad,src,dst,area, advsqs }; // Prepare gambit state data.
  
  let p = "D";
  if( 1<= quad && quad <= 12)  p = "R";
  if(13<= quad && quad <= 36)  p = "B";

  const line = { symbol: "Q", value: quad, piece: p, src, dst, feedback: area };

  return {entry, line};
}

export function makeLinearEntry(advsq) {
  console.log(`model: gambits.js - makeLinearEntry(advsq):`, advsq);

  const { src, srcTile, quad, perimeter, stride, opacity } = advsq;

  const { rayPair } = quads.pqrTable(quad);
  const ray       = resolveStrideRay(advsq, rayPair);
  const quadsList = findQuadsForRay(ray);
  const quadPairs = groupByPlane(quadsList);
  const rects     = buildAdvRects(srcTile, quadPairs, perimeter, stride, opacity);

  let piece = "duke";
  if( 1<= quad && quad <= 12)  piece = "rook";
  if(13<= quad && quad <= 36)  piece = "bishop";
  let p = "D";
  if( 1<= quad && quad <= 12)  p = "R";
  if(13<= quad && quad <= 36)  p = "B";

  const dst = planes.resolveDstTile(srcTile, quad, perimeter, stride);  // Derive dst tile.

  const entry = { move: "linear", piece, src, dst, ray, advsqs: rects, opacity };

  const line = { symbol: "L", value: 1, piece: p, src, dst, feedback: ray };
  // const line = { Q: `L${p}`, src, dst, area: ray }; // Prepare gambit state data.

  return { entry, line };
}

export function fetchThisEntry(idx) {
  console.log(`model: gambits.js - fetchThisEntry(idx):`, idx);

  const len = state.getBufferLength("Gambits");
  if (idx < 0 || idx >= len) return null;

  const prev = state.getCurrentIndex("Gambits");
  state.setBufferIndex("Gambits", idx + 1);

  const entry = state.fetchCurrentState("Gambits");
  state.setBufferIndex("Gambits", prev);

  return entry;
}
// Seampoint: more global functions...

// --- Helpers ---
function resolveStrideRay(currAdvsq, rayPair) {
  console.log("cntrl: gambits.js - resolveStrideRay(currAdvsq, rayPair)", currAdvsq, rayPair);

  const { srcTile, quad, perimeter, stride } = currAdvsq;

  const advsq = gAdvsqs.AdvSq.fromQuad(srcTile, quad, perimeter);
  const perims = advsq.getPerims();
  const last = perims[perims.length - 1];

  const strideTile = last.stride[stride - 1];  // <-- actual coord

  if (utils.isSame(strideTile, last.E1)) return rayPair[0];
  if (utils.isSame(strideTile, last.E2)) return rayPair[1];

  const e2 = 2*perimeter + 1;
  throw new Error(`Stride tile was ${stride}, must be E1(1) or E2(${e2})`);
  }

function findQuadsForRay(ray) {
  console.log("cntrl: gambits.js - findQuadsForRay(ray)", ray);

  const result = [];

  for (let Q = 1; Q <= 60; Q++) {
    const rec = quads.pqrTable(Q);
    if (rec.rayPair.includes(ray)) {
      result.push(Q);
    }
  }

  return result;
  }

function groupByPlane(quadsList) {
  console.log("cntrl: gambits.js - groupByPlane(quadsList)", quadsList);

  const map = new Map();

  // --- group by plane ---
  quadsList.forEach(Q => {
    const plane = quads.quadToPlane(Q);

    if (!map.has(plane)) map.set(plane, []);
    map.get(plane).push(Q);
  });

  // --- normalize each pair (handle cyclic adjacency) ---
  const result = [];

  for (const pair of map.values()) {
    if (pair.length !== 2) {
      console.warn("Unexpected quad group:", pair);
      result.push(pair);
      continue;
    }

    let [a, b] = pair;

    // --- FIX: enforce cyclic ordering ---
    const diff = Math.abs(a - b);

    // If they wrap around (e.g. 1 & 4), flip
    if (diff > 2) {
      [a, b] = [b, a];
    }

    // Optional: enforce consistent left→right ordering via ray
    // (stronger, if needed later)

    result.push([a, b]);
  }

  return result;
  }

function buildAdvRects(srcTile, quadPairs, perimeter, stride, opacity) {
  console.log("cntrl: gambits.js - buildAdvRects(...)", srcTile, quadPairs, perimeter, stride, opacity);

  const area = (perimeter+1)*(perimeter+1);

  return quadPairs.map(pair => {
    return pair.map(Q => ({
      srcTile,
      quad: Q,
      perimeter,
      stride,
      area
    }));
  });
}
// Seampoint: more local functions...

/* TODO: Gambit additions:
 * 0. HandleLoad
 * 1. Rebuild groups on load
 * 2. No single source of registry
 * 3. Entry not canonical
 * 4. Load does not restore indexed state correctly
 * 5. Load does not use rerunGambits()
 * 6. Group creation path is unclear
 * 7. Delete by passes state API
 * 8. Hard coded UI reset values
 * 9. Panel + state desync possibility.
*/

