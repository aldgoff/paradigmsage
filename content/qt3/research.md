---
title: "Research"
---

**Research**

## History
  At the time of the original publication of qt3, it was known that the 
  maximum number of simultaneous classical games was limited to 27.
  Thus the SW only allowed space for 27 games in the classical ensemble.

  In building this version, it became clear that there where a total of 512
  possible *configuration* locations for those classical games.
  That invites a question - are they all accessible?

## Rearch Question - Accessibility
  Is it possible to reach each and every configuration location?
  When a 9 move quantum game is over, and there is only one classical
  game left in the classical ensemble, are there any configuration
  locations which cannot be reached?

  The number of possible quantum games is just 9! (362,880) possible games.
  There are only 512 configuration locations.
  Surely, everyone of them is reachable...right?

## Change the Problem
  A powerful technique to complex problems is to start by changing the problem.
  In this case, the shortest possible tic-tac-toe games occur in just 5 moves.
  That is just 32 configuration locations. We start our attack on this problem there.

## 5 Moves, 32 Configurations
```
| Game                                                                                                          | Configuration (rox x col) |
| : ----------------------------------------------------------------------------------------------------------- | :------------------------ |
| X1+(1,2) | 4,1; 4,3; 4,4 |
| X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,4)[34]; X4@O4(4)!X3(5)!O4(4); X5+(1,3)[125]; O5@X5(1)!X1(2)!O2(3)!X5(1);  | 4,4;      |
| X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,4)[34]; X4@O4(4)!X3(5)!O4(4); X5+(1,3)[125]; O5@X1(1)!X1(1)!O2(2)!X5(3);  | 7,3;      |
| X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,4)[34]; X4@O4(4)!X3(5)!O4(4); X5+(1,2)[15|2]; O5@X1(1)!X1(1)!O2(3)!X5(2); | 4,4; 7,4; |
| X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,4)[34]; X4@O4(4)!X3(5)!O4(4); X5+(2,3)[25|1]; O5@X5(2)!X1(1)!O2(3)!X5(2); | 3,4;      |
| X1+(1,2); O2+(2,3); X3+(4,5); O4+(5,4)[34]; X4@O4(4)!X3(5)!O4(4); X5+(2,3)[25|1]; O5@O2(2)!X1(1)!O2(2)!X5(3); | 7,3       |
|  |  |
| X1+(1,2); O2+(1,3); X3+(4,5); O4+(4,5)[34]; X4@X3(4)!X3(4)!O4(5); X5+(1,3)[25|1]; O5@X5(1)!X1(2)!O2(3)!X5(1); | 2,4; 6,3; |
| X1+(1,2); O2+(1,3); X3+(4,5); O4+(4,5)[34]; X4@X3(4)!X3(4)!O4(5); X5+(1,2)[15|2]; O5@X1(1)!X1(1)!O2(3)!X5(2); | 2,4; 5,4; |
| X1+(1,2); O2+(1,3); X3+(4,5); O4+(4,5)[34]; X4@X3(4)!X3(4)!O4(5); X5+(1,2)[15|2]; O5@X5(1)!X1(2)!O2(3)!X5(1); | 2,4; 5,4; |
|  |  |
```

## 6 Insight
  The squares that are moved in are irrelevant for the configuration locations.
  What is relevant are the spooky mark interactions - the entanglements.
  In the partial table above, there are two entanglements, one of 3 moves and one of 2.
  The two banger has two possible constructions and two possible collapses.
  - Construction X1O1-X2O2 or X1O2-X2O1.

  The three banger has 4 layer-1 constructions, 3 layer-2 constructions, and 2 collapses. 

## 7. Refinement
  We didn't simplify the problem enough.
  Consider only games of a pair of two bangers, just 16 configuration locations.
  
  First collapse is on move two, second collapse is on move 4.

 ### 7.1. First Collapse
  Two possible entanglements:
  - X1O1-X2O2 
  - X1O2-X2O1

  Two possible collapses:
  - X2@X1(1)
  - X2@X1(2)

  ```
  | Entanglements | Collapses | Classical Game |
  | :------------ | :-------- | :------------- |
  | X1O1-X2O2     | X2@X1(1)  | Upper right    |
  | X1O1-X2O2     | X2@X1(2)  | Lower left     |
  | X1O2-X2O1     | X2@X1(1)  | Upper left     |
  | X1O2-X2O1     | X2@X1(2)  | Lower right    |
  ```

  Thus all four possibilities are realizable.

 ### 7.2. Second Collapse
  Now consider the next moves, either a doublet or a triplet which collapses.
  - A doublet entanglement balloons into regions of 4 configuration locations.
    - Each balloon is accessible, thus, all 16 locations are allowed.
  - A triplet entanglement balloons into regions of 8 configuration locations.
    - Each balloon is accessible, thus, all 32 locations are allowed.

## 8. Results
  Yes, all configurations can be reached.
  A little boring, a little obvious after the fact.

## 9. Challenge
  Find a 9-move game that yields a single classical outcome in configuration location 32,16.
