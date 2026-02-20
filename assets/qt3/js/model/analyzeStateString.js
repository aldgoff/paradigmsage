// ./assets/qt3/js/model/analyzeStateString.js

// Analyze a state string for multiple perameters of interest.

/** Analyzes a QT3 state string.
 * @param {string} state - existing QT3 state string.
 * 
 * @returns {moves, counts}  // 
*/

import {GRAMMAR} from "./grammer.js";
import {buildSquareMap} from "./structure.js";

const noMoves = {
  spooky: 0,    // 0 - 1.
  placement: 0, // 0 - 9.
  collapse: 0,  // 0 - 4.
  number: 0,    // 0 - 13.
  };
  Object.freeze(noMoves);

const noCounts = {
  loneSpooky:     0, // 0 - 1.
  separables:     0, // 0 - 4.
  entanglements:  0, // 0 - 3.
  cyclics:        0, // 0 - 1.
  entangledMoves: 0, // 0 - 9.
  collapsedMoves: 0, // 0 - 9.
  };
  Object.freeze(noCounts);

const noIllegals = {
  playPastEnd: false,
  };
  Object.freeze(noIllegals);

const noOutcome = {
  over: false,
  score: {X: 0, O: 0},
  wins: {},
  desc: "",
  };
  Object.freeze(noOutcome);

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

export function trackProgress1(stateString) {
  let progress = {
    turn: 0,            // 0 - 9.
    player: 0,          // 'X' or 'O'.
    sq1: 0,             // 0 - 9.
    sq2: 0,             // 0 - 9.
    firstSpooky: true,  // true/false.
    placement: false,   // true/false.
    collapse: false,    // true/false.
    };

    if(stateString == "" || stateString.slice(-2) === "; ") {
      progress.firstSpooky = true;
    }

    // TODO: trackProgress().

    return progress;
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

export function countCyclics(placements, collapsedMoves) {
  // Track seen edges
  const edgeSet = new Set();

  for (const p of placements) {
    if (collapsedMoves.has(p.move)) continue;

    const a = Math.min(p.sq1, p.sq2);
    const b = Math.max(p.sq1, p.sq2);

    const key = `${a}-${b}`;

    if (edgeSet.has(key)) {
      return 1; // parallel edge → 2-cycle
    }

    edgeSet.add(key);
  }

  // ---- Existing DFS logic for 3+ cycles ----

  const graph = new Map();

  for (const p of placements) {
    if (collapsedMoves.has(p.move)) continue;

    const { sq1, sq2 } = p;

    if (!graph.has(sq1)) graph.set(sq1, new Set());
    if (!graph.has(sq2)) graph.set(sq2, new Set());

    graph.get(sq1).add(sq2);
    graph.get(sq2).add(sq1);
  }

  const visited = new Set();

  function dfs(node, parent) {
    visited.add(node);

    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor, node)) return true;
      } else if (neighbor !== parent) {
        return true;
      }
    }

    return false;
  }

  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      if (dfs(node, null)) return 1;
    }
  }

  return 0;
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
  counts.cyclics = countCyclics(parse.placements, parse.collapsedMoves);

  return counts;
}

// import { analyzeStateString } from "./analyzeStateString.js";
import { evaluateGame } from "./scoring.js";

export function analyzeStateString1(stateString) {
  if (!stateString || stateString.trim() === "") {
    return emptyAnalysis();
  }

  let progress;
  let moves     = countMoves(stateString);   // Basically count events.
  let counts    = countStructures(stateString); // Count structural elements.
  let illegals  = {};
  let outcome   = {};

  // --- Invariants ---

  invariant("Structural counts must equal placement moves",
    counts.separables +
    counts.entangledMoves +
    counts.collapsedMoves === moves.placement,
    );

  invariant("QT3 allows at most 3 simultaneous entanglements",
    counts.entanglements <= 3,
  );

  // --- Game Over? ---

  if(counts.collapse > 0 && moves.number >= 5) {
    outcome = evaluateGame(state);
  }

  return { progress, moves, counts, outcome };
}

function emptyAnalysis() {
  return {
    progress: {...noProgress},
    moves:    {...noMoves},
    counts:   {...noCounts},
    illegals: {...noIllegals},
    outcome:  {...noOutcome},

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

export function analyzeStateString(stateString) {

  if (!stateString || stateString.trim() === "") {
    return emptyAnalysis();
  }

  let moves    = countMoves(stateString);
  let counts   = countStructures(stateString);
  let illegals = { ...noIllegals };
  let outcome  = evaluateGame(stateString);

  // --- Invariants ---

  invariant("Structural counts must equal placement moves",
    counts.separables +
    counts.entangledMoves +
    counts.collapsedMoves === moves.placement,
  );

  invariant("QT3 allows at most 3 simultaneous entanglements",
    counts.entanglements <= 3,
  );

  // --- Progress ---
  let progress = trackProgress(stateString, moves, counts, outcome);

  return {
    progress,
    moves,
    counts,
    illegals,
    outcome
  };
}

const noProgress = {
  turn: 0,            // 0 - 9.
  player: 0,          // 'X' or 'O'.
  sq1: 0,             // 0 - 9.
  sq2: 0,             // 0 - 9.
  firstSpooky: true,  // true/false.
  placement: false,   // true/false.
  loop: false,        // true/false.
  collapse: false,    // true/false.
  };
  Object.freeze(noProgress );

function trackProgress(stateString, moves, counts, outcome) {
  let progress = { ...noProgress };

  // --- Determine last completed placement turn ---
  // Placement moves define turns.
  const lastTurn = moves.placement;

  progress.turn = lastTurn;

  if (lastTurn > 0) {
    progress.player = (lastTurn % 2 === 1) ? 'X' : 'O';
  }

  // --- Game Over ---
  if (outcome.over) {
    progress.firstSpooky = false;
    progress.placement   = false;
    progress.collapse    = false;
    return progress;
  }

  // --- Collapse required if cyclic exists ---
  if (counts.cyclics > 0) {
    progress.firstSpooky = false;
    progress.placement   = false;
    progress.collapse    = true;
    return progress;
  }

  // --- Incomplete spooky mark? ---
  if (moves.spooky === 1) {
    progress.firstSpooky = false;
    progress.placement   = true;   // awaiting second spooky
    progress.collapse    = false;
    progress.sq1 = Number(stateString.slice(-1));
    return progress;
  }

  // --- Otherwise awaiting first spooky ---
  progress.firstSpooky = true;
  progress.placement   = false;
  progress.collapse    = false;

  return progress;
}
