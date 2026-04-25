# Controller Spec
  Specify the controller.

## 1. Purpose
  This is the C part of the MVC design pattern.

## 1. DOM Panels.
  2D panels are defined to control game setup, exploration, and play.
  The driver in the design is the undo system (see the state module).
  Each 2D panel floats in front of the game board and can be dragged.

  | play.md: CSS   | play.md: div id | control.init  | layout.js?    |
  | :------------- | :-------------- | :------------ | :------------ |
  | #setup-window  | setup-window    | setup-window  | game-canvas   |
  | #tray-window   | tray-window     | tray-window   | tray-canvas   |
  | #game-window   | game-window     | game-window   | game-canvas   |
  | #move-window   | move-window     | move-window   | game-canvas   |
  | #gambit-window | gambit-window   | gambit-window | gambit-canvas |
  | #advsq-window  | advsq-window    | advsq-window  | move-canvas   |
  |  |  |  |
  | #camera-window | camera-window   | camera-window | camera-canvas |

 ### 1.1 Setup Control
  - Create 1 of three boards
  - Create trays (2 types, 3 gaps)

 ### 1.2 Trays

 ### 1.3 GameControl
  - New
  - Rerun
  - Undo
  - Redo
  - Load
  - Save

 ### 1.4 Moves
  - Listing of moves in 5 columns
    - Move
    - White
    - Black
    - Coordinates
    - Annotations

 ### 1.5 Gambit Control
  - Freeze AdvSq
  - Next
  - Prev
  - Delete
  - Deselect

 ### 1.6 Advsqs Control
  - Place
  - Remove
  - Source Tile
  - Quad
  - Perimeter
  - Stride
  - Retilinear Nudges
    - i, j, k
    - ^i ^j ^k
  - Next Quad
  - Next Plane
  - Next Piece
  - Offboard Visibility

 ### 1.7 Compass Control (tbd)

 ### 1.8 Camera Control
  - Zoom In
  - Zoom Out
  - Ascend
  - Descend
  - POVs:
    - White
    - Neutral (default)
    - Black
    - Negative

## 2. Callback Registration Control Flow:
  - Control: registers callback functions via view registration 
  - control.init() -> *control/register.callbacks()* -> 
  - control/events/*GameDispatchers() -> view/registerHandlers/callback register.
  - view.init() -> view.demo() -> run.callback.whatever(control)
  - 

