// Source: https://zipso.net/a-simple-touchscreen-sketchpad-using-javascript-and-html5/

// canvas and context
var canvas, ctx;

// mouse positions X & Y, and mouse down indicator 
var mouseX, mouseY = 0;

// touch position X & Y
var touchX, touchY;

// Pixel size
var pixelSize = 14;

// holding pixel [28x28]
var pixels = [];

function clearPixel() {
  for (var i = 0; i < 28*28; i++) pixels[i] = 0;
}

function fillPixel(currentX, currentY) {
    x = Math.floor(currentY * 0.1);     //0.2
    y = Math.floor(currentX * 0.1) + 1;    // populate pixel array;
    // this will be used for MNIST inference
    //console.log("Pixel (x,y) = ", x, y);
    for (var dy = 0; dy < 2; dy++){
      for (var dx = 0; dx < 2; dx++){
          if ((x + dx < 28) && (y + dy < 28)){
              //console.log("pixel_index = ", ((y+dy)+(x+dx)*28));
              pixels[(y+dy)+(x+dx)*28] = 1;
          }
      }
  }
}

// canvas
canvas = document.getElementById("digitpad");
//document.getElementById("digitpad").onload = initCanvas();

function initCanvas(){
  console.log("initCanvas()...");

  // If the browser supports the canvas tag, get the 2d drawing context for this canvas
  if (canvas.getContext)
    ctx = canvas.getContext('2d');  
  
  if (ctx) {
    //var rect = canvas.getBoundingClientRect();
    //console.log("canvas rect (left, top, right, botoom): ", rect.left, rect.top, rect.right, rect.bottom);
    ctx.fillStyle = "rgba(255,255,255,1)";
    ctx.fillRect(0, 0, 210, 210);
    //ctx.strokeStyle = "#222222";
    //ctx.lineWith = 25;
    //canvas.width = canvas.width;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // React to mouse events on the canvas, and mouseup on the entire document
    //canvas.addEventListener("mousedown", onmouseDown, false);
    canvas.addEventListener("mousemove", onmouseMove, false);
    //canvas.addEventListener("mouseup", onmouseUp, false);

    // React to touch events on the canvas
    canvas.addEventListener('touchstart', ontouchStart, false);
    canvas.addEventListener('touchmove', ontouchMove, false);    
    canvas.addEventListener('touchend', ontouchEnd, false);    
  }
  clearPixel();
}

function clearCanvas(){
  //console.log("clearing canvas...");
  initCanvas();
}

function onmouseDown() {
}

// Keep track of the mouse position and draw a dot if mouse button is currently pressed
function onmouseMove(e) {
  if (e.buttons == 1) {
    // Update the mouse co-ordinates when moved
    getMousePos(e);
    // draw square dots on canvas
    //ctx.fillStyle = "rgb(0, 0, 0, 1)";
    //ctx.fillRect(mouseX, mouseY, pixelSize, pixelSize);
    drawDot(ctx, mouseX, mouseY, pixelSize)
    // populate pixel array;
    fillPixel(mouseX, mouseY);
  } 
}

function onmouseUp() {
}

function ontouchStart(e) {
  getTouchPos(e);
  drawDot(ctx, touchX, touchY, pixelSize);
  // Prevents an additional mousedown event being triggered
  event.preventDefault();  
}

function ontouchMove(e) {
  // Update the touch co-ordinates
  getTouchPos(e);
  // During a touchmove event, unlike a mousemove event,
  // don't need to check if the touch is engaged, since there will always
  // be contact with the screen by definition.
  drawDot(ctx, touchX, touchY, pixelSize);

  // Prevent a scrolling action as a result of this touchmove triggering.
  // there is a bug; won't work; but not needed
  event.preventDefault();
}

function ontouchEnd() {
}

function getMousePos(e) {
  if (!e)
    var e = event;

  if (e.offsetX) {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  }
  else if (e.layerX) {
    mouseX = e.layerX;
    mouseY = e.layerY;
  }
  console.log(mouseX, mouseY);
}

/**
// Get the touch position relative to the top-left of the canvas
// The raw values of pageX and pageY below, take into account the scrolling
// on the page but not the position relative to the target div. 
// We'll adjust them using "target.offsetLeft" and "target.offsetTop" to get
// the correct values in relation to the top left of the canvas.
*/
function getTouchPos(e) {
  if (!e)
      var e = event;

  if (e.touches) {
      if (e.touches.length == 1) { // Only deal with one finger
          var touch = e.touches[0]; // Get the information for finger #1
          touchX=touch.pageX-touch.target.offsetLeft;
          touchY=touch.pageY-touch.target.offsetTop;
          //console.log("touch-pos: ", touchX, touchY);
      }
  }
}

function drawDot(ctx, currentX, currentY, pixelSize) {
  //console.log("draw dot: ", currentX, currentY)
  // draw square dots on canvas
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  //var pixelSize = 12;
  ctx.fillRect(currentX, currentY, pixelSize, pixelSize);
}


function download(){
  var download = document.getElementById("imageDownload");
  //var image = document.getElementById("digitpad").toDataURL("image/png")
  // digitpad or digitpad2
  var image = document.getElementById("digitpad").toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
  download.setAttribute("href", image);
}

