# Capture Log (for Chat Transfer)

1. **Debugging invariant (Hugo):**
   Always verify layout resolution (type / kind / render path) before debugging templates, navs, or partials.

2. **Debugging method preference:**
   Instrument first to observe runtime truth, then modify code — no trial-and-error patching.

3. **Navigation state (initial):**
   PoP (serial content) navigation is stable and working; QT3 (instrument content) navigation was broken and investigated next.

4. **Capture protocol clarification:**
   Captures are for what the assistant must remember, not reminders of user responsibility.

5. **Capture format decision:**
   Captures are to be maintained as a linear list, not grouped or structured, unless explicitly renegotiated later.

6. **Capture governance process:**
   On a new chat, the user may provide the capture log and request an assessment (drift, conflict, speed, etc.). Condensation is optional, iterative, and only done after explicit agreement.

7. **Staging strategy (PoP):**
   Use git branching (not Hugo dates) to stage PoP content; validate locally; merge to main on publication date.

8. **Sentinel branch convention:**
   Create an initial PoP sentinel branch (pop-staging-01) early to anchor sequencing and avoid ambiguity about “missing” branches.

9. **Branch naming convention:**
   Use short, purpose-driven branch names like pop-staging-02; do not encode Word document version numbers into branch names.

10. **Version provenance tracking:**
    Track Word/PDF source provenance in Markdown front matter using a dedicated metadata block when needed.

11. **README purpose:**
    README.md is acceptable and preferred as a human-facing capture document for intent, workflow, and growth of the site; it does not conflict with Hugo.

12. **Hugo behavior (future dates):**
    Hugo hides future-dated content from navigation unless run with --buildFuture.

13. **Publication preview rule:**
    During staging, Hugo is run with --buildFuture so future-dated PoP content appears in nav for validation.

14. **Commit vs merge distinction (workflow):**
    Commit stabilizes a branch; merge promotes it. Staging branches should be committed and pushed before any merge to main.

15. **Staging commit hygiene:**
    Do not commit debug instrumentation, provisional CSS, or unsettled architectural changes to staging branches.

16. **Goldmark configuration decision:**
    Enabling goldmark.extensions.table = true is a global semantic prerequisite and should be committed.

17. **Deferred items (explicit tech debt):**

    * Layout unification between _default and serial
    * Separation of nav axis from typography axis
    * Removal of inline layout styles into a single invariant

18. **CLI preference under complexity:**
    Use git CLI for commit/push when VS Code behavior around unstaged files becomes confusing.

19. **New-branch push rule:**
    A new local branch appears on GitHub only after `git push -u origin <branch>`.

20. **Tech-debt management insight:**
    Infrastructure and cognitive tech debt must be indexed, not fixed immediately; otherwise it becomes invisible and corrosive.

21. **Hypercube architecture (current):**
    Site architecture is modeled as orthogonal axes:

    * Topics (PoP, QTP, QT3, 3DC, etc.)
    * Navigation (serial, analytic)
    * Typography (expansive, condensed)

22. **PoP publishing strategy (revised):**
    PoP chapters are PDF-first. Markdown pages act as portals containing portent, document links (discourse + chapter), and significance, not full chapter text.

23. **PDF asset convention (PoP):**
    PDFs live under `static/assets/pop/pdf/` with no spaces in filenames.

24. **Merge semantics insight:**
    Fast-forward merges record work history; explicit merge commits or empty commits record architectural decisions. Use `--no-ff` or `--allow-empty` commits when the process matters.

25. **GitHub Pages operational model:**
    GitHub Actions is authoritative for Hugo build and Pages deploy. CDN propagation is asynchronous; transient inconsistencies are expected post-deploy.

26. **Operational invariant (Pages):**
    Never push fixes during deploy wobble. Wait for Actions completion, then allow time for CDN propagation before diagnosing.

27. **Tooling insight:**
    GitHub Actions UI provides reliable visibility into build/deploy progress; the Pages UI spinner may lag or fail to update even after completion.

28. **Navigation architecture decision (Gate 2):**
    Topic expansion is governed by a site-local activation state. PoP and topics must not encode knowledge of each other; integration is editorial and site-specific (O(N) coupling, not O(N²)).

29. **Navigation architecture correction (PoP sovereignty):**
    Traversal mode (“serial”) must not be encoded as content identity (type). PoP pages are rendered by section-based layouts, and navigation ranges over sibling pages via .CurrentSection.Pages, ensuring correct active-state highlighting and preserving orthogonal hypercube axes.

30. **Git workflow invariant (merge semantics):** 
    All branch merges must use --no-ff. 
    Fast-forward merges are disallowed so that merges remain visually explicit in history and serve as semantic landmarks. 
    When discussing or performing a merge, explicitly verify non-fast-forward behavior.
    
31. **Hugo analytics invariant:**
    Hugo can validate analytics semantics locally (injection, execution, payload), but can never validate endpoint viability; transport must be mocked or external.

32. **Static-site stats rule:**
    Static sites can emit signals, but can never receive them. Any stats receiver must live outside Hugo/GitHub Pages.

33. **Editor context:**
    Primary editor is VS Code; user is also comfortable with vi. Instructions may assume either, defaulting to VS Code when practical and CLI/vi-safe when necessary.

34. **Hugo taxonomy foot-gun:**
    An explicit empty `[taxonomies]` block combined with `disableKinds = ["taxonomy", "taxonomyTerm"]` alters Hugo’s internal page graph and can silently break `.CurrentSection.Pages` navigation. If taxonomies are unused, do not declare `[taxonomies]`.

35. **GitHub Pages + dated content invariant:**
    GitHub Pages does not rebuild on date rollover. Future-dated Hugo content requires a post-date commit to trigger p

36. **Comic Usage as Epistemic Portents**
  Comics in *Paradigm of Paradox* are not illustrations or decoration. They function as epistemic portents: pre-formal devices that train reader attention toward self-reference, incongruity, and framing failure before technical discussion begins.

37. **Self-Reference as a Primary Explanatory Resource**
  The project treats self-reference as ubiquitous, intuitively detected (often via humor), and systematically excluded from formal physics. Intuitive recognition of self-reference precedes formal articulation, and confronting it explicitly is necessary to address the quantum measurement problem.

38. **Formalization Limits as Signal**
  Attempts to fully formalize or translate intuitive artifacts (e.g., humor, comics, recognition-based alignment) may degrade their function. Such failures are informative and should be preserved as epistemic artifacts rather than erased.

39. **Assistant Evaluation Boundary**
  Comic selection is recognitional rather than rule-based. The assistant can evaluate alignment, redundancy, and epistemic function of proposed comics, but cannot originate or replace the author’s recognition of conceptual fit.
