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
  #### 2.3.0 Save: Move, Move, PxP, fission
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

## 3. Examples from Code
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

## 4. Exhaustive Moves
 ### 4.1 Listing
  ```
  Desired:
    1. P-KR4,4    S-KB3,3   move, stack
    2. D-QB3,3    B-QB3,3   decay, decay
    3. B-QB3,3    D-QB3,3   tele, tele
    4. D-QB1,1    B-QB1,1   join, join

  Undo mode:
    1  WKRP @KR2,2 P-KR4,4                                   move
    1                             BKBS @KB8,8 S-KB6,6        stack
    2  WQBD @QB1,1 D-QB3,3                                   decay
    2                             BQBB @QB8,8 B-QB6,6        decay
    3  WKBB @KB1,1 B-QB3,3                                   tele
    3                             BKBD @KB6,6 D-QB6,6        tele
    4  WKBD @KB1,1 D-QB1,1                                   join
    4                             BKBB @KB6,6 B-QB8,8        join

  Verbose mode:
    1  WKRP @KR2,2 P-KR4,4        BKBS @KB8,8 S-KB6,6        move, stack
    2  WQBD @QB1,1 D-QB3,3        BQBB @QB8,8 B-QB6,6        decay, decay
    3  WKBB @KB1,1 B-QB3,3        BKBD @KB6,6 D-QB6,6        tele, tele
    4  WKBD @KB1,1 D-QB1,1        BKBB @KB6,6 B-QB8,8        join, join

  Terse mode:
    1  P-KR4,4        S-KB6,6        move, stack
    2  D-QB3,3        B-QB6,6        decay, decay
    3  B-QB3,3        D-QB6,6        tele, tele
    4  D-QB1,1        B-QB8,8        join, join

  Relative coords:
    1  P-KR4,4        S-KB3,3        move, stack
    2  D-QB3,3        B-QB3,3        decay, decay
    3  B-QB3,3        D-QB3,3        tele, tele
    4  D-QB1,1        B-QB1,1        join, join
  ```

 ### 4.2 Save
  **2-8-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR4,4"}],"annotation":"move"},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKBD","prev":"@KB8,8","post":"@KB6,6"},{"key":"BKBB","prev":"@KB8,8","post":"@KB6,6"}],"annotation":"stack"},{"action":"move","turn":2,"player":"White","list":[{"key":"WQBD","prev":"@QB1,1","post":"@QB3,3"}],"annotation":"decay"},{"action":"move","turn":2,"player":"Black","list":[{"key":"BQBB","prev":"@QB8,8","post":"@QB6,6"}],"annotation":"decay"},{"action":"move","turn":3,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@QB3,3"}],"annotation":"tele"},{"action":"move","turn":3,"player":"Black","list":[{"key":"BKBD","prev":"@KB6,6","post":"@QB6,6"}],"annotation":"tele"},{"action":"move","turn":4,"player":"White","list":[{"key":"WKBD","prev":"@KB1,1","post":"@QB1,1"}],"annotation":"join"},{"action":"move","turn":4,"player":"Black","list":[{"key":"BKBB","prev":"@KB6,6","post":"@QB8,8"}],"annotation":"join"}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},
    {"action":"startingPos"}],
  "Moves":[
    {"action":"move","turn":1,"player":"White","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR4,4"}],"annotation":"move"},
    {"action":"move","turn":1,"player":"Black",
      "list":[
        {"key":"BKBD","prev":"@KB8,8","post":"@KB6,6"},
        {"key":"BKBB","prev":"@KB8,8","post":"@KB6,6"}],                                               "annotation":"stack"},
    {"action":"move","turn":2,"player":"White","list":[{"key":"WQBD","prev":"@QB1,1","post":"@QB3,3"}],"annotation":"decay"},
    {"action":"move","turn":2,"player":"Black","list":[{"key":"BQBB","prev":"@QB8,8","post":"@QB6,6"}],"annotation":"decay"},
    {"action":"move","turn":3,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@QB3,3"}],"annotation":"tele"},
    {"action":"move","turn":3,"player":"Black","list":[{"key":"BKBD","prev":"@KB6,6","post":"@QB6,6"}],"annotation":"tele"},
    {"action":"move","turn":4,"player":"White","list":[{"key":"WKBD","prev":"@KB1,1","post":"@QB1,1"}],"annotation":"join"},
    {"action":"move","turn":4,"player":"Black","list":[{"key":"BKBB","prev":"@KB6,6","post":"@QB8,8"}],"annotation":"join"}],
  "Gambits":[],"AdvSqs":[]}

## 5. Exhaustive Captures
 ### 5.1 Listing
  ```
    1. RxR      DxP       capture, decay
    2. BxP      D-KB1,1   decay, join
    3. B-KB1,1  NxS       join, CxS
    4. SxQ      SxS       SxC, SxS
  ```

 ### 5.2 Save
  **2-8-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"capture","turn":1,"player":"White","list":[{"key":"WKRR","prev":"@KR1,1","post":"@KR8,8"},{"key":"BKRR","prev":"@KR8,8","post":"~KR1,1"}],"annotation":"capture"},{"action":"capture","turn":1,"player":"Black","list":[{"key":"BKBD","prev":"@KB8,8","post":"@KB2,2"},{"key":"WKBP","prev":"@KB2,2","post":"@KB2,2"}],"annotation":"decay"},{"action":"capture","turn":2,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KB7,7"},{"key":"BKBP","prev":"@KB7,7","post":"@KB7,7"}],"annotation":"decay"},{"action":"move","turn":2,"player":"Black","list":[{"key":"BKBD","prev":"@KB2,2","post":"@KB8,8"}],"annotation":"join"},{"action":"move","turn":3,"player":"White","list":[{"key":"WKBB","prev":"@KB7,7","post":"@KB1,1"}],"annotation":"join"},{"action":"capture","turn":3,"player":"Black","list":[{"key":"BKNN","prev":"@KN8,8","post":"@KB1,1"},{"key":"WKBD","prev":"@KB1,1","post":"~KB1,2"},{"key":"WKBB","prev":"@KB1,1","post":"~KB2,1"}],"annotation":"CxS"},{"action":"capture","turn":4,"player":"White","list":[{"key":"WQBD","prev":"@QB1,1","post":"@Q8,8"},{"key":"WQBB","prev":"@QB1,1","post":"@Q8,8"},{"key":"BQQQ","prev":"@Q8,8","post":"~Q1,1"}],"annotation":"SxC"},{"action":"capture","turn":4,"player":"Black","list":[{"key":"BQBD","prev":"@QB8,8","post":"@Q8,8"},{"key":"BQBB","prev":"@QB8,8","post":"@Q8,8"},{"key":"WQBD","prev":"@Q8,8","post":"~QB1,2"},{"key":"WQBB","prev":"@Q8,8","post":"~QB2,1"}],"annotation":"SxS"}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},
    {"action":"startingPos"}],
  "Moves":[
    {"action":"capture","turn":1,"player":"White",
      "list":[
        {"key":"WKRR","prev":"@KR1,1","post":"@KR8,8"},
        {"key":"BKRR","prev":"@KR8,8","post":"~KR1,1"}],
      "annotation":"capture"},
    {"action":"capture","turn":1,"player":"Black",
      "list":[
        {"key":"BKBD","prev":"@KB8,8","post":"@KB2,2"},
        {"key":"WKBP","prev":"@KB2,2","post":"@KB2,2"}],
      "annotation":"decay"},
    {"action":"capture","turn":2,"player":"White",
      "list":[
        {"key":"WKBB","prev":"@KB1,1","post":"@KB7,7"},
        {"key":"BKBP","prev":"@KB7,7","post":"@KB7,7"}],
      "annotation":"decay"},
    {"action":"move","turn":2,"player":"Black",
      "list":[{"key":"BKBD","prev":"@KB2,2","post":"@KB8,8"}],
      "annotation":"join"},
    {"action":"move","turn":3,"player":"White",
      "list":[{"key":"WKBB","prev":"@KB7,7","post":"@KB1,1"}],
      "annotation":"join"},
    {"action":"capture","turn":3,"player":"Black",
      "list":[
        {"key":"BKNN","prev":"@KN8,8","post":"@KB1,1"},
        {"key":"WKBD","prev":"@KB1,1","post":"~KB1,2"},
        {"key":"WKBB","prev":"@KB1,1","post":"~KB2,1"}],
      "annotation":"CxS"},
    {"action":"capture","turn":4,"player":"White",
      "list":[
        {"key":"WQBD","prev":"@QB1,1","post":"@Q8,8"},
        {"key":"WQBB","prev":"@QB1,1","post":"@Q8,8"},
        {"key":"BQQQ","prev":"@Q8,8","post":"~Q1,1"}],
      "annotation":"SxC"},
    {"action":"capture","turn":4,"player":"Black",
      "list":[
        {"key":"BQBD","prev":"@QB8,8","post":"@Q8,8"},
        {"key":"BQBB","prev":"@QB8,8","post":"@Q8,8"},
        {"key":"WQBD","prev":"@Q8,8","post":"~QB1,2"},
        {"key":"WQBB","prev":"@Q8,8","post":"~QB2,1"}],
      "annotation":"SxS"}],
  "Gambits":[],"AdvSqs":[]}

## 6. Exhaustive Fissions
 ### 6.1 Kingside Stacks
  ```
  1  WKBS @KB1,1 S-KB3,3-KB4,4                             fissMM
  1                             BKBS @KB8,8 S-KB6,6-KB5,5  fissMM

  ```
  **2-2-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"fission","turn":1,"player":"White","list":[{"key":"WKBD","prev":"@KB1,1","post":"@KB4,4"},{"key":"WKBB","prev":"@KB1,1","post":"@KB3,3"}],"annotation":"fissMM"},{"action":"fission","turn":1,"player":"Black","list":[{"key":"BKBB","prev":"@KB8,8","post":"@KB6,6"},{"key":"BKBD","prev":"@KB8,8","post":"@KB5,5"}],"annotation":"fissMM"}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},
    {"action":"startingPos"}],
  "Moves":[
    {"action":"fission","turn":1,"player":"White",
      "list":[
        {"key":"WKBD","prev":"@KB1,1","post":"@KB4,4"},
        {"key":"WKBB","prev":"@KB1,1","post":"@KB3,3"}],
      "annotation":"fissMM"},
    {"action":"fission","turn":1,"player":"Black",
      "list":[
        {"key":"BKBB","prev":"@KB8,8","post":"@KB6,6"},
        {"key":"BKBD","prev":"@KB8,8","post":"@KB5,5"}],
      "annotation":"fissMM"}],
  "Gambits":[],"AdvSqs":[]}

 ### 6.2 JJ & MJ with Different B/D Order
  ```
  1  WKBS @KB1,1 S-KB3,3-KB4,4                             fissMM
  1                             BKBS @KB8,8 S-KB6,6-KB5,5  fissMM
  2  WQBS @QB1,1 S-KB4,4-KB3,3                             fissJJ
  2                             BQBS @QB8,8 S-KB5,5-KB7,5  fissMJ

  ```
  **2-4-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"fission","turn":1,"player":"White","list":[{"key":"WKBD","prev":"@KB1,1","post":"@KB4,4"},{"key":"WKBB","prev":"@KB1,1","post":"@KB3,3"}],"annotation":"fissMM"},{"action":"fission","turn":1,"player":"Black","list":[{"key":"BKBB","prev":"@KB8,8","post":"@KB6,6"},{"key":"BKBD","prev":"@KB8,8","post":"@KB5,5"}],"annotation":"fissMM"},{"action":"fission","turn":2,"player":"White","list":[{"key":"WQBB","prev":"@QB1,1","post":"@KB4,4"},{"key":"WQBD","prev":"@QB1,1","post":"@KB3,3"}],"annotation":"fissJJ"},{"action":"fission","turn":2,"player":"Black","list":[{"key":"BQBD","prev":"@QB8,8","post":"@KB7,5"},{"key":"BQBB","prev":"@QB8,8","post":"@KB5,5"}],"annotation":"fissMJ"}],"Gambits":[],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},
    {"action":"startingPos"}],
  "Moves":[
    {"action":"fission","turn":1,"player":"White",
      "list":[
        {"key":"WKBD","prev":"@KB1,1","post":"@KB4,4"},
        {"key":"WKBB","prev":"@KB1,1","post":"@KB3,3"}],
      "annotation":"fissMM"},
    {"action":"fission","turn":1,"player":"Black",
      "list":[
        {"key":"BKBB","prev":"@KB8,8","post":"@KB6,6"},
        {"key":"BKBD","prev":"@KB8,8","post":"@KB5,5"}],
      "annotation":"fissMM"},
    {"action":"fission","turn":2,"player":"White",
      "list":[
        {"key":"WQBB","prev":"@QB1,1","post":"@KB4,4"},
        {"key":"WQBD","prev":"@QB1,1","post":"@KB3,3"}],
      "annotation":"fissJJ"},
    {"action":"fission","turn":2,"player":"Black",
      "list":[
        {"key":"BQBD","prev":"@QB8,8","post":"@KB7,5"},
        {"key":"BQBB","prev":"@QB8,8","post":"@KB5,5"}],
      "annotation":"fissMJ"}],
  "Gambits":[],"AdvSqs":[]}


### 6.3 Save - Fission S-KB3,3/KB4,4   P-KB3,3
  **2-2-0-0**
  {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"fission","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KB3,3"},{"key":"WKBD","prev":"@KB1,1","post":"@KB4,4"}],"annotation":"fissMM"},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKBP","prev":"@KB7,7","post":"@KB6,6"}],"annotation":"move"}],"Gambits":[],"AdvSqs":[]}



## Development - Eligibility POC, Legality Incidental
 ### Moves **2-4-0-0** 1. P-KR4,4; S-KB5,5;  2. PxP  SxN
  {"Setup":[
    {"action":"makeBoard",
    "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
    "nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},
    {"action":"startingPos"}],
  "Moves":[
    {"action":"move","turn":1,"player":"White",
      "list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR4,4"}],
      "annotation":"move"},
    {"action":"move","turn":1,"player":"Black",
      "list":[
        {"key":"BKBD","prev":"@KB8,8","post":"@KB5,5"},
        {"key":"BKBB","prev":"@KB8,8","post":"@KB5,5"}],
      "annotation":"stackMov"},
    {"action":"capture","turn":2,"player":"White",
      "list":[
        {"key":"WKRP","prev":"@KR4,4","post":"@KR7,7"},
        {"key":"BKRP","prev":"@KR7,7","post":"~KR2,2"}],
      "annotation":"capture"},
    {"action":"capture","turn":2,"player":"Black",
      "list":[
        {"key":"BKBB","prev":"@KB5,5","post":"@KN1,1"},
        {"key":"BKBD","prev":"@KB5,5","post":"@KN1,1"},
        {"key":"WKNN","prev":"@KN1,1","post":"~KN1,1"}],
      "annotation":"stackCap"}],
  "Gambits":[],"AdvSqs":[]}

  {"Setup":[
    {"action":"makeBoard",
      "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
      "nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},
    {"action":"startingPos"}],
  "Moves":[
    {"action":"move","turn":1,"player":"White","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR4,4"}],"annotation":"move"},
    {"action":"move","turn":1,"player":"Black",
      "list":[
        {"key":"BKBD","prev":"@KB8,8","post":"@KB5,5"},
        {"key":"BKBB","prev":"@KB8,8","post":"@KB5,5"}],
      "annotation":"stackMov"},
    {"action":"capture","turn":2,"player":"White",
      "list":[
        {"key":"WKRP","prev":"@KR4,4","post":"@KR7,7"},
        {"key":"BKRP","prev":"@KR7,7","post":"~KR2,2"}],
      "annotation":"capture"},
    {"action":"capture","turn":2,"player":"Black",
      "list":[
        {"key":"BKBB","prev":"@KB5,5","post":"@KN1,1"},
        {"key":"BKBD","prev":"@KB5,5","post":"@KN1,1"},
        {"key":"WKNN","prev":"@KN1,1","post":"~KN1,1"}],
      "annotation":"stackCap"}],
  "Gambits":[],"AdvSqs":[]}

 ### Moves **2-2-0-0 1. P-KR4,4; S-KB5,5;  2. 
 {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR4,4"}],"annotation":"move"},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKBD","prev":"@KB8,8","post":"@KB5,5"},{"key":"BKBB","prev":"@KB8,8","post":"@KB5,5"}],"annotation":"stackMov"}],"Gambits":[],"AdvSqs":[]}

 {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8-8-8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],
 "Moves":[
    {"action":
      "move","turn":1,
      "player":"White",
      "list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR4,4"}],
      "annotation":"move"}],
 "Gambits":[],"AdvSqs":[]}
