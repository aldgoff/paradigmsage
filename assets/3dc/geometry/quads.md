# Quads Spec
  Establish 

## 1. Purpose
  The definitions of planes, rays, and quads all derive from the unit cell in 3D - the cube.
  The planes module defines each plane as a cyclic set of adjacent rays.
  Adjacency is defined as consecutive elements in the canonical ray cycle of a plane (with wrap).
  This implicitly defines a set of cyclic quadrants (quads).

## 2. Representation
  Quads are numbered according to context, of which there are three:
  1. Global 1-60.
  2. Base Piece 1-12 or 1-24.
  3. Plane 1-4 or 1-6.

  In addition, the duke quads come in two flavors, edge and face.

  There are two natural representations:
  1. Strings: "Q1"-"Q60"
    - Duke quads: "Q37e", "Q38f", "Q39e", "Q40f", etc.
  2. Key-value pairs:
    - "global": 1 - 60
    - "piece":  1 - 24
    - "plane":  1 -  6
    - "quadType": "edge" | "face"

  A quad is a single canonical entity identified by its global index (Q1–Q60). 
  All other representations (plane index, base-piece index, ray pair, string forms) 
  are equivalent projections and must resolve to this identity.

## 3. Rays
  Each quad is specified by a pair of rays - not all pairs specify quads.
  The pair must be in the same plane, adjacent, and in order.
  The canonical encapsulation of this is the *planes* table in planes.json.

  For each plane:
  * Quads are defined as ordered adjacent ray pairs in the listed cycle.
  * Quad1 corresponds to the first two rays.
  * Subsequent quads follow the cycle order, with the final quad wrapping to the first ray.

## 4 Quad Numbering
  **Global** quad numbering (Q1–Q60) is defined by:
  1. The canonical plane order (table order)
  2. The canonical ray-pair order within each plane
  
  **Base piece** quad number (1-12, 1-24, 1-24) is defined by:
  1. The canonical plane order, starting with the first plane of each base piece (table order)
  2. The canonical ray-pair order within each plane

  **Plane** quad number (1-4, 1-6, 1-4) is defined by:
  1. The canonical ray-pair order within each plane
    - Rook   (1-4) = (Q<n>-1)%4 + 1
    - Bishop (1-6) = (Q<n>-1)%6 + 1
    - Duke   (1-4) = (Q<n>-1)%4 + 1

  Within each plane, canonical quad order is the canonical ray-pair order (starting at anchor).

  No additional definitions of quad numbering are permitted.
  These conventions are mandatory and form part of the canonical identity of each element. Any variation in capitalization is considered a distinct and invalid entity.

 ### 4.1 Quad-Ray Correspondance
    Q1 corresponds to the first ray adjacency cycle (ray[0], ray[1])
    Q4 corresponds to (ray[3], ray[0]) for rook and duke.
    Q6 corresponds to (ray[5], ray[0]) for bishop.

## 5. Duke Quads
  Duke quads, unlike rook and bishop quads, come in two varieties: **edge**, **face**.
  The duke quad types alternate as the quads are traversed around a plane.

  In all slant planes, quad types alternate edge and face. 
  The starting quad (Q1), determined by canonicalization rules, fixes the phase of this alternation. 
  In the Minor plane, this choice results in Q1 being a face quad, 
  resulting in Q1 being a face quad, and thus a phase shift in the alternation.
  All other slant planes alternate [edge, face, edge, face],
  but the minor plane alternates [face, edge, face, edge].

 ### 5.1 Visualization
  It is easiest to visualize the difference for slant planes that go through the center of the board:
  - **Edge**: quads advance toward an edge of the board.
  - **Face**: quads advance toward a face of the board.

 ### 5.2 Formula for Quad Type
  Given adjacent vertex rays with components (dz1,dx1,dy1) and (dz2,dx2,dy2):
  - Let Δ = (dz2-dz1, dx2-dx1, dy2-dy1).
  - Count zeros in Δ:
    - 2 zeros → edge-quad
    - 1 zero  → face-quad
  
  If Δ has two zero components, the rays differ in only one axis; 
  the resulting quad advances along a single axis toward a board edge (edge quad).

  If Δ has one zero component, the rays differ in two axes; 
  the resulting quad advances across a plane toward a board face (face quad).

  No other case occurs.

## 6. Constraints:
  Adjacency arises from the geometric relation of quads and rays within a plane, 
  but is canonically defined by the ordered ray cycle.

  No other grouping or adjacency pattern is valid.

  Planes are distinct by text only.
  No symmetry or rotation of the cube (unit cell) may identify two plane-cycles.
  Only the listed cycles define plane identity.

  These cycles are the canonical order; none other exists.

  For all 13 planes, the first quad is always the quadrant formed by the first two rays listed,
  the wrapQuad is the last one listed.

## 7. Canonical Quad Mapping
  A quad is a single canonical entity identified by its global index **Q1–Q60**.

  All valid representations of a quad must resolve to this identity.

 ### 7.1 Domains and Limits
  * Global index: **Q ∈ {1 … 60}**
  * Plane-local index:
    * Rook (orthogonal): **q ∈ {1 … 4}**
    * Bishop (skew):      **q ∈ {1 … 6}**
    * Duke (slant):       **q ∈ {1 … 4}**
  * Piece-local index:
    * Rook:   **q ∈ {1 … 12}**
    * Bishop: **q ∈ {1 … 24}**
    * Duke:   **q ∈ {1 … 24}**

  These limits are derived from plane structure and are invariant.

 ### 7.2 Forward Mapping (Normalization)
  A quad may be specified by any of the following:

  * Global index: `<n>` or `"Q<n>"`
  * Plane-local index: `("<plane>", q)` within the limits above
  * Piece-local index: `("<piece>", q)` within the limits above
  * Ray pair: `(ray1, ray2)` (order-insensitive)
  * Canonical string forms (including duke suffixes)
  * Nickname (if defined)

  These inputs are normalized to a canonical quad index:

  > **Q ∈ {1 … 60}**

 ### 7.3 Reverse Mapping (Projection)
  Given a canonical quad **Q**, the following properties are uniquely determined:

  * String representation (`"Q<n>"`, `"Q<n><e|f>"`)
  * Base piece and piece-local index (within limits)
  * Plane and plane-local index (within limits)
  * Ray pair `[r1, r2]` (canonical order)
  * Quad type (`edge` or `face`, if applicable)
  * Nickname (if defined)

 ### 7.4 Invariant
  > All representations of a quad are equivalent and must resolve to a unique canonical index.

## 8. Invariants
  - 3 orthogonal planes x 4 quads = 12 quads
  - 4 skew planes x 6 quads = 24 quads
  - 6 slant planes x 4 quads  = 24 quads
  - 60 quads

## 9. Generated Json
  These should be generated and placed into the quad.json file; annotated as generated.

 ### 9.1 Plane-Quad Table
  As the cyclic quad sequence is traveresed, each slant plane alternates edge and face quadrants.
  - In all slant planes except the Minor plane, quad1 is an edge quad and quad2 is a face quad.
  - In the Minor plane, quad1 is a face quad and quad2 is an edge quad.

  Thus, a complete map of the quads looks like this:
  | Plane      | Global | Piece | Plane | Representation          | FirstQuad . . . .WrapQuad |
  | :--------- | -----: |------ | :---- | :---------------------- | :------------------------ |
  | Horizontal |   1- 4 |  1- 4 |   1-4 | Q1,Q2,Q3,Q4             |
  | Left       |   5- 8 |  5- 8 |   1-4 | Q5,Q6,Q7,Q8             |
  | Right      |   9-12 |  9-12 |   1-4 | Q9,Q10,Q11,Q12          |
  | Upward     |  13-18 |  1- 6 |   1-6 | Q13,Q14,Q15,Q16,Q17,Q18 |
  | downward   |  19-24 |  7-12 |   1-6 | Q19,Q20,Q21,Q22,Q23,Q24 |
  | leftward   |  25-30 | 13-18 |   1-6 | Q25,Q26,Q27,Q28,Q29,Q30 |
  | rightward  |  31-36 | 19-24 |   1-6 | Q31,Q32,Q33,Q34,Q35,Q36 |
  | Major      |  37-40 |  1- 4 |   1-4 | Q37e,Q38f,Q39e,Q40f     | edge - face - edge - face |
  | Minor      |  41-44 |  5- 8 |   1-4 | Q41f,Q42e,Q43f,Q44e     | face - edge - face - edge |
  | Upleft     |  45-48 |  9-12 |   1-4 | Q45e,Q46f,Q47e,Q48f     | edge - face - edge - face |
  | Downleft   |  49-52 | 13-16 |   1-4 | Q49e,Q50f,Q51e,Q52f     | edge - face - edge - face |
  | Upright    |  53-56 | 17-20 |   1-4 | Q53e,Q54f,Q55e,Q56f     | edge - face - edge - face |
  | Downright  |  57-60 | 21-24 |   1-4 | Q57e,Q58f,Q59e,Q60f     | edge - face - edge - face |

 ### 9.2 Plane-Ray-Quad Table
  Rook Planes (Orthogonal)                                            Quads
    Horizontal:  left_fore > right_fore > left_back  > right_back >	  Q1,Q2,Q3,Q4
    Left:        up        > right_fore > down       > right_back >	  Q5,Q6,Q7,Q8 
    Right:       up        > left_fore  > down       > left_back  >	  Q9,Q10,Q11,Q12
    Each rook ray must occur in two and only two planes

  Bishop Planes (Skew)
    Upward:      LFU   > RFU   > right > RBD   > LBD   > left  >      Q13,Q14,Q15,Q16,Q17,Q18
    Downward:    LFD   > RFD   > right > RBU   > LBU   > left  >      Q19,Q20,Q21,Q22,Q23,Q24
    Leftward:    LBU   > LFU   > fore  > RFD   > RBD   > back  >      Q25,Q26,Q27,Q28,Q29,Q30
    Rightward :  RBU   > RFU   > fore  > LFD   > LBD   > back  >      Q31,Q32,Q33,Q34,Q35,Q36
    Each bishop ray must occur in two and only two planes

  Duke Planes (Slant)
    Major:       fore_down  > fore_up   > back_up    > back_down >    Q37e,Q38f,Q39e,Q40f
    Minor:       left_up    > right_up  > right_down > left_down >    Q41f,Q42e,Q43f,Q44e
    Upleft:      left_up    > fore_up   > right_down > back_down >    Q45e,Q46f,Q47e,Q48f
    Downleft:    left_down  > fore_down > right_up   > back_up   >    Q49e,Q50f,Q51e,Q52f
    Upright:     right_up   > fore_up   > left_down  > back_down >    Q53e,Q54f,Q55e,Q56f
    Downright:   right_down > fore_down > left_up    > back_up   >    Q57e,Q58f,Q59e,Q60f
    Each duke ray must occur in three and only three planes

 ### 9.2 Ray-Quad Array
  [
    ["left_fore", "right_fore"],  // Rook - Horizontal
    ["right_fore", "left_back"],
    ["left_back", "right_back"],
    ["right_back", "left_fore"],

    ["up", "right_fore"],         // Rook - Left
    ...
    ["left_back", "up"],          // Rook - Right
    
    ["LFU", "RFU"],               // Bishop - Upward
    ...
    ["back", "RBU"],              // Bishop - Rightward

    ["fore_down", "fore_up"],     // Duke - Major
    ...
    ["back_up", "right_down"],    // Duke - Downright
  ]

