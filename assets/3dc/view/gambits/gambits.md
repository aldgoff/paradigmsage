# Gambits View Spec
  Describe how gambits are shown.

## 1. Purpose
  - Render gambit on the board.
  - Show rows in the scroll box.
  - Update derived data.
  - Manage buttons.

## 2. Render
  - For now, just lay them out in order.
  - Layering conflicts yield flickering overlap tiles when animation is on.
  - That bug is a feature at this point.
  - Eventually replacd with linear and overlap decorators.

## 3. Rows
  - See json file.
  - Thoughts about pawns for small forward quads
    - a: advance like a rook
    - b: capture like a bishop
    - d: capture like a duke
  - Capture type might be more informative than area in the panel scrollbox row.

## 4. Derived Data
 ### 4.1 Open
  - List of open quadrants in the gambit.
    - For now, all of them.
    - TODO: restrict after pieces module.

 ### 4.2 Blocked
  - List of blocked quadrants in the gambit.
    - For now, none of them.
    - TODO: expand after pieces module.

 ### 4.3 Move Type
  - Show for current index in the undo buffer.
  - Full word, not abbreviation as in the rows.

 ### 4.4 Overlap Type
  - Show for current index in the undo buffer.
  - Full word, not abbreviation as in the rows.

 ### 4.5 Lowest Piece
  - Show for current index in the undo buffer.
  - Full word, not abbreviation as in the rows.
  - Should include pawn and king.

## 5. Buttons
  - Freeze Quadrant button is always enabled.
    - May not represent a full move, but has benefits for teaching and training.
  - Expose functions to enable/disable buttons to be used by the advsq module.
    - enableFreezeLinearButton()
    - enableFreezeDuplexButton()
    - enableFreezeOverlapButton()
  - Piece specific buttons enabled according to the rules.
  - Plane button enabled if advsq more than just the src tile.
  - Rest of buttons depend on row list and undo index.

## 6. Notes
  - Button status provides feedback about the nature of the src/dst tile relationship.
  - Button management is tricky, and changes to a UI cascade through a code base.

## 7. Loads:
 ### 7. Scenario:
  **1-0-3-0**
  {"Setup":[],"Moves":[],"Gambits":[{"gambit":0,"action":"quadrant","value":1,"piece":"rook","src":"KB4,4","dst":"KB7,7","rays":["left_fore","right_fore"],"advsqs":[{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":4,"area":16}],"opacity":0.5},{"gambit":1,"action":"linear","value":"1","piece":"bishop","src":"Q4,4","dst":"KN7,4","rays":"LFU","advsqs":[[{"src":"Q4,4","srcTile":[0,0,0],"quad":18,"perimeter":3,"stride":1,"area":16},{"src":"Q4,4","srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"area":16}],[{"src":"Q4,4","srcTile":[0,0,0],"quad":25,"perimeter":3,"stride":1,"area":16},{"src":"Q4,4","srcTile":[0,0,0],"quad":26,"perimeter":3,"stride":1,"area":16}]],"opacity":0.5},{"gambit":2,"action":"duplex","value":"MM","piece":"duke","src":"Q4,4","dst":"KR4,4","rays":[1,0,0],"advsqs":[{"src":"Q4,4","srcTile":[0,0,0],"quad":38,"perimeter":2,"stride":3,"area":9},{"src":"Q4,4","srcTile":[0,0,0],"quad":41,"perimeter":2,"stride":3,"area":9}],"opacity":0.5}],"AdvSqs":[]}


  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],
  "Moves":[],
  "Gambits":[
    {"gambit":0,"action":"quadrant","value":1,"piece":"rook","src":"KB4,4","dst":"KB7,7","rays":["left_fore","right_fore"],"advsqs":[
      {"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":4,"area":16}],
      "opacity":0.5},
    {"gambit":1,"action":"linear","value":"1","piece":"bishop","src":"Q4,4","dst":"KN7,4","rays":"LFU","advsqs":[
      [{"src":"Q4,4","srcTile":[0,0,0],"quad":18,"perimeter":3,"stride":1,"area":16},{"src":"Q4,4","srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"area":16}],
      [{"src":"Q4,4","srcTile":[0,0,0],"quad":25,"perimeter":3,"stride":1,"area":16},{"src":"Q4,4","srcTile":[0,0,0],"quad":26,"perimeter":3,"stride":1,"area":16}]],
      "opacity":0.5},
    {"gambit":2,"action":"duplex","value":"MM","piece":"duke","src":"Q4,4","dst":"KR4,4","rays":[1,0,0],"advsqs":[
      {"src":"Q4,4","srcTile":[0,0,0],"quad":38,"perimeter":2,"stride":3,"area":9},{"src":"Q4,4","srcTile":[0,0,0],"quad":41,"perimeter":2,"stride":3,"area":9}],
      "opacity":0.5}],
  "AdvSqs":[]}



  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],
  "Moves":[],
  "Gambits":[
    {"gambit":0,"action":"quadrant","value":1,"piece":"rook","src":"KB4,4","dst":"KB7,7","rays":["left_fore","right_fore"],"advsqs":[
      {"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":4,"area":16}],
      "opacity":0.5},
    {"gambit":1,"action":"linear","value":"1","piece":"bishop","src":"Q4,4","dst":"KN7,4","rays":"LFU","advsqs":[
      [{"src":"Q4,4","srcTile":[0,0,0],"quad":18,"perimeter":3,"stride":1,"area":16},{"src":"Q4,4","srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"area":16}],
      [{"src":"Q4,4","srcTile":[0,0,0],"quad":25,"perimeter":3,"stride":1,"area":16},{"src":"Q4,4","srcTile":[0,0,0],"quad":26,"perimeter":3,"stride":1,"area":16}]],
      "opacity":0.5},
    {"gambit":2,"action":"duplex","value":"MM","piece":"duke","src":"Q4,4","dst":"KR4,4","rays":[1,0,0],"advsqs":[
      {"src":"Q4,4","srcTile":[0,0,0],"quad":38,"perimeter":2,"stride":3,"area":9},{"src":"Q4,4","srcTile":[0,0,0],"quad":41,"perimeter":2,"stride":3,"area":9}],
      "opacity":0.5}],
  "AdvSqs":[]}


  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],
  "Moves":[],
  "Gambits":[
    {"gambit":0,"action":"quadrant","piece":"rook","src":"KB4,4","dst":"KB7,7","rays":["left_fore","right_fore"],"advsqs":[
      {"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":4,"area":16}],
      "opacity":0.5},
    {"gambit":1,"action":"linear","piece":"bishop","src":"Q4,4","dst":"KN7,4","rays":"LFU","advsqs":[
      [{"src":"Q4,4","srcTile":[0,0,0],"quad":18,"perimeter":3,"stride":1,"area":16},{"src":"Q4,4","srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"area":16}],
      [{"src":"Q4,4","srcTile":[0,0,0],"quad":25,"perimeter":3,"stride":1,"area":16},{"src":"Q4,4","srcTile":[0,0,0],"quad":26,"perimeter":3,"stride":1,"area":16}]],
      "opacity":0.5},
    {"gambit":2,"action":"duplex","piece":"duke","src":"Q4,4","dst":"KR4,4","rays":[1,0,0],"advsqs":[
      {"src":"Q4,4","srcTile":[0,0,0],"quad":38,"perimeter":2,"stride":3,"area":9},{"src":"Q4,4","srcTile":[0,0,0],"quad":41,"perimeter":2,"stride":3,"area":9}],
      "opacity":0.5}],
  "AdvSqs":[]}


  {"Setup":[
    {"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],
  "Moves":[],
  "Gambits":[
    {"gambit":0,"action":"quadrant","piece":"R","src":"KB4,4","dst":"KB7,7","rays":["left_fore","right_fore"],"advsqs":[
      {"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":4,"area":16}],
      "opacity":0.5},
    {"gambit":1,"action":"linear","piece":"bishop","src":"Q4,4","dst":"KN7,4","rays":"LFU","advsqs":[
      [{"src":"Q4,4","srcTile":[0,0,0],"quad":18,"perimeter":3,"stride":1,"area":16},{"src":"Q4,4","srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"area":16}],
      [{"src":"Q4,4","srcTile":[0,0,0],"quad":25,"perimeter":3,"stride":1,"area":16},{"src":"Q4,4","srcTile":[0,0,0],"quad":26,"perimeter":3,"stride":1,"area":16}]],
      "opacity":0.5},
    {"gambit":2,"action":"duplex","piece":"duke","src":"Q4,4","dst":"KR4,4","rays":[1,0,0],"advsqs":[
      {"src":"Q4,4","srcTile":[0,0,0],"quad":38,"perimeter":2,"stride":3,"area":9},{"src":"Q4,4","srcTile":[0,0,0],"quad":41,"perimeter":2,"stride":3,"area":9}],
      "opacity":0.5}],
  "AdvSqs":[]}


    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos","data":0}],"Moves":[],"Gambits":[{"gambitId":0,"action":"quad","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},{"move":"linear","piece":"bishop","src":"Q4,4","dst":"KN7,4","ray":"LFU","advsqs":[[{"srcTile":[0,0,0],"quad":18,"perimeter":3,"stride":1,"area":16},{"srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"area":16}],[{"srcTile":[0,0,0],"quad":25,"perimeter":3,"stride":1,"area":16},{"srcTile":[0,0,0],"quad":26,"perimeter":3,"stride":1,"area":16}]],"opacity":0.5},{"move":"duplex","piece":"duke","src":"Q4,4","dst":[6,0,0],"ray":[1,0,0],"advsqs":[{"src":"Q4,4","srcTile":[0,0,0],"quad":38,"perimeter":3,"stride":4,"opacity":0.5},{"src":"Q4,4","srcTile":[0,0,0],"quad":41,"perimeter":3,"stride":4,"opacity":0.5}],"opacity":0.5}],"AdvSqs":[{"action":"place","src":"Q4,4","srcTile":[0,0,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},{"action":"place","src":"Q4,4","srcTile":[-1,0,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},{"action":"place","src":"Q4,4","srcTile":[-2,0,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},{"src":"QN4,4","srcTile":[-2,0,0],"quad":1,"perimeter":1,"stride":2,"opacity":0.5},{"src":"QN4,4","srcTile":[-2,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5}]}

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
        "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"startingPos","data":0}],
    "Moves":[],
    "Gambits":[
      {"gambitId":0,"action":
        "quad","src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":4,"opacity":0.5},
        {"move":"linear","piece":"bishop","src":"Q4,4","dst":"KN7,4","ray":"LFU",
          "advsqs":[
            [{"srcTile":[0,0,0],"quad":18,"perimeter":3,"stride":1,"area":16},
            {"srcTile":[0,0,0],"quad":13,"perimeter":3,"stride":1,"area":16}],
            [{"srcTile":[0,0,0],"quad":25,"perimeter":3,"stride":1,"area":16},
            {"srcTile":[0,0,0],"quad":26,"perimeter":3,"stride":1,"area":16}]],
            "opacity":0.5},
        {"move":"duplex","piece":"duke","src":"Q4,4","dst":[6,0,0],"ray":[1,0,0],
          "advsqs":[
            {"src":"Q4,4","srcTile":[0,0,0],"quad":38,"perimeter":3,"stride":4,"opacity":0.5},
            {"src":"Q4,4","srcTile":[0,0,0],"quad":41,"perimeter":3,"stride":4,"opacity":0.5}],
            "opacity":0.5}],
    "AdvSqs":[
      {"action":"place",
        "src":"Q4,4","srcTile":[0,0,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},
      {"action":"place",
        "src":"Q4,4","srcTile":[-1,0,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},
      {"action":"place",
        "src":"Q4,4","srcTile":[-2,0,0],"quad":1,"perimeter":0,"stride":0,"opacity":0.5},
        {"src":"QN4,4","srcTile":[-2,0,0],"quad":1,"perimeter":1,"stride":2,"opacity":0.5},
        {"src":"QN4,4","srcTile":[-2,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5}]}

## 8. Overlaps:
 ### 8.1 Scenario: Hotspot - Rook Q4,1
  **1-0-1-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],"Moves":[],"Gambits":[{"gambit":0,"action":"overlap","value":"MM","piece":"rook","src":"KB4,4","dst":"KB6,4","rays":"left_fore","advsqs":[[{"src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":2,"stride":1,"area":9},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":1,"area":9}],[{"src":"KB4,4","srcTile":[2,0,0],"quad":9,"perimeter":2,"stride":1,"area":9},{"src":"KB4,4","srcTile":[2,0,0],"quad":10,"perimeter":2,"stride":1,"area":9}],[{"src":"KB4,4","srcTile":[2,0,0],"quad":54,"perimeter":1,"stride":2,"area":4},{"src":"KB4,4","srcTile":[2,0,0],"quad":58,"perimeter":1,"stride":2,"area":4}]],"opacity":0.5}],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard",
    "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
    "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],"
  Moves":[],
  "Gambits":[
    {"gambit":0,"action":"overlap","value":"MM","piece":"rook","src":"KB4,4","dst":"KB6,4","rays":"left_fore",
    "advsqs":[
      [{"src":"KB4,4","srcTile":[2,0,0],"quad":4,"perimeter":2,"stride":1,"area":9},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":1,"area":9}],
      [{"src":"KB4,4","srcTile":[2,0,0],"quad":9,"perimeter":2,"stride":1,"area":9},{"src":"KB4,4","srcTile":[2,0,0],"quad":10,"perimeter":2,"stride":1,"area":9}],
      [{"src":"KB4,4","srcTile":[2,0,0],"quad":54,"perimeter":1,"stride":2,"area":4},{"src":"KB4,4","srcTile":[2,0,0],"quad":58,"perimeter":1,"stride":2,"area":4}]],
      "opacity":0.5}],
  "AdvSqs":[]}

 ### 8.2 Scenario: Hotspot - Rook Q1,2
  **1-0-1-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],"Moves":[],"Gambits":[{"gambit":0,"action":"overlap","value":"MM","piece":"rook","src":"KB4,4","dst":"KB4,6","rays":"right_fore","advsqs":[[{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":5,"area":9},{"src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":2,"stride":5,"area":9}],[{"src":"KB4,4","srcTile":[2,0,0],"quad":5,"perimeter":2,"stride":5,"area":9},{"src":"KB4,4","srcTile":[2,0,0],"quad":6,"perimeter":2,"stride":5,"area":9}],[{"src":"KB4,4","srcTile":[2,0,0],"quad":46,"perimeter":1,"stride":2,"area":4},{"src":"KB4,4","srcTile":[2,0,0],"quad":50,"perimeter":1,"stride":2,"area":4}]],"opacity":0.5}],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],
  "Moves":[],
  "Gambits":[
    {"gambit":0,
      "action":"overlap","value":"MM","piece":"rook","src":"KB4,4","dst":"KB4,6","rays":"right_fore","advsqs":[
        [{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":5,"area":9},{"src":"KB4,4","srcTile":[2,0,0],"quad":2,"perimeter":2,"stride":5,"area":9}],
        [{"src":"KB4,4","srcTile":[2,0,0],"quad":5,"perimeter":2,"stride":5,"area":9},{"src":"KB4,4","srcTile":[2,0,0],"quad":6,"perimeter":2,"stride":5,"area":9}],
        [{"src":"KB4,4","srcTile":[2,0,0],"quad":46,"perimeter":1,"stride":2,"area":4},{"src":"KB4,4","srcTile":[2,0,0],"quad":50,"perimeter":1,"stride":2,"area":4}]],
        "opacity":0.5}],
  "AdvSqs":[]}

 ### 8.3 Scenario: Hotspot - Rook Q4,1 perimeter 
  **1-0-0-11**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],"Moves":[],"Gambits":[],"AdvSqs":[{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":1,"stride":2,"opacity":0.5},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":2,"opacity":0.5},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":1,"opacity":0.5},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":1,"opacity":0.5},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":4,"stride":1,"opacity":0.5},{"src":"KB4,4","srcTile":[2,-1,0],"quad":1,"perimeter":4,"stride":1,"opacity":0.5},{"src":"KB4,4","srcTile":[2,-2,0],"quad":1,"perimeter":4,"stride":1,"opacity":0.5},{"src":"KB4,4","srcTile":[2,-3,0],"quad":1,"perimeter":4,"stride":1,"opacity":0.5},{"src":"KB1,4","srcTile":[2,-3,0],"quad":1,"perimeter":5,"stride":1,"opacity":0.5},{"src":"KB1,4","srcTile":[2,-3,0],"quad":1,"perimeter":6,"stride":1,"opacity":0.5}]}

  {"Setup":[
    {"action":"makeBoard",
    "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
    "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],
  "Moves":[],
  "Gambits":[],
  "AdvSqs":[
    {"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":1,"stride":2,"opacity":0.5},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":3,"opacity":0.5},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":2,"opacity":0.5},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":2,"stride":1,"opacity":0.5},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":3,"stride":1,"opacity":0.5},{"src":"KB4,4","srcTile":[2,0,0],"quad":1,"perimeter":4,"stride":1,"opacity":0.5},{"src":"KB4,4","srcTile":[2,-1,0],"quad":1,"perimeter":4,"stride":1,"opacity":0.5},{"src":"KB4,4","srcTile":[2,-2,0],"quad":1,"perimeter":4,"stride":1,"opacity":0.5},{"src":"KB4,4","srcTile":[2,-3,0],"quad":1,"perimeter":4,"stride":1,"opacity":0.5},{"src":"KB1,4","srcTile":[2,-3,0],"quad":1,"perimeter":5,"stride":1,"opacity":0.5},{"src":"KB1,4","srcTile":[2,-3,0],"quad":1,"perimeter":6,"stride":1,"opacity":0.5}]}

  **1-0-1-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],"Moves":[],"Gambits":[{"gambit":0,"action":"overlap","value":"hotspot","piece":"rook","src":"KB1,4","dst":"KB7,4","rays":"left_fore","advsqs":[[{"src":"KB1,4","srcTile":[2,-3,0],"quad":4,"perimeter":6,"stride":1,"area":49},{"src":"KB1,4","srcTile":[2,-3,0],"quad":1,"perimeter":6,"stride":1,"area":49}],[{"src":"KB1,4","srcTile":[2,-3,0],"quad":9,"perimeter":6,"stride":1,"area":49},{"src":"KB1,4","srcTile":[2,-3,0],"quad":10,"perimeter":6,"stride":1,"area":49}],[{"src":"KB1,4","srcTile":[2,-3,0],"quad":54,"perimeter":3,"stride":4,"area":16},{"src":"KB1,4","srcTile":[2,-3,0],"quad":58,"perimeter":3,"stride":4,"area":16}]],"opacity":0.5}],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard",
    "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
    "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],
  "Moves":[],
  "Gambits":[
    {"gambit":0,
      "action":"overlap","value":"hotspot","piece":"rook","src":"KB1,4","dst":"KB7,4","rays":"left_fore","advsqs":[
        [{"src":"KB1,4","srcTile":[2,-3,0],"quad":4,"perimeter":6,"stride":1,"area":49},{"src":"KB1,4","srcTile":[2,-3,0],"quad":1,"perimeter":6,"stride":1,"area":49}],
        [{"src":"KB1,4","srcTile":[2,-3,0],"quad":9,"perimeter":6,"stride":1,"area":49},{"src":"KB1,4","srcTile":[2,-3,0],"quad":10,"perimeter":6,"stride":1,"area":49}],
        [{"src":"KB1,4","srcTile":[2,-3,0],"quad":54,"perimeter":3,"stride":4,"area":16},{"src":"KB1,4","srcTile":[2,-3,0],"quad":58,"perimeter":3,"stride":4,"area":16}]],
        "opacity":0.5}],
  "AdvSqs":[]}

 ### 8.4 Scenario: Hotspot - Queen attacks Knight
  **3-0-1-0**
  1 Ohotspot R KB1,4 → KB7,4   :49 left_fore
  1 Ohotspot D KB1,4 → KB7,4   :16 0,1,0

  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"placePiece","list":[{"key":"WQQQ","prev":"~Q1,1","post":"@KB1,4"}]},{"action":"placePiece","list":[{"key":"BKNN","prev":"~KN1,1","post":"@KB7,4"}]}],"Moves":[],"Gambits":[{"gambit":0,"action":"overlap","value":"hotspot","piece":"rook","src":"KB1,4","dst":"KB7,4","rays":"left_fore","advsqs":[[{"src":"KB1,4","srcTile":[2,-3,0],"quad":4,"perimeter":6,"stride":1,"area":49},{"src":"KB1,4","srcTile":[2,-3,0],"quad":1,"perimeter":6,"stride":1,"area":49}],[{"src":"KB1,4","srcTile":[2,-3,0],"quad":9,"perimeter":6,"stride":1,"area":49},{"src":"KB1,4","srcTile":[2,-3,0],"quad":10,"perimeter":6,"stride":1,"area":49}],[{"src":"KB1,4","srcTile":[2,-3,0],"quad":54,"perimeter":3,"stride":4,"area":16},{"src":"KB1,4","srcTile":[2,-3,0],"quad":58,"perimeter":3,"stride":4,"area":16}]],"opacity":0.5}],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
    {"action":"placePiece","list":[{"key":"WQQQ","prev":"~Q1,1","post":"@KB1,4"}]},
    {"action":"placePiece","list":[{"key":"BKNN","prev":"~KN1,1","post":"@KB7,4"}]}],
  "Moves":[],
  "Gambits":[
    {"gambit":0,"action":"overlap","value":"hotspot","piece":"rook","src":"KB1,4","dst":"KB7,4","rays":"left_fore","advsqs":[
      [{"src":"KB1,4","srcTile":[2,-3,0],"quad":4,"perimeter":6,"stride":1,"area":49},{"src":"KB1,4","srcTile":[2,-3,0],"quad":1,"perimeter":6,"stride":1,"area":49}],
      [{"src":"KB1,4","srcTile":[2,-3,0],"quad":9,"perimeter":6,"stride":1,"area":49},{"src":"KB1,4","srcTile":[2,-3,0],"quad":10,"perimeter":6,"stride":1,"area":49}],
      [ {"src":"KB1,4","srcTile":[2,-3,0],"quad":54,"perimeter":3,"stride":4,"area":16},
        {"src":"KB1,4","srcTile":[2,-3,0],"quad":58,"perimeter":3,"stride":4,"area":16}]],
      "opacity":0.5}],
  "AdvSqs":[]}

  1 Ohotspot D KB1,4 → KB7,4   :16 0,1,0
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],"Moves":[],"Gambits":[{"gambit":0,"action":"overlap","value":"hotspot","piece":"duke","src":"KB1,4","dst":"KB7,4","rays":[0,1,0],"advsqs":[[{"src":"KB1,4","srcTile":[2,-3,0],"quad":54,"perimeter":3,"stride":4,"area":16},{"src":"KB1,4","srcTile":[2,-3,0],"quad":58,"perimeter":3,"stride":4,"area":16}],[{"src":"KB1,4","srcTile":[2,-3,0],"quad":4,"perimeter":6,"stride":1,"area":49},{"src":"KB1,4","srcTile":[2,-3,0],"quad":1,"perimeter":6,"stride":1,"area":49}],[{"src":"KB1,4","srcTile":[2,-3,0],"quad":9,"perimeter":6,"stride":1,"area":49},{"src":"KB1,4","srcTile":[2,-3,0],"quad":10,"perimeter":6,"stride":1,"area":49}]],"opacity":0.5}],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard",
    "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
    "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],
  "Moves":[],
  "Gambits":[
    {"gambit":0,"action":"overlap","value":"hotspot","piece":"duke","src":"KB1,4","dst":"KB7,4","rays":[0,1,0],"advsqs":[
      [ {"src":"KB1,4","srcTile":[2,-3,0],"quad":54,"perimeter":3,"stride":4,"area":16},
        {"src":"KB1,4","srcTile":[2,-3,0],"quad":58,"perimeter":3,"stride":4,"area":16}],
      [{"src":"KB1,4","srcTile":[2,-3,0],"quad":4,"perimeter":6,"stride":1,"area":49},{"src":"KB1,4","srcTile":[2,-3,0],"quad":1,"perimeter":6,"stride":1,"area":49}],
      [{"src":"KB1,4","srcTile":[2,-3,0],"quad":9,"perimeter":6,"stride":1,"area":49},{"src":"KB1,4","srcTile":[2,-3,0],"quad":10,"perimeter":6,"stride":1,"area":49}]],
      "opacity":0.5}],
  "AdvSqs":[]}

 ### 8.5 Scenario: Hotspot -
  **1-0-0-11**

 ### 8.6 Scenario: Feynman
  **1-0-1-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],"Moves":[],"Gambits":[{"gambit":0,"action":"overlap","value":"Feynman","piece":"bishop","src":"KB4,4","dst":"KR6,6","rays":["LFU","RFU"],"advsqs":[{"src":"KB4,4","srcTile":[0,0,0],"quad":13,"perimeter":2,"stride":3,"opacity":0.5},{"src":"KB4,4","srcTile":[0,0,0],"quad":38,"perimeter":3,"stride":2,"opacity":0.5}],"opacity":0.5}],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}}],
  "Moves":[],
  "Gambits":[
    {"gambit":0,"action":"overlap","value":"Feynman","piece":"bishop","src":"KB4,4","dst":"KR6,6","rays":["LFU","RFU"],"advsqs":[
      {"src":"KB4,4","srcTile":[0,0,0],"quad":13,"perimeter":2,"stride":3,"opacity":0.5},
      {"src":"KB4,4","srcTile":[0,0,0],"quad":38,"perimeter":3,"stride":2,"opacity":0.5}],
      "opacity":0.5}],
  "AdvSqs":[]}



 ### 8.6 Scenario: Feynman - Stack
  **1-0-1-0**
  
