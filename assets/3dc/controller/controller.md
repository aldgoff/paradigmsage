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

 ### 1.1 Setup

 ### 1.2 Trays

 ### 1.3 Game

 ### 1.4 Moves

 ### 1.5 Gambits

 ### 1.6 Advsqs

 ### 1.7 Compass

 ### 1.8 Cameras

## 2. Callback Registration Control Flow:
  - Control: registers callback functions via view registration 
  - control.init() -> *control/register.callbacks()* -> 
  - control/events/*GameDispatchers() -> view/registerHandlers/callback register.
  - view.init() -> view.demo() -> run.callback.whatever(control)
  - 

