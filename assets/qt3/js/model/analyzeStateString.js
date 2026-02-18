// ./assets/qt3/js/model/analyzeStateString.js

// Analyze a state string for multiple perameters of interest.

/** Analyzes a QT3 state string.
 * @param {string} state - existing QT3 state string.
 * 
 * @returns {moves, counts}  // 
*/

const noMoves = {
  spooky: 0,    // 0 - 1.
  placement: 0, // 0 - 9.
  collapse: 0,  // 0 - 4.
  number: 0,    // 0 - 13.
  };
  Object.freeze(noMoves);

const noCounts = {
  separables: 0,     // 0 - 4.
  entanglements: 0,  // 0 - 3.
  entangledMoves: 0, // 0 - 9.
  collapsedMoves: 0, // 0 - 9.
  };
  Object.freeze(noCounts);

  /*** QT3 Grammar ***/

const GRAMMAR = {
  placement:        /([XO])(\d+)\+\((\d),(\d)\)/g,
  collapseEvent:    /@([XO])(\d+)\((\d)\)/g,
  collapseResolve:  /!([XO])(\d+)\((\d)\)/g,
  spooky:           /([XO])(\d+)\+\((\d)$/
  // loop:          /\[(\d+)(?:\|(\d+))?\]/g;
};


/*** Helpers ***/

function invariant(message, condition) {
  if (!condition) {
    throw new Error(`Invariant failed: ${message}`);
  }
}

export function parseState(state) {
  /**
   * Parses a QT3 state string into structural components.
   *
   * Returns:
   * {
   *   placements: [ { move, sq1, sq2 } ],
   *   collapsedMoves: Set<number>
   * }
   */

  const result = {
    placements: [],
    collapsedMoves: new Set()
  };

  if (!state || state.trim() === "") {
    return result;
  }

  const placementRegex = new RegExp(GRAMMAR.placement);
  const collapseRegex  = new RegExp(GRAMMAR.collapseResolve);

  let match;

  // Collect placements
  while ((match = placementRegex.exec(state)) !== null) {
    result.placements.push({
      move: Number(match[2]),
      sq1:  Number(match[3]),
      sq2:  Number(match[4])
    });
  }

  // Collect collapsed moves
  while ((match = collapseRegex.exec(state)) !== null) {
    result.collapsedMoves.add(Number(match[2]));
  }

  return result;
}

export function countSpookyMoves(state) {
  /** Returns the number of incomplete (spooky) placement moves.
   * There can be at most 1.
   *
   * Example: "X1+(5"
   */

  if (!state || state.trim() === "") return 0;

  // Match trailing incomplete placement:
  // X1+(5
  const spookyRegex = /([XO])(\d+)\+\((\d)$/;

  const match = state.match(spookyRegex);

  return match ? 1 : 0;
}

export function countMoves(state) {
  const placementRegex     = new RegExp(GRAMMAR.placement);
  const collapseEventRegex = new RegExp(GRAMMAR.collapseEvent);

  let moves = { ...noMoves };

  let match;

  // Spooky events (player decisions).
  moves.spooky = countSpookyMoves(state);

  // Placement events (player decisions).
  while ((match = placementRegex.exec(state)) !== null) {
    moves.placement++;
  }

  // Collapse events (player decisions).
  while ((match = collapseEventRegex.exec(state)) !== null) {
    moves.collapse++;
  }

  // Total number of moves.
  moves.number = moves.placement + moves.collapse;

  return moves;
}

function buildSquareMap(placements, collapsedMoves) {
  const squareMap = new Map();

  for (const p of placements) {
    if (collapsedMoves.has(p.move)) continue;

    if (!squareMap.has(p.sq1)) squareMap.set(p.sq1, new Set());
    if (!squareMap.has(p.sq2)) squareMap.set(p.sq2, new Set());

    squareMap.get(p.sq1).add(p.move);
    squareMap.get(p.sq2).add(p.move);
  }

  return squareMap;
}

export function countEntanglements(placements, collapsedMoves) {
  const squareMap = buildSquareMap(placements, collapsedMoves);

  // 4️⃣ Build adjacency
  const adjacency = new Map();

  for (const p of placements) {
    if (collapsedMoves.has(p.move)) continue;
    adjacency.set(p.move, new Set());
  }

  for (const movesAtSquare of squareMap.values()) {
    const moves = [...movesAtSquare];

    for (let i = 0; i < moves.length; i++) {
      for (let j = i + 1; j < moves.length; j++) {
        adjacency.get(moves[i]).add(moves[j]);
        adjacency.get(moves[j]).add(moves[i]);
      }
    }
  }

  // 5️⃣ Count connected components ≥ 2
  const visited = new Set();
  let count = 0;

  for (const move of adjacency.keys()) {

    if (visited.has(move)) continue;

    const stack = [move];
    let size = 0;

    while (stack.length > 0) {
      const m = stack.pop();
      if (visited.has(m)) continue;

      visited.add(m);
      size++;

      for (const neighbor of adjacency.get(m)) {
        if (!visited.has(neighbor)) stack.push(neighbor);
      }
    }

    if (size >= 2) count++;
  }

  return count;
}

export function countStructures(state) {
  let counts = { ...noCounts };

  let parse = parseState(state);

  counts.collapsedMoves = parse.collapsedMoves.size;

  // 3️⃣ Build square → uncollapsed move map
  const squareMap = buildSquareMap(parse.placements, parse.collapsedMoves); // square → Set(move)

  // 4️⃣ Count separables & entanglements
  counts.separables = 0;
  counts.entangledMoves = 0;

  for (const p of parse.placements) {
    if (parse.collapsedMoves.has(p.move)) continue;

    const sq1Shared = squareMap.get(p.sq1)?.size > 1;
    const sq2Shared = squareMap.get(p.sq2)?.size > 1;

    if (!sq1Shared && !sq2Shared) {
      counts.separables++;
    } else {
      counts.entangledMoves++;
    }
  }

  counts.entanglements = countEntanglements(parse.placements, parse.collapsedMoves);

  return counts;
}

export function analyzeStateString(state) {
  if (!state || state.trim() === "") {
    return emptyAnalysis();
  }

  let moves  = countMoves(state);   // Basically count events.
  let counts = countStructures(state); // Count structural elements.

  // --- Invariants ---

  invariant("Structural counts must equal placement moves",
    counts.separables +
    counts.entangledMoves +
    counts.collapsedMoves === moves.placement,
    );

  invariant("QT3 allows at most 3 entanglement components",
    counts.entanglements <= 3,
  );

  return { moves, counts };
}

function emptyAnalysis() {
  return {
    moves:  {...noMoves},
    counts: {...noCounts},

    // countOfCyclicEntanglements: 0, // 0, 1.
    // collapsedSquares: [],
    // numberOfLoopMoves: 0,
    // numberOfStemMoves: 0,

    // numberOfClassicalRealities: 1,
    // fieldOfClassicalRealities: 1,

    // sequentialChronoBlocks: 0,
    // overlappingChronoBlocks: 0,
    // nestedChronoBlocks: 0
  };
}
