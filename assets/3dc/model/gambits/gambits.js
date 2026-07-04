/* File: gambits.js
  Path: ./3dc/modelgambits/gambits.js
  Purpose: State for gambits.
  Author: Allan Goff
  Date: 4/15/26
  Recommended access: import * as mGambits from "../../model/gambits/gambits.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import gambitsData from "./gambits.json" assert { type: "json" };
  const gambitsModule = gambitsData.gambits_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as panels  from "../../panels/panels.js";
  import * as utils   from "../../../utils/utils.js";  

  import * as state   from "../../model/state/state.js";
  import * as planes  from "../../geometry/planes/planes.js";
  import * as rays    from "../../foundation/rays/rays.js";
  import * as coords  from "../../foundation/coords/coords.js";
  import * as quads   from "../../geometry/quads/quads.js";
  import * as gAdvsqs from "../../geometry/advsqs/advsqs.js";

  import * as view     from "../../view/view.js";
  import * as vGambits from "../../view/gambits/gambits.js";
// Seampoint: more imports..

// --- Globals ---
// Seampoint: more globals...

// --- UI ---
export function reset() {
  console.log("model: gambits.js - reset()");

  vGambits.clearGambits();
}

export function makeQuadrantEntry(advsq) {
  console.log(`model: gambits.js - makeQuadrantEntry(advsq):`, advsq);

  const { src, srcTile, quad, perimeter, stride, opacity } = advsq; // src & dst.
  const dst = planes.resolveDstTile(srcTile, quad, perimeter, stride);
  const area = (perimeter+1)*(perimeter+1);
  
  const { rayPair } = quads.pqrTable(quad);                         // Ray.

  let piece = "duke"; let p = "D";                                  // Symbol.
  if( 1<= quad && quad <= 12) { piece = "rook";    p = "R";}
  if(13<= quad && quad <= 36) { piece = "bishop";  p = "B";}
  const value  = quad;

  const advsqs = [{ src, srcTile, quad, perimeter, stride, area }]; // Advsqs

  const gambit = state.getBufferLength("Gambits");  
  const entry  = { gambit, action: "quadrant", value, piece, src, dst, rays: rayPair, advsqs, opacity }; // Return values.

  return entry;
  }

export function makeLinearEntry(advsq) {
  console.log(`model: gambits.js - makeLinearEntry(advsq):`, advsq);

  const { src, srcTile, quad, perimeter, stride, opacity } = advsq; // src & dst.
  const dst = planes.resolveDstTile(srcTile, quad, perimeter, stride);
  const area = (perimeter+1)*(perimeter+1);

  const { rayPair } = quads.pqrTable(quad);                         // Ray.
  const ray = resolveStrideRay(advsq, rayPair);

  let piece = "duke"; let p = "D";                                  // Symbol.
  if( 1<= quad && quad <= 12) { piece = "rook";    p = "R";}
  if(13<= quad && quad <= 36) { piece = "bishop";  p = "B";}
  const value = "1";  // TODO: figure out linear coding values.

  const quadsList = findQuadsForRay(ray);                           // Advrects.
  const quadPairs = groupByPlane(quadsList);
  const rects     = buildAdvRects(src, srcTile, quadPairs, perimeter, stride);
  const advsqs    = rects;

  const gambit = state.getBufferLength("Gambits");  
  const entry  = { gambit, action: "linear", value, piece, src, dst, rays: ray, advsqs, opacity };    // Return values.

  return entry;
  }

export function makeDuplexEntry(advsq) {
  console.log(`model: gambits.js - makeDuplexEntry(advsq):`, advsq);

  const { src, srcTile, quad, perimeter, stride, opacity } = advsq; // src & dst.
  const dst = planes.resolveDstTile(srcTile, quad, perimeter, stride);
  const area = (perimeter+1)*(perimeter+1);

  const { rayPair } = quads.pqrTable(quad);                         // Ray.
  const ray = resolveStrideRay(advsq, rayPair, true);// Is duplex.

  const piece = "duke";                                             // Symbol.
  const crossPlainsAdv = "MM";  // TODO: figure out cross plane abrvs.
  const value = `${crossPlainsAdv}`;

  const crossQuad = quads.findDuplexFaceQuad(quad);                 // Advsqs.
  const crossAdvsq1 = { src, srcTile, quad, perimeter, stride, area };
  const crossAdvsq2 = { src, srcTile, quad: crossQuad, perimeter, stride, area };
  const advsqs = [crossAdvsq1, crossAdvsq2];

  const gambit = state.getBufferLength("Gambits");  
  const entry  = { gambit, action: "duplex", value, piece, src, dst, rays: ray, advsqs, opacity };    // Return values.

  return entry;
  }

export function makeOverlapEntry(advsq) {
  console.log(`model: gambits.js - makeOverlapEntry(advsq):`, advsq);

  const { src, srcTile, quad, perimeter, stride, opacity } = advsq; // src & dst.
  const dst = planes.resolveDstTile(srcTile, quad, perimeter, stride);
  const area = (perimeter+1)*(perimeter+1);

  const { rayPair } = quads.pqrTable(quad);                         // Ray.
  const ray = resolveStrideRay(advsq, rayPair, true);

  // TODO: create the overlap quads...
  
  return entry;
}
// Seampoint: more Entry functions...

export function buttonAffordances(situation) {
  console.log("model: gambits.js - buttonAffordances(situation)", situation);

  switch (situation) {
    case "on":              // Enable all panel buttons.
      panels.enableButton("freezeQ",   true);             // Enable all the panel buttons.
      panels.enableButton("freezeL",   true);
      panels.enableButton("freezeD",   true);
      panels.enableButton("freezeO",   true);

      panels.enableButton("freezeN",   true);
      panels.enableButton("freezeP",   true);
      panels.enableButton("freezeK",   true);
      panels.enableButton("asAPlane",  true);

      panels.enableButton("nextPlane", true);
      panels.enableButton("expand",    true);
      panels.enableButton("contract",  true);
      panels.enableButton("delete",    true);
      panels.enableButton("remove",    true);
    break;

    case "freezeQ":         // Advancement manifolds.
      panels.enableButton("freezeQ", true);
      break;
    case "freezeL":
      panels.enableButton("freezeL", true);
      break;
    case "freezeD":
      panels.enableButton("freezeD", true);
      break;
    case "freezeO":
      panels.enableButton("freezeO", true);
    break;

    case "freezeN":         // Restricted pieces.
      buttonAffordances("off");
      panels.enableButton("freezeN",   true);
      break;
    case "freezeP":
      buttonAffordances("off");
      panels.enableButton("freezeP",   true);
      break;
    case "freezeK":
      buttonAffordances("off");
      panels.enableButton("freezeK",   true);
    break;

    case "asAPlane":        // The whole plane.
      buttonAffordances("off");
      panels.enableButton("asAPlane",  true);
    break;

    case "selected":        // Manifold management.
      buttonAffordances("off");
      panels.enableButton("nextPlane", true);
      panels.enableButton("expand",    true);
      panels.enableButton("contract",  true);
      panels.enableButton("delete",    true);
      panels.enableButton("remove",    true);
    break;

    case "off":              // Disable all panel buttons.
      panels.enableButton("freezeQ",   false);              // Disable all the panel buttons.
      panels.enableButton("freezeL",   false);
      panels.enableButton("freezeD",   false);
      panels.enableButton("freezeO",   false);

      panels.enableButton("freezeN",   false);
      panels.enableButton("freezeP",   false);
      panels.enableButton("freezeK",   false);
      panels.enableButton("asAPlane",  false);
      panels.enableButton("next",      false);

      panels.enableButton("expand",    false);
      panels.enableButton("contract",  false);
      panels.enableButton("delete",    false);
      panels.enableButton("removeAll", false);
      break;
    default:
      throw new Error(`Unknown button situation ${situation} for gambits.`);
      break;
  }
}
// Seampoint: more global functions...

// --- Helpers ---
function resolveStrideRay(currAdvsq, rayPair, duplex=false) { // ray or null.
  console.log("cntrl: gambits.js - resolveStrideRay(currAdvsq, rayPair)", currAdvsq, rayPair);

  const { srcTile, quad, perimeter, stride } = currAdvsq;

  const advsq  = gAdvsqs.AdvSq.fromQuad(srcTile, quad, perimeter);
  const perims = advsq.getPerims();
  const last   = perims[perims.length - 1];

  const strideTile = last.stride[stride - 1];  // <-- actual coord

  if (utils.isSame(strideTile, last.E1))   return rayPair[0];
  if (utils.isSame(strideTile, last.E2))   return rayPair[1];
  if (utils.isSame(strideTile, last.apex)) {
    if(duplex) {    // TODO: for duplex, convert to rook ray.
      const rayPairVts = [
        rays.getRayVector(rayPair[0]),
        rays.getRayVector(rayPair[1]),
      ]
      const ray = utils.scale(utils.add(rayPairVts[0], rayPairVts[1]), 0.5);  // vts coords.
      return ray; // [z,x,y].
    }

    return rayPair;
  }

  return null;
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

function buildAdvRects(src, srcTile, quadPairs, perimeter, stride, opacity) {
  console.log("cntrl: gambits.js - buildAdvRects(...)", srcTile, quadPairs, perimeter, stride, opacity);

  const area = (perimeter+1)*(perimeter+1);

  return quadPairs.map(pair => {
    return pair.map(Q => ({
      src,
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
 * 0. ✅ HandleLoad
 * 1. ✅ Rebuild groups on load
 * 2. ✅ No single source of registry
 * 3. ✅ Entry not canonical
 * 4. ✅ Load does not restore indexed state correctly
 * 5. ✅ Free Load from rerunGambits()
 * 6. Group creation path is unclear
 * 7. Delete by passes state API
 * 8. Hard coded UI reset values
 * 9. Panel + state desync possibility.
 * 10. For duplex, convert to rook ray.
 * 11. Figure out cross plane abrvs.
 * 12. Figure out linear coding values.
*/

