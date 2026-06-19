/* File: gambits.js
  Path: ./3dc/controller/gambits/gambits.js
  Purpose: Collects advsqs into a set that stays on the board - gambit analysis.
  Author: Allan Goff
  Date: 4/23/26
  Recommended access: import * as cGambits from "../../controller/gambits/gambits.js";
  UI: the export functions.
*/

// --- Load JSON ---
  import gambitsData from "./gambits.json" assert { type: "json" };
  const gambitsModule = gambitsData.gambits_module;
// Seampoint: more objects...

// --- Dependencies ---
  import * as utils    from "../../../utils/utils.js";  

  import * as game     from "../../controller/game/game.js";
  import * as cAdvsqs  from "../../controller/advsqs/advsqs.js";

  import * as state    from "../../model/state/state.js";
  import * as planes   from "../../geometry/planes/planes.js";    // resolveDstTile().
  import * as quads    from "../../geometry/quads/quads.js";
  import * as gAdvsqs  from "../../geometry/advsqs/advsqs.js";
  import * as mAdvsqs  from "../../model/advsqs/advsqs.js";
  import * as mGambits from "../../model/gambits/gambits.js";
  
  import * as view     from "../../view/view.js";
  import * as tiles    from "../../view/tiles/tiles.js";
  import * as vAdvsqs  from "../../view/advsqs/advsqs.js";
  import * as vGambits from "../../view/gambits/gambits.js";
// Seampoint: more imports...

// --- Globals ---
// Seampoint: more globals...

// --- UI ---
export function panelDispatch(payload) {
  // console.log("cntrl: gambits.js - panelDispatch(payload):", payload);

  vGambits.cancelAnimation();

  const { action } = payload;
  const currAdvsq = state.fetchCurrentState("AdvSqs"); // Get current advsq, if any.

  switch (action) {                             // Change current adv manifold.
    case "nextPlane": handleNextPlane(); break;
    case "expand":    handleExpand();    break;
    case "contract":  handleContract();  break;
    case "delete":    handleDelete();    break;
    case "remove":    handleRemoveAll(); break;

    case "freezeQ":  handleFreezeQuadrant(currAdvsq);     break;
    case "freezeL":  handleFreezeAsLinear(currAdvsq);     break;
    case "freezeD":  handleFreezeAsDuplex(currAdvsq);     break;
    case "freezeO":  handleFreezeWithOverlaps(currAdvsq); break;

    case "freezeN":  handleFreezeAsKnight(currAdvsq); break;
    case "freezeP":  handleFreezeAsPawn(currAdvsq);   break;
    case "freezeK":  handleFreezeAsKing(currAdvsq);   break;
    case "asAPlane": handleFreezeAsAPlane(currAdvsq); break;
    default: throw new Error(`Unknown gambit action ${action}.`);  break;
  }

  game.showUndoStatus();                        // Update game panel (undo).
  }

export function buildPayload(panel, action) {
  console.log("     ---------- cntrl: gambits.js");

  return { action };
}
// Seampoint: more global functions...

// --- Handle Functions ---
function handleFreezeQuadrant(currAdvsq) {      // N Q1  R KB4,4 → KB7,7    :16
  console.log("cntrl: gambits.js - handleFreezeQuadrant(currAdvsq).", currAdvsq);

  if(!currAdvsq) return;

  const { src, srcTile, quad, perimeter, stride, opacity } = currAdvsq;

  state.clearBuffer("AdvSqs");                        // Advsq: change state.
  vAdvsqs.removeFromScene();                          // De-render. // TODO: move to view layer.
  vAdvsqs.clearAdvsqPanelParams("Q4,4");              // Update panel.

  const gambitId = state.getBufferLength("Gambits");
  const entry = { gambitId, action: "quad", ...currAdvsq };

  branchHistory(entry);
  state.pushNewGambit(entry);

  const group = view.buildAdvSqGroup(entry); // {srcTile: Array(3), quad: 1, perimeter: 0, stride: 0, opacity: 0.5}
  vGambits.getGambitGroups()[gambitId] = group;
  group.userData.entry = entry;
  vGambits.render(group, { animate: true });      // Render.

  const scene = view.getContext().scene;
  const foundGroup = scene.children.find(
    g => g.userData?.entry?.gambitId === entry.gambitId
  );
  if(foundGroup) {
    console.log("*** group entry in userData.");
  }

  const line = convertEntryToLine(entry)
  vGambits.pushPanelLine(line);
  }
export function convertEntryToLine(entry) {
  console.log(`cntrl: gambits.js - convertEntryToLine(entry):`, entry);

  const { src, srcTile, quad, perimeter, stride, opacity } = entry; // Advsq.

  const dst = planes.resolveDstTile(srcTile, quad, perimeter, stride);
  const area = (perimeter+1)*(perimeter+1);
  
  let piece = "D";                                                  // Symbol.
  if( 1<= quad && quad <= 12)  piece = "R";
  if(13<= quad && quad <= 36)  piece = "B";
  const symbol = `Q`;

  const line = { symbol, value: quad, piece, src, dst, feedback: area };

  return line;
}

function handleFreezeAsLinear(currAdvsq) {      // N L1  R Q4,4  → Q8,4     :left_fore
  console.log("cntrl: gambits.js - handleFreezeAsLinear(currAdvsq)", currAdvsq);

  if(!currAdvsq) return;

  const { src, srcTile, quad, perimeter, stride, opacity } = currAdvsq;

  const e1 = 1;                                       // Allowable?
  const e2 = 2*perimeter + 1;
  const allowed = stride === e1 || stride === e2
  if(!allowed) {                                      // TODO: add msg panel for this sort of thing.
    console.log(`Stride tile was ${stride}, must be E1(${e1}) or E2(${e2}) - aborting linear freeze.`);
    return;
  }

  state.clearBuffer("AdvSqs");                        // Advsq: change state.
  vAdvsqs.removeFromScene();                          // De-render. // TODO: move to view layer.
  vAdvsqs.clearAdvsqPanelParams("Q4,4");              // Update panel.

  const { entry, line } = mGambits.makeLinearEntry(currAdvsq);
  applyLinearEntry({ entry, line });
  }

function handleFreezeAsDuplex(currAdvsq) {      // N DMM D KB4,4 → 8,0,0    :1,0,0
  console.log("cntrl: gambits.js - handleFreezeAsDuplex(currAdvsq)", currAdvsq);

  if(!currAdvsq) return;

  const { src, srcTile, quad, perimeter, stride, opacity } = currAdvsq;
  console.log("cntrl: gambits.js - quads.pqrTable(quad)", quads.pqrTable(quad));

  const { piece, quadType} = quads.pqrTable(quad);    // Allowable?
  const duplex = perimeter + 1;
  const allowed = (piece === "duke" && quadType === "face" && stride === duplex);
  if(!allowed) {                                      // TODO: add msg panel for this sort of thing.
    console.log(`Aborting duplex freeze: ${piece} must be duke, ${quadType} must be face, and ${stride} must be duplex ${duplex}.`);
    return;
  }

  state.clearBuffer("AdvSqs");                        // Advsq: change state.
  vAdvsqs.removeFromScene();                          // De-render. // TODO: move to view layer.
  vAdvsqs.clearAdvsqPanelParams("Q4,4");              // Update panel.

  const { entry, line } = mGambits.makeDuplexEntry(currAdvsq);
  applyDuplexEntry({ entry, line });
  }

function handleFreezeWithOverlaps(currAdvsq) {  // TODO: finish.
  console.log("cntrl: gambits.js - handleFreezeOverlay(currAdvsq)", currAdvsq);

  if(!currAdvsq) return;

  const { src, srcTile, quad, perimeter, stride, opacity } = currAdvsq;  // Informative.


  branchHistory(entry);
  // applyEntry(entry);  // Eventually.
}

function handleFreezeAsKnight(currAdvsq) {      // TODO: finish.
  console.log("cntrl: gambits.js - handleFreezeAsKnight(currAdvsq)", currAdvsq);

  if(!currAdvsq) return;

  const { src, srcTile, quad, perimeter, stride, opacity } = currAdvsq;  // Informative.

  
  branchHistory(entry);
  // applyEntry(entry);  // Eventually.
 }
function handleFreezeAsPawn(currAdvsq) {        // TODO: finish.
  console.log("cntrl: gambits.js - handleFreezeAsPawn(currAdvsq)", currAdvsq);

  if(!currAdvsq) return;

  const { src, srcTile, quad, perimeter, stride, opacity } = currAdvsq;  // Informative.

  
  branchHistory(entry);
  // applyEntry(entry);  // Eventually.
  }
function handleFreezeAsKing(currAdvsq) {        // TODO: finish.
  console.log("cntrl: gambits.js - handleFreezeAsKing(currAdvsq)", currAdvsq);

  if(!currAdvsq) return;

  const { src, srcTile, quad, perimeter, stride, opacity } = currAdvsq;  // Informative.

  
  branchHistory(entry);
  // applyEntry(entry);  // Eventually.
  }
function handleFreezeAsAPlane(currAdvsq) {      // TODO: finish.
  console.log("cntrl: gambits.js - handleFreezeAsAPlane(currAdvsq)", currAdvsq);

  if(!currAdvsq) return;

  const { src, srcTile, quad, perimeter, stride, opacity } = currAdvsq;  // Informative.

  
  branchHistory(entry);
  // applyEntry(entry);  // Eventually.
}

let rotation = 0; // 0-12: duke: %4=0 => all, else 1,2,3 - rook|bishop: %3=0 => all, else 1,2.
function handleNextPlane() {                    // TODO: finish.
  console.log("cntrl: gambits.js - handleNextPlane()");
  //TODO: Complete handleNextPlane().

  // Get current gambit.
  const entry = state.fetchCurrentState("Gambits");
  if(!entry) return;
  console.log("cntrl: gambits.js - handleNextPlane()...entry:", entry);

  // Is it a linear, duplex, or overlap gambit?
  if (!["linear", "duplex", "overlap"].includes(entry.move)) {
    return;
  }
  vGambits.planeRotation(entry, ++rotation);
  }

function handleExpand() {                       // TODO: finish.
  console.log("cntrl: gambits.js - handleExpand()");

  }

function handleContract() {                     // TODO: finish.
  console.log("cntrl: gambits.js - handleContract()");

  }

function handleDelete() {                       // TODO: finish.
  console.log("cntrl: gambits.js - handleDelete()");

  }

function handleRemoveAll() {                    // TODO: finish.
  console.log("cntrl: gambits.js - handleRemoveAll()");

}
// Seampoint: more helper functions...

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

  quadsList.forEach(Q => {
    const plane = quads.quadToPlane(Q);

    if (!map.has(plane)) map.set(plane, []);
    map.get(plane).push(Q);
  });

  return [...map.values()]; // each = one rectangle (2 quads)
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

function branchHistory(entry) {
  console.log("cntrl: gambits.js - branchHistory(entry):", entry);

  console.log("*** top, idx", state.getState()["Gambits"].length, state.getIndices()["Gambits"]);
  if(!state.isAtEnd("Gambits")) {               // Undo branch.
    let top = state.getBufferLength("Gambits");
    const idx = state.getCurrentIndex("Gambits");
    state.truncateState("Gambits", idx);
    console.log("*** top, idx", top, idx);
    while(top > idx) {
      vGambits.popPanelLine();
      top--;
    }
    vGambits.refreshPanel(entry);
  }

  vAdvsqs.clearAdvsqs();              // Remove all entries in downstream buffers.
  state.clearBuffer("AdvSqs");
  }

function applyEntry(entry) {   // Clear curr, branch, state change, render, refresh panel.
  console.log("cntrl: gambits.js - applyEntry(entry)", entry);

  if(!state.isAtEnd("Gambits")) {                // Branches undo history, discards original branch.
    const idx = state.getCurrentIndex("Gambits");
    state.truncateState("Gambits", idx);
  }

  state.pushNewGambit(entry);          // Log state change in undo buffer.
  vGambits.renderGambit(entry); 
  // vGambits.refreshEntry(entry); 
}

function applyQuadrantEntry({ entry, line }) {   // Group, state, render, panel.
  console.log("cntrl: gambits.js - applyQuadrantEntry(entry)", entry);

  state.pushNewGambit(entry);                     // Change state.
  const group = vGambits.makeQuadGroup(entry);    // Recreate from entry.
  vGambits.render(group, { animate: true });      // Render.
  vGambits.pushPanelLine(line);                   // Add line to panel.
  }

function applyLinearEntry({entry, line}) {   // Group, state, render, panel.
  console.log("cntrl: gambits.js - applyLinearEntry({entry, line})", {entry, line});
 
  // TODO: if not at end, branch undo buffer. 

  state.pushNewGambit(entry);                     // Change state.
  const group = vGambits.makeLinearGroup(entry);  // Recreate from entry.
  vGambits.render(group, { animate: true });      // Render.
  vGambits.pushPanelLine(line);                   // Append line to panel.
  }

function applyDuplexEntry({entry, line}) {   // Group, state, render, panel.
  console.log("cntrl: gambits.js - applyDuplexEntry({entry, line})", {entry, line});
 
  // TODO: if not at end, branch undo buffer. 

  state.pushNewGambit(entry);                     // Change state.
  const group = vGambits.makeDuplexGroup(entry);  // Recreate from entry.
  vGambits.render(group, { animate: true });      // Render.
  vGambits.pushPanelLine(line);                   // Append line to panel.
}
// Seampoint: more local functions...

/* TODO: Gambit additions:
  *  1. ✅ Clear AdvSq buffer
  *  2. ✅ Render (with animation)
  *  3. Compute derived fields
  *  4. ✅ Add to scroll window
  *  5. ✅ Put resolveDstTile under test
  *  6. ✅ Move add and scale and isSame to utils.
  *  7. ✅ Test aliases to AI (skipped)
  *  8. ✅ If that passes, port geo into subdirs.
  *  9. ✅ Update specs
  * 10. ✅ Freeze Linear
  * 11. Freeze Duplex
  * 12. Freeze Overlap
  * 13. ✅ Plumbing for test suite
  * 14. Add expand & contract feature
  * 15. Next fails if dst is offboard (at least for duplex moves)
  * 16. Button enable/disable - document.querySelector('[data-action="freezeQ"]').disabled = false;
*/

