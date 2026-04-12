# Controller Spec
  Specify the controller.

## 1. Purpose/Concepts/Example/Canonical/Formats/Parsing/Architecture/Functions/Data/...
  This is the C part of the MVC design pattern.

## 1. Canvi TODO: Update to DOM Version.
  There are currently 5 2D canvases defined to control game setup and play.
  The driver in the design is the undo system (see the state module).
  Each 2D canvi floats in front of the game board and can be dragged.

  | play.md: CSS   | play.md: div id | play.md: canvas id | control.init  | layout.js?    |
  | :------------- | :-------------- | :----------------- | :------------ | :------------ |
  | #game-window   | game-window     | 3dc-game           | game-window   | game-canvas   |
  | #camera-window | camera-window   | 3dc-camera         | camera-window | camera-canvas |
  | #tray-window   | tray-window     | 3dc-tray           | tray-window   | tray-canvas   |
  | #move-window   | move-window     | 3dc-move           | move-window   | move-canvas   |
  | #gambit-window | gambit-window   | 3dc-gambit         | gambit-window | gambit-canvas |
  |  |  |  |

 ### 1.1 Game

 ### 1.2 Cameras

 ### 1.3 Trays

 ### 1.4 Moves

 ### 1.5 Gambits

## 2. Callback Registration Control Flow:
  - Control: registers callback functions via view registration 
  - control.init() -> *control/register.callbacks()* -> 
  - control/eventHandlers/*GameDispatchers() -> view/registerHandlers/callback register.
  - view.init() -> view.demo() -> run.callback.whatever(control)
  - 

```
controller.js
+-------------------------------------------------------------------------+
| import * as view from "../view/controlsView.js";                        |
|                                                                         |
| view.registerButtonHandler(button => { handleButtonRelease(button); }); |
|                                                                         |
| function handleButtonRelease(button) {                                  |
|   switch (button) {                                                     |
|     case "Undo": handleUndo(); break;                                   |
|     case "Redo": handleRedo(); break;                                   |
|     ...                                                                 |
|   }                                                                     |
|   view.update();                                                        |
| }                                                                       |
|                                                                         |
| function handleUndo() {}                                                |
| function handleRedo() {}                                                |
|   ...                                                                   |
+-------------------------------------------------------------------------+

controlsView.js
+-------------------------------------------+
| let onControlCommit = null;               |
| export function registerButtonHandler(fn) |
|   onControlCommit = fn;                   |
|                                           |
+-------------------------------------------+

view.js
+----------------------------------+
|                                  |
|                                  |
|                                  |
|                                  |
+----------------------------------+

tbd.js
+----------------------------------+
|                                  |
|                                  |
|                                  |
|                                  |
+----------------------------------+

```


