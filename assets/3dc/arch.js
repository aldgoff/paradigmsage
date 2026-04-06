/* File: arch.js
  Path: ./3dc/arch.js
  Purpose: Brief capture of the code architecture for 3D chess.
  Author: Allan Goff
  Date: 4/03/26
  UI: none, just documentation in code form
  */

/* Tree.
  MacBookPro:paradigmsage adgoff$ tree assets/3dc/view
  assets/3dc/view
  ├── _tbd.md
  ├── board
  ├── brainstorming.md
  ├── decorators
  ├── pieces
  ├── render
  │   ├── camera.js
  │   ├── coordsMap.js
  │   ├── initThree.js
  │   ├── loop.js
  │   ├── render.json
  │   ├── render.md
  │   ├── renderer.js
  │   └── scene.js
  ├── tiles
  │   └── tiles.json
  ├── trays
  ├── view.js
  └── view.md

  6 directories, 13 files
 */

/* Control Flow:
  play.md - web page
    - imports the 3D render engine (Three), 
    - places each 2D canvas on the page (top, left).
    - defines each canvas
      - DOM id (*-window)
      - canvas id (3dc-*), (width, height)
  main.js - Entry point.
    - control.init() 
      - model.init().
      - view.init().
    - Regressions tests (tests/core/asserts.js) via imports (viewable in local console).

 */

