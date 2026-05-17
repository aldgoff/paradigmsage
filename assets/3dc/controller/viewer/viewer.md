# Viewer Spec
  The viewer panel.

## 1. Purpose
  Manage animation, tray location, and level separation.

## 2. Concepts
  - Animation is simple rotational jitter around the vertical axis centered on one of the POVs.
  - Tray locations are two pairs of vertical columns just off the board (vts) with variable gap.
  - Level separation is the distance between levels in units of tile separation; default is 1.5.

## 3. Animation
  Working well as is.

## 4. Trays
  - Trays hold all pieces and pawns prior to starting a game.
  - Trays hold captured pieces aftward.
  - Trays hold permanent ghost images of the pieces as a visual label of the level.
  - Trays are vertical columns in the vts space just off the board's vertical edges (White & Black).
  - Two vertical columns, one for pieces one for pawns; pawns closer to the board.
  - Gap are integral, allowed values 0 to 3.
  - Default gap is 1 for eight and ten board, 0 for tens board.
  - Note the tricky use of off column tiles for stacks which have had a subpiece captured, (bishop, duke).

## 5. Level Separation
  tbd

