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


