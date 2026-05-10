# Gambit Model Spec
  How to spport gambits in 3D chess.

## 1. Purpose
  Nail down how gambits are to work, this is more complicated than it looks.

## 2. Gambits (UR array 3)
  - The advsqs of gambit analysis are stored, to be replayed at will via the undo/redo system.
  - Each player is free to explore how a small set of advsqs interact.
    - There is no apriori limit to the number of such captured advsqs.
    - As a practical matter, they will probably be limited to 5 - 9.
    - It is intended that at least one of these be a legal next move.
    - A player traverses the undo/redo list, then saves the current as the next move in the game.
  - Making a move **zeros** the **gambit** history, and *increments* the *move* history by one.
  - A *branch* zeroes all later *advsqs* in the analysis.

## 3. Capturing AdvSqs
 ### 3.1 Freeze Quadrant
  The current advsq is frozen as a single quadrant move into the gambits list.
  - "Gambits":[{
    "Q":1,"src":"KB4,4","dst":"KB6,6","area":9,"opacity":0.5,"AdvSqs":[
      {"quad":1,"perimeter":2,"stride":3}
    ]
    }],


 ### 3.2 Freeze Linear
  Requires the stride tile to be either E1 or E2.

 ### 3.3 Freeze Duplex
  Requires the stride tile to be apex (duplex) in a face quadrant.

 ### 3.4 Freeze Overlap
  Requires...



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

