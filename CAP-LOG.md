**Condensed Capture Log (≈25%)**

1. **Capture Governance Invariant**
   Captures record assistant obligations and shared invariants, not transient troubleshooting. Any change to capture structure or semantics requires explicit renegotiation.

2. **Hugo Debugging First Principle**
   Always verify layout resolution (type / kind / render path) before debugging templates, navs, or partials. Instrument to observe runtime truth before modifying code.

3. **Navigation Axes Orthogonality**
   Topic, navigation mode (serial vs analytic), and typography are orthogonal axes. No navigation element may implicitly entangle more than one axis.

4. **PoP Sovereignty & Navigation Architecture**
   Traversal mode must not be encoded as content identity. PoP pages render via section-based layouts; navigation ranges over sibling pages to preserve axis independence and correct active state.

5. **Git Merge Semantics as Meaning**
   All merges must be non–fast-forward. Merge commits (or empty commits) act as semantic landmarks recording architectural decisions, not just file history.

6. **Staging & Publication Discipline**
   Stage work on purpose-named branches, commit before merge, never debug on main, and never push fixes during GitHub Pages deploy wobble.

7. **Future-Dated Content Reality**
   Hugo hides future-dated content unless built with `--buildFuture`; GitHub Pages will not rebuild on date rollover without a new commit.

8. **Indirection Fragility (Lost-Pointer Failure Mode)**
   Systems fail catastrophically when meaning is externalized into too many layers of indirection. Builds may succeed while semantics collapse.

9. **Tool-Induced Cognitive Debt Boundary**
   Tooling complexity that blocks minor edits or demands deep internals knowledge is a systemic risk and must be constrained to protect primary research focus.

10. **Portents as Structural Invariants**
    Every discourse begins with a self-referential quote; every technical chapter begins with a self-referential visual. Portents orient the reader before formal exposition.

11. **Self-Reference as Explanatory Primitive**
    Self-reference is intuitively detected, systematically excluded from formal physics, and must be confronted explicitly to address the quantum measurement problem.

12. **Formalization Limits as Signal**
    Failures to fully formalize intuition (humor, comics, recognition) are informative artifacts and should be preserved, not erased.

13. **Act II Structural Failure Principle**
    Act II is designed to fail. Progress requires exposing a cluster of reinforcing assumptions; partial successes and dead ends are expected.

14. **Critique Must Be Earned**
    Any critique is valid only if the reader was first given sufficient reason to believe the proposal being critiqued.

15. **Analytics as Measurement Instruments**
    Analytics must align with conceptual thresholds, not raw clicks. Structural encoding (naming, directories, PDF interception) *is* the analytics schema.

16. **Three Orthogonal Reader Signals**
    Markdown views → orientation; chapter PDF clicks → technical commitment; discourse PDF clicks → conceptual engagement. These cannot be inferred post hoc.

17. **Complexity Load Insight**
    Conversation slowdown correlates with accumulated invariants (constraint density), producing linear cognitive drag rather than sudden collapse.

18. **Constraint Normalization Imperative**
    Mature systems require refactoring constraints into axioms, interpretations, and case law—without deleting historical captures.

19. **Emancipation as Transfer of Agency**
    Emancipation chapters give the reader instruments, not conclusions; agency transfer, not depth alone, defines success.

20. **Act II Completion Criterion**
    A successful Act II leaves a fair critic concluding: “This isn’t junk science. It’s incomplete. Show me something testable.”

21. **Geometric Predicate Readability Convention**
    Use the between-form predicate style `(a <= x && x <= b)` rather than `(x >= a && x <= b)` for canvas geometry. This emphasizes bounded-interval semantics as a single conceptual unit and reduces cognitive parsing overhead during hit-testing.

22. **Intentional Trailing Brace Indentation**
    Function closing braces may be indented to align with internal structure in order to enable preferred VSC code-folding compression. This formatting is deliberate and not cosmetic.

23. **Preserve Intentional Visual Formatting**
    Deliberate vertical alignment, interval symmetry formatting, and non-standard indentation used for rapid human scanning must be preserved during refactors. Visual structure encodes semantic grouping and must not be normalized without explicit instruction.

24. **View-Owned Input Pipeline Invariant**
    All canvas pointer listeners live exclusively in `view.js`. The view performs ordered dispatch (controls → board → future regions). The controller must never perform geometry, hit testing, or DOM interaction.

25. **Structured Semantic Event Contract**
    The view emits structured semantic event objects (e.g., `{ type, square, cell }`) rather than raw identifiers. The controller consumes semantic intent, not geometric artifacts. This defines the canonical view→controller interface.

26. **Spooky Cell Identity Binding Principle**
    Each square contains nine fixed subcells (`m1–m9`) bound to move identity, not render order. Spatial slots represent persistent move IDs, reinforcing ontological continuity and collapse semantics.

27. **Static Layout Trust & Fail-Fast Policy**
    Layout geometry is treated as internally sovereign. Defensive null-guards for controlled layout structures are removed in favor of immediate failure on structural corruption. Internal integrity outweighs silent tolerance.

28. **Single Event Entry, Ordered Dispatch Rule**
    Input handling follows a single entry point with priority routing. Controls receive first right of refusal; board receives second. No parallel listener trees may be introduced without explicit architectural renegotiation.

29. **Clean Pipeline as Architectural Milestone Marker**
    The phrase “clean pipeline” denotes a completed boundary stabilization between layers. When adopted in commit messages, it signifies that event flow is deterministic, layered, and leak-free.

30. **Architecture-First Implementation Discipline**
    Before writing new feature code, explicitly settle architectural boundaries and layer responsibilities. Define the pipeline and function names first; implement functions only after structural agreement. This reduces churn, duplication, and corrective rewrites.

31. **Canonical String Authority Principle**
    If semantic structure (e.g., cycles, stems) is already encoded in the canonical state string, the view must parse and trust that encoding rather than re-derive structure from graph analysis. The canonical string is the single authoritative representation of game state.

32. **Temporal–Structural Separation Rule**
    Temporal semantics (e.g., move order, cycle triggering) belong to the model/controller. Structural interpretation and rendering belong to the view. The view must not infer temporal meaning from structural graphs when time is already encoded in the canonical state.

33. **Commit-at-Plateau Discipline**
    Commits should occur at stable architectural plateaus where a vertical slice is complete (e.g., full entanglement rendering) rather than at arbitrary stopping points or fatigue thresholds. Each commit should represent a stabilized layer boundary.

34. **Structural Logging Convention**
    When debugging structural systems, log structural artifacts (graphs, components, color maps) rather than surface symptoms. Debugging proceeds from structural invariants downward, not from visual anomalies upward.

35. **Refinement Deferral Principle**
    Non-blocking behavioral refinements (e.g., partial-move color nuance) must be explicitly marked and deferred rather than patched mid-feature. Momentum and architectural integrity take precedence over speculative polish.

36. **Collapse Squares Are Terminal**
    Once a square collapses to a classical mark, it is permanently closed to further spooky placement. Classical reality is irreversible within a game instance. Enforcement derives solely from the canonical state string via isSquareClassical().

37. **Declarative Rendering Invariant**
    Canvas rendering must remain a pure function of stateString. No partial clearRect mutation or temporal canvas state may encode game logic. All visual state must be derivable from canonical transcript alone.

38. **Collapse Serialization Completeness Rule**
    All resolved moves in a collapse event must be explicitly serialized in the canonical string. Collapse resolution is not recomputed on load; the transcript fully determines classical outcomes.

39. **Move-Order Canonical Collapse Listing**
    Resolved moves within a collapse block are listed in move-number order, not causal propagation order. Causal structure remains encoded in loop notation; collapse listing encodes final classical truth.

40. **Classical Mark Subscript Requirement**
    Classical marks must retain move-number subscripts. Chronological precedence is semantically meaningful and must remain visible in the classical board state.
