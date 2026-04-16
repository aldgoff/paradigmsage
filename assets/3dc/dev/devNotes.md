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

