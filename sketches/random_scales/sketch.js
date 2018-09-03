var sloop;
var selectedScale = [0,2,4,5,7,9,11,12];
var numOctaves = 5;
var baseOctave = 2;
var octaveHeight = 0;
var system;
var selectInput;

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Particles to visualize notes
  system = new ParticleSystem(createVector(width/2, 50));
  // Create a synth to make sound with
  synth = new p5.PolySynth();
  // Create SoundLoop repeating every 0.3s
  sloop = new p5.SoundLoop(soundLoop, 0.3);

  // Scale selector
  selectInput = createSelect();
  selectInput.position(10, 10);
  for (var scale in scales) {
    selectInput.option(scale);
  }
  selectInput.changed(updateScale);
  selectInput.value('pentatonic major');
}

function draw() {
  background(50);
  // Get mouse height level
  stroke(255, 100);
  octaveHeight = round(numOctaves * (height - mouseY) / height);
  line(0, height - octaveHeight*height/numOctaves, 
    width, height - octaveHeight*height/numOctaves);
  // Update particle system
  system.run();
  // Play/pause controls
  fill(255);
  textAlign(CENTER, CENTER);
  if (sloop.isPlaying) text('Click to Pause', width/2, height/2);
  else text('Click to Play', width/2, height/2);
}

function soundLoop(cycleStartTime) {
  // Pick a random note, note octave based on mouse height
  var pitchClass = random(selectedScale);
  var baseNote = (baseOctave + octaveHeight) * 12;
  var midiNote = baseNote + pitchClass;
  var freq = midiToFreq(midiNote);
  // Play sound
  var velocity = 1; // Between 0-1
  var duration = this.interval;
  synth.play(freq, velocity, cycleStartTime, duration);
  // Add a particle to visualize the note
  var pitchClassIndex = selectedScale.indexOf(pitchClass);
  var xpos = width / (selectedScale.length * 2) + pitchClassIndex * width / selectedScale.length;
  var ypos = height - octaveHeight * height / numOctaves;
  system.addParticle(xpos, ypos);
}

function mouseClicked() {
  if (sloop.isPlaying) {
    sloop.pause();
  } else {
    sloop.start();
  }
}

function updateScale() {
  selectedScale = scales[selectInput.value()];
}

// A simple Particle class
var Particle = function(position) {
  this.acceleration = createVector(0, 0.1);
  this.velocity = createVector(random(-1, 1), random(-3, -1));
  this.position = position.copy();
  this.lifespan = 255;
  this.color = [random(255), random(255), random(255)];
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function() {
  noStroke();
  fill(this.color[0], this.color[1], this.color[2], this.lifespan);
  ellipse(this.position.x, this.position.y, width/30, width/30);
};

// Is the particle still useful?
Particle.prototype.isDead = function(){
  return this.lifespan < 0;
};

var ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function(xpos, ypos) {
  this.particles.push(new Particle(createVector(xpos, ypos)));
};

ParticleSystem.prototype.run = function() {
  for (var i = this.particles.length-1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};