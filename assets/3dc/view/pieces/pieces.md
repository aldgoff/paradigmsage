# Pieces Spec (view)
  Mesh and material design.

## 1. Purpose
  text

## 2. Piece Philosophy/Description
  I have an established design for the pieces, both in the book and an early Blender attempt. 
  I have in fact made physical versions, out of plastic - they owrk.
  The design is futuristic, but also in chess tradition, the design of each piece provides a hint as to how they move; the rook (castle) has 4 escarpments, the queen's crown has 8 points, the bishop a slash through his helmet, the knight's steed looks to one side, etc. 
  For 3D we take the planes and see how they outline the pieces move, so a rook is a cube (but vertically elongated), the bishop is a tetrahedron, the duke a cube turned on its corner, the knight 5 cubes stacked in its exact move pattern (auto head turn, both parities possible). 
  Interesting the 3 sided nature of duke and bishop means each can sit on top of the other stably, and look good, to make the stack. 
  A pawn is just a sphere sitting on a torus. 
  The king a tall cylinder (can move in all directions, but a fat squat sphere was not 'regal'). 
  The queen is the hardest, with multiple physical attempts; hex, twisted square, etc.
  I'd like each mesh to be granite/marble finish, mostly white with black striations for White, and mostly black with white striations for Black. 
  Contrast with the 8-colored board and each other is important. 
  See where I'm going?

## 3. Parameters
  Once the meshes are defined, they should come with two scale factors.
  - Aspect ratio.
  - Breadth ratio.

  The default size should sit on a tile and just cover it - we will scale down from there.
  The aspect ratio determines the height to breadth.
  The rook will probably be about 1.6, the queen 3, the king 3.5.
  TBD visually, in part to ensure when they line up one does not completely hide another.

## 4. Rendering Convention
  Piece dimensions are controlled exclusively through the JSON aspect/breadth parameters. 
  Geometry code must derive scale from those values rather than introducing independent size constants. 
  The JSON file is the authoritative calibration layer used to balance 
  visibility, aesthetics, and piece differentiation across the full set.

