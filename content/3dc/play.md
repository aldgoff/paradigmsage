---
title: "Play"
layout: "play"
---

**Play (INWORK)**
  A playable implemetation of 3D Chess with planar moves and advancement squares.
  The 3D board is a cube of cubes (8x8x8).
  Each tile is the bottom of a cube.
  An 8 color board includes the 2 bishop colors (tile faces) and the 4 duke colors (tile edges).
  Active Panels: Setup Control and Camera Control. 
  Click on the **Make Board** button to see a board.
  Play with **camera controls**.
  **Raycasting** demonstrated by toggling circles on clicked tiles.
  A growing POC for the render engine (4/14/26).
  (For the terminally impatient, you are witness to how the 'sausage' is made.)

  (Game has not yet been introduced in the PoP narrative.)

<!-- Load the Three.js Render... -->
<script type="module">
  import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
  window.THREE = THREE;
</script>

<!-- CSS -->
<style>
  #3dc-board {
    position: absolute;
    top: 0;
    left: 0;
    }
  
  .panel {
    position: absolute;
    border: 1px solid #888;
    background: rgba(255,255,255,0.95);
    padding: 8px;
    width: 145px;
    font-size: 12px;
    z-index: 20;
    cursor: move;
    }
  #move-list {
    font-family: monospace;
    white-space: pre;   /* Allows code to col align text. */
    height: 140px;
    }
  #move-window {
    font-family: monospace;
    width: 380px;
    }
  #undo-list {
    height: 66px;
    font-family: monospace;
    white-space: pre;
    }
  .panel-title {
    font-weight: bold;
    margin-bottom: 6px;
    }
  .section {
    margin-bottom: 8px;
    }
  .scroll-box {
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 4px;
  }

  #setup-window  { top: 180px; left:  100px; }  /* DOM Control Panels */
  #tray-window   { top: 180px; left:  300px; }
  #game-window   { top: 180px; left:  500px; }
  #move-window   { top: 360px; left:  100px; }
  #gambit-window { top: 180px; left:  700px; }
  #advsq-window  { top: 180px; left:  900px; }

  #camera-window { top: 600px; left: 150px; }
  /* Seampont - more DOM control panels... */
</style>

<!-- The 3DC Game... -->
<canvas id="3dc-board" width="1400" height="1800"></canvas>  <!-- 3D -->

 <!-- The DOM Control Panels -->
<div class="panel" id="setup-window">
  <div class="panel-title">Setup Control</div>

  <div class="section">
    <button data-action="makeBoard">Make Board</button>
  </div>

  <div class="section">
   <label> <input type="radio" name="board-size" value="8x8x8" checked> 8×8×8 </label><br>
   <label> <input type="radio" name="board-size" value="10x8x8"> 10×8×8 </label><br>
   <label> <input type="radio" name="board-size" value="10x10x10"> 10×10×10 </label>
  </div>  
  </div>

<div class="panel" id="tray-window">
  <div class="panel-title">Tray Control</div>

  <div class="section">
    <button data-action="makeTrays">Make Trays</button>
  </div>

  <div class="section">
   <label> <input type="radio" name="tray-type" value="real" checked> Real </label><br>
   <label> <input type="radio" name="tray-type" value="factory"> Factory </label><br>
  </div>  

  <div class="section">
    <button data-action="showTrays" disabled>Show</button>
    <button data-action="hideTrays" disabled>Hide</button>
    <button data-action="cycleGap" disabled>Cycle Gap</button>
  </div>
  </div>

<div class="panel" id="game-window">
  <div class="panel-title">Game Control</div>

  <div class="section">
    <button data-action="newGame">New</button>
    <button data-action="rerun">Rerun</button>
    <button data-action="undo">Undo</button>
    <button data-action="redo">Redo</button>
    <button data-action="load" >Load</button>
    <button data-action="save" >Save</button>
  </div>

  <div class="section scroll-box" id="undo-list">
    <!-- tbd go here -->
  </div>
  </div>

<div class="panel" id="move-window">
  <div class="panel-title">Move | White | Black | Coordinates | Annotations</div>

  <div class="section scroll-box" id="move-list">
    <!-- tbd go here -->
  </div>
  </div>

<div class="panel" id="gambit-window">
  <div class="panel-title">Gambit Control</div>

  <div class="section">
    <button data-action="freeze">Freeze AdvSq</button>
    <button data-action="prev">Prev</button>
    <button data-action="next">Next</button>
    <button data-action="delete">Delete</button>
    <button data-action="deselect">Deselect</button>
  </div>

  <div class="section scroll-box" id="gambit-list">
    <!-- advsq entries go here -->
  </div>
  </div>

<div class="panel" id="advsq-window">
  <div class="panel-title">AdvSq Control</div>

  <div class="section">
    <button data-action="place">Place</button>
    <button data-action="remove">Remove</button>
  </div>

  <div class="section">
  <label> Source Tile: <input type="string" name="advsq-src"       value="K3,3"> </label>
  <label> Quad:        <input type="number" name="advsq-quad"      min="1" step="1" value="1"> </label>
  <label> Perimeter:   <input type="number" name="advsq-perimeter" min="1" step="1" value="2"> </label>
  <label> Stride:      <input type="number" name="advsq-stride"    min="1" step="1" value="3"> </label>
  </div>

  <!-- Optional: key hints (visual only) -->
  <div class="section" style="font-size: 11px; color: #666;">
    Slip & Slide +: k i j
  </div>
  <div class="section" style="font-size: 11px; color: #666;">
    Slip & Slide -: ^k ^i ^j
  </div>

  <div class="section">
    <button data-action="nextQuad">Next Quad</button>
    <button data-action="nextPlane">Next Plane</button>
    <button data-action="nextPiece">Next Piece</button>
  </div>

  <div class="section">
    <label> Offboard Visibility
      <input type="range" name="offboard-opacity" min="0" max="1" step="0.01" value="0.5"> </label>
  </div>
</div>

<div class="panel" id="camera-window">
  <div class="panel-title">Camera Control</div>

  <div class="section">
    <button data-action="ZoomIn"> Zoom In </button>
    <button data-action="ZoomOut">Zoom Out</button>
    <button data-action="Ascend"> Ascend  </button>
    <button data-action="Descend">Descend </button>
  </div>

  <div class="section">
    <label> <input type="radio" name="camera-pov" value="white"    data-action="SetPOV"> White </label>
    <label> <input type="radio" name="camera-pov" value="neutral"  data-action="SetPOV" checked> Neutral </label>
    <label> <input type="radio" name="camera-pov" value="black"    data-action="SetPOV"> Black </label>
    <label> <input type="radio" name="camera-pov" value="negative" data-action="SetPOV"> Negative </label>
  </div>
</div>

<!-- Seampoint - more DOM control panels... -->


