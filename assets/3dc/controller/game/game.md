# Game Spec (Undo, etc.)
  Hope to enforce MVC pattern with directory structure.

## 1. Purpose
  All the code for interacting with the game panel.
  Uses the new undo system in the state layer.

## 2. Validate Load/Save
  Can load either single string or pretty print.
  - May pop up a permissions dialog, may pop up only once.

 ### 2.1 3 boards, 3 moves, 3 gambits, 10 advsqs
  {"Setup":[{"action":"makeBoard","boardSize":"8x8x8","initialPos":"standard"},{"action":"makeBoard","boardSize":"10x8x8","initialPos":"standard"},{"action":"makeBoard","boardSize":"10x10x10","initialPos":"standard"}],"Moves":[{"turn":1,"player":"White","piece":"P","src":"K2,2","action":"move","dst":"K4,4","sec":""},{"turn":1,"player":"Black","piece":"P","src":"K2,2","action":"move","dst":"K4,4","sec":""},{"turn":2,"player":"White","piece":"P","src":"K2,2","action":"move","dst":"KR4,4","sec":""}],"Gambits":[{"Q":1,"src":"KB4,4","dst":"KB6,6","area":9},{"Q":13,"src":"Q4,4","dst":"KN7,4","area":16},{"Q":38,"src":"Q4,4","dst":"KR8,8","area":25}],"AdvSqs":[{"srcTile":[0,0,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":1,"stride":2,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"srcTile":[0,1,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"srcTile":[0,1,1],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"srcTile":[0,2,1],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"srcTile":[0,2,2],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"srcTile":[0,3,2],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"srcTile":[0,3,3],"quad":1,"perimeter":3,"stride":4,"opacity":0.5}]}

 ### 2.1.2 Pretty Print Version
  {
  "Setup": [
    {
      "action": "makeBoard",
      "boardSize": "8x8x8",
      "initialPos": "standard"
    },
    {
      "action": "makeBoard",
      "boardSize": "10x8x8",
      "initialPos": "standard"
    },
    {
      "action": "makeBoard",
      "boardSize": "10x10x10",
      "initialPos": "standard"
    }
  ],
  "Moves": [
    {
      "turn": 1,
      "player": "White",
      "piece": "P",
      "src": "K2,2",
      "action": "move",
      "dst": "K4,4",
      "sec": ""
    },
    {
      "turn": 1,
      "player": "Black",
      "piece": "P",
      "src": "K2,2",
      "action": "move",
      "dst": "K4,4",
      "sec": ""
    },
    {
      "turn": 2,
      "player": "White",
      "piece": "P",
      "src": "K2,2",
      "action": "move",
      "dst": "KR4,4",
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
    },
    {
      "srcTile": [
        0,
        3,
        2
      ],
      "quad": 1,
      "perimeter": 3,
      "stride": 4,
      "opacity": 0.5
    },
    {
      "srcTile": [
        0,
        3,
        3
      ],
      "quad": 1,
      "perimeter": 3,
      "stride": 4,
      "opacity": 0.5
    }
  ]
  }

 ### 2.2 Current Bugs
  Moves and gambits not rendering or updating panels.

## 3. Debug Moves
  {"Setup":[],"Moves":[{"turn":1,"player":"White","piece":"P","src":"K2,2","action":"move","dst":"K4,4","sec":""},{"turn":1,"player":"Black","piece":"P","src":"K2,2","action":"move","dst":"K4,4","sec":""},{"turn":2,"player":"White","piece":"P","src":"Q2,2","action":"move","dst":"K4,4","sec":""}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[],"Moves":[{"turn":1,"player":"White","piece":"P","src":"K2,2","action":"move","dst":"K4,4","sec":""},{"turn":1,"player":"Black","piece":"P","src":"K2,2","action":"move","dst":"K4,4","sec":""},{"turn":2,"player":"White","piece":"P","src":"Q2,2","action":"move","dst":"K4,4","sec":""},{"turn":2,"player":"Black","piece":"N","src":"KN1,1","dst":"KB3,3","action":"move","sec":""}],"Gambits":[],"AdvSqs":[]}

  {
    "Setup": [],
    "Moves": [
      {
        "turn": 1,
        "player": "White",
        "piece": "P",
        "src": "K2,2",
        "action": "move",
        "dst": "K4,4",
        "sec": ""
      },
      {
        "turn": 1,
        "player": "Black",
        "piece": "P",
        "src": "K2,2",
        "action": "move",
        "dst": "K4,4",
        "sec": ""
      },
      {
        "turn": 2,
        "player": "White",
        "piece": "P",
        "src": "Q2,2",
        "action": "move",
        "dst": "K4,4",
        "sec": ""
      },
      {
        "turn": 2,
        "player": "Black",
        "piece": "N",
        "src": "KN1,1",
        "dst": "KB3,3",
        "action": "move",
        "sec": ""
      }
    ],
    "Gambits": [],
    "AdvSqs": []
  }

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
  {"Setup":[{"action":"makeBoard","boardSize":"8x8x8","trayType":"real","initialPos":"standard"},{"action":"makeBoard","boardSize":"10x8x8","trayType":"none","initialPos":"manual"}],"Moves":[],"Gambits":[],"AdvSqs":[]}

 ### 5.2 Setup, Advsqs
  **2-0-0-6**
  {"Setup":[{"action":"makeBoard","boardSize":"8x8x8","trayType":"real","initialPos":"standard"},{"action":"makeBoard","boardSize":"10x8x8","trayType":"none","initialPos":"manual"}],"Moves":[],"Gambits":[],"AdvSqs":[{"srcTile":[0,0,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":1,"stride":2,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":4,"stride":5,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":5,"stride":6,"opacity":0.5}]}

 ### 5.3 Moves, Gambits
  **0-4-3-0**
  {"Setup":[],"Moves":[{"turn":1,"player":"White","piece":"P","src":"K2,2","dst":"K4,4","action":"move","sec":""},{"turn":1,"player":"Black","piece":"P","src":"K2,2","dst":"K4,4","action":"move","sec":""},{"turn":2,"player":"White","piece":"P","src":"Q2,2","dst":"Q4,4","action":"move","sec":""},{"turn":2,"player":"Black","piece":"N","src":"KN1,1","dst":"K3,3","action":"move","sec":""}],"Gambits":[{"Q":1,"src":"KB4,4","dst":"KB6,6","area":9},{"Q":13,"src":"Q4,4","dst":"KN7,4","area":16},{"Q":38,"src":"Q4,4","dst":"KR8,8","area":25}],"AdvSqs":[]}

 ### 5.4 Advsqs
  **0-0-0-6**
  {"Setup":[],"Moves":[],"Gambits":[],"AdvSqs":[{"srcTile":[0,0,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":1,"stride":2,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":4,"stride":5,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":5,"stride":6,"opacity":0.5}]}

 ### 5.5 Setup, Moves, Gambits, Advsqs
  **2-4-3-6**
  {"Setup":[{"action":"makeBoard","boardSize":"8x8x8","trayType":"real","initialPos":"standard"},{"action":"makeBoard","boardSize":"10x8x8","trayType":"none","initialPos":"manual"}],"Moves":[{"turn":1,"player":"White","piece":"P","src":"K2,2","dst":"K4,4","action":"move","sec":""},{"turn":1,"player":"Black","piece":"P","src":"K2,2","dst":"K4,4","action":"move","sec":""},{"turn":2,"player":"White","piece":"P","src":"Q2,2","dst":"Q4,4","action":"move","sec":""},{"turn":2,"player":"Black","piece":"N","src":"KN1,1","dst":"K3,3","action":"move","sec":""}],"Gambits":[{"Q":1,"src":"KB4,4","dst":"KB6,6","area":9},{"Q":13,"src":"Q4,4","dst":"KN7,4","area":16},{"Q":38,"src":"Q4,4","dst":"KR8,8","area":25}],"AdvSqs":[{"srcTile":[0,0,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":1,"stride":2,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":4,"stride":5,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":5,"stride":6,"opacity":0.5}]}

  {
    "Setup": [
      {
        "action": "makeBoard",
        "boardSize": "8x8x8",
        "initialPos": "standard"
      },
      {
        "action": "makeBoard",
        "boardSize": "10x8x8",
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
          0,
          0
        ],
        "quad": 1,
        "perimeter": 4,
        "stride": 5,
        "opacity": 0.5
      },
      {
        "srcTile": [
          0,
          0,
          0
        ],
        "quad": 1,
        "perimeter": 5,
        "stride": 6,
        "opacity": 0.5
      }
    ]
  }

## 6. Debug Gambits
  {"Setup":[{"action":"makeBoard","boardSize":"8x8x8"}],"Moves":[],"Gambits":[{"Q":1,"src":"KB4,4","dst":"KB6,6","area":9,"srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"Q":13,"src":"Q4,4","dst":"KN7,4","area":16,"srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"opacity":0.5},{"Q":38,"src":"Q4,4","dst":"KR8,8","area":25,"srcTile":[0,0,0],"quad":38,"perimeter":4,"stride":1,"opacity":0.5}],"AdvSqs":[]}

## 7. New Entry Standard for Gambits.
 ### 7.1 Null State (0-0-0-0)
  {"Setup":[],"Moves":[],"Gambits":[],"AdvSqs":[]}

 ### 7.1 Full State (1-2-3-8)
{"Setup":[{"action":"makeBoard","boardSize":"8x8x8"}],"Moves":[{"turn":1,"player":"White","piece":"P","src":"K2,2","dst":"K4,4","action":"move","sec":""},{"turn":1,"player":"Black","piece":"P","src":"K2,2","dst":"K4,4","action":"move","sec":""},{"turn":2,"player":"White","piece":"P","src":"K2,2","dst":"Q4,4","action":"move","sec":""}],"Gambits":[{"Q":1,"src":"KB4,4","dst":[2,6,6],"area":49,"srcTile":[2,0,0],"quad":1,"perimeter":6,"stride":7,"opacity":0.5},{"Q":13,"src":"Q4,4","dst":"KN7,4","area":16,"srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"opacity":0.5},{"Q":38,"src":"Q4,4","dst":"KR8,8","area":25,"srcTile":[0,0,0],"quad":38,"perimeter":4,"stride":1,"opacity":0.5}],"AdvSqs":[{"srcTile":[0,0,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":1,"stride":2,"opacity":0.5},{"srcTile":[0,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"srcTile":[0,0,0],"quad":2,"perimeter":2,"stride":3,"opacity":0.5},{"srcTile":[0,0,0],"quad":3,"perimeter":2,"stride":3,"opacity":0.5},{"srcTile":[0,0,0],"quad":3,"perimeter":3,"stride":4,"opacity":0.5},{"srcTile":[0,0,0],"quad":3,"perimeter":4,"stride":5,"opacity":0.5},{"srcTile":[0,0,0],"quad":3,"perimeter":5,"stride":6,"opacity":0.5}]}

 