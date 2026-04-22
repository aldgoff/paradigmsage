# DevNotes
  A place to capture the AI's verbose recommendations for stepwise implementation.

## Standardized File Header Comment
  I want a consice standardized file header.

  ```
  /* File: coords.js
    Path: ./3dc/foundation/coords/
    Purpose: Establish the 3 integral coordinate systems for 3D chess (left-handed).
    Author: Allan Goff
    Date: 
    UI: the export functions.
  */
  ```

## AI Feedback on DOM Panels
  1. ✅ Drag Behavior
  2. ✅ Dynamic z-index
  3. ✅ Listeners in makeDraggable, move out.
  4. ✅ Pointer capture
  5. ✅ View wiring
  6. ✅ CSV indentation
  7. ✅ Arch checkpoint

## Near Term Todos:
  1. Add next panel or two. 
  2. Move panel state change routines into their own files, (controller/panels/gambit.js, move.js, setup.js, etc.). 
  3. Then finish the panels.

## Eliminating Inisights in favor of Gambits - branch 3dc-insights
  ```grep -RIn "nsight" ./assets/3dc | wc   62 lines ```
 ### ✅ Tests
  ✅ state.test.js
  ✅ gambit.test.js

 ### ✅ Controller
  ✅ events.js
  ✅ controller.js

 ### ✅ Model
  ✅ model.json
  ✅ model.md
  ✅ state.json
  ✅ state.md
  ✅ state.js
  ✅ gambit.json
  ✅ gambit.md

## Make Board via State History and MVC Architecture.
 ### state.js

 ### events.js
  handleNewGame()
  ✅ handleRerun()
  ✅ handleUndo()
  ✅ handleRedo()
  handleLoad()
  handleSave()

  renderState()

 ### ✅ boards.js

 ### controller.js
  renderState()

## Advsq Tasks
 ### 1. ✅ Delete prev

 ### 2. ✅ Decorator layering visual glitches

 ### 3. Dst decorator for stride tile

 ### 4. wire input fields for direct update.

 ### 5. Advsq does not extend off board.

 ### 6. Undo not working.

## AI Fuck up on offboard decorators...
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   assets/3dc/controller/events.js
	modified:   assets/3dc/model/state/state.js
	modified:   assets/3dc/view/advsqs/advsqs.js
	modified:   assets/3dc/view/advsqs/advsqs.md
	modified:   assets/3dc/view/boards/boards.js
	modified:   assets/3dc/view/view.js
	modified:   content/3dc/play.md

no changes added to commit (use "git add" and/or "git commit -a")
MacBookPro:paradigmsage adgoff$ git diff --stat
 assets/3dc/controller/events.js  |  40 ++++++++++-------------------
 assets/3dc/model/state/state.js  |   8 +++---
 assets/3dc/view/advsqs/advsqs.js | 130 ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++-
 assets/3dc/view/advsqs/advsqs.md |  10 +++++++-
 assets/3dc/view/boards/boards.js |  99 +++++++++++++++++++++++++++++++++++++++++++++++++++++++++--------------
 assets/3dc/view/view.js          |   2 +-
 content/3dc/play.md              |   6 ++---
 7 files changed, 240 insertions(+), 55 deletions(-)
MacBookPro:paradigmsage adgoff$ 


git stash push -m "WIP: advsq offboard experiment"

## Capture code lines
  wirePanel("advsq-window",  "advsq",  buildAdvsqPayload);
  const panel = document.getElementById(panelId);

    srcTile:  panel.querySelector('[name="advsq-src"]')?.value,
    quad:     panel.querySelector('[name="advsq-quad"]')?.value,
    perimeter:panel.querySelector('[name="advsq-perimeter"]')?.value,
    stride:   panel.querySelector('[name="advsq-stride"]')?.value,

panel.querySelector('[name="advsq-quad"]').value = 3;
panel.querySelector('[name="advsq-perimeter"]').value = 5;
panel.querySelector('[name="advsq-stride"]').value = 2;

## Making Tile Meshes...
  let count = 0;
  for(let z=Sz; z<=Z; z++) {  // Create the board.
    for(let x=Sx; x<=X; x++) {
      for(let y=Sy; y<=Y; y++) {
        let pos = [z, x, y];
        let tile = tiles.getTileAttributes(pos);
        let meshTile = tiles.createMeshTile(tile, tileGeometry, pos);
        initTileUserData(meshTile, tile, pos, tileMap);
        boardGroup.add(meshTile); // Add tile to board.
        count++;
      }
    }
  }
  view.context.scene.add(boardGroup);              // Add board to scene.
  currentBoard = boardGroup;

## Advsq Panel Flow...
UI input change
   ↓
handleUpdateParam
   ↓
changeAdvSq (save inputs only)
   ↓
undo state (inputs only)
   ↓
UNDO / REDO
   ↓
specsToPanelParams (recompute everything)
   ↓
setAdvsqPanelParams

## MVC Flow...

## Undo Checkllist.
 ### 1. Extract Game Control (Undo System)
  Goal: isolate undo/redo logic like advsqs

  Create new module:
  - /controller/game/game.js

  Move from events.js:
  - handleUndo
  - handleRedo
  - handleRerun
  - currentKeyIndex
  - prevKeyIndex
  - nextKeyIndex
  - showUndoStatusInPanel
  - undoState + undoIndex (legacy)
  
 ### 2. Replace Dispatch Hook (single-line switch)
  In events.js:

  ```
    register.gameControlDispatcher(gameButtonDispatch);
  ```

  → becomes:

  ```  
    import * as game from "./game/game.js";
    register.gameControlDispatcher(game.panelDispatch);
  ```

  ✔ This is your parallel swap seam
  
 ### 3. Mirror advsqs Pattern
  Your advsqs module is already the template:
  - export function panelDispatch(payload)

  Create equivalent:
    - game.panelDispatch(payload)

  Route actions:
  - undo
  - redo
  - rerun
  - newGame (stub OK)
  - load/save (stub OK)
  
 ### 4. Define Index Semantics (lock this now)
  Replace array-based index with scalar:

  ```  
    undoIndex = {
      Setup:   0,
      Moves:   0,
      Gambits: 0,
      AdvSqs:  0
    }
  ```  
  Enforce invariant:

  ```  
  0 ≤ undoIndex[key] ≤ state[key].length
  ```    

 ### 5. Implement Push Semantics (critical)
  For each buffer:

  If undoIndex === length
  - no truncation of current buffer
  Else
  - truncate current buffer to index
  Then:
  - delete downstream buffers entirely
  Downstream map (explicit, no guessing)

  ```
    const downstream = {
      Setup:   ["Moves", "Gambits", "AdvSqs"],
      Moves:   ["Gambits", "AdvSqs"],
      Gambits: ["AdvSqs"],
      AdvSqs:  []
    };
  ```

  After push:
  ``` undoIndex[buffer]++```

 ### 6. Implement Replace Semantics (limit compliance)
  Use index, not array end:

  ```
    arr[undoIndex[buffer] - 1] = values
  ```
  - No:
  - push
  - index change
  - downstream deletion

 ### 7. Remove Controller Dependency from AdvSq (prep)
  Right now:

    events.cloneStateHistory()

  Leave as-is (temporary)
  Mark as legacy coupling point

  This will be removed when state owns undo.

 ### 8. Stub UI Completeness (your stated priority)
  Ensure all actions exist even if empty:
  - newGame
  - rerun
  - undo
  - redo
  - load
  - save

  ✔ Behavior optional

  ✔ Dispatch must not throw  

 ### 9. Guard Rails (minimal but important)
  - Prevent negative index
  - Prevent index > length
  - Replace only if index > 0
  
 ### 10. DO NOT TOUCH (for now)
  ❌ state.js ownership of undo

  ❌ controller undoState

  ❌ rendering side effects

  ❌ normalization duplication

  These are phase 2.

  Arch...
  ```
  View → registerHandlers → events.js
                               ↓
                        game.panelDispatch   (NEW)
                        advsqs.panelDispatch (EXISTING)
                               ↓
                           state.js
  ```
  
   