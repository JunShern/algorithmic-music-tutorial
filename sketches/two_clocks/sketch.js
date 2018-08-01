var synth1, synth2;
var counter1 = 0;
var counter2 = 0;
var sloop;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(1);
  textAlign(CENTER, CENTER);
  noStroke();
  synth1 = new p5.PolySynth();
  synth2 = new p5.PolySynth();
  sloop = new p5.SoundLoop(mySoundLoop, 1);
  noLoop();
}

function draw() {
  if (sloop.isPlaying) {
    text('click to pause', width/2, height/2);

    fill(255,100,100);
    rect(0, 0, width/2, height);
    fill(100,100,255);
    rect(width/2, 0, width/2, height);
    
    synth1.play(440, 0.7, 0, 0.5);
    counter1++;
    fill(0);
    
    textSize(min(width, height)/20);
    text("Draw loop", width*1/4, height/10);
    text("SoundLoop", width*3/4, height/10);
    textSize(min(width, height)/5);
    text(counter1, width*1/4, height/2);
    text(counter2, width*3/4, height/2);
  
  } else {
    background(200, 0.7);
    text('click to play', width/2, height/2);
  }

}

function mySoundLoop() {
  synth2.play(880, 0.7, 0, 0.5);
  counter2++;
}

function touchStarted() {
  if (sloop.isPlaying) {
    sloop.pause();
    noLoop();
  } else {
    sloop.start();
    loop();
  }
}