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
    grid: { // Not really used, not yet, maybe not ever, but describes the QT3 board layout.
      rows: 3,
      cols: 3,
      cell: {
        rows: 3,
        cols: 3
      }
    },
    gridLines: {
      gap: 10,          // space between 3x3 square blocks
      thickness: 3,     // thickness of each line
      separation: 4,    // spacing between the doubled lines
      offset: 4,        // Better placement of the doubled lines.
      color: "#000000"
    },
    squares: {
      square1: {
        square: { x: 160, y: 100,  w: 90, h: 90 },
        spookyCells: {
          m1: { x: 160, y: 100,  w: 30, h: 30 },
          m2: { x: 190, y: 100,  w: 30, h: 30 },
          m3: { x: 220, y: 100,  w: 30, h: 30 },
          m4: { x: 160, y: 130,  w: 30, h: 30 },
          m5: { x: 190, y: 130,  w: 30, h: 30 },
          m6: { x: 220, y: 130,  w: 30, h: 30 },
          m7: { x: 160, y: 160,  w: 30, h: 30 },
          m8: { x: 190, y: 160,  w: 30, h: 30 },
          m9: { x: 220, y: 160,  w: 30, h: 30 },
        },
        },
      square2: {
        square: { x: 260, y: 100,  w: 90, h: 90 },
        spookyCells: {
          m1: { x: 260, y: 100,  w: 30, h: 30 },
          m2: { x: 290, y: 100,  w: 30, h: 30 },
          m3: { x: 320, y: 100,  w: 30, h: 30 },
          m4: { x: 260, y: 130,  w: 30, h: 30 },
          m5: { x: 290, y: 130,  w: 30, h: 30 },
          m6: { x: 320, y: 130,  w: 30, h: 30 },
          m7: { x: 260, y: 160,  w: 30, h: 30 },
          m8: { x: 290, y: 160,  w: 30, h: 30 },
          m9: { x: 320, y: 160,  w: 30, h: 30 },
        },
        },
      square3: {
        square: { x: 360, y: 100,  w: 90, h: 90 },
        spookyCells: {
          m1: { x: 360, y: 100,  w: 30, h: 30 },
          m2: { x: 390, y: 100,  w: 30, h: 30 },
          m3: { x: 420, y: 100,  w: 30, h: 30 },
          m4: { x: 360, y: 130,  w: 30, h: 30 },
          m5: { x: 390, y: 130,  w: 30, h: 30 },
          m6: { x: 420, y: 130,  w: 30, h: 30 },
          m7: { x: 360, y: 160,  w: 30, h: 30 },
          m8: { x: 390, y: 160,  w: 30, h: 30 },
          m9: { x: 420, y: 160,  w: 30, h: 30 },
        },
      },

      square4: {
        square: { x: 160, y: 200,  w: 90, h: 90 },
        spookyCells: {
          m1: { x: 160, y: 200,  w: 30, h: 30 },
          m2: { x: 190, y: 200,  w: 30, h: 30 },
          m3: { x: 220, y: 200,  w: 30, h: 30 },
          m4: { x: 160, y: 230,  w: 30, h: 30 },
          m5: { x: 190, y: 230,  w: 30, h: 30 },
          m6: { x: 220, y: 230,  w: 30, h: 30 },
          m7: { x: 160, y: 260,  w: 30, h: 30 },
          m8: { x: 190, y: 260,  w: 30, h: 30 },
          m9: { x: 220, y: 260,  w: 30, h: 30 },
        },
        },
      square5: {
        square: { x: 260, y: 200,  w: 90, h: 90 },
        spookyCells: {
          m1: { x: 260, y: 200,  w: 30, h: 30 },
          m2: { x: 290, y: 200,  w: 30, h: 30 },
          m3: { x: 320, y: 200,  w: 30, h: 30 },
          m4: { x: 260, y: 230,  w: 30, h: 30 },
          m5: { x: 290, y: 230,  w: 30, h: 30 },
          m6: { x: 320, y: 230,  w: 30, h: 30 },
          m7: { x: 260, y: 260,  w: 30, h: 30 },
          m8: { x: 290, y: 260,  w: 30, h: 30 },
          m9: { x: 320, y: 260,  w: 30, h: 30 },
        },
        },
      square6: {
        square: { x: 360, y: 200,  w: 90, h: 90 },
        spookyCells: {
          m1: { x: 360, y: 200,  w: 30, h: 30 },
          m2: { x: 390, y: 200,  w: 30, h: 30 },
          m3: { x: 420, y: 200,  w: 30, h: 30 },
          m4: { x: 360, y: 230,  w: 30, h: 30 },
          m5: { x: 390, y: 230,  w: 30, h: 30 },
          m6: { x: 420, y: 230,  w: 30, h: 30 },
          m7: { x: 360, y: 260,  w: 30, h: 30 },
          m8: { x: 390, y: 260,  w: 30, h: 30 },
          m9: { x: 420, y: 260,  w: 30, h: 30 },
        },
      },

      square7: {
        square: { x: 160, y: 300,  w: 90, h: 90 },
        spookyCells: {
          m1: { x: 160, y: 300,  w: 30, h: 30 },
          m2: { x: 190, y: 300,  w: 30, h: 30 },
          m3: { x: 220, y: 300,  w: 30, h: 30 },
          m4: { x: 160, y: 330,  w: 30, h: 30 },
          m5: { x: 190, y: 330,  w: 30, h: 30 },
          m6: { x: 220, y: 330,  w: 30, h: 30 },
          m7: { x: 160, y: 360,  w: 30, h: 30 },
          m8: { x: 190, y: 360,  w: 30, h: 30 },
          m9: { x: 220, y: 360,  w: 30, h: 30 },
        },
        },
      square8: {
        square: { x: 260, y: 300,  w: 90, h: 90 },
        spookyCells: {
          m1: { x: 260, y: 300,  w: 30, h: 30 },
          m2: { x: 290, y: 300,  w: 30, h: 30 },
          m3: { x: 320, y: 300,  w: 30, h: 30 },
          m4: { x: 260, y: 330,  w: 30, h: 30 },
          m5: { x: 290, y: 330,  w: 30, h: 30 },
          m6: { x: 320, y: 330,  w: 30, h: 30 },
          m7: { x: 260, y: 360,  w: 30, h: 30 },
          m8: { x: 290, y: 360,  w: 30, h: 30 },
          m9: { x: 320, y: 360,  w: 30, h: 30 },
        },
        },
      square9: {
        square: { x: 360, y: 300,  w: 90, h: 90 },
        spookyCells: {
          m1: { x: 360, y: 300,  w: 30, h: 30 },
          m2: { x: 390, y: 300,  w: 30, h: 30 },
          m3: { x: 420, y: 300,  w: 30, h: 30 },
          m4: { x: 360, y: 330,  w: 30, h: 30 },
          m5: { x: 390, y: 330,  w: 30, h: 30 },
          m6: { x: 420, y: 330,  w: 30, h: 30 },
          m7: { x: 360, y: 360,  w: 30, h: 30 },
          m8: { x: 390, y: 360,  w: 30, h: 30 },
          m9: { x: 420, y: 360,  w: 30, h: 30 },
        },
      },
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
    h: 30
  },

  ensemble: {  // Classical ensemble (variable content, full width)
    x: 0,
    y: 470,
    w: 900,
    h: 320
  }
};
