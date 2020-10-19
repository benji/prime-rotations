const config = {
  margin: 16,
  pointsToCalculate: 1000000,

  // Add randomness, so that we see a different image each time
  startingPrime: 2 + Math.floor(Math.random() * 1000),
};

// This could be faster with sieve of Eratosthenes
function isPrime(n) {
  for (var i = 2; i < Math.floor(n / 2); i++) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}

function calculatePoints(numPoints) {
  let direction = 0; // 0=up 1=right 2=down 3=left
  let x = 0;
  let y = 0;
  const points = [];
  const endPrime = config.startingPrime + numPoints - 1;

  for (
    let currentPrime = config.startingPrime;
    currentPrime <= endPrime;
    currentPrime += 1
  ) {
    if (currentPrime % 1000 === 0) {
      console.log(currentPrime + "/" + endPrime);
    }

    if (isPrime(currentPrime)) {
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

  return points;
}

/**
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number[][]} points
 */
function drawPoints(canvas, points) {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  for (const point of points) {
    const x = point[0];
    const y = point[1];

    minX = Math.min(x, minX);
    maxX = Math.max(x, maxX);
    minY = Math.min(y, minY);
    maxY = Math.max(y, maxY);
  }

  const context = canvas.getContext("2d");
  const shapeWidth = maxX - minX;
  const shapeHeight = maxY - minY;
  const shapeMidX = (maxX + minX) / 2;
  const shapeMidY = (maxY + minY) / 2;
  const viewportWidth = canvas.width - config.margin * 2;
  const viewportHeight = canvas.height - config.margin * 2;

  context.save();

  // A bunch of transformations, so that the the rendering looks centered and scaled to fit viewport
  context.translate(
    viewportWidth / 2 + config.margin,
    viewportHeight / 2 + config.margin
  );
  const scale = Math.min(
    viewportWidth / shapeWidth,
    viewportHeight / shapeHeight
  );
  context.scale(scale, scale);
  context.translate(-shapeMidX, -shapeMidY);

  // Draw the points using lines
  context.beginPath();
  context.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    context.lineTo(points[i][0], points[i][1]);
  }
  context.stroke();

  context.restore();
}

function createResizeCanvasHandler(canvas, points) {
  return function onResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawPoints(canvas, points);
  };
}

function onLoad() {
  console.log("Configuration", config);

  const canvas = document.getElementById("canvas");
  const points = calculatePoints(config.pointsToCalculate);
  console.log(points);

  // Begin rendering points
  const onResize = createResizeCanvasHandler(canvas, points);
  window.addEventListener("resize", onResize, false);
  onResize();

  console.log("Configuration", config);
}

window.addEventListener("load", onLoad);
