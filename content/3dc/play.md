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

<!-- ## Load the Three.js Render... -->
<script type="module">
  import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";
  window.THREE = THREE;
</script>

<!-- ## The 3DC Game... -->
  <canvas id="3dc-game" width="1400" height="1800"></canvas>  <!-- 3D -->
  <canvas id="3dc-ui"   width= "600" height= "600"></canvas>  <!-- 2D overlay -->


