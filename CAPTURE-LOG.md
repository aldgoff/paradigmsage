# Capture Log (for Chat Transfer)

1. **Debugging invariant (Hugo):**
  - Always verify layout resolution (type / kind / render path) before debugging templates, navs, or partials.

2. **Debugging method preference:**
  - Instrument first to observe runtime truth, then modify code — no trial-and-error patching.

3. **Navigation state (initial):**
  - PoP (serial content) navigation is stable and working; QT3 (instrument content) navigation was broken and investigated next.

4. **Capture protocol clarification:**
  - Captures are for what the assistant must remember, not reminders of user responsibility.

5. **Capture format decision:**
  - Captures are to be maintained as a linear list, not grouped or structured, unless explicitly renegotiated later.

6. **Capture governance process:**
  - On a new chat, the user may provide the capture log and request an assessment (drift, conflict, speed, etc.). Condensation is optional, iterative, and only done after explicit agreement.

7. **Staging strategy (PoP):**
  - Use git branching (not Hugo dates) to stage PoP content; validate locally; merge to main on publication date.

8. **Sentinel branch convention:**
  - Create an initial PoP sentinel branch (pop-staging-01) early to anchor sequencing and avoid ambiguity about “missing” branches.

9. **Branch naming convention:**
  - Use short, purpose-driven branch names like pop-staging-02; do not encode Word document version numbers into branch names.

10. **Version provenance tracking:**
  - Track Word/PDF source provenance in Markdown front matter using a dedicated metadata block when needed.

11. **README purpose:**
  - README.md is acceptable and preferred as a human-facing capture document for intent, workflow, and growth of the site; it does not conflict with Hugo.

12. **Hugo behavior (future dates):**
  - Hugo hides future-dated content from navigation unless run with --buildFuture.

13. **Publication preview rule:**
  - During staging, Hugo is run with --buildFuture so future-dated PoP content appears in nav for validation.

14. **Commit vs merge distinction (workflow):**
  - Commit stabilizes a branch; merge promotes it. Staging branches should be committed and pushed before any merge to main.

15. **Staging commit hygiene:**
  - Do not commit debug instrumentation, provisional CSS, or unsettled architectural changes to staging branches.

16. **Goldmark configuration decision:**
  - Enabling goldmark.extensions.table = true is a global semantic prerequisite and should be committed.

17. **Deferred items (explicit tech debt):**
    * Layout unification between _default and serial
    * Separation of nav axis from typography axis
    * Removal of inline layout styles into a single invariant

18. **CLI preference under complexity:**
  - Use git CLI for commit/push when VS Code behavior around unstaged files becomes confusing.

19. **New-branch push rule:**
  - A new local branch appears on GitHub only after `git push -u origin <branch>`.

20. **Tech-debt management insight:**
  - Infrastructure and cognitive tech debt must be indexed, not fixed immediately; otherwise it becomes invisible and corrosive.

21. **Hypercube architecture (current):**
  - Site architecture is modeled as orthogonal axes:
    * Topics (PoP, QTP, QT3, 3DC, etc.)
    * Navigation (serial, analytic)
    * Typography (expansive, condensed)

22. **PoP publishing strategy (revised):**
  - PoP chapters are PDF-first. Markdown pages act as portals containing portent, document links (discourse + chapter), and significance, not full chapter text.

23. **PDF asset convention (PoP):**
  - PDFs live under `static/assets/pop/pdf/` with no spaces in filenames.

24. **Merge semantics insight:**
  - Fast-forward merges record work history; explicit merge commits or empty commits record architectural decisions. Use `--no-ff` or `--allow-empty` commits when the process matters.

25. **GitHub Pages operational model:**
  - GitHub Actions is authoritative for Hugo build and Pages deploy. CDN propagation is asynchronous; transient inconsistencies are expected post-deploy.

26. **Operational invariant (Pages):**
  - Never push fixes during deploy wobble. Wait for Actions completion, then allow time for CDN propagation before diagnosing.

27. **Tooling insight:**
  - GitHub Actions UI provides reliable visibility into build/deploy progress; the Pages UI spinner may lag or fail to update even after completion.

28. **Navigation architecture decision (Gate 2):**
  - Topic expansion is governed by a site-local activation state. PoP and topics must not encode knowledge of each other; integration is editorial and site-specific (O(N) coupling, not O(N²)).

29. **Navigation architecture correction (PoP sovereignty):**
  - Traversal mode (“serial”) must not be encoded as content identity (type). 
  - PoP pages are rendered by section-based layouts, and navigation ranges over sibling pages via .CurrentSection.Pages, 
  - ensuring correct active-state highlighting and preserving orthogonal hypercube axes.

30. **Git workflow invariant (merge semantics):** 
  - All branch merges must use --no-ff. 
  - Fast-forward merges are disallowed so that merges remain visually explicit in history and serve as semantic landmarks. 
  - When discussing or performing a merge, explicitly verify non-fast-forward behavior.
    
31. **Hugo analytics invariant:**
  - Hugo can validate analytics semantics locally (injection, execution, payload), but can never validate endpoint viability; transport must be mocked or external.

32. **Static-site stats rule:**
  - Static sites can emit signals, but can never receive them. Any stats receiver must live outside Hugo/GitHub Pages.

33. **Editor context:**
  - Primary editor is VS Code; user is also comfortable with vi. Instructions may assume either, defaulting to VS Code when practical and CLI/vi-safe when necessary.

34. **Hugo taxonomy foot-gun:**
  - An explicit empty `[taxonomies]` block combined with `disableKinds = ["taxonomy", "taxonomyTerm"]` alters Hugo’s internal page graph 
  - and can silently break `.CurrentSection.Pages` navigation. If taxonomies are unused, do not declare `[taxonomies]`.

35. **GitHub Pages + dated content invariant:**
  - GitHub Pages does not rebuild on date rollover. Future-dated Hugo content requires a post-date commit to trigger p

36. **Comic Usage as Epistemic Portents**
  - Comics in *Paradigm of Paradox* are not illustrations or decoration. 
  - They function as epistemic portents: pre-formal devices that train reader attention toward self-reference, incongruity, and framing failure before technical discussion begins.

37. **Self-Reference as a Primary Explanatory Resource**
  - The project treats self-reference as ubiquitous, intuitively detected (often via humor), and systematically excluded from formal physics. 
   -Intuitive recognition of self-reference precedes formal articulation, and confronting it explicitly is necessary to address the quantum measurement problem.

38. **Formalization Limits as Signal**
  - Attempts to fully formalize or translate intuitive artifacts (e.g., humor, comics, recognition-based alignment) may degrade their function. 
  - Such failures are informative and should be preserved as epistemic artifacts rather than erased.

39. **Assistant Evaluation Boundary**
  - Comic selection is recognitional rather than rule-based. 
  - The assistant can evaluate alignment, redundancy, and epistemic function of proposed comics, but cannot originate or replace the author’s recognition of conceptual fit.

40. **Act II Failure Is Structural, Not Accidental**
  - Act II is designed to fail because the quantum measurement problem is not blocked by a single false assumption.
  - Progress requires confronting a cluster of mutually reinforcing assumptions. Partial successes and dead ends are expected and necessary.

41. **Critique Must Be Earned by Prior Proposals**
  - Any critique presented in Act II (e.g., Chapter 23 — Friends) must correspond to explicit proposals or mechanisms introduced earlier. 
  - A critique is valid only if the reader has first been given sufficient reason to believe, and then doubt, the proposal.

42. **FTL as Pressure, Not Objective**
  - Faster-than-light signaling functions as a motivating pressure rather than a desired outcome. 
  - Treating FTL as a live possibility forces the discovery of deeper nonlocal structures, even when FTL itself proves illusory.

43. **Emancipation Pattern (Formalized)**
  - Each emancipation series is launched by one PoP chapter (formal) and one Paradigm Discourse (dramatic). 
  - Understanding assigns ownership to one or more team members. 
  - Results are later reintroduced into PoP only through those characters and only in distilled form.

44. **Act II Completion Criterion (Reconfirmed)**
  - An Act II endpoint is successful if a fair, open-minded critic concludes: *"This isn’t junk science. 
  - It’s incomplete. Show me something testable."*

45. **Semi-Entanglements (Terminology)**
  - "Semi-entanglements" denote two-particle pure states with three equal-magnitude coefficients and one zero, 
  occupying an intermediate entanglement stratum with discrete Schmidt rank but non-maximal entropy.

46. **Entanglement Stratification as a Structural Clue**
  - The discreteness of Schmidt rank induces singular boundaries in physically relevant state space. 
  - Continuous unitary evolution cannot traverse these boundaries; inverse (retrodictive) mappings 
  become multivalued there, yielding indeterminacy rather than contradiction.

47. **Workflow Stability and Cadence Enforcement**
  - Established practices include one-commit-per-idea on holding branches, cherry-picking into staging branches, 
  null commits to enforce cadence, and verified Hugo + GitHub Pages propagation (CSS, navigation, spacing).

48. **Portents as Structural Invariants**
  - Every discourse begins with a self-referential quote, and every technical chapter begins with a self-referential visual.
  - These portents function as orientation markers, preparing the reader for conceptual destabilization prior to formal exposition.

49. **Comic as Visual Self-Reference (Definition)**
  - A “comic” is defined functionally, not humorously: any visual artifact that conveys self-reference and structural tension before explanation.
  - Non-humorous works (e.g., Escher-class visuals) satisfy this role when they preserve the orienting function.

50. **Forms-4 as a Generative Base Case**
  - Forms-4 (the exhaustive n = 2 self-referential logic space) is treated as a fully unfolded base case of a generative family.
  - Exhaustiveness at n = 2 establishes structural richness; higher n are addressable but not enumerable.

51. **Emancipation as Transfer of Agency**
  - Emancipation chapters are defined by transfer of agency rather than depth alone: the reader is given instruments (enumerations, generators, or tools) instead of conclusions.

52. **Naming Conventions as Analytics Schema**
  - Content naming and directory structure *are* the analytics schema.
    - `Ch*` vs `PD*` encodes **chapter vs discourse**
    - `/actN/` encodes **reader progression**
    - No per-file instrumentation required
  - Measurement is derived from structure, not added as markup. Analytics scales automatically with content growth.

53. **Global PDF Instrumentation Pattern**
  - Use a single global JavaScript click interceptor to classify and record PDF interactions.
    - Intercept all `<a href="*.pdf">` clicks
    - Infer semantics from URL (`act`, `Ch`/`PD`)
    - Emit GoatCounter events:
      - `pdf_chapter_actN`
      - `pdf_discourse_actN`
  - Eliminates manual tagging across dozens of files, enforces consistency, and preserves low-friction authoring.

54. **Analytics as Epistemic Instrumentation**
  - Analytics are meaningful only when they align with *conceptual thresholds*, not raw interactions.

  - **3 orthogonal signals are cleanly separated:**
    1. **Markdown pageviews** → orientation / skimming / exposure
    2. **Chapter PDF clicks** → technical-depth commitment
    3. **Discourse PDF clicks** → conceptual engagement

  - This separation cannot be inferred post hoc. It requires **explicit semantic encoding at the moment of action**.
  - Analytics are not counters; they are **measurement instruments**. Misaligned instruments collapse meaning. Aligned instruments reveal structure.

55. **Complexity Is Fragile Because Indirection Is Fragile**
  - Systems fail catastrophically when meaning is externalized into layers of indirection, even if every component “works.”

  - **Concrete Instance**
    * Same file
    * Multiple languages
    * Multiple parsers
    * Different interpretations
    * Successful build
    * Broken semantics

  - The lost-pointer failure mode: base data still exists, but the reference to it is corrupted. Collapse is instantaneous and total.
  - Robust systems minimize semantic indirection at boundaries. When meaning depends on too many interpreters, failure becomes discontinuous.

56. **Constraint Density as Performance Load**
  * Conversation slowdown correlates with accumulated invariants, not turn count or memory exhaustion.
  * Increased constraint density raises baseline cognitive cost (higher y-intercept), producing linear drag rather than sudden collapse.

57. **Constraint Normalization Imperative**
  * Verbose, late-stage constraints signal maturity but require refactoring.
  * Optimization should factor axioms, interpretations, and case law without deleting historical captures.

58. **Navigation Invariants Refactoring Principle**
  * Navigation rules must protect meaning, not mechanism.
  * Presentation-level details (e.g., typography, spacing) should not masquerade as axioms.

59. **Navigation Axes Orthogonality (Reduced Form)**
  * The site contains multiple conceptual axes:
    * Topic (PoP, QT3, QTP, etc.)
    * Navigation mode (serial vs analytic)
  * **Invariant:** No navigation element may implicitly entangle more than one axis.

60. **Hugo Template Hostility Invariant**
  * Hugo layout files using `{{ define }}` are hostile to extraneous output.
  * Any content (comments, whitespace) outside a define block silently breaks template resolution.

61. **Safe Commenting Rule (Hugo)**
  * Documentation in Hugo block templates must use Go template comments (`{{/* */}}`) placed *inside* the define block, or live externally.

62. **Delegation Boundary Clarification**
  * The author should not be required to master Hugo internals.
  * Tooling complexity that blocks minor edits is a systemic risk and must be constrained or externalized.

63. **Global Nav Coupling (Architectural Fact)**
  * PoP navigation is globally defined in `baseof.html` and cannot be separated from pages without architectural refactor.
  * Local layout files affect prose only, not navigation.

64. **Low-Visibility Layout Files**
  * Certain Hugo layouts (e.g., `terms.html`, `list.html`) may appear inert due to low traffic, not misconfiguration.

65. **Lost-Pointer Failure Mode (Concrete)**
  * Minor syntactic changes (e.g., comments) can invalidate semantic references while leaving data intact.
  * This exemplifies indirection fragility: builds succeed, meaning collapses.

66. **Tool-Induced Cognitive Debt**
  * Static-site generators can impose hidden cognitive load that competes with domain expertise.
  * This debt must be explicitly bounded to protect primary research focus (QTP / PoP).

67. **Refactoring Strategy (One Bite at a Time)**
  * Large structural cleanups must proceed artifact-by-artifact.
  * Establish a trusted baseline, then simplify manually before requesting tightening.

68. **Navigation Debugging Priority**
  * When nav behavior changes, inspect `baseof.html` first.
  * Prose spacing changes belong in section or `_default` layouts only.

69. **Constraint Governance Reaffirmed**
  * Captures record assistant obligations and shared invariants, not transient troubleshooting notes.
  * Any change to capture structure or semantics requires explicit renegotiation.

70. **Blink-Comparator Hardening**
  - Wrapping inline template output (e.g., PoP dates) into a single semantic unit (such as `<span>`) restores blink-comparator reliability.
  - Prevents invisible whitespace or template-boundary semantics from leaking into behavior.
  - Formatting-only diffs remain truth-preserving.

71. **Ensemble ≠ History**
  - In IQT3, the classical ensemble is a quotient by indistinguishability, not a multiset of histories.
  - Probability emerges from symmetry after erasing identity, not from counting branches.
  - Aligns the QT3/IQT3 metaphor with quantum statistics rather than many-worlds intuition.
