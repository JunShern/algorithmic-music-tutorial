var xpos = 0;

// Runs only once, when the page loads
function setup() {
  createCanvas(windowWidth, windowHeight); // Canvas size fills its container
}

// Runs after setup, and repeats 60 times a second by default
function draw() {
  background(255, 0, 0); // Paint the background red (RGB color)
  ellipse(xpos, height/2, 50, 50); // Draw an ellipse with width = height = 50
  xpos = (xpos + 1) % width; // Increase the x-position on each loop
}