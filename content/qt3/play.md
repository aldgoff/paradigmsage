---
title: "Play"
---

**Play**

Place holder for playable version of QT3, to include the classical ensemble.
This is where the Intrepid Reader can (soon) interact with a playable version of QT3.
Ask your own questions of the game.

## TODO
  1. Have AI prove it can write python code which implements an interactive game on the web site.
  1. A quantum board, doubled lines, labeled squares.
  1. Placement moves, pairs of X's and O's subscripted with the number of the move.
  1. List of quantum moves with prev & next buttons.
  1. The classical ensemble, classical board, classical marks.
  1. Selectable classical game, populates a classical listing.
  1. Prompts placement moves.
  1. Prohibits illegal moves.
  1. Color coding of separate entanglements.
  1. Detects cyclic entanglements.
  1. Prompts collapse moves.
  1. Collapse spooky-marks to classical marks.
  1. Standard buttons: Start, Undo, Redo.
  1. Scores a completed game.

## TADONE
  1. 2/7/26 - Todo list.

<canvas id="qt3-demo" width="200" height="100"></canvas>

<script>
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
</script>
