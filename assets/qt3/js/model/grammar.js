// ./assets/qt3/js/model/grammar.js

/* Usage Examples:
  let match = GRAMMAR.placement.exec(stateString);
  player:  match[1],
  move:    Number(match[2]),
  squares: [Number(match[3]), Number(match[4])],
 */

export const GRAMMAR = {  // TODO: expand and condense the grammar for regex.
  // ORIGINAL
    spooky:           /([XO])(\d)\+\((\d)$/,         // Example: "X1(2" - player, turn, square.
    placement:        /([XO])(\d)\+\((\d),(\d)\)/g,  // Example: "X1(1,2); " - player, turn, sq1, sq2.
    loop:             /\[(\d+)(?:\|(\d+))?\]/g,
    collapseEvent:    /@([XO])(\d+)\((\d)\)/g,
    collapseResolve:  /!([XO])(\d)\((\d)\)/g,        // Example: "!X1(1)!O2(2); " - player, turn, square.
    // trigger:
    // collapse:
    // degenerate:
    // score:

  // TOKEN-LEVEL (anchored)
    spookyToken:     /^([XO])(\d+)\+\((\d+)$/,
    placementToken:  /^([XO])(\d+)\+\((\d+),(\d+)\)$/,
    loopToken:       /^([XO])(\d+)\+\((\d+),(\d+)\)\[([^|\]]+)(?:\|([^\]]+))?\]$/,
    collapseToken:   /^([XO])(\d+)@([XO]\d+)\((\d+)\)(!.*)?$/,
    degenerateToken: /^([XO])(\d+)\+\((\d+),(\d+)\)$/,
    scoreToken:      /^\{\s*X-([^,}]+)\s*,\s*O-([^}]+)\s*\}$/,

  // SINGLE-MATCH SCANNERS
    spookyTrailing:        /([XO])(\d)\+\((\d)$/,         // Under test (dup of spooky).

  // GLOBAL SCANNERS (must include /g)
    placementGlobal:       /([XO])(\d+)\+\((\d+),(\d+)\)/g,
    loopBracketGlobal:     /\[(\d+)(?:\|(\d+))?\]/g,
    collapseResolveGlobal: /!([XO])(\d+)\((\d+)\)/g,
    collapseEventGlobal:   /@([XO])(\d+)\((\d+)\)/g,
};
  
