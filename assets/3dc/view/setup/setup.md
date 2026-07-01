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

## 3. Example Boards
 ### 3.1 Board: 8x8x8
  **2-0-0-0**
    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
        "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"startingPos"}],
    "Moves":[],"Gambits":[],"AdvSqs":[]}

 ### 3.2 Board: 10x8x8
  **2-0-0-0**
    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
        "nextBoard":{"boardSize":"10x8x8","trayType":"Real","trayGap":1}},
      {"action":"startingPos"}],
    "Moves":[],"Gambits":[],"AdvSqs":[]}

 ### 3.3 Board: 10x10x10
  **2-0-0-0**
    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
        "nextBoard":{"boardSize":"10x10x10","trayType":"Fact","trayGap":0}},
      {"action":"startingPos"}],
    "Moves":[],"Gambits":[],"AdvSqs":[]}

 ### 3.4 Board: Exploratory (6/30/26)
  Make four boards, then load starting position. Confirm entire undo buffer U|R, F|R, L|S, and button affordances.
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

 ### 3.5 Board: Pretty Print
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

## 4. Example Puzzles
 ### 4.1 Board: 8x8x8 place, place, shift, return.
  **2-0-0-0**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"placePiece","key":"BKRP","prev":"~KR2,2","post":"@KR7,7"},{"action":"placePiece","key":"BKRR","prev":"~KR1,1","post":"@KR8,8"},{"action":"shiftPiece","key":"BKRP","prev":"@KR7,7","post":"@KR6,6"},{"action":"returnPiece","key":"BKRR","prev":"@KR8,8","post":"~KR1,1"}],"Moves":[],"Gambits":[],"AdvSqs":[]}

 ### 4.2 Puzzle: WKRP place, shift, return, freeze.
  **5-0-0-0**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"placePiece","list":[{"key":"WKRP","prev":"~KR2,2","post":"@KR2,2"}]},{"action":"shiftPiece","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR3,3"}]},{"action":"returnPiece","list":[{"key":"WKRP","prev":"@KR3,3","post":"~KR2,2"}]},{"action":"freezePuzzle","data":0}],"Moves":[],"Gambits":[],"AdvSqs":[]}

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
        "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"placePiece",
        "list":[
          {"key":"WKRP","prev":"~KR2,2","post":"@KR2,2"}]},
      {"action":"shiftPiece",
        "list":[
          {"key":"WKRP","prev":"@KR2,2","post":"@KR3,3"}]},
      {"action":"returnPiece",
        "list":[
          {"key":"WKRP","prev":"@KR3,3","post":"~KR2,2"}]},
      {"action":"freezePuzzle","data":0}],
    "Moves":[],"Gambits":[],"AdvSqs":[]}


 ### 4. Puzzle: Endgame, rook versus lone king.
  **5-2-0-6**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"placePiece","key":"BKKK","prev":"~K1,1","post":"@KN7,7"},{"action":"placePiece","key":"WKRR","prev":"~KR1,1","post":"@KB5,5"},{"action":"placePiece","key":"WKKK","prev":"~K1,1","post":"@K5,5"},{"action":"freezePuzzle","data":3}],"Moves":[{"action":"move","turn":1,"player":"White","list":[{"key":"WKKK","prev":"@K5,5","post":"@K6,6"}],"annotation":"move"},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKKK","prev":"@KN7,7","post":"@KN6,6"}],"annotation":"move"}],"Gambits":[],"AdvSqs":[{"action":"place","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},{"action":"place","src":"KB4,4","srcTile":[2,1,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},{"action":"place","src":"KB4,4","srcTile":[2,1,1],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},{"src":"KB5,5","srcTile":[2,1,1],"quad":1,"perimeter":1,"stride":2,"opacity":0.5},{"src":"KB5,5","srcTile":[2,1,1],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"src":"KB5,5","srcTile":[2,1,1],"quad":1,"perimeter":3,"stride":4,"opacity":0.5}]}

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
        "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"placePiece","key":"BKKK","prev":"~K1,1","post":"@KN7,7"},
      {"action":"placePiece","key":"WKRR","prev":"~KR1,1","post":"@KB5,5"},
      {"action":"placePiece","key":"WKKK","prev":"~K1,1","post":"@K5,5"},
      {"action":"freezePuzzle","data":3}],
    "Moves":[
      {"action":"move","turn":1,"player":"White",
        "list":[{"key":"WKKK","prev":"@K5,5","post":"@K6,6"}],
        "annotation":"move"},
        {"action":"move","turn":1,"player":"Black",
        "list":[{"key":"BKKK","prev":"@KN7,7","post":"@KN6,6"}],
        "annotation":"move"}],
    "Gambits":[],
    "AdvSqs":[
      {"action":"place","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},
      {"action":"place","src":"KB4,4","srcTile":[2,1,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},
      {"action":"place","src":"KB4,4","srcTile":[2,1,1],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},
        {"src":"KB5,5","srcTile":[2,1,1],"quad":1,"perimeter":1,"stride":2,"opacity":0.5},
        {"src":"KB5,5","srcTile":[2,1,1],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},
        {"src":"KB5,5","srcTile":[2,1,1],"quad":1,"perimeter":3,"stride":4,"opacity":0.5}]}

 ### 4. Puzzle: 
  **2-0-0-0**
  
{"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"placePiece","list":[{"key":"BKRP","prev":"~KR2,2","post":"@KR7,7"}]},{"action":"shiftPiece","list":[{"key":"BKRP","prev":"@KR7,7","post":"@KR6,6"}]},{"action":"shiftPiece","list":[{"key":"BKRP","prev":"@KR6,6","post":"@KR5,5"}]},{"action":"shiftPiece","list":[{"key":"BKRP","prev":"@KR5,5","post":"@KR4,4"}]},{"action":"returnPiece","list":[{"key":"BKRP","prev":"@KR4,4","post":"~KR2,2"}]}],"Moves":[],"Gambits":[],"AdvSqs":[]}

