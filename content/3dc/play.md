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
    width: 180px;
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
    #game-window   { top: 180px; left:  60px; }  /* This places each draggable canvas onto the web page. */
    #camera-window { top: 240px; left:  90px; }
    #tray-window   { top: 320px; left: 120px; }
    #move-window   { top: 400px; left: 150px; }

    #gambit-window { top: 480px; left: 180px; }
    #setup-window { top: 180px; left: 480px; }
    /* Seampoint - more 2D canvases... */
</style>

<!-- The 3DC Game... -->
  <canvas id="3dc-board" width="1400" height="1800"></canvas>  <!-- 3D -->

  <!-- Size the 2D floating windows: allows DOM interface to drag them around. -->
  <div class="canvas-window" id="game-window">   <canvas id="3dc-game"   width="150" height="300"></canvas> </div>
  <div class="canvas-window" id="camera-window"> <canvas id="3dc-camera" width="150" height="300"></canvas> </div>
  <div class="canvas-window" id="tray-window">   <canvas id="3dc-tray"   width="150" height="300"></canvas> </div>
  <div class="canvas-window" id="move-window">   <canvas id="3dc-move"   width="150" height="300"></canvas> </div>

<div class="panel" id="setup-window">
  <div class="panel-title">Setup Control</div>

  <div class="section">
    <button data-action="makeBoard">Make Board</button>
    <button data-action="makeTrays">Make Trays</button>
  </div>
  </div>

<div class="panel" id="gambit-window">
  <div class="panel-title">Gambit Control</div>

  <div class="section">
    <button data-action="freeze">Freeze</button>
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
  <!-- Seampoint - more 2D canvases... -->


