# AXIOMS

## A1. Mission Lock
  Paradigm Sage is a sustained investigation of the quantum measurement problem using paradox, self-reference, and explanatory reconstruction.
  The site demonstrates seriousness and coherence, not results or closure.

## A2. Reader Contract
  Assume an intelligent, patient reader.
  Difficulty is managed through structure and staging, not simplification.

## A3. PoP Sovereignty
  Paradigm of Paradox (PoP) is the primary narrative spine.
  All other material is subordinate until it earns emancipation.

## A4. Activation Discipline
  No topic becomes reader-facing until a PoP chapter necessitates it.
  Presence in content does not imply navigational visibility.

## A5. Navigation Orthogonality
  Topic, traversal mode (serial vs analytic), and typography are independent axes.
  No navigation element may entangle axes.

## A6. Serial Primacy
  PoP is serial, not hierarchical.
  Next/Previous links are the dominant navigational signal.

## A7. Navigation Must Be Boring
  Navigation prioritizes predictability over cleverness.
  Insight belongs in content, not navigation.

## A8. Layout Resolution First
  When debugging Hugo, first determine layout resolution (type, kind, render path) before modifying templates or partials.

## A9. Structure Before Implementation
  Architectural boundaries must be defined before writing feature code.
  Pipelines and responsibilities precede implementation.

## A10. Single Source of Truth (SPOT)
  Semantic structure must be defined once and reused.
  No duplicated definitions or parallel interpretations.

## A11. Layer Separation
  Model, controller, and view responsibilities must remain distinct.

  * Model: truth and rules
  * Controller: state transitions
  * View: rendering and DOM

## A12. DOM Boundary Rule
  DOM access occurs only at runtime within the view layer or initialization boundary.
  Module-load DOM access is forbidden.

## A13. External vs Internal Integrity
  * Internal invariants → fail fast
  * External inputs (DOM, user input) → guard defensively

## A14. Instrument Structure
  Each instrument consists of:

  * Narrative layer (explanation)
  * Artifact layer (interactive runtime)

  Runtime code must only execute when the artifact is present.

## A15. Analytics as Measurement
  Analytics must reflect conceptual engagement thresholds, not raw traffic.
  Instrumentation design is part of the research.

## A16. Commit Semantics
  Commits represent stabilized architectural plateaus, not arbitrary checkpoints.
  History encodes meaning.

## A17. Constraint Discipline
  As the system grows, constraints must be refactored into:

  * axioms (this file)
  * interpretations
  * case law

  No duplication across layers.

