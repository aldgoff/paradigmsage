# Pieces Spec (model)
  State representation.

## 1. Purpose
  All the piece stuff associated with state.

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
    - P~K1,1 - in the tray.
  
## 3. Tray Type
 ### 3.1 Real Trays
  Simulate a real physical tray, a piece is on the board, or in the tray.
 
 ### 3.2 Factory Trays
  Trays are an infinite source of pieces - often best for puzzles or pedagogy.

## 4. Occupancy
  The critical *data structure* for algorithmic scaling is the *occupancy array*.
  We have three:
  - Board: (10x10x10) - (works for all board sizes).
    - [z,x,y]
    - player(W|B), type(R|B|D|S|Q|N|P|U|K)
      - U is an unshackled pawn, back planes.
  - Trays: (2x2x10) (White and Black)
    - [z,i,j]
    - player(W|B), type(R|B|D|S|Q|N|P|K)
  - Origin is Q4,4 (all boards)
    - [0,0,0]
  - Index offsets
    - 8 boards are 1 offset
    - 10 boards are 0 offset
    - Trays share the board offset in the z direction only
    - Trays are zero offset in the x,y (i,j) axes.

  This works well for asking if a growing advancement square is blocked.
  Not so much if I want to find a particular piece, or spotting discovered checks.

 ### 4.1 Piece List (key value pairs) for Trays and for the Board
  - pieceList["WQQ"] = { loc: "~|@", pos: "Q0,0"|"Q1,1",   coords: [4,0,0]|[0,-3,-3] };
  - pieceList["WQP"] = { loc: "~|@", pos: "Q1,1"|"Q2,2",   coords: [4,1,1]|[0,-2,-2] };
  - pieceList["WKS"] = { loc: "~|@", pos: "KS0,0"|"KB1,1", coords: [6,0,0]|[2,-3,-3] };
  - pieceList["WKB"] = { loc: "~|@", pos: "KS1,0"|"KB1,1", coords: [6,0,0]|[2,-3,-3] };

  Principles:
  - coords interpretation depends on loc
  - trays offset the z index from the board by the origin (4)
  - board uses vts coords [z,x,y]
  - tray uses tray coords [z,i,j], zero-based, with 0 <= i,j <= 1.
  - If there is no stack (ten-boards), then i=j.

## 5. Coverage Maps
  Speed up analysis, particularly for discovered checks.

