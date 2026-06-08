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
  .panel-stateful {
    background: rgba(222,240,222,0.94);
    }
  .panel-perspective {
    background: rgba(228,226,238,0.94);
    }
  .panel-supportive {
    background: rgba(220,255,220,0.94);
    }
  .panel-temporal {
    background: rgba(236,232,222,0.95);
  }

  #setup-window {
    width: 160px;
    }
  #compass-window {
    width: 160px;
    height: 220px;
    }
  #gambit-window {
    width: 280px;
    }
  #move-window {
    font-family: monospace;
    width: 350px;
  }
  #setup-list {
    font-family: monospace;
    white-space: pre;
    }
  #gambit-list {
    font-family: monospace;
    white-space: pre;
    }
  #move-list {
    font-family: monospace;
    white-space: pre;   /* Allows code to col align text. */
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
  button {
    background: rgb(238,220,220);
    border: 1px solid #888;
  }
  
  #setup-window   { top:  260px; left:   20px; }  /* DOM Control Panels */
  #move-window    { top: 1180px; left:   20px; }
  #gambit-window  { top:  880px; left:   20px; }
  #advsq-window   { top:  260px; left:  210px; }
  #compass-window { top:  640px; left:   20px; }

  #game-window    { top:  260px; left:  390px; }

  #camera-window { top:   500px; left:  390px; }
  #viewer-window { top:   660px; left:  390px; }
  /* Seampont - more DOM control panels... */
</style>

<!-- The 3DC Game... -->
<canvas id="3dc-board" width="1600" height="2000"></canvas>  <!-- 3D -->

<!-- The DOM Control Panels -->
<div class="panel panel-stateful" id="setup-window">
  <div class="panel-title">Setup Panel</div>
  <div class="section">
    <button data-action="makeBoard">Make Board</button>
  </div>
  <div class="section">
    <label>Board Size</lable>
  </div>
  <div class="section">
    <label> <input type="radio" name="board-size" value="8x8x8" checked> 8×8×8 </label><br>
    <label> <input type="radio" name="board-size" value="10x8x8"> 10×8×8 </label><br>
    <label> <input type="radio" name="board-size" value="10x10x10"> 10×10×10 </label>
  </div>  
  <div class="section">
    <label>Tray Type</lable>
  </div>
  <div class="section">
    <!-- <label> <input type="radio" name="tray-type" value="none"> None </label><br> -->
    <label> <input type="radio" name="tray-type" value="real" checked> Real </label><br>
    <label> <input type="radio" name="tray-type" value="factory"> Factory </label><br>
  </div>  
  <div class="section">
    <button data-action="placePiece"   disabled>Place Piece</button>
    <button data-action="shiftPiece"   disabled>Shift Piece</button>
    <button data-action="returnPiece"  disabled>Return Piece</button>
    <button data-action="freezePuzzle" disabled>Freeze Puzzle</button>
  </div>
  <div class="section">
    <button data-action="startingPos" disabled>Starting Position</button>
  </div>
  <div class="section">
    <button data-action="play" disabled>Play</button>
  </div>
  <div class="section scroll-box" id="setup-list"></div>
  </div>

<div class="panel panel-stateful" id="move-window">
  <div class="panel-title">Move Panel</div>
  <div class="section">
    <button data-action="move"      disabled>Move</button>
    <button data-action="capture"   disabled>Capture</button>
    <button data-action="enpassant" disabled>En Passant</button>
    <button data-action="castle"    disabled>Castle</button>
    <button data-action="promote"   disabled>Promote</button>
  </div>
  <div class="section">
    <button data-action="duke-decay"   disabled>Duke Decay</button>
    <button data-action="bishop-decay" disabled>Bishop Decay</button>
    <button data-action="fission"      disabled>Fission</button>
    <label> <input type="radio" name="move-player" value="White" checked> W </label>
    <label> <input type="radio" name="move-player" value="Black"> B </label>
  </div>
  <div class="section">
    <label> SrcTile <input name="move-src" type="text" value="K2,2" maxlength="7" style="width: 44px;"> </label>
    <label> DstTile <input name="move-dst" type="text" value="K4,4" maxlength="7" style="width: 44px;"> </label>
    <label> 2ndTile <input name="move-2nd" type="text" value="" maxlength="7" style="width: 44px;"> </label>
  </div>
  <div class="section">
    <label> Piece    <input name="move-piece"   type="text" value="P" maxlength="3" style="width: 24px;"> </label>
    <label> Captured <input name="move-capture" type="text" value="Q" maxlength="3" style="width: 24px;"> </label>
    <label> Opts:    <output name="move-opts" style="opacity:0.7; font-style:italic;"> R|B|D|Q|N|S|P|K</output> </label>
  </div>
  <div class="section scroll-box" id="move-list"></div>
  </div>

<div class="panel panel-stateful" id="gambit-window">
  <div class="panel-title">Gambit Panel (Freeze)</div>
  <div class="section">
    <button data-action="freezeQ">Quadrant</button>
    <button data-action="freezeL">Linear</button>
    <button data-action="freezeD">Duplex</button>
    <button data-action="freezeO">Overlap</button>
   </div>
  <div class="section">
    <button data-action="freezeN">Knight</button>
    <button data-action="freezeP">Pawn</button>
    <button data-action="freezeK">King</button>
    <button data-action="asAPlane">Plane</button>
    <button data-action="nextPlane">Next</button>
  </div>
  <div class="section">
    <button data-action="expand">Expand</button>
    <button data-action="contract">Contract</button>
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
    <label> Move Type:    <output name="gambit-moveType" style="opacity:0.7; font-style:italic;"> Quadrant </output> </label>
  </div>
  <div class="section">
    <label> Overlap Type:     <output name="gambit-overlap"  style="opacity:0.7; font-style:italic;"> Qtile|etc </output> </label>
  </div>
  <div class="section">
    <label> Lowest Piece: <output name="gambit-piece"    style="opacity:0.7; font-style:italic;"> Queen </output> </label>
  </div>
  <div class="section scroll-box" id="gambit-list"></div>
    <!-- advsq entries go here -->
    <!-- N quad src -> dst : area -->
    <!-- N Q<nn> <LL>X,Y> → <LL>X,Y> : area -->
    <!-- N Q<nn> <LL>X,Y> → [z,x,y] : area -->
    <!-- 1 Q13 KB4.4 → KR7,7 : 16 -->
  </div>

<div class="panel panel-stateful" id="advsq-window">
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
    <label> Move Type:   <output name="advsq-moveType"  style="opacity:0.7; font-style:italic;"> Q|L|D|O </output> </label>
  </div>
  <div class="section">
    <label> Overlap:     <output name="advsq-overlap"   style="opacity:0.7; font-style:italic;"> B|Q|H|F </output> </label>
  </div>
  <div class="section">
    <label> Pieces:      <output name="advsq-piece"     style="opacity:0.7; font-style:italic;"> R|B|D|Q|N|S|P|K </output> </label>
  </div>
  <!-- Key hints (visual only) -->
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

<div class="panel panel-supportive" id="compass-window">
  <div class="panel-title">Compass Panel</div>
  <div class="section">
    <button data-action="Rays" disabled>Rays</button>
  </div>
  <div class="section">
    <button data-action="Apexes" disabled>Apexes</button>
  </div>
  </div>

<div class="panel panel-temporal" id="game-window">
  <div class="panel-title">Undo Panel</div>
  <!-- <div class="section">
    <button data-action="newGame">New Game</button>
  </div> -->
  <div class="section">
    <button data-action="undo">Undo</button>
    <button data-action="redo">Redo</button>
  </div>
  <div class="section">
    <button data-action="rewind">Rewind</button>
    <button data-action="forward">Forward>></button>
  </div>
  <div class="section">
    <button data-action="load">Load</button>
    <button data-action="save">Save</button>
  </div>
  <div class="section scroll-box" id="undo-state">
    <!-- tbd go here -->
  </div>
  </div>

<div class="panel panel-perspective" id="camera-window">
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
    <label> <input type="radio" name="camera-pov" value="top"      data-action="SetPOV"> Top </label>
  </div>
  </div>

<div class="panel panel-perspective" id="viewer-window">
  <div class="panel-title">Viewer Panel</div>
  <div class="section">
    <button data-action="ShowTrays"> Show Trays </button>
    <button data-action="HideTrays"> Hide Trays </button>
  </div>
  <div class="section">
    <label> Tray Gap <input name="viewer-trayGap" type="number" min="0" step="1" value="0" max="3"> </label>
  </div>
  <div class="section">
    <label> Level Sep <input name="viewer-levelSep" type="number" min="1.0" step="0.1" value="1.5" max="2.0"> </label>
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

