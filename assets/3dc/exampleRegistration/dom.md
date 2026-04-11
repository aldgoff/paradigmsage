<div class="panel" id="example-panel">
  <div class="panel-title">Example Control Panel</div>

  <!-- Buttons -->
  <div class="section">
    <button>Freeze</button>
    <button>Next</button>
    <button>Prev</button>
    <button>Delete</button>
    <button>Deselect</button>
  </div>

  <!-- Checkboxes -->
  <div class="section">
    <label><input type="checkbox"> Show AdvSq</label><br>
    <label><input type="checkbox"> Highlight Tiles</label><br>
    <label><input type="checkbox"> Snap to Grid</label><br>
    <label><input type="checkbox"> Show Duke Colors</label>
  </div>

  <!-- Radio Buttons -->
  <div class="section">
    <label><input type="radio" name="mode" checked> Move</label><br>
    <label><input type="radio" name="mode"> Inspect</label><br>
    <label><input type="radio" name="mode"> Gambit</label>
  </div>

  <!-- Non-editable text -->
  <div class="section">
    <div class="readonly-box" id="status-box">
      Status: Ready
    </div>
  </div>

  <!-- Editable text -->
  <div class="section">
    <textarea id="input-box" rows="3" placeholder="Enter state..."></textarea>
  </div>

  <!-- Scrollable move list -->
  <div class="section scroll-box" id="move-list">
    Move 1: ...<br>
    Move 2: ...<br>
    Move 3: ...<br>
    Move 4: ...<br>
    Move 5: ...<br>
    Move 6: ...<br>
    Move 7: ...<br>
  </div>
</div>


.panel {
  position: absolute;
  top: 200px;
  left: 100px;
  width: 220px;

  background: rgba(255,255,255,0.95);
  border: 1px solid #888;
  border-radius: 6px;

  padding: 10px;
  font-family: sans-serif;
  font-size: 13px;

  z-index: 100;
  cursor: move;
}

.panel-title {
  font-weight: bold;
  margin-bottom: 8px;
}

.section {
  margin-bottom: 10px;
}

.readonly-box {
  background: #eee;
  padding: 5px;
  border: 1px solid #ccc;
  font-family: monospace;
}

textarea {
  width: 100%;
  resize: none;
  font-family: monospace;
}

.scroll-box {
  height: 80px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 5px;
  background: #fafafa;
}


document.querySelector("#example-panel button:nth-child(1)")
  .addEventListener("click", () => {
    console.log("Freeze clicked");
  });

document.querySelector("#input-box")
  .addEventListener("input", (e) => {
    console.log("Input:", e.target.value);
  });
  