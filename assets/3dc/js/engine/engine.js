/**
 * Module: <filename>
 * Layer: Engine (Manifold Computation)
 *
 * Purpose:
 * Implements the core constraint mechanics of the system.
 * This is the paradigm-breaking layer.
 * Unneeded in classical games, but required where moves do not have trajectories.
 * The other MVC layers will make heavy use of this engine.
 *
 * Ontology:
 * - Moves are validated via manifold existence and emptiness
 * - No paths, only sets and constraints
 * - Expansion occurs by perimeter growth
 *
 * Responsibilities:
 * - Generate valid manifolds for a given piece and state
 * - Expand advancement squares (perimeter growth)
 * - Validate manifold emptiness
 * - Compute legal destinations from manifolds
 *
 * Does NOT:
 * - Make strategic decisions
 * - Store game state
 * - Render output
 *
 * Inputs:
 * - Current state (from model)
 * - Piece identity (constraint definition)
 *
 * Outputs:
 * - Manifold descriptors
 * - Validated transitions
 * - Optional perimeter traces
 *
 * Critical Constraints:
 * - No trajectory reconstruction
 * - Blocking is global (any tile in manifold)
 * - Results must satisfy projection invariance
 *
 * Notes:
 * If this module starts to look like pathfinding, it is wrong.
 */

