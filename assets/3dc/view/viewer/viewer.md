# Viewer Spec (view)
  The viewer panel.

## 1. Purpose
  Render and derender the trays in the scene.

## 2. Details
  - Need two render groups for the tray tiles in the vts space; one for White one for Black. 
  - Gap changes affect both equally. 
  - Gap changes (like the other viewer and camera controls) are not captured in the undo buffers. 
  - A gap change derenders the current groups, then re-renders them in the new location. 
  - No animation, just appear and - disappear. 
  - Same for the show/hide buttons. 
  - Should follow a common approach ala boards. 
  - Let the tiles be offwhite but with a default opacity of 50%. 
  - Both values should start as constants in the viewer.js file.

