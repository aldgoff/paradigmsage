# Controller Spec
  Specify the controller with event dispatching.

## 1. Purpose
  This is the C part of the MVC design pattern.
  Keeping the MVC layers cleanly separated requires function registration and callback.

## 2. Jargon
  - DOM
  - Panels
  - Payloads
  - Callbacks
  - Registration
  - Listeners
  - Window controls
  - etc.

## 3. DOM Panels.
  The control panels are implemented in the DOM layer.
  This provides bring-to-front selection, dragging, buttons, boxes, etc.
  2D panels are defined to control game setup, exploration, and play.
  The driver in the design is the undo system (see the state module).
  Each 2D panel floats in front of the game board and can be dragged.

  | play.md: CSS   | play.md: div id | control.init  |
  | :------------- | :-------------- | :------------ |
  | #setup-window  | setup-window    | setup-window  |
  | #move-window   | move-window     | move-window   |
  | #gambit-window | gambit-window   | gambit-window |
  | #advsq-window  | advsq-window    | advsq-window  |
  | #game-window   | game-window     | game-window   |
  |  |  |  |
  | #camera-window | camera-window   | camera-window |
  | #viewer-window | viewer-window   | viewer-window |

  | Panel   | Button List / Derived Fields                 | Keys  | Radio Buttons                | Text Boxes    | Scroll      |
  | :----- -| :------------------------------------------- | :---- | :--------------------------- | :------------ | :---------- |
  | Setup   | Make-Board                                   |       | 8x8x8 10x8x8 10x10x10        |               |             |
  | Setup   | Trays:                                       |       | None Real Factory            |               |             |
  | Setup   | Initial Position:                            |       | Standard Manual              |               |             |
  | Moves   | (Move-White-Black-Coords-Annotations)        |       |                              |               | Move list   |
  | Gambit  | Freeze-AdvSq|Linear|Overlap Delete           |       |                              |               | Gambit list |
  | Gambit  |   Derived: Open, Blocked, MoveType           |       |                              |               |             |
  | Gambit  |   Derived: Overlap, LowestPiece              |       |                              |               |             |
  | AdvSq   | Place Remove Grow Shrink                     | k i j |                              | src (string)  |             |
  | AdvSq   | NextQuad NextPlane NextPiece                 | K I J |                              | Quad (0-60)   |             |
  | AdvSq   |   Derived: BP, P, Nickname, Plane, Quad-Type |       |                              | Perim (0-9)   |             |
  | AdvSq   |   Derived: Length, Area, Onboard, Overlap    |       |                              | Stride (1-19) |             |
  | AdvSq   |   Derived: Stride-Type, Move-Type, Piece     |       |                              |               |             |
  | Game    | New Rerun Undo Redo Load Save                |       |                              |               | Undo buffer |
  | Compass |                                              |       |                              |               |             |
  | Camera  | ZoomIn ZoomOut Ascend Descend                |       | White Neutral Black Negative |               |             |
  | Viewer  | Show-Trays Hide-Trays                        |       |                              | Gap (number)  |             |
  |  |  |  |  |

 ### 3.1 Setup Panel
  - Make 1 of three boards
  - Create trays (2 types)
  - Select initial position

 ### 3.2 Game Panel
  - New
  - Rerun
  - Undo
  - Redo
  - Load
  - Save
  - Undo buffer list

 ### 3.3 Move Panel
  - Listing of moves in 5 columns
    - Move
    - White
    - Black
    - Coordinates
    - Annotations

 ### 3.4 Gambit Panel
  - Freeze Quadrant
  - Freeze Linear
  - Freeze Overlap
  - Delete
  - Derived fields:
    - Open
    - Blocked
    - MoveType
    - Overlap
    - LowestPiece

 ### 3.5 Advsqs Panel
  - Place
  - Remove
  - Grow
  - Shrink
  - Source Tile
  - Quad
  - Perimeters
  - Stride
  - Slip & Slide Nudges
    - kij
    - KIJ
  - Next Quad
  - Next Plane
  - Next Piece
  - Offboard Visibility
  - Derived fields:
    - BP
    - P
    - Nickname
    - Plane
    - Quad Type
    - Length
    - Area
    - Onboard
    - Stride Type
    - Move Type
    - Overlap
    - Piece

 ### 3.6 Compass Panel (tbd)

 ### 3.7 Camera Panel
  - Zoom In
  - Zoom Out
  - Ascend
  - Descend
  - POVs:
    - White
    - Neutral (default)
    - Black
    - Negative

 ### 3.8 Viewer Panel
  - Show Trays
  - Hide Trays
  - Gap
  - Jitter Range
  - Jitter Speed

## 4. File Map
 ### 4.0 Files
  - play.md
  - controller/controller.js
  - controller/<panelDirectories>/...
  - view/view.js
  - view/registerHandlers.js

 ### 4.1 play.md (makes panel visible)
    +---------------------------------------+
    | CSS <style> ... </style>              |
    |   fonts, padding, margins, etc.       |
    |   Initial locations of the panels.    |
    | 3D canvas                             |
    | DOM Panels                            |
    |   class="panel"                       |
    |   id="<name>-window"                  |
    | Sections                              |
    |   Title                               |
    |   Buttons                             |
    |   Input                               |
    |     name, type, min, step, value, max |
    |   Output                              |
    |     name, style, initial value        |
    |   Range                               |
    +---------------------------------------+

 ### 4.2 controller.js
    +----------------------------------------------------------+
    | makeDraggable(document.getElementById("setup-window"));  |
    | makeDraggable(document.getElementById("tray-window"));   |
    | ...                                                      |
    | callbacks(); Register each panel w/ view layer           |
    |                                                          |
    | window.addEventListener("pointermove", (e) =>            |
    | window.addEventListener("pointerup", () =>               |
    | function makeDraggable(element) {                        |
    |   element.addEventListener("pointerdown", (e) =>         |
    +----------------------------------------------------------+
    +----------------------------------------------------------+
    | function callbacks() {                                   |
    |   register.setupControlDispatcher(<panel>PanelDispatch); |
    |   ...                                                    |
    |                                                          |
    | function <panel>PanelDispatch(payload) {                 |
    |   const { action, item1, item2, ... } = payload;         |
    |   switch (action)                                        |
    |     case "undo": handleUndo(); break;                    |
    |     case "redo": handleRedo(); break;                    |
    |     ...                                                  |
    |     case "rerun": handleRun(); break;                    |
    |   }                                                      |
    | }                                                        |
    | function handle<whatever>() {...}                        |
    | function handle<another>() {...}                         |
    |   ...                                                    |
    |                                                          |
    | function <panel>PanelDispatch(payload) {...}             |
    |   ...                                                    |
    +----------------------------------------------------------+

 ### 4.3 view.js
    +-----------------------------------------------------------+
    | init(playBoard)                                           |
    |   demo() -> context = renders.init(playBoard)             |
    |          -> demos.run(context)                            |
    |                                                           |
    | wirePanel("setup-window", "setup", buildSetupPayload);    |
    | wirePanel("tray-window", "setup", buildTrayPayload);      |
    | ...                                                       |
    | wirePanel("advsq-window", "advsq", buildAdvsqPayload);    |
    |                                                           |
    | buildSetupPayload(panel, action)                          |
    | buildTrayPayload(panel, action)                           |
    | ...                                                       |
    | buildAdvsqPayload(panel, action)                          |
    +-----------------------------------------------------------+

 ### 4.4 registerHandlers.js
    +-----------------------------------------------------------------------+
    | export const callback = {                                             |
    |   setup: null,                                                        |
    |   tray null,                                                          |
    |   ...                                                                 |
    |   gambit: null,                                                       |
    | }                                                                     |
    |                                                                       |
    | export function gameControlDispatcher(fn)   { callback.game   = fn; } |
    | export function trayControlDispatcher(fn)   { callback.tray   = fn; } |
    | ...                                                                   |
    | export function gambitControlDispatcher(fn) { callback.gambit = fn; } |
    +-----------------------------------------------------------------------+

## 5. Callback Registration Control Flow:
  - Control: registers callback functions via view registration 
  - control.init() -> *control/register.callbacks()* -> 
  - control/events/*GameDispatchers() -> view/registerHandlers/callback register.
  - view.init() -> view.demo() -> run.callback.whatever(control)
  - 

 ### 5.1 demos.js
    +------------------------------------------+
    | run(context:{scene,camera,renderer,...}) |
    |   Prepares tile stuff for board.         |
    |   -> runDemos(...)                       |
    |      -> demoBoard(...)                   |
    +------------------------------------------+

