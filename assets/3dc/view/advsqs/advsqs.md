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

## 5. Examples
 ### 5.1 Scenario: 
  **Setup Listing**

  **3-0-0-8**

 ### 5.2 Scenario: 
  **Setup Listing**

  **3-0-0-8**

 ### 5.3 Scenario: 
  **Setup Listing**

  **3-0-0-8**

 ### 5.4 Scenario: 
  **Setup Listing**

  **3-0-0-8**

 ### 5.5 Scenario: 
  **Setup Listing**

  **3-0-0-8**

 ### 5.6 Scenario: 
  **Setup Listing**

  **3-0-0-8**


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

