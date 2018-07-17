
var particles = []; 
var numParticles = 50;
var catchSize = 10;
var state = 0;

var score = 0;
var scoreBrightness = 255;

var waterLevel = 10;
var waterThreshold = 200;
var frameCounter = 0;

var pentatonicScale = [0, 2, 4, 7, 9, 12];
var octave = 6;
var osc;

var starPower = 0;

var sorcerer;
var sorcererPos = 0;
var synth;

var paused = false;

function setup() {
    createCanvas(windowWidth*0.9, windowHeight*0.9);

    for (var i=0; i<numParticles; i++) {
    	particles.push(new Particle(i));
    }
    indexCount = numParticles;

    // Synth
    synth = new p5.PolySynth();

    frameRate(20);
}

function draw() {
  background(255);

  if (paused) {
    text("Click to Play", mouseX, mouseY);
  } else {
    text("Click to Pause", mouseX, mouseY);
  }

  fill(255,255);
  // strokeWeight(3);
  noStroke();
  for (var i=0; i<numParticles; i++) {
    if (particles[i].hasChildren) {
      particles[i].handleChildren();
    } else {
      particles[i].display();
      if (paused == false) {
        particles[i].fall();
      }
    }
  }

	frameCounter++;
}

function mouseClicked() {
  if (paused) {
    paused = false;
  } else {
    paused = true;
  }
}

function drawThreshold() {
	stroke(200,100,30);
	strokeWeight(2);
	line(width/2, height-waterThreshold, width/2, height);
	noStroke();
}

function Particle(index) {
	this.x = random(width);
	this.y = random(2*height)-2*height;
	this.index = index;
	this.diameter = random(5, 50);
	this.jitter = 1;
	
	// colorMode(HSB,100);
	this.c = [random(255), random(255), random(255)]; 
	// colorMode(RGB,255);

	this.children = [];
	this.hasChildren = false;
	this.numChildren = this.diameter;

	this.display = function() {
    fill(this.c[0], this.c[1], this.c[0], (height - this.y) * 255 / height);
		ellipse(this.x+random(-this.jitter,this.jitter), this.y+random(-this.jitter,this.jitter), this.diameter, this.diameter);
	}

	this.fall = function() {
		if (this.y >= height-this.diameter/2) {
			// Reset particle
			particles[this.index] = new Particle(this.index);
		} else {
      this.y = this.y + 7;
		}
	}

	this.explode = function() {
		for (var i=0; i<this.numChildren; i++) {
			this.children[i] = new FireChild(i, this.x, this.y);
		}
	}

	this.handleChildren = function() {
		// Check if children have all moved off screen
		var noMoreChildren = true;
		for (var i=0; i<this.numChildren; i++) {
			if (this.children[i].y < height+this.children[i].diameter/2) {
			//if (this.children[i].y > 0) {
				noMoreChildren = false;
			}
		}
		if (noMoreChildren) {
			// Reset particle
			particles[this.index] = new Particle(this.index);
		} else {
			// Move and show children
			for (var i=0; i<this.numChildren; i++) {
				this.children[i].move();
				this.children[i].display();
			}	
		}
		
	}
}

function FireChild(index, xpos, ypos) {
	this.x = xpos;
	this.y = ypos;
	this.velX = random(-8,8);
	this.velY = random(-5,5);
	this.diameter = random(5,10);
	this.c = color(200,50,50);

	this.display = function() {
		if (random(100) > 50) {
			fill(this.c);
			ellipse(this.x, this.y, this.diameter, this.diameter);
		}
	}

	this.move = function() {
		this.x = this.x + this.velX;
		this.y = this.y + this.velY;
		this.x = this.x - (this.x/abs(this.x));
		this.velY = this.velY + 2;
	}

}
