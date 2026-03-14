// ./assets/qt3/js/model/grammar.js

/* Usage Examples:
  exec():
    let match = GRAMMAR.placement.exec(stateString);
    player:  match[1],
    move:    Number(match[2]),
    squares: [Number(match[3]), Number(match[4])],
  test():
    true/false.
  string.match(regEx);
 */

export const GRAMMAR = {  // TODO: expand and condense the grammar for regex.
  // ORIGINAL (used in moves.js). Intended for use on transcripts; "How many of this type?"
    spooky:           /([XO])(\d)\+\((\d)$/,         // Example: "X1(2" - player, turn, square.
    placement:        /([XO])(\d)\+\((\d),(\d)\)/g,  // Example: "X1(1,2); " - player, turn, sq1, sq2.
    loop:             /\[(\d+)(?:\|(\d+))?\]/g,
    collapseResolve:  /!([XO])(\d)\((\d)\)/g,        // Example: "!X1(1)!O2(2); " - player, turn, square.
    // trigger:
    // collapse:
    // degenerate:
    // score:
    collapseEvent:    /@([XO])(\d+)\((\d)\)/g,  // Used in model/analyzeStateString.

  // TOKEN-LEVEL (anchored). Intended for use on single tokens; "What type of token are you?"
    spookyToken:        /^([XO])(\d)\+\((\d)$/,
    spooky2Token:       /^,(\d)\)$/,
    placementToken:     /^([XO])(\d)\+\(([1-9]),([1-9])\)$/,
    // placementToken:     /^([XO])(\d)\+\((\d),(\d)\)$/,
    loopToken:          /^([XO])(\d)\+\((\d),(\d)\)\[([^|\]]+)(?:\|([^\]]+))?\]$/,
    pureLoopToken:      /^([XO])(\d)\+\((\d),(\d)\)\[([^\|\]]+)\]$/,
    stemLoopToken:      /^([XO])(\d)\+\((\d),(\d)\)\[([^\|\]]+)\|([^\]]+)\]$/,
    collapseToken:      /^([XO])(\d)@([XO]\d)\((\d)\)(!([XO]\d)\((\d)\)){2,}$/,
    selfCollapseToken:  /^O9@X9\((\d)\)!X9\((\d)\)/,
    degenerateToken:    /^([X])(9)\+\((\d),(\d)\)$/,
    scoreToken:         /^\{\s*X=([^,}]+)\s*,\s*O=([^}]+)\s*\}$/,
};
  
/*
Clicks      Redo        Fragment 
------------------------------------- 
spooky                  X1+(1,
placement   placement   X1+(1,2); 
spooky
loop        loop        O2+(2,1)[12]; 
collpase    collapse    X2@X1(1)!X1(1)!O2(2); 
spooky
placement   placement   X3+(3,6); 
spooky
placement   placement   O4+(6,9); 
spooky
placement   placement   X5+(9,8); 

emptyBoard    addSpooky or addPlacement.
wasSpooky     stripSpooky, or addSpooky2 check for loop and addPlacement or addLoop.
wasPlacement  check for loop and addPlacement or addLoop.
wasLoop       addCollapse, check for over.
wasCollapse   addSpooky or addPlacement.
isOver        addScore.
*/
