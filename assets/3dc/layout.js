/* File: layout.js
  Path: ./3dc/layout.js
  Purpose: Layout of visual elements on the various canvases.
  Author: Allan Goff
  Date: 4/03/26
  UI: the layout fields and cavases.
*/

export const LAYOUT_3DC = {
  threeDCanvas: {
    size: {},
    loc: {},
  },
  gameCanvas: {
    size: {},
    loc: {},
    dragable: true,
    controls: {
      buttons: [
        { label: "New Game",  key: "n", x: 5, y: 100, w: 130, h: 40, enabled: true },
        { label: "Rerun",     key: "r", x: 5, y: 150, w: 130, h: 30, enabled: false },
        { label: "Undo",      key: "u", x: 5, y: 190, w: 130, h: 30, enabled: false },
        { label: "Redo",      key: "d", x: 5, y: 230, w: 130, h: 30, enabled: false },
        { label: "Copy",      key: "?", x: 5, y: 270, w: 130, h: 40, enabled: true },
        { label: "Paste",     key: "?", x: 5, y: 270, w: 130, h: 40, enabled: true },
      ],
      checkBoxes: {
        autoloadFromTray: false,
      },
      radioBoxes: {
        board: ["8x8x8", "10x8x8", "10x10x10"],
      },
    }
  },
  listingCanvas: {
    size: {},
    loc: {},
    dragable: true,
    controls: {
      buttons: [
        { label: "Rerun",     key: "r", x: 5, y: 150, w: 130, h: 30, enabled: false },
        { label: "Undo",      key: "u", x: 5, y: 190, w: 130, h: 30, enabled: false },
        { label: "Redo",      key: "d", x: 5, y: 230, w: 130, h: 30, enabled: false },
        { label: "Present",   key: "d", x: 5, y: 230, w: 130, h: 30, enabled: false },
      ],
      scrollBar: {}
    },
    list: {
      title: {},
      header: {},
      rows: {},
    }
  },
  trayCanvas: {
    size: {},
    loc: {},
    dragable: true,
    visible: {},
    gap: {},
  },
  gambitCanvas: {
    size: {},
    loc: {},
    dragable: true,
    cube: {},
    direction: {},
  },
  viewCanvas: {
    size: {},
    loc: {},
    dragable: true,
    pov: {},
    zoom: {},
    jitter: {},
    levelSep: {},
  },
}

