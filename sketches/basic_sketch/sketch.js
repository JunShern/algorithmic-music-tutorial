// Runs only once, when the page loads
function setup() {
  createCanvas(window.innerWidth, window.innerHeight); // Canvas size fills its container
}

// Runs after setup, and repeats 60 times a second by default
function draw() {
  background(255, 0, 0); // Paint the background red (RGB color)
  ellipse(width/2, height/2, 50, 50); // Draw an ellipse at the center, width = height = 50
}