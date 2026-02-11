---
title: "Play"
---

**Play**

Place holder for playable version of QT3, to include the classical ensemble.
This is where the Intrepid Reader can (soon) interact with a playable version of QT3.
Ask your own questions of the game.

## TODO
  1. POC: Have AI prove it can write python code which implements an interactive game on the web site.
  1. Canonical state string.
  1. A quantum board, doubled lines, labeled squares.
  1. Placement moves, pairs of X's and O's subscripted with the number of the move.
  1. List of quantum moves with prev & next buttons.
  1. The classical ensemble, classical board, classical marks.
  1. Selectable classical game, populates a classical listing.
  1. Prompts placement moves.
  1. Prohibits illegal moves.
  1. Color coding of separate entanglements.
  1. Detects cyclic entanglements.
  1. Prompts collapse moves.
  1. Collapse spooky-marks to classical marks.
  1. Standard buttons: Start, Undo, Redo.
  1. Scores a completed game.

## TADONE
  0. 2/7/26 - Todo list.
  1. 2/8/26 - POC.
  1. 2/9/26 - Canonical state string.


## Design & Specs
  Use the MVC design pattern.
  A single serializable human readable string shall specify both history and final state.

  X1+(1,2); O2+(2,5); X3+(5,1); O4!X3(5)@X1(1); O4+(6,9);
  - X's first placement move is in squares 1 & 2.
  - O's first placement move is in squares 2 & 5.
  - X's second placement move is in squares 5 & 1.
  - O collapses the cyclic entanglement so that X3 is in square 5.
  - She triggers the collapse at X1 into square 1.
  - O's second placement move is in squares 6 & 9.

  This will even work for classical games, just no collapse or trigger moves.
  - X1(1); O2(2); X3(5); O4(6).

  Just one more issue, spooky-mark order.
  This 
  - (1,2)(2,5)(5,1) 
  
  makes the cyclic entanglement clearer than this
  - (1,2)(2,5)(1,5)

  but the later case is more canonical, lowest number square first.

  Ok here is a complete game:
  - X1+(1,2); O2+(2,5); X3+(5,1)[125]; O4!X3(5)@X1(1); 
  O4+(6,9); X5+(3,9); O6+(3,7); X7+(7,8); O8+(6,8)[3786|9]; X9!O8(6)@O4(9); X9+(4,4); X9!(4)[4]

  Still need final score.

## QT3 State String – Draft Spec (Draft)

1. QT3 uses a **single, linear, human‑readable string** to encode both history and final state.

2. The string is an **action transcript**, not a snapshot; it records player actions in order.

3. There are two primary action types:
   * **Placement**: `Xn+(a,b)` places spooky‑marks for move *n* in squares *a* and *b*.
   * **Collapse**: `On!Xm(s)` collapses an existing cyclic entanglement, resolving move *m* into square *s*.

4. Each turn number *n* belongs to exactly one player (X odd, O even) and may contain:
   * zero or one collapse action, followed by
   * exactly one placement action (unless the game ends).

5. Collapse actions always precede placement actions within the same turn.

6. Collapse actions are **first‑class actions** and must appear explicitly in the string.

7. Placement actions always reference the **current turn number**; collapse actions may reference **earlier moves**.

8. The canonical form of a collapse references the **placement move that closed the cycle**, regardless of which spooky‑mark the player clicked.

9. Player click intent during collapse is recorded as an **annotation**, separated by `@`, and has no effect on game semantics.
   * Example: `O4!X3(5)@X1(1)`

10. Annotations (`@…`) are optional, ignorable, and must not affect parsing, comparison, or game logic.

11. Optional **loop annotations** may be added using square brackets `[…]` immediately after the placement move that completes a cycle.

12. Loop annotations list **move numbers**, not squares, and may optionally include stems using `|`.
  * Example: `[4658|7]`

13. Loop annotations are **purely informational**; they are not used for rule enforcement.

14. Canonical loop representation rules:
  * Only move numbers are listed.
  * Cycles are rotated so the **lowest move number appears first**.
  * Stems (after `|`) are sorted ascending.
  * Direction encodes no causal claim; causality is inferred from the surrounding transcript.

15. Loop annotations indicate **chronoblock structure** (sequential, overlapping, nested) at a glance.

16. Spooky‑mark square pairs in placement actions are written in **canonical order** `(min,max)`.

17. Canonical comparison of QT3 strings ignores:
  * annotations (`@…`)
  * loop annotations (`[…]`)

18. The model layer consumes only the **canonical content** of the string; annotations are for replay and visualization only.

19. The view/controller layer may visualize collapse propagation starting from any spooky‑mark without affecting the canonical transcript.

20. Classical tic‑tac‑toe games are represented as QT3 transcripts with only placement actions and no collapse actions.

21. The state string is intended to be:
  * editable by humans
  * stable under comparison
  * suitable for regression tests
  * sufficient to answer queries such as turn ownership, move count, and whether a collapse is required.

22. An optional **score annotation** may appear at the end of the transcript using curly braces `{}`.

23. Score annotations record final outcomes as `{Xn,Om}`, where values are limited to `{0, 0.5, 1.0, 1.5, 2.0}`.

24. Score semantics:
  * `{X0,O0}` : cat's game (draw)
  * `{X1,O0}` : X wins
  * `{X0,O1}` : O wins
  * `{X1,O0.5}` or `{X0.5,O1}` : mixed win (chronoblock overlap)
  * `{X2.0,O0}` : double win (possible for X only)

25. Decimal notation (e.g. `2.0`, `0.5`, `1.5`) is preferred to emphasize departures from classical tic-tac-toe.

26. Score annotations are optional, terminal, and do not affect game semantics or replay; they summarize outcomes only.


## MVC specs:
  The controller reasons about time, the view reasons about space, and the model reasons about truth.

  ### Model
    For the moment this is pretty much just the state string, see above.

  ### View
    Two modes:
    1. Update view to match passed in state string (new state).
      - We don't want to draw from scratch, but from the previous state.
    2. Update view to match a different point on the existing state string interpreted as history.
    Some logic:
    - When it adds a visual element that is clickable, it has to update the canvas?
    - Ditto when it deletes a visual element.
    Class;
      - The View should be a base class.
      - Daughter classes instantiate different visual behaviors.
    Behavior:
      view.render({
        stateString,
        cursorIndex,
        modeFlags
        });

  ### Controller
    Responds to clicks from the canvas and strokes from the keyboard.
    Issues commands to the View (just two?)
    Edits the state string (generally additions only, but undo, branch, etc., may be exceptions).
    Almost all logic lives in this layer.

  ### Transitions
    Transition {
      fromState
      toState
      phases[]   // ordered, reversible micro-steps
    }

    State is conserved achievement; transition is experiential process.


## Proof of Concept - JS in a Canvas, state changes via mouse clicks.
  <!-- 
  -->
  <canvas id="qt3-demo" width="200" height="100"></canvas>
  <script type="module" src="/paradigmsage/qt3/poc/poc.js"></script>

## The QT3 Game - inwork...
  <canvas id="qt3-game" width="900" height="900"></canvas>
  <!-- Entry URL, update (vN) when page fails to update because of ES caching. -->
  <script type="module" src="/paradigmsage/qt3/js/main.js?v15"></script>

## Regressionsn tests - inwork...
  <script type="module" src="/paradigmsage/qt3/js/tests/addPlacementMove.test.js"></script>
  <script type="module" src="/paradigmsage/qt3/js/tests/addCollapseMove.test.js"></script>
  <script type="module" src="/paradigmsage/qt3/js/tests/insertLoop.test.js"></script>
  <script type="module" src="/paradigmsage/qt3/js/tests/addScore.test.js"></script>
  <script type="module" src="/paradigmsage/qt3/js/tests/classicalT3.test.js"></script>

