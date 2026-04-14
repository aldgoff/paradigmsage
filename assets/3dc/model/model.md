# Model Spec

## 1. Purpose/
  Defines invariant structures and rules for the 3D chess system.
  This layer encodes WHAT is true, not HOW it is computed.

## 2. AI's Take
 ### 2.1 Ontology:
  - Movement is defined by advancement manifolds (not trajectories)
  - Pieces are constraint accessors over equivalence classes
  - State is a configuration, not a history of moves
 ### 2.2 Contains:
  - Congruent rules or 3DC specializations
  - Equivalence class definitions
  - Ray / manifold type definitions
  - Piece definitions (declarative, not procedural)
 ### 2.3 Does NOT:
  - Generate moves
  - Reference UI or rendering
 ### 2.4 Dependencies:
  - May depend on other model modules only
    - Foundations/
    - Geometry/
 ### 2.5 Invariants:
  - Dimension-agnostic where possible
  - No implicit trajectory assumptions
  - Single Point Of Truth (SPOT)
 ### 2.6 Notes:
  Any logic that implies step-by-step motion is a violation.
 
## 3. SubModules
  text

 ### 3.1 Tiles
  text

 ### 3.2 Board
  text

 ### 3.3 Tray
  text

 ### 3.4 Pieces
  text

## 4. State and History
 ### 4.1 State
  What constitutes state on the 3D chess board?

  - Piece locations (32-36)
  - Gambit tiles: src & dst (2)
  - Advancement squares (a dozen or so src/dst pairs)
    - Create
    - Destroy
    - Expand
    - Contact
    - Slip

  A state is information rich, so implementing undo as a list of state snapshots could get expensive.
  Better, maybe, is to log change of state, and every change must be reversible.
  Hybrid, if a White piece moves, update all White pieces, otherwise log as fixed/stable/unchange whatever.

 ### 4.2 History
  A game (or puzzle) is launched by specifying these
  - Board size
    - 8x8x8, 6x6x6, 5x5x5, 4x4x4
    - 10x8x8, 10x10x10.
  - Trays
  - Initial position
  - Moves
  - Gambits

  Undo follows this list in reverse order.
  Gambits are rewound, then moves, the inital position, the trays, and finally the board.

  The gambit tiles (src/dst) are two tiles on the board the player can arbitrarily move around. 
  As either (or both) are moved, any advancement squares that couple them are drawn. 
  At any point the player can say save, and that creates an advancement square that stays on the board. 
  Player can  continue to move srcdst around or undo the list of accumulate advancement squares. 
  So undo looks like this, undo positions of src/dst, then undo list of advsqs, then undo list of moves, then undo setup and board construction. 
  Layered, but logarithmic resolution.

 ### 4.3 Listing
  A draft
  - Expanded:

  | Move |  White  |  Black  |             Coordinates             | Annotations |
  | ---: | :------ | :------ | :---------------------------------- | :---------- |
  |   1  | P-K4,4  | P-KB3,4 | [K2,2]-[K4,4]   : [KB2,2]-[KB3,4]   | ch, ep, qc, kc, rc, dc, qn, etc. |
  |   2  | P-Q4,4  | P-QB3,4 | [Q2,2]-[Q4,4]   : [QB2,2]-[QB3,4]   | fk, pn, dc, mp, td, dy, tp, etc. |
  | ...  |  |  |  |  |

  - Collapsed:

  | Move |  White  |  Black  | Coord | Notes |
  | ---: | :------ | :------ | :---: | :---: |
  |   1  | P-K4,4  | P-KB3,4 |       |       |
  |   2  | P-Q4,4  | P-QB3,4 |  ...  |  ...  |
  |   3  |  |  |  |  |

  The ellipses (...) indicate there is data to be seen, if desired.

## 5. Use Case
  Play flow after setup. 
  Create an advsq, move it around, resize it, maybe change to a different piece. 
  Lock it down (erases the advsq history). 
  Repeat with variations. 
  Now I have a gambit, a sequence of advsqs that help me think about my next move. 
  I select a move (erases the gambit history). 
  Now I can undo my move history to review the game, or even explore in depth alternatives.
  Only when I'm really happy, do I let my opponent know my choice. 
  Rinse and repeat, the code has made me smarter. 
  Undo all the moves, or start a new game.
  *New Game* should be different from *New Setup*, it erases the move list, but does not undo the setup.
  Dork with setup, then play a game or attack a puzzle, dork around with gambits and advsqs until I've thought through my next move. 
  If I ever undo too far, just redo back to where I wanted to be.
  I think this works.

 ### 5.1 Confirmation...
{
  "Setup":[
    {"board":[8,8,8]},
    {"board":[10,8,8]},
    {"board":[10,10,10]},
    {"board":[6,6,6]},
    {"board":[5,5,5]},
    {"board":[4,4,4],"play":"puzzle","trays":"real","gap":0},
    {"board":[4,4,4],"play":"puzzle","trays":"real","gap":1},
    {"board":[4,4,4],"play":"puzzle","trays":"real","gap":2},
    {"board":[4,4,4],"play":"puzzle","trays":"real","gap":1}
    ],
  "Moves":[
    {"turn":1,"moves":["P-K4,4","P-Q4,3"],"coords":["",""],"annotations":["","..."]},
    {"turn":2,"moves":["PxP","N-KB3,3"],"coords":["...",""],"annotations":["",""]},
    {"turn":3,"moves":["qnP-QN3,4","..."],"coords":["...","..."],"annotations":["...","..."]}
    ],
  "Gambits":[
    {"turn":1,"moves":["P-K4,4","P-Q4,3"],"coords":["",""],"annotations":["","..."]},
    {"turn":2,"moves":["PxP","N-KB3,3"],"coords":["...",""],"annotations":["",""]},
    {"turn":3,"moves":["qnP-QN3,4","..."],"coords":["...","..."],"annotations":["...","..."]}
    ],
  "AdvSqs":[
    ["Q0,0","KB2,2"],
    ["Q0,0","KN3,3"],
    ["Q0,0","Q1,1"]
  ]
}

