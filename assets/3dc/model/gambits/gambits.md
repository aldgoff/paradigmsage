# Gambit Model Spec
  Describe how gambits are represented in 3D chess.

## 1. Purpose
  Specify format of the undo entry.

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
  - *See the json file*.

 ### 3.0 Advsqs
  - Quadrant → advsqs: [1]
  - Duplex   → advsqs: [2]
  - Linear   → advsqs: [[2],[2]] (or for duke, [[2],[2],[2]])
  - Overlap  → advsqs: mixed groups

 ### 3.1 Freeze Quadrant
  The current advsq is frozen as a single quadrant move into the gambits list.
  The advsq element is copied over directly as the single element in the quad array (advsqs).

 ### 3.2 Freeze Linear
  Requires the stride tile to be either E1 or E2.
  - The advsq list will consist of either 2 or 3 advsq pairs.

 ### 3.3 Freeze Duplex
  Requires the stride tile to be apex (duplex) in a face quadrant.
  - The advsq list will consist of 2 advsqs.

 ### 3.4 Freeze Overlap
  - Requirement depends on which type of quad is being explored by the advsq panel:
    - Rook: stride must be an apex tile.
    - Bishop: stride must be E1 or E2.
    - Duke: stride must be an apex tile (not a duplex tile).

  - The advsq list depends on the overlap type:
    - Brook: one rook advsq, two pairs of bishop advsqs (linear), all quads same size.
    - Qtile: one rook advsq, two pairs of bishop advsqs (linear), one duke advsq (half the number of perimeters)
    - Hotspot: two pairs of rook advsqs (linear), one pair of duke advsqs.
    - Feynman: 2 advsqs, one bishop, one duke, of different sizes.

 ### 3.5 Freeze Knight
  - Shows small group of target tiles, all of which include the dst tile as the first element.
    - Corner (3)
    - Edge (2)
    - Faces [(8),(8)]
    - Duke color

 ### 3.6 Freeze Pawn
  - Limited range and direction apply.
  - Three types of moves.
    - Advance (single & double, Q1 only).
    - Bishop capture (predator, sling, reduced, bead).
    - Duke capture (dash, dart).

 ### 3.7 Freeze King
  - Linear moves only.
  - TODO: later...

 ### 3.8 Freeze Plane
  - This is for pedagogical purposes.
  - Fills in every quad in the plane the advsq is in.
  - An array of 4 or 6 advsq with common src and same perimeter.
  - Stride does not apply.

## 4. Representational Challenges
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

