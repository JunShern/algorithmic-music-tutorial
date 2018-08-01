var sketchRunning = true;
function playPauseSketch(buttonElement) {
  if (sketchRunning) {
    noLoop();
    if (typeof sloop !== 'undefined') {
      sloop.pause();
    }
    sketchRunning = false;
    buttonElement.innerHTML = "PLAY";
  } else {
    loop();
    if (typeof sloop !== 'undefined') {
      sloop.start();
    }
    sketchRunning = true;
    buttonElement.innerHTML = "PAUSE";
  }
}