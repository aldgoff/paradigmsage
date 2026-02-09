---
title: "Play"
---

**Play**

Place holder for playable version of QT3, to include the classical ensemble.
This is where the Intrepid Reader can (soon) interact with a playable version of QT3.
Ask your own questions of the game.

## TODO
  1. Have AI prove it can write python code which implements an interactive game on the web site.
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
  1. 2/7/26 - Todo list.
  1. 2/8/26 - POC.

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


## Bring up the Game
<canvas id="qt3-demo" width="200" height="100"></canvas>

<script type="module" src="/paradigmsage/qt3/poc/poc.js"></script>

