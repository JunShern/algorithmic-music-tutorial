let MAX_EMOJIS;
let emoji_array = [];

function setup() {
  // createCanvas(windowWidth, windowHeight);
  MAX_EMOJIS = round(windowWidth * windowHeight / 20000);
  while (emoji_array.length < MAX_EMOJIS) {
    let icon = new Icon();
    emoji_array.push(icon);
  }
}

function draw() {
  for (let i=0; i<emoji_array.length; i++) {
    emoji_array[i].updateElement();
  }
}

function Icon() {
  this.elmt = createSpan();
  if (random(1) > 0.2) {
    this.elmt.class("fas fa-music fa-1x");
  } else {
    this.elmt.class("fas fa-desktop fa-1x");
  }

  let angle = round(random(0, 360));
  this.elmt.style("transform", `rotate(${angle}deg)`);

  this.position = createVector(random(windowWidth), random(windowHeight));
  this.elmt.position(this.position.x, this.position.y);

  this.updateElement = function() {
    this.position.y = this.position.y + 1;
    // Icons live a little longer before and after the canvas
    let heightBuffer = 20;
    if (this.position.y > windowHeight + heightBuffer) {
      this.position.y = -heightBuffer;
    }
    // Update the icon's position
    this.elmt.position(this.position.x, this.position.y);
    this.elmt.style("color", "rgba(255, 255, 255, 0.3)");
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
