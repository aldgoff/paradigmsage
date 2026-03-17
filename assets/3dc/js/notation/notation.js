/**
 * Module: <filename>
 * Layer: Representation (State & Move Encoding)
 *
 * Purpose:
 * Defines canonical state strings and transition descriptors.
 *
 * Components:
 * - Canonical state string (static configuration)
 * - Manifold descriptor (move definition)
 * - Optional perimeter trace (expansion history)
 *
 * Ontology:
 * - A move is defined by its manifold, not just source/destination
 *
 * Responsibilities:
 * - Encode/decode board state
 * - Encode/decode move descriptors
 * - Preserve dimension-agnostic structure where possible
 *
 * Notes:
 * Do not infer move legality from notation alone.
 */

