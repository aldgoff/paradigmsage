// ./assets/qt3/js/model/grammer.js

export const GRAMMAR = {  // TODO: deprecate.
  placement:        /([XO])(\d+)\+\((\d),(\d)\)/g,
  collapseEvent:    /@([XO])(\d+)\((\d)\)/g,
  collapseResolve:  /!([XO])(\d+)\((\d)\)/g,
  spooky:           /([XO])(\d+)\+\((\d)$/
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
    spookyTrailing:        /([XO])(\d+)\+\((\d+)$/,

  // GLOBAL SCANNERS (must include /g)
    placementGlobal:       /([XO])(\d+)\+\((\d+),(\d+)\)/g,
    loopBracketGlobal:     /\[(\d+)(?:\|(\d+))?\]/g,
    collapseResolveGlobal: /!([XO])(\d+)\((\d+)\)/g,
    collapseEventGlobal:   /@([XO])(\d+)\((\d+)\)/g,
};

