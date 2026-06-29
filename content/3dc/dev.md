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
  - 5/11/26 - Gambit specs and json files. Merge to confirm no hard to resolved merge errors.
  - 5/12/26 - Board undo on gambits. Align applyEntry(). Align gambits with panel buttons. Gambit better but still requires rerunGambits. UI Surface Reduction.
  - 5/13/26 - Canonical UI. Push & pop panel lines. Make advsq mesh group clear. QC view.js. Compute gambit for a linear entry. Stats spreadsheet.
  - 5/14/26 - Render linear gambits. Debug linear gambits. Gambit next plane feature.
  - 5/15/26 - Gambits QC.
  - 5/16/26 - Freeze duplex moves. Gambits QC.

 ### Week 10:
  - 5/17/26 - Clues. Trays: show/hide, colors, json driven, board size. Postpone publish dates. Tray gap code. Primary plane dots on gold tiles.
  - 5/18/26 - Plumbing for pieces. QC imports.
  - 5/19/26 - Occupancy arrays. Flesh out board and tray directories. QC pass on mPieces.
  - 5/20/26 - Piece render control flow.
  - 5/21/26 - Debug vertical aspect error during piece expansion. Fix vertical aspect bug. Standardize view: in console logs. UI planel grouping via color. Flow standards.
  - 5/22/26 - Standardize control layer code. Fix clipping. Get level sep to work for trays. Update clues.
  - 5/23/26 - 

 ### Week 11:
  - 5/24/26 - 
  - 5/25/26 - Start creating comic replacements.
  - 5/26/26 - Replace comics in first 16 chapters.
  - 5/27/26 - Delete quotes around comic titles. Replace almost all the rest of the copyrighted comics.
  - 5/28/26 - 
  - 5/29/26 - 
  - 5/30/26 - 

 ### Week 12:
  - 5/31/26 - Fix Dale typos.
  - 6/01/26 - Replace rest of Act 2 comics. Replace Act 3 comics. Level sep for trays, board, advsqs & gambits. Cleanup. Piece level sep. Tray piece gap.
  - 6/02/26 - Finish White pawns. Finish White knights with bevels and chirality. Add Black trays. Add material colors via json.
  - 6/03/26 - Tray default state is visible. POC on duke/bishop/stack centering and orientation. Finish pieces. Update clues and quick start.
  - 6/04/26 - Create selections module, migrate tile listener. Piece clicks! TODO reduction in view. Highlight/dehighlight pieces.
  - 6/05/26 - Move pieces from tray to board. QC setup. Manage panel buttons. Setup uses selections, pass 1.
  - 6/06/26 - Setup uses selections pass 2. Setup uses selections pass 3.

 ### Week 13:
  - 6/07/26 - Improved initial placement of pieces in the trays, all three boards.
  - 6/08/26 - QC pieces. Complete board to tray. Misc. QC. Dependencies. Setup flow established. Fix tray gap/pieces. Prep for new setup undo.
  - 6/09/26 - Screenshots. Selections canonized. Canonize code as map. Tiles superstructure. Comment QC. Setup undo phase 1.
  - 6/10/26 - Setup undo/redo/rewind/FF. Game and cSetup QC. Button management. Undo makeBoard...
  - 6/11/26 - Add status panel. Change to diagnostic panel. Accessor view.getContext().
  - 6/12/26 - Centralize diagnostics. Setup entry. Setup panel refresh bug. Panel logic for setup makeBoard; tiles, trays, pieces still to do.
  - 6/13/26 - Json code uniformity. Load uniformity. Makeboards working: panel, undo/redo, rewind/FF, load/save, trays/pieces. Setup pieces working.

 ### Week 14:
  - 6/14/26 - Game/state QC. QC setup. Debug rewind. Debug place piece on ten boards. Debug setup. Update clues & dates.
  - 6/15/26 - Starting Lineup. Setup todos. Remove Play button. Selection button management. 1st level move button restraints.
  - 6/16/26 - Add two stack move buttons. Popup help panels. Detect occupied dst tiles. Multi-line help texts. Move pieces around the board.
  - 6/17/26 - Popup help texts. White/Black move order. Indicate player. Plumbing for undo moves. Undo/Redo/RW/FF/Load/Save pure moves. QC moves. Undo branching. Push & Pop panel lines.
  - 6/18/26 - Normalize gambits. Normalize refreshEntry() & applyEntry(). Undo/redo/RW/FF/load/save for quadrant gambits. Deadcode & todo updates.
  - 6/19/26 - Load reset. Occupancy reset. Normalize model layer. Undo branching. Button affordances.
  - 6/20/26 - Cross panel button affordances. Revise entry standards. Draft move entries. Captures.

 ### Week 15:
  - 6/21/26 - Fixed White/Black radio buttons in move panel. Remove obsolete saved game strings. Normalize move entry and payload/selections order.
  - 6/22/26 - En passant. Castling. Promotion sans queen mesh. Stem out move makeEntries and assembleLines.
  - 6/23/26 - Stack offset value. New UI for occupancy. New approach; pieceList and trays only - POC.
  - 6/24/26 - Remove stack buttons. Line notation standards. Stablize clicks, entries, and move listing rows. Remove board occupancy. A couple of TODOs.
  - 6/25/26 - Rest of base moves. Rest of non fission captures.
  - 6/26/26 - Fission, 16 permutations, just eligibility.
  - 6/27/27 - Fission moves (4): entries, lines, and pieces. Revert fission Z to C. Merge listing line pairs. 8/16 fissions, but B/D click order problematic.

 ### Week 16:
  - 6/28/26 - Correct click order for fission moves. Fission move listings. Raise and lower duke (all but bishop leaves).
  - 6/29/26 - Finish en passant and castling.
   QC quad gambits, all gambits, all moves.

## Move Lines:
  **2-10-0-0**

## Development
 ### Fission:
  **2-5-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KB3,3"}]},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKBD","prev":"@KB8,8","post":"@KB6,6"}]},{"action":"move","turn":2,"player":"White","list":[{"key":"WQBD","prev":"@QB1,1","post":"@KB3,3"}]},{"action":"move","turn":2,"player":"Black","list":[{"key":"BKBB","prev":"@KB8,8","post":"@KB6,6"}]},{"action":"fission","turn":3,"player":"White","list":[{"key":"WKBB","prev":"@KB3,3","post":"@KB4,4"},{"key":"WQBD","prev":"@KB3,3","post":"@KB5,5"}]}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},
    {"action":"startingPos"}],
  "Moves":[
    {"action":"move","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KB3,3"}]},
    {"action":"move","turn":1,"player":"Black","list":[{"key":"BKBD","prev":"@KB8,8","post":"@KB6,6"}]},
    {"action":"move","turn":2,"player":"White","list":[{"key":"WQBD","prev":"@QB1,1","post":"@KB3,3"}]},
    {"action":"move","turn":2,"player":"Black","list":[{"key":"BKBB","prev":"@KB8,8","post":"@KB6,6"}]},
    {"action":"fission","turn":3,"player":"White","list":[{"key":"WKBB","prev":"@KB3,3","post":"@KB4,4"},{"key":"WQBD","prev":"@KB3,3","post":"@KB5,5"}]}],
  "Gambits":[],"AdvSqs":[]}

  **2-4-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KB3,3"}]},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKBD","prev":"@KB8,8","post":"@KB6,6"}]},{"action":"move","turn":2,"player":"White","list":[{"key":"WQBD","prev":"@QB1,1","post":"@KB3,3"}]},{"action":"move","turn":2,"player":"Black","list":[{"key":"BKBB","prev":"@KB8,8","post":"@KB6,6"}]}],"Gambits":[],"AdvSqs":[]}

 ### Stack: Initial setup, decays, advance: Full undo stack 
  **2-6-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KB3,3"}]},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKBD","prev":"@KB8,8","post":"@KB6,6"}]},{"action":"move","turn":2,"player":"White","list":[{"key":"WKBD","prev":"@KB1,1","post":"@KB3,3"}]},{"action":"move","turn":2,"player":"Black","list":[{"key":"BKBB","prev":"@KB8,8","post":"@KB6,6"}]},{"action":"move","turn":3,"player":"White","list":[{"key":"WKBD","prev":"@KB3,3","post":"@KB4,4"},{"key":"WKBB","prev":"@KB3,3","post":"@KB4,4"}]},{"action":"move","turn":3,"player":"Black","list":[{"key":"BKBB","prev":"@KB6,6","post":"@KB5,5"}]}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},
    {"action":"startingPos"}],
  "Moves":[
    {"action":"move","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KB3,3"}]},
    {"action":"move","turn":1,"player":"Black","list":[{"key":"BKBD","prev":"@KB8,8","post":"@KB6,6"}]},
    {"action":"move","turn":2,"player":"White","list":[{"key":"WKBD","prev":"@KB1,1","post":"@KB3,3"}]},
    {"action":"move","turn":2,"player":"Black","list":[{"key":"BKBB","prev":"@KB8,8","post":"@KB6,6"}]},
    {"action":"move","turn":3,"player":"White","list":[{"key":"WKBD","prev":"@KB3,3","post":"@KB4,4"},{"key":"WKBB","prev":"@KB3,3","post":"@KB4,4"}]},
    {"action":"move","turn":3,"player":"Black","list":[{"key":"BKBB","prev":"@KB6,6","post":"@KB5,5"}]}],
  "Gambits":[],"AdvSqs":[]}

 **2-5-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KB3,3"}]},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKBD","prev":"@KB8,8","post":"@KB6,6"}]},{"action":"move","turn":2,"player":"White","list":[{"key":"WKBD","prev":"@KB1,1","post":"@KB3,3"}]},{"action":"move","turn":2,"player":"Black","list":[{"key":"BKBB","prev":"@KB8,8","post":"@KB6,6"}]}],"Gambits":[],"AdvSqs":[]}

  **2-2-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KB3,3"}]},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKBD","prev":"@KB8,8","post":"@KB6,6"}]}],"Gambits":[],"AdvSqs":[]}

## Eamples:
 ### Bishop-decay, Duke-decay, Teleportation
  **2-3-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KB3,3"}]},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKBD","prev":"@KB8,8","post":"@KB6,6"}]},{"action":"move","turn":2,"player":"White","list":[{"key":"WQBD","prev":"@QB1,1","post":"@KB3,3"}]}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},
    {"action":"startingPos"}],
  "Moves":[
    {"action":"move","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KB3,3"}]},
    {"action":"move","turn":1,"player":"Black","list":[{"key":"BKBD","prev":"@KB8,8","post":"@KB6,6"}]},
    {"action":"move","turn":2,"player":"White","list":[{"key":"WQBD","prev":"@QB1,1","post":"@KB3,3"}]}],
  "Gambits":[],"AdvSqs":[]}

 ### Place-shift-return
  **4-0-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},{"action":"placePiece","key":"BKRP","prev":"~KR2,2","post":"@KR8,8"},{"action":"shiftPiece","key":"BKRP","prev":"@KR8,8","post":"@KR7,7"},{"action":"returnPiece","key":"BKRP","prev":"@KR7,7","post":"~KR2,2"}],"Moves":[],"Gambits":[],"AdvSqs":[]}

 ### Promotion (except for queen mesh)
  **2-3-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR8,7"}]},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKRR","prev":"@KR8,8","post":"@KR6,6"}]},{"action":"promote","turn":2,"player":"White","list":[{"key":"WKRP","prev":"@KR8,7","post":"@KR8,8"},{"key":"WKRP","prev":"@KR8,7","post":"@KR8,8"}]}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
    {"action":"startingPos"}],
  "Moves":[
    {"action":"move","turn":1,"player":"White","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR8,7"}]},
    {"action":"move","turn":1,"player":"Black","list":[{"key":"BKRR","prev":"@KR8,8","post":"@KR6,6"}]},
    {"action":"promote","turn":2,"player":"White",
      "list":[
        {"key":"WKRP","prev":"@KR8,7","post":"@KR8,8"},
        {"key":"WKRP","prev":"@KR8,7","post":"@KR8,8"}]
      }],
  "Gambits":[],"AdvSqs":[]}

 ### Double Castle
  **2-2-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"castle","turn":1,"player":"White","list":[{"key":"WKKK","prev":"@K1,1","post":"@K1,2"},{"key":"WKRR","prev":"@KR1,1","post":"@Q1,2"},{"key":"WQRR","prev":"@QR1,1","post":"@KB1,2"}]},{"action":"castle","turn":1,"player":"Black","list":[{"key":"BKKK","prev":"@K8,8","post":"@KB7,8"},{"key":"BKRR","prev":"@KR8,8","post":"@K7,8"}]},{"action":"move","turn":2,"player":"White","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR3,3"}]},{"action":"move","turn":2,"player":"Black","list":[{"key":"BKRP","prev":"@KR7,7","post":"@KR6,6"}]}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
    {"action":"startingPos"}],
  "Moves":[
    {"action":"castle","turn":1,"player":"White",
      "list":[
        {"key":"WKKK","prev":"@K1,1","post":"@K1,2"},
        {"key":"WKRR","prev":"@KR1,1","post":"@Q1,2"},
        {"key":"WQRR","prev":"@QR1,1","post":"@KB1,2"}]},
    {"action":"castle","turn":1,"player":"Black",
      "list":[
        {"key":"BKKK","prev":"@K8,8","post":"@KB7,8"},
        {"key":"BKRR","prev":"@KR8,8","post":"@K7,8"}]},
    {"action":"move","turn":2,"player":"White","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR3,3"}]},
    {"action":"move","turn":2,"player":"Black","list":[{"key":"BKRP","prev":"@KR7,7","post":"@KR6,6"}]}],
  "Gambits":[],"AdvSqs":[]}

  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"castle","turn":1,"player":"White","list":[{"key":"WKKK","prev":"@K1,1","post":"@K1,2"},{"key":"WKRR","prev":"@KR1,1","post":"@Q1,2"},{"key":"WQRR","prev":"@QR1,1","post":"@KB1,2"}]}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
    {"action":"startingPos"}],
  "Moves":[
    {"action":"castle","turn":1,"player":"White",
      "list":[
        {"key":"WKKK","prev":"@K1,1","post":"@K1,2"},
        {"key":"WKRR","prev":"@KR1,1","post":"@Q1,2"},
        {"key":"WQRR","prev":"@QR1,1","post":"@KB1,2"}]}],
  "Gambits":[],"AdvSqs":[]}

 ### Castle
  **2-2-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"castle","turn":1,"player":"White","list":[{"key":"WKKK","prev":"@K1,1","post":"@KB1,2"},{"key":"WKRR","prev":"@KR1,1","post":"@K1,2"}]}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
    {"action":"startingPos"}],
  "Moves":[
    {"action":"castle","turn":1,"player":"White",
      "list":[
        {"key":"WKKK","prev":"@K1,1","post":"@KB1,2"},
        {"key":"WKRR","prev":"@KR1,1","post":"@K1,2"}]}],
  "Gambits":[],"AdvSqs":[]}

 ### En Passant
  **2-4-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR4,4"}]},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKKP","prev":"@K7,7","post":"@K6,5"}]},{"action":"move","turn":2,"player":"White","list":[{"key":"WKRP","prev":"@KR4,4","post":"@KR5,5"}]},{"action":"move","turn":2,"player":"Black","list":[{"key":"BKNP","prev":"@KN7,7","post":"@KN5,5"}]},{"action":"enpassant","turn":3,"player":"White","list":[{"key":"WKRP","prev":"@KR5,5","post":"@KN6,6"},{"key":"BKNP","prev":"@KN5,5","post":"~KN2,2"}]}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
    {"action":"startingPos"}],
  "Moves":[
    {"action":"move","turn":1,"player":"White","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR4,4"}]},
    {"action":"move","turn":1,"player":"Black","list":[{"key":"BKKP","prev":"@K7,7","post":"@K6,5"}]},
    {"action":"move","turn":2,"player":"White","list":[{"key":"WKRP","prev":"@KR4,4","post":"@KR5,5"}]},
    {"action":"move","turn":2,"player":"Black","list":[{"key":"BKNP","prev":"@KN7,7","post":"@KN5,5"}]},
    {"action":"enpassant","turn":3,"player":"White",
      "list":[
        {"key":"WKRP","prev":"@KR5,5","post":"@KN6,6"},
        {"key":"BKNP","prev":"@KN5,5","post":"~KN2,2"}]}],
  "Gambits":[],"AdvSqs":[]}

## Capture Development:
  **2-4-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR4,4"}]},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKRP","prev":"@KR7,7","post":"@KR5,5"}]},{"action":"capture","turn":2,"player":"White","list":[{"key":"WKRP","prev":"@KR4,4","post":"@KR5,5"},{"key":"BKRP","prev":"@KR5,5","post":"~KR2,2"}]},{"action":"capture","turn":2,"player":"Black","list":[{"key":"BKRR","prev":"@KR8,8","post":"@KR5,5"},{"key":"WKRP","prev":"@KR5,5","post":"~KR2,2"}]}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],
  "Moves":[
    {"action":"move","turn":1,"player":"White","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR4,4"}]},
    {"action":"move","turn":1,"player":"Black","list":[{"key":"BKRP","prev":"@KR7,7","post":"@KR5,5"}]},
    {"action":"capture","turn":2,"player":"White","list":[{"key":"WKRP","prev":"@KR4,4","post":"@KR5,5"},{"key":"BKRP","prev":"@KR5,5","post":"~KR2,2"}]},
    {"action":"capture","turn":2,"player":"Black","list":[{"key":"BKRR","prev":"@KR8,8","post":"@KR5,5"},{"key":"WKRP","prev":"@KR5,5","post":"~KR2,2"}]}],
  "Gambits":[],"AdvSqs":[]}

  **2-4-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","key":"WKRP","prev":"@KR2,2","post":"@KR4,4","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR4,4"}]},{"action":"move","turn":1,"player":"Black","key":"BKRP","prev":"@KR7,7","post":"@KR5,5","list":[{"key":"BKRP","prev":"@KR7,7","post":"@KR5,5"}]},{"action":"capture","turn":2,"player":"White","list":[{"key":"WKRP","prev":"@KR4,4","post":"@KR5,5"},{"key":"BKRP","prev":"@KR5,5","post":"~KR2,2"}]},{"action":"capture","turn":2,"player":"Black","list":[{"key":"BKRR","prev":"@KR8,8","post":"@KR5,5"},{"key":"WKRP","prev":"@KR5,5","post":"~KR2,2"}]}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],
  "Moves":[
    {"action":"move","turn":1,"player":"White","key":"WKRP","prev":"@KR2,2","post":"@KR4,4","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR4,4"}]},
    {"action":"move","turn":1,"player":"Black","key":"BKRP","prev":"@KR7,7","post":"@KR5,5","list":[{"key":"BKRP","prev":"@KR7,7","post":"@KR5,5"}]},
    {"action":"capture","turn":2,"player":"White","list":[{"key":"WKRP","prev":"@KR4,4","post":"@KR5,5"},{"key":"BKRP","prev":"@KR5,5","post":"~KR2,2"}]},
    {"action":"capture","turn":2,"player":"Black","list":[{"key":"BKRR","prev":"@KR8,8","post":"@KR5,5"},{"key":"WKRP","prev":"@KR5,5","post":"~KR2,2"}]}],
  "Gambits":[],"AdvSqs":[]}

  **2-4-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","key":"WKRP","prev":"@KR2,2","post":"@KR4,4"},{"action":"move","turn":1,"player":"Black","key":"BKRP","prev":"@KR7,7","post":"@KR5,5"},{"action":"capture","turn":2,"player":"White","list":[{"key":"WKRP","prev":"@KR4,4","post":"@KR5,5"},{"key":"BKRP","prev":"@KR5,5","post":"~KR2,2"}]},{"action":"capture","turn":2,"player":"Black","list":[{"key":"BKRR","prev":"@KR8,8","post":"@KR5,5"},{"key":"WKRP","prev":"@KR5,5","post":"~KR2,2"}]}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],
  "Moves":[
    {"action":"move","turn":1,"player":"White","key":"WKRP","prev":"@KR2,2","post":"@KR4,4"},
    {"action":"move","turn":1,"player":"Black","key":"BKRP","prev":"@KR7,7","post":"@KR5,5"},
    {"action":"capture","turn":2,"player":"White","list":[{"key":"WKRP","prev":"@KR4,4","post":"@KR5,5"},{"key":"BKRP","prev":"@KR5,5","post":"~KR2,2"}]},
    {"action":"capture","turn":2,"player":"Black","list":[{"key":"BKRR","prev":"@KR8,8","post":"@KR5,5"},{"key":"WKRP","prev":"@KR5,5","post":"~KR2,2"}]}],
  "Gambits":[],"AdvSqs":[]}

  **2-4-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","key":"WKRP","prev":"@KR2,2","post":"@KR4,4"},{"action":"move","turn":1,"player":"Black","key":"BKRP","prev":"@KR7,7","post":"@KR5,5"},{"action":"capture","turn":2,"player":"White","list":[{"key":"WKRP","prev":"@KR4,4","post":"@KR5,5"},{"key":"BKRP","prev":"KR5,5"}]},{"action":"capture","turn":2,"player":"Black","list":[{"key":"BKRR","prev":"@KR8,8","post":"@KR5,5"},{"key":"WKRP","prev":"KR5,5"}]}],"Gambits":[],"AdvSqs":[]}

  **2-1-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","key":"WKRP","prev":"@KR2,2","post":"@KR5,5"}],"Gambits":[],"AdvSqs":[]}

## Moves:
  **2-4-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","key":"WKRR","prev":"@KR1,1","post":"@KR3,3"},{"action":"move","turn":1,"player":"Black","key":"BKRR","prev":"@KR8,8","post":"@KR6,6"},{"action":"move","turn":2,"player":"White","key":"WKRR","prev":"@KR3,3","post":"@KR4,4"},{"action":"move","turn":2,"player":"Black","key":"BKRR","prev":"@KR6,6","post":"@KR5,5"}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],
  "Moves":[
    {"action":"move","turn":1,"player":"White","key":"WKRR","prev":"@KR1,1","post":"@KR3,3"},
    {"action":"move","turn":1,"player":"Black","key":"BKRR","prev":"@KR8,8","post":"@KR6,6"},
    {"action":"move","turn":2,"player":"White","key":"WKRR","prev":"@KR3,3","post":"@KR4,4"},
    {"action":"move","turn":2,"player":"Black","key":"BKRR","prev":"@KR6,6","post":"@KR5,5"}],
  "Gambits":[],
  "AdvSqs":[]}

## Debug
  - Three examples, 2 & 3 fail (quad, linear, duplex)
  {"Setup":[],"Moves":[],
  "Gambits":[
    {"gambitId":0,"action":"quad","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"move":"linear","piece":"bishop","src":"Q4,4","dst":"KB6,4","ray":"LFU","advsqs":[[{"srcTile":[0,0,0],"quad":18,"perimeter":2,"stride":1,"area":9},{"srcTile":[0,0,0],"quad":13,"perimeter":2,"stride":1,"area":9}],[{"srcTile":[0,0,0],"quad":25,"perimeter":2,"stride":1,"area":9},{"srcTile":[0,0,0],"quad":26,"perimeter":2,"stride":1,"area":9}]],"opacity":0.5},{"move":"duplex","piece":"duke","src":"Q4,4","dst":"KR4,4","ray":[1,0,0],"advsqs":[{"src":"Q4,4","srcTile":[0,0,0],"quad":38,"perimeter":2,"stride":3,"opacity":0.5},{"src":"Q4,4","srcTile":[0,0,0],"quad":41,"perimeter":2,"stride":3,"opacity":0.5}],"opacity":0.5}],
  "AdvSqs":[]}


  - Fail on duplex
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],
  "Moves":[{"action":"move","turn":1,"player":"White","key":"WKRR","prev":"@KR1,1","post":"@KR3,3"},{"action":"move","turn":1,"player":"Black","key":"BKRR","prev":"@KR8,8","post":"@KR6,6"},{"action":"move","turn":2,"player":"White","key":"WKRR","prev":"@KR3,3","post":"@KR4,4"},{"action":"move","turn":2,"player":"Black","key":"BKRR","prev":"@KR6,6","post":"@KR5,5"},{"action":"move","turn":3,"player":"White","key":"WKBS","prev":"@KB1,1","post":"@KB4,4"}],
  "Gambits":[{"gambitId":0,"action":"quad","src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"move":"duplex","piece":"duke","src":"KR4,4","dst":[8,0,0],"ray":[1,0,0],"advsqs":[{"src":"KR4,4","srcTile":[4,0,0],"quad":38,"perimeter":2,"stride":3,"opacity":0.5},{"src":"KR4,4","srcTile":[4,0,0],"quad":41,"perimeter":2,"stride":3,"opacity":0.5}],"opacity":0.5}],
  "AdvSqs":[]}

  - Fail on linear
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],
  "Moves":[{"action":"move","turn":1,"player":"White","key":"WKRR","prev":"@KR1,1","post":"@KR3,3"},{"action":"move","turn":1,"player":"Black","key":"BKRR","prev":"@KR8,8","post":"@KR6,6"},{"action":"move","turn":2,"player":"White","key":"WKRR","prev":"@KR3,3","post":"@KR4,4"},{"action":"move","turn":2,"player":"Black","key":"BKRR","prev":"@KR6,6","post":"@KR5,5"},{"action":"move","turn":3,"player":"White","key":"WKBS","prev":"@KB1,1","post":"@KB4,4"}],
  "Gambits":[{"gambitId":0,"action":"quad","src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"move":"linear","piece":"bishop","src":"KR4,4","dst":[6,2,0],"ray":"LFU","advsqs":[[{"srcTile":[4,0,0],"quad":18,"perimeter":2,"stride":1,"area":9},{"srcTile":[4,0,0],"quad":13,"perimeter":2,"stride":1,"area":9}],[{"srcTile":[4,0,0],"quad":25,"perimeter":2,"stride":1,"area":9},{"srcTile":[4,0,0],"quad":26,"perimeter":2,"stride":1,"area":9}]],"opacity":0.5}],
  "AdvSqs":[]}

  - Success on quadrant
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],
  "Moves":[{"action":"move","turn":1,"player":"White","key":"WKRR","prev":"@KR1,1","post":"@KR3,3"},{"action":"move","turn":1,"player":"Black","key":"BKRR","prev":"@KR8,8","post":"@KR6,6"},{"action":"move","turn":2,"player":"White","key":"WKRR","prev":"@KR3,3","post":"@KR4,4"},{"action":"move","turn":2,"player":"Black","key":"BKRR","prev":"@KR6,6","post":"@KR5,5"},{"action":"move","turn":3,"player":"White","key":"WKBS","prev":"@KB1,1","post":"@KB4,4"}],
  "Gambits":[{"gambitId":0,"action":"quad","src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5}],
  "AdvSqs":[]}

  - Success on Setup and Moves
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],
  "Moves":[
    {"action":"move","turn":1,"player":"White","key":"WKRR","prev":"@KR1,1","post":"@KR3,3"},
    {"action":"move","turn":1,"player":"Black","key":"BKRR","prev":"@KR8,8","post":"@KR6,6"},
    {"action":"move","turn":2,"player":"White","key":"WKRR","prev":"@KR3,3","post":"@KR4,4"},
    {"action":"move","turn":2,"player":"Black","key":"BKRR","prev":"@KR6,6","post":"@KR5,5"},
    {"action":"move","turn":3,"player":"White","key":"WKBS","prev":"@KB1,1","post":"@KB4,4"}],
  "Gambits":[],
  "AdvSqs":[]}


## Example of Freeze Puzzle
  {"Setup":
    [{"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
    {"action":"placePiece","key":"BKRR","prev":"~KR1,1","post":"@KR8,8"},
    {"action":"shiftPiece","key":"BKRR","prev":"@KR8,8","post":"@KR7,7"},
    {"action":"placePiece","key":"BKRP","prev":"~KR2,2","post":"@KR6,6"},
    {"action":"returnPiece","key":"BKRR","prev":"@KR7,7","post":"~KR1,1"},
    {"action":"freezePuzzle","data":1}],
  "Moves":[],"Gambits":[],"AdvSqs":[]}


## Confirm Gambit Entries have an array of advsqs...
  - Looking at the comprehension pretty print, several incosistencies stand out for Gambits.
    - src only on duplex moves, should be on all.
    - linear & duplex use key 'move' instead of key 'action'.
    - 
  **2-5-4-5**
  {"Setup":[
    {"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
    {"action":"startingPos"}],
  "Moves":[
    {"action":"move","turn":1,"player":"White","key":"WKRR","prev":"@KR1,1","post":"@KR3,3"},
    {"action":"move","turn":1,"player":"Black","key":"BKRR","prev":"@KR8,8","post":"@KR6,6"},
    {"action":"move","turn":2,"player":"White","key":"WKRR","prev":"@KR3,3","post":"@KR4,4"},
    {"action":"move","turn":2,"player":"Black","key":"BKRR","prev":"@KR6,6","post":"@KR5,5"},
    {"action":"move","turn":3,"player":"White","key":"WKBS","prev":"@KB1,1","post":"@KB4,4"}],
  "Gambits":[
    {"gambitId":0,"action":"quad","src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},
    {"move":"linear","piece":"bishop","src":"Q4,4","dst":"KB6,4","ray":"LFU",
      "advsqs":[
        [{"srcTile":[0,0,0],"quad":18,"perimeter":2,"stride":1,"area":9},{"srcTile":[0,0,0],"quad":13,"perimeter":2,"stride":1,"area":9}],
        [{"srcTile":[0,0,0],"quad":25,"perimeter":2,"stride":1,"area":9},{"srcTile":[0,0,0],"quad":26,"perimeter":2,"stride":1,"area":9}]],
        "opacity":0.5},
    {"move":"linear","piece":"duke","src":"Q4,4","dst":"QN6,6","ray":"fore_down",
      "advsqs":[
        [{"srcTile":[0,0,0],"quad":40,"perimeter":2,"stride":1,"area":9},{"srcTile":[0,0,0],"quad":37,"perimeter":2,"stride":1,"area":9}],
        [{"srcTile":[0,0,0],"quad":49,"perimeter":2,"stride":1,"area":9},{"srcTile":[0,0,0],"quad":50,"perimeter":2,"stride":1,"area":9}],
        [{"srcTile":[0,0,0],"quad":57,"perimeter":2,"stride":1,"area":9},{"srcTile":[0,0,0],"quad":58,"perimeter":2,"stride":1,"area":9}]],
        "opacity":0.5},
    {"move":"duplex","piece":"duke","src":"Q4,4","dst":"KR4,4","ray":[1,0,0],
      "advsqs":[
        {"src":"Q4,4","srcTile":[0,0,0],"quad":38,"perimeter":2,"stride":3,"opacity":0.5},
        {"src":"Q4,4","srcTile":[0,0,0],"quad":41,"perimeter":2,"stride":3,"opacity":0.5}],
        "opacity":0.5}],
  "AdvSqs":[
    {"src":"Q4,4","srcTile":[0,0,0],"quad":1,"perimeter":1,"stride":2,"opacity":0.5},
    {"src":"Q4,4","srcTile":[0,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},
    {"src":"Q4,4","srcTile":[0,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},
    {"src":"Q4,4","srcTile":[0,0,0],"quad":1,"perimeter":4,"stride":5,"opacity":0.5},
    {"src":"Q4,4","srcTile":[0,0,0],"quad":1,"perimeter":5,"stride":6,"opacity":0.5}]}



  **2-5-3-0**
  {"Setup":[
    {"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
    {"action":"startingPos"}],
  "Moves":[
    {"action":"move","turn":1,"player":"White","key":"WKRR","prev":"@KR1,1","post":"@KR3,3"},
    {"action":"move","turn":1,"player":"Black","key":"BKRR","prev":"@KR8,8","post":"@KR6,6"},
    {"action":"move","turn":2,"player":"White","key":"WKRR","prev":"@KR3,3","post":"@KR4,4"},
    {"action":"move","turn":2,"player":"Black","key":"BKRR","prev":"@KR6,6","post":"@KR5,5"},
    {"action":"move","turn":3,"player":"White","key":"WKBS","prev":"@KB1,1","post":"@KB4,4"}],
  "Gambits":[
    {"move":"linear","piece":"rook","src":"KR4,4","dst":"KR4,6","ray":"right_fore",
      "advsqs":[
        [{"srcTile":[4,0,0],"quad":1,"perimeter":2,"stride":5,"area":9},{"srcTile":[4,0,0],"quad":2,"perimeter":2,"stride":5,"area":9}],
        [{"srcTile":[4,0,0],"quad":5,"perimeter":2,"stride":5,"area":9},{"srcTile":[4,0,0],"quad":6,"perimeter":2,"stride":5,"area":9}]],
        "opacity":0.5},
    {"move":"duplex","piece":"duke","src":"Q4,4","dst":"KR4,4","ray":[1,0,0],
      "advsqs":[
        {"src":"Q4,4","srcTile":[0,0,0],"quad":38,"perimeter":2,"stride":3,"opacity":0.5},
        {"src":"Q4,4","srcTile":[0,0,0],"quad":41,"perimeter":2,"stride":3,"opacity":0.5}],
        "opacity":0.5},
    {"move":"linear","piece":"duke","src":"Q4,4","dst":"KB6,2","ray":"left_up",
      "advsqs":[
        [{"srcTile":[0,0,0],"quad":44,"perimeter":2,"stride":1,"area":9},{"srcTile":[0,0,0],"quad":41,"perimeter":2,"stride":1,"area":9}],
        [{"srcTile":[0,0,0],"quad":48,"perimeter":2,"stride":1,"area":9},{"srcTile":[0,0,0],"quad":45,"perimeter":2,"stride":1,"area":9}],
        [{"srcTile":[0,0,0],"quad":58,"perimeter":2,"stride":1,"area":9},{"srcTile":[0,0,0],"quad":59,"perimeter":2,"stride":1,"area":9}]],
        "opacity":0.5}],
  "AdvSqs":[]}


## Review Gamit Entries...
  **2-5-1-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],
  "Moves":[{"action":"move","turn":1,"player":"White","key":"WKRR","prev":"@KR1,1","post":"@KR3,3"},{"action":"move","turn":1,"player":"Black","key":"BKRR","prev":"@KR8,8","post":"@KR6,6"},{"action":"move","turn":2,"player":"White","key":"WKRR","prev":"@KR3,3","post":"@KR4,4"},{"action":"move","turn":2,"player":"Black","key":"BKRR","prev":"@KR6,6","post":"@KR5,5"},{"action":"move","turn":3,"player":"White","key":"WKBS","prev":"@KB1,1","post":"@KB4,4"}],
  "Gambits":[
    {"move":"linear","piece":"rook","src":"KR4,4","dst":"KR4,6","ray":"right_fore",
    "advsqs":[
      [{"srcTile":[4,0,0],"quad":1,"perimeter":2,"stride":1,"area":9},{"srcTile":[4,0,0],"quad":2,"perimeter":2,"stride":1,"area":9}],
      [{"srcTile":[4,0,0],"quad":5,"perimeter":2,"stride":1,"area":9},{"srcTile":[4,0,0],"quad":6,"perimeter":2,"stride":1,"area":9}]],
      "opacity":0.5}],
  "AdvSqs":[]}


## Debug button Allowuances for Gambits.
  **2-5-0-9**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","key":"WKRR","prev":"@KR1,1","post":"@KR3,3"},{"action":"move","turn":1,"player":"Black","key":"BKRR","prev":"@KR8,8","post":"@KR6,6"},{"action":"move","turn":2,"player":"White","key":"WKRR","prev":"@KR3,3","post":"@KR4,4"},{"action":"move","turn":2,"player":"Black","key":"BKRR","prev":"@KR6,6","post":"@KR5,5"},{"action":"move","turn":3,"player":"White","key":"WKBS","prev":"@KB1,1","post":"@KB4,4"}],"Gambits":[],"AdvSqs":[{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":1,"stride":2,"opacity":0.5},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":4,"opacity":0.5},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":1,"stride":3,"opacity":0.5},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":3,"opacity":0.5},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":2,"opacity":0.5},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":1,"opacity":0.5}]}

  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],
  "Moves":[{"action":"move","turn":1,"player":"White","key":"WKRR","prev":"@KR1,1","post":"@KR3,3"},{"action":"move","turn":1,"player":"Black","key":"BKRR","prev":"@KR8,8","post":"@KR6,6"},{"action":"move","turn":2,"player":"White","key":"WKRR","prev":"@KR3,3","post":"@KR4,4"},{"action":"move","turn":2,"player":"Black","key":"BKRR","prev":"@KR6,6","post":"@KR5,5"},{"action":"move","turn":3,"player":"White","key":"WKBS","prev":"@KB1,1","post":"@KB4,4"}],
  "Gambits":[],
  "AdvSqs":[]}

## Combined Saved Test
  **2-3-3-6**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","key":"WKRR","prev":"@KR1,1","post":"@KR3,3"},{"action":"move","turn":1,"player":"Black","key":"BKRR","prev":"@KR8,8","post":"@KR6,6"},{"action":"move","turn":2,"player":"White","key":"WKRR","prev":"@KR3,3","post":"@KR4,4"}],"Gambits":[{"gambitId":0,"action":"quad","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"gambitId":1,"action":"quad","src":"Q4,4","srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"opacity":0.5},{"gambitId":2,"action":"quad","src":"Q4,4","srcTile":[0,0,0],"quad":37,"perimeter":3,"stride":1,"opacity":0.5}],"AdvSqs":[{"action":"place","src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},{"src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":1,"stride":2,"opacity":0.5},{"src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":4,"stride":5,"opacity":0.5},{"src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":5,"stride":6,"opacity":0.5}]}

    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],
    "Moves":[{"action":"move","turn":1,"player":"White","key":"WKRR","prev":"@KR1,1","post":"@KR3,3"},{"action":"move","turn":1,"player":"Black","key":"BKRR","prev":"@KR8,8","post":"@KR6,6"},{"action":"move","turn":2,"player":"White","key":"WKRR","prev":"@KR3,3","post":"@KR4,4"}],
    "Gambits":[{"gambitId":0,"action":"quad","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"gambitId":1,"action":"quad","src":"Q4,4","srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"opacity":0.5},{"gambitId":2,"action":"quad","src":"Q4,4","srcTile":[0,0,0],"quad":37,"perimeter":3,"stride":1,"opacity":0.5}],
    "AdvSqs":[{"action":"place","src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},{"src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":1,"stride":2,"opacity":0.5},{"src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":4,"stride":5,"opacity":0.5},{"src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":5,"stride":6,"opacity":0.5}]}


## Gambits Development
 ### Quads, rook, bishop, duke.
  **0-0-3-0**
  {"Setup":[],"Moves":[],"Gambits":[{"gambitId":0,"action":"quad","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"gambitId":1,"action":"quad","src":"Q4,4","srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"opacity":0.5},{"gambitId":2,"action":"quad","src":"Q4,4","srcTile":[0,0,0],"quad":37,"perimeter":3,"stride":1,"opacity":0.5}],"AdvSqs":[]}

  { "Setup":[],
    "Moves":[],
    "Gambits":[
      {"gambitId":0,"action":"quad","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},
      {"gambitId":1,"action":"quad","src":"Q4,4","srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"opacity":0.5},
      {"gambitId":2,"action":"quad","src":"Q4,4","srcTile":[0,0,0],"quad":37,"perimeter":3,"stride":1,"opacity":0.5}],
    "AdvSqs":[]}

 ### Quads, rook, rook, bishop.
  **0-0-3-0**
  {"Setup":[],"Moves":[],"Gambits":[{"action":"quad","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"action":"quad","src":"Q4,4","srcTile":[0,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"action":"quad","src":"Q4,4","srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"opacity":0.5}],"AdvSqs":[]}

  { "Setup":[],
    "Moves":[],
    "Gambits":[
      {"action":"quad","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},
      {"action":"quad","src":"Q4,4","srcTile":[0,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},
      {"action":"quad","src":"Q4,4","srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"opacity":0.5}],
    "AdvSqs":[]}

 ### Quads, rook, bishop, duke.
  **0-0-3-0**
  {"Setup":[],"Moves":[],"Gambits":[{"Q":1,"src":"KR4,4","dst":"KR6,6","area":9,"advsqs":[{"src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5}]},{"Q":13,"src":"Q4,4","dst":"KN7,4","area":16,"advsqs":[{"src":"Q4,4","srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"opacity":0.5}]},{"Q":37,"src":"Q4,4","dst":"QR7,7","area":16,"advsqs":[{"src":"Q4,4","srcTile":[0,0,0],"quad":37,"perimeter":3,"stride":1,"opacity":0.5}]}],"AdvSqs":[]}

  { "Setup":[],
    "Moves":[],
    "Gambits":[
      {"Q":1,"src":"KR4,4","dst":"KR6,6","area":9,"advsqs":[{"src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5}]},
      {"Q":13,"src":"Q4,4","dst":"KN7,4","area":16,"advsqs":[{"src":"Q4,4","srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"opacity":0.5}]},
      {"Q":37,"src":"Q4,4","dst":"QR7,7","area":16,"advsqs":[{"src":"Q4,4","srcTile":[0,0,0],"quad":37,"perimeter":3,"stride":1,"opacity":0.5}]}],
    "AdvSqs":[]}

## Gambits Entry
 ### Rook Linear
  **0-0-1-0**
  {"Setup":[],"Moves":[],"Gambits":[{"move":"linear","piece":"rook","src":"KB4,4","dst":"KB7,4","ray":"left_fore","advsqs":[[{"srcTile":[2,0,0],"quad":4,"perimeter":3,"stride":1,"area":16},{"srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":1,"area":16}],[{"srcTile":[2,0,0],"quad":9,"perimeter":3,"stride":1,"area":16},{"srcTile":[2,0,0],"quad":10,"perimeter":3,"stride":1,"area":16}]],"opacity":0.5}],"AdvSqs":[]}

  {"Setup":[],
  "Moves":[],
  "Gambits":[
    { "move":"linear","piece":"rook","src":"KB4,4","dst":"KB7,4","ray":"left_fore",
      "advsqs":[
        [{"srcTile":[2,0,0],"quad":4,"perimeter":3,"stride":1,"area":16}, {"srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":1,"area":16}],
        [{"srcTile":[2,0,0],"quad":9,"perimeter":3,"stride":1,"area":16}, {"srcTile":[2,0,0],"quad":10,"perimeter":3,"stride":1,"area":16}] ],
      "opacity":0.5}
    ],
  "AdvSqs":[]}

 ### Duke Duplex
  **0-0-1-0**
  {"Setup":[],
  "Moves":[],
  "Gambits":[
    { "move":"duplex","piece":"duke","src":"QN4,4","dst":"KR4,4","ray":[1,0,0],
      "advsqs":[
        {"src":"QN4,4","srcTile":[-2,0,0],"quad":38,"perimeter":3,"stride":4,"opacity":0.5},
        {"src":"QN4,4","srcTile":[-2,0,0],"quad":41,"perimeter":3,"stride":4,"opacity":0.5}],
      "opacity":0.5 }
    ],
  "AdvSqs":[]}

 ### Rook Quadrant
  **0-0-1-0**
  {"Setup":[],"Moves":[],"Gambits":[{"Q":1,"src":"KB4,4","dst":"KB7,7","area":16,"advsqs":[{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5}]}],"AdvSqs":[]}

  {"Setup":[],
  "Moves":[],
  "Gambits":[
    { "Q":1,"src":"KB4,4","dst":"KB7,7","area":16,
      "advsqs":[
        {"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5}]
    }
    ],
  "AdvSqs":[]}

## Gambits are broken, but the rest of the undo system looks ok?
 **2-3-0-6**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","key":"WKRR","prev":"@KR1,1","post":"@KR3,3"},{"action":"move","turn":1,"player":"Black","key":"BKRR","prev":"@KR8,8","post":"@KR6,6"},{"action":"move","turn":2,"player":"White","key":"WKRR","prev":"@KR3,3","post":"@KR4,4"}],"Gambits":[],"AdvSqs":[{"action":"place","src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},{"src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":1,"stride":2,"opacity":0.5},{"src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":4,"stride":5,"opacity":0.5},{"src":"KR4,4","srcTile":[4,0,0],"quad":1,"perimeter":5,"stride":6,"opacity":0.5}]}

## Test less dimming on future entries.
 **2-3-3-0
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","key":"WKRR","prev":"@KR1,1","post":"@KR3,3"},{"action":"move","turn":1,"player":"Black","key":"BKRR","prev":"@KR8,8","post":"@KR6,6"},{"action":"move","turn":2,"player":"White","key":"WKRR","prev":"@KR3,3","post":"@KR4,4"}],"Gambits":[{"Q":1,"src":"KB4,4","dst":"KB7,7","area":16,"advsqs":[{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5}]},{"Q":13,"src":"Q4,4","dst":"KN7,4","area":16,"advsqs":[{"src":"Q4,4","srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"opacity":0.5}]},{"Q":37,"src":"Q4,4","dst":"QR7,7","area":16,"advsqs":[{"src":"Q4,4","srcTile":[0,0,0],"quad":37,"perimeter":3,"stride":1,"opacity":0.5}]}],"AdvSqs":[]}


## 8x8x8 board with two piece placements, then a pair of moves - success.
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"placePiece","key":"WKRR","prev":"~KR1,1","post":"@KR2,2"},{"action":"placePiece","key":"BKRR","prev":"~KR1,1","post":"@KR7,7"},{"action":"freezePuzzle","data":2}],"Moves":[{"action":"move","turn":1,"player":"White","key":"WKRR","prev":"@KR2,2","post":"@KR3,3"},{"action":"move","turn":1,"player":"Black","key":"BKRR","prev":"@KR7,7","post":"@KR6,6"}],"Gambits":[],"AdvSqs":[]}

## Test Move (6/17/26) Success!
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","key":"WKRR","prev":"@KR1,1","post":"@KR3,3"},{"action":"move","turn":1,"player":"Black","key":"BKRR","prev":"@KR8,8","post":"@KR6,6"},{"action":"move","turn":2,"player":"White","key":"WKRR","prev":"@KR3,3","post":"@KR4,4"},{"action":"move","turn":2,"player":"Black","key":"BKRR","prev":"@KR6,6","post":"@KR5,5"}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"startingPos"}],
  "Moves":[
    {"action":"move","turn":1,"player":"White","key":"WKRR","prev":"@KR1,1","post":"@KR3,3"},
    {"action":"move","turn":1,"player":"Black","key":"BKRR","prev":"@KR8,8","post":"@KR6,6"},
    {"action":"move","turn":2,"player":"White","key":"WKRR","prev":"@KR3,3","post":"@KR4,4"},
    {"action":"move","turn":2,"player":"Black","key":"BKRR","prev":"@KR6,6","post":"@KR5,5"}],
  "Gambits":[],
  "AdvSqs":[]}

## Test Move (6/16/26) Success!
  {"Setup":[
    {"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
    {"action":"startingPos","data":32}],
  "Moves":[
    {"action":"move","turn":1,"player":"White","key":"BKRR","prev":"@KR8,8","post":"@KR6,6"}],
  "Gambits":[],
  "AdvSqs":[]}

## Test Teleportation and Uplift
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"placePiece","key":"BKBS","prev":"~KB1,1","post":"@KB8,8"},{"action":"placePiece","key":"BKBD","prev":"~KB1,2","post":"@KB6,6"},{"action":"placePiece","key":"BKBB","prev":"~KB2,1","post":"@KB4,4"},{"action":"freezePuzzle","data":3}],"Moves":[],"Gambits":[],"AdvSqs":[]}

  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"placePiece","key":"BKBP","prev":"~KB2,2","post":"@KB2,2"},{"action":"placePiece","key":"BKKP","prev":"~K2,2","post":"@K2,2"},{"action":"placePiece","key":"BKBB","prev":"~KB2,1","post":"@KB1,1"},{"action":"placePiece","key":"BKBD","prev":"~KB1,2","post":"@K1,1"},{"action":"freezePuzzle","data":4}],"Moves":[],"Gambits":[],"AdvSqs":[]}

## Place piece test on 10x8x8.
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"10x8x8","trayType":"Real","trayGap":0}},{"action":"placePiece","key":"BKRR","prev":"~KR1,1","post":"@KR5,5"}],"Moves":[],"Gambits":[],"AdvSqs":[]}

## Boards, Pieces, Freeze, Play (6/14/26)
  **11-0-0-0**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"makeBoard","prevBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0},"nextBoard":{"boardSize":"10x8x8","trayType":"Real","trayGap":0}},{"action":"makeBoard","prevBoard":{"boardSize":"10x8x8","trayType":"Real","trayGap":0},"nextBoard":{"boardSize":"10x10x10","trayType":"Fact","trayGap":0}},{"action":"makeBoard","prevBoard":{"boardSize":"10x10x10","trayType":"Fact","trayGap":0},"nextBoard":{"boardSize":"10x8x8","trayType":"Fact","trayGap":0}},{"action":"makeBoard","prevBoard":{"boardSize":"10x8x8","trayType":"Fact","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Fact","trayGap":0}},{"action":"placePiece","key":"BKRR","prev":"~KR1,1","post":"@KR8,8"},{"action":"placePiece","key":"BKRP","prev":"~KR2,2","post":"@KR7,7"},{"action":"shiftPiece","key":"BKRP","prev":"@KR7,7","post":"@KR6,6"},{"action":"shiftPiece","key":"BKRP","prev":"@KR6,6","post":"@KR5,5"},{"action":"shiftPiece","key":"BKRP","prev":"@KR5,5","post":"@KR4,4"},{"action":"returnPiece","key":"BKRR","prev":"@KR8,8","post":"~KR1,1"}],"Moves":[],"Gambits":[],"AdvSqs":[]}

## Save Place Piece States (6/12/26) - MakeBoard, place/shift/return BKRR.
  **4-0-0-0**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"placePiece","key":"BKRR","prev":"~KR1,1","post":"@KR6,6"},{"action":"shiftPiece","key":"BKRR","prev":"@KR6,6","post":"@KR5,5"},{"action":"returnPiece","key":"BKRR","prev":"@KR5,5","post":"~KR1,1"}],"Moves":[],"Gambits":[],"AdvSqs":[]}

## Save Setup States (6/12/26)
 ### Make Boards - pass: buttons click/radio, list/highlighting, undo/redo, rewind/FF, load/save.
  **3-0-0-0**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0},"boardSize":"8x8x8","trayType":"Real","trayGap":0},{"action":"makeBoard","prevBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0},"nextBoard":{"boardSize":"10x8x8","trayType":"Real","trayGap":0},"boardSize":"10x8x8","trayType":"Real","trayGap":0},{"action":"makeBoard","prevBoard":{"boardSize":"10x8x8","trayType":"Real","trayGap":0},"nextBoard":{"boardSize":"10x10x10","trayType":"Fact","trayGap":0},"boardSize":"10x10x10","trayType":"Fact","trayGap":0}],"Moves":[],"Gambits":[],"AdvSqs":[]}

  **3-0-0-0**
    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
        "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0},"boardSize":"8x8x8","trayType":"Real","trayGap":0},
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0},
        "nextBoard":{"boardSize":"10x8x8","trayType":"Fact","trayGap":0},"boardSize":"10x8x8","trayType":"Fact","trayGap":0},
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"10x8x8","trayType":"Fact","trayGap":0},
        "nextBoard":{"boardSize":"10x10x10","trayType":"Fact","trayGap":0},"boardSize":"10x10x10","trayType":"Fact","trayGap":0}],
    "Moves":[],
    "Gambits":[],
    "AdvSqs":[]}

  **4-0-0-0**
    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
        "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0},
        "boardSize":"8x8x8","trayType":"Real","trayGap":0},
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0},
        "nextBoard":{"boardSize":"10x8x8","trayType":"Real","trayGap":0},
        "boardSize":"10x8x8","trayType":"Real","trayGap":0},
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"10x8x8","trayType":"Real","trayGap":0},
        "nextBoard":{"boardSize":"10x10x10","trayType":"Fact","trayGap":0},
        "boardSize":"10x10x10","trayType":"Fact","trayGap":0},
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"10x10x10","trayType":"Fact","trayGap":0},
        "nextBoard":{"boardSize":"10x8x8","trayType":"Fact","trayGap":0},
        "boardSize":"10x8x8","trayType":"Fact","trayGap":0}],
    "Moves":[],
    "Gambits":[],
    "AdvSqs":[]}

## Useful global search and replace command...
  ```
  Global Command to Label Dependencies
  find ./assets/3dc -type f -name "*.js" \
    -exec sed -i '' \
    's/--- Build upon previous layers ---/--- Dependencies ---/g' {} +
  ```

