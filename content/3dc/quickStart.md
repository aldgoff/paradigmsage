---
title: "Quick Start"
---

**Quick Start (INWORK)**

  A playable implemetation of 3D Chess with **planar moves** and **advancement squares**.
  The 3D board is a cube of cubes (8x8x8).
  Each tile is the *bottom* of a cube.

  An 8 color board includes the 2 bishop colors (tile faces) and the 4 duke colors (tile edges).
  - Bishop: white | black
  - Duke: gold | silver | ruby | jade

  Active Panels:
  - Setup Panel: Click on the **Make Board** button to create a board.
  - AdvSq Panel: Click on the **Place** button to see an advancement square, then move it around.
    - Rook: red
    - Bishop: green
    - Duke: blue
    - Note the exensive feedback on the features of advancement squares, important jargon.
  - Gambit Panel: Use the **Freeze Quadrant** button capture the existing advsq.
  - Move Panel: Use to pretend move pieces (not yet rendered) - it is a test of the Move buffer in the undo system.
  - Camera Panel: Play with zoom, POV, etc.
  - Game Panel: undo working for all four state buffers, mostly - load and save now work.
  - Viewer Panel: Animation rotates the board back and forth around the Z-axis between settable limits and a range of velocities.
    - Really helps to see the planar nature of the moves.
    - Use in conjuncture with the camer panel's POV radio buttons.

  Inwork Panels: Moves, Gambits, Compasses.

  **Raycasting** demonstrated by toggling circles on clicked tiles.

  (You are witness to how the 'sausage' is made.)
  (No, pieces are not available...yet.)

## Setup Panel
  Click on **Make Board** to put a static 8x8x8 board into the scene.

## AdvSq Panel
  - Click on **Place**.
    - A rook source tile shows up.
  - Click on **Grow** and **Shrink** a few times.
    - Changes size of the advancement square.
  - Play with the buttons (**Next Quad**, **Next Plane**, **Next Piece**).
    - Note the jargon used to describe advancement squares.
  - Also play with the **Stride** input field (move around the perimeter of the advsq).
    - Note how various properties of the stride tile change.
  - Uses vi keys (**ijk**, **IJK**) to move advsq around the board.
    - Note that tiles in advsqs can extend off the board.
    - Use the **Offboard Visibility** slider to affect their opacity.

## Gambit Panel
  - Accumulate advancement squares on the board to build an understanding of how moves and pieces interact.
  - Currently only quadrant moves can be frozen into a gambit.
  - Later this will be expanded to include linear moves and those surprising overlap tiles inherent to the queen.

## Move Panel
  - Primarily it is intended to list the moves of the game.
  - Currently serving double duty as a test vehicle for creating reversible moves for the undo system (Game panel).

## Game Panel
  - Then try the **undo/redo/rerun** buttons.
  - Movement in 2D is natural, evolution has programmed us to perceive lines, and motion along them.
  - Movement in 3D chess is counter-intutitive.
  - A line has only two possible directions, but a quadrant has 4 (6 for the bishop).
  - 2D: there are only two types of lines, and only two of each, for a total of 8 directions.
  - 3D: there are three types of planes, three rook, four bishop, and six duke; thus a total of **60 directions**.

  **Annoying bug - undoing back into board construction is not yet working.**

## Interface (in development)
  This interface is designed to help you visualize how pieces move (and are blocked) in 3D chess.

