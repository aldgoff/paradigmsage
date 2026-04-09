/* File: arch.js
  Path: ./3dc/arch.js
  Purpose: Brief capture of the code architecture for 3D chess.
  Author: Allan Goff
  Date: 4/03/26
  UI: none, just documentation in code form
  */

/* Tree - 4/9/26.
MacBookPro:paradigmsage adgoff$ tree assets/3dc/view
assets/3dc/view
├── _tbd.md
├── board
├── brainstorming.md
├── decorators
│   ├── decorators.js
│   ├── decorators.json
│   └── decorators.md
├── demos.js
├── pieces
├── registerHandlers.js
├── render
│   ├── cameras.js
│   ├── cameras.json
│   ├── cameras.md
│   ├── coordMaps.md
│   ├── coordsMaps.js
│   ├── coordsMaps.json
│   ├── lights.js
│   ├── lights.json
│   ├── lights.md
│   ├── obsolete
│   │   └── initThree.js
│   ├── renders.js
│   ├── renders.json
│   ├── renders.md
│   ├── scenes.js
│   ├── scenes.json
│   └── scenes.md
├── tiles
│   ├── tiles.js
│   ├── tiles.json
│   └── tiles.md
├── trays
├── view.js
└── view.md

7 directories, 28 files
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

