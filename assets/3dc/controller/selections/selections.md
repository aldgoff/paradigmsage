# Selections Spec (control)
  Manage raycasting clicks for tiles, pieces.
  Manage raycasting clicks for advsqs, gambits, etc.  // TODO: future.

## 1. Purpose
  Manage the clicks (raycasting).

## 2. Data
 ### 2.1 Selection Sets
  pieceSelections - key
  tileSelections  - vts

## 3. UI
 ### 3.1 Accessors
  getSelections()       return { pieceSelections, tileSelections }
  getPieceSelections()  return { pieceSelections }
  getTileSelections()   return { tileSelections }

 ### 3.1 Pieces | Tiles
  isSelected...()
  select...()
  deselect...()
  clearAll...()

 ### 3.2. Raycasting
  handlePieceClick(group)
  handleTileClick(vts)

## 4. Fission permutations
  - A stack can decay both subpieces simultaneously, a **fission**.
  - Either subpiece may move (M), teleport (T), capture a single piece (Z) or a stack (S).
  - That's 4^2 = 16 permutations, to test for, represent (entry and listing line), and executed.
  - Selection order of pieces and tiles is critical:
    - Piece1 and piece2 must be a stack, in either order.
    - Target stack subpieces must be adjacent in the piece click order:
      - 3 & 4
      - 4 & 5
      - 5 & 6
    - Piece1 goes to tile1, piece2 goes to tile2.
    - Piece1 captures piece3, piece2 captures piece4.
    - Piece1 captures piece3 (or stack), piece2 goes to tile1.
    - Piece1 captures stack, piece2 captures stack.
    - Piece1 captures piece3 (if singlet), and piece2 captures piece4 (piece4 & piece5 if a stack).
    - Piece1 cpatures piece3 (piece3 & piece4 if a stack), piece2 captures piece4 (if singlet).
```
  The first test is to ensure it is a stack.
    if(piece1.pos != piece2.pos)

  | (p1)/*p2* |    Move     |  Teleport   |    Piece    |    Stack     |
  | --------- + ----------- + ----------- + ----------- + ------------ |
  | Move      | p1p2-t1t2   | p1p2-t1t2   | p1p2p3-t1   | p1p2p3-t1    |
  |           |  (blank)    |  (blank)    |  (blank)    |  (blank)     |
  |           |  *blank*    |  *subpiece* |  (capture)  |  (stack)     |
  | Teleport  | p1p2-t1t2   | p1p2-t1t2   | p1p2p3-t1   | p1p2p3p4-t1  |
  |           |  (subpiece) |  (subpiece) |  (subpiece) |  (subpiece)  |
  |           |  *blank*    |  *subpiece* |  *capture*  |  *stack*     |
  | Piece     | p1p2p3-t1   | p1p2p3-t1   | p1p2p3p4    | p1p2p3p4p5   |
  |           |  (capture)  |  (capture)  |  (capture)  |  (capture)   |
  |           |  *blank*    |  *subpiece* |  *capture*  |  *stack*     |
  | Stack     | p1p2p3p4-t1 | p1p2p3p4-t1 | p1p2p3p4p5  | p1p2p3p4p5p6 |
  |           |  (stack)    |  (stack)    |  (stack)    |  (stack)     |
  |           |  *blank*    |  *subpiece* |  *capture*  |  *stack*     |
```
Maybe this can all be simplified.
- Let P1 and P2 be the two stack subpieces.
- Let T1 and T2 be the two tiles.
- Let s represent a stack subpiece.
- --------------------------------
- P1,T1       => move.
- P1,T1s      => teleport.
- P1,P3       => capture single piece.
- P1,S(3/4)   => capture stack.
- --------------------------------
- P2,T(2/1)   => move.
- P2,T(2/1)s   => teleport.
- P2,P(4/5)   => capture single piece.
- P2,S(45/56) => capture stack.

