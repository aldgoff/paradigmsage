---
title: "Play"
---

**Play**

  An implementation of QT3.
  This is where the Intrepid Reader can interact with a playable version of QT3.

  Ask your own questions of the game.

**Demo**

Copy this *state string*

`X1+(1,2); O2+(2,3); X3+(3,1)[132]; O3@X1(1)!X1(1)!O2(2)!X3(3); O4+(4,5); X5+(4,6); O6+(4,6)[56|4]; X6@X5(4)!O4(5)!X5(4)!O6(6); X7+(7,8); O8+(8,7)[78]; X8@X7(7)!X7(7)!O8(8); {X=1,O=0.5}`

and paste it into the state box (black edit box below). 
Then hit the *load* button and the *rerun* button.
Then re-run the game by using the *redo* button.
A *placement move* requires a pair of *spooky marks*.
A *cyclic entanglement* forces a choice, a *collapse move*.
Note how the quantum and classical listings differ.
Note how the *classical ensemble* grows (x2), but also how it shrinks;
*pruned by contradiction* (gray) and *pruned by collapse* (yellow.)

## The QT3 Game
  <canvas id="qt3-game" width="900" height="2230"></canvas>
  <textarea id="qt3-state-input"></textarea>  <!-- hello state string. -->



<!-- Comments in markdown.
  ## Proof of Concept - JS in a Canvas, state changes via mouse clicks.
    <canvas id="qt3-demo" width="200" height="100"></canvas>
    <script type="module" src="/paradigmsage/qt3/poc/poc.js"></script>
-->

