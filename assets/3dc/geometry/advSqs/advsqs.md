# Advsqs Spec
  Describe the purposes and specs of advancement squares.

## 1. Purpose
  Define advancement squares (advsqs).
  - Geometry is occupancy-blind.
  - Model is occupancy-aware.

## 2. Concepts
  An advancement square is the foundation for how pieces move and interact.

  - It is composed of nested perimeters (1-k) based on the same ray pair.
    - Perimeter zero is the source tile.
  - Thus it is confined to a single quadrant.
  - It is anchored by a source tile.
  - It may extend off the board into the vts coord space.
  
## 3. The Promotion Paradigm for Advance/Capture
  A source piece may **move** to any tile in an advancement square as long as all earlier perimeters (including the target perimeter) are unblocked.
 ### 3.1. 2D:
  - A moving piece advances along a *line* one *tile* at-a-time. 
  - To *advance* a *distance* n, all n *tiles* must be *empty*. 
  - To *capture* an opposing piece, the previous n-1 *tiles* must be empty. 
 ### 3.2. 3D:
  - A moving piece advances down a *quadrant* one *perimeter* at-a-time. 
  - To *advance* a *distance* n, all n *perimeters* must be *empty*. 
  - To *capture* an opposing piece, the previous n-1 *perimeters* must be empty,
    and there can be only one piece on the capture perimeter.

## 4. The Promotion Paradigm for Gambits
  Let there be two pieces downstream.
 ### 4.1. 2D:
  - If the 1st is on an *earlier* tile, it *blocks* the attack on the second.
  - If the 1st is moved out of the way, it *discovers* an attack on the 2nd.
  - If the 1st is of lesser value, it is *pinned* to the 2nd.
 ### 4.1. 2D:
  - If the 1st is on an *earlier* perimeter, it *blocks* the attack on the 2nd.
  - If the 1st is on the *same* perimeter, it *blocks* the attack on the 2nd.
  - If the 1st is moved out of the way, it *discovers* an attack on the 2nd.
  - If the 1st is on an *earlier* perimeter, it is *pinned* to the 2nd.
  - If *both* are on the *same* perimeter, they block and pin each other.
    - A *mutual block*.
    - A *mutual pin*.
    - An if either moves out of the way, a *reflexive discover*.

## 5. Invariants
 ### 5.1. Monotonic Growth:
  - Advsq(n) ⊂ Advsq(n+1).

 ### 5.2. Closure:
  - Advsq(n) conatains all tiles from perimeter 1 - n.

 ### 5.3. Determinism:
  - Given identical parameters, two advsqs are are identical.

 ### 5.4. Ray consistency:
  - All tiles in advsq(n):
    - Are reachable via combination of the same ray pair.
    - Remain with in the same quadrant.

 ### 5.5. Anchor Inclusion:
  - source ∈ Advsq(n).

 ### 5.6. Discrete Perimeter Indexing:
  - Advsq(n) = ⋃_{k=0..n} Perimeter(k).

## 6 Interactions
 ### 6.1. Next and Previous
  - Method to add the next perimeter.
  - Method to remove the last perimeter.

 ### 6.2. Compute the Overlap of Two AdvSqs
  - Must be in the same plane.

 ### 6.3. Test if Two Advsqs are Identical
  - Must have 100% mutual overlap, with the same quad, ray pair, and source tile.

 ### 6.4. Compute the Inverse
  - Requires a target tile to act as the source tile for the inverted advsq.
  - Inverted advsq contains the original source tile as the target tile.

 ### 6.5. Compute the Intersection of Two AdvSqs
  - Must be in different planes.

## 7. Construction
  Specify source tile, quad (or ray pair), kth perimeter (or destination tile).

  --- 

# ✅ AdvSq Validation & Query TODO List

## 1. ✅ Identity & Structural Integrity
  1. ✅ Does this AdvSq have a valid (source, quad, rayPair, k) tuple?
  2. ✅ Is the rayPair consistent with the quad?
  3. ✅ Is k within valid geometric bounds for the board?
  4. ✅ Does the AdvSq satisfy monotonic growth (k → k+1 containment)?
  5. ✅ Does the AdvSq satisfy closure (all perimeters ≤ k included)?

## 2. Plane & Piece-Type Validation
  6. Is this AdvSq contained within the expected plane?
  7. Does this AdvSq belong to the correct plane family (rook / bishop / duke)?
  8. Does the quad map to the expected plane for the given piece type?
  9. Are all perimeters confined to the same plane?
  10. Does the AdvSq preserve plane invariance under quad cycling?

## 3. Color / Equivalence Class Validation
  11. Are all tiles in the AdvSq the same bishop color (black/white)?
  12. Are all tiles in the AdvSq the same duke color (gold/silver/ruby/jade)?
  13. Does each perimeter preserve color invariance?
  14. Does color remain invariant across all k?
  15. Does the AdvSq remain within a single equivalence class?

## 4. Size & Growth Metrics
  16. How many perimeters does this AdvSq contain?
  17. How many total tiles are in the AdvSq?
  18. How many tiles are in each perimeter (verify 2k+1)?
  19. Does tile count grow correctly with k?
  20. Does cumulative tile count match expected sum over perimeters?

## 5. Board Interaction (Bounds)
  21. How many tiles in each perimeter are on-board?
  22. How many tiles in each perimeter are off-board (VTS space)?
  23. Does the AdvSq extend beyond board boundaries?
  24. At what k does the AdvSq first leave the board?
  25. What fraction of the AdvSq is on-board vs off-board?

## 6. Perimeter Structure Validation
  26. Does each perimeter have correct E1, apex, and E2 positions?
  27. Is each perimeter symmetric (outbound vs inbound legs)?
  28. Does each perimeter maintain stride continuity?
  29. Does E2 of one quad match E1 of the next (orbit continuity)?
  30. Are perimeters correctly ordered from k=0 to k=n?

## 7. Overlap / Interaction Geometry
  31. What tiles overlap between two AdvSqs in the same plane?
  32. What tiles intersect between two AdvSqs in different planes?
  33. What are the overlap tiles for a base piece (rook/bishop/duke)?
  34. What are the overlap tiles for a composite piece (queen/stack)?
  35. What is the multiplicity classification of each overlap tile?

## 8. Containment & Membership
  36. Does this AdvSq contain a given tile?
  37. On which perimeter does a given tile lie?
  38. Is a tile reachable via this AdvSq?
  39. What is the minimum k required to reach a given tile?
  40. Is a tile inside, on the boundary, or outside the AdvSq?

## 9. Directionality & Target Resolution
  41. Given a target tile, which AdvSqs (if any) reach it?
  42. How many valid AdvSqs connect source to target (0–4)?
  43. Which quad(s) produce a valid path to the target?
  44. What is the minimal AdvSq that reaches a target tile?
  45. Does the AdvSq uniquely determine reachability to the target?

## 10. Inversion & Symmetry
  46. What is the inverse AdvSq for a given target tile?
  47. Does inversion preserve structure and k?
  48. Does reversing source/target produce a valid AdvSq?
  49. Are two AdvSqs symmetric under inversion?
  50. Does symmetry hold across all perimeters?

## 11. Debug / Introspection (Practical)
  51. What is the full list of tiles in the AdvSq?
  52. What are the tiles in a specific perimeter k?
  53. What is the stride ordering of a perimeter?
  54. What are the vector directions of the rayPair?
  55. What is a human-readable representation of this AdvSq?

