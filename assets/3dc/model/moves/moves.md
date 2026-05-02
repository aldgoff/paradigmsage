# Moves Spec (model)
  Describe the state change model for moves, captures, decays, promotions, fission, etc.

## 1. Purpose/
  Lock down the complexity - this is much harder than in 2D chess.

## 2. Concepts
 ### 2.1 Move Types
  #### 2.1.1 2D
  - Move
  - Capture
  - En passant
  - Castling
  - Promotion
  #### 2.1.2 3D only (the damn stack)
  - Duke decay
  - Bishop decay
  - Duke decay capture
  - Bishop decay capture
  - Fission move/move
  - Fission move/capture
  - Fission capture/move
  - Fission capture/capture
  - Promote bishop to stack
  - Promote duke to stack
 ### 2.2 Move Idiom
  A move in 3D chess requires an array of time symmetric src/dst pairs.
  - A move is easy: [{src, dst}]
  - A capture is not too bad: [{dst,tray}, {src,dst}]
  - En passant: [{sec,tray}, {src,dst}]
  - Castling: [{src,dst}, {src,dst}]
  - Promotion: [{src,dst}, {dst,tray}, {queen,dst}, {ghost,tray}]
  - Decay: [{src,null}, {Sghost,null}, {Bghost,tray}, {Dghost,tray}, {B,src|dst}, {D,dst|src}]
  - etc.
  
## 3. Undo
  The idiom is simple, move a piece from one tile to another.
  Try tiles are essential here.
  Multiple pieces and multiple tiles may need to be specified.

  Captures require the specification of two pieces, including tray tile.
  En passant requires the specification of two pieces and three locations.
  Castling requires the specification of two pieces and two destinations.
  Promotion:
  - Move pawn to tray
  - Place promotion piece on dst tile
  - Replace tray ghost with promotion piece
  Decay:
  - Move decay piece to dst
  - Replace stack with stationary subpiece

   ### 3.1 Creation
   - Move: 
    - move piece from *src to dst*
   - Capture: 
    - move captured piece from *dst to tray*
    - move piece from *src to dst*
   - TODO: enpassant|castling|promotions|decays
   ### 3.2 Undo
   - Move:
    - move piece from *dst to src*
   - Capture:
    - move piece from *dst to src*
    - move captured piece from *tray to dst*
   - TODO: enpassant|castling|promotions|decays
   ### 3.3 Redo
   - Move: 
    - move piece from *src to dst*
   - Capture: 
    - move captured piece from *dst to tray*
    - move piece from *src to dst*
   - TODO: enpassant|castling|promotions|decays
   ### 3.4 Rewind
   - TODO: move/capture/enpassant|castling|promotions|decays
   ### 3.5 FastForward
   - TODO: move/capture/enpassant|castling|promotions|decays
   ### 3.6 Load
   - TODO: move/capture/enpassant|castling|promotions|decays


