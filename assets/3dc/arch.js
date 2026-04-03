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
  play.md - web page, imports the 3D render SQ (Three), and defines the canvases.
  main.js - Entry point.
    initController() -> initView().
    Runs regressions tests via imports (viewable in the console) locally.
 */

