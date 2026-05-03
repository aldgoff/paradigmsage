# Moves Spec (Controller)
  Interface for moves.

## 1. Purpose
  This panel allows moves to be made and listed for review.

## 2. Concepts
  MVC - Model View Controller (a design pattern).

## 3. Architecture
 ### 3.1 HTML (play.md)
  ```
  CSS:
    #move-window { top: Npx; left: Mpx; }
  <div> class="panel" id="move-window" 
    ... title, buttons, scroll-box, radio buttons, check boxes, input, output, etc.
  </div>
  ```

 ### 3.2 Registration (controller.js)
  ```
  init() 
    makeDraggable(document.getElementById("move-window"));
    callbacks();
  callbacks()
    register.moveControlDispatcher(moves.panelDispatch);

  model.init(playBoard);
  view.init(playBoard);
  ```

 ### 3.3 Wiring (view.js)
  ```
  init()
    wirePanel("move-window", "move", buildMovePayload, { onChangeFull: true });

  function buildMovePayload(panel, action) {
    console.log("     ---------- view: view.js");
    return { action, ... };
    }
  ```

 ### 3.4 Callback (view/registerHandlers.js)
  ```
  export const callback = {
    move: null, 
    ...
  }
  export function moveControlDispatcher(fn) { callback.move = fn; }
  ```

 ### 3.5 Dispatch (control/moves/moves.js)
  ```
  export function panelDispatch(payload)

  function handleButton1(payload)
  function handleButton2(payload)
  ...
  ```
  
 ### 3.6 State (model/moves/moves.js)
  ```
  json
  imports
  UI
  Helpers
  ```
  
 ### 3.7 View (view/moves/moves.js)
  ```
  json
  imports
  UI
  Helpers
  ```

 ### 3.8 Undo (controller/game/game.js)
  ```
  undo
  redo
  rewind
  fastForward
  ```
  
