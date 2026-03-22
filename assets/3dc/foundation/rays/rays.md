# Rays Spec
  - Rays are unit-offset directions in VTS space
  - Each ray is a triple (dz,dx,dy) with components in {−1,0,1} excluding (0,0,0)
  - These ray lists define names and coordinates only.
  - They do not specify ordering, adjacency, or plane membership.
  - All plane structure is defined only in the planeQuad module.

## 1. Rook rays (6 face-adjacent)
  up          ( 1, 0, 0)
  down        (−1, 0, 0)
  left_fore   ( 0, 1, 0)
  left_back   ( 0,−1, 0)
  right_fore  ( 0, 0, 1)
  right_back  ( 0, 0,−1)

## 2. Bishop rays (12 edge-adjacent)
  fore   ( 0,  1,  1)
  right  ( 0, -1,  1)
  back   ( 0, -1, -1)
  left   ( 0,  1, -1)

  LFU    ( 1,  0,  1)
  LFD    (-1,  0,  1)
  LBD    (-1,  0, -1)
  LBU    ( 1,  0, -1)

  RFU    ( 1,  1,  0)
  RFD    (-1,  1,  0)
  RBD    (-1, -1,  0)
  RBU    ( 1, -1,  0)

## 3. Duke rays (8 vertex-adjacent)
  fore_up     ( 1,  1,  1)
  fore_down   (-1,  1,  1)
  right_up    ( 1, -1,  1)
  right_down  (-1, -1,  1)
  back_up     ( 1, -1, -1)
  back_down   (-1, -1, -1)
  left_up     ( 1,  1, -1)
  left_down   (-1,  1, -1)

## 4. Knight jumps (24 independent deltas)
  Knights do not advance, they jump. They use **displacement vectors** not adjacent rays.

 ### 4.1 Duke-bishop Decomposition
  fore_up_fore     ( 1,  1,  1) + ( 0,  1,  1) = ( 1,  2,  2)
  fore_up_LFU      ( 1,  1,  1) + ( 1,  0,  1) = ( 2,  1,  2)
  fore_up_RFU      ( 1,  1,  1) + ( 1,  1,  0) = ( 2,  2,  1)
  fore_down_fore   (-1,  1,  1) + ( 0,  1,  1) = (-1,  2,  2)
  fore_down_LFD    (-1,  1,  1) + (-1,  0,  1) = (-2,  1,  2)
  fore_down_RFD    (-1,  1,  1) + (-1,  1,  0) = (-2,  2,  1)

  right_up_right   ( 1, -1,  1) + ( 0, -1,  1) = ( 1, -2,  2)
  right_up_LFU     ( 1, -1,  1) + ( 1,  0,  1) = ( 2, -1,  2)
  right_up_RBU     ( 1, -1,  1) + ( 1, -1,  0) = ( 2, -2,  1)
  right_down_right (-1, -1,  1) + ( 0, -1,  1) = (-1, -2,  2)
  right_down_LFD   (-1, -1,  1) + (-1,  0,  1) = (-2, -1,  2)
  right_down_RBD   (-1, -1,  1) + (-1, -1,  0) = (-2, -2,  1)

  back_up_back     ( 1, -1, -1) + ( 0, -1, -1) = ( 1, -2, -2)
  back_up_LBU      ( 1, -1, -1) + ( 1,  0, -1) = ( 2, -1, -2)
  back_up_RBU      ( 1, -1, -1) + ( 1, -1,  0) = ( 2, -2, -1)
  back_down_back   (-1, -1, -1) + ( 0, -1, -1) = (-1, -2, -2)
  back_down_LBD    (-1, -1, -1) + (-1,  0, -1) = (-2, -1, -2)
  back_down_RBD    (-1, -1, -1) + (-1, -1,  0) = (-2, -2, -1)

  left_up_left     ( 1,  1, -1) + ( 0,  1, -1) = ( 1,  2, -2)
  left_up_RFU      ( 1,  1, -1) + ( 1,  1,  0) = ( 2,  2, -1)
  left_up_LBU      ( 1,  1, -1) + ( 1,  0, -1) = ( 2,  1, -2)
  left_down_left   (-1,  1, -1) + ( 0,  1, -1) = (-1,  2, -2)
  left_down_RFD    (-1,  1, -1) + (-1,  1,  0) = (-2,  2, -1)
  left_down_LBD    (-1,  1, -1) + (-1,  0, -1) = (-2,  1, -2)

 ### 4.2 Knight Deltas are Data
  They are included in this layer because knight movement decomposes into ray combinations, 
  and all directional primitives (whether radiating or composite) are defined in L3.
  Knight deltas do not imply adjacency and are not used in ray-based propagation.

 ### 4.3 Notes
  Alternative decompositions:
    2 rook + 2 rook + 1 rook
    2 bishop + 1 rook
    1 duke + 1 bishop
  Note: the above portend the three quantum knight moves.

Scope:
  - Defines the 26 rays and their rook, bishop, and duke classifications
  - Defines the 24 displacement vectors for the knight move.
