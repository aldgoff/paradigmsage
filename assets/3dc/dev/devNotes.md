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

