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
  - 4/15/26 - Display undo status, branching for makeBoards. Create advsqs from panel. Undo/redo working, rerun not zeroing downstream elements.
  - 4/16/26 - Advsq panel: next quad/plane/piece. Offboard decorators and opacity slider. Refine web pages. QC controller code. QC dead code.
  - 4/17/26 - Advsq panel Remove feature. Undo's restore AdvSq Panel fields.

