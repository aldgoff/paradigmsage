# Gambit Spec
  How to spport gambits in 3D chess.
  This is a more sophisticated use of the state undo/redo system.
  Think version 2.0.

## 1. Philosophy
  A layered approach: nested arrays to facilitate undo/redo.
  - Setup:    Creating/changing the board, play/puzzle, trays, gap, initial position, autoload.
  - Moves:    Standard listing, but with safe fallback and annotation columns.
  - Gambits:  Explore near term possible moves, multiple advancement manifolds and ther interactions.
  - AdvSqs:   Create an advSq and move it around (expand/contract, shift, slip, nextQuad, nextPlane).

  Can undo/redo within each category. When empty or full, transitions to next category.
  A branch deletes all downstream states.

  So, a 4 move gambit, with an undo back to move 2, where a different move 3 is specified,
  deletes moves 3 & 4, and AdvSqs undo/redo arrays.

  The result is a kind of logarithmic undo chain.

  Each of the 5 undo/redo arrays start at zero length.
  After board setup, each player may make a move, or start a gambit analysis.
  A gambit analysis begins by exploring potential advsqs (array 5).
  The move and gambit arrays (2, 3, & 4) may be empty at this point.

## 2. Setup (UR array 1)
  - The setup phase is stored, to be replayed at will via the undo/redo system.
    - Explore board and tray options and the gap between them.
    - Select play mode for rule enforement (game, puzzle, or off).
    - Specify a starting line up or use the standard one for that board.
  - A branch will zero out all later choices, and all later undo/redo arrays.

## 3. Moves (UR array 2)
  - The moves of the game are stored, to be replayed at will via the undo/redo system.
    - The listing of game moves is presented as a table.
    - Move number, White's move, Black's moves - standard notation.
    - However, there is more ambiguity in 3D chess, so two additional columns are added (collapsible).
      - Coordinates: src tile, dst tile(s) - castling and fission require 2 dst tiles, en passant as well.
      - Annotations: typically two digit acronyms in lower case (ch, dc, ep, castling, etc.).
  - A branch will zero out all later moves, and all later undo/redo arrays.

## 4. Gambits (UR array 3)
  - The moves of a single gambit are stored, to be replayed at will via the undo/redo system.
  - Each player is free to construct a gambit prior to move decision.
    - A gambit is just a sequence of legal moves, but without commitment.
    - When ready, the first move of the gambit becomes that player's next move.
    - This does not zero out the gambit array.
    - That happens only when one player or the other deviates from the gambit.
  - A branch will zero out all later moves of the gambit, and all later undo/redo arrays.

## 5. AdvSqs (UR array 4)
  - The location and extent of a single advsq is stored, to be replayed at will via the undo/redo system.
    - It's parameters can be modified in a variety of ways.
    - An advsq can be added to the gambits list - it gets *frozen* to the board.
    - This does not zero the undo array, but it does truncated it to this instance.
    - If a single history contains multiple desired advsqs, they must be frozen in reverse order.
  - A branch will zero out all later positions of that advsq.

 ### 5.1
  There are subtle challenges here.

  An advsq can be defined by a source and destination tile (src, dst).
  - SD can specify more than one advsq (think linear move, or overlap tiles).

  An advsq can also be defined by a quad and a perimeter (Q,k), Q:1-60, k:1-8.
  - QK does not uniquely define a dst tile, any tile on the perimeter works.

  Pros and cons:
  - SD: easy to create via clicks, can relocate either src or dst independently.
  - QK: easy to expand or shrink (contract, reduce). 
  - SD: hard to shift/slip (within plane)/(to new plane) - both tiles have to move.
  - Both are hard to shift/slip (within plane)/(to new plane).
  - SD: hard for nextQuad()/nextPlane() (multiple quads may be implied; linear, overlap).

 ### 5.2 Shifts and Slips
  I thought that shift and slip were different things.
  - Shift: within plane.
  - Slip: to new plane.

  However, they're implemented the same way, along a ray or ray pair.
  If the ray(s) lie in the current plane, its a *shift*, otherwise it is a *slip*.
  Slip directions derive from the unit cell of 3D, the cube.
  There are end moves (single ray) and apex moves (ray pair).
  Some ray pairs, however, are just single rays in a different plane.
  The unique ray pairs all happen to be bishop apex moves:
  - Rook apex moves are all bishop linear moves.
  - Duke apex moves (edge) are all bishop linear moves.
  - Duke duplex moves (face) are all rook linear moves.

  There are 24 bishop apex moves.
  Therefore, there are 26 + 24 = 50 slip directions, most change planes.
  Thus shift is a subset of slip.

