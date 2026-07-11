---
title: "Play"
weight: 50
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
    padding: 2px;
  }
  button {
    background: rgb(238,220,220);
    border: 1px solid #888;
  }
  
  #setup-window       { top:  160px; left:   20px; width: 163px }  /* DOM Control Panels */
  #move-window        { top: 1050px; left:   20px; width: 680px }
  #gambit-window      { top:  770px; left:   20px; width: 320px }
  #advsq-window       { top:  160px; left:  210px; width: 155px }
  #compass-window     { top:  160px; left:  560px; width: 160px; height: 220px }
  #diagnostics-window { top:  160px; left:  960px; width: 145px }

  #game-window   { top:  160px; left:  390px; }

  #camera-window { top:   400px; left:  390px; }
  #viewer-window { top:   160px; left:  760px; }

  .help-popup {
    position: fixed;

    top: 100px;
    left: 100px;
    width: 450px;

    background: #222;
    color: white;

    border: 1px solid #666;
    padding: 10px;

    z-index: 1000;
  }
  .help-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    cursor: move;
    user-select: none;
  }
  .help-btn {
    float: right;
    width: 20px;
    height: 20px;

    font-size: 12px;
  }
  /* Seampont - more DOM control panels... */
</style>

<!-- The 3DC Game... -->
<canvas id="3dc-board" width="1600" height="2000"></canvas>  <!-- 3D -->

<!-- The DOM Control Panels -->
<div class="panel panel-stateful" id="setup-window">
  <div class="panel-title"><span>Setup Panel</span>
    <button class="help-btn" data-help="setup">?</button>
  </div>
  <div class="section">
    <button data-action="makeBoard">Make Board</button>
  </div>
  <div class="section">
    <label>Board Size</label>
  </div>
  <div class="section">
    <label> <input type="radio" name="board-size" value="8x8x8"checked> 8×8×8 </label><br>
    <label> <input type="radio" name="board-size" value="10x8x8"> 10×8×8 </label><br>
    <label> <input type="radio" name="board-size" value="10x10x10"> 10×10×10 </label>
  </div>  
  <div class="section">
    <label>Tray Type</label>
  </div>
  <div class="section">
    <!-- <label> <input type="radio" name="tray-type" value="none"> None </label><br> -->
    <label> <input type="radio" name="tray-type" value="Real" checked> Real </label><br>
    <label> <input type="radio" name="tray-type" value="Fact"> Factory </label><br>
  </div>  
  <div class="section">
    <button data-action="placePiece"   disabled>Place Piece</button>
    <button data-action="shiftPiece"   disabled>Shift Piece</button>
    <button data-action="returnPiece"  disabled>Return Piece</button>
    <button data-action="freezePuzzle" disabled>Freeze Puzzle</button>
  </div>
  <div class="section" style="display:flex; align-items:center;">
    <label>Pieces:                          <output name="setup-selPieces" style="opacity:0.7; font-style:italic;">...</output> </label>
    <label style="margin-left:12px;">Tiles: <output name="setup-selTiles"  style="opacity:0.7; font-style:italic;">...</output> </label>
  </div>
  <div class="section">
    <button data-action="startingPos" disabled>Starting Position</button>
  </div>
  <div class="section scroll-box" id="setup-list"></div>
  </div>

<div class="panel panel-stateful" id="move-window">
  <div class="panel-title"><span>Move Panel</span>
    <button class="help-btn" data-help="move">?</button>
  </div>
  <div class="section" style="display:flex; align-items:center;">
    <label>Pieces:                          <output name="move-selPieces" style="opacity:0.7; font-style:italic;">...</output> </label>
    <label style="margin-left:12px;">Tiles: <output name="move-selTiles"  style="opacity:0.7; font-style:italic;">...</output> </label>
    <label style="margin-left:auto;"> <input type="checkbox" name="move-rules" disabled> Enforce Rules </label>
  </div>
  <div class="section">
    <button data-action="move"      disabled>Move</button>
    <button data-action="capture"   disabled>Capture</button>
    <button data-action="fission"   disabled>Fission</button>
    <button data-action="enpassant" disabled>En Passant</button>
    <button data-action="castle"    disabled>Castle</button>
    <label> <input type="radio" name="move-player" value="White" disabled checked> White </label>
    <label> <input type="radio" name="move-player" value="Black" disabled> Black </label>
  </div>

  <div class="section">
    <button data-action="promote"   disabled>Promote</button>
    <button data-action="uplift"    disabled>Uplift</button>
    <label> Listing <output name="move-listing" style="opacity:1.0; font-style:italic;"></output> </label>
    <label> <input type="radio" name="move-coords" value="Absolute" disabled checked> Abs </label>
    <label> <input type="radio" name="move-coords" value="Relative" disabled> Rel </label>
    <label> <input type="radio" name="move-lines" value="Verbose" disabled checked> Verbose </label>
    <label> <input type="radio" name="move-lines" value="Terse" disabled> Terse </label>
  </div>
  <div class="section scroll-box" id="move-list"></div>
  </div>

<div class="panel panel-stateful" id="gambit-window">
  <div class="panel-title"><span>Gambit Panel</span>
    <button class="help-btn" data-help="gambit">?</button>
  </div>
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
    <button data-action="next">Next</button>
  </div>
  <div class="section">
    <button data-action="expand">Expand</button>
    <button data-action="contract">Contract</button>
    <button data-action="delete">Delete</button>
    <button data-action="removeAll">Remove All</button>
  </div>
  <div class="section" style="display:flex; align-items:center;">
    <label>Pieces:                          <output name="gambit-selPieces" style="opacity:0.7; font-style:italic;">...</output> </label>
    <label style="margin-left:12px;">Tiles: <output name="gambit-selTiles"  style="opacity:0.7; font-style:italic;">...</output> </label>
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
  <div class="panel-title"><span>AdvSq Panel</span>
    <button class="help-btn" data-help="advsq">?</button>
  </div>
  <div class="section">
    <button data-action="place">Place</button>
    <button data-action="remove">Remove</button>
  </div>
  <div class="section">
    <button data-action="grow">Grow</button>
    <button data-action="shrink">Shrink</button>
  </div>
  <div class="section">
    <label> Source Tile  <input  name="advsq-src"       type="text"    value="Q4,4" maxlength="7" style="width: 60px;"> </label>
  </div>
  <div class="section">
    <label> Quad         <input  name="advsq-quad"      type="number" min="1" step="1" value="1" max="85"> </label>
    <label> BP:          <output name="advsq-pieceQuad" style="opacity:0.7; font-style:italic;"></output> </label>
    <label> P:           <output name="advsq-planeQuad" style="opacity:0.7; font-style:italic;"></output> </label>
  </div>
  <div class="section"> <label> Nickname:    <output name="advsq-nickname"  style="opacity:0.7; font-style:italic;"></output> </label> </div>
  <div class="section"> <label> Plane:       <output name="advsq-plane"     style="opacity:0.7; font-style:italic;"></output> </label> </div>
  <div class="section"> <label> Quad Type:   <output name="advsq-quadType"  style="opacity:0.7; font-style:italic;"></output> </label> </div>
  <div class="section"> <label> Perimeters   <input  name="advsq-perimeter" type="number" min="0" step="1" value="0" max="22"> </label> </div>
  <div class="section"> <label> Length:      <output name="advsq-length"    style="opacity:0.7; font-style:italic;"></output> </label></div>
  <div class="section"> <label> Area:        <output name="advsq-area"      style="opacity:0.7; font-style:italic;"></output> </label></div>
  <div class="section"> <label> Onboard:     <output name="advsq-onboard"   style="opacity:0.7; font-style:italic;"></output> </label> </div>
  <div class="section"> <label> Stride       <input  name="advsq-stride"    type="number" min="0" step="1" value="0" max="45"> </label> </div>
  <div class="section"> <label> Stride Type: <output name="advsq-strideType"style="opacity:0.7; font-style:italic;"></output> </label> </div>
  <div class="section"> <label> Move Type:   <output name="advsq-moveType"  style="opacity:0.7; font-style:italic;"> Q|L|D|O </output> </label> </div>
  <div class="section"> <label> Overlap:     <output name="advsq-overlap"   style="opacity:0.7; font-style:italic;"> B|Q|H|F </output> </label> </div>
  <div class="section"> <label> Piece:       <output name="advsq-piece"     style="opacity:0.7; font-style:italic;"> R|B|D|Q|N|S|P|U|K </output> </label> </div>
  <!-- Key hints (visual only) -->
  <div class="section" style="font-size: 13px; font-weight: bold; color: #666;">
    Slip&Slide +: kij -: KIJ
  </div>
  <div class="section">
    <button data-action="nextQuad">Next Quad</button>
    <button data-action="nextPlane">Next Plane</button>
    <button data-action="nextPiece">Next Piece</button>
  </div>
  <div class="section" style="display:flex; align-items:center;">
    <label>Pieces:                          <output name="advsq-selPieces" style="opacity:0.7; font-style:italic;">...</output> </label>
    <label style="margin-left:12px;">Tiles: <output name="advsq-selTiles"  style="opacity:0.7; font-style:italic;">...</output> </label>
  </div>
  <div class="section">
    <label> Offboard Visibility
      <input type="range" name="advsq-opacity" min="0" max="1" step="0.01" value="0.5"> </label>
  </div>
  </div>

<div class="panel panel-supportive" id="compass-window">
  <div class="panel-title"><span>Compass Panel</span>
    <button class="help-btn" data-help="compass">?</button>
  </div>
  <div class="section">
    <button data-action="Rays" disabled>Rays</button>
  </div>
  <div class="section">
    <button data-action="Apexes" disabled>Apexes</button>
  </div>
  </div>

<div class="panel panel-supportive" id="diagnostics-window">
  <div class="panel-title"><span>Diagnostics Panel</span>
    <button class="help-btn" data-help="diagnostics">?</button>
  </div>
  <div class="section"> <label>Occupancies -----</label> </div>
  <div class="section"> <label> Piece Count:      <output name="diags-pieceCount" style="font-style:italic;">0</output> </label> </div>
  <div class="section"> <label> Tray Count:       <output name="diags-trayCount"  style="font-style:italic;">0</output> </label> </div>
  <div class="section"> <label> White Tray:       <output name="diags-whiteTray"  style="font-style:italic;">0</output> </label> </div>
  <div class="section"> <label> Black Tray:       <output name="diags-blackTray"  style="font-style:italic;">0</output> </label> </div>
  <div class="section"> <label> Board Count:      <output name="diags-boardCount" style="font-style:italic;">0</output> </label> </div>
  <div class="section"> <label>Selections ----- </label> </div>
  <div class="section"> <label> Piece Selections:  <output name="diags-pieceSels" style="font-style:italic;">0</output> </label> </div>
  <div class="section"> <label> Tile Selections:   <output name="diags-tileSels"  style="font-style:italic;">0</output> </label> </div>
  <div class="section"> <label>Mesh Groups ----- </label> </div>
  <div class="section"> <label> Tile Map:          <output name="diags-tileMap"        style="font-style:italic;">0</output> </label> </div>
  <div class="section"> <label> Curr Pieces Group: <output name="diags-currPiecesGroup"style="font-style:italic;">0</output> </label> </div>
  <div class="section"> <label> Piece Groups:      <output name="diags-pieceGroups"    style="font-style:italic;">0</output> </label> </div>
  <div class="section"> <label> White Tray Group:  <output name="diags-whiteTrayGroup" style="font-style:italic;">0</output> </label> </div>
  <div class="section"> <label> Black Tray Group:  <output name="diags-blackTrayGroup" style="font-style:italic;">0</output> </label> </div>
  <div class="section"> <label> Scene Children:    <output name="diags-sceneChildren"  style="font-style:italic;">0</output> </label> </div>
  </div>

<div class="panel panel-temporal" id="game-window">
  <div class="panel-title"><span>Game Panel</span>
    <button class="help-btn" data-help="game">?</button>
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
    <button data-action="load">Load</button>
    <button data-action="save">Save</button>
  </div>
  <div class="section scroll-box" id="undo-state">
    <!-- tbd go here -->
  </div>
  </div>

<div class="panel panel-perspective" id="camera-window">
  <div class="panel-title"><span>Camera Panel</span>
    <button class="help-btn" data-help="camera">?</button>
  </div>
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
  <div class="panel-title"><span>Viewer Panel</span>
    <button class="help-btn" data-help="viewer">?</button>
  </div>
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
<!-- Seampoint - another panel. -->

<!-- Hidden help panel -->
<div id="help-popup" class="help-popup" hidden>
  <div class="help-header" id="help-header">
    <span id="help-title"></span>
    <button id="help-close">X</button>
  </div>

  <div id="help-body"></div>
</div>
<!-- Seampoint - more DOM control panels... -->

