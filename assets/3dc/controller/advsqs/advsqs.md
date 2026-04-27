# Advsqs Spec (Control Level)
  Enforce MVC pattern with directory structure.

## 1. Purpose
  All the code for interacting with the advsq panel.

## 2. Undo
  How this panel and feature interacts with the state.

 ### 2.1 Buffers (AdvSqs)
  These are specified in game.js.
  - Setup
  - Moves
  - Gambits
  - AdvSqs <- uses this one.

 ### 2.2 Undo Record
  let { srcTile, quad, perimeter, stride, opacity } = normalize(payload); // Unpack primary fields.

 ### 2.3 Render
  #### 2.3.1 Creation
    view.makeAdvsq(newAdvsq)
  #### 2.3.2 Destruction
    view.clearAdvSq()

 ### 2.4 AdvSq Panel
  view.setAdvsqPanelParams(newAdvsq)
  - Calls computeAdvsqDerived({ quad, perimeter, stride })

 ### 2.5 Game Panel Undo Buffers
  state.makeAdvsq(newAdvsq)

## 3. Stride Stability
  An interesting question is how to morph the stride tile when an advsq expands or shrinks.

  Algorithm:
  - Stride is pinned to apex tile, if on it.
  - Stride is pinned to an end tile, if on one.
  - Stride maintains constant offset from closest end tile.
    - Enough shrinkage will change it's pinning to the apex tile.
  - A null stride or perimeter 0 (source tile) starts the pinning on the apex tile.

## Summary
  - panelDispatch(payload)
  - handle<...>(payload)
    - Parse payload
    - Manipulate data
      - Update panel derived fields
    - Create new advsq specs
    - Have state enter them into the undo buffer stack
    - Have view render it
    - Update undo stack list in the game panel
  - Undo
    - Clear current advsq.
    - Make previous advsq, or retreat to upstream buffer, or "Bottom Sentry".
  - Redo
    - Clear current advsq.
    - Make next advsq unless null, "Top Sentry".
  - Rerun
    - Clear current advsq.
    - Retreat to first entry in the state buffer if not empty.
      - Make first advsq.
    - If not empty, retreat up the undo stack until a non empty buffer is found.
      - Nothing to render.
    - If undo buffer is fully empty, "Bottom Sentry".

