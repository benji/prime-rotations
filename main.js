var context,
  canvas,
  x = 0,
  y = 0;
const max = 50000;
var points = [];

// 0=up 1=right 2=down 3=left
var direction = 0;

function isPrime(n) {
  for (var i = 2; i < n / 2; i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}

function draw() {
  for (var i = 2; i < max; i++) {
    if (i % 1000 === 0) {
      console.log(i + "/" + max);
    }
    if (isPrime(i)) {
      direction = (direction + 1) % 4;
    }
    switch (direction) {
      case 0:
        y--;
        break;
      case 1:
        x++;
        break;
      case 2:
        y++;
        break;
      case 3:
        x--;
        break;
      default:
        throw new Error("Invalid direction");
    }
    points.push([x, y]);
  }

  const minX = Math.min(...points.map((p) => p[0]));
  const maxX = Math.max(...points.map((p) => p[0]));
  const minY = Math.min(...points.map((p) => p[1]));
  const maxY = Math.max(...points.map((p) => p[1]));

  context.translate(
    canvas.width / 2 - minX - (maxX - minX) / 2,
    canvas.height / 2 - minY - (maxY - minY) / 2
  );

  for (var p of points) {
    context.fillRect(p[0], p[1], 1, 1);
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}

function onLoad() {
  console.log("loading");
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  window.addEventListener("resize", resizeCanvas, false);
  resizeCanvas();
}

window.addEventListener("load", onLoad);
