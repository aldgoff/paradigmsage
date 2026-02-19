// ./assets/qt3/js/model/process.js

export function processClick(stateString, event) {
  const square = event.square;
  const cell = event.cell;
  const squareNum = Number(square.slice(-1)); // Last char of 'square' is the move number.

  const result = {state: stateString, status: "action or blocked"};

  return result;
}

