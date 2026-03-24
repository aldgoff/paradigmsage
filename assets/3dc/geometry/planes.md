# Planes Spec
  Establish the relationship between rays, quads, and planes.

## 1. Purpose
  Since rays and quads form cyclic structures, linear representations require a starting point and direction. 
  Without this, adjacency, ordering, and identity become non-deterministic.

  These choices are not inherent to the geometry and must therefore be fixed by rule. 
  Rather than treating them as arbitrary conventions, this spec defines a canonicalization scheme in which the first quad and traversal direction are *discovered* from higher-order constraints, not invented ad hoc.

  The purpose of this spec is to define that scheme and use it to establish a deterministic relationship between rays, quads, and planes.

## 2. Planes
 ### 2.1 Plane Groups
  It is convenient, but not fundamental, to group the planes into pairs.
  - Vertical planes (rook)
    - Left
    - Right
  - Forward planes (bishop)
    - Upward
    - Downward
  - Outward planes (bishop)
    - Leftward
    - Rightward
  - Verticalcross planes (duke)
    - Major
    - Minor
  - Leftcross planes (duke)
    - Upleft
    - Downleft
  - Rightcross planes (duke)
    - Upright
    - Downright

 ### 2.2 Naming and Capitalization
  * Plane *types* are lowercase: `orthogonal`, `skew`, `slant`.
  * Plane *groups* are lowercase: `vertical`, `outward`, `leftcross`, etc.
  * Plane *names* are capitalized: `Horizontal`, `Upward`, `Minor`, etc.
  * Ray names follow their canonical identifiers as defined in the rays module.

## 3. Cycle Starting Points and Direction
  Planes are defined by cyclic ray orderings. 
  Rays form boundaries, and quadrants are derived as adjacent ray pairs within those cycles.

 ### 3.1 Constraints
  Canonicalization is determined by a hierarchy of constraints:
  - 1. For pawn *advance* planes:
    - 1.1. Q1 is chosen toward opponent, rotation is clockwise (relative to pov).
    - 1.2. If two quads approach opponent, Q1 is the top most, rotation toward the opponent (second quad).
  - 2. For pawn *bishop-capture* planes:
    - 2.1. For a unique pawn-defined forward direction, Q1 is chosen in that direction, rotation is upward.
    - 2.2. If two quads approach opponent, Q1 is toward the top, Q2 is the adjacent quad, approaches opponent.
  - 3. For pawn *duke-capture* planes:
    - 3.1 Q1 is chosen toward opponent, rotation is clockwise (relative to pov).
    - 3.2 If two quads approach, Q1 is top most, rotation toward the opponent (second quad).
    - 3.3 If no quads approach opponent, Q1 is top most, rotation is clockwise (relative to pov).

 ### 3.2 Plane-Quad-Ray Table
  | #  | Plane      | POV     | Q1 Nickname  | Ray Cycles                                      | Rule |
  | :- | :--------- | :------ | :----------- | :---------------------------------------------- | :--- |
  |  1 | Horizontal | White   | Forward      | left_fore > right_fore > left_back > right_back | 1.1  |
  |  2 | Left       | White   |              | up        > right_fore > down      > right_back | 1.2  |
  |  3 | Right      | White   |              | up        > left_fore  > down      > left_back  | 1.2  |
  |||||||
  |  4 | Upward     | White   | UpPredator   | LFU > RFU > right > RBD > LBD > left            | 2.1  |
  |  5 | Downward   | White   | DownPredator | LFD > RFD > right > RBU > LBU > left            | 2.1  |
  |  6 | Leftward   | White   |              | LBU > LFU > fore  > RFD > RBD > back            | 2.2  |
  |  7 | Rightward  | White   |              | RBU > RFU > fore  > LFD > LBD > back            | 2.2  |
  |||||||
  |  8 | Major      | Neutral | Dart         | fore_down  > fore_up   > back_up    > back_down | 3.1  |
  |  9 | Minor      | White   | Bridge       | left_up    > right_up  > right_down > left_down | 3.3  |
  | 10 | Upleft     | Top     |              | left_up    > fore_up   > right_down > back_down | 3.2  |
  | 11 | Downleft   | Top     |              | left_down  > fore_down > right_up   > back_up   | 3.2  |
  | 12 | Upright    | Top     |              | right_up   > fore_up   > left_down  > back_down | 3.2  |
  | 13 | Downright  | Top     |              | right_down > fore_down > left_up    > back_up   | 3.2  |

