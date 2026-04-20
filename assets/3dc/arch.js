/* File: arch.js
  Path: ./3dc/arch.js
  Purpose: Brief capture of the code architecture for 3D chess.
  Author: Allan Goff
  Date: 4/03/26
  UI: none, just documentation in code form
*/

/* Tree - 4/16/26.
MacBookPro:paradigmsage adgoff$ tree -L 1 assets/3dc
assets/3dc
├── arch.js
├── controller
├── dev
├── exampleRegistration
├── foundation
├── geometry
├── main.js
├── model
├── Obsolete
├── templates
├── tests
└── view
10 directories, 2 files
*/

/* Control Flow:
  play.md - web page
    - imports the 3D render engine (THREE)
    - defines CSS elements
      - canvas id (3dc-*), (width, height)
      - global styles
      - places each 2D MOD panel on the page.
        - DOM id (#<panel>-window: {top: left:})
    - defines the 3dc canvas (3D renderer)
    - defines each floating 2D DOM panel
      - setup (create board and tray)
      - tray - to be deprecated
      - game (undo, etc.)
      - move (listing)
      - gambit (collection of frozen advsqs)
      - advsq (exploratory)
      - camera (not in undo list)
  main.js - Entry point.
    - playBoard = document.getElementById("3dc-board");
    - control.init(playBoard)
      - Make the panels draggable.
        - eventListener on mouse down for each
      - Register the callback functions.
      - model.init(playBoard).
      - view.init(playBoard).
      - EventListeners for pointermove and pointerup.
    - Regressions tests (tests/core/asserts.js) via imports (viewable in local console).
      - templatees
      - foundations
      - geometry
      - model
*/

