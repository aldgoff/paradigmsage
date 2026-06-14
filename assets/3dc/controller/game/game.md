# Game Spec (Undo, etc.)
  Encourage MVC pattern with directory structure.

## 1. Purpose
  All the code for interacting with the game panel.
  Uses the new undo system in the state layer.

## 2. Game Panel
 ### 2.1 Buttons
  - Undo | Redo
  - Rewind | FF>>
  - Load | Save
 ### 2.2 Scroll list
  - Setup:   0/0
  - Moves:   0/0
  - Gambits: 0/0
  - AdvSqs:  0/0
   ### 2.3 Files

## 3. Theory
  - This is a descrete log undo system.
    - It consists of 4 sequential buffers.
    - {"Setup":[],"Moves":[],"Gambits":[],"AdvSqs":[]}
  - Within each buffer undo/redo advances/retreats by one event.
    - If at the end, redo advances to the next buffer.
    - If at the beg, undo retreats to the prev buffer.
  - Rewind goes to the first element in the current buffer.
    - It transitions to the last element in the previous buffer.
  - Fast forward goes to the last element in the current buffer.
    - It transitions to the first element in the next buffer.
  - The ends of the sequence are guarded by Top and Bottom Sentries.
  - Save captures the entire buffer sequence.
    - A condensed version is sent to the console.log.
    - A fully expanded version is copied to the clipboard.  
    - The most useful form is to slightly expand the condensed version (manual process).
  - Load initializes the game with the contents of the clipboard.
    - Use redo/undo and rewind/FF>> to review the captured history.
  
## 4. Arch
  - There are four state modules.
  - There is state buffer for each module.
  - There is a panel for each module.
  - Each module follows the MVC idiom, thus 4 directories and 12 files.
  - There is a directory at the controller layer for the Game panel, 3 more files.
  - There is a directory at the model layer for the state buffers, 3 more files.

## 5. Code (game.js)
 ### 5.1 Standard file layout
  - Docs
  - Json
  - Dependencies
  - Globals
  - UI
  - Handle functions
  - Helpers
 ### 5.2 UI
  - panelDispatch(payload)
  - buildPayload(panel, action)
  - showUndoStatus()
 ### 5.3 Handle Functions
  - Undo|Redo
  - Rewind|FastForward
  - Load|Save

## 6. Algorithms
  This structure, while very effective, is complex.
 ### 6.1 Undo
  - Reverse travers state buffers until finding a non null one, or the Bottom Sentry.
    - Process that one undo.
    - Update the state status list in the panel.
 ### 6.2 Redo
  - Foward travers state buffers until finding a non null one, or the Top Sentry.
    - Process that one redo.
    - Update the state status list in the panel.
 ### 6.3 Rewind
  - Reverse traverse state buffers until finding non null one, or the Bottom Sentry.
    - If at first element in buffer, process that one undo.
    - If not, undo until at the first element.
      - For advsqs, do not recursively undo, just skip to the beginning.
    - Update the state status list in the panel.
 ### 6.4 Fast Forward
  - Forward traverse state buffers until finding non null one, or the Top Sentry.
    - If at last element in buffer, process that one redo.
    - If not, redo until at the last element.
      - For advsqs, do not recursively redo, just skip to the end.
    - Update the state status list in the panel.


## 2. Validate Load/Save
  Can load either single string or pretty print.
  - May pop up a permissions dialog, may pop up only once.

 ### 2.1 3 boards, 3 moves, 3 gambits, 10 advsqs

 ### 2.1.2 Pretty Print Version

 ### 2.2 Current Bugs
  Moves and gambits not rendering or updating panels.

## 3. Debug Moves
  {"Setup":[],"Moves":[{"turn":1,"player":"White","piece":"P","src":"K2,2","action":"move","dst":"K4,4","sec":""},{"turn":1,"player":"Black","piece":"P","src":"K2,2","action":"move","dst":"K4,4","sec":""},{"turn":2,"player":"White","piece":"P","src":"Q2,2","action":"move","dst":"K4,4","sec":""}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[],"Moves":[{"turn":1,"player":"White","piece":"P","src":"K2,2","action":"move","dst":"K4,4","sec":""},{"turn":1,"player":"Black","piece":"P","src":"K2,2","action":"move","dst":"K4,4","sec":""},{"turn":2,"player":"White","piece":"P","src":"Q2,2","action":"move","dst":"K4,4","sec":""},{"turn":2,"player":"Black","piece":"N","src":"KN1,1","dst":"KB3,3","action":"move","sec":""}],"Gambits":[],"AdvSqs":[]}

## 4. Example Full Undo
  **1-4-3-8**
  {"Setup":[{"action":"makeBoard","boardSize":"8x8x8","initialPos":"standard"}],"Moves":[{"turn":1,"player":"White","piece":"P","src":"K2,2","dst":"K4,4","action":"move","sec":""},{"turn":1,"player":"Black","piece":"P","src":"K2,2","dst":"K4,4","action":"move","sec":""},{"turn":2,"player":"White","piece":"P","src":"Q2,2","dst":"Q4,4","action":"move","sec":""},{"turn":2,"player":"Black","piece":"N","src":"KN1,1","dst":"K3,3","action":"move","sec":""}],"Gambits":[{"Q":1,"src":"KB4,4","dst":"KB6,6","area":9},{"Q":13,"src":"Q4,4","dst":"KN7,4","area":16},{"Q":38,"src":"Q4,4","dst":"KR8,8","area":25}],"AdvSqs":[{"srcTile":[0,0,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":1,"stride":2,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"srcTile":[0,1,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"srcTile":[0,1,1],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"srcTile":[0,2,1],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"srcTile":[0,2,2],"quad":1,"perimeter":3,"stride":4,"opacity":0.5}]}

  {
    "Setup": [
      {
        "action": "makeBoard",
        "boardSize": "8x8x8",
        "initialPos": "standard"
      }
    ],
    "Moves": [
      {
        "turn": 1,
        "player": "White",
        "piece": "P",
        "src": "K2,2",
        "dst": "K4,4",
        "action": "move",
        "sec": ""
      },
      {
        "turn": 1,
        "player": "Black",
        "piece": "P",
        "src": "K2,2",
        "dst": "K4,4",
        "action": "move",
        "sec": ""
      },
      {
        "turn": 2,
        "player": "White",
        "piece": "P",
        "src": "Q2,2",
        "dst": "Q4,4",
        "action": "move",
        "sec": ""
      },
      {
        "turn": 2,
        "player": "Black",
        "piece": "N",
        "src": "KN1,1",
        "dst": "K3,3",
        "action": "move",
        "sec": ""
      }
    ],
    "Gambits": [
      {
        "Q": 1,
        "src": "KB4,4",
        "dst": "KB6,6",
        "area": 9
      },
      {
        "Q": 13,
        "src": "Q4,4",
        "dst": "KN7,4",
        "area": 16
      },
      {
        "Q": 38,
        "src": "Q4,4",
        "dst": "KR8,8",
        "area": 25
      }
    ],
    "AdvSqs": [
      {
        "srcTile": [
          0,
          0,
          0
        ],
        "quad": 1,
        "perimeter": 0,
        "stride": 0,
        "opacity": 0.5
      },
      {
        "srcTile": [
          0,
          0,
          0
        ],
        "quad": 1,
        "perimeter": 1,
        "stride": 2,
        "opacity": 0.5
      },
      {
        "srcTile": [
          0,
          0,
          0
        ],
        "quad": 1,
        "perimeter": 2,
        "stride": 3,
        "opacity": 0.5
      },
      {
        "srcTile": [
          0,
          0,
          0
        ],
        "quad": 1,
        "perimeter": 3,
        "stride": 4,
        "opacity": 0.5
      },
      {
        "srcTile": [
          0,
          1,
          0
        ],
        "quad": 1,
        "perimeter": 3,
        "stride": 4,
        "opacity": 0.5
      },
      {
        "srcTile": [
          0,
          1,
          1
        ],
        "quad": 1,
        "perimeter": 3,
        "stride": 4,
        "opacity": 0.5
      },
      {
        "srcTile": [
          0,
          2,
          1
        ],
        "quad": 1,
        "perimeter": 3,
        "stride": 4,
        "opacity": 0.5
      },
      {
        "srcTile": [
          0,
          2,
          2
        ],
        "quad": 1,
        "perimeter": 3,
        "stride": 4,
        "opacity": 0.5
      }
    ]
  }

## 5. Examples
 ### 5.0 Null State
  **0-0-0-0**
  {"Setup":[],"Moves":[],"Gambits":[],"AdvSqs":[]}

 ### 5.1 Setup
  **2-0-0-0**

 ### 5.2 Setup, Advsqs
  **2-0-0-6**

 ### 5.3 Moves, Gambits
  **0-4-3-0**
  {"Setup":[],"Moves":[{"turn":1,"player":"White","piece":"P","src":"K2,2","dst":"K4,4","action":"move","sec":""},{"turn":1,"player":"Black","piece":"P","src":"K2,2","dst":"K4,4","action":"move","sec":""},{"turn":2,"player":"White","piece":"P","src":"Q2,2","dst":"Q4,4","action":"move","sec":""},{"turn":2,"player":"Black","piece":"N","src":"KN1,1","dst":"K3,3","action":"move","sec":""}],"Gambits":[{"Q":1,"src":"KB4,4","dst":"KB6,6","area":9},{"Q":13,"src":"Q4,4","dst":"KN7,4","area":16},{"Q":38,"src":"Q4,4","dst":"KR8,8","area":25}],"AdvSqs":[]}

 ### 5.4 Advsqs
  **0-0-0-6**

 ### 5.5 Setup, Moves, Gambits, Advsqs
  **2-4-3-6**

## 6. Debug Gambits

## 7. New Entry Standard for Gambits.
 ### 7.1 Null State (0-0-0-0)
  {"Setup":[],"Moves":[],"Gambits":[],"AdvSqs":[]}

 ### 7.1 Full State (1-2-3-8)

 ### 7.2 Min Full State (1-1-1-7)

 ### 7.3 Debugging (4-0-0-7)

 ### 7.4 Dbugging (1-4-3-4)

 ### (3-0-0-7) RW & FF work

 ### (0-3-3-0) RW & FF work
  {"Setup":[],"Moves":[{"turn":1,"player":"White","piece":"P","src":"K2,2","dst":"K4,4","action":"move","sec":""},{"turn":1,"player":"Black","piece":"P","src":"K2,2","dst":"K4,4","action":"move","sec":""},{"turn":2,"player":"White","piece":"P","src":"K2,2","dst":"Q4,4","action":"move","sec":""}],"Gambits":[{"Q":1,"src":"KB4,4","dst":"KB7,7","area":16,"srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"Q":13,"src":"Q4,4","dst":"KN7,4","area":16,"srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"opacity":0.5},{"Q":38,"src":"Q4,4","dst":"KR8,8","area":25,"srcTile":[0,0,0],"quad":38,"perimeter":4,"stride":1,"opacity":0.5}],"AdvSqs":[]}

 ### (0-0-3-4) RW & FF work

 ### (3-3-0-0) RW & FF work

 ### (1-1-1-1)

 ### Changes in Advsq Payload
 ### Sort form

 ### Long Form

## Refactored Advsq Payload
 ### Short Form

 ### Long Form

## Linear Moves
 ### Short Form (right-fore)

 ### Clear Form (right-fore)

 ### Long Form (right-fore)

## Duplex Move
 ### Short Form (right-fore)

 ### Clear Form (right-fore)

 ### Long Form (right-fore)
 
 ## Advsqs Work Through Board Undo and Load

 ### (1-0-3-0)

## QC Pass on Modules

 ### (4-3-3-6)

## Advsq UI Surface Reduction
 ### 1-0-0-6

## Linear Move Example 
 ### Horizontal Rook Plane

 ### Both Rook Planes

### Constructured Rook Linear Move

### Improving Base Piece Linear Moves (1-0-2-0)

