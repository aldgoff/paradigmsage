// qt3/layout.js

export const QT3_LAYOUT = {
  // Status / narration (always visible, top)
  statusBox: {
    x: 0,
    y: 0,
    w: 900,
    h: 80
  },

  // Controls (meta-actions, left column)
  controls: {
    x: 0,
    y: 100,
    w: 140,
    h: 260
  },

  // QT3 board (spatial truth, centered)
  board: {
    x: 160,
    y: 100,
    w: 300,
    h: 300,
    grid: {
      rows: 3,
      cols: 3,
      cell: {
        rows: 3,
        cols: 3
      }
    }
  },

  // Quantum move listing (temporal truth)
  moveListQT3: {
    x: 480,
    y: 100,
    w: 200,
    h: 300
  },

  // Classical move listing (conditional, fixed anchor)
  moveListCT3: {
    x: 700,
    y: 100,
    w: 200,
    h: 300
  },

  // Canonical state string (ledger)
  stateBox: {
    x: 0,
    y: 420,
    w: 900,
    h: 50
  },

  // Classical ensemble (variable content, full width)
  ensemble: {
    x: 0,
    y: 490,
    w: 900,
    h: 320
  }
};
