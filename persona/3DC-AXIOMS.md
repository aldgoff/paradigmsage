# 3D Chess — Congruent Axioms, Structures, and Derivations

 ## Purpose
  Dimension-agnostic constraint layer for rapid ingestion. Encodes the **Congruent Rules** as axioms plus 3D specializations. No pedagogy, no narrative.

# I. Congruent (Dimension-Agnostic) Axioms

 ## C1. Board
  * A chess board is a **regular array of regular unit cells (tiles)**.
  * Tiles alternate between two colors (white/black).
  * Unrestricted pieces may traverse the full extent of the board.

 ## C2. Rays (Topology First)
  * A **ray** connects a tile to an adjacent tile and is classified by the number of coordinates it changes.
  * In D dimensions there are D ray types (change 1..D coordinates).

 ## C3. Base Pieces per Dimension
  * There is **one base piece per dimension**.
  * Base piece k advances along rays that change **k coordinates**.
  * Each successive base piece reaches **half as many tiles** as the previous.

 ## C4. Advancement Ontology
  * Movement is defined by **emptiness of an advancement manifold** (no trajectory).
  * Base pieces move in a space of dimension **(D−1)**.
  * An advancement manifold is defined by **(D−1) rays of the same type**.
  * A piece may advance only while the **next perimeter is empty**.

 ## C5. Linear Moves (Derived)
  * Linear moves are **intersections of manifolds**.
  * A linear move is legal if **at least one** associated advancement rectangle is empty.
  * Linear motion occurs in **every unblocked manifold** that contains the line.

 ## C6. Composition
  * **Composite pieces** are unions of base-piece manifolds (rook excluded from composition constraint as base reference).
  * The queen is the **sum of base pieces**.
  * The knight is the **anti-queen** (non-manifold, cannot be blocked).

 ## C7. Atomicity
  * Moves are **atomic events** (no intermediate states).

 ## C8. Projection Invariance
  * Projection of a D-dimensional move onto a (D−1)-dimensional subspace yields the corresponding lower-dimensional move.

 ## C9. Layered Ontology
  * The system is partitioned into three ordered layers:
    * Foundation → defines space (coordinates, rays, equivalence classes).
    * Geometry → defines manifolds and advancement structures within that space.
    * Model → defines piece behavior and game semantics.
  * The transition from trajectory to manifold-based movement is fully contained within the geometry layer.
  * Each layer depends only on those below it; no upward or lateral dependency is permitted.

# II. 3D Specialization (D = 3)

 ## A1. Tile Equivalence Classes
  * Tiles partition into **8 equivalence classes**:
    * Bishop parity (2) × Duke parity (4).

 ## A2. Ray Types
  * Face (1 coordinate), Edge (2), Vertex (3).

 ## A3. Base Pieces
  * **Rook (face)**: changes 1 coordinate → reaches 8/8 classes.
  * **Bishop (edge)**: changes 2 coordinates → reaches 4/8 classes.
  * **Duke (vertex)**: changes 3 coordinates → reaches 2/8 classes.

 ## A4. Plane Families (Manifolds)
  * Rook: **3** orthogonal plane families.
  * Bishop: **4** skew plane families.
  * Duke: **6** slant plane families.
  * Planes are **equivalence-preserving manifolds**, not merely geometric slices.

 ## A5. Advancement Squares
  * Legal move requires an **NxN advancement square** within a chosen plane and quadrant.
  * Growth is **isotropic (square-only)**.
  * Capture occurs on the **perimeter**.

 ## A6. Linear Moves in 3D
  * Implemented via **advancement rectangles** (two adjacent squares).
  * Legal if at least one plane’s rectangle is empty; may occur in multiple planes simultaneously.

 ## A7. Blocking (Nonlocal)
  * Any occupied tile within the manifold **blocks** the move.

 ## A8. Queen
  * Union of rook, bishop, and duke manifolds.

 ## A9. Knight (Anti-Queen)
  * Defined as the **complement of queen reach** within a 5×5×5 neighborhood → **24 targets**.
  * Non-manifold, **unblockable**.
  * Changes **both bishop and duke colors** each move (cycles all 8 classes).
  * Projection onto any face yields the **2D knight move**.

  ## A10. King
  * Short-range, perimeter-1 movement via the **highest advancement rung**.
  * Must preserve check/readability constraints.

 ## A11. Pawn
  * **Advance**: rook-like (dominant manifold only), typically to **perimeter 1** (with first-move exception to perimeter 2).
  * **Capture**: via bishop or duke manifolds **toward promotion**.
  * Operates under **dominant manifold** and **virtual quadrant** rules; virtual components do not block.
  * Promotion at opponent home tiles; irreversible.

 ## A12. Board Size & Stack
  * Board: **8×8×8**.
  * **Stack**: bishop + duke co-located as a composite piece constrained to one equivalence class; can **decay**.

 ## A13. Starting Lineup
  * Major pieces on **opposing vertical edges**; levels correspond to piece types.
  * Pawns placed **diagonally forward** (second-highest-order feature), one per major piece.

 ## A14. Castling (Atomic, Supernatural)
  * Simultaneous king/rook move(s) within valid manifolds; no capture during castling.
  * King performs a **linear rook move to perimeter 2**; rook(s) relocate adjacent beyond the king.
  * May occur in any/all orthogonal manifolds containing the home line; ambiguity is **inclusive**.

 ## A15. En Passant (Manifold-Constrained)
  * Capture of a just-doubled pawn via a **covered path tile** on the next move, subject to path coverage constraints.

# III. Derived Consequences

 ## D1. No Trajectory
  * Only initial and final states exist; paths are not part of the rules.

 ## D2. Equivalence-First Identity
  * Pieces are defined by **which equivalence classes and manifolds** they access.

 ## D3. STAB Bound
  * Coverage must remain within a bounded range comparable to 2D to preserve midgame structure.

 ## D4. Projection Consistency
  * All 3D rules reduce correctly to 2D under projection.

# IV. Deferred Local Specifications
  * Pawn molasses / shackling specifics
  * Full en passant variants (apex/end/between tiles)
  * Castling permutations and constraints (through-check cases)
  * Exact coordinate parameterization for duke/knight

# V. Development Lessons Learned.

 ## Layer Architecture (Enforced)
  The system is partitioned into:
  - Foundation → defines coordinate systems, rays, equivalence classes
  - Geometry   → defines manifolds and advancement structures
  - Model      → defines piece behavior and game rules
  - 
  - No trajectory-based reasoning exists above the geometry layer.
  - The model layer must not encode spatial mechanics.

 ## Testing Discipline
  - Tests follow: run() → test_* → assert → report → finalReport
  - Tests are additive and never rewritten
  - Expected values must derive from board specifications
  - No hardcoded assumptions about board size or anchor

 ## Specification Primacy
  - All coordinate behavior is defined by board specification (spec).
  - Any logic that depends on board size, anchor, or level mapping must reference spec, not constants.

