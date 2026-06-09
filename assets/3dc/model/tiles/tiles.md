# Tiles Spec (model)
  Board and tray tiles

## 1. Purpose
  Maintain and manage state of each tile.

## 2. State Space
  Visualization

## 3. States
  - Position  (fixed)
  - Container
    - Board    (fixed)
    - Tray     (fixed)
    - Virtual  (ephemeral)
  - Selected   (true|false)
  - Confluence (decorator stack)
  - Offset     (z-axis)
  
