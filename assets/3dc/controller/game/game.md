# Game Spec (Undo, etc.)
  Encourage MVC pattern with directory structure.

## 1. Purpose
  All the code for interacting with the game panel.
  Uses the new undo system in the state layer.

## 2. Game Panel
 ### 2.1 Buttons
  - Undo | Redo
  - Rewind | FF>>
  - Load | Save
 ### 2.2 Scroll list
  - Setup:   0/0
  - Moves:   0/0
  - Gambits: 0/0
  - AdvSqs:  0/0

## 3. Theory
  - This is a descrete log undo system.
    - It consists of 4 sequential buffers.
    - {"Setup":[],"Moves":[],"Gambits":[],"AdvSqs":[]}
  - Within each buffer undo/redo advances/retreats by one event.
    - If at the end, redo advances to the next buffer.
    - If at the beg, undo retreats to the prev buffer.
  - Rewind goes to the first element in the current buffer.
    - It transitions to the last element in the previous buffer.
  - Fast forward goes to the last element in the current buffer.
    - It transitions to the first element in the next buffer.
  - The ends of the sequence are guarded by Top and Bottom Sentries.
  - Save captures the entire buffer sequence.
    - A condensed version is sent to the console.log.
    - A fully expanded version is copied to the clipboard.  
    - The most useful form is to slightly expand the condensed version (manual process).
  - Load initializes the game with the contents of the clipboard.
    - Use redo/undo and rewind/FF>> to review the captured history.
  
## 4. Arch
  - There are four state modules.
  - There is state buffer for each module.
  - There is a panel for each module.
  - Each module follows the MVC idiom, thus 4 directories and 12 files.
  - There is a directory at the controller layer for the Game panel, 3 more files.
  - There is a directory at the model layer for the state buffers, 3 more files.

## 5. Code (game.js)
 ### 5.1 Standard file layout
  - Docs
  - Json
  - Dependencies
  - Globals
  - UI
  - Handle functions
  - Helpers
 ### 5.2 UI
  - panelDispatch(payload)
  - buildPayload(panel, action)
  - showUndoStatus()
 ### 5.3 Handle Functions
  - Undo|Redo
  - Rewind|FastForward
  - Load|Save

## 6. Algorithms
  This structure, while very effective, is complex.
 ### 6.1 Undo
  - Reverse travers state buffers until finding a non null one, or the Bottom Sentry.
    - Process that one undo.
    - Update the state status list in the panel.
 ### 6.2 Redo
  - Foward travers state buffers until finding a non null one, or the Top Sentry.
    - Process that one redo.
    - Update the state status list in the panel.
 ### 6.3 Rewind
  - Reverse traverse state buffers until finding non null one, or the Bottom Sentry.
    - If at first element in buffer, process that one undo.
    - If not, undo until at the first element.
      - For advsqs, do not recursively undo, just skip to the beginning.
    - Update the state status list in the panel.
 ### 6.4 Fast Forward
  - Forward traverse state buffers until finding non null one, or the Top Sentry.
    - If at last element in buffer, process that one redo.
    - If not, redo until at the last element.
      - For advsqs, do not recursively redo, just skip to the end.
    - Update the state status list in the panel.

## 7. Validate Load/Save
  Can load either single string or pretty print.
  - May pop up a permissions dialog, may pop up only once.
  - Is very useful to summarize each string with 4 numbers; **0-0-0-0**.
  - Most useful to record twice, 
    - once as single line (wraps) for each copy and paste
    - once as a manual pretty print, shows basic contents by buffer and action, w/o too many line.

 ### 7.1 3 boards, 3 moves, 3 gambits, 10 advsqs
  **3-3-3-10**

 ### 7.2 Current Bugs
  Gambits not updating.

## 8. Examples
 ### 8.1. Example Full Undo
  **1-4-3-8**

 ### 8.2 Null State
  **0-0-0-0**
    {"Setup":[],"Moves":[],"Gambits":[],"AdvSqs":[]}

 ### 8.3 Setup
  **2-0-0-0**

 ### 8.4 Setup, Advsqs
  **2-0-0-6**

 ### 8.5 Moves, Gambits
  **0-4-3-0**

 ### 8.6 Advsqs
  **0-0-0-6**

 ### 8.7 Setup, Moves, Gambits, Advsqs
  **2-4-3-6**

 ### 8.8 Min Full State (1-1-1-7)

## 9. Tutorial of 3D Chess Basics
 ### 9.1 Quadrant Move
  **2-0-0-0**

 ### 9.2 Linear Move
  **2-0-0-0** - Horizontal Rook Plane

  **2-0-0-0** - Both Rook Planes

 ### 9.3 Duplex Move
  **2-0-0-0**

 ### 9.4 Overlap Move
  **2-0-0-0**

 ### 9.5 Knight Move
  **2-0-0-0**

