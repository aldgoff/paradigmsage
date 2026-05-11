# Gambits Spec
  Describe how advsqs are turned into gambits.

## 1. Purpose
  Create undo entry for gambits.

## 2. Data
  The quad/perimeter/stride notation of the AdvSq panel is converted to src/dst format.

 ### 2.1 Data Stored in Undo Buffer (Gambits)
  {"Q": 1, "src": "Q3,3", "dst": "Q1,1"|[9,9,9]}

 ### 2.2 Data Presented in the Gambit Panel's Scrollbox
  - Quad number itself (Q<nn>).
  - Source tile (already defined), in positional notation (KR2,2).
  - Destination tile (to be inferred from quad, perimeter, and stride).
    - Positional notation if on board, vts ([9,9,9]) if off board.

  Each entry shall be placed in the scroll box in the panel, per the state.json.
  Columnized fields preferred
  - N (Same as the game undo buffer index)
  - Quad (Q<nn>)
  - Src (positional)
  - Dst (positional or vts)

  The player can cross reference the undo buffer index in the Game panel.

## 3. Gambit Panel Buttons
  Any freeze button captures the current advsq:
  - typically somewhere in the undo buffer
  - occasionally the first or last one

  They differ in their extrapolations.

 ### 3.1 Freeze Quadrant
  - Straight capture, stride cannot be zero.
  - Prepare one quadrant.

 ### 3.2 Freeze Linear
  - If stride is not E1 or E2, return.
  - Use geometry layer to determine the rest of the quadrants.
  - Pepare 2 (or 3) pairs of quads as advancement rectangles.

 ### 3.3 Freeze Duplex
  - If piece is not duke, or stride is not duplex, return.
  - Use geometry layer to determine the cross plane.
  - Prepare one pair of quads.

 ### 3.4 Freeze Overlap
  - If stride is not an overlap tile (brook, qtile, hotspot, Feynman), return.
  - Use geometry layer to determine the plane and quad sets.

 ### 3.5 Knight
  - Determine set of knight tiles. (Is it better to have a knight panel?)
    - 3 corners
    - 2 edges
    - two groups of 8 face tiles
    - duke color
  - First tile in each list is the dst tile.
  - I'm now conviced we need a knight panel.

 ### 3.6 Pawn
  - Perimeter must be 1 or 2 (if shackled).
  - Quadrant must head toward promotion.

 ### 3.7 King
  - Move must be linear, with perimeter 1.

 ### 3.8 Plane
  - Requires src tile.
  - Requires one quad in the plane.
  - Or a knight dst tile.
  - Stride is ignored.

 ### 3.9 Expand
  - All gambits can be *scaled*, increase perimeter - move type dependent.

 ### 3.10 Contract
  - All gambits can be *scaled*, decrease perimeter - move type dependent.

 ### 3.11 Delete
  - Deletes selected gambit; not the same as an undo branch.
  - Uses the undo index as the selection mechanim.

 ### 3.12 Remove All
  Delete em all.

## 4. Gambit Panel Derived Fields
  Based on the cpatured advsq, several features can be abstracted.

 ### 4.1 Open [,,,,,]
  An array of quad numbers, upto six.
  A list of all the quadrants in which the piece might move.
  [[Q1,Q2], [Q5,Q6]] - left_fore ray.

 ### 4.2 Blocked
  An array of quad numbers, upto six.
  A list of all the quadrants in which the piece is blocked.
  [Q1,Q2,Q4,Q7]

 ### 4.3 Move Type
  Quadrant|Linear|Duplex

 ### 4.4 Overlap
  Brook|Qtile|Hotspot|Feynman

 ### 4.5. Piece
  Lowest piece which can move through all the quadrants.

## 5. Control Flow
  What happens to other things when an advsq is frozen.

 ### 5.1 Undo List 
  The undo buffer list in the scroll box of the Game panel is updated.

 ### 5.2 Derived Fields
  The derived fields are updated.

 ### 5.3 Clear Advsqs
  All the advsqs are cleared.
  - They should disappear.
  - The undo buffer should go to 0/0.
  - The AdvSq panel fields should go to their null values.

 ### 5.4 Render
  Render the gambit manifolds.
  - An animation would be nice here.

 ### 5.5 Button Status
  Buttons should be enabled/disabled as appropriate.

 ### 5.6 Undo Behavior
  The gambit panel should respond to the usual undo symmantics.

## 6. Validation - A Feynman Tile
  Bishop quad: KB4,4 - Q19 - k2 - stride=3.
  Duke   quad: KB4,4 - Q40 - k3 - stride=6.

  Stride tiles between bishop and duke visually conflict.

  Gambit:
  - Q19: KB4,4 -> QN6,6 : area
  - Q40: KB4,4 -> QN6,6 : area

