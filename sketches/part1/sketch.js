let NUM_DOTS;
let LINK_THRESHOLD;
let xposArray = [];
let yposArray = [];
let xdirArray = [];
let ydirArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  NUM_DOTS = width * height / 6000;
  LINK_THRESHOLD = width * height / 10000;
  // Populate all arrays
  for (let i = 0; i < NUM_DOTS; i++) {
    xposArray.push(random(width));
    yposArray.push(random(height));
    xdirArray.push(random(-1, 1));
    ydirArray.push(random(-1, 1));
  }
}

function draw() {
  background("#042A2B");
  // For each ball
  for (let i = 0; i < xposArray.length; i++) {
    // Check distance against all other balls
    for (let j = 0; j < xposArray.length; j++) {
      let x1 = xposArray[i];
      let y1 = yposArray[i];
      let x2 = xposArray[j];
      let y2 = yposArray[j];
      let distance = calcDistance(x1, y1, x2, y2);
      let monoColor = 255 - 255 * distance / LINK_THRESHOLD;
      if (distance < LINK_THRESHOLD) {
        stroke(monoColor, 100, 150);
        line(x1, y1, x2, y2);
      }
    }
    // Update position of this ball
    xposArray[i] = xposArray[i] + xdirArray[i];
    yposArray[i] = yposArray[i] + ydirArray[i];
    // If hit the borders, bounce this ball
    if (xposArray[i] < 0 || xposArray[i] > width) {
      xdirArray[i] = -xdirArray[i];
    }
    if (yposArray[i] < 0 || yposArray[i] > height) {
      ydirArray[i] = -ydirArray[i];
    }
    ellipse(xposArray[i], yposArray[i], 2, 2);
  }
}

function calcDistance(x1, y1, x2, y2) {
  let dist = sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  return dist;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}