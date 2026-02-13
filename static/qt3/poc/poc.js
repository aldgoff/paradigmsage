// QT3 POC — verified working on 2026-02-08
// Do not modify. Used only as a wiring / behavior reference.

const canvas = document.getElementById("qt3-demo");
const ctx = canvas.getContext("2d");

const squares = [
  { x: 10,  y: 10, w: 80, h: 80, active: false },
  { x: 110, y: 10, w: 80, h: 80, active: false }
];

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  squares.forEach(sq => {
    ctx.fillStyle = sq.active ? "#4a90e2" : "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;

    ctx.fillRect(sq.x, sq.y, sq.w, sq.h);
    ctx.strokeRect(sq.x, sq.y, sq.w, sq.h);
  });
}

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  squares.forEach((sq, i) => {
    const hit =
      x >= sq.x && x <= sq.x + sq.w &&
      y >= sq.y && y <= sq.y + sq.h;

    if (hit) {
      squares.forEach((other, j) => {
        other.active = (i === j) ? !sq.active : false;
      });
    }
  });

  draw();
});

draw();
