# Moves Spec (view)
  Desc

## 1. Purpose
  text

## 2. Descriptions
  - All moves consist of a list of piece transactions: {key, prev, post}.
  - Pre and post are tiles (board notation).
  - Complex moves contain a list of piece transactions:
    - [{key, prev, post}, {key, prev, post}, {key, prev, post}].
  - Each list must contain enough information to support is reverse operation.

 ### 2.1 2D Shorthand
  ```  
    1. P-K4,4   P-Q4,4
    2. PxP      etc.
  ```
  text

 ### 2.2 Trial 3D Shorthand
  ```  
    1. WKRP P@KR2,2 - P@KR4,4   BKNP P@KR7,7 - P@KR5,5
    2. WKRP P@KR4,4 x P@KR5,5   etc.
  ```
  Or more succinctly
  ```  
    1. WKRP @KR2,2 - @KR4,4       BKNP @KN7,7 - @KN5,5
    2. WKRP @KR4,4 x BKNP @KN5,5  BKBS @KB8,8 - B@KB5,5 D@KB6,6
    3. WKBS @KB1,1 - D@KB3,3 B@KB4,4             etc.
  ```
  Or event stronger
  ```  
    1. WKRP @KR2,2 - @KR4,4       BKNP @KN7,7 - @KN5,5
    2. WKRP @KR4,4 x BKNP @KN5,5  BKBS @KB8,8 - B@KB5,5 D@KB6,6
    3. WKBS @KB1,1 - D@KB3,3 
                   - B@KB4,4      etc.
    4. etc
  ```
  Then mixed fission captures/moves might even fit...
  ```  
    1. WKRP @KR2,2 - @KR4,4       BKNP @KN7,7 - @KN5,5
    2. WKRP @KR4,4 x BKNP @KN5,5  BKBS @KB8,8 - B@KB5,5 D@KB6,6
    3. WKBS @KB1,1 x BQBS D@QB8,8 
                   - B@KB4,4      etc.
    4. etc
  ```

 ### 2.3 Entry
  ```
    "Moves":[
      {"action":"move","turn":1,"player":"White","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR4,4"}]},
      {"action":"move","turn":1,"player":"Black","list":[{"key":"BKNP","prev":"@KN7,7","post":"@KN5,5"}]},
      {"action":"capture","turn":2,"player":"White",
        "list":[
          {"key":"WKRP","prev":"@KR4,4","post":"@KN5,5"},
          {"key":"BKNP","prev":"@KN5,5","post":"~KN2,2"}]
        }
      ],
  ```
  #### 2.5.0 Save: Move, Move, PxP, fission
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],
    "Moves":[
      {"action":"move","turn":1,"player":"White","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR4,4"}]},
      {"action":"move","turn":1,"player":"Black","list":[{"key":"BKNP","prev":"@KN7,7","post":"@KN5,5"}]},
      {"action":"capture","turn":2,"player":"White",
        "list":[
          {"key":"WKRP","prev":"@KR4,4","post":"@KN5,5"},
          {"key":"BKNP","prev":"@KN5,5","post":"~KN2,2"}]
        },
      {"action":"fission","turn":2,"player":"Black",
        "list":[
          {"key":"BKBB","prev":"@KB8,8","post":"@KB5,5"},
          {"key":"BKBD","prev":"@KB8,8","post":"@KB6,6"}]
        }
      ],
    "Gambits":[],"AdvSqs":[]}



## Examples from Code

     "moves":     { "schema": "key prev(s) - post(s)  (8)",
      "simple":    { "string": "WKRP P@KR2,2 - P@KR4,4", "pieces": 1, "tiles": 1 },
      "stackMov":  { "string": "WKBS S@KR2,2 - S@KR4,4", "pieces": 2, "tiles": 1 },
      "bDecayMov": { "string": "WKBS B@KB2,2 - B@KB4,4", "pieces": 1, "tiles": 1 },
      "dDecayMov": { "string": "WKBS D@KB2,2 - D@KB4,4", "pieces": 1, "tiles": 1 },
      "bCombine":  { "string": "WKBB B@KB2,2 - S@KB4,4", "pieces": 2, "tiles": 0 },
      "dCombine":  { "string": "WKBD D@KB2,2 - S@KB4,4", "pieces": 2, "tiles": 0 },
      "bTeleport": { "string": "WKBS B@KB2,2 - S@KB4,4", "pieces": 2, "tiles": 0 },
      "dTeleport": { "string": "WKBS D@KB2,2 - S@KB4,4", "pieces": 2, "tiles": 0 },
     }
