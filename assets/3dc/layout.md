# Layout Spec
  Define the visual elements that go on the 3DC 2D control canvases.

## 1. Steps from the AI
  Here is the **minimal plumbing sequence**, aligned to your qt3 view pattern and your layout-driven approach:

1. Define a layout entry for the canvas (x, y, w, h, draggable, resizable, contents).
  Specified in play.md, instantiated in main.js, passed to controller and view.
2. Create a parent `<div class="canvas-window">` positioned absolutely from layout coords.
3. Insert a `<canvas>` element inside the div sized to layout (w, h).
4. Apply CSS for layering (`position:absolute`, `z-index`, border, background).
8. Attach pointerdown on the div to begin drag (store offset from cursor).
9. Attach pointermove on window to update div position while dragging.
10. Attach pointerup on window to end drag and commit position to state.

5. Initialize 2D context (`ctx = canvas.getContext("2d")`).
6. Write a renderer that outlines all layout-defined elements (strokeRect + labels).
7. Call renderer once after initialization to verify visual bounds (no logic yet).

11. Add a resize handle element (bottom-right corner div).
12. Attach pointerdown on handle to begin resize (store initial size + cursor).
13. Attach pointermove to update width/height and canvas dimensions.

14. On resize, update canvas width/height AND re-render contents.
15. Keep canvas drawing purely derived from layout (no embedded state).
16. Store current position/size in a controller object separate from layout.
17. Reconcile controller state with layout defaults on init (layout = seed only).
18. Ensure all drawing uses layout-relative coordinates (not DOM offsets).
19. Add simple visual chrome (border, title text) to distinguish canvas windows.
20. Verify multiple canvases can overlap and move independently over 3D canvas.

---

If you want next step, I’d formalize this into a **Canvas Controller spec (capture)** so it doesn’t drift as you add interaction.
