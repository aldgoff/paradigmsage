# Navigation Invariants and Failure Modes (PoP Site)

This document defines the **non-negotiable navigation invariants** and known **failure modes** for the ParadigmSage website. It is intended to be copyable, portable, and reusable as a charter for any nav-related work.

---

## Navigation Invariants (What Must Always Be True)

### 1. PoP Is the Primary Spine

* PoP chapters define the canonical reading order.
* PoP navigation is serial, unambiguous, and stable.
* Supporting material must never outrank or interrupt PoP.

> If a reader is lost, PoP is always the answer to “what should I read next?”

---

### 2. Navigation Axes Are Orthogonal

The site contains multiple conceptual axes:

* Topic (PoP, QT3, QTP, etc.)
* Navigation mode (serial vs analytic)
* Typography (expansive vs condensed)

**Invariant:** No nav element may implicitly entangle more than one axis.

---

### 3. Activation Is Demand-Driven

* Supporting material appears in navigation only after a PoP chapter demands it.
* Presence in `content/` does not imply nav visibility.

> Navigation reflects semantic readiness, not file existence.

---

### 4. Serial ≠ Hierarchical

* PoP is serial, not a tree.
* Next/Previous links are stronger signals than menus.
* Breadcrumbs must not imply false containment.

---

### 5. Navigation Must Be Boring

* Navigation is not a place for cleverness or metaphor.
* Predictability is prioritized over elegance.

> Epiphanies belong in content, not in navigation.

---

### 6. Local Context Beats Global Menus

* PoP chapters must show PoP navigation in context.
* Supporting material links should be contextual, not global.

---

## Navigation Failure Modes (What Must Be Prevented)

### F1. Implicit Hugo Coupling

* Letting Hugo defaults silently define navigation meaning.
* Always verify layout resolution (type/kind/render path) before debugging templates.

---

### F2. Premature Surface Area

* Exposing QT3 or deep material in nav before PoP earns it.

---

### F3. False Symmetry

* Treating PoP, QT3, QTP, etc. as peers in navigation.

---

### F4. Temporal Ambiguity

* Future-dated PoP chapters missing or inconsistently visible.
* Navigation must be validated under `--buildFuture`.

---

### F5. CSS / Layout Leakage

* Typography or styling choices affecting nav semantics.

---

### F6. Branch Blindness

* Making nav changes casually on content branches.
* Nav work must live on its own branch.

---

## Definition of Done (Nav)

Navigation is considered complete when:

1. A new reader identifies PoP as the spine in under 5 seconds.
2. PoP chapters can be read linearly without confusion.
3. Supporting material appears only when relevant.
4. Adding PoP chapters requires no nav changes.
5. Adding supporting work requires no PoP nav changes.
6. You stop thinking about navigation while writing content.
