# Selections Spec (control)
  Manage raycasting clicks for tiles, pieces.
  Manage raycasting clicks for advsqs, gambits, etc.  // TODO: future.

## 1. Purpose
  Manage the clicks (raycasting).

## 2. Data
 ### 2.1 Selection Sets
  pieceSelections - key
  tileSelections  - vts

## 3. UI
 ### 3.1 Accessors
  getSelections()       return { pieceSelections, tileSelections }
  getPieceSelections()  return { pieceSelections }
  getTileSelections()   return { tileSelections }

 ### 3.1 Pieces | Tiles
  isSelected...()
  select...()
  deselect...()
  clearAll...()

 ### 3.2. Raycasting
  handlePieceClick(group)
  handleTileClick(vts)
