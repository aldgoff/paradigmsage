/**
 * Module: <filename>
 * Layer: Model (Constraint Definition)
 *
 * Purpose:
 * Defines invariant structures and rules for the 3D chess system.
 * This layer encodes WHAT is true, not HOW it is computed.
 *
 * Ontology:
 * - Movement is defined by advancement manifolds (not trajectories)
 * - Pieces are constraint accessors over equivalence classes
 * - State is a configuration, not a history of moves
 *
 * Contains:
 * - Congruent rules or 3DC specializations
 * - Equivalence class definitions
 * - Ray / manifold type definitions
 * - Piece definitions (declarative, not procedural)
 *
 * Does NOT:
 * - Generate moves
 * - Validate moves
 * - Reference UI or rendering
 *
 * Dependencies:
 * - May depend on other model modules only
 *
 * Invariants:
 * - Dimension-agnostic where possible
 * - No implicit trajectory assumptions
 * - Single Point Of Truth (SPOT)
 *
 * Notes:
 * Any logic that implies step-by-step motion is a violation.
 */

