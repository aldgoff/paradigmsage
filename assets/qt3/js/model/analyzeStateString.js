// ./assets/qt3/js/model/analyzeStateString.js

// Analyze a state string for multiple perameters of interest.

/**
 * Adds a collapse move to a QT3 state string.
 * @param {string} state - existing QT3 state string (must not be empty).
 * 
 * @returns {placementMoves}  // 0 - 9.
 */

export function analyzeStateString(state) {
  if (!state || state.trim() === "") {
    return emptyAnalysis();
  }

  // Generate raw data.
  // const collapseRegex  = /!([XO])(\d+)\((\d)\)/g;
  const loopRegex      = /\[(\d+)(?:\|(\d+))?\]/g;

  let placementMoves = 0;
  let collapseMoves  = 0;
  let numberOfMoves  = 0;

  let numberOfSeparables  = 0;
  let numberOfEntanglements  = 0;

  let match;

  // Placement events (player decisions).
  const placementRegex = /([XO])(\d+)\+\((\d),(\d)\)/g;
  while ((match = placementRegex.exec(state)) !== null) {
    placementMoves++;
  }

  // Collapse events (player decisions).
  const collapseEventRegex = /@([XO])(\d+)\((\d)\)/g;
  while ((match = collapseEventRegex.exec(state)) !== null) {
    collapseMoves++;
  }

  // Total number of moves.
  numberOfMoves = placementMoves + collapseMoves;

// while ((match = collapseRegex.exec(state)) !== null) {
//     collapseMoves++;
//     // collapsedMovesSet.add(Number(match[2]));
//     // collapsedSquaresSet.add(Number(match[3]));
//   }
 
  return {
    placementMoves,
    collapseMoves,
    numberOfMoves,

    numberOfSeparables,
    numberOfEntanglements,

    // collapsedMoves: [...collapsedMovesSet],
    // collapsedSquares: [...collapsedSquaresSet],

    // numberOfLoopMoves: loopMovesSet.size,
    // numberOfStemMoves: stemMovesSet.size,

    // numberOfClassicalRealities,
    // fieldOfClassicalRealities,

    // sequentialChronoBlocks: collapseMoves,
    // overlappingChronoBlocks: 0,  // TODO
    // nestedChronoBlocks: 0        // TODO
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
