# Gambits Spec
  How to convert advsqs exploration into a gambit analysis.

## 1. Purpose
  Capture selected advsqs into a set on the board.

## 2. AI Instructions
  When the freeze button is clicked, we want to capture the current advsq 
    (likely somewhere in the undo buffer, not typically the last or first one). 
    
  What will be stored are the 
  - source tile (already defined)
  - the destination tile (to be inferred from quad, perimeter, and stride)
  - the quad number itself (mostly for convenience).

  This shall be placed in the scroll box in the panel, per the state.json.

 ### 2.1 SubSection
  text

