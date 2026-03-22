# Plane Quad Spec

  Canonical Plane Rule
   - Each plane is uniquely defined by its canonical cyclic ray list.
   - Ray adjacency exists only within this cycle.
   - Quadants (quads) are defined only by adjacent pairs in this cycle.
   - No rotation or reversal of the cycle is permitted.
   - Any alternative ordering, rotation, reversal, or ray-pair mapping is invalid.
   - All plane, quad, and movement logic MUST reference the canonical Plane Quad Table.

## 1. The Plane Quad Table
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

  ### 1.1 Quad-Ray Correspondance
    Q1 corresponds to the first ray adjacency cycle (ray[0], ray[1])
    Q4 corresponds to (ray[3], ray[0]) for rook and duke.
    Q6 corresponds to (ray[5], ray[0]) for bishop.

  ### 1.2 Constraints:
    Adjacency is defined only by the listed cycles.
    No coordinate pattern or geometric relation may add or modify adjacency.

    No other grouping or adjacency pattern is valid.
    No ray may belong to more than the listed planes.

    Planes are distinct by text only.
    No symmetry or rotation of the cube may identify two plane-cycles.
    Only the listed cycles define plane identity.

    These cycles are the canonical order; none other exists.

  ### 1.3 Capitalization:
    Plane types are not capitalized, there are 3: orthogonal, skew, and slant.
    Plane names are, there are 13, such as Horizontal, Upward, Minor, etc.

  Summary: 
   - For all 13 planes, the first quad is always the quadrant formed by the first two rays listed,
   - the wrapQuad is the last one listed.

## 2. The Plane Groups
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

## 3. Duke Quad Types
  - Duke quads come in two flavors, edge and face, which alternate.
  - Quad flavor is computed from ray deltas.

  ### 3.1 Formula for Quad Type:
    Given adjacent vertex rays with components (dz1,dx1,dy1) and (dz2,dx2,dy2):
      Let Δ = (dz2-dz1, dx2-dx1, dy2-dy1).
      Count zeros in Δ:
      2 zeros → edge-quad
      1 zero  → face-quad
    No other case occurs.

  ### 3.2 Alternating Quad Type Summary:
    Plane    firstQuad            wrapQuad
    Major:     edge - face - edge - face
    Minor:     face - edge - face - edge
    Upleft:    edge - face - edge - face
    Downleft:  edge - face - edge - face
    Upright:   edge - face - edge - face
    Downright: edge - face - edge - face

Scope:
  - Because the quad sequence is cyclic, each slant plane alternates edge and face quadrants.
  - In all slant planes except the Minor plane, quad1 is an edge quad and quad2 is a face quad.
  - In the Minor plane, quad1 is a face quad and quad2 is an edge quad.
