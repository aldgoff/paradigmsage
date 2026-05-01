---
title: "Play"
layout: "play"
---


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
  #gambit-window {
    width: 200px;
  }
  #move-list {
    font-family: monospace;
    white-space: pre;   /* Allows code to col align text. */
    height: 140px;
    }
  #gambit-list {
    font-family: monospace;
    white-space: pre;
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

  #setup-window   { top:  260px; left:   80px; }  /* DOM Control Panels */
  #move-window    { top: 1190px; left:   80px; }
  #gambit-window  { top:  880px; left:   80px; }
  #advsq-window   { top:  260px; left:  255px; }
  #compass-window { top:  260px; left:  600px; }

  #game-window    { top:  260px; left:  430px; }

  #camera-window { top:   510px; left:  430px; }
  #viewer-window { top:   560px; left:   80px; }
  /* Seampont - more DOM control panels... */
</style>

<!-- The 3DC Game... -->
<canvas id="3dc-board" width="1600" height="2400"></canvas>  <!-- 3D -->

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
    <label> <input type="radio" disabled name="tray-type" value="none"> None </label><br>
    <label> <input type="radio" disabled name="tray-type" value="real"> Real </label><br>
    <label> <input type="radio" disabled name="tray-type" value="factory"> Factory </label><br>
  </div>  
  <div class="section">
    <label>Initial Position</lable>
  </div>  
  <div class="section">
    <label> <input type="radio" disabled name="initial-pos" value="standard"> Standard </label><br>
    <label> <input type="radio" disabled name="initial-pos" value="manual"> Manual </label><br>
  </div>  
  </div>

<div class="panel" id="move-window">
  <div class="panel-title">Move Panel</div>
  <div class="section">
    <button data-action="move">Move</button>
    <button data-action="capture">Capture</button>
    <button data-action="enpassant">En Passant</button>
    <button data-action="castle">Castle</button>
    <button data-action="promote">Promote</button>
  </div>
  <div class="section">
    <button data-action="duke-decay">Duke Decay</button>
    <button data-action="bishop-decay">Bishop Decay</button>
    <button data-action="fission">Fission</button>
    <label> <input type="radio" name="move-player" value="white" data-action="Player" checked> W </label>
    <label> <input type="radio" name="move-player" value="black" data-action="Player"> B </label>
  </div>
  <div class="section">
    <label> SrcTile <input name="move-src" type="text" value="K2,2" maxlength="7" style="width: 44px;"> </label>
    <label> DstTile <input name="move-dst" type="text" value="K4,4" maxlength="7" style="width: 44px;"> </label>
    <label> 2ndTile <input name="move-2nd" type="text" value="" maxlength="7" style="width: 44px;"> </label>
  </div>
  <div class="section">
    <label> Piece   <input name="move-piece"   type="text" value="P" maxlength="3" style="width: 24px;"> </label>
    <label> Capture <input name="move-capture" type="text" value="Q" maxlength="3" style="width: 24px;"> </label>
    <label> Opts:   <output name="move-opts" style="opacity:0.7; font-style:italic;"> R|B|D|Q|N|S|P|K</output> </label>
  </div>
  <div class="panel-title">Move | White | Black | Coordinates | Annotations</div>
  <div class="section scroll-box" id="move-list">
    <!-- tbd go here -->
  </div>
  </div>

<div class="panel" id="gambit-window">
  <div class="panel-title">Gambit Panel</div>
  <div class="section">
    <button data-action="freezeQ">Freeze Quadrant</button>
    <button data-action="freezeL" disabled>Freeze as Linear</button>
    <button data-action="freezeO" disabled>Freeze with Overlaps</button>
    <button data-action="freezeP" disabled>Freeze as a plane</button>
  </div>
  <div class="section">
    <button data-action="delete">Delete</button>
    <button data-action="remove">Remove All</button>
  </div>
  <div class="section">
    <label> Open   :  <output name="gambit-open"  style="opacity:0.7; font-style:italic;"> [,,,,,]</output> </label>
  </div>
  <div class="section">
    <label> Blocked:  <output name="gambit-blocked"  style="opacity:0.7; font-style:italic;"> [,,,,,] </output> </label>
  </div>
  <div class="section">
    <label> MoveType:    <output name="gambit-moveType" style="opacity:0.7; font-style:italic;"> Quadrant </output> </label>
  </div>
  <div class="section">
    <label> Overlap:     <output name="gambit-overlap"  style="opacity:0.7; font-style:italic;"> Qtile|etc </output> </label>
  </div>
  <div class="section">
    <label> LowestPiece: <output name="gambit-piece"    style="opacity:0.7; font-style:italic;"> Queen </output> </label>
  </div>
  <div class="section scroll-box" id="gambit-list"></div>
    <!-- advsq entries go here -->
    <!-- N quad src -> dst : area -->
    <!-- N Q<nn> <LL>X,Y> → <LL>X,Y> : area -->
    <!-- N Q<nn> <LL>X,Y> → [z,x,y] : area -->
    <!-- 1 Q13 KB4.4 → KR7,7 : 16 -->
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
    <label> Quad         <input  name="advsq-quad"      type="number" min="1" step="1" value="1" max="60"> </label>
    <label> BP:          <output name="advsq-pieceQuad" style="opacity:0.7; font-style:italic;"></output> </label>
    <label> P:           <output name="advsq-planeQuad" style="opacity:0.7; font-style:italic;"></output> </label>
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
    <label> Onboard:     <output name="advsq-onboard"   style="opacity:0.7; font-style:italic;"></output> </label>
  </div>
  <div class="section">
    <label> Stride       <input  name="advsq-stride"    type="number" min="0" step="1" value="0" max="45"> </label>
  </div>
  <div class="section">
    <label> Stride Type: <output name="advsq-strideType"style="opacity:0.7; font-style:italic;"></output> </label>
  </div>
  <div class="section">
    <label> Move Type:   <output name="advsq-moveType"  style="opacity:0.7; font-style:italic;"> Q|L|D </output> </label>
  </div>
  <div class="section">
    <label> Overlap:     <output name="advsq-overlap"   style="opacity:0.7; font-style:italic;"> B|Q|H|F </output> </label>
  </div>
  <div class="section">
    <label> Piece:       <output name="advsq-piece"     style="opacity:0.7; font-style:italic;"> R|B|D|Q|S|N </output> </label>
  </div>
  <!-- Optional: key hints (visual only) -->
  <div class="section" style="font-size: 13px; font-weight: bold; color: #666;">
    Slip & Slide +: k i j
  </div>
  <div class="section" style="font-size: 13px; font-weight: bold; color: #666;">
    Slip & Slide -: K I J
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

<div class="panel" id="compass-window">
  <div class="panel-title">Compass Panel</div>
  <div class="section">
    <button data-action="Rays" disabled>Rays</button>
  </div>
  <div class="section">
    <button data-action="Apexes" disabled>Apexes</button>
  </div>
  </div>

<div class="panel" id="game-window">
  <div class="panel-title">Game Panel</div>
  <div class="section">
    <button data-action="newGame" disabled>New Game</button>
  </div>
  <div class="section">
    <button data-action="undo">Undo</button>
    <button data-action="redo">Redo</button>
  </div>
  <div class="section">
    <button data-action="rewind">Rewind</button>
    <button data-action="forward">Forward>></button>
  </div>
  <div class="section">
    <button data-action="load" disabled>Load</button>
    <button data-action="save" >Save</button>
  </div>
  <div class="section scroll-box" id="undo-state">
    <!-- tbd go here -->
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

<div class="panel" id="viewer-window">
  <div class="panel-title">Viewer Panel</div>
  <div class="section">
    <button data-action="ShowTrays" disabled> Show Trays </button>
    <button data-action="HideTrays" disabled> Hide Trays </button>
  </div>
  <div class="section">
    <label> 'Gap' <input name="viewer-trayGap" disabled type="number" min="0" step="1" value="1" max="3"> </label>
  </div>
  <div class="section">
    <label> 'Sep' <input name="viewer-traySep" type="number" disabled min="1.0" step="0.1" value="1.5" max="2.0"> </label>
  </div>
  <div class="section">
    <button data-action="ToggleAnimation"> Toggle Animation </button>
  </div>
  <div class="section">
    <label> Jitter Range <input type="range" name="viewer-range" min="0" max="1" step="0.01" value="0.2"> </label>
    <label> Jitter Speed <input type="range" name="viewer-speed" min="0" max="1" step="0.01" value="0.2"> </label>
  </div>
</div>

<!-- Seampoint - more DOM control panels... -->

