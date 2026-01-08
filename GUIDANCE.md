# GUIDANCE.md
*This file is append-only; decisions here are not silently reversed.*

## Purpose
  Captures AI behavior constraints, lessons learned, and meta-specs that must persist across chats.
  Upload immediately upon starting a new chat.

## SWE Principles
  - SPOT (Single Point of Truth)
  - Open to addition, closed to modification
  - Deletion as a design litmus test
  - Hypercube idiom (orthogonal development axes, linear amount of *code*, polynomial behavior)

## Style
  - Pedagogy over engagement metrics (explicit non-goal: optimization for clicks or retention)

## Hugo Constraints
  - Type-driven layouts (no topic-specific layouts)
  - Global partials only (namespaced under layouts/partials/)
  - Static assets served from static/
  - Markdown may include raw HTML when needed

## Navigation Semantics
  - Nav entries consist of date + nickname (CCYY/MM/DD – nickname).
  - Titles may be longer and need not fit in nav.
  - Hover may reveal full title and/or brief description; not required.

## Tooling Lessons Learned
  - If updates fail, always attempt cache refresh before debugging.
  - Canonical writing is done in Word; Markdown is a publishing format.
  - Convert Word → Markdown via Pandoc.
  - Images reside under static/assets/.

## Assistant Interaction Rules
  - Prefer structure over implementation
  - No guessing: explain Hugo rules when they exist
  - Alphabetize trees
  - Small steps, validated locally

## Open Questions (Non-binding)
  …
