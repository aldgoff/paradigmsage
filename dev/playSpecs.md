---
title: "Play Specs"
---

**Play Specs**

  Specify the objectives and features of the game.

## TODO
  1. POC: Have AI prove it can write python code which implements an interactive game on the web site.
  2. Canonical state string.
  3. Detects cyclic entanglements.
  4. A quantum board, doubled lines, labeled squares.
  5. Placement moves, pairs of X's and O's subscripted with the number of the move.
  6. Color coding of separate entanglements.
  7. Collapse spooky-marks to classical marks.
  8. Prohibits illegal moves.
  9. Prompts placement moves.
  10. Prompts collapse moves.
  11. Scores a completed game.
  12. The classical ensemble, classical board, classical marks.

  1. List of quantum moves with prev & next buttons.
  1. Selectable classical game, populates a classical listing.
  1. Standard buttons: Restart, Undo, Redo.

## TADONE
  0. 2/07/26 - Todo list.
  1. 2/08/26 - POC.
  2. 2/09/26 - Canonical state string.
  3. 2/12/26 - Detects cyclic entanglements.
  4. 2/12/26 - A quantum board, doubled lines, labeled squares.
  5. 2/13/26 - Placement moves, pairs of X's and O's subscripted with the number of the move.
  6. 2/13/26 - Color coding of separate entanglements.
  7. 2/14/26 - Collapse spooky-marks to classical marks.
  8. 2/15/26 - Prohibits illegal moves.
  9. 2/16/26 - Prompts placement moves.
  10. 2/16/26 - Prompts collapse moves.
  11. 2/18/26 - Scores a completed game.
  12. 2/22/26 - The classical ensemble, classical board, classical marks.

## Design & Specs
  Use the MVC design pattern.
  A single serializable human readable string shall specify both history and final state.

  X1+(1,2); O2+(2,5); X3+(5,1)[125]; O4!X3(5)@X1(1); O4+(6,9);
  X1+(1,2); O2+(2,5); X3+(1,5)[132]; O3@X3(5)!X1(1)!O2(2)!X3(5);  O4+(6,9); X5+(7
  - X's first placement move is in squares 1 & 2.
  - O's first placement move is in squares 2 & 5.
  - X's second placement move is in squares 5 & 1.
  - O collapses the cyclic entanglement so that X3 is in square 5.
  - She triggers the collapse at X1 into square 1.
  - O's second placement move is in squares 6 & 9.
  - X's next spooky mark is in square 7.

  This will even work for classical games, just no collapse or trigger moves.
  - X1(1,1); O2(2,2); X3(5,5); O4(6,6).

  Just one more issue, spooky-mark order.
  This 
  - (1,2)(2,5)(5,1) 
  
  makes the cyclic entanglement clearer than this
  - (1,2)(2,5)(1,5)

  While the later case would make string to string comparisons easier,
  those won't work anyway because of collapse ambiguites.
  Will need a dedicated comparison operator to see if two games are the same.

  Even worse, changing from click order to canonical order disrupts the 
  classical ensemble dup and tag metaphor, for the duplicted sets are no longer layout stable.
  Therefore, the canonical order will be supplanted with click order.

## Example Game Set
  This set of games captures the key phenonmenon that emerge from QT3.
  - Separable states
  - Entanglements
  - Cyclic entanglements
  - Stemmed cycles
  - Collapses
  - Wins and losses
  - Chronoblocks

  | Category and/or Description         | State String                            |
  | :---------------------------------- | :-------------------------------------- |
  | Superposition spooky marks          | X1+(1,2);                               |
  | Separable states                    | X1+(1,2); O2+(4,5);                     |
  | Maximum separable states            | X1+(1,3); O2+(7,9); X3+(4,6); O4+(2,8); |
  | Semi-entangle states                | X1+(1,2); O2+(2,5);                     |
  | Demi-entangle states                | X1+(1,3); O2+(3,9); X3+(7,9);           |
  | Min entangled cyclic state          | X1+(1,2); O2+(1,2)[12];                 |
  | Max entangled cyclic state          | X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(8,9); O6+(7,8); X7+(4,7); O8+(4,5); X9+(1,5)[198765432]; |
  | Early max number of cycles          | X1+(1,3); O2+(1,3)[12]; X3+(7,9); O4+(7,9)[34]; X5+(4,6); O6+(4,6)[56]; X7+(2,8); O8+(2,8)[78]; |
  | Late max number of cycles           | X1+(1,3); O2+(7,9); X3+(4,6); O4+(2,8); X5+(1,3)[15]; O6+(7,9)[26]; X7+(4,6)[37]; O8+(2,8)[48]; |
  |  |  |
  |  |  |
  |  |  |

## QT3 State String Spec
 ### General
  1. QT3 uses a **single, linear, human‑readable string** to encode both history and final state.
  2. The string is an **action transcript**, not a snapshot; it records player actions in order.
  3. There are two primary action types:
  - **Placement**: `[OX]n+(a,b)` places spooky‑marks for move *n* in squares *a* and *b*. (n, a, b in the set 1-9).
  - **Collapse**: `[OX]n@[OX]m(s)` collapses an existing cyclic entanglement, resolving move *m* into square *s*.
  4. Player X gets the odd turn numbers for placement moves, O the even numbers.
  5. Player O gets the odd turn numbers for collapse moves, X the even numbers
  6. The state string is intended to be:
  - editable by humans
  - stable under comparison
  - suitable for regression tests
  - sufficient to answer queries such as turn ownership, move count, and whether a collapse is required.

 ### Spooky
  1. The first half of a placement move.
  2. No semi colon, no second square, no comma, incomplete parenthesis.
  - `X1+(5`

 ### Placement
  1. Spooky‑mark square pairs in placement actions are written in **click order** `(first, second)`.
  - `X1+(5,4); `

 ### Loops
  1. **Loop annotations** are added using square brackets `[…]` immediately after the placement move that completes a cycle.
  1. Loop annotations list **move numbers**, not squares, and include stems (if any) using `|`.
  - `X7+(5,8)[475|36];`
  3. Loop annotations are **purely informational**; they are not used for rule enforcement.
  1. Canonical loop representation rules:
  - Only move numbers are listed.
  - Cycles are rotated so the **lowest move number appears first**.
  - Stems (after `|`) are sorted ascending.
  - Direction encodes a causal claim; it is ambiguous which direction the causality is in.
  5. Loop annotations indicate **chronoblock structure** (sequential, overlapping, nested) at a glance.

 ### Collapses
  1. Collapse actions immediately follow a placement action which resulted in a cyclic entanglement (loop).
  1. Collapse actions are **first‑class actions** and must appear explicitly in the string.
  1. Placement actions always reference the **current turn number**; collapse actions may reference **earlier moves**.
  1. The canonical form of a collapse references the **placement move that closed the cycle**, regardless of which spooky‑mark the player clicked.
  1. Player click intent during collapse is recorded as an **annotation**, separated by `@`, and has no effect on game semantics.
  - `O3@X3(5)!X1(1)!O2(2)!X3(5); `

 ### Degenerate last move
  1. If all squares have collapsed to classical values except one, the next placement move is **degenerate**.
  1. This is an edge case; both spooky marks must be placed in the same square.
  1. This is illegal in all other placement moves.
  1. This can only happen on move 9, and only to player X.
  1. It is immediately followed by a self-collapse, O does not get a collapse move.
  1. The list of collapsed moves(square) is a singleton, also a unique situation.
  - `X9+(5,5);  O9@X9(5)!X9(5); `

 ### Score
  1. When the game is over, a **score annotation** appears at the end of the transcript using curly braces `{}`.
  1. Score annotations record final outcomes as `{X=n, O=m}`, where values are limited to `{0, 0.5, 1, 1.5, 2.0}`.
  1. Score semantics:
  - `{X=0, O=0}`    : cat's game (draw)
  - `{X=1, O=0}`    : X wins
  - `{X=0, O=1}`    : O wins
  - `{X=1, O=0.5}`  : mixed wins (chronoblock overlap)
  - `{X=0.5, O=1}`  : mixed wins (chronoblock overlap)
  - `{X=1.5 O=0.0}` : double wins (possible for X only)
  - `{X=2.0 O=0.0}` : double wins (possible for X only)
  4. Decimal notation (e.g. `2.0`, `0.5`, `1.5`) is preferred to emphasize departures from classical tic-tac-toe.
  1. Score annotations are optional, terminal, and do not affect game semantics or replay; they summarize outcomes only.
  1. X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,6); X5+(6,9); O6+(7,8); X7+(4,6)[374|5]; O7@X3(4)O4(5)X5(9)X7(6); O8+(7,8)[68]; X8@O6(7)O8(8); X9+(2,3)[29|1]; O9@X9(2); {score}

 ### Classical Games
  1. Classical tic‑tac‑toe games are represented as QT3 transcripts with only placement actions and no collapse actions.

 ### MVC
  1. The model layer consumes only the **canonical content** of the string; annotations are for replay and visualization only.
  1. The view layer may visualize collapse propagation starting from any spooky‑mark without affecting the canonical transcript.
  1. The controller modifies the state string, passing the changed state to the model and view layers.

 ### String Comparisons
  1. Canonical comparison of QT3 strings ignores:
  - collapse annotations (`!…`)
  - loop annotations (`[…]`)

## Move Listings
 ### Quantum
  1. Quantum move listing should be easy...

    | # |    X    | # |    O    |
    | - | ------- | - | ------- |
    | 1 | 1 <<< 2 | 2 | 2 >>> 3 |
    | 3 | 4 <<< 5 | 4 | 5 <<< 6 |
    | 5 | 6 >>> 9 | 6 | 7 <<< 8 |
    | 7 | 4 >>> 6 | 8 | 7 >>> 8 |
    | 9 | 2 <<< 3 |   |{X=0,O=1}|

 ### Classical
  1. Classical move listing even easier.

    | # |  X  | # |  O  |
    | - | --- | - | --- |
    | 1 |  1  | 2 |  3  |
    | 3 |  4  | 4 |  5  |
    | 5 |  9  | 6 |  7  |
    | 7 |  6  | 8 |  8  |
    | 9 |  2  |   | {O} |

## MVC specs:
  The controller reasons about time, the view reasons about space, and the model reasons about truth.

### Model
  The state string is the canonical representation of both history and state.
  Almost all logic lives in this layer.

### View
  Two modes:
  1. Update view to match passed in state string (new state).
    - It is cheap enough to draw from scratch.
  2. Update view to match a different point on the existing state string interpreted as history.
  Some logic:
  - When it adds a visual element that is clickable, it has to update the canvas?
  - Ditto when it deletes a visual element.
  Class;
    - The View should be a base class.
    - Daughter classes instantiate different visual behaviors.
    - Behavior:
  `view.render({
    stateString,
    cursorIndex,
    modeFlags
    });`

### Controller
  Responds to clicks from the canvas and strokes from the keyboard.
  Issues commands to the View.
  1. Update state string (new move added).
  1. Load new state string.
  1. New Game (empty state string).
  1. Rerun game.
  1. Undo last move (limit: zeroth move).
  1. Redo next move (limit: number of moves).
  Edits the state string (generally additions only, but undo, branch, etc., are exceptions).

### Transitions
  Transition {
    fromState
    toState
    phases[]   // ordered, reversible micro-steps
  }

  State is conserved achievement; transition is experiential process.

  Status messages:
  - "Welcome to quantum tic-tac-toe (QT3).'
  - "X moves first, a placement move; click in two squares."
  - `${player}: place first spooky mark (click on it again to change your mind.)`
  - `${player}: place second spooky mark (commits to the move).`
  - "Second spooky mark must be in a different square (unless only one uncollapsed square left.)"
  - `${collapsePlayer} needs to make a collapse move - select one purple spooky mark.`
  - "That square has collapsed. Choose another."
  - "Game is over. New Game, Restart, Undo."

## Placements Array...
  placements: (3) [{…}, {…}, ..., {…}]
  1. move: 1 player: "X" squares: (2) [4, 5][[Prototype]]: Object
  1. move: 2 player: "O" squares: (2) [5, 6][[Prototype]]: Object
  2. move: 3 player: "X" squares: (2) [5, 4][[Prototype]]: Objectlength: 3[[Prototype]]: Array(0)

