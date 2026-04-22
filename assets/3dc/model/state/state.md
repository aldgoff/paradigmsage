# State Spec
  How to capture state in 3D chess.

## 1. Philosophy
  A layered approach: a sequence of history arrays to facilitate undo/redo.
  - Setup:   Creating/changing the board, play/puzzle, trays, gap, initial position, autoload.
  - Moves:   Standard listing, but with safe fallback and annotation columns.
  - Gambits: Create and explore multiple advancement manifolds and their interactions.
  - AdvSqs:  Create an advSq and move it around (expand/contract, shift/slip, nextQuad/nextPlane).

  Can undo/redo within each category. When empty or full, transitions to next category.
  A *branch* deletes all downstream states.

  The result is a kind of logarithmic undo chain.

  Each of the 4 undo/redo history arrays start at zero length.
  After board setup, each player may make a move, or start a gambit analysis.
  A gambit analysis begins by exploring potential advsqs (array 4).
  The move and gambit arrays (2 & 3) may be empty at this point.

 ### 1.1 Json
  Contains an example state, useful for development and debugging.
  - Note that the advsq section is outdated, it assumed the src-dst formalism (below).

 ### 1.2 Implementation
  State consists of four arrays in a single state object.
  - State supports undo ops via second set of arrays, the indices into the current state.
  - Branches (changed choices in the middle of undos) tend to delete all downstream elements and arrays.

 ### 1.3 UI
  - set/get state
  - set/get null
  - fetchCurrent
  - replaceCurrent
  - pushNewState
  - fetchLast
  - getNext
  - getPrev
  - trimStateToUndoIndex
  - clearStateHistory

 ### 1.4 Render
  - Renderer uses the fetchLast functions.
  - Control uses the set/get, fetch/replace/push, trim/clear functions.
  - Undo uses the get next/prev functions.

## 2. Setup (UR array 1)
  - The setup phase is stored, to be replayed at will via the undo/redo system.
    - Explore board and tray options and the gap between them.
    - Select play mode for rule enforcement (game, puzzle, or off).
    - Specify a starting lineup or use the standard one for that board.
  - A *branch* zeroes all later *setup choices*.

## 3. Moves (UR array 2)
  - The moves of the game are stored, to be replayed at will via the undo/redo system.
    - The listing of game moves is presented as a table.
    - Move number, White's move, Black's moves - standard notation.
    - However, there is more ambiguity in 3D chess, so two additional columns are added (collapsible).
      - Coordinates: src tile, dst tile(s) - castling and fission require 2 dst tiles, en passant as well.
      - Annotations: typically two digit acronyms in lower case (ch, dc, ep, castling, etc.).
  - A *branch* zeroes all later *moves*.

## 4. Gambits (UR array 4)
  - The advsqs of gambit analysis are stored, to be replayed at will via the undo/redo system.
  - Each player is free to explore how a small set of advsqs interact.
    - There is no apriori limit to the number of such captured advsqs.
    - As a practical matter, they will probably be limited to 5 - 9.
    - It is intended that at least one of these be a legal next move.
    - A player traverses the undo/redo list, then saves the current as the next move in the game.
  - Making a move **zeros** the **gambit** history, and *increments* the *move* history by one.
  - A *branch* zeroes all later *advsqs* in the analysis.

## 5. AdvSqs (UR array 5)
  - The location and extent of a single advsq is stored, to be replayed at will via the undo/redo system.
    - It's parameters can be modified in a variety of ways.
    - An advsq can be added to the gambits list - it gets *frozen* to the board.
    - This does not zero the undo array, but it does truncated it to this instance.
    - If a single history contains multiple desired advsqs, they must be frozen in reverse order.
  - Freezing an advsq **zeroes** the **advsq** history, and *increments* the *gambits* history by one.
  - A *branch* zeroes all later *positions*.

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

  Decision:
  - For now, the panel will use the QK (quad-perimeter) formalism.
  - This may not age well under linear moves, but it has substantial strengths over the src-dst formalism.

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

## 6. Invariants (typically last section)
 ### 6.1 Sourc Tile
  - Can extend off board.
  - Uses board (positional) notation if tile on board.
  - Uses vts notation if off.
  
 ### 6.2 Quad
  1-60 (I'd like to allows 0, for when perimeter = 0), but logic has evaded me.
  
 ### 6.3 Derived Types
  Not stored in the undo buffer.
  - Nickname (json list)
  - Plane (json list)
  - Quad Type (json list) - (blank|edge|face)
  - Perimeter length (0-2*perimeter+1)
  - Advsq area (N^2, N=perimeter+1)
  - Stride tile type (E1|Body|Apex|Duplex|E2)

 ### 6.4 Perimeters
  - 0 - tbd (30 or less)
  
 ### 6.5 Stride
  - 0 - perimeterLength.

 ### 6.6 Offboad Visibility
  - 0.00 - 1.00

## 7. Limits
  Attempts to exceed limits result in range clamp, but without undo update.

