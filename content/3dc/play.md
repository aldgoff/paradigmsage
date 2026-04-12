---
title: "Play"
layout: "play"
---

**Play (INWORK)**
  A playable version of 3D Chess with planar moves and advancement squares.
  The 3D board is a cube of cubes (8x8x8).
  Each tile is the bottom of a cube.
  An 8 color board includes the 2 bishop colors (tile faces) and the 4 duke colors (tile edges).
  Board is not yet active, just a POC for the render engine.

  (Game has not yet been introduced in the PoP narrative.)

<!-- Load the Three.js Render... -->
<script type="module">
  import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
  window.THREE = THREE;
</script>

<!-- CSS -->
<style>
  .canvas-window {
    position: absolute;
    border: 1px dashed #888;
    background: rgba(255,255,255,0.9);
    z-index: 10;
    cursor: move;
  }
  
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
    width: 130px;
    font-size: 12px;
    z-index: 20;
    cursor: move;
  }

  .panel-title {
    font-weight: bold;
    margin-bottom: 6px;
  }

  .section {
    margin-bottom: 8px;
  }

  .scroll-box {
    height: 80px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 4px;
  }

  /* Locate the 2D floating windows. */
    #move-window   { top: 400px; left: 350px; }  /* This places each draggable canvas onto the web page. */
    /* Seampoint - more 2D canvases... */

  /* DOM Control Panels */
    #setup-window  { top: 180px; left: 100px; }
    #tray-window   { top: 180px; left: 300px; }
    #game-window   { top: 180px; left: 500px; }
    #gambit-window { top: 180px; left: 700px; }

    #camera-window { top: 400px; left: 150px; }
    /* Seampont - more DOM control panels... */
</style>

<!-- The 3DC Game... -->
  <canvas id="3dc-board" width="1400" height="1800"></canvas>  <!-- 3D -->

  <!-- Size the 2D floating windows: allows DOM interface to drag them around. -->
  <div class="canvas-window" id="move-window">   <canvas id="3dc-move"   width="150" height="200"></canvas> </div>

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
    <button data-action="rerun" disabled>Rerun</button>
    <button data-action="undo" disabled>Undo</button>
    <button data-action="redo" disabled>Redo</button>
    <button data-action="load" >Load</button>
    <button data-action="save" disabled>Save</button>
  </div>
  </div>
  <!-- <div class="canvas-window" id="game-window">   <canvas id="3dc-game"   width="150" height="300"></canvas> </div> -->

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
<!-- <div class="canvas-window" id="gambit-window"> <canvas id="3dc-gambit" width="150" height="300"></canvas> </div> -->

<div class="panel" id="camera-window">
  <div class="panel-title">Camera Control</div>

  <div class="section">
    <button data-action="ZoomIn"> Zoom In </button>
    <button data-action="ZoomOut">Zoom Out</button>
    <button data-action="Ascend"> Ascend  </button>
    <button data-action="Descend">Descend </button>
  </div>

  <div class="section">
   <label> <input type="radio" name="pov-type" value="White"          > White    </label><br>
   <label> <input type="radio" name="pov-type" value="Neutral" checked> Neutral  </label><br>
   <label> <input type="radio" name="pov-type" value="Black"          > Black    </label><br>
   <label> <input type="radio" name="pov-type" value="Negative"       > Negative </label><br>
  </div>  
</div>
<!-- <div class="canvas-window" id="camera-window"> <canvas id="3dc-camera" width="150" height="200"></canvas> </div> -->

<!-- Seampoint - more DOM control panels... -->

