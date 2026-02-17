// qt3/model/model.js

/* The QT3 model consists a just a handful of items:
  A status string (statusString) - the player's next actions.
  An error string (errorString) - lets players know when they have made a UI mistake.
  An analysis string (analysisString) - stats about the current game.

  The state string (stateString) - human readable history of the game.
  The history pointer (histPtr) - where we are in the game, undo/redo/restart.
*/

let stateString = "";
let histPtr = 0;

let numOfMoves = 0; // Potential placement/collapses.
const maxNumOfMoves = 9+4; // Potential placement/collapses.

export function setStateString (state) {
  stateString = state;
}

export function setHistptr (ptr) {  // 0 => Restart.
  histPtr = ptr;
}

export function slipHistptr (steps) {  // Undo (-1), Redo (+1).

  histPtr += steps;
  if(histPtr < 0) histPtr = 0;
  if(histPtr > numberOfMoves) histPtr = numberOfMoves;
}

export function analyzeGame_1(stateString) {
  // TODO: code to analyze a stateString.

  return {
    placementMoves: 0, 
    collapseMoves: 0, 
    numberOfMoves: 0,           // Should equal placementMoves + collapseMoves.
    numberOfSeparables: 0,      // Number of separables (max of 4), unentangled spooky pairs.
    numberOfEntanglements: 0,   // Number of entanglements (max of 3).
    collapsedMoves: 0,          // Array of moves which have collapsed.
    collapsedSquares: 0,        // Array of squares with classical marks.
    numberOfLoopMoves: 0,       // Number of moves/squares in the loop part of all cyclic entanglements.
    numberOfStemMoves: 0,       // Number of moves/squares on the stem part of all cyclic entanglements.
    numberOfClassicalRealities: 0,  // Max of 27.
    fieldOfClassicalRealities: 0,   // 2^n.
    sequentialChronoBlocks: 0,      // Max of 4.
    overlappingChronoBlocks: 0,     // Ambiguous - todo.
    nestedChronoBlocks: 0,          // Ambiguous - depth?
  };
}

export function analyzeGame(stateString) {
  if (!stateString || stateString.trim() === "") {
    return emptyAnalysis();
  }

  // Generate raw data.
  const placementRegex = /([XO])(\d+)\+\((\d),(\d)\)/g;
  const collapseRegex  = /!([XO])(\d+)\((\d)\)/g;
  const loopRegex      = /\[(\d+)(?:\|(\d+))?\]/g;

  let placementMoves = 0;
  let collapseMoves  = 0;

  const collapsedMovesSet   = new Set();
  const collapsedSquaresSet = new Set();
  const loopMovesSet        = new Set();
  const stemMovesSet        = new Set();

  // Placements
  let match;
  while ((match = placementRegex.exec(stateString)) !== null) {
    placementMoves++;
  }
  console.log("placementMoves", placementMoves);

  // Collapses
  while ((match = collapseRegex.exec(stateString)) !== null) {
    collapseMoves++;
    collapsedMovesSet.add(Number(match[2]));
    collapsedSquaresSet.add(Number(match[3]));
  }

  // Loops
  while ((match = loopRegex.exec(stateString)) !== null) {
    const cycleDigits = match[1];
    const stemDigits  = match[2] || "";

    cycleDigits.split("").forEach(d => loopMovesSet.add(Number(d)));
    stemDigits.split("").forEach(d => stemMovesSet.add(Number(d)));
  }

  // Derived counts
  const numberOfMoves = placementMoves + collapseMoves;

  // Classical realities approximation
  const unresolvedMoves = placementMoves - collapsedMovesSet.size;
  const fieldOfClassicalRealities = Math.pow(2, unresolvedMoves);
  const numberOfClassicalRealities = fieldOfClassicalRealities;

  // Entanglements approximation
  const numberOfEntanglements = loopMovesSet.size > 0 ? 1 : 0;

  // const numberOfSeparables = placementMoves - loopMovesSet.size;
  // Build square → move count map
  const squareMap = new Map();

  placementRegex.lastIndex = 0;  // reset regex

  while ((match = placementRegex.exec(stateString)) !== null) {

    const move = Number(match[2]);
    const sq1  = Number(match[3]);
    const sq2  = Number(match[4]);

    if (!squareMap.has(sq1)) squareMap.set(sq1, new Set());
    if (!squareMap.has(sq2)) squareMap.set(sq2, new Set());

    squareMap.get(sq1).add(move);
    squareMap.get(sq2).add(move);
  }

  // Count separables
  let numberOfSeparables = 0;

  placementRegex.lastIndex = 0;  // reset again

  while ((match = placementRegex.exec(stateString)) !== null) {

    const move = Number(match[2]);
    const sq1  = Number(match[3]);
    const sq2  = Number(match[4]);

    const sq1Shared = squareMap.get(sq1).size > 1;
    const sq2Shared = squareMap.get(sq2).size > 1;

    if (!sq1Shared && !sq2Shared) {
      numberOfSeparables++;
    }
  }

  return {
    placementMoves,
    collapseMoves,
    numberOfMoves,

    numberOfSeparables,
    numberOfEntanglements,

    collapsedMoves: [...collapsedMovesSet],
    collapsedSquares: [...collapsedSquaresSet],

    numberOfLoopMoves: loopMovesSet.size,
    numberOfStemMoves: stemMovesSet.size,

    numberOfClassicalRealities,
    fieldOfClassicalRealities,

    sequentialChronoBlocks: collapseMoves,
    overlappingChronoBlocks: 0,  // TODO
    nestedChronoBlocks: 0        // TODO
  };
}

function emptyAnalysis() {
  return {
    placementMoves: 0,
    collapseMoves: 0,
    numberOfMoves: 0,

    numberOfSeparables: 0,
    numberOfEntanglements: 0,
    
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


