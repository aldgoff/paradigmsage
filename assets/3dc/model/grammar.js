// ./assets/qt3/js/model/grammar.js

/* Usage Examples:
  regex.lastIndex = 0;
  exec():
    let match = GRAMMAR.rookQuad.exec(sring);
    player:  match[1],
    move:    Number(match[2]),
    squares: [Number(match[3]), Number(match[4])],
  test():
    true/false.
  string.match(regEx);  // This one avoids the global 'g' idempotency problem.
 */

export const GRAMMAR = {
  // Test.
    quadsTestPermissive: /^Q(?:[1-9]|1[0-2]|1[3-9]|2[0-9]|3[0-6]|(?:3[7-9]|[4-5][0-9]|60)[ef]?)$/,
    quadsTestStrict:     /^Q(?:[1-9]|1[0-2]|1[3-9]|2[0-9]|3[0-6]|(?:3[7-9]|[4-5][0-9]|60)[ef])$/,

  // Classify.
    rookQuad:   /^Q(?:[1-9]|1[0-2])$/,
    bishopQuad: /^Q(?:1[3-9]|2[0-9]|3[0-6])$/,
    dukeQuad:   /^Q(?:3[7-9]|[4-5][0-9]|60)(?:[ef])?$/,
    dukeEdge:   /^Q(?:3[7-9]|[4-5][0-9]|60)(?:e)$/,
    dukeFace:   /^Q(?:3[7-9]|[4-5][0-9]|60)(?:f)$/,

  // TOKEN-LEVEL (anchored). Intended for use on single tokens; "What type of token are you?"
    // spookyToken:        /^([XO])(\d)\+\((\d)$/,
};
  
export function pieceFromQuadToken(q) { // Param: Q<nn>. Return: {piece: 'rook'|'bishop'|'duke', type: 'edge'|'face'.
  if (GRAMMAR.rookQuad.test(q))   return { piece: 'rook' };
  if (GRAMMAR.bishopQuad.test(q)) return { piece: 'bishop' };
  if (GRAMMAR.dukeEdge.test(q))   return { piece: 'duke', quadType: 'edge', apex: 'simplex' }; // Order sensitive.
  if (GRAMMAR.dukeFace.test(q))   return { piece: 'duke', quadType: 'face', apex: 'duplex' };
  if (GRAMMAR.duke.test(q))       return { piece: 'duke' };
  return null
}

/* Rule:
 * Differences in quote type are intentional and semantic.
 * Local context will determine pattern - individually.
 * Do not mix styles arbitrarily.
 */

