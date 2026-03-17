let canvas = null;
let ctx = null;

export function initCanvas() {
  canvas = document.getElementById("qt3-game");
  if (!canvas) return false;

  ctx = canvas.getContext("2d");
  return true;
}

export { canvas, ctx };

