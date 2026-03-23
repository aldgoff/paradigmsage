# Planes Spec
  Establish the relationship between rays, quads, and planes.

## 1. Purpose
  Because rays and quads form cyclic structures, any linear representation requires a canonical starting point and direction. Without this, adjacency, ordering, and identity become non-deterministic.

  These choices are not inherent to the geometry and must therefore be fixed by rule. Rather than treating them as arbitrary conventions, this spec defines a canonicalization scheme in which the first quad and traversal direction are *discovered* from higher-order constraints, not invented ad hoc.

  The purpose of this spec is to define that scheme and use it to establish a deterministic relationship between rays, quads, and planes.

## 2. Base Piece Plane Correlation
  - Rooks move in orthogonal planes.
  - Bishops moves in skew planes.
  - Duke moves in slant planes.

  - Plane definitions arise from the quadrant definitions which arise from the ray definitions.

## 3. The Plane Groups
  Vertical planes (rook)
    Left
    Right
  Forward planes (bishop)
    Upward
    Downward
  Outward planes (bishop)
    Leftward
    Rightward
  Verticalcross planes (duke)
    Major
    Minor
  Leftcross planes (duke)
    Upleft
    Downleft
  Rightcross planes (duke)
    Upright
    Downright

## 4. Plane First-Quads and Direction
  * Canonicalization is determined by a hierarchy of constraints:
  1. For pawn advance planes:
    1.1 Q1 is chosen toward opponent, rotation is clockwise (relative to pov).
    1.2 If two quads approach opponent, Q1 is the top most, rotation toward the opponent (second quad).
  2. For pawn bishop-capture planes:
    2.1 For a unique pawn-defined forward direction, Q1 is chosen in that direction, rotation is upward.
    2.2 If two quads approach opponent, Q1 is toward the top, Q2 is the adjacent quad, approaches opponent.
  3. For pawn duke-capture planes:
    3.1 Q1 is chosen toward opponent, rotation is clockwise (relative to pov).
    3.2 If two quads approach, Q1 is top most, rotation toward the opponent (second quad).
    3.3 If no quads approach opponent, Q1 is top most, rotation is clockwise (relative to pov).

  | #  | Plane      | POV     | Q1 Nickname  | Ray Cycles                                      | Rule |
  | :- | :--------- | :------ | :----------- | :---------------------------------------------- | :--- |
  |  1 | Horizontal | White   | Forward      | left_fore > right_fore > left_back > right_back | 1.1  |
  |  2 | Left       | White   |              | up        > right_fore > down      > right_back | 1.2  |
  |  3 | Right      | White   |              | up        > left_fore  > down      > left_back  | 1.2  |
  |  4 | Upward     | White   | UpPredator   | LFU > RFU > right > RBD > LBD > left            | 2.1  |
  |  5 | Downward   | White   | DownPredator | LFD > RFD > right > RBU > LBU > left            | 2.1  |
  |  6 | Leftward   | White   |              | LBU > LFU > fore  > RFD > RBD > back            | 2.2  |
  |  7 | Rightward  | White   |              | RBU > RFU > fore  > LFD > LBD > back            | 2.2  |
  |  8 | Major      | Neutral | Dart         | fore_down  > fore_up   > back_up    > back_down | 3.1  |
  |  9 | Minor      | White   | Bridge       | left_up    > right_up  > right_down > left_down | 3.3  |
  | 10 | Upleft     | Top     |              | left_up    > fore_up   > right_down > back_down | 3.2  |
  | 11 | Downleft   | Top     |              | left_down  > fore_down > right_up   > back_up   | 3.2  |
  | 12 | Upright    | Top     |              | right_up   > fore_up   > left_down  > back_down | 3.2  |
  | 13 | Downright  | Top     |              | right_down > fore_down > left_up    > back_up   | 3.2  |

 ### 4.1 Derived Quad Indexing
  All quad indexing is derived from the canonical plane definitions above.

  For each plane:
  * Quads are defined as ordered adjacent ray pairs in the listed cycle.
  * Quad1 corresponds to the first two rays.
  * Subsequent quads follow the cycle order, with the final quad wrapping to the first ray.

  **Global** quad numbering (Q1–Q60) is defined by:
  1. The canonical plane order (table order above)
  2. The canonical ray-pair order within each plane
  
  **Base piece** quad number (1-12, 1-24, 1-24) is defined by:
  1. The canonical plane order, starting with the first plane of each base piece (table order above)
  2. The canonical ray-pair order within each plane

  **Plane** quad number (1-4, 1-6, 1-4) is defined by:
  1. The canonical ray-pair order within each plane

  Within each plane, canonical quad order is the canonical ray-pair order (starting at anchor).

  No additional definitions of quad numbering are permitted.

 ### 4.2 Canonical Adjacency Constraints
  * Adjacency is defined only between consecutive rays in the listed cycle.
  * No other ray pair is adjacent.
  * Quad ordering follows the cycle order and must not be reversed.
  * The listed ray cycle is the unique canonical ordering for each plane.
  * All geometry, quad construction, and movement logic must reference these canonical definitions.

 ### 4.3 Naming and Capitalization
  * Plane *types* are lowercase: `orthogonal`, `skew`, `slant`.
  * Plane *names* are capitalized: `Horizontal`, `Upward`, `Minor`, etc.
  * Ray names follow their canonical lowercase identifiers as defined in the rays module.

  These conventions are mandatory and form part of the canonical identity of each element. Any variation in capitalization is considered a distinct and invalid entity.



EARLY VERSIONS - RAW MATERIAL FOR THE GROWING SPEC.

## 1. Canonical Plane Rule - DEPRECATE
  - Each plane is uniquely defined by an ordered cyclic list of rays.
  - Adjacency is defined only between consecutive rays in this cycle - no other ray pair is adjacent.
  - Quadrants (quads) are defined as ordered adjacent ray pairs within the cycle.
  - The cycle is invariant under rotation, but a single canonical ordering is defined and must be used.
  - The first ray in the list defines the anchor for quad1.
    - Quad ordering proceeds in the order of the listed cycle.
    - Reversal of the cycle is not permitted.
    - Player perspective (e.g., White/Black) does not alter the canonical cycle.
  - Any ordering other than the canonical ordering is non-canonical and must not be used for indexing or identity.
  - All plane, quad, and movement logic MUST reference the canonical plane definitions (planes.json).

## 3. Global Quad Number - DEPRECATE
  - Quads are assigned a unique global index Q1–Q60.

  - Global ordering is defined by:
    1. Canonical plane order (planes.json → planeOrder)
    2. Within each plane, canonical quad order (Section 1 cycle, starting at anchor)

  - This ordering is deterministic and must be used for all indexing, labeling, and serialization.


## 4. Plane Quad Number  - DEPRECATE, but not quite yet, here to insure code follows the math.
  Rook   (1-4) = (Q<n>-1)%4 + 1
  Bishop (1-6) = (Q<n>-1)%6 + 1
  Duke   (1-4) = (Q<n>-1)%4 + 1

## n. Piece Quad Number - THIS SHOULD NOW BE DERIVED.
  Rook
    Horizontal (1- 4)  = Q1,Q2,Q3,Q4
    Left       (5- 8)  = Q5,Q6,Q7,Q8 
    Right      (9-12)  = Q9,Q10,Q11,Q12

  Bishop
    Upward      (1- 6) = Q13,Q14,Q15,Q16,Q17,Q18
    Downward    (7-12) = Q19,Q20,Q21,Q22,Q23,Q24
    Leftward   (13-18) = Q25,Q26,Q27,Q28,Q29,Q30
    Rightward  (19-24) = Q31,Q32,Q33,Q34,Q35,Q36

  Duke
    Major       (1- 4) = Q37,Q38,Q39,Q40
    Minor       (5- 8) = Q41,Q42,Q43,Q44
    Upleft      (9-12) = Q45,Q46,Q47,Q48
    Downleft   (13-16) = Q49,Q50,Q51,Q52
    Upright    (17-20) = Q53,Q54,Q55,Q56
    Downright  (21-24) = Q57,Q58,Q59,Q60


DUKE SPECIAL QUAD CASES WILL NEED TO BE TREATED SEPARATELY.

### 4.1 Duke quads by number and type
  Duke
    Major       (1- 4) = Q37e,Q38f,Q39e,Q40f
    Minor       (5- 8) = Q41f,Q42e,Q43f,Q44e
    Upleft      (9-12) = Q45e,Q46f,Q47e,Q48f
    Downleft   (13-16) = Q49e,Q50f,Q51e,Q52f
    Upright    (17-20) = Q53e,Q54f,Q55e,Q56f
    Downright  (21-24) = Q57e,Q58f,Q59e,Q60f

 ### 4.2 Duke quad types by modulo arithmetic
  If minor plane
    Face is Q%2 == 1, Edge if Q%2 = 0
  else
    Edge is Q%2 == 1, Face if Q%2 = 0

 ### 4.3 Duke Tile Topology
  Each duke quad induces a tile class not applicable in rook and bishop quads:
  - Duke quads come in two flavors, edge and face, which alternate.
  - Quad flavor is computed from ray deltas.

  - Edge quad → apex tile
    The apex is the unique terminal intersection of the quad’s two rays.

  - Face quad → duplex tile
    A duplex tile is the overlap of two apex tiles from the paired cross planes.

  Invariant:
    Every duplex tile corresponds to exactly two apex tiles.

 ### 4.4. Duke Quad Types
  Each Duke quadrant must expose the following fields:

    duke_type:  "edge" | "face"
      Derived from modulo rules (3.1) but stored explicitly.

    duplex: true | false
      true if the quadrant has overlapping apex tiles with its cross-plane.

    simplex: true | false
      true if the quadrant has only one apex tile (edge quadrants).

 ### 4.5 Formula for Quad Type:
  Given adjacent vertex rays with components (dz1,dx1,dy1) and (dz2,dx2,dy2):
    Let Δ = (dz2-dz1, dx2-dx1, dy2-dy1).
    Count zeros in Δ:
    2 zeros → edge-quad
    1 zero  → face-quad
  No other case occurs.

 ### 4.6 Alternating Quad Type Summary:
  Plane    firstQuad            wrapQuad
  Major:     edge - face - edge - face
  Minor:     face - edge - face - edge
  Upleft:    edge - face - edge - face
  Downleft:  edge - face - edge - face
  Upright:   edge - face - edge - face
  Downright: edge - face - edge - face

 ### 4.7 Scope:
  - Because the quad sequence is cyclic, each slant plane alternates edge and face quadrants.
  - In all slant planes except the Minor plane, quad1 is an edge quad and quad2 is a face quad.
  - In the Minor plane, quad1 is a face quad and quad2 is an edge quad.

## 5. The Canonical Plane Quad Table - DEPRECATE
  Each plane is defined ONLY by the following ray sets.

  Plane, Ray Set (1st to last)

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

 ### 5.1 Quad-Ray Correspondance
    Q1 corresponds to the first ray adjacency cycle (ray[0], ray[1])
    Q4 corresponds to (ray[3], ray[0]) for rook and duke.
    Q6 corresponds to (ray[5], ray[0]) for bishop.

 ### 5.2 Constraints:
    Adjacency is defined only by the listed cycles.
    No coordinate pattern or geometric relation may add or modify adjacency.

    No other grouping or adjacency pattern is valid.
    No ray may belong to more than the listed planes.

    Planes are distinct by text only.
    No symmetry or rotation of the cube may identify two plane-cycles.
    Only the listed cycles define plane identity.

    These cycles are the canonical order; none other exists.

 ### 5.3 Capitalization:
    Plane types are not capitalized, there are 3: orthogonal, skew, and slant.
    Plane names are, there are 13, such as Horizontal, Upward, Minor, etc.

 ### 5.4 Summary: 
   - For all 13 planes, the first quad is always the quadrant formed by the first two rays listed,
   - the wrapQuad is the last one listed.


## 6. Ray order
  The constructor accepts reversed ray-pairs for convenience,
  but the canonical ordering from quadMap.json is always returned.
  
 ### 6.1 Dependency
  This module depends on **quads.md** for the canonical ray cycles of all
  13 discrete planes. quadMap.json MUST be constructed by:
    1. Selecting the plane for each quadrant (per this spec).
    2. Importing that plane’s ray cycle from quads.md.
    3. Assigning quadrants Q1…Qn using the adjacency rule from quads.md.




## 7. Canonical Quadrant Resolution: Unified Constructor Rule
  Q = Quad(spec)
  spec: any one of...
    <n> (1-60)
    "Q<n>" ("Q1"-"Q60")
    "Q<n><e|f>" ("Q37"-"Q60")
    ("<piece>", q) (1-12/24)
    ("<plane>", q) (1-4/6)
    (ray1, ray2)
    "<nickname>"



## 8. Canonical Ordering of Fields in the Json File - needs AI work.
  The top-level key must be "quadMap".
  All quadrant entries must appear inside this object.
  Each "Qn" entry follows the canonical field order given in section 3.
  No additional keys may appear at the top level.
  Resulting json table must be column aligned for readability, diff, etc.

  Fields (in order)
    piece
    piece_quad
    plane
    plane_quad
    ray_pair
    duke_type      (only for Duke; omitted otherwise)
    duplex         (only for Duke)
    simplex        (only for Duke)
    nickname       (always last)

