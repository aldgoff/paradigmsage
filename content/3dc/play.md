---
title: "Play"
layout: "play"
---

**Play (INWORK)**
  A playable implemetation of 3D Chess with planar moves and advancement squares.
  To see explanatory pages, click on **3DC** above.

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
    width: 350px;
    }
  #undo-state {
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

  #setup-window  { top: 120px; left:   80px; }  /* DOM Control Panels */
  #tray-window   { top: 260px; left:   80px; }
  #game-window   { top: 120px; left:  280px; }
  #move-window   { top: 900px; left:   80px; }
  #gambit-window { top: 610px; left:   80px; }
  #advsq-window  { top: 320px; left:  280px; }

  #camera-window { top: 460px; left:   80px; }
  /* Seampont - more DOM control panels... */
</style>

<!-- The 3DC Game... -->
<canvas id="3dc-board" width="1600" height="2000"></canvas>  <!-- 3D -->

<!-- The DOM Control Panels -->
<div class="panel" id="setup-window">
  <div class="panel-title">Setup Panel</div>

  <div class="section">
    <button data-action="makeBoard">Make Board</button>
  </div>

  <div class="section">
    <label> <input type="radio" name="board-size" value="8x8x8" checked> 8×8×8 </label><br>
    <label> <input type="radio" name="board-size" value="10x8x8"> 10×8×8 </label><br>
    <label> <input type="radio" name="board-size" value="10x10x10"> 10×10×10 </label>
  </div>  

  <div class="section">
    <label>Tray Type</lable>
    <!-- <button data-action="addTrays">Add Trays</button> -->
  </div>

  <div class="section">
    <label> <input type="radio" name="tray-type" value="none"> None </label><br>
    <label> <input type="radio" name="tray-type" value="real" checked> Real </label><br>
    <label> <input type="radio" name="tray-type" value="factory"> Factory </label><br>
  </div>  

  <div class="section">
    <!-- <button data-action="showTrays">Show</button>
    <button data-action="hideTrays">Hide</button> -->
    <label> <input type="checkbox" name="tray-visible" checked> Visible </label><br>
  </div>  

  <div class="section">
    <label> <input type="radio" name="initial-pos" value="standard" checked> Standard </label><br>
    <label> <input type="radio" name="initial-pos" value="manual"> Manual </label><br>
  </div>  

  <div class="section">
    <label>Gap<input name="tray-gap" type="number" min="0" step="1" value="1" max="3"> </label>
  </div>
  </div>

<div class="panel" id="game-window">
  <div class="panel-title">Game Panel</div>

  <div class="section">
    <button data-action="newGame">New</button>
    <button data-action="rerun">Rerun</button>
    <button data-action="undo">Undo</button>
    <button data-action="redo">Redo</button>
    <button data-action="load" >Load</button>
    <button data-action="save" >Save</button>
  </div>

  <div class="section scroll-box" id="undo-state">
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
  <div class="panel-title">Gambit Panel</div>

  <div class="section">
    <button data-action="freezeQ">Freeze Quadrant</button>
    <button data-action="freezeL">Freeze Linear</button>
    <button data-action="freezeO">Freeze Overlap</button>
    <button data-action="prev">Prev</button>
    <button data-action="next">Next</button>
    <button data-action="delete">Delete</button>
    <button data-action="deselect">Deselect</button>
  </div>

  <div class="section">
    <label> Open   :  <output name="gambit-nickname"  style="opacity:0.7; font-style:italic;"> [,,,,,]</output> </label>
  </div>
  <div class="section">
    <label> Blocked:  <output name="gambit-nickname"  style="opacity:0.7; font-style:italic;"> [,,,,,] </output> </label>
  </div>
  <div class="section">
    <label> MoveType: <output name="gambit-nickname"  style="opacity:0.7; font-style:italic;"> Quadrant </output> </label>
    <label> Overlap:  <output name="gambit-nickname"  style="opacity:0.7; font-style:italic;"> Qtile|etc </output> </label>
    <label> Piece:    <output name="gambit-nickname"  style="opacity:0.7; font-style:italic;"> Queen </output> </label>
  </div>

  <div class="section scroll-box" id="gambit-list">
    <!-- advsq entries go here -->
  </div>
  </div>

<div class="panel" id="advsq-window">
  <div class="panel-title">AdvSq Panel</div>

  <div class="section">
    <button data-action="place">Place</button>
    <button data-action="remove">Remove</button>
  </div>

  <div class="section">
    <button data-action="grow">Grow</button>
    <button data-action="shrink">Shrink</button>
  </div>

  <div class="section">
    <label> Source Tile  <input  name="advsq-src"       type="text"    value="KB4,4" maxlength="7" style="width: 60px;"> </label>
  </div>
  <div class="section">
    <label> Quad         <input  name="advsq-quad"      type="number"   min="1" step="1" value="1" max="60"> </label>
  </div>
  <div class="section">
    <label> Nickname:    <output name="advsq-nickname"  style="opacity:0.7; font-style:italic;"></output> </label>
  </div>
  <div class="section">
    <label> Plane:       <output name="advsq-plane"     style="opacity:0.7; font-style:italic;"></output> </label>
  </div>
  <div class="section">
    <label> Quad Type:   <output name="advsq-quadType"  style="opacity:0.7; font-style:italic;"></output> </label>
  </div>
  <div class="section">
    <label> Perimeters   <input  name="advsq-perimeter" type="number" min="0" step="1" value="0" max="22"> </label>
  </div>
  <div class="section">
    <label> Length:      <output name="advsq-length"    style="opacity:0.7; font-style:italic;"></output> </label>
  </div>
  <div class="section">
    <label> Area:        <output name="advsq-area"      style="opacity:0.7; font-style:italic;"></output> </label>
  </div>
  <div class="section">
    <label> Stride       <input  name="advsq-stride"    type="number"    min="0" step="1" value="0" max="45"> </label>
  </div>
  <div class="section">
    <label> Tile:        <output name="advsq-tile"      style="opacity:0.7; font-style:italic;"></output> </label>
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
      <input type="range" name="advsq-opacity" min="0" max="1" step="0.01" value="0.5"> </label>
  </div>
</div>

<div class="panel" id="camera-window">
  <div class="panel-title">Camera Panel</div>

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

