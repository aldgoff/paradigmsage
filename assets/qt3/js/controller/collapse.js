// Collapse.js.

export function cellInLoop(event, placements, cycleMoves) {  // { cell: cellNum, square: squareNum }.
  const squareNum = Number(event.square.slice(-1));
  const cellNum   = Number(event.cell.slice(-1));  // m3 → 3

  // Must be one of the loop moves.
  if (!cycleMoves.includes(cellNum)) return null;

  // Find the placement for that move.
  const p = placements.find(p => p.move === cellNum);
  if (!p) return null;

  // That move must occupy this square.
  if (!p.squares.includes(squareNum)) return null;

  // Success
  return {
    cell: cellNum,
    square: squareNum
  };
}

export function computeCollapseResolution(
  placements,
  cycleMoves,
  stemMoves,
  triggerMove,
  triggerSquare
) {

  const componentMoves = new Set([
    ...cycleMoves,
    ...stemMoves
  ]);

  const resolved = {};
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
