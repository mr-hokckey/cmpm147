// sketch.js - purpose and description here
// Author: Your Name
// Date:

// Here is how you might set up an OOP p5.js project
// Note that p5.js looks for a file called sketch.js

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file
const VALUE1 = 1;
const VALUE2 = 2;

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

/* exported preload, setup, draw, placeTile */

/* global generateGrid drawGrid */

let seed = 0;
let tilesetImage;
let currentGrid = [];
let numRows, numCols;

function preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.com/25101045-29e2-407a-894c-e0243cd8c7c6%2FtilesetP8.png?v=1611654020438"
  );
}

function reseed() {
  seed = (seed | 0) + 1109;
  randomSeed(seed);
  noiseSeed(seed);
  select("#seedReport").html("seed " + seed);
  regenerateGrid();
}

function regenerateGrid() {
  select("#asciiBox").value(gridToString(generateGrid(numCols, numRows)));
  reparseGrid();
}

function reparseGrid() {
  currentGrid = stringToGrid(select("#asciiBox").value());
}

function gridToString(grid) {
  let rows = [];
  for (let i = 0; i < grid.length; i++) {
    rows.push(grid[i].join(""));
  }
  return rows.join("\n");
}

function stringToGrid(str) {
  let grid = [];
  let lines = str.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let row = [];
    let chars = lines[i].split("");
    for (let j = 0; j < chars.length; j++) {
      row.push(chars[j]);
    }
    grid.push(row);
  }
  return grid;
}

// setup() function is called once when the program starts
function setup() {
  // place our canvas, making it fit our container
  canvasContainer = $("#canvas-container");
  let canvas = createCanvas(16 * numCols, 16 * numRows).parent("canvasContainer");
  canvas.parent("canvas-container");
  // resize canvas is the page is resized

  // create an instance of the class
  numCols = select("#asciiBox").attribute("rows") | 0;
  numRows = select("#asciiBox").attribute("cols") | 0;

  select("canvas").elt.getContext("2d").imageSmoothingEnabled = false;

  select("#reseedButton").mousePressed(reseed);
  select("#asciiBox").input(reparseGrid);

  reseed();

  $(window).resize(function() {
    resizeScreen();
  });
  resizeScreen();
}

// draw() function is called repeatedly, it's the main animation loop
function draw() {
  randomSeed(seed);
  drawGrid(currentGrid);
}

// mousePressed() function is called once after every time a mouse button is pressed
function mousePressed() {
    // code to run when mouse is pressed
}

function placeTile(i, j, ti, tj) {
  image(tilesetImage, 16 * j, 16 * i, 16, 16, 8 * ti, 8 * tj, 8, 8);
}


/* exported generateGrid, drawGrid */
/* global placeTile */

function generateGrid(numCols, numRows) {
  let grid = [];
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("_");
    }
    grid.push(row);
  }
  // Step 2: Generate a very simple dungeon grid
  let centerRoomX1 = ceil(random(3, numCols/2 - 3));
  let centerRoomY1 = ceil(random(3, numRows/2 - 3));
  let centerRoomX2 = numCols - ceil(random(3, numCols/2 - 3));
  let centerRoomY2 = numRows - ceil(random(3, numRows/2 - 3));
  
  let centerRoom = [
    centerRoomX1,
    centerRoomY1,
    centerRoomX2,
    centerRoomY2
  ]
  
  for (let i = centerRoom[1]; i < centerRoom[3]; i++) {
    let doorIndex = floor(random(centerRoom[0]+1, centerRoom[2]-1));
    for (let j = centerRoom[0]; j < centerRoom[2]; j++) {
      grid[i][j] = ".";
      if (i == centerRoom[1] && j == doorIndex) {
        grid[i][j] = "D";
      }
    }
  }
  
  let newRoom = [
    floor(random(1, numCols/2)),
    1,
    numCols - floor(random(1, numCols/2 - 1)) - 1,
    centerRoom[1] - 1
  ]
  
  for (let i = newRoom[1]; i < newRoom[3]; i++) {
    let doorIndex = floor(random(newRoom[0]+1, newRoom[2]-1));
    for (let j = newRoom[0]; j < newRoom[2]; j++) {
      grid[i][j] = ".";
      if (i == newRoom[1] && j == doorIndex) {
        grid[i][j] = "D";
      }
    }
  }
  
  return grid;
}

function drawGrid(grid) {
  background(128);
  
  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == '_') {
        // Step 8 
        let sparkle = (millis() + 30*(i+j)) % 5000 < 200 && (i + j) % 3 == 0;
        placeTile(i, j, floor(random(4)), sparkle? 16 : 9);
      }
      // Step 3: Render the generated grid
      else if (grid[i][j] == '.') {
        placeTile(i, j, floor(random(4)), 10);
        drawContext(grid, i, j, "_", 10, 10);
      } else if (grid[i][j] == 'D') {
        placeTile(i, j, 26, 26);
      }
    }
  }
}

// Step 4: Add autotiling logic

// If (i,j) is not OOB, does grid[i][j] == target? T/F
function gridCheck(grid, i, j, target) {
  if (i >= grid.length || j >= grid[0].length || i < 0 || j < 0) {
    return false;
  }
  return grid[i][j] == target;
}

// Create a 4-bit code that checks for [target] tiles
function gridCode(grid, i, j, target) {
  let northWestBit = gridCheck(grid, i-1, j-1, target);
  let northBit = gridCheck(grid, i-1, j, target);
  let northEastBit = gridCheck(grid, i-1, j+1, target);
  let westBit = gridCheck(grid, i, j-1, target);
  let eastBit = gridCheck(grid, i, j+1, target);
  let southWestBit = gridCheck(grid, i+1, j-1, target);
  let southBit = gridCheck(grid, i+1, j, target);
  let southEastBit = gridCheck(grid, i+1, j+1, target);
  
  // return (
  //   (northWestBit<<0) + 
  //   (northBit<<1) + 
  //   (northEastBit<<2) + 
  //   (westBit<<3) +
  //   (eastBit<<4) +
  //   (southWestBit<<5) +
  //   (southBit<<6) +
  //   (southEastBit<<7)
  // );
  
  return (
    (northBit<<0) + 
    (westBit<<1) +
    (eastBit<<2) +
    (southBit<<3)
  );
}

function drawContext(grid, i, j, target, ti, tj) {
  // TODO
  let code = gridCode(grid, i, j, target);
  let n = 3;
  const [tiOffset, tjOffset] = lookup[code]; 
  placeTile(i, j, ti + tiOffset, tj + tjOffset);
}

const lookup = [
  [0,0],
  [0,-1],
  [-1,0],
  [-1,-1],
  [1,0],
  [1,-1],
  [0,0],
  [0,0],
  [0,1],
  [0,0],
  [-1,1],
  [0,0],
  [1,1],
  [0,0],
  [0,0],
  [0,0]
];

