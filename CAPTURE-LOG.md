# Capture Log (for Chat Transfer)

## 1. Debugging invariant (Hugo):
  Always verify layout resolution (type / kind / render path) before debugging templates, navs, or partials.

## 2. Debugging method preference:
  Instrument first to observe runtime truth, then modify code — no trial-and-error patching.

## 3. Navigation state (initial):
  PoP (serial content) navigation is stable and working; QT3 (instrument content) navigation was broken and investigated next.

## 4. Capture protocol clarification:
  Captures are for what the assistant must remember, not reminders of user responsibility.

## 5. Capture format decision:
  Captures are to be maintained as a linear list, not grouped or structured, unless explicitly renegotiated later.

## 6. Capture governance process:
  On a new chat, the user may provide the capture log and request an assessment (drift, conflict, speed, etc.).
  Condensation is optional, iterative, and only done after explicit agreement.

## 7. Staging strategy (PoP):
  Use git branching (not Hugo dates) to stage PoP content; validate locally; merge to main on publication date.

## 8. Sentinel branch convention:
  Create an initial PoP sentinel branch (pop-staging-01) early to anchor sequencing and avoid ambiguity about “missing” branches.

## 9. Branch naming convention:
  Use short, purpose-driven branch names like pop-staging-02; do not encode Word document version numbers into branch names.

## 10. Version provenance tracking:
  Track Word-source provenance in Markdown front matter using a source: block (format, id, version).

## 11. README purpose:
  README.md is acceptable and preferred as a human-facing capture document for intent, workflow, and growth of the site; it does not conflict with Hugo.

## 12. Hugo behavior (future dates):
  Hugo hides future-dated content from navigation unless run with --buildFuture.

## 13. Publication preview rule:
  During staging, Hugo is run with --buildFuture so future-dated PoP content appears in nav for validation.

## 14. Commit vs merge distinction (workflow):
  Commit stabilizes a branch; merge promotes it.
  Staging branches should be committed and pushed before any merge to main.

## 15. Staging commit hygiene:
  Do not commit debug instrumentation, provisional CSS, or unsettled architectural changes to staging branches.

## 16. Goldmark configuration decision:
  Enabling goldmark.extensions.table = true is a global semantic prerequisite and should be committed.

## 17. Deferred items (explicitly not committed in pop-staging-02):
  - layouts/_default/baseof.html (architectural, unsettled)
  - static/css/site.css (cosmetic, provisional)

## 18. CLI preference under complexity:
  Use git CLI for commit/push when VS Code behavior around unstaged files becomes confusing.

## 19. New-branch push rule:
  A new local branch appears on GitHub only after git push -u origin <branch>.

## 20. Tech-debt management insight:
  Infrastructure and cognitive tech debt must be indexed, not fixed immediately; otherwise it becomes invisible and corrosive.
  