// qt3/layout.js

export const QT3_LAYOUT = {
  board: {
    x: 0,
    y: 0,
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

  moveListQT3: { x: 320, y: 0, w: 200, h: 300 },
  ensemble:    { x: 0,   y: 320, w: 520, h: 240 },
  moveListCT3: { x: 540, y: 320, w: 200, h: 240 },
  stateBox:    { x: 0,   y: 580, w: 760, h: 40  },
  controls:    { x: 0,   y: 640, w: 760, h: 40  },
  statusBox:   { x: 0,   y: 690, w: 760, h: 80  }
};
