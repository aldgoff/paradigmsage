# Overlap Tiles Spec
  Describe overlap tiles (base pieces, queen, and stack).

## 1. Purpose
  Define the overlap tile jargon and placement.
  Acts a part of the foundation for decorators (view layer).

## 2. Concepts
  * In 2D chess, orthogonal and diagonal lines meet only at the piece.
    - The advancement manifolds do not interact, zero overlap.
  * In 3D chess, orthogonal, skew, and slant planes intersect along a variety of lines.
    - The advancement manifolds do interact, linear intersections produce *overlap* tiles.

  * For base pieces, linear moves allow 2 or 3 attacks from different manifolds
  - Call the number of possible attacks, the *multiplicity*.
  * For composite pieces, they can attack some tiles as more than one base piece.

  These tiles are called *overlap* tiles.
  They add a new dimension to gambits because targets on them may require more than one piece to fully block an attack.
  They are *hazardous* tiles.

## 3. Jargon, Definitions, and Multiplicity
  | Overlap Name | Definition                                                            | Multiplicity |
  | :----------- | :-------------------------------------------------------------------- | :----------: |
  | End2         | 2 planes intersect (the base piece linear moves)                      |       2      |
  | End3         | 3 planes intersect (the base piece linear moves)                      |       3      |
  | Body         | Default (no overlaps)                                                 |       1      |
  | Apex         | Symmetric ray line (no overlaps)                                      |       1      |
  | Duplex       | The pair of overlapping apex tiles in face quads                      |       2      |
  | Brook        | Bishop linear moves overlap with rook apex moves                      |       3      |
  | Qtile        | Overlap of bishop linear, rook apex, and duke edge quad apex moves    |       4      |
  | Hotspot      | Overlap of rook linear and duke duplex (face quads)                   |       4      |
  | Feynman      | Overlap of every other bishop apex with every 3rd duke edge perimeter |       2      |
  | Third        | Special body tile for duke edge quads only - the Feynman location     |       1      |

## 4. Patterns
  - End2 and end3: every linear tile.
  - Apex: every tile down the 'diagonal' of the advancement square.
  - Brooks alternate with Qtiles down the bishop linear and rook apex lines.
  - Rook end tiles alternate with hotspots (duke face-quad duplex moves).
  - Feynman tiles alternate with bishop apex tiles.
  - Feynman tiles occur every third duke edge-quad perimeter at the body tile 1/3 from the end.
  - Body: any other tile.

