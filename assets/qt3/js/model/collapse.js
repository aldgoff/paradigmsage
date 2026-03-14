// ./assets/qt3/js/model/collapse.js

export function cellInLoop(intent, placements, cycleMoves) {  // { cell: cellNum, square: squareNum }.
  const squareNum = intent.squareNum;
  const cellNum   = intent.cellNum;
  
  // Must be one of the loop moves.
  if (!cycleMoves.includes(cellNum)) {
    // console.log("cellNum not in array cycleMoves.", cellNum, cycleMoves);
    return null;
  }

  // Find the placement for that move.
  const p = placements.find(p => p.move === cellNum);
  if (!p) {
    // console.log("cellNum not in placements array.", cellNum, placements);
    return null;
  }

  // That move must occupy this square.
  if (!p.squares.includes(squareNum)) {
    // console.log("squareNum not in placements squares", squareNum, p.squares);
    return null;
  }

  // Success
  return {
    cell: cellNum,
    square: squareNum
  };
}

export function computeCollapseResolution(placements,cycleMoves,stemMoves,
                                          triggerMove,triggerSquare) {
  const componentMoves = new Set([
    ...cycleMoves,
    ...stemMoves
  ]);

  const resolved = {};  // { 1: 4, 2: 9, 3: 5, ... }
  const stack = [];

  resolved[triggerMove] = triggerSquare;
  stack.push(triggerMove);

  while (stack.length > 0) {
    const move = stack.pop();
    const square = resolved[move];

    for (const p of placements) {
      if (!componentMoves.has(p.move)) continue;
      if (p.move === move) continue;
      if (resolved[p.move] !== undefined) continue;

      const [a, b] = p.squares;

      if (a === square || b === square) {
        const forcedSquare = (a === square) ? b : a;
        resolved[p.move] = forcedSquare;
        stack.push(p.move);
      }
    }
  }

  return resolved;
}
