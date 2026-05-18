# Pieces Spec (model)
  State representation.

## 1. Purpose
  Define the string representation of piece location - P@K2,2 for instance.

## 2. Description
  - Must specify:
   - board size
   - intial pos versus a puzzle
   - White versus Black
   - relative versus absolute
  - A list of major pieces.
  - A list of pawns.
  - Board versus tray.
    - P@K<n,m> - on the board.
    - P~K2,2 - in the tray.
  
## 3. Tray Type

 ### 3.1 Real Trays
  Simulate a real physical tray, a piece is on the board, or in the tray.
 
 ### 3.2 Factory Trays
  Trays are an infinite source of pieces - often best for puzzles or pedagogy.

