---
title: "Dev"
---

**Dev (INWORK)**

  A playable version of chess scaled up to three dimensions - 
  but one must abandon the classical abstraction of *trajectories*
  (see **Rationale**.)
  We argue that there is a game to be *discovered* (not *invented*),
  where one might justly lay claim to the *one right rule set*.

  (Game has not yet been introduced in the PoP narrative.)

  Target release is fall, 2026. 
  For the terminally impatient, I will post clues from time to time (see **Clues**).
  The development log is below.

  If you are in to challenges, see if you can *discover* the rules to 3D chess.
  It is a great exercise in thinking out-of-the-box, of breaking **paradigms**.

## Log
  3/15/26 - AI axioms, hello world, python port plan.
 ### Week 1:
  - 3/16/26 - Transfer DNS records from WordPress to Hugo.
  - 3/17/26 - 3DC: directory architecture.
  - 3/18/26 - 3DC: regression tests, port half of foundation/coords.py to coord.js.
  - 3/19/26 - 3DC: resolve coord and anchor ambiguity, port rest of coords, improve regression framework.
  - 3/20/26 - Port colors and port rays.
  - 3/21/26 - Explore refactor options for quads and quandMaps.

 ### Week 2:
  - 3/22/26 - Establish template files (*.md, *.json, *.js, and *.test.js).
  - 3/23/26 - Planes: specs, data/code/test slices partway through para 4.
  - 3/24/26 - Finish porting over the planes module.
  - 3/25/26 - Long negotations with AI about code purity.
  - 3/26/26 - Finished quads module, data, code, & tests; specs still need work.
  - 3/27/26 - Finished perims module.

 ### Week 3:
  - 3/29/26 - Start on advSqs module.
  - 3/30/26 - Finish the overlapTiles module.
  - 3/31/26 - AdvSq first stable point.
  - 4/01/26 - AdvSq under good set of regression tests, more to do.
  - 4/02/26 - POC on tiles, the 8-color board unitcell, and basic POVs.
  - 4/03/26 - 8x8x8 tiles, plumb dragable 2D control canvases, with names.
  - 4/04/26 - Nail down state for undo/redo.

 ### Week 4:
  - 4/6/26 - Condensed regression reporting, simpler 3dc page, start on model/state tests.
  - 4/7/26 - Bishop rays for slip & slide, control/view callback arch, and decorator POC.
  - 4/8/26 - Demo decorators, click toggle on src/dst, define basic decorators.
  - 4/9/26 - Port render code from initThree.js to specialized modules.
  - 4/10/26 - Fix canvi scroll bug, add a qt3 research page, callback registration example, new panel arch via DOM.
  - 4/11/26 - POC DOM based panel arch; port 5 panels: setup, tray, game, gambit, and camera.

 ### Week 5:
  - 4/12/26 - Make camera POV radio buttons active elements. Add 6th panel, advsqs.
  - 4/13/26 - Camera control, first pass on logarithmic undo (current state off-by-one error).
  - 4/14/26 - Delete insights, basic logarithmic undo. Make boards from panel, delete prev, confirm addition to state history, confirm raycasting.
  - 4/15/26 - Display undo status, branching for makeBoards. Create advsqs from panel. Undo/redo good, rerun not zeroing downstream items.
  - 4/16/26 - Advsq panel: next quad/plane/piece. Offboard decorators, opacity slider. Refine web pages. QC controller code. QC dead code.
  - 4/17/26 - Advsq panel: Remove. Undo restores AdvSq Panel fields. Editable fields trigger immediate advsq updates. Duke duplex/apex tiles.
  - 4/18/26 - Fix opacity bug. Add stride tile to use dst decorator.

 ### Week 6:
  - 4/19/26 - Hide python. Raise stride decorator (dst). Next buttons reset to 1. Limit to Q60. Advsq panel: plane name, perim length, tile type.
  - 4/20/26 - Move thirds to face quads. Standardize imports. Validate quads start & dir first 9 planes. Confirm Q1-Q2 order (pawn driven).
  - 4/21/26 - Move advsq control into its own dir. Add grow and shrink to advsq panel, better intuition and MVC compliance.
  - 4/22/26 - Attempt max stride limit. POC state undo. Setup panel: board and trays. Enforce MVC layers. Add state level undo/redo.
  - 4/23/26 - Refactor advsqs to use state undo. Refine advsqs as undo example. Delete undo system at control layer. Rerun. Gambit plumbing.
  - 4/24/26 - Gambit Freeze Quadrant. Debug resolveDstTile(). Put planes.resolveDstTile() under test. Test plumbing. Animate freeze.
  - 4/25/26 - Neaten TODOs. Fix normalize dup. Feynman example. Consolodate decoratePerimeter. Draft view/gambits. Code getOverlapType.

 ### Week 7:
  - 4/26/26 - Stride stability. Stride type (perimeter) versus move type (advsq). Correct duke linear color. Update clues. Onboard tile calc.
  - 4/27/26 - Viewer panel. Roll events into controller. One wirePanel function. Order panels. Panel templates. Port viewer & camera. Jitter.
  - 4/28/26 - Double click reverse jitter. Standardize foundation, geometry, controller. Better gambit scroll-box. Model folders; gambits, advsqs.
  - 4/29/26 - Gambit: MVC compliance, cleanup, delete/removeAll, undo. Duplex animation. Animation race condition. Utils. Rewind & forward>>.
  - 4/30/26 - QC. Board undo/redo. Plumb moves. Plumb move handlers.
  - 5/01/26 - Add buttons and fields to Move panel. Extend move plumbing. Prep for load & save. Use json to describe canonical move state entry.
  - 5/02/26 - Replace bufferCount with bufferIndex. Time symmetric idiom for moves. Expand MVC idiom for moves. Implement load and save. UI standardization model layer.

 ### Week 8:
  - 5/03/26 - Draft common UI functions for model layer. Complete state UI functions. Add setup dir in view layer.
  - 5/04/26 - Plumb pieces. Add metaphysics page.
  - 5/05/26 - Debug undo/redo and refresh panel. Debug rewind/FF. Plumb trays. Apply payload/entry canon to setup. Apply pipeline canon to advsqs.
  - 5/06/26 - Null.
  - 5/07/26 - Parallelism in buffer modules. ApplyEntry parallelism. Use processRedoBuffer. More parallelsim. Fix gambit undo/redo. Restore gambit functionality. State QC.
  - 5/08/26 - Fix redo on load. Fix stale board bug and limit listeners to 1.
  - 5/09/26 - Refine view specs. Clean up main. Delete deprecated demos. Copy panel builders into modules. Re-arch view into panels. Cleanup view.js. Fix move button bug. Fix FF & rewind bugs.

 ### Week 9:
  - 5/10/26 - Clues. Advsq json & spec files. Src tile positional versus vts. Gambit jsons.
  - 5/11/26 - Gambit specs and json files. Delete control layer gambitGroupRegistry.

