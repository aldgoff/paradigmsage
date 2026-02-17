// ./assets/qt3/js/model/analyzeStateString.js

// Analyze a state string for multiple perameters of interest.

/**
 * Adds a collapse move to a QT3 state string.
 * @param {string} state - existing QT3 state string (must not be empty).
 * 
 * @returns {movesPlacement}  // 0 - 9.
 */

/**
 * Returns the number of incomplete (spooky) placement moves.
 * There can be at most 1.
 *
 * Example: "X1+(5"
 */
export function countSpookyMoves(state) {
  if (!state || state.trim() === "") return 0;

  // Match trailing incomplete placement:
  // X1+(5
  const spookyRegex = /([XO])(\d+)\+\((\d)$/;

  const match = state.match(spookyRegex);

  return match ? 1 : 0;
}

export function analyzeStateString(state) {
  if (!state || state.trim() === "") {
    return emptyAnalysis();
  }

  // --- Count the types of moves made. ---

  // Generate raw data.
  const loopRegex      = /\[(\d+)(?:\|(\d+))?\]/g;

  let movesSpooky = 0; // 0 - 1.
  let movesPlacement = 0; // 0 - 9.
  let movesCollapse  = 0; // 0 - 4.
  let movesNumber  = 0;   // 0 - 13.

  let match;

  // Spooky events (player decisions).
  movesSpooky = countSpookyMoves(state);

  // Placement events (player decisions).
  const placementRegex = /([XO])(\d+)\+\((\d),(\d)\)/g;
  while ((match = placementRegex.exec(state)) !== null) {
    movesPlacement++;
  }

  // Collapse events (player decisions).
  const collapseEventRegex = /@([XO])(\d+)\((\d)\)/g;
  while ((match = collapseEventRegex.exec(state)) !== null) {
    movesCollapse++;
  }

  // Total number of moves.
  movesNumber = movesPlacement + movesCollapse;

  let countOfSeparables    = 0;
  let numberOfEntangledMoves    = 0;
  let numberOfCollapsedMoves    = 0;


  // --- Derive separables / entangleds / collapseds ---

  // 1️⃣ Collect all placements
  const placements = [];   // { move, sq1, sq2 }

  placementRegex.lastIndex = 0;

  while ((match = placementRegex.exec(state)) !== null) {
    placements.push({
      move: Number(match[2]),
      sq1:  Number(match[3]),
      sq2:  Number(match[4])
    });
  }

  // 2️⃣ Collect collapsed moves (from !Xn(s))
  const collapsedMoves = new Set();
  const collapseResolutionRegex = /!([XO])(\d+)\((\d)\)/g;

  while ((match = collapseResolutionRegex.exec(state)) !== null) {
    collapsedMoves.add(Number(match[2]));
  }

  numberOfCollapsedMoves = collapsedMoves.size;

  // 3️⃣ Build square → uncollapsed move map
  const squareMap = new Map();  // square → Set(move)

  for (const p of placements) {

    if (collapsedMoves.has(p.move)) continue; // skip collapsed

    if (!squareMap.has(p.sq1)) squareMap.set(p.sq1, new Set());
    if (!squareMap.has(p.sq2)) squareMap.set(p.sq2, new Set());

    squareMap.get(p.sq1).add(p.move);
    squareMap.get(p.sq2).add(p.move);
  }

  // 4️⃣ Count separables & entanglements
  countOfSeparables = 0;
  numberOfEntangledMoves = 0;

  for (const p of placements) {

    if (collapsedMoves.has(p.move)) continue;

    const sq1Shared = squareMap.get(p.sq1)?.size > 1;
    const sq2Shared = squareMap.get(p.sq2)?.size > 1;

    if (!sq1Shared && !sq2Shared) {
      countOfSeparables++;
    } else {
      numberOfEntangledMoves++;
    }
  }


  // --- Compute countOfEntanglements (connected components ≥ 2) ---

  let countOfEntanglements = 0;

  // 1️⃣ Build adjacency map of uncollapsed moves
  const adjacency = new Map();  // move → Set(neighborMoves)

  for (const p of placements) {
    if (collapsedMoves.has(p.move)) continue;
    adjacency.set(p.move, new Set());
  }

  // Connect moves that share a square
  for (const movesAtSquare of squareMap.values()) {
    const moves = [...movesAtSquare];

    for (let i = 0; i < moves.length; i++) {
      for (let j = i + 1; j < moves.length; j++) {
        adjacency.get(moves[i]).add(moves[j]);
        adjacency.get(moves[j]).add(moves[i]);
      }
    }
  }

  // 2️⃣ Count connected components of size ≥ 2
  const visited = new Set();

  for (const move of adjacency.keys()) {

    if (visited.has(move)) continue;

    const stack = [move];
    const component = [];

    while (stack.length > 0) {
      const m = stack.pop();
      if (visited.has(m)) continue;

      visited.add(m);
      component.push(m);

      for (const neighbor of adjacency.get(m)) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }

    if (component.length >= 2) {
      countOfEntanglements++;
    }
  }

  return {
    movesSpooky,
    movesPlacement,
    movesCollapse,
    movesNumber,

    countOfSeparables,
    countOfEntanglements,

    numberOfEntangledMoves,
    numberOfCollapsedMoves,

    // collapsedMoves: [...collapsedMovesSet],
    // collapsedSquares: [...collapsedSquaresSet],

    // numberOfLoopMoves: loopMovesSet.size,
    // numberOfStemMoves: stemMovesSet.size,

    // numberOfClassicalRealities,
    // fieldOfClassicalRealities,

    // sequentialChronoBlocks: movesCollapse,
    // overlappingChronoBlocks: 0,  // TODO
    // nestedChronoBlocks: 0        // TODO
  };
}

function emptyAnalysis() {
  return {
    movesSpooky: 0,   // 0, 1.
    movesPlacement: 0,
    movesCollapse: 0,
    movesNumber: 0,

    countOfSeparables: 0,
    countOfEntanglements: 0,

    numberOfEntangledMoves: 0,
    numberOfCollapsedMoves: 0,

    countOfCyclicEntanglements: 0, // 0, 1.
    collapsedMoves: [],
    collapsedSquares: [],
    numberOfLoopMoves: 0,
    numberOfStemMoves: 0,

    numberOfClassicalRealities: 1,
    fieldOfClassicalRealities: 1,

    sequentialChronoBlocks: 0,
    overlappingChronoBlocks: 0,
    nestedChronoBlocks: 0
  };
}
