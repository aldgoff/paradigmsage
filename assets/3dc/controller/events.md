# Events Spec
  The event handler and dispatcher.

## 1. Purpose
  Keeping the MVC layers cleanly separated requires function registration and callback.
  I have always found this difficult to see in the code.
  The purpose of this doc is to overcome that limitation.

## 2. Concepts
  The game control panels are now implemented in the DOM layer.
  This provides bring-to-front selection, dragging, buttons, boxes, etc.

 ### 2.1 Jargon
  - DOM
  - Panels
  - Callbacks
  - Registration
  - Listeners
  - Window controls
  - etc.

## 3. File Map
 ### 3.0 Files
  - play.md
  - controller/controller.js
  - controller/eventHandler.js - TODO: rename to events.js?
  - view/registerHandlers.js
  - view/view.js

 ### 3.1 play.md (makes panel visible)
    +----------------------------------+
    | CSS <style> ... </style>         |
    | 3D canvas                        |
    | Panels                           |
    |   Title                          |
    |   Buttons                        |
    |   Other controls                 |
    +----------------------------------+

 ### 3.2 controller.js
    +----------------------------------------------------------+
    | makeDraggable(document.getElementById("setup-window"));  |
    | makeDraggable(document.getElementById("tray-window"));   |
    | ...                                                      |
    | register.callbacks(); Register each panel w/ view layer  |
    |                                                          |
    | window.addEventListener("pointermove", (e) =>            |
    | window.addEventListener("pointerup", () =>               |
    | function makeDraggable(element) {                        |
    |   element.addEventListener("pointerdown", (e) =>         |
    +----------------------------------------------------------+

 ### 3.3 eventHandler.js
    +-----------------------------------------------------------+
    | export function callbacks() {                             |
    |   register.setupControlDispatcher(setupPanelDispatch);    |
    |   register.gambitControlDispatcher(gambitButtonDispatch); |
    | ...                                                       |
    |                                                           |
    | function setupPanelDispatch(payload) {                    |
    |   const { action, boardSize } = payload;                  |
    |   switch (action)                                         |
    |     case "makeBoard": handleMakeBoard(boardSize); break;  |
    |   }                                                       |
    | }                                                         |
    | function gambitButtonDispatch(button) {                   |
    |   const { action } = payload;                             |
    |   switch (action)                                         |
    |     case "undo": handleUndo(); break;                     |
    |     case "redo": handleRedo(); break;                     |
    |     ...                                                   |
    |     case "rerun": handleRun(); break;                     |
    |   }                                                       |
    | }                                                         |
    | ...                                                       |
    +-----------------------------------------------------------+

 ### 3.4 registerHandlers.js
    +-----------------------------------------------------------------------+
    | export const callback = {                                             |
    |   game: null,                                                         |
    |   ...                                                                 |
    |   gambit: null,                                                       |
    | }                                                                     |
    |                                                                       |
    | export function gameControlDispatcher(fn)   { callback.game   = fn; } |
    | ...                                                                   |
    | export function gambitControlDispatcher(fn) { callback.gambit = fn; } |
    +-----------------------------------------------------------------------+

 ### 3.5 view.js
    +---------------------------------------+
    | wirePanel("gambit-window", "gambit"); |
    | wirePanel("setup-window", "setup");   |
    | ...                                   |
    +---------------------------------------+

 ### 3.2 tbd.js
    +----------------------------------+
    |                                  |
    |                                  |
    |                                  |
    |                                  |
    +----------------------------------+

## 4. A Table if Needed
    | Panel   | Button List                    | Checkboxes            | Radio Buttons | Text Boxes    | Scroll |
    | :----- -| :----------------------------- | :-------------------- | :------------ | :------------ | :----- |
    | Setup   | MakeBoard MakeTrays            | 8x8x8 10x8x8 10x10x10 |  |
    | Game    | New Rerun Undo Redo Load Save  |                       |  |
    | Trays   | Create Show Hide               |                       | Gen: Real Factory, Gap: 0 1 2 |
    | Moves   |  |  |  |
    | Gambit  | Freeze Next Prev Delete Select |                       |  |
    | Compass |  |  |  |
    | AdvSqs  |  |  |  |
    | Camera  | ZoomIn ZoomOut Ascend Descend  |                       |  POV: White Neutral Black Negative  |
    |  |  |  |  |

