/**
 *  Example: Markov music
 *  Demonstrates the use of Markov chains to model musical sequences.
 * 
 *  The user adds notes to the Markov chain by playing notes ASDFGHJKL
 *  on the keyboard. Every note event (note on and note off) is registered
 *  as a new node in the graph, and the graph records all transitions 
 *  between note events as edges along the graph.
 * 
 *  During playback mode, the algorithm simply traverses the graph randomly,
 *  playing notes based on the nodes upon which it traverses.
 * 
 *  The Markov chain (graph) is visualized as a standard network of nodes, 
 *  with transitions represented by edges between nodes. The current/latest 
 *  node as well as the edges of its previously recorded transitions are 
 *  highlighted.
 */

// Music
var synth;
var velocity = 0.7; // From 0-1
var baseNote = 60;
var keyOrder = "ASDFGHJKL";
var keyScale = [0,2,4,5,7,9,11,12,14];
var keyStates = [0,0,0,0,0,0,0,0,0];
// Markov Chain
var graph;
var latestNodeId;
// Playback SoundLoops
var sloop;
var playing = false;
var mloop;
var secondsPerTick = 0.1;
var prevEventMillis = 0;
var timeQuantizationStep = 100; // Quantize to 10 milliseconds
var maxDuration = 2000;
var longestDurationSoFar = timeQuantizationStep;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(15);
  angleMode(DEGREES);

  graph = new Graph();
  synth = new p5.PolySynth();
  sloop = new p5.SoundLoop(soundLoop, 0.1);
  
  playPauseButton = createButton("Play / Pause");
  playPauseButton.position(20, height-40);
  playPauseButton.mousePressed(togglePlayPause);

  prevEventMillis = millis();
}

function draw() {
  background(30);
  // Draw edges
  graph.drawEdges();
  // Draw nodes
  for (var i=0; i<graph.nodes.length; i++) {
    // graph.nodes[i].bounceOnBoundaries();
    // graph.nodes[i].update();
    graph.nodes[i].display();
  }
  fill(0);
  noStroke();
  textAlign(CENTER, CENTER);
  // If there are no nodes, tell the users to play something
  if (graph.nodes.length == 0) {
    text("Press any of ASDFGHJKL to add notes to the Markov chain.", width/2, height/8);
  }
  // If we are at the end of the chain, tell the users
  if (latestNodeId != null && graph.edges[latestNodeId].length == 0) {
    text("Reached end of Markov chain. Play a new note to add to chain.", width/2, height/2);
  }
}

function soundLoop(cycleStartTime) {
  // Play the sound of this node
  var midiNoteNumber = graph.nodes[latestNodeId].pitch;
  var freq = midiToFreq(midiNoteNumber);
  var type = graph.nodes[latestNodeId].type;
  if (type == 1) {
    synth.noteAttack(freq, velocity, cycleStartTime);
  } else {
    synth.noteRelease(freq, cycleStartTime);
  }
  // Transition to a random new node
  if (graph.edges[latestNodeId].length) {
    latestNodeId = random(graph.edges[latestNodeId]);
  }
  // Wait for the timeFromPrevEvent of the new node
  var duration = graph.nodes[latestNodeId].duration / 1000; // Millis to seconds
  this.interval = max(duration, 0.01); // Cannot have interval of exactly 0
}

function keyPressed() {
  var keyIndex = keyOrder.indexOf(key);
  // Check if valid note key pressed
  if (keyIndex >= 0) {
    // Play synth
    var midiNoteNumber = baseNote + keyScale[keyIndex]; // 0-127; 60 is Middle C (C4)
    var freq = midiToFreq(midiNoteNumber);
    synth.noteAttack(freq, velocity, 0);
    // Update time
    var timeSincePrevEvent = min(millis() - prevEventMillis, maxDuration);
    prevEventMillis = millis();
    var quantizedTimeSincePrevEvent = round(timeSincePrevEvent / timeQuantizationStep) * timeQuantizationStep;
    console.log(quantizedTimeSincePrevEvent);
    // Register node
    graph.registerNewNode(1, midiNoteNumber, quantizedTimeSincePrevEvent);
    // Activate key state
    keyStates[keyIndex] = 1;
  }
}

function keyReleased() {
  var keyIndex = keyOrder.indexOf(key);
  // Check if valid note key pressed
  if (keyIndex >= 0) {
    // Stop synth
    midiNoteNumber = baseNote + keyScale[keyIndex]; // 0-127; 60 is Middle C (C4)
    freq = midiToFreq(midiNoteNumber);
    synth.noteRelease(freq, 0);
    // Update time
    var timeSincePrevEvent = min(millis() - prevEventMillis, maxDuration);
    prevEventMillis = millis();
    var quantizedTimeSincePrevEvent = round(timeSincePrevEvent / timeQuantizationStep) * timeQuantizationStep;
    console.log(quantizedTimeSincePrevEvent);
    // Register node
    graph.registerNewNode(0, midiNoteNumber, quantizedTimeSincePrevEvent);
    // Reset key state
    keyStates[keyIndex] = 0;
    
    timeSincePrevEvent = 0;
  }
}

function togglePlayPause() {
  if (sloop.isPlaying) {
    sloop.stop();
    synth.noteRelease(); // Release all notes
  } else {
    sloop.start();
  }
}

// Class for a single node
// characterized by ID, pitch and duration of the note it represents
function Node(id, type, pitch, duration) {
  this.id = id;
  this.type = type; // 1 (note on) or 0 (note off)
  this.pitch = pitch;
  this.duration = duration;

  // this.velocity = createVector(0, 0);//createVector(random(-1,1), random(-1,1));
  this.position = createVector(0, height); // Overwrite later

  this.color = [255, 0, 100];
  this.diameter = map(this.duration, 0, maxDuration, 10, height/20);

}
Node.prototype.isSimilar = function(node) {
  if (this.type === node.type && this.pitch === node.pitch && this.duration === node.duration) {
    return true;
  } else {
    return false;
  }
};
Node.prototype.display = function() {
  var minPitch = baseNote;
  var maxPitch = baseNote + max(keyScale);
  // var x = width/80 + map(this.pitch, minPitch, maxPitch, 0, width-width/20);
  // if (this.type === 0) {
  //   x = x + width/40;
  // }
  var yPad = height/20;
  var y = yPad/2 + map(this.duration, 0, longestDurationSoFar, height - yPad, 0);
  this.position = createVector(x, y);

  push();
  translate(width/2, height/2);
  var angleStep = 360 / (maxPitch - minPitch);
  var noteAngle = angleStep * (this.pitch - minPitch);
  // translate(200, 0);
  rotate(noteAngle);
  noStroke();
  var color = [200, 200, 200];
  if (this.id == latestNodeId) {
    // Highlight latest node
    color = this.color;
  }
  // Fill circle if note-on, stroke circle if note-off
  if (this.type == 1) {
    noStroke();
    fill(color[0], color[1], color[2]);
  } else {
    noFill();
    strokeWeight(2);
    stroke(color[0], color[1], color[2]);
  }
  ellipse(200, 0, this.diameter, this.diameter);
  pop();
};

// Earworm.prototype.display = function() {
//   this.xpos = constrain(this.xpos + random(-1, 1), 0, width);
//   this.ypos = constrain(this.ypos + random(-1, 1), 0, height);

//   push();
//   strokeWeight(1);
//   angleMode(DEGREES); // Change the mode to DEGREES
//   var angle = 360 / this.notes.length;
//   translate(this.xpos, this.ypos);
//   for (var i=0; i<this.notes.length; i++) {
//     rotate(angle);
//     if (this.notes[i] === -1) {
//       continue;
//     }
//     var pitchClass = this.notes[i] % 12;
//     var color = map(pitchClass, 0, 12, 280, 120) % 255;
//     var length = map(this.notes[i], minValidNote, maxValidNote, this.radius/2, this.radius);
//     strokeWeight(1);
//     stroke(color, 180, 250);
//     if (songIsPlaying) {
//       if (this.id == clickedEarwormIndex) {
//         stroke(color, 180, 250);
//         if (i == notePlaybackIndex) {
//           strokeWeight(2);
//           length = this.radius;
//         } else {
//           strokeWeight(1);
//         }
//       } else {
//         stroke(color, 100, 100);
//       }
//     }
//     line(0, 0, length, 0);
//   }
//   pop();
// };

// Graph data structure code adapted from 
// http://blog.benoitvallon.com/data-structures-in-javascript/the-graph-data-structure/
function Graph() {
  this.nodes = [];
  this.nodeIds = [];
  this.edges = [];
  this.numberOfEdges = 0;
}
Graph.prototype.findNode = function(node) {
  for (var i=0; i<this.nodes.length; i++) {
    if (node.isSimilar(this.nodes[i])) {
      return i;
    }
  }
  return -1; // Not found
};
Graph.prototype.registerNewNode = function(type, midiNoteNumber, duration) {
  var node = new Node(0, type, midiNoteNumber, duration);
  var nodeId = graph.findNode(node);
  if (nodeId == -1) { // If necessary, create the node
    nodeId = this.nodes.length;
    this.addNode(node);
  }
  node.id = nodeId;
  if (latestNodeId != null) { // On initialization it will be null
    // Add an edge from the previous node to this one
    this.addEdge(latestNodeId, nodeId);
  }
  // Update the latest node ID
  latestNodeId = nodeId;
  // Update longest duration
  if (duration > longestDurationSoFar) {
    longestDurationSoFar = duration;
  }
};
Graph.prototype.addNode = function(node) {
  var nodeId = this.nodes.length;
  this.nodeIds.push(nodeId);
  this.nodes.push(node);
  this.edges[nodeId] = [];
};
Graph.prototype.addEdge = function(nodeId1, nodeId2) {
  this.edges[nodeId1].push(nodeId2);
  this.numberOfEdges++;
};
Graph.prototype.drawEdges = function() {
  // Draw all edges leading away from this node
  strokeWeight(1);
  for (var i=0; i<graph.edges.length; i++) {
    var startNode = i;
    if (startNode == latestNodeId) { // Highlight the latest node's edges
      stroke(graph.nodes[startNode].color[0], graph.nodes[startNode].color[1], graph.nodes[startNode].color[2], 100);
    } else {
      stroke(200, 100);
    }
    for (var j=0; j<graph.edges[i].length; j++) {
      var endNode = graph.edges[i][j];
      line(graph.nodes[startNode].position.x, graph.nodes[startNode].position.y, graph.nodes[endNode].position.x, graph.nodes[endNode].position.y);
    }
  }
};