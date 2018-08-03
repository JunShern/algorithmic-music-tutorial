var synth;
var sloop;
var freq = 1000;
var velocity = 0.7;
var lastX, lastY;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  textAlign(CENTER, CENTER);
  colorMode(HSB, 255);
  synth = new p5.PolySynth();
  lastX = width/2;
  lastY = height/2;
}

function draw() {
  background(235);
  var hue = map(freq, 400, 2000, 0, 255);
  var diameter = map(velocity, 0.1, 1, height/20, height/2);
  noStroke();
  fill(hue, 255, 255);
  ellipse(lastX, lastY, diameter, diameter);

  fill(30);
  text("Pitch (Hz): " + freq.toFixed(2) + ", Velocity: " + velocity.toFixed(2), width/2, height - height/10);
}

function touchStarted() {
  lastX = mouseX;
  lastY = mouseY;
  freq = map(lastX, 0, width, 400, 2000); //random(50, 70);
  velocity = map(height - lastY, 0, height, 0.1, 1); //random(0.5, 1);
  // Play synth
  synth.noteAttack(freq, velocity, 0);
}

function touchEnded() {
  // Stop synth
  synth.noteRelease(freq, 0);
}