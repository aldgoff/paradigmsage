# Pieces Spec (model)
  State representation.

## 1. Purpose
  All the piece stuff associated with state.

## 2. Description
  - Must specify:
   - Board size
   - Intial pos in trays
   - White versus Black
   - relative versus absolute
  - List of major pieces
  - List of pawns
  - Board versus tray.
    - P@<LL><x,y> - on the board.
    - P~<LL><i,j> - in the tray.
  
## 3. Piece Key
 ### 3.1 4-char String (All Caps)
  - player = key[0]; // W|B
  - side   = key[1]; // Q|K
  - level  = key[2]; // R|N|B|D|Q|K
  - type   = key[3]; // R|B|D|S|Q|N|P|U|K
 
 ### 3.2 Piece Structure
 ```
  piece = {
    loc,        // "@"|"~" - board or tray (player (W|B in the key) determines which one).
    curPos,     // "<LL><x,y>", x,y: 1-8, or 0-9.
    curCoords,  // location of piece now: either [r,x,y] = vts + origin ([4,4,4]), or [k,i,j].
    vts,        // [z,x,y].
    home: {     // Fixed at creation time.
      trayPos,    // "<LL><i,j>", i,j: 1-2, (pawns on 2,2).
      trayCoords  // [k,i,j], k: 1-8, or 0-9, i,j: 0-1, bishop on 1,0, duke on 0,1.
    }
    split: {
      bishop: {
        trayPos: "KB2,1",
        trayCoords: [6,1,0]
      },
      duke: {
        trayPos: "KB1,2",
        trayCoords: [6,0,1]
      }
    }
  } 
 ```

 ### 3.2 Piece List
  const pieceList = {}; All the pieces in the game.

## 4. Occupancy
  The critical *data structure* for algorithmic scaling is the *occupancy array*.
  We have three:
  - Board: (10x10x10) - (works for all board sizes).
    - [z,x,y]
    - player(W|B), type(R|B|D|S|Q|N|P|U|K)
      - U is an unshackled pawn, back planes.
  - Trays: (10x2x2) (White and Black)
    - [k,i,j]
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
  - pieceList["WQQQ"] = { loc: "~|@", pos: "Q0,0" |"Q1,1",  coords: [4,0,0]|[0,-3,-3], trayPos: "Q0,0" , trayCoords: [4,0,0] };
  - pieceList["WQQP"] = { loc: "~|@", pos: "Q1,1" |"Q2,2",  coords: [4,1,1]|[0,-2,-2], trayPos: "Q1,1" , trayCoords: [4,1,1] };
  - pieceList["WKKS"] = { loc: "~|@", pos: "KB0,0"|"KB1,1", coords: [6,0,0]|[2,-3,-3], trayPos: "KB0,0", trayCoords: [6,0,0] };
  - pieceList["WKKB"] = { loc: "~|@", pos: "KB1,0"|"KB1,1", coords: [6,1,0]|[2,-2,-3], trayPos: "KB1,0", trayCoords: [6,1,0] };

  Principles:
  - coords interpretation depends on loc
  - trays offset the z index from the board by the origin (4)
  - board uses vts coords [z,x,y]
  - tray uses tray coords [k,i,j], zero-based, with 0 <= i,j <= 1.
  - If there is no stack (ten-boards), then i=j.

## 5. Coverage Maps
  Speed up analysis, particularly for discovered checks.

  
## 6. Tray Type
 ### 6.1 Real Trays
  Simulate a real physical tray, a piece is on the board, or in the tray.
 
 ### 6.2 Factory Trays
  Trays are an infinite source of pieces - often best for puzzles or pedagogy.
