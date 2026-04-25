# Gambits Spec
  How to convert advsqs exploration into a gambit analysis.

## 1. Purpose
  Capture selected advsqs into a set on the board.

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
  Straight capture, just the indicated advsq.

 ### 3.2 Freeze Linear
  If the stride tile is an end tile (E1, E2), or a duplex tile,
  then there is the option to capture the advancement rectangles.

 ### 3.3 Freeze Overlap
  If the stride tile is an overlap tile (brook, qtile, hotspot, Feynman),
  then there is the option to capture all the advancement manifolds.

 ### 3.4 Prev/Next
  May not be useful...tbd

 ### 3.5 Delete
  Simple deletes the selected gambit, this not the same as an undo branch.
  - Uses the undo index as the selection mechanim.

 ### 3.6 Deselect
  Many not be useful...tbd.

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
  - Q19: KB4,4 -> QN6,6
  - Q40: KB4,4 -> QN6,6

