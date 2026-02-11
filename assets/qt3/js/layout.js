// qt3/layout.js

export const QT3_LAYOUT = {
  statusBox: {  // Status / narration (always visible, top)
    x: 0,
    y: 0,
    w: 900,
    h: 80
  },

  controls: {  // Controls (meta-actions, left column)
    x: 5,
    y: 100,
    w: 145,
    h: 260
    },

  board: {  // QT3 board (spatial truth, centered)
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

  moveListQT3: {  // Quantum move listing (temporal truth)
    x: 480,
    y: 100,
    w: 200,
    h: 300
    },

  moveListCT3: {  // Classical move listing (conditional, fixed anchor)
    x: 700,
    y: 100,
    w: 200,
    h: 300
  },

  stateBox: {  // Canonical state string (ledger)
    x: 0,
    y: 420,
    w: 900,
    h: 50
  },

  ensemble: {  // Classical ensemble (variable content, full width)
    x: 0,
    y: 490,
    w: 900,
    h: 320
  }
};
