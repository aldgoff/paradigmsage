# Perims Spec
  Specify the concept and details of perimeters, the building blocks of advancement squares.

## 1. Purpose
  Define the minimal structure representing a perimeter within an advancement manifold.

## 2. Concepts
  In chess, pieces advance along manifolds.
  - 2D: the manifold is a *line* with 2 directions that grows one *square* at a time.
  - 3D: the manifold is a *plane* with 4 (6) directions that grows one *perimeter* at a time.
  
  Advance:
  - 2D: advance defines a *path*, a straight-line sequence of *individual squares* which must be empty.
  - 3D: advance defines an *advancement square*, a sequence of *nested perimeters* which must be empty.
    - The sequence has no ontological meaning.
    - Once anchored to a source tile on a populated board,
      it is a convenient way to traverse the perimeter to see if it is empty.

## 3. Definition
  - A perimeter is defined by a *quad* (ordered adjacent ray pair, [ray1, ray2]), and a *distance* (k).
  - Without a source tile, a perimeter is an abstract structure, not grounded to the board, no notion of pieces.
  - It exists solely in a single quadrant.

## 4. Context
  An advancement square is constructed from a set of n nested perimeters:
  - Nested perimeters have increasing distances: k=1...n.
  - They must have the same ray pair.
  - Anchored to the source tile of the advancement square.
  - A move from the source tile to the last perimeter is unblocked only if all the perimeters are open.
  - A perimeter is open only if all the tiles on it are empty.

## 5. Notation
  - The sequence of tiles around the perimeter is called the *stride*.
  - It is ordered from ray1 to ray2.
  - The first end tile is E1 (at k*ray1).
  - The second end tile is E2 (at k*ray2).

## 6. Stride
  - The sequence of tiles around the perimeter, in relative coords [z, x, y].
  - E1: first *end tile*, first tile (1).
  - B<n>: *between tiles* on the outbound leg.
  - Apex: middle tile (k + 1), the apex tile (k x ray1, k x ray2).
  - B<n>: between tiles on the inbournd leg.
  - E2: second end tile, last tile (2k + 1).
  - Example stride for k=3: [E1, B2, B3, Apex, B5, B6, E2].

## 7. Generation
  E1 = k*ray1;
  B<n> = E1 + i*ray2;  // i: 1-(k-1).
  Apex = E1 + k*ray2;
  B<n> = Apex -i*ray1; // i: 1-(k-1).
  E2 = k*ray2;

## 8. Example:
  Ray pair (Q1):
    "left_fore":  [ 0,  1,  0],
    "right_fore": [ 0,  0,  1],
  k = 3.
  Stride: [ [0,3,0], [0,3,1], [0,3,2], [0,3,3], [0,2,3], [0,1,3], [0,0,3] ]

## 9. Invariants:
  - The number of tiles in each perimeter is 2k + 1.
  - Traversing all the perimeters (for a given k) in a given plane returns to the same tile.
  - E2 of the perimeter in the 1st quad, is the same tile as E1 in the perimeter of the 2nd quad.

## 10. Tadone List:
  1. Vary quads to sample rook, bishop, and duke planes.
  2. Vary k values including k=1, small k, and near-boundary k.
  3. Validate stride length equals 2k + 1.
  4. Validate apex index equals k (0-based).
  5. Validate E1 is first tile and E2 is last tile.
  7. Validate all tiles lie in the same plane defined by the quad.
  8. Implement orbit test: E2(current quad) == E1(next quad).
  10. Validate bishop color consistency for anchored perimeters.
  11. Validate duke color pattern consistency for anchored perimeters.
  12. Add edge case tests for k=1 (minimal perimeter).
  13. Add invalid input tests (k=0, negative k).
  14. Build helpers for vector operations (add, scale, diff).
  15. Build helper to check plane membership of tiles in stride.
  16. Avoid hardcoding full expected strides beyond base case.
  19. Use invariants as primary validation method.
  20. Defer advanced tests until base invariants pass.

## 11. Tests to Skip List:
  6. Validate symmetry around apex (forward/backward legs match).
  9. Anchor stride to source tile and verify translation correctness.
  17. Use endpoint and apex formulas for expected value checks.
  18. Implement quad sweep tests across all planes.

