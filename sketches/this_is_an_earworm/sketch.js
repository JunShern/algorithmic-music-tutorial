/**
 *  Example: Genetic music
 */

var synth;
var sloop;

var validNotes = [...Array(128).keys()];
var minValidNote, maxValidNote;
var songLength = 32; // 4 bars * 8th-note resolution

var maxPopulationSize = 1;
var numberOfSurvivors = 10;
var population = [];
var generationCount = 1;

var songIsPlaying = false;
var clickedEarwormIndex;
var notePlaybackIndex;
// Fitness rules
var desiredKeyClasses = [0,2,4,5,7,9,11];
var minGoodPitch = 48;
var maxGoodPitch = 72;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  colorMode(HSB, 255);
  textAlign(CENTER, CENTER);
  textSize(16);
  frameRate(10);

  sloop = new p5.SoundLoop(soundLoop, 0.3); // Loop plays every 0.3s
  synth = new p5.PolySynth();

  minValidNote = min(validNotes);
  maxValidNote = max(validNotes);
  for (var i=0; i<maxPopulationSize; i++) {
    var song = new Earworm(i);
    song.initialize();
    population.push(song);
  }
}

function soundLoop(cycleStartTime) {
  var duration = this.interval;
  var velocity = 0.7;
  var midiNote = population[clickedEarwormIndex].notes[notePlaybackIndex];
  var noteFreq = midiToFreq(midiNote);
  synth.play(noteFreq, velocity, 0, duration);
  // Move forward the index, and stop if we've reached the end
  notePlaybackIndex++;
  if (notePlaybackIndex >= population[clickedEarwormIndex].notes.length) {
    this.stop();
    songIsPlaying = false;
  }
}

function draw() {
  background(30);
  for (var i=0; i<population.length; i++) {
    population[i].display();
  }
  fill(255);
  if (songIsPlaying) {
    text("Song playing... Click to stop.", width/2, height*9/10);
  } else {
    text("Click on the Earworm to hear it sing!", width/2, height*9/10);
  }
}

function mousePressed() {
  if (songIsPlaying) {
    // Stop a song
    sloop.stop();
    songIsPlaying = false;
  } else {
    // Start a song
    for (var i=0; i<population.length; i++) {
      var clickToEarwormDistance = dist(mouseX, mouseY, population[i].xpos, population[i].ypos);
      if (clickToEarwormDistance < population[i].radius) {
        clickedEarwormIndex = i;
        notePlaybackIndex = 0;
        songIsPlaying = true;
        sloop.start();
      }
    }  
  }
}

function Earworm(indexNumber) {
  this.id = indexNumber;
  this.length = songLength;
  this.notes = [];
  // Visual properties
  this.xoff = 0;
  this.yoff = 10;
  this.xpos = width/2;
  this.ypos = height/2;
  this.radius = min(width, height)/3;
  this.fitnessScore = 0;
  this.direction = 5;
}
Earworm.prototype.initialize = function() {
  this.notes = [];
  for (var i=0; i<this.length; i++) {
    this.notes.push(random(validNotes));
  }
};
Earworm.prototype.display = function() {
  this.xpos = constrain(noise(this.xoff)*width, 0, width);
  this.ypos = constrain(noise(this.yoff)*height + random(-1, 1), 0, height);
  this.xoff += 0.004;
  this.yoff += 0.002;

  push();
  strokeWeight(1);
  angleMode(DEGREES); // Change the mode to DEGREES
  var angle = 360 / this.notes.length;
  translate(this.xpos, this.ypos);
  for (var i=0; i<this.notes.length; i++) {
    var color = map(this.notes[i], minValidNote, maxValidNote, 280, 120) % 255;
    var length = map(this.notes[i], minValidNote, maxValidNote, this.radius/2, this.radius);
    strokeWeight(2);
    stroke(color, 180, 250);
    if (songIsPlaying) {
      if (this.id == clickedEarwormIndex) {
        stroke(color, 180, 250);
        if (i == notePlaybackIndex) {
          strokeWeight(2);
          length = this.radius;
        } else {
          strokeWeight(1);
        }
      } else {
        stroke(color, 100, 100);
      }
    }
    rotate(angle);
    line(0, 0, length, 0);
  }
  pop();
};