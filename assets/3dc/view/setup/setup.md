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
 ### 4. Board: 8x8x8 place, place, shift, return.
  **2-0-0-0**
{"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"placePiece","key":"BKRP","prev":"~KR2,2","post":"@KR7,7"},{"action":"placePiece","key":"BKRR","prev":"~KR1,1","post":"@KR8,8"},{"action":"shiftPiece","key":"BKRP","prev":"@KR7,7","post":"@KR6,6"},{"action":"returnPiece","key":"BKRR","prev":"@KR8,8","post":"~KR1,1"}],"Moves":[],"Gambits":[],"AdvSqs":[]}

 ### 4. Puzzle: 
  **2-0-0-0**
  

