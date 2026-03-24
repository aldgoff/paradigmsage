# Unit Cells Spec
  Establish the relationship between unit cells, rays, base pieces, and planes.

## 1. Unit Cells
  In 2D, the unit cell is a *square*, the 2D board is a square of squares (8x8).
  - *Side* rays (4) => 2 *orthogonal* lines => *rook* (1st base piece) => change 1 coord axis.
  - *Corner* rays (4) => 2 *diagonal* lines => *bishop* (2nd base piece) => change 2 coord axes.
  In 3D, the unit cell is a *cube*, the 3D board is a cube of cubes (8x8x8).
  - *Face* rays (6) => 3 *orthogonal* planes => *rook* (1st base piece) => change 1 coord axis.
  - *Edge* rays (12) => 4 *skew* planes => *bishop* (2nd base piece) => change 2 coord axes.
  - *Vertex* rays (8) => 6 *slant* planes => *duke* (3rd base piece) => change 3 coord axes.

## 2. Cross-Module Correlations
  - A *rook* moves in an *orthogonal* plane defined by a pair of *face* rays.
  - A *bishop* moves in a *skew* plane defined by a pair of *edge* rays.
  - A *duke* moves in a *slant* plane defined by a pair of *vertex* rays.

