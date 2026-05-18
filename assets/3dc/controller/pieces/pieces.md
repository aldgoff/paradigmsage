# Pieces Spec (control)
  Control interface to the pieces, panel, keyboard, raycasting.

## 1. Purpose
  Define how to select, place and move pieces.

## 2. Description
  UI should allow a piece to be:
  - Started in the trays
  - Moved from tray to board
  - Moved from tile to tile on the board
  - Moved from board to tray
  - Split/recombined (stack only)

## 3. Flow
  - Makeboard button
  - Show Trays button (default may have trays visible)
  - Either:
    - New Game button to move pieces from trays to board.
    - Make a puzzle:
      - Drag pieces from trays to/from board to setup puzzle.
      - Lock button (populates pieceList arrays, output by save).

