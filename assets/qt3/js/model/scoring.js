// ./assets/qt3/js/model/scoring.js

const GRAMMAR = {
  placement:        /([XO])(\d+)\+\((\d),(\d)\)/g,
  collapseEvent:    /@([XO])(\d+)\((\d)\)/g,
  collapseResolve:  /!([XO])(\d+)\((\d)\)/g,
  spooky:           /([XO])(\d+)\+\((\d)$/
  // loop:          /\[(\d+)(?:\|(\d+))?\]/g;
};

function extractClassicalSquares(state) {
  const classicalMap = new Map();
  const collapseRegex = new RegExp(GRAMMAR.collapseResolve);
  let match;

  while ((match = collapseRegex.exec(state)) !== null) {
    const player = match[1];
    const move   = Number(match[2]);
    const square = Number(match[3]);

    classicalMap.set(square, { player, move });
  }

  return classicalMap;
  }

function detectWinningLines(classicalMap) {
  const lines = [
    [1,2,3], [4,5,6], [7,8,9],
    [1,4,7], [2,5,8], [3,6,9],
    [1,5,9], [3,5,7]
  ];

  const wins = { X: [], O: [] };

  for (const line of lines) {
    const marks = line.map(sq => classicalMap.get(sq));

    if (marks.every(m => m && m.player === marks[0].player)) {
      const player = marks[0].player;
      const time   = Math.max(...marks.map(m => m.move));
      const moves  = marks.map(m => m.move);

      wins[player].push({
        squares: line,
        moves,
        time
      });
    }
  }

  if (wins.X.length === 0 && wins.O.length === 0) {
    return null;
  }

  return wins;
  }

function computeScoreFromWins(wins) {
  const result = { X: 0, O: 0 };

  const allWins = [
    ...wins.X.map(w => ({ player: 'X', ...w })),
    ...wins.O.map(w => ({ player: 'O', ...w }))
  ];

  if (allWins.length === 0) return result;

  allWins.sort((a,b) => a.time - b.time);

  const first = allWins[0];
  result[first.player] = 1.0;

  if (allWins.length > 1) {
    const second = allWins[1];
    if (second.player !== first.player) {
      result[second.player] = 0.5;
    }
  }

  // Double-win refinement
  for (const player of ['X','O']) {
    if (wins[player].length >= 2) {
      const [w1, w2] = wins[player];

      const shareMove9 =
        w1.moves.includes(9) &&
        w2.moves.includes(9);

      if (shareMove9) {
        result[player] = 2.0;  // full double
      } else {
        result[player] = 1.5;  // late double
      }
    }
  }

  return result;
  }

function isBoardExhausted(state) {
  return !hasLegalMoves(state);
}

export function hasLegalMoves(state) {
  /**
   * Returns true if at least one legal placement move remains.
   *
   * A move is legal iff there exists at least one square
   * that is not classical (i.e., not collapsed).
   */

  const classicalMap = extractClassicalSquares(state);

  // If all 9 squares are classical, no legal moves remain
  if (classicalMap.size === 9) {
    return false;
  }

  return true;
}

export function evaluateGame(state) {
  /** Computes the QT3 game result from a canonical state string.
   *
   * A win requires three classical marks in a row (row, column, or diagonal),
   * or game exhaustion, when no more moves are possible, if there are no
   * 3-rows on the board, then the game is a draw (cat's game) {X0, O0}.
   * The “time” of a winning line is the highest move index in that line.
   *
   * Scoring rules: this is a complete set.
   * - Cat's game {X0, O0}.
   * - Single win → 1.0 {X1, O0}, {X0, O1}.
   * - Earlier win beats later win → 1.0 vs 0.5 {X1, O0.5} {X0.5, O1}.
   * - Double win (two lines, no shared move 9) → 1.5  (late double) {X1.5, O0}
   * - Double win (two lines sharing move 9) → 2.0     (full double) {X2.0, O0}
   *
   * @param {string} state - existing QT3 canonical state string.
   *
   * @returns {over: true, score: { X: number, O: number }, wins: lines}
   */
  let classicalMap = extractClassicalSquares(state);
  let win3rows     = detectWinningLines(classicalMap);
  let score = {X:0,O:0};

  if(win3rows != null) {
    return { over: true, score: computeScoreFromWins(win3rows), wins: win3rows};
  }

  if(isBoardExhausted(state)) {
    return { over: true, score: {X:0,O:0}, wins: win3rows};
  }

  return { over: false, score: {X:0,O:0}, wins: win3rows };
}

