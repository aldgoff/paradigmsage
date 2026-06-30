# Moves Spec (view)
  Describe the view layer of the setup feature.
  - Basic intent of the move panel.
  - Some examples of moves that can be loaded.

## 1. Purpose
  Make moves in the game.

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
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],
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
 ### 3.1 Entries
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

 ### 3.2 Listing Lines
  ```
  Desired:
    1. P-KR4,4    S-KB3,3   move, stack
    2. D-QB3,3    B-QB3,3   decay, decay
    3. B-QB3,3    D-QB3,3   tele, tele
    4. D-QB1,1    B-QB1,1   join, join

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

## 4. Exhaustive Moves
 ### 4.1 ✅ Secnario: Move piece and stack, decay stack, teleport, join.
  ```
    1  WKRP @KR2,2 P-KR4,4        BKBS @KB8,8 S-KB6,6         move,stack
    2  WQBD @QB1,1 D-QB3,3        BQBB @QB8,8 B-QB6,6         decay,decay
    3  WKBB @KB1,1 B-QB3,3        BKBD @KB6,6 D-QB6,6         tele,tele
    4  WKBD @KB1,1 D-QB1,1        BKBB @KB6,6 B-QB8,8         join,join
  ```
  **2-8-0-0**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR4,4"}],"annotation":"move"},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKBD","prev":"@KB8,8","post":"@KB6,6"},{"key":"BKBB","prev":"@KB8,8","post":"@KB6,6"}],"annotation":"stack"},{"action":"move","turn":2,"player":"White","list":[{"key":"WQBD","prev":"@QB1,1","post":"@QB3,3"}],"annotation":"decay"},{"action":"move","turn":2,"player":"Black","list":[{"key":"BQBB","prev":"@QB8,8","post":"@QB6,6"}],"annotation":"decay"},{"action":"move","turn":3,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@QB3,3"}],"annotation":"tele"},{"action":"move","turn":3,"player":"Black","list":[{"key":"BKBD","prev":"@KB6,6","post":"@QB6,6"}],"annotation":"tele"},{"action":"move","turn":4,"player":"White","list":[{"key":"WKBD","prev":"@KB1,1","post":"@QB1,1"}],"annotation":"join"},{"action":"move","turn":4,"player":"Black","list":[{"key":"BKBB","prev":"@KB6,6","post":"@QB8,8"}],"annotation":"join"}],"Gambits":[],"AdvSqs":[]}

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
        "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
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
 ### 5.1 ✅ Scenario: Simple, decay, join, stack capture permutations
  ```
    1  WKRR @KR1,1 RxR @KR8,8     BKBD @KB8,8 DxP @KB2,2      capture,decay
    2  WKBB @KB1,1 BxP @KB7,7     BKBD @KB2,2 D-KB8,8         decay,join
    3  WKBB @KB7,7 B-KB1,1        BKNN @KN8,8 NxS @KB1,1      join,CxS
    4  WQBS @QB1,1 SxQ @Q8,8      BQBS @QB8,8 SxS @Q8,8       SxC,SxS
  ```
  **2-8-0-0**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"capture","turn":1,"player":"White","list":[{"key":"WKRR","prev":"@KR1,1","post":"@KR8,8"},{"key":"BKRR","prev":"@KR8,8","post":"~KR1,1"}],"annotation":"capture"},{"action":"capture","turn":1,"player":"Black","list":[{"key":"BKBD","prev":"@KB8,8","post":"@KB2,2"},{"key":"WKBP","prev":"@KB2,2","post":"@KB2,2"}],"annotation":"decay"},{"action":"capture","turn":2,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KB7,7"},{"key":"BKBP","prev":"@KB7,7","post":"@KB7,7"}],"annotation":"decay"},{"action":"move","turn":2,"player":"Black","list":[{"key":"BKBD","prev":"@KB2,2","post":"@KB8,8"}],"annotation":"join"},{"action":"move","turn":3,"player":"White","list":[{"key":"WKBB","prev":"@KB7,7","post":"@KB1,1"}],"annotation":"join"},{"action":"capture","turn":3,"player":"Black","list":[{"key":"BKNN","prev":"@KN8,8","post":"@KB1,1"},{"key":"WKBD","prev":"@KB1,1","post":"~KB1,2"},{"key":"WKBB","prev":"@KB1,1","post":"~KB2,1"}],"annotation":"CxS"},{"action":"capture","turn":4,"player":"White","list":[{"key":"WQBD","prev":"@QB1,1","post":"@Q8,8"},{"key":"WQBB","prev":"@QB1,1","post":"@Q8,8"},{"key":"BQQQ","prev":"@Q8,8","post":"~Q1,1"}],"annotation":"SxC"},{"action":"capture","turn":4,"player":"Black","list":[{"key":"BQBD","prev":"@QB8,8","post":"@Q8,8"},{"key":"BQBB","prev":"@QB8,8","post":"@Q8,8"},{"key":"WQBD","prev":"@Q8,8","post":"~QB1,2"},{"key":"WQBB","prev":"@Q8,8","post":"~QB2,1"}],"annotation":"SxS"}],"Gambits":[],"AdvSqs":[]}

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
        "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
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
 ### 6.1 ✅ Scenario: Stack (fissMM,fissJJ) Kingside Stacks w/ Recombination either click order
  ```
    1  WKBS @KB1,1 B-KB3,3 D-KB4,4        BKBS @KB8,8 D-KB6,6 B-KB5,5         fissMM,fissMM
    2  WQBS @QB1,1 B-KB4,4 D-KB3,3        BQBS @QB8,8 D-KB5,5 B-KB6,6         fissJJ,fissJJ
  ```
  **2-4-0-0**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"fission","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KB3,3"},{"key":"WKBD","prev":"@KB1,1","post":"@KB4,4"}],"annotation":"fissMM"},{"action":"fission","turn":1,"player":"Black","list":[{"key":"BKBD","prev":"@KB8,8","post":"@KB6,6"},{"key":"BKBB","prev":"@KB8,8","post":"@KB5,5"}],"annotation":"fissMM"},{"action":"fission","turn":2,"player":"White","list":[{"key":"WQBB","prev":"@QB1,1","post":"@KB4,4"},{"key":"WQBD","prev":"@QB1,1","post":"@KB3,3"}],"annotation":"fissJJ"},{"action":"fission","turn":2,"player":"Black","list":[{"key":"BQBD","prev":"@QB8,8","post":"@KB5,5"},{"key":"BQBB","prev":"@QB8,8","post":"@KB6,6"}],"annotation":"fissJJ"}],"Gambits":[],"AdvSqs":[]}

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
        "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"startingPos"}],
    "Moves":[
      {"action":"fission","turn":1,"player":"White",
        "list":[
          {"key":"WKBB","prev":"@KB1,1","post":"@KB3,3"},
          {"key":"WKBD","prev":"@KB1,1","post":"@KB4,4"}],
        "annotation":"fissMM"},
      {"action":"fission","turn":1,"player":"Black",
        "list":[
          {"key":"BKBD","prev":"@KB8,8","post":"@KB6,6"},
          {"key":"BKBB","prev":"@KB8,8","post":"@KB5,5"}],
        "annotation":"fissMM"},
      {"action":"fission","turn":2,"player":"White",
        "list":[
          {"key":"WQBB","prev":"@QB1,1","post":"@KB4,4"},
          {"key":"WQBD","prev":"@QB1,1","post":"@KB3,3"}],
        "annotation":"fissJJ"},
      {"action":"fission","turn":2,"player":"Black",
        "list":[
          {"key":"BQBD","prev":"@QB8,8","post":"@KB5,5"},
          {"key":"BQBB","prev":"@QB8,8","post":"@KB6,6"}],
        "annotation":"fissJJ"}],
    "Gambits":[],"AdvSqs":[]}

 ### 6.2 ✅ Scenario: Stack (fissMC, fissCM) B|D in opposite click orders.
  ```
    1  WKBS @KB1,1 BxP @KR6,6 D-KR7,7     BKBS @KB8,8 DxP @KR3,3 B-KR2,2      fissMC,fissMC
    2  WQBS @QB1,1 B-QB7,7 DxP @QB6,6     BQBS @QB8,8 D-QB2,2 BxP @QB3,3      fissCM,fissCM
  ```
  **2-4-0-0**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"fission","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KR6,6"},{"key":"WKBD","prev":"@KB1,1","post":"@KR7,7"},{"key":"BKRP","prev":"@KR7,7","post":"~KR2,2"}],"annotation":"fissMC"},{"action":"fission","turn":1,"player":"Black","list":[{"key":"BKBD","prev":"@KB8,8","post":"@KR3,3"},{"key":"BKBB","prev":"@KB8,8","post":"@KR2,2"},{"key":"WKRP","prev":"@KR2,2","post":"~KR2,2"}],"annotation":"fissMC"},{"action":"fission","turn":2,"player":"White","list":[{"key":"WQBB","prev":"@QB1,1","post":"@QB7,7"},{"key":"WQBD","prev":"@QB1,1","post":"@QB6,6"},{"key":"BQBP","prev":"@QB7,7","post":"~QB2,2"}],"annotation":"fissCM"},{"action":"fission","turn":2,"player":"Black","list":[{"key":"BQBD","prev":"@QB8,8","post":"@QB2,2"},{"key":"BQBB","prev":"@QB8,8","post":"@QB3,3"},{"key":"WQBP","prev":"@QB2,2","post":"~QB2,2"}],"annotation":"fissCM"}],"Gambits":[],"AdvSqs":[]}

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
          "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"startingPos"}],
    "Moves":[
      {"action":"fission","turn":1,"player":"White",
        "list":[
          {"key":"WKBB","prev":"@KB1,1","post":"@KR6,6"},
          {"key":"WKBD","prev":"@KB1,1","post":"@KR7,7"},
          {"key":"BKRP","prev":"@KR7,7","post":"~KR2,2"}],
        "annotation":"fissMC"},
      {"action":"fission","turn":1,"player":"Black",
        "list":[
          {"key":"BKBD","prev":"@KB8,8","post":"@KR3,3"},
          {"key":"BKBB","prev":"@KB8,8","post":"@KR2,2"},
          {"key":"WKRP","prev":"@KR2,2","post":"~KR2,2"}],
        "annotation":"fissMC"},
      {"action":"fission","turn":2,"player":"White",
        "list":[
          {"key":"WQBB","prev":"@QB1,1","post":"@QB7,7"},
          {"key":"WQBD","prev":"@QB1,1","post":"@QB6,6"},
          {"key":"BQBP","prev":"@QB7,7","post":"~QB2,2"}],
        "annotation":"fissCM"},
      {"action":"fission","turn":2,"player":"Black",
        "list":[
          {"key":"BQBD","prev":"@QB8,8","post":"@QB2,2"},
          {"key":"BQBB","prev":"@QB8,8","post":"@QB3,3"},
          {"key":"WQBP","prev":"@QB2,2","post":"~QB2,2"}],
        "annotation":"fissCM"}],
    "Gambits":[],"AdvSqs":[]}

 ### 6.3 ✅ Scenario: Stack (fissMM, ..., fissMJ, fissJM, fissJJ)
  ```
    1  WKBS @KB1,1 B-KB3,3 D-KB4,4        BKBS @KB8,8 D-KB6,6 B-KB5,5         fissMM,fissMM
    2  WQBS @QB1,1 B-K3,3 D-KB3,3         BQBS @QB8,8 B-KB6,6 D-K6,6          fissMJ,fissJM
    3  WKBS @KB3,3 B-KB4,4 D-K3,3                                              fissJJ
  ```
  **2-5-0-0**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"fission","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KB3,3"},{"key":"WKBD","prev":"@KB1,1","post":"@KB4,4"}],"annotation":"fissMM"},{"action":"fission","turn":1,"player":"Black","list":[{"key":"BKBD","prev":"@KB8,8","post":"@KB6,6"},{"key":"BKBB","prev":"@KB8,8","post":"@KB5,5"}],"annotation":"fissMM"},{"action":"fission","turn":2,"player":"White","list":[{"key":"WQBB","prev":"@QB1,1","post":"@K3,3"},{"key":"WQBD","prev":"@QB1,1","post":"@KB3,3"}],"annotation":"fissMJ"},{"action":"fission","turn":2,"player":"Black","list":[{"key":"BQBB","prev":"@QB8,8","post":"@KB6,6"},{"key":"BQBD","prev":"@QB8,8","post":"@K6,6"}],"annotation":"fissJM"},{"action":"fission","turn":3,"player":"White","list":[{"key":"WKBB","prev":"@KB3,3","post":"@KB4,4"},{"key":"WQBD","prev":"@KB3,3","post":"@K3,3"}],"annotation":"fissJJ"}],"Gambits":[],"AdvSqs":[]}

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
        "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"startingPos"}],
    "Moves":[
      {"action":"fission","turn":1,"player":"White",
        "list":[
          {"key":"WKBB","prev":"@KB1,1","post":"@KB3,3"},
          {"key":"WKBD","prev":"@KB1,1","post":"@KB4,4"}],
        "annotation":"fissMM"},
      {"action":"fission","turn":1,"player":"Black",
        "list":[
          {"key":"BKBD","prev":"@KB8,8","post":"@KB6,6"},
          {"key":"BKBB","prev":"@KB8,8","post":"@KB5,5"}],
        "annotation":"fissMM"},
      {"action":"fission","turn":2,"player":"White",
        "list":[
          {"key":"WQBB","prev":"@QB1,1","post":"@K3,3"},
          {"key":"WQBD","prev":"@QB1,1","post":"@KB3,3"}],
        "annotation":"fissMJ"},{
        "action":"fission","turn":2,"player":"Black",
          "list":[
            {"key":"BQBB","prev":"@QB8,8","post":"@KB6,6"},
            {"key":"BQBD","prev":"@QB8,8","post":"@K6,6"}],
          "annotation":"fissJM"},{
        "action":"fission","turn":3,"player":"White",
          "list":[
            {"key":"WKBB","prev":"@KB3,3","post":"@KB4,4"},
            {"key":"WQBD","prev":"@KB3,3","post":"@K3,3"}],
          "annotation":"fissJJ"}],
    "Gambits":[],"AdvSqs":[]}

 ### 6.4 ✅ Scenario: Stack (fissMC, fissMS, ..., fissJC, ..., fissJS).
  ```
    1  WKBS @KB1,1 BxP @KR6,6 D-KR7,7     BKBS @KB8,8 DxS @QB3,3 B-QB1,1      fissMC,fissMS
    2  WKBD @KR7,7 D-KR6,6                BQBS @QB8,8 BxN @QB3,3 D-QN1,1      join,fissJC
    3  WKRR @KR1,1 R-KR3,3                BQBS @QB3,3 BxS @QN1,1 D-KR6,6      move,fissJS
  ```
  **2-6-0-0**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"fission","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KR6,6"},{"key":"WKBD","prev":"@KB1,1","post":"@KR7,7"},{"key":"BKRP","prev":"@KR7,7","post":"~KR2,2"}],"annotation":"fissMC"},{"action":"fission","turn":1,"player":"Black","list":[{"key":"BKBD","prev":"@KB8,8","post":"@QB3,3"},{"key":"BKBB","prev":"@KB8,8","post":"@QB1,1"},{"key":"WQBB","prev":"@QB1,1","post":"~QB2,1"},{"key":"WQBD","prev":"@QB1,1","post":"~QB1,2"}],"annotation":"fissMS"},{"action":"move","turn":2,"player":"White","list":[{"key":"WKBD","prev":"@KR7,7","post":"@KR6,6"}],"annotation":"join"},{"action":"fission","turn":2,"player":"Black","list":[{"key":"BQBB","prev":"@QB8,8","post":"@QB3,3"},{"key":"BQBD","prev":"@QB8,8","post":"@QN1,1"},{"key":"WQNN","prev":"@QN1,1","post":"~QN1,1"}],"annotation":"fissJC"},{"action":"move","turn":3,"player":"White","list":[{"key":"WKRR","prev":"@KR1,1","post":"@KR3,3"}],"annotation":"move"},{"action":"fission","turn":3,"player":"Black","list":[{"key":"BQBB","prev":"@QB3,3","post":"@QN1,1"},{"key":"BKBD","prev":"@QB3,3","post":"@KR6,6"},{"key":"WKBB","prev":"@KR6,6","post":"~KB2,1"},{"key":"WKBD","prev":"@KR6,6","post":"~KB1,2"}],"annotation":"fissJS"}],"Gambits":[],"AdvSqs":[]}

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
          "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"startingPos"}],
    "Moves":[
      {"action":"fission","turn":1,"player":"White",
        "list":[
          {"key":"WKBB","prev":"@KB1,1","post":"@KR6,6"},
          {"key":"WKBD","prev":"@KB1,1","post":"@KR7,7"},
          {"key":"BKRP","prev":"@KR7,7","post":"~KR2,2"}],
        "annotation":"fissMC"},
      {"action":"fission","turn":1,"player":"Black",
        "list":[
          {"key":"BKBD","prev":"@KB8,8","post":"@QB3,3"},
          {"key":"BKBB","prev":"@KB8,8","post":"@QB1,1"},
          {"key":"WQBB","prev":"@QB1,1","post":"~QB2,1"},
          {"key":"WQBD","prev":"@QB1,1","post":"~QB1,2"}],
        "annotation":"fissMS"},
      {"action":"move","turn":2,"player":"White",
        "list":[
          {"key":"WKBD","prev":"@KR7,7","post":"@KR6,6"}],
        "annotation":"join"},
      {"action":"fission","turn":2,"player":"Black",
        "list":[
          {"key":"BQBB","prev":"@QB8,8","post":"@QB3,3"},
          {"key":"BQBD","prev":"@QB8,8","post":"@QN1,1"},
          {"key":"WQNN","prev":"@QN1,1","post":"~QN1,1"}],
        "annotation":"fissJC"},
      {"action":"move","turn":3,"player":"White",
        "list":[
          {"key":"WKRR","prev":"@KR1,1","post":"@KR3,3"}],
        "annotation":"move"},
      {"action":"fission","turn":3,"player":"Black",
        "list":[
          {"key":"BQBB","prev":"@QB3,3","post":"@QN1,1"},
          {"key":"BKBD","prev":"@QB3,3","post":"@KR6,6"},
          {"key":"WKBB","prev":"@KR6,6","post":"~KB2,1"},
          {"key":"WKBD","prev":"@KR6,6","post":"~KB1,2"}],
        "annotation":"fissJS"}],
    "Gambits":[],"AdvSqs":[]}

 ### 6.5 ✅ Scenario: Stack (fissCM, fissSM, ..., fissCJ, ..., fissSJ).
  ```
    1  WKBS @KB1,1 B-KB7,7 DxP @KB6,6     BKBS @KB8,8 B-QB1,1 DxB @QB3,3      fissCM,fissSM
    2  WKBB @KB7,7 B-KB6,6                BQBS @QB8,8 B-QB2,2 DxP @QB1,1      join,fissCJ
    3  WKRP @KR2,2 P-KR4,4                BKBS @QB1,1 B-KB6,6 DxB @QB2,2      move,fissSJ
  ```
  **2-6-0-0**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"fission","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KB7,7"},{"key":"WKBD","prev":"@KB1,1","post":"@KB6,6"},{"key":"BKBP","prev":"@KB7,7","post":"~KB2,2"}],"annotation":"fissCM"},{"action":"fission","turn":1,"player":"Black","list":[{"key":"BKBB","prev":"@KB8,8","post":"@QB1,1"},{"key":"BKBD","prev":"@KB8,8","post":"@QB3,3"},{"key":"WQBB","prev":"@QB1,1","post":"~QB2,1"},{"key":"WQBD","prev":"@QB1,1","post":"~QB1,2"}],"annotation":"fissSM"},{"action":"move","turn":2,"player":"White","list":[{"key":"WKBB","prev":"@KB7,7","post":"@KB6,6"}],"annotation":"join"},{"action":"fission","turn":2,"player":"Black","list":[{"key":"BQBB","prev":"@QB8,8","post":"@QB2,2"},{"key":"BQBD","prev":"@QB8,8","post":"@QB1,1"},{"key":"WQBP","prev":"@QB2,2","post":"~QB2,2"}],"annotation":"fissCJ"},{"action":"move","turn":3,"player":"White","list":[{"key":"WKRP","prev":"@KR2,2","post":"@KR4,4"}],"annotation":"move"},{"action":"fission","turn":3,"player":"Black","list":[{"key":"BKBB","prev":"@QB1,1","post":"@KB6,6"},{"key":"BQBD","prev":"@QB1,1","post":"@QB2,2"},{"key":"WKBB","prev":"@KB6,6","post":"~KB2,1"},{"key":"WKBD","prev":"@KB6,6","post":"~KB1,2"}],"annotation":"fissSJ"}],"Gambits":[],"AdvSqs":[]}

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
          "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"startingPos"}],
    "Moves":[
      {"action":"fission","turn":1,"player":"White",
        "list":[
          {"key":"WKBB","prev":"@KB1,1","post":"@KB7,7"},
          {"key":"WKBD","prev":"@KB1,1","post":"@KB6,6"},
          {"key":"BKBP","prev":"@KB7,7","post":"~KB2,2"}],
        "annotation":"fissCM"},
      {"action":"fission","turn":1,"player":"Black",
        "list":[
          {"key":"BKBB","prev":"@KB8,8","post":"@QB1,1"},
          {"key":"BKBD","prev":"@KB8,8","post":"@QB3,3"},
          {"key":"WQBB","prev":"@QB1,1","post":"~QB2,1"},
          {"key":"WQBD","prev":"@QB1,1","post":"~QB1,2"}],
        "annotation":"fissSM"},
      {"action":"move","turn":2,"player":"White",
        "list":[
          {"key":"WKBB","prev":"@KB7,7","post":"@KB6,6"}],
        "annotation":"join"},
      {"action":"fission","turn":2,"player":"Black",
        "list":[
          {"key":"BQBB","prev":"@QB8,8","post":"@QB2,2"},
          {"key":"BQBD","prev":"@QB8,8","post":"@QB1,1"},
          {"key":"WQBP","prev":"@QB2,2","post":"~QB2,2"}],
        "annotation":"fissCJ"},
      {"action":"move","turn":3,"player":"White",
        "list":[
          {"key":"WKRP","prev":"@KR2,2","post":"@KR4,4"}],
        "annotation":"move"},
      {"action":"fission","turn":3,"player":"Black",
        "list":[
          {"key":"BKBB","prev":"@QB1,1","post":"@KB6,6"},
          {"key":"BQBD","prev":"@QB1,1","post":"@QB2,2"},
          {"key":"WKBB","prev":"@KB6,6","post":"~KB2,1"},
          {"key":"WKBD","prev":"@KB6,6","post":"~KB1,2"}],
        "annotation":"fissSJ"}],
    "Gambits":[],"AdvSqs":[]}

 ### 6.6 ✅ Scenario: Stack (fissCC, ..., fissSS).
  ```
    1  WKBS @KB1,1 BxR @KR8,8 DxN @KN8,8  BKRP @KR7,7 P-KR6,6                 fissCC,move
    2  WQBS @QB1,1 BxS @KB8,8 DxS @QB8,8                                       fissSS
  ```
  **2-3-0-0**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"fission","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KR8,8"},{"key":"WKBD","prev":"@KB1,1","post":"@KN8,8"},{"key":"BKRR","prev":"@KR8,8","post":"~KR1,1"},{"key":"BKNN","prev":"@KN8,8","post":"~KN1,1"}],"annotation":"fissCC"},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKRP","prev":"@KR7,7","post":"@KR6,6"}],"annotation":"move"},{"action":"fission","turn":2,"player":"White","list":[{"key":"WQBB","prev":"@QB1,1","post":"@KB8,8"},{"key":"WQBD","prev":"@QB1,1","post":"@QB8,8"},{"key":"BKBB","prev":"@KB8,8","post":"~KB2,1"},{"key":"BKBD","prev":"@KB8,8","post":"~KB1,2"},{"key":"BQBB","prev":"@QB8,8","post":"~QB2,1"},{"key":"BQBD","prev":"@QB8,8","post":"~QB1,2"}],"annotation":"fissSS"}],"Gambits":[],"AdvSqs":[]}

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
          "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"startingPos"}],
    "Moves":[
      {"action":"fission","turn":1,"player":"White",
        "list":[
          {"key":"WKBB","prev":"@KB1,1","post":"@KR8,8"},
          {"key":"WKBD","prev":"@KB1,1","post":"@KN8,8"},
          {"key":"BKRR","prev":"@KR8,8","post":"~KR1,1"},
          {"key":"BKNN","prev":"@KN8,8","post":"~KN1,1"}],
        "annotation":"fissCC"},
      {"action":"move","turn":1,"player":"Black",
        "list":[
          {"key":"BKRP","prev":"@KR7,7","post":"@KR6,6"}],
        "annotation":"move"},
      {"action":"fission","turn":2,"player":"White",
        "list":[
          {"key":"WQBB","prev":"@QB1,1","post":"@KB8,8"},
          {"key":"WQBD","prev":"@QB1,1","post":"@QB8,8"},
          {"key":"BKBB","prev":"@KB8,8","post":"~KB2,1"},
          {"key":"BKBD","prev":"@KB8,8","post":"~KB1,2"},
          {"key":"BQBB","prev":"@QB8,8","post":"~QB2,1"},
          {"key":"BQBD","prev":"@QB8,8","post":"~QB1,2"}]
        "annotation":"fissSS"}],
    "Gambits":[],"AdvSqs":[]}

 ### 6.7 ✅ Scenario: Stack (fissCS, fissSC).
  ```
    1  WKBS @KB1,1 BxR @KR8,8 DxS @KB8,8  BQBS @QB8,8 BxS @QB1,1 DxR @QR1,1   fissCS,fissSC
  ```
  **2-2-0-0**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"fission","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KR8,8"},{"key":"WKBD","prev":"@KB1,1","post":"@KB8,8"},{"key":"BKRR","prev":"@KR8,8","post":"~KR1,1"},{"key":"BKBB","prev":"@KB8,8","post":"~KB2,1"},{"key":"BKBD","prev":"@KB8,8","post":"~KB1,2"}],"annotation":"fissCS"},{"action":"fission","turn":1,"player":"Black","list":[{"key":"BQBB","prev":"@QB8,8","post":"@QB1,1"},{"key":"BQBD","prev":"@QB8,8","post":"@QR1,1"},{"key":"WQBB","prev":"@QB1,1","post":"~QB2,1"},{"key":"WQBD","prev":"@QB1,1","post":"~QB1,2"},{"key":"WQRR","prev":"@QR1,1","post":"~QR1,1"}],"annotation":"fissSC"}],"Gambits":[],"AdvSqs":[]}

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
          "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"startingPos"}],
    "Moves":[
      {"action":"fission","turn":1,"player":"White",
        "list":[
          {"key":"WKBB","prev":"@KB1,1","post":"@KR8,8"},
          {"key":"WKBD","prev":"@KB1,1","post":"@KB8,8"},
          {"key":"BKRR","prev":"@KR8,8","post":"~KR1,1"},
          {"key":"BKBB","prev":"@KB8,8","post":"~KB2,1"},
          {"key":"BKBD","prev":"@KB8,8","post":"~KB1,2"}],
        "annotation":"fissCS"},
      {"action":"fission","turn":1,"player":"Black",
        "list":[
          {"key":"BQBB","prev":"@QB8,8","post":"@QB1,1"},
          {"key":"BQBD","prev":"@QB8,8","post":"@QR1,1"},
          {"key":"WQBB","prev":"@QB1,1","post":"~QB2,1"},
          {"key":"WQBD","prev":"@QB1,1","post":"~QB1,2"},
          {"key":"WQRR","prev":"@QR1,1","post":"~QR1,1"}],
        "annotation":"fissSC"}],
    "Gambits":[],"AdvSqs":[]}

 ### 6.8 ✅ Scenario: (fissSS,fissCC) 1. BxS DxS, P-KR3,3  2. BxR DxP
  ```
    1  WKBS @KB1,1 BxS @KB8,8 DxS @QB8,8  BKRP @KR7,7 P-KR6,6                 fissSS,move
    2  WQBS @QB1,1 BxR @KR8,8 DxP @KR6,6                                       fissCC
  ```
  **2-3-0-0**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"fission","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KB8,8"},{"key":"WKBD","prev":"@KB1,1","post":"@QB8,8"},{"key":"BKBB","prev":"@KB8,8","post":"~KB2,1"},{"key":"BKBD","prev":"@KB8,8","post":"~KB1,2"},{"key":"BQBB","prev":"@QB8,8","post":"~QB2,1"},{"key":"BQBD","prev":"@QB8,8","post":"~QB1,2"}],"annotation":"fissSS"},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKRP","prev":"@KR7,7","post":"@KR6,6"}],"annotation":"move"},{"action":"fission","turn":2,"player":"White","list":[{"key":"WQBB","prev":"@QB1,1","post":"@KR8,8"},{"key":"WQBD","prev":"@QB1,1","post":"@KR6,6"},{"key":"BKRR","prev":"@KR8,8","post":"~KR1,1"},{"key":"BKRP","prev":"@KR6,6","post":"~KR2,2"}],"annotation":"fissCC"}],"Gambits":[],"AdvSqs":[]}

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
        "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"startingPos"}],
    "Moves":[
      {"action":"fission","turn":1,"player":"White",
        "list":[
          {"key":"WKBB","prev":"@KB1,1","post":"@KB8,8"},
          {"key":"WKBD","prev":"@KB1,1","post":"@QB8,8"},
          {"key":"BKBB","prev":"@KB8,8","post":"~KB2,1"},
          {"key":"BKBD","prev":"@KB8,8","post":"~KB1,2"},
          {"key":"BQBB","prev":"@QB8,8","post":"~QB2,1"},
          {"key":"BQBD","prev":"@QB8,8","post":"~QB1,2"}],
        "annotation":"fissSS"},
      {"action":"move","turn":1,"player":"Black",
        "list":[
          {"key":"BKRP","prev":"@KR7,7","post":"@KR6,6"}],
        "annotation":"move"},
      {"action":"fission","turn":2,"player":"White",
        "list":[
          {"key":"WQBB","prev":"@QB1,1","post":"@KR8,8"},
          {"key":"WQBD","prev":"@QB1,1","post":"@KR6,6"},
          {"key":"BKRR","prev":"@KR8,8","post":"~KR1,1"},
          {"key":"BKRP","prev":"@KR6,6","post":"~KR2,2"}],
        "annotation":"fissCC"}],
    "Gambits":[],"AdvSqs":[]}

 ### 6.9 ✅ Scenario: (fissSS,fissCC) 1. DxS BxS, P-KR3,3  2. DxR BxP
  ```
    1  WQBS @QB1,1 DxS @KB8,8 BxS @QB8,8  BKRP @KR7,7 P-KR6,6                 fissSS,move
    2  WKBS @KB1,1 DxR @KR8,8 BxP @KR6,6                                       fissCC
  ```
  **2-3-0-0**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"fission","turn":1,"player":"White","list":[{"key":"WQBD","prev":"@QB1,1","post":"@KB8,8"},{"key":"WQBB","prev":"@QB1,1","post":"@QB8,8"},{"key":"BKBB","prev":"@KB8,8","post":"~KB2,1"},{"key":"BKBD","prev":"@KB8,8","post":"~KB1,2"},{"key":"BQBB","prev":"@QB8,8","post":"~QB2,1"},{"key":"BQBD","prev":"@QB8,8","post":"~QB1,2"}],"annotation":"fissSS"},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKRP","prev":"@KR7,7","post":"@KR6,6"}],"annotation":"move"},{"action":"fission","turn":2,"player":"White","list":[{"key":"WKBD","prev":"@KB1,1","post":"@KR8,8"},{"key":"WKBB","prev":"@KB1,1","post":"@KR6,6"},{"key":"BKRR","prev":"@KR8,8","post":"~KR1,1"},{"key":"BKRP","prev":"@KR6,6","post":"~KR2,2"}],"annotation":"fissCC"}],"Gambits":[],"AdvSqs":[]}

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
        "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"startingPos"}],
    "Moves":[
      {"action":"fission","turn":1,"player":"White",
        "list":[
          {"key":"WQBD","prev":"@QB1,1","post":"@KB8,8"},
          {"key":"WQBB","prev":"@QB1,1","post":"@QB8,8"},
          {"key":"BKBB","prev":"@KB8,8","post":"~KB2,1"},
          {"key":"BKBD","prev":"@KB8,8","post":"~KB1,2"},
          {"key":"BQBB","prev":"@QB8,8","post":"~QB2,1"},
          {"key":"BQBD","prev":"@QB8,8","post":"~QB1,2"}],
        "annotation":"fissSS"},
      {"action":"move","turn":1,"player":"Black",
        "list":[
          {"key":"BKRP","prev":"@KR7,7","post":"@KR6,6"}],
        "annotation":"move"},
      {"action":"fission","turn":2,"player":"White",
        "list":[
          {"key":"WKBD","prev":"@KB1,1","post":"@KR8,8"},
          {"key":"WKBB","prev":"@KB1,1","post":"@KR6,6"},
          {"key":"BKRR","prev":"@KR8,8","post":"~KR1,1"},
          {"key":"BKRP","prev":"@KR6,6","post":"~KR2,2"}],
      " annotation":"fissCC"}],
    "Gambits":[],"AdvSqs":[]}

 ### 6.10 ✅ Scenario: (fissSC,fissCS) Stacks capture P and S (click B, then D), then simple move and capture, and vice versa.
  ```
    1. BxS DxP   BxP DxS
    2. R-KR4,4   PxR
    3. NxP       R-KR5,4

    1  WKBS @KB1,1 BxS @KB8,8 DxP @KB7,7  BQBS @QB8,8 BxP @QB2,2 DxS @QB1,1   fissSC,fissCS
    2  WKRR @KR1,1 R-KR4,4                BKRP @KR7,7 PxR @KR4,4              move,capture
    3  WKNN @KN1,1 NxP @KR4,4             BKRR @KR8,8 R-KR5,5                 capture,move
  ```
  **2-6-0-0**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"fission","turn":1,"player":"White","list":[{"key":"WKBB","prev":"@KB1,1","post":"@KB8,8"},{"key":"WKBD","prev":"@KB1,1","post":"@KB7,7"},{"key":"BKBB","prev":"@KB8,8","post":"~KB2,1"},{"key":"BKBD","prev":"@KB8,8","post":"~KB1,2"},{"key":"BKBP","prev":"@KB7,7","post":"~KB2,2"}],"annotation":"fissSC"},{"action":"fission","turn":1,"player":"Black","list":[{"key":"BQBB","prev":"@QB8,8","post":"@QB2,2"},{"key":"BQBD","prev":"@QB8,8","post":"@QB1,1"},{"key":"WQBP","prev":"@QB2,2","post":"~QB2,2"},{"key":"WQBB","prev":"@QB1,1","post":"~QB2,1"},{"key":"WQBD","prev":"@QB1,1","post":"~QB1,2"}],"annotation":"fissCS"},{"action":"move","turn":2,"player":"White","list":[{"key":"WKRR","prev":"@KR1,1","post":"@KR4,4"}],"annotation":"move"},{"action":"capture","turn":2,"player":"Black","list":[{"key":"BKRP","prev":"@KR7,7","post":"@KR4,4"},{"key":"WKRR","prev":"@KR4,4","post":"~KR1,1"}],"annotation":"capture"},{"action":"capture","turn":3,"player":"White","list":[{"key":"WKNN","prev":"@KN1,1","post":"@KR4,4"},{"key":"BKRP","prev":"@KR4,4","post":"~KR2,2"}],"annotation":"capture"},{"action":"move","turn":3,"player":"Black","list":[{"key":"BKRR","prev":"@KR8,8","post":"@KR5,5"}],"annotation":"move"}],"Gambits":[],"AdvSqs":[]}

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
          "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"startingPos"}],
    "Moves":[
      {"action":"fission","turn":1,"player":"White",
        "list":[
          {"key":"WKBB","prev":"@KB1,1","post":"@KB8,8"},
          {"key":"WKBD","prev":"@KB1,1","post":"@KB7,7"},
          {"key":"BKBB","prev":"@KB8,8","post":"~KB2,1"},
          {"key":"BKBD","prev":"@KB8,8","post":"~KB1,2"},
          {"key":"BKBP","prev":"@KB7,7","post":"~KB2,2"}],
        "annotation":"fissSC"},
      {"action":"fission","turn":1,"player":"Black",
        "list":[
          {"key":"BQBB","prev":"@QB8,8","post":"@QB2,2"},
          {"key":"BQBD","prev":"@QB8,8","post":"@QB1,1"},
          {"key":"WQBP","prev":"@QB2,2","post":"~QB2,2"},
          {"key":"WQBB","prev":"@QB1,1","post":"~QB2,1"},
          {"key":"WQBD","prev":"@QB1,1","post":"~QB1,2"}],
        "annotation":"fissCS"},
      {"action":"move","turn":2,"player":"White",
        "list":[{"key":"WKRR","prev":"@KR1,1","post":"@KR4,4"}],
        "annotation":"move"},
      {"action":"capture","turn":2,"player":"Black",
        "list":[
          {"key":"BKRP","prev":"@KR7,7","post":"@KR4,4"},
          {"key":"WKRR","prev":"@KR4,4","post":"~KR1,1"}],
        "annotation":"capture"},
      {"action":"capture","turn":3,"player":"White",
        "list":[
          {"key":"WKNN","prev":"@KN1,1","post":"@KR4,4"},
          {"key":"BKRP","prev":"@KR4,4","post":"~KR2,2"}],
        "annotation":"capture"},
      {"action":"move","turn":3,"player":"Black",
        "list":[{"key":"BKRR","prev":"@KR8,8","post":"@KR5,5"}],
        "annotation":"move"}],
    "Gambits":[],"AdvSqs":[]}


## 7. Compound Moves
 ### 7.1 ✅ Scenario: En Passant and castle.
  ```
    1  WKNP @KN2,2 P-KN4,4                  BKNN @KN8,8 N-KR6,6                   move,move
    2  WKNP @KN4,4 P-KN5,5                  BKBP @KB7,7 P-KB5,5                   move,move
    3  WKNP @KN5,5 ExP @KB6,6               BKRR @KR8,8 K-KB7,8 R-K7,8            e.p.,cstl
    4  WKQR @RR1,1 K-K2,1 KR-Q2,1 QR-KB2,1                                         dble
  ```
  **2-7-0-0**
    {"Setup":[{"action":"makeBoard","prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},"nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},{"action":"startingPos"}],"Moves":[{"action":"move","turn":1,"player":"White","list":[{"key":"WKNP","prev":"@KN2,2","post":"@KN4,4"}],"annotation":"move"},{"action":"move","turn":1,"player":"Black","list":[{"key":"BKNN","prev":"@KN8,8","post":"@KR6,6"}],"annotation":"move"},{"action":"move","turn":2,"player":"White","list":[{"key":"WKNP","prev":"@KN4,4","post":"@KN5,5"}],"annotation":"move"},{"action":"move","turn":2,"player":"Black","list":[{"key":"BKBP","prev":"@KB7,7","post":"@KB5,5"}],"annotation":"move"},{"action":"enpassant","turn":3,"player":"White","list":[{"key":"WKNP","prev":"@KN5,5","post":"@KB6,6"},{"key":"BKBP","prev":"@KB5,5","post":"~KB2,2"}],"annotation":"e.p."},{"action":"castle","turn":3,"player":"Black","list":[{"key":"BKKK","prev":"@K8,8","post":"@KB7,8"},{"key":"BKRR","prev":"@KR8,8","post":"@K7,8"}],"annotation":"cstl"},{"action":"castle","turn":4,"player":"White","list":[{"key":"WKKK","prev":"@K1,1","post":"@K2,1"},{"key":"WKRR","prev":"@KR1,1","post":"@Q2,1"},{"key":"WQRR","prev":"@QR1,1","post":"@KB2,1"}],"annotation":"dble"}],"Gambits":[],"AdvSqs":[]}

    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
          "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"startingPos"}],
    "Moves":[
      {"action":"move","turn":1,"player":"White",
        "list":[
          {"key":"WKNP","prev":"@KN2,2","post":"@KN4,4"}],
        "annotation":"move"},
      {"action":"move","turn":1,"player":"Black",
        "list":[
          {"key":"BKNN","prev":"@KN8,8","post":"@KR6,6"}],
        "annotation":"move"},
      {"action":"move","turn":2,"player":"White",
        "list":[
          {"key":"WKNP","prev":"@KN4,4","post":"@KN5,5"}],
        "annotation":"move"},
      {"action":"move","turn":2,"player":"Black",
        "list":[
          {"key":"BKBP","prev":"@KB7,7","post":"@KB5,5"}],
        "annotation":"move"},
      {"action":"enpassant","turn":3,"player":"White",
        "list":[
          {"key":"WKNP","prev":"@KN5,5","post":"@KB6,6"},
          {"key":"BKBP","prev":"@KB5,5","post":"~KB2,2"}],
        "annotation":"e.p."},
      {"action":"castle","turn":3,"player":"Black",
        "list":[
          {"key":"BKKK","prev":"@K8,8","post":"@KB7,8"},
          {"key":"BKRR","prev":"@KR8,8","post":"@K7,8"}],
        "annotation":"cstl"},
      {"action":"castle","turn":4,"player":"White",
          "list":[
            {"key":"WKKK","prev":"@K1,1","post":"@K2,1"},
            {"key":"WKRR","prev":"@KR1,1","post":"@Q2,1"},
            {"key":"WQRR","prev":"@QR1,1","post":"@KB2,1"}],
          "annotation":"dble"}],
    "Gambits":[],"AdvSqs":[]}

## 9. Template
 ### 9.1 Scenario: () Stack.
  ```
  ```
  **2-2-0-0**
  
    {"Setup":[
      {"action":"makeBoard",
        "prevBoard":{"boardSize":"0x0x0","trayType":"None","trayGap":0},
          "nextBoard":{"boardSize":"8x8x8","trayType":"Real","trayGap":0}},
      {"action":"startingPos"}],
    "Gambits":[],"AdvSqs":[]}

## Development - 

