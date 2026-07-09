# Setup Spec (view)
  Describe the view layer of the setup feature.
  - Basic intent of the setup panel.
  - Some examples of setups that can be loaded.

## 1. Purpose
  Render/derender boards, trays, etc.

## 2. Description
  - Various boards and tray types can be chosen.
  - Either an initial starting position for the pieces or manual puzzle setup.
  - Button affordances reveal what is logically allowed.
  - Actions must be reversible.
  - Panel contains a scroll box to log undoable selections.

## 3. Boards (work with successive loads, no need to refresh site)
 ### 3.1 ✅ Board: 8x8x8
  **Listing**

    0x0x0    10x8x8   Real
    startingPos

  **2-0-0-0**

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
        "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"startingPos"}],
    "Moves":[],"Gambits":[],"AdvSqs":[]}

 ### 3.2 ✅ Board: 10x8x8 with TrayGap=1
  **Listing**

    0x0x0    10x8x8   Real
    startingPos

  **2-0-0-0**

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
        "nextBoard":{"boardSize":"10x8x8","trayType":"Real","trayGap":1}},
      {"action":"startingPos"}],
    "Moves":[],"Gambits":[],"AdvSqs":[]}

 ### 3.3 ✅ Board: 10x10x10
  **Listing**

    0x0x0    10x10x10 Fact
    startingPos

  **2-0-0-0**

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
        "nextBoard":{"boardSize":"10x10x10","trayType":"Fact","trayGap":0}},
      {"action":"startingPos"}],
    "Moves":[],"Gambits":[],"AdvSqs":[]}

 ### 3.4 ✅ Board: Sequence of 4 boards
  Make four boards, then load starting position. Confirm entire undo buffer U|R, F|R, L|S, and button affordances.
  
  **Listing**

    0x0x0    8x8x8    Real
    8x8x8    10x8x8   Real
    10x8x8   10x10x10 Real
    10x10x10 8x8x8    Real
    startingPos

  **5-0-0-0**

    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"makeBoard","prevBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0},"nextBoard":{"boardSize":"10x8x8","trayType":"Real","trayGap":0}},{"action":"makeBoard","prevBoard":{"boardSize":"10x8x8","trayType":"Real","trayGap":0},"nextBoard":{"boardSize":"10x10x10","trayType":"Real","trayGap":0}},{"action":"makeBoard","prevBoard":{"boardSize":"10x10x10","trayType":"Real","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[],"Gambits":[],"AdvSqs":[]}

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
        "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0},
        "nextBoard":{"boardSize":"10x8x8","trayType":"Real","trayGap":0}},
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"10x8x8","trayType":"Real","trayGap":0},
        "nextBoard":{"boardSize":"10x10x10","trayType":"Real","trayGap":0}},
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"10x10x10","trayType":"Real","trayGap":0},
        "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"startingPos"}],
    "Moves":[],"Gambits":[],"AdvSqs":[]}

 ### 3.5 ✅ Board: Pretty Print
  **5-0-0-0**

    {
      "Setup": [
        {
          "action": "makeBoard",
          "prevBoard": {
            "boardSize": "0x0x0",
            "trayType": "None",
            "trayGap": 0
          },
          "nextBoard": {
            "boardSize": "8x8x8",
            "trayType": "Real",
            "trayGap": 0
          }
        },
        {
          "action": "makeBoard",
          "prevBoard": {
            "boardSize": "8x8x8",
            "trayType": "Real",
            "trayGap": 0
          },
          "nextBoard": {
            "boardSize": "10x8x8",
            "trayType": "Real",
            "trayGap": 0
          }
        },
        {
          "action": "makeBoard",
          "prevBoard": {
            "boardSize": "10x8x8",
            "trayType": "Real",
            "trayGap": 0
          },
          "nextBoard": {
            "boardSize": "10x10x10",
            "trayType": "Real",
            "trayGap": 0
          }
        },
        {
          "action": "makeBoard",
          "prevBoard": {
            "boardSize": "10x10x10",
            "trayType": "Real",
            "trayGap": 0
          },
          "nextBoard": {
            "boardSize": "8x8x8",
            "trayType": "Real",
            "trayGap": 0
          }
        },
        {
          "action": "startingPos"
        }
      ],
      "Moves": [],
      "Gambits": [],
      "AdvSqs": []
    }

## 4. Puzzles
 ### 4.1 ✅ Puzzle: WKRP place, place, shift, return, freeze.
  **Listing**

    0x0x0    8x8x8    Real
    WKRP ~KR2,2 @KR2,2
    BKRP ~KR2,2 @KR7,7
    WKRP @KR2,2 @KR3,3
    BKRP @KR7,7 ~KR2,2
    freezePuzzle

  **6-0-0-0**

    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"placePiece","list":[{"key":"WKRP","prev":"~KR2,2","post":"@KR2,2"}]},{"action":"placePiece","list":[{"key":"BKRP","prev":"~KR2,2","post":"@KR7,7"}]},{"action":"shiftPiece","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR3,3"}]},{"action":"returnPiece","list":[{"key":"BKRP","prev":"@KR7,7","post":"~KR2,2"}]},{"action":"freezePuzzle","data":1}],"Moves":[],"Gambits":[],"AdvSqs":[]}

 ### 4.2 ✅ Puzzle: Endgame, king and rook versus lone king.
  **Setup Listing**

    0x0x0    8x8x8    Real
    BKKK ~K1,1 @KN7,7
    WKRR ~KR1,1 @KB5,5
    WKKK ~K1,1 @K5,5
    freezePuzzle

  **Move Listing**

    1  WKRR @KB5,5 R-KB6,6                  BKKK @KN7,7 K-KR7,7                   move,move
    2  WKKK @K5,5  K-KB6,5                  BKKK @KR7,7 K-KN7,7                   move,move

  **Gambit Listing**

    1 Q1      R KB4,4 → KB8,8   : 9 left_fore,right_fore
    2 Q5      R KB4,4 → KR6,6   : 9 up,right_fore

  **5-4-2-10**

  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"placePiece","list":[{"key":"BKKK","prev":"~K1,1","post":"@KN7,7"}]},{"action":"placePiece","list":[{"key":"WKRR","prev":"~KR1,1","post":"@KB5,5"}]},{"action":"placePiece","list":[{"key":"WKKK","prev":"~K1,1","post":"@K5,5"}]},{"action":"freezePuzzle","data":3}],"Moves":[{"action":"move","turn":1,"player":"White","list":[{"key":"WKRR","prev":"@KB5,5","post":"@KB6,6"}],"annotation":"move"},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKKK","prev":"@KN7,7","post":"@KR7,7"}],"annotation":"move"},{"action":"move","turn":2,"player":"White","list":[{"key":"WKKK","prev":"@K5,5","post":"@KB6,5"}],"annotation":"move"},{"action":"move","turn":2,"player":"Black","list":[{"key":"BKKK","prev":"@KR7,7","post":"@KN7,7"}],"annotation":"move"}],"Gambits":[{"gambit":0,"action":"quadrant","value":1,"piece":"rook","src":"KB4,4","dst":"KB8,8","rays":["left_fore","right_fore"],"advsqs":[{"src":"KB4,4","srcTile":[2,2,2],"quad":1,"perimeter":2,"stride":3,"area":9}],"opacity":0.5},{"gambit":1,"action":"quadrant","value":5,"piece":"rook","src":"KB4,4","dst":"KR6,6","rays":["up","right_fore"],"advsqs":[{"src":"KB4,4","srcTile":[2,2,2],"quad":5,"perimeter":2,"stride":1,"area":9}],"opacity":0.5}],"AdvSqs":[{"src":"Q4,4","srcTile":[0,0,0],"quad":1,"perimeter":1,"stride":2,"area":0,"opacity":0.5},{"src":"Q4,4","srcTile":[0,0,0],"quad":1,"perimeter":2,"stride":3,"area":4,"opacity":0.5},{"src":"Q4,4","srcTile":[0,0,0],"quad":5,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"src":"Q4,4","srcTile":[0,0,0],"quad":9,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"src":"Q4,4","srcTile":[1,0,0],"quad":9,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"src":"Q4,4","srcTile":[2,0,0],"quad":9,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"src":"Q4,4","srcTile":[2,1,0],"quad":9,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"src":"Q4,4","srcTile":[2,1,1],"quad":9,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"src":"Q4,4","srcTile":[2,2,1],"quad":9,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"src":"Q4,4","srcTile":[2,2,2],"quad":9,"perimeter":2,"stride":1,"area":9,"opacity":0.5}]}

 ### 4.3 ✅ Puzzle: stack place, shift, return - pairs: stacked, split & returned.
  **Setup Listing**

    0x0x0    8x8x8    Real
    BKBB ~KB2,1 @KB8,8
    BKBB @KB8,8 @KB7,7
    BKBB @KB7,7 ~KB2,1
    BKBB ~KB2,1 @KB8,8
    BKBD ~KB1,2 @KB7,7
    BKBB @KB8,8 @KB6,6
    BKBB @KB6,6 @KN6,6
    BKBD @KB6,6 ~KB1,2

  **9-0-0-0**

    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"placePiece","list":[{"key":"BKBB","prev":"~KB2,1","post":"@KB8,8"},{"key":"BKBD","prev":"~KB1,2","post":"@KB8,8"}]},{"action":"shiftPiece","list":[{"key":"BKBB","prev":"@KB8,8","post":"@KB7,7"},{"key":"BKBD","prev":"@KB8,8","post":"@KB7,7"}]},{"action":"returnPiece","list":[{"key":"BKBB","prev":"@KB7,7","post":"~KB2,1"},{"key":"BKBD","prev":"~KB7,7","post":"~KB1,2"}]},{"action":"placePiece","list":[{"key":"BKBB","prev":"~KB2,1","post":"@KB8,8"}]},{"action":"placePiece","list":[{"key":"BKBD","prev":"~KB1,2","post":"@KB7,7"}]},{"action":"shiftPiece","list":[{"key":"BKBB","prev":"@KB8,8","post":"@KB6,6"},{"key":"BKBD","prev":"@KB7,7","post":"@KB6,6"}]},{"action":"shiftPiece","list":[{"key":"BKBB","prev":"@KB6,6","post":"@KN6,6"}]},{"action":"returnPiece","list":[{"key":"BKBD","prev":"@KB6,6","post":"~KB1,2"},{"key":"BKBB","prev":"~KN6,6","post":"~KB2,1"}]}],"Moves":[],"Gambits":[],"AdvSqs":[]}

 ### 4. Puzzle: 
  **Listing**

  **0-0-0-0**

