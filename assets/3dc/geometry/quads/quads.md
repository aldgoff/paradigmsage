# Quads Spec
  Define quads: pairs of adjacent rays which follow the same cyclic order. 

## 1. Purpose
  The definitions of planes, rays, and quads all derive from the unit cell in 3D - the cube.

  Each plane is defined as a cyclic set of adjacent rays.
  Adjacency is defined as consecutive elements in the canonical ray cycle (with wrap).

  The quads module defines each quad from the plane’s ray cycle.
  Each ordered adjacent pair of rays defines precisely one quad.

  A plane may also be viewed as a cyclic set of adjacent quads, derived from its ray cycle.
  The discovery paradigm defines the quad in a plane as the fundamental directional unit in 3D,
  identical under projection to direction in a line in 2D.

## 2. Representation
  A quad has a single canonical identity (global index 1–60).
  There are alternative key-value representations - all projections of a quad.
  - globalQ, pieceQ, planeQ, rayPair:[r1,r2], nickname.

  Additional indices (piece-local, plane-local) are derived projections.
  1. Global 1-60.
  2. Piece 1-12 (rook) or 1-24.
  3. Plane 1-4 or 1-6 (bishop).
  4. Ray pairs must be adjacent, drawn from the cyclic lists, and ordered.
  5. Nicknames must be unique, but full coverage is not required.

  In addition, the duke quads come in two flavors, edge and face.
    - "quadType": "edge" | "face"

  There are also string representations:
  1. Strings: "Q1"-"Q60"
  2. Duke quads: "Q37e", "Q38f", "Q39e", "Q40f", etc.

## 3. Ray Pairs
  Each quad is specified by an ordered adjacent pair of rays in the same plane.
  The canonical definition of this is the *planes* table in planes.json.

  For each plane:
  * Quads are defined as ordered adjacent ray pairs in the listed cycle.
  * Quad1 corresponds to the first two rays.
  * Subsequent quads follow the cycle order, with the final quad wrapping to the first ray.

## 4. Quad Numbering
  Quad numbering is derived from a single canonical ordering defined by:
    1. The canonical plane order (table order)
    2. The canonical ray-pair order within each plane

  All numbering schemes are projections of this ordering.

  Global numbering (1–60) follows the canonical ordering directly.

  Base piece numbering (1–12, 1–24, 1–24) projects this ordering onto each base piece, starting at its first plane.

  Plane numbering (1–4, 1–6, 1–4) projects this ordering within each plane, based on position in the ray cycle.

  Within each plane, quad order follows the canonical ray-pair sequence, starting at the first ray in the cycle and wrapping.

  These conventions are mandatory and define the canonical identity of each quad.

## 5. Duke Quads
  Duke quads, unlike rook and bishop quads, come in two varieties: edge and face.

  Quad type is determined by the difference between adjacent rays.
  Let Δ = (dz2−dz1, dx2−dx1, dy2−dy1).
  - 2 zero components → edge quad  
  - 1 zero component → face quad  

  No other case occurs.

  This classification induces an alternating pattern as quads are traversed around a plane.
  The canonical ordering determines the phase of this alternation.
  In the Minor plane, this results in Q1 being a face quad.
  All other slant planes alternate [edge, face, edge, face].

 ### 5.1 Visualization (Informal)
  It is often helpful to interpret:
  - Edge quads as advancing toward a board edge.
  - Face quads as advancing toward a board face.

## 6. Constraints:
  Adjacency arises from the geometric relation of quads and rays within a plane, 
  but is canonically represented by the ordered ray cycle.

  All valid quad groupings are derived from this cycle.

  For all 13 planes:
    - The first quad is formed by the first two rays in the cycle.
    - Subsequent quads follow the cycle order.
    - The final quad wraps to the first ray.

## 7. Canonical Quad Mapping
  A quad is a single canonical entity identified by its global index (Q ∈ {1 … 60}).
  All other representations are equivalent projections and must resolve to this identity.

 ### 7.1 Domains and Limits
  * Global index: Q ∈ {1 … 60}
  * Plane-local index:
    * Rook (orthogonal): q ∈ {1 … 4}
    * Bishop (skew):     q ∈ {1 … 6}
    * Duke (slant):      q ∈ {1 … 4}
  * Piece-local index:
    * Rook:   q ∈ {1 … 12}
    * Bishop: q ∈ {1 … 24}
    * Duke:   q ∈ {1 … 24}

  These limits are derived from plane structure and are invariant.

 ### 7.2 Forward Mapping (Normalization)
  A quad may be specified by any of the following:

  * Global index: n or "Q<n>"
  * Piece-local index: ("<piece>", q)
  * Plane-local index: ("<plane>", q)
  * Ray pair: (ray1, ray2), ordered and adjacent within a plane
  * String representations encoding the canonical index (including optional duke suffixes)
  * Nickname (if defined; must be unique)

  These inputs are normalized to a canonical index:

  > Q ∈ {1 … 60}

  Normalization must produce exactly one canonical index.

 ### 7.3 Reverse Mapping (Projection)
  Given a canonical quad Q, the following properties are uniquely determined:

  * String representation ("Q<n>", "Q<n><e|f>")
  * Base piece and piece-local index
  * Plane and plane-local index
  * Ray pair [r1, r2] (canonical order)
  * Quad type (edge or face, if applicable)
  * Nickname (if defined)

## 8. Invariants
  These counts arise from the structure of the plane sets and their ray cycles,
  and must be satisfied by all valid quad configurations.

  - Orthogonal (rook):  3 planes × 4 quads = 12
  - Skew (bishop):      4 planes × 6 quads = 24
  - Slant (duke):       6 planes × 4 quads = 24
  - Total: 60 quads

  These counts fully partition the quad space.

## 9. Plane-Ray-Quad Table
  These tables define the relationship between planes, rays, and quads.

 ### 9.1 Basis for the Plane-Ray-Quad Table
  The table below shows the cyclic list of rays by plane.
  The ray cycles define the quads.
  The listed quad labels provide an independent representation used for validation.

  This defines the cyclic list of quads, but are listed explicitly as well.

  Multiple independent representations of quads are intentionally maintained.
  Consistency across these representations serves as validation of correctness.
  No single representation is sufficient in isolation.

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

 ### 9.2 Quandrant Nickname Table
  | Quad | Nickname   |
  | :--- | :--------- |
  |   1  | Forward    |
  |   2  | Right      |
  |   3  | Backward   |
  |   4  | Left       |
  |  13  | UpPredator |
  |  16  | DN         |
  |  19  | DnPredator |
  |  22  | UP         |
  |  25  | LeftTop    |
  |  26  | LUpSling   |
  |  27  | LDnSling   |
  |  31  | RightTop   |
  |  32  | RUpSling   |
  |  33  | RDnSling   |
  |  37  | Fore       |
  |  38  | Up         |
  |  39  | Aft        |
  |  40  | Down       |
  |  41  | Bridge     |
  |  42  | Starboard  |
  |  43  | Keel       |
  |  44  | Port       |

  This table can be expanded based on player pedagogy.

