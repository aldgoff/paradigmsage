# Quad Map Spec

## 1. Global Quad Number 
  Quad (1-60)

## 2. Plane Quad Number 
  Rook   (1-4) = (Q<n>-1)%4 + 1
  Bishop (1-6) = (Q<n>-1)%6 + 1
  Duke   (1-4) = (Q<n>-1)%4 + 1

## 3. Piece Quad Number
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

  ### 3.1 Duke quad types by modulo arithmetic
    If minor plane
      Face is Q%2 == 1, Edge if Q%2 = 0
    else
      Edge is Q%2 == 1, Face if Q%2 = 0

  ### 3.2 Duke quads by number and type
    Duke
      Major       (1- 4) = Q37e,Q38f,Q39e,Q40f
      Minor       (5- 8) = Q41f,Q42e,Q43f,Q44e
      Upleft      (9-12) = Q45e,Q46f,Q47e,Q48f
      Downleft   (13-16) = Q49e,Q50f,Q51e,Q52f
      Upright    (17-20) = Q53e,Q54f,Q55e,Q56f
      Downright  (21-24) = Q57e,Q58f,Q59e,Q60f

  ### 3.3 Duke special tiles
    Edge quadrants have an apex tile.
    Face quadrants have duplex tiles, overlapping apex tiles of two cross planes.

## 4. Nicknames for selected quadrants
  Each quadrant may define at most one nickname; nicknames must be unique across all quadrants.

  Rook:
    Q1 - Forward
    Q2 - Right
    Q3 - Backward
    Q4 - Left
    Q5-Q12 - none

  Bishop:
    Q13 - UpPredator
    Q16 - DN
    Q19 - DnPredator
    Q22 - UP
    Q26 - LUpSling
    Q27 - LDnSling
    Q32 - RUpSling
    Q33 - RDnSling
    Not listed => none

  Duke:
    Q37 - Fore
    Q38 - Up
    Q39 - Aft
    Q40 - Down
    Q41 - Bridge
    Q42 - Starboard
    Q43 - Keel
    Q44 - Port
    Q45-Q60 - none

## 5. Ray order
  The constructor accepts reversed ray-pairs for convenience,
  but the canonical ordering from quadMap.json is always returned.
  
  ### 5.1 Dependency
    This module depends on **quads.md** for the canonical ray cycles of all
    13 discrete planes. quadMap.json MUST be constructed by:
      1. Selecting the plane for each quadrant (per this spec).
      2. Importing that plane’s ray cycle from quads.md.
      3. Assigning quadrants Q1…Qn using the adjacency rule from quads.md.

## 6. Canonical Quadrant Resolution: Unified Constructor Rule
  Q = Quad(spec)
  spec: any one of...
    <n> (1-60)
    "Q<n>" ("Q1"-"Q60")
    "Q<n><e|f>" ("Q37"-"Q60")
    ("<piece>", q) (1-12/24)
    ("<plane>", q) (1-4/6)
    (ray1, ray2)
    "<nickname>"

## 7. Duke Quad Types
  Each Duke quadrant must expose the following fields:

    duke_type:  "edge" | "face"
      Derived from modulo rules (3.1) but stored explicitly.

    duplex: true | false
      true if the quadrant has overlapping apex tiles with its cross-plane.

    simplex: true | false
      true if the quadrant has only one apex tile (edge quadrants).

  These fields are required in quadMap.json and must be returned by quadMap.py.
  If they must exist for rook and bishop, the should be null (none) or false.
  But it's better if they do not exist at all.

## 8. Canonical Ordering of Fields in the Json File
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

