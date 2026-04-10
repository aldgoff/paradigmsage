# Render Spec
  Cliff notes on the render engine chosen - Three.js.

## 1. Features
  Library Recommendation (Grounded in Your Constraints)

  - You need:
    - Orthographic camera ✅
    - Fine control of rendering (no black box) ✅
    - Lightweight experimentation ✅
    - Easy integration with DOM overlay ✅
    - Good picking (click detection) ✅
    - Primary Recommendation: Three.js
    - Why it fits your system:

## 1.1. Orthographic camera support
  - Native, stable
  - Essential for your projection constraint

## 1.2. Full control over materials
  - You will need:
    - subtle edge coloring
    - translucent decorators
    - layered overlays
  - Three.js gives:
    - shader access (if needed later)
    - but simple materials to start

## 1.3. Scene graph matches your layers
  - You can map directly:
    - Scene
    - Tile mesh layer
    - Decorator mesh layer
    - Piece mesh layer

  → aligns with A11 cleanly

## 1.4. Raycasting (click detection)
  - Built-in:
    - click tiles
    - click pieces

  → supports your “board = interface” model

## 1.5. Incremental complexity
  - You can start with:
    - cubes + colors
  - And evolve to:
    - custom geometry
    - instancing (performance later)





## 1. Purpose/Concepts/Example/Canonical/Formats/Parsing/Architecture/Functions/Data/...
  text

 ### 1.1 SubSection
  text

## N. Invariants (typically last section)
  Formally redundant consequences of the spec that must always hold.
  Used as drift guards and cross-checks across data, code, and tests.

