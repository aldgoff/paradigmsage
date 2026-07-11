# Advsqs Spec
  Specify how to display advsqs on the board.

## 1. Purpose
  Define UI and user experience.

## 2. Panel Creation
  The DOM panel is the major input mechanism for defining an advancement square.
  It offers control of src tile (positional notation), quad, perimeter, and stride.
  Colors (red, green, blue) and decorators should be automatic (source, end, body, apex, etc.).
  Also quick changes for quad, plane, and piece.

## 3. Management
  All decorators are collected into a group just for the current advsq.
  Upon a new one, the previous is deleted.

 ### 3.1 TBD
  text

## 4. Mouse/Board Creation
  tbd

## 5. Examples: Working Manually, and Load/Save, But Panel Fields need to be updated.
 ### 5.1 ✅ Scenario: Rook Walk
  **1-0-0-15**

    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],"Moves":[],"Gambits":[],"AdvSqs":[{"action":"place","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":1,"stride":2,"area":1,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":3,"area":4,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":4,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":3,"stride":1,"area":16,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":3,"stride":1,"area":16,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":3,"stride":1,"area":16,"opacity":0.5},{"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":8,"perimeter":3,"stride":1,"area":16,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":5,"perimeter":3,"stride":1,"area":16,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":6,"perimeter":3,"stride":1,"area":16,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":7,"perimeter":3,"stride":1,"area":16,"opacity":0.5},{"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":11,"perimeter":3,"stride":1,"area":16,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":12,"perimeter":3,"stride":1,"area":16,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":9,"perimeter":3,"stride":1,"area":16,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":10,"perimeter":3,"stride":1,"area":16,"opacity":0.5}]}

    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],
    "Moves":[],
    "Gambits":[],
    "AdvSqs":[
      {"action":"place","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":1,"stride":2,"area":1,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":3,"area":4,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":4,"area":9,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":3,"stride":1,"area":16,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":3,"stride":1,"area":16,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":3,"stride":1,"area":16,"opacity":0.5},
      {"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":8,"perimeter":3,"stride":1,"area":16,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":5,"perimeter":3,"stride":1,"area":16,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":6,"perimeter":3,"stride":1,"area":16,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":7,"perimeter":3,"stride":1,"area":16,"opacity":0.5},
      {"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":11,"perimeter":3,"stride":1,"area":16,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":12,"perimeter":3,"stride":1,"area":16,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":9,"perimeter":3,"stride":1,"area":16,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":10,"perimeter":3,"stride":1,"area":16,"opacity":0.5}]}

 ### 5.2 ✅ Scenario: Bishop Walk
  **1-0-0-27**

    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],"Moves":[],"Gambits":[],"AdvSqs":[{"action":"place","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},{"action":"nextPiece","src":"KB4,4","srcTile":[2,0,0],"quad":13,"perimeter":0,"stride":1,"area":1,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":13,"perimeter":1,"stride":2,"area":1,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":13,"perimeter":2,"stride":3,"area":4,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":14,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":15,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":16,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":17,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":18,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":24,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":19,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":20,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":21,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":22,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":23,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":29,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":30,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":25,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":26,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":27,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":28,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":34,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":35,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":36,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":31,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":32,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":33,"perimeter":2,"stride":1,"area":9,"opacity":0.5}]}

  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],
  "Moves":[],
  "Gambits":[],
  "AdvSqs":[
    {"action":"place","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},
    {"action":"nextPiece","src":"KB4,4","srcTile":[2,0,0],"quad":13,"perimeter":0,"stride":1,"area":1,"opacity":0.5},
    {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":13,"perimeter":1,"stride":2,"area":1,"opacity":0.5},
    {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":13,"perimeter":2,"stride":3,"area":4,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":14,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":15,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":16,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":17,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":18,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":24,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":19,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":20,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":21,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":22,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":23,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":29,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":30,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":25,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":26,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":27,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":28,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":34,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":35,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":36,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":31,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":32,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
    {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":33,"perimeter":2,"stride":1,"area":9,"opacity":0.5}]}

 ### 5.3 ✅ Scenario: Duke Walk
  **1-0-0-28**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],"Moves":[],"Gambits":[],"AdvSqs":[{"action":"place","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},{"action":"nextPiece","src":"KB4,4","srcTile":[2,0,0],"quad":13,"perimeter":0,"stride":1,"area":1,"opacity":0.5},{"action":"nextPiece","src":"KB4,4","srcTile":[2,0,0],"quad":37,"perimeter":0,"stride":1,"area":1,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":37,"perimeter":1,"stride":2,"area":1,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":37,"perimeter":2,"stride":3,"area":4,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":38,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":39,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":40,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":44,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":41,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":42,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":43,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":47,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":48,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":45,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":46,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":50,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":51,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":52,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":49,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":53,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":54,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":55,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":56,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":60,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":57,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":58,"perimeter":2,"stride":1,"area":9,"opacity":0.5},{"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":59,"perimeter":2,"stride":1,"area":9,"opacity":0.5}]}

    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],
    "Moves":[],
    "Gambits":[],
    "AdvSqs":[
      {"action":"place","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},
      {"action":"nextPiece","src":"KB4,4","srcTile":[2,0,0],"quad":13,"perimeter":0,"stride":1,"area":1,"opacity":0.5},
      {"action":"nextPiece","src":"KB4,4","srcTile":[2,0,0],"quad":37,"perimeter":0,"stride":1,"area":1,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":37,"perimeter":1,"stride":2,"area":1,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":37,"perimeter":2,"stride":3,"area":4,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":38,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":39,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":40,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":44,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":41,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":42,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":43,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":47,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":48,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":45,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":46,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":50,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":51,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":52,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":49,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":53,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":54,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":55,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":56,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextPlane","src":"KB4,4","srcTile":[2,0,0],"quad":60,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":57,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":58,"perimeter":2,"stride":1,"area":9,"opacity":0.5},
      {"action":"nextQuad","src":"KB4,4","srcTile":[2,0,0],"quad":59,"perimeter":2,"stride":1,"area":9,"opacity":0.5}]}

 ### 5.4 ✅ Scenario: Rook Advance/Retreat
  **1-0-0-38**

    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":1}}],"Moves":[],"Gambits":[],"AdvSqs":[{"action":"place","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":1,"stride":2,"area":1,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":3,"area":4,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":4,"area":9,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":4,"stride":5,"area":16,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":5,"stride":6,"area":25,"opacity":0.5},{"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":4,"stride":5,"area":36,"opacity":0.5},{"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":4,"area":25,"opacity":0.5},{"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":3,"area":16,"opacity":0.5},{"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":1,"stride":2,"area":9,"opacity":0.5},{"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":0,"stride":1,"area":4,"opacity":0.5},{"action":"updateParam","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":0,"stride":0,"area":1,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":1,"stride":2,"area":1,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":2,"stride":3,"area":4,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":3,"stride":4,"area":9,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":4,"stride":5,"area":16,"opacity":0.5},{"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":3,"stride":4,"area":25,"opacity":0.5},{"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":2,"stride":3,"area":16,"opacity":0.5},{"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":1,"stride":2,"area":9,"opacity":0.5},{"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":0,"stride":1,"area":4,"opacity":0.5},{"action":"updateParam","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":0,"stride":0,"area":1,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":1,"stride":2,"area":1,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":2,"stride":3,"area":4,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":3,"stride":4,"area":9,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":4,"stride":5,"area":16,"opacity":0.5},{"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":3,"stride":4,"area":25,"opacity":0.5},{"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":2,"stride":3,"area":16,"opacity":0.5},{"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":1,"stride":2,"area":9,"opacity":0.5},{"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":0,"stride":1,"area":4,"opacity":0.5},{"action":"updateParam","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":0,"stride":0,"area":1,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":1,"stride":2,"area":1,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":2,"stride":3,"area":4,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":3,"stride":4,"area":9,"opacity":0.5},{"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":4,"stride":5,"area":16,"opacity":0.5},{"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":3,"stride":4,"area":25,"opacity":0.5},{"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":2,"stride":3,"area":16,"opacity":0.5},{"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":1,"stride":2,"area":9,"opacity":0.5},{"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":0,"stride":1,"area":4,"opacity":0.5}]}

    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":1}}],
    "Moves":[],
    "Gambits":[],
    "AdvSqs":[
      {"action":"place","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":1,"stride":2,"area":1,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":3,"area":4,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":4,"area":9,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":4,"stride":5,"area":16,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":5,"stride":6,"area":25,"opacity":0.5},
      {"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":4,"stride":5,"area":36,"opacity":0.5},
      {"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":4,"area":25,"opacity":0.5},
      {"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":3,"area":16,"opacity":0.5},
      {"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":1,"stride":2,"area":9,"opacity":0.5},
      {"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":0,"stride":1,"area":4,"opacity":0.5},
      {"action":"updateParam","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":0,"stride":0,"area":1,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":1,"stride":2,"area":1,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":2,"stride":3,"area":4,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":3,"stride":4,"area":9,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":4,"stride":5,"area":16,"opacity":0.5},
      {"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":3,"stride":4,"area":25,"opacity":0.5},
      {"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":2,"stride":3,"area":16,"opacity":0.5},
      {"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":1,"stride":2,"area":9,"opacity":0.5},
      {"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":0,"stride":1,"area":4,"opacity":0.5},
      {"action":"updateParam","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":0,"stride":0,"area":1,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":1,"stride":2,"area":1,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":2,"stride":3,"area":4,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":3,"stride":4,"area":9,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":4,"stride":5,"area":16,"opacity":0.5},
      {"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":3,"stride":4,"area":25,"opacity":0.5},
      {"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":2,"stride":3,"area":16,"opacity":0.5},
      {"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":1,"stride":2,"area":9,"opacity":0.5},
      {"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":3,"perimeter":0,"stride":1,"area":4,"opacity":0.5},
      {"action":"updateParam","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":0,"stride":0,"area":1,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":1,"stride":2,"area":1,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":2,"stride":3,"area":4,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":3,"stride":4,"area":9,"opacity":0.5},
      {"action":"grow","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":4,"stride":5,"area":16,"opacity":0.5},
      {"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":3,"stride":4,"area":25,"opacity":0.5},
      {"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":2,"stride":3,"area":16,"opacity":0.5},
      {"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":1,"stride":2,"area":9,"opacity":0.5},
      {"action":"shrink","src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":0,"stride":1,"area":4,"opacity":0.5}]}

 ### 5.5 Scenario: Bishop Advance/Retreat
  **Setup Listing**

    Best with tray gap of 1 and level sep of 1.8.
    Set before load.
    I'm going to want to include the initial values of tray and level sep in the setup state.

  **1-0-0-44**

    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":1}}],"Moves":[],"Gambits":[],"AdvSqs":[{"action":"place","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},{"action":"nextPiece","src":"KB4,4","srcTile":[2,0,0],"quad":13,"perimeter":0,"stride":1,"area":1,"opacity":0.5},{"action":"nextPiece","src":"KB4,4","srcTile":[1,0,0],"quad":13,"perimeter":0,"stride":1,"area":1,"opacity":0.5},{"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":13,"perimeter":1,"stride":2,"area":1,"opacity":0.5},{"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":13,"perimeter":2,"stride":3,"area":4,"opacity":0.5},{"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":13,"perimeter":3,"stride":4,"area":9,"opacity":0.5},{"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":13,"perimeter":2,"stride":3,"area":16,"opacity":0.5},{"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":13,"perimeter":1,"stride":2,"area":9,"opacity":0.5},{"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":13,"perimeter":0,"stride":1,"area":4,"opacity":0.5},{"action":"updateParam","src":"K4,4","srcTile":[1,0,0],"quad":14,"perimeter":0,"stride":0,"area":1,"opacity":0.5},{"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":14,"perimeter":1,"stride":2,"area":1,"opacity":0.5},{"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":14,"perimeter":2,"stride":3,"area":4,"opacity":0.5},{"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":14,"perimeter":3,"stride":4,"area":9,"opacity":0.5},{"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":14,"perimeter":2,"stride":3,"area":16,"opacity":0.5},{"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":14,"perimeter":1,"stride":2,"area":9,"opacity":0.5},{"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":14,"perimeter":0,"stride":1,"area":4,"opacity":0.5},{"action":"updateParam","src":"K4,4","srcTile":[1,0,0],"quad":15,"perimeter":0,"stride":0,"area":1,"opacity":0.5},{"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":15,"perimeter":1,"stride":2,"area":1,"opacity":0.5},{"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":15,"perimeter":2,"stride":3,"area":4,"opacity":0.5},{"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":15,"perimeter":3,"stride":4,"area":9,"opacity":0.5},{"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":15,"perimeter":2,"stride":3,"area":16,"opacity":0.5},{"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":15,"perimeter":1,"stride":2,"area":9,"opacity":0.5},{"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":15,"perimeter":0,"stride":1,"area":4,"opacity":0.5},{"action":"updateParam","src":"K4,4","srcTile":[1,0,0],"quad":16,"perimeter":0,"stride":0,"area":1,"opacity":0.5},{"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":16,"perimeter":1,"stride":2,"area":1,"opacity":0.5},{"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":16,"perimeter":2,"stride":3,"area":4,"opacity":0.5},{"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":16,"perimeter":3,"stride":4,"area":9,"opacity":0.5},{"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":16,"perimeter":2,"stride":3,"area":16,"opacity":0.5},{"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":16,"perimeter":1,"stride":2,"area":9,"opacity":0.5},{"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":16,"perimeter":0,"stride":1,"area":4,"opacity":0.5},{"action":"updateParam","src":"K4,4","srcTile":[1,0,0],"quad":17,"perimeter":0,"stride":0,"area":1,"opacity":0.5},{"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":17,"perimeter":1,"stride":2,"area":1,"opacity":0.5},{"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":17,"perimeter":2,"stride":3,"area":4,"opacity":0.5},{"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":17,"perimeter":3,"stride":4,"area":9,"opacity":0.5},{"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":17,"perimeter":2,"stride":3,"area":16,"opacity":0.5},{"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":17,"perimeter":1,"stride":2,"area":9,"opacity":0.5},{"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":17,"perimeter":0,"stride":1,"area":4,"opacity":0.5},{"action":"updateParam","src":"K4,4","srcTile":[1,0,0],"quad":18,"perimeter":0,"stride":0,"area":1,"opacity":0.5},{"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":18,"perimeter":1,"stride":2,"area":1,"opacity":0.5},{"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":18,"perimeter":2,"stride":3,"area":4,"opacity":0.5},{"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":18,"perimeter":3,"stride":4,"area":9,"opacity":0.5},{"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":18,"perimeter":2,"stride":3,"area":16,"opacity":0.5},{"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":18,"perimeter":1,"stride":2,"area":9,"opacity":0.5},{"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":18,"perimeter":0,"stride":1,"area":4,"opacity":0.5}]}

    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":1}}],
    "Moves":[],
    "Gambits":[],
    "AdvSqs":[
      {"action":"place","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},
      {"action":"nextPiece","src":"KB4,4","srcTile":[2,0,0],"quad":13,"perimeter":0,"stride":1,"area":1,"opacity":0.5},
      {"action":"nextPiece","src":"KB4,4","srcTile":[1,0,0],"quad":13,"perimeter":0,"stride":1,"area":1,"opacity":0.5},
      {"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":13,"perimeter":1,"stride":2,"area":1,"opacity":0.5},
      {"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":13,"perimeter":2,"stride":3,"area":4,"opacity":0.5},
      {"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":13,"perimeter":3,"stride":4,"area":9,"opacity":0.5},
      {"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":13,"perimeter":2,"stride":3,"area":16,"opacity":0.5},
      {"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":13,"perimeter":1,"stride":2,"area":9,"opacity":0.5},
      {"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":13,"perimeter":0,"stride":1,"area":4,"opacity":0.5},
      {"action":"updateParam","src":"K4,4","srcTile":[1,0,0],"quad":14,"perimeter":0,"stride":0,"area":1,"opacity":0.5},
      {"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":14,"perimeter":1,"stride":2,"area":1,"opacity":0.5},
      {"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":14,"perimeter":2,"stride":3,"area":4,"opacity":0.5},
      {"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":14,"perimeter":3,"stride":4,"area":9,"opacity":0.5},
      {"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":14,"perimeter":2,"stride":3,"area":16,"opacity":0.5},
      {"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":14,"perimeter":1,"stride":2,"area":9,"opacity":0.5},
      {"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":14,"perimeter":0,"stride":1,"area":4,"opacity":0.5},
      {"action":"updateParam","src":"K4,4","srcTile":[1,0,0],"quad":15,"perimeter":0,"stride":0,"area":1,"opacity":0.5},
      {"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":15,"perimeter":1,"stride":2,"area":1,"opacity":0.5},
      {"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":15,"perimeter":2,"stride":3,"area":4,"opacity":0.5},
      {"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":15,"perimeter":3,"stride":4,"area":9,"opacity":0.5},
      {"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":15,"perimeter":2,"stride":3,"area":16,"opacity":0.5},
      {"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":15,"perimeter":1,"stride":2,"area":9,"opacity":0.5},
      {"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":15,"perimeter":0,"stride":1,"area":4,"opacity":0.5},
      {"action":"updateParam","src":"K4,4","srcTile":[1,0,0],"quad":16,"perimeter":0,"stride":0,"area":1,"opacity":0.5},
      {"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":16,"perimeter":1,"stride":2,"area":1,"opacity":0.5},
      {"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":16,"perimeter":2,"stride":3,"area":4,"opacity":0.5},
      {"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":16,"perimeter":3,"stride":4,"area":9,"opacity":0.5},
      {"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":16,"perimeter":2,"stride":3,"area":16,"opacity":0.5},
      {"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":16,"perimeter":1,"stride":2,"area":9,"opacity":0.5},
      {"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":16,"perimeter":0,"stride":1,"area":4,"opacity":0.5},
      {"action":"updateParam","src":"K4,4","srcTile":[1,0,0],"quad":17,"perimeter":0,"stride":0,"area":1,"opacity":0.5},
      {"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":17,"perimeter":1,"stride":2,"area":1,"opacity":0.5},
      {"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":17,"perimeter":2,"stride":3,"area":4,"opacity":0.5},
      {"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":17,"perimeter":3,"stride":4,"area":9,"opacity":0.5},
      {"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":17,"perimeter":2,"stride":3,"area":16,"opacity":0.5},
      {"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":17,"perimeter":1,"stride":2,"area":9,"opacity":0.5},
      {"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":17,"perimeter":0,"stride":1,"area":4,"opacity":0.5},
      {"action":"updateParam","src":"K4,4","srcTile":[1,0,0],"quad":18,"perimeter":0,"stride":0,"area":1,"opacity":0.5},
      {"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":18,"perimeter":1,"stride":2,"area":1,"opacity":0.5},
      {"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":18,"perimeter":2,"stride":3,"area":4,"opacity":0.5},
      {"action":"grow","src":"K4,4","srcTile":[1,0,0],"quad":18,"perimeter":3,"stride":4,"area":9,"opacity":0.5},
      {"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":18,"perimeter":2,"stride":3,"area":16,"opacity":0.5},
      {"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":18,"perimeter":1,"stride":2,"area":9,"opacity":0.5},
      {"action":"shrink","src":"K4,4","srcTile":[1,0,0],"quad":18,"perimeter":0,"stride":1,"area":4,"opacity":0.5}]}

 ### 5.6 Scenario: 
  **Setup Listing**

  **1-0-0-0**


 ### 5.10 Scenario: Knight - All, works manually, not from save
  **Setup Listing**

    0x0x0    8x8x8    Real
    BKNN ~KN1,1 @KB6,6
    freezePuzzle

  **3-0-0-8**

    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"placePiece","list":[{"key":"BKNN","prev":"~KN1,1","post":"@KB6,6"}]},{"action":"freezePuzzle","data":1}],"Moves":[],"Gambits":[],"AdvSqs":[{"action":"place","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},{"action":"place","src":"KB4,4","srcTile":[2,1,0],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},{"action":"place","src":"KB4,4","srcTile":[2,1,1],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},{"action":"place","src":"KB4,4","srcTile":[2,2,1],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},{"action":"place","src":"KB4,4","srcTile":[2,2,2],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},{"action":"nextPiece","src":"KB6,6","srcTile":[2,2,2],"quad":13,"perimeter":0,"stride":1,"area":1,"opacity":0.5},{"action":"nextPiece","src":"KB6,6","srcTile":[2,2,2],"quad":37,"perimeter":0,"stride":1,"area":1,"opacity":0.5},{"action":"nextPiece","src":"KB6,6","srcTile":[2,2,2],"quad":61,"perimeter":0,"stride":1,"area":1,"opacity":0.5}]}

    {"Setup":[
      {"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"placePiece","list":[{"key":"BKNN","prev":"~KN1,1","post":"@KB6,6"}]},{"action":"freezePuzzle","data":1}],
    "Moves":[],
    "Gambits":[],
    "AdvSqs":[
      {"action":"place","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},
      {"action":"place","src":"KB4,4","srcTile":[2,1,0],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},
      {"action":"place","src":"KB4,4","srcTile":[2,1,1],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},
      {"action":"place","src":"KB4,4","srcTile":[2,2,1],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},
      {"action":"place","src":"KB4,4","srcTile":[2,2,2],"quad":1,"perimeter":0,"stride":0,"area":0,"opacity":0.5},
      {"action":"nextPiece","src":"KB6,6","srcTile":[2,2,2],"quad":13,"perimeter":0,"stride":1,"area":1,"opacity":0.5},
      {"action":"nextPiece","src":"KB6,6","srcTile":[2,2,2],"quad":37,"perimeter":0,"stride":1,"area":1,"opacity":0.5},
      {"action":"nextPiece","src":"KB6,6","srcTile":[2,2,2],"quad":61,"perimeter":0,"stride":1,"area":1,"opacity":0.5}]}

