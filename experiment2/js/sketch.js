// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

/* exported setup, draw */
let seed = 0;

const waterColor = "#008b8b";
const skyColor = "#87cefa";
const hillColor = "#c2b280";
const waveColors = ["#004953", "#007474", "#20b2aa", "#f5f5dc"];

// Globals
let myInstance;
let canvasContainer;
var centerHorz, centerVert;

class MyClass {
    constructor(param1, param2) {
        this.property1 = param1;
        this.property2 = param2;
    }

    myMethod() {
        // code to run when method is called
        
    }
}

function resizeScreen() {
  centerHorz = canvasContainer.width() / 2; // Adjusted for drawing logic
  centerVert = canvasContainer.height() / 2; // Adjusted for drawing logic
  console.log("Resizing...");
  resizeCanvas(canvasContainer.width(), canvasContainer.height());
  // redrawCanvas(); // Redraw everything based on new size
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(canvasContainer.width(), canvasContainer.height());
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  myInstance = new MyClass("VALUE1", "VALUE2");

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();

  document.getElementById("reimagine").addEventListener("click", () => seed++);
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  randomSeed(seed); // This makes sure randomness works properly
  background(100);
  
  noStroke(); // Prevents drawing shapes with outlines
  
  // Draw the water
  fill(waterColor);
  rect(0, 0, width, height);
  
  // Draw the waves
  const numWaves = floor(120 + random() * 20);
  waveColors.forEach((element) => {
    fill(element);
    for (let i = 0; i < numWaves; i++) {
      // Using the same strategy from the demo
      let z = random() * random(); // biased towards smaller numbers
      let y = height * 4 / 10 +
        height * 6 / 10 * z;
      let x = width * i / numWaves;
      
      // Much of this was copypasted from ChatGPT because I am running out of time. But it's math.
      let t = millis() / 1000; // convert to seconds for smoother math
      let amplitude = height / 100 * z;
      let frequency = 0.5; // cycles per second

      // the +i helps them move out of sync with each other and feel more natural.
      let yOffset = sin(TWO_PI * frequency * t + i) * amplitude;
      drawWave(x, y + yOffset, z);
    }
  });
  
  // Draw the sky
  fill(skyColor); // The next things to be drawn will be filled with skyColor
  rect(0, 0, width, height * 4 / 10);
  
  // Draw the hill
  const mountainX = [0];
  const mountainY = [0];
  const shoreX = [];
  const shoreY = [];
  fill(hillColor);
  const steps = floor(20 * random() + 10);
  beginShape();
  for (let i = 0; i < steps; i++) {
    let x = (width * i) / steps;
    let y = 
        height / 4 +
        (height / 4) / steps * i * random() +
        height * 2 / steps * (random() - 0.5);
    vertex(x, y);
    fill(hillColor);
    mountainX.splice(1, 0, x);
    mountainY.splice(1, 0, y);
  }
  for (let i = steps; i >= 0; i--) {
    let x = (width * i) / steps;
    let y = 
        height * 7 / 8 - 
        (height * 3 / 8) / steps * i +
        height * 2 / steps * (random() - 0.5);
    vertex(x, y);
    shoreX.push(x);
    shoreY.push(y);
  }
  endShape(CLOSE);
  
  for (let i = 1; i < shoreX.length; i++) {
    if ((shoreY[i] >= shoreY[i-1] && shoreY[i] - mountainY[i] > width*2/steps) && random() > 0.25) {
      drawBuilding(shoreX[i], shoreY[i], random()*360, (width/steps)*0.9);
    }
  }
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}

function drawWave(originX, originY, size) {
  beginShape();
  for (let i = -1.5; i < 1.5; i++) {
    let x = originX + (width / 20) * i * size;
    let y = 
        originY + 
        height * (random()) * size / 16;
    vertex(x, y);
  }
  for (let i = 1.5; i > -1.5; i--) {
    let x = originX + (width * i) / 20 * size;
    let y = 
        originY + 
        height / 16 * (random()) * size;
    vertex(x, y);
  }
  endShape(CLOSE);
}

function drawBuilding(originX, originY, hue, size) {
  fill(255,255,255);
  quad(originX, originY, 
    originX + size, originY - size/4, 
    originX + size, originY - size*1.25 - size/4, 
    originX, originY - size*1.25);
  fill(255,255,255);
  quad(originX + size, originY - size*1.25 - size/4, 
    originX, originY - size*1.25,
    originX - (size*0.6), originY - size*1.25 - (size*0.4), 
    originX + size - (size*0.6), originY - size*1.25 - size/4 - (size*0.4));
  fill(245,245,245);
  quad(originX, originY, 
    originX, originY - size*1.25,
    originX - (size*0.6), originY - size*1.25 - (size*0.4),
    originX - (size*0.6), originY - (size*0.4));
  colorMode(HSB);
  fill(hue, 100, 100);
  quad(originX + size/4, originY - size/16, 
    originX + size * 3 / 4, originY - size*3/16, 
    originX + size * 3 / 4, originY - size*12/16, 
    originX + size/4, originY - size*10/16);
  colorMode(RGB);
}
