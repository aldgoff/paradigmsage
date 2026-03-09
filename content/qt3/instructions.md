---
title: "Instructions"
---

**Instructions**

## Rules
  There are two players:
  - X moves first, his spooky marks are subscripted with *odd* integers.
  - O moves second, her spooky marks are subscripted with *even* integers.

  There are two types of moves:
  - Placement moves: click in two squares to place a pair of spooky marks.
  - Collapse moves; click on a spooky mark on the loop (purple) to collapse that move to that square.
    - The other player makes the collapse selection.
    - All moves entangled with that one will also collapse to classical positions.

  Restrictions
  - Spooky marks may be placed in any uncollapsed square.
  - Game is over when either all squares are classical or there is one or more 3-rows of classical marks.

## Play Interface
  Play:
  - Click in two squares to make a *placement* move.
    - A partial placement move (a *spooky* move) can be retracted by clicking again.
  - Placement moves which share squares are *entangled*.
    - Each entanglement is displayed in a different color (red, green, blue).
  - Upon a cyclic entanglement, click on a purple spooky mark to make a *collapse* move.

  Listings:
  - The *list of quantum moves* will update automatically.
    - It populates sequentially.
  - The *list of classical moves* will update automatically.
    - Note that it populates only when moves collapse to classical values.

  State string (human/machine readable):
  - A human readable state string will grow in the editable box below the board.
  - The classical ensemble will grow with each placement move.
  - Use this box to save or load games (copy; or paste, then hit the load button).

  Classical Ensemble:
  - Placement moves which share squares result in classical realities *pruned* from the ensemble by *contradiction*.
  - Collapse moves will be *pruned* from the ensemble by *choice*, but highlited in yellow for reference.

  Buttons:
  - Typical mix of game buttons.
  - Keyboard shortcuts for the buttons are indicated with underscores.
  
## Illustrative Games
  Copy and paste into the state string box (black edit box below the QT3 board), then load.

  | Feature             | Game                                                             |
  | :------------------ | :--------------------------------------------------------------- |
  | Spooky marks        | X1+(1,2); O2+(5                                                  |
  | Entanglement        | X1+(1,2); O2+(5,2);                                              |
  | Cyclic entanglement | X1+(1,2); O2+(2,3); X3+(3,1)[132];                               |
  | With stems          | X1+(1,2); O2+(2,3); X3+(3,2)[23|1];                              |
  | Collapse            | X1+(1,2); O2+(2,3); X3+(3,2)[23|1]; O3@O2(3)!X1(1)!O2(3)!X3(2);  |
  | Max collapses       | X1+(1,2); O2+(2,1)[12]; X2@X1(1)!X1(1)!O2(2); X3+(4,5); O4+(5,4)[34]; X4@O4(4)!X3(5)!O4(4); X5+(7,8); O6+(8,7)[56]; X6@X5(7)!X5(7)!O6(8); X7+(3,6); O8+(6,3)[78]; X8@O8(3)!X7(6)!O8(3); |
  | Max entanglements   | X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,6); X5+(7,8); O6+(8,9);                                                                                         |
  | Long stems          | X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(8,9); O6+(7,8); X7+(4,7); O8+(7,8)[68|123457];                                                          |
  | Chronoblocks        | X1+(1,2); O2+(4,5); X3+(5,4)[23]; O3@O2(4)!O2(4)!X3(5); O4+(3,6); X5+(9,8); O6+(8,7); X7+(7,8)[67|5]; O7@O6(7)!X5(9)!O6(7)!X7(8);                   |
  | Degenerate          | X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(9,8); O6+(8,7); X7+(7,4); O8+(4,1)[18765432]; X8@X1(1)!X1(1)!O2(2)!X3(3)!O4(6)!X5(9)!O6(8)!X7(7)!O8(4); |
  | Shared wins         | X1+(1,2); O2+(4,5); X3+(2,3); O4+(5,6); X5+(3,6); O6+(1,4)[135426]; X6@O6(4)!X1(1)!O2(5)!X3(2)!O4(6)!X5(3)!O6(4); {X=1, O=0.5}                      |
  | Dual wins           | X1+(1,2); O2+(2,3); X3+(3,6); O4+(6,9); X5+(9,8); O6+(8,7); X7+(7,4); O8+(4,5); X9+(5,1)[198765432]; O9@X9(5)!X1(1)!O2(2)!X3(3)!O4(6)!X5(9)!O6(8)!X7(7)!O8(4)!X9(5); {X=2, O=0} |

  
## My Favorite Game
  - Load this up, then look at the classical ensemble.

    ```X1+(2,5); O2+(1,5); X3+(3,5); O4+(4,5); X5+(6,5); O6+(7,5); X7+(9,5); ```

  - Note that by move 7, X has a win in the 3rd column in 5 of the 8 classical games.
  - O needs to make a play that makes all five of these realities self-contradictory,
  so they are *pruned* from the classical ensemble by *contradiction*.
  - Here is one of three moves (move 8 of the game) that accomplishes that objective.

      ```O8+(3,6)[358|12467];```

  - While X gets to collapse this cyclic entanglement, note that neither of his choices prevent O from winning.

      ```X8@O8(6)!X1(2)!O2(1)!X3(3)!O4(4)!X5(5)!O6(7)!X7(9)!O8(6); {X=0, O=1}```
      ```X8@O8(3)!X1(2)!O2(1)!X3(5)!O4(4)!X5(6)!O6(7)!X7(9)!O8(3); {X=0, O=1}```

  - O wins by attacking X's past.
  - And that is not even the best part; his wins would have been on move 7, but hers occur on move 6.
    - Moves 2, 4, 6, in the first column.

  So let's review. At timestep 7, we detected an unfavorable outcome,
  took action after that, at timestep 8, to make the bad thing never happen,
  replacing it at timestep 6, *before it never happened*, with an outcome favorable to us.
  Note the creative use of tense.

  Practical, paradox free time travel.

