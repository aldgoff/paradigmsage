// qt3/view/boardClicks.js

import { QT3_LAYOUT } from "../layout.js";

/* Square/cell clicks. */
let squareHandler = null;                 // Event triggered callback to
export function setSquareHandler(fn) {    // respond to square/cell clicks.
  squareHandler = fn;
  }

function handleSquareClicks(x, y) {       // View layer: event driven, called by canvas listener, invokes squareHandler.
  const squares = QT3_LAYOUT.board.squares;

  for (const squareKey in squares) {  // 9 squares.
    const spookyCells = squares[squareKey].spookyCells;

    for (const cellKey in spookyCells) {  // 9 spooky cells in each square.
      const cell = spookyCells[cellKey];

      const hit =
        cell.x <= x && x <= cell.x + cell.w &&
        cell.y <= y && y <= cell.y + cell.h;

      if (hit) {
        if (squareHandler) {
          squareHandler({     // event - {square: 'square1', cell: 'm1'}
            square: squareKey,
            cell: cellKey
          });
        }
        return true;
      }
    }
  }

  return false;
}
