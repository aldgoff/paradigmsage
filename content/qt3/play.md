---
title: "Play"
---

**Play (inwork)**

  An implementation of QT3.
  This is where the Intrepid Reader can interact with a playable version of QT3.

  Ask your own questions of the game.

## Some Interesting Games:
  Copy and paste into the state string box (black edit box below the QT3 board),
  then hit load. Keyboard shortcuts for the buttons are indicated with underscores.

  <!-- Fractal patterns in the classical ensemble:
  - X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,6); X5+(7,8); O6+(8,9);

  Max collapses:
  - X1+(1,2); O2+(1,2)[12]; X2@X1(1)!X1(1)!O2(2); X3+(4,5); O4+(4,5)[34]; X4@O4(4)!X3(5)!O4(4); X5+(7,8); O6+(7,8)[56]; X6@X5(7)!X5(7)!O6(8); X7+(3,6); O8+(3,6)[78]; X8@O8(3)!X7(6)!O8(3);

  Shared wins:
  - X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(3,6); O6+(1,4)[162453]; X6@O6(4)!X1(1)!O2(5)!X3(2)!O4(6)!X5(3)!O6(4); {X-1, O-0.5}

  Collapse with stems:
  - X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(8,9); O6+(7,8); X7+(4,7); O8+(7,8)[68|123457]; 

  Degenerate collapse: (last move self collapses in square 5)
  - X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(8,9); O6+(7,8); X7+(4,7); O8+(1,4)[18765432]; X8@X1(2)!X1(2)!O2(3)!X3(6)!O4(9)!X5(8)!O6(7)!X7(4)!O8(1); 

  Dual wins:
  - X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(8,9); O6+(7,8); X7+(4,7); O8+(4,5); X9+(1,5)[198765432]; O9@X9(5)!X1(1)!O2(2)!X3(3)!O4(6)!X5(9)!O6(8)!X7(7)!O8(4)!X9(5); {X-2, O-0}
  -->

| Feature       | Game |
| :------------ | :--- |
| Fractals      | X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,6); X5+(7,8); O6+(8,9); |
| Stems         | X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(8,9); O6+(7,8); X7+(4,7); O8+(7,8)[68\|123457]; |
| Shared wins   | X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(3,6); O6+(1,4)[162453]; X6@O6(4)!X1(1)!O2(5)!X3(2)!O4(6)!X5(3)!O6(4); {X=1, O=0.5} |

<!-- | Max collapses | X1+(1,2); O2+(1,2)[12]; X2@X1(1)!X1(1)!O2(2); X3+(4,5); O4+(4,5)[34]; X4@O4(4)!X3(5)!O4(4); X5+(7,8); O6+(7,8)[56]; X6@X5(7)!X5(7)!O6(8); X7+(3,6); O8+(3,6)[78]; X8@O8(3)!X7(6)!O8(3); -->
<!-- | Degenerate    | X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(8,9); O6+(7,8); X7+(4,7); O8+(1,4)[18765432]; X8@X1(2)!X1(2)!O2(3)!X3(6)!O4(9)!X5(8)!O6(7)!X7(4)!O8(1); 
| Dual wins     | X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(8,9); O6+(7,8); X7+(4,7); O8+(4,5); X9+(1,5)[198765432]; O9@X9(5)!X1(1)!O2(2)!X3(3)!O4(6)!X5(9)!O6(8)!X7(7)!O8(4)!X9(5); {X-2, O-0} -->

## The QT3 Game - inwork...
  <canvas id="qt3-game" width="900" height="2230"></canvas>
  <textarea id="qt3-state-input"></textarea>  <!-- hello state string. -->

<!-- ## Tadone:
  - Can place spooky marks in the QT3 board.
  - State string.
  - Colored entanglements.
  - Loop detection.
  - Collapse selection.
  - Status string.
  - Quantum listing.
  - Classical listing.
  - Classical ensemble.
  - Pruning by contradiction.
  - Pruning by collapse.
  - Load working... -->

## Todo:
  - Add in the Rerun, Undo and Redo functionality.

<!-- Comments in markdown.
  ## Proof of Concept - JS in a Canvas, state changes via mouse clicks.
    <canvas id="qt3-demo" width="200" height="100"></canvas>
    <script type="module" src="/paradigmsage/qt3/poc/poc.js"></script>
-->

