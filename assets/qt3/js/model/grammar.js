// ./assets/qt3/js/model/grammar.js

export const GRAMMAR = {  // TODO: deprecate.
  placement:        /([XO])(\d)\+\((\d),(\d)\)/g,         // Under test.
  collapseEvent:    /@([XO])(\d+)\((\d)\)/g,
  collapseResolve:  /!([XO])(\d+)\((\d)\)/g,
  spooky:           /([XO])(\d)\+\((\d)$/                 // Under test (dup of spooky in GRAMAR2).
  // loop:          /\[(\d+)(?:\|(\d+))?\]/g;
};

export const GRAMMAR2 = {
  // TOKEN-LEVEL (anchored)
    spookyToken:     /^([XO])(\d+)\+\((\d+)$/,
    placementToken:  /^([XO])(\d+)\+\((\d+),(\d+)\)$/,
    loopToken:       /^([XO])(\d+)\+\((\d+),(\d+)\)\[([^|\]]+)(?:\|([^\]]+))?\]$/,
    collapseToken:   /^([XO])(\d+)@([XO]\d+)\((\d+)\)(!.*)?$/,
    degenerateToken: /^([XO])(\d+)\+\((\d+),(\d+)\)$/,
    scoreToken:      /^\{\s*X-([^,}]+)\s*,\s*O-([^}]+)\s*\}$/,

  // SINGLE-MATCH SCANNERS
    spookyTrailing:        /([XO])(\d)\+\((\d)$/,         // Under test (dup of spooky in GRAMAR).

  // GLOBAL SCANNERS (must include /g)
    placementGlobal:       /([XO])(\d+)\+\((\d+),(\d+)\)/g,
    loopBracketGlobal:     /\[(\d+)(?:\|(\d+))?\]/g,
    collapseResolveGlobal: /!([XO])(\d+)\((\d+)\)/g,
    collapseEventGlobal:   /@([XO])(\d+)\((\d+)\)/g,
};

