/* File: arch.js
  Path: ./3dc/arch.js
  Purpose: Brief capture of the code architecture for 3D chess.
  Author: Allan Goff
  Date: 4/03/26
  UI: none, just documentation in code form
*/

/* Tree - 4/91326.
  MacBookPro:paradigmsage adgoff$ tree -L 1 assets/3dc
  assets/3dc
  ├── arch.js
  ├── controller
  ├── dev
  ├── exampleRegistration
  ├── foundation
  ├── geometry
  ├── layout.js
  ├── layout.md
  ├── main.js
  ├── model
  ├── templates
  ├── tests
  └── view
  9 directories, 4 files
*/

/* Control Flow:
  play.md - web page
    - imports the 3D render engine (Three), 
    - places each 2D MOD panel on the page (top, left).
    - defines each panel
      - DOM id (*-window)
      - canvas id (3dc-*), (width, height)
  main.js - Entry point.
    - control.init() 
      - model.init().
      - view.init().
    - Regressions tests (tests/core/asserts.js) via imports (viewable in local console).
*/

