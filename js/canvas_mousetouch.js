// Source: https://zipso.net/a-simple-touchscreen-sketchpad-using-javascript-and-html5/

// canvas and context
var canvas, ctx;

// mouse positions X & Y, and mouse down indicator 
var mouseX, mouseY = 0;

// touch position X & Y
var touchX, touchY;

// Pixel size
var pixelSize = 12;

// holding pixel [28x28]
var pixels = [];

function clearPixel() {
  for (var i = 0; i < 28*28; i++) pixels[i] = 0;
}

function fillPixel(currentX, currentY) {
    x = Math.floor(currentY * 0.135);     //0.2
    y = Math.floor(currentX * 0.135) + 1;    // populate pixel array;
    // this will be used for MNIST inference
    console.log("Pixel (x,y) = ", x, y);
    for (var dy = 0; dy < 2; dy++){
      for (var dx = 0; dx < 2; dx++){
          if ((x + dx < 28) && (y + dy < 28)){
              pixels[(y+dy)+(x+dx)*28] = 1;
              //console.log(y,dy,x,dx,(y+dy)+(x+dx)*28);
          }
      }
  }
}

// canvas
canvas = document.getElementById("digitpad");
document.getElementById("digitpad").onload = initCanvas();

function initCanvas(){
  console.log("init canvas...");

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

function clear_value(){
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
  touchDrawDot(ctx, touchX, touchY, pixelSize);
}

function ontouchMove(e) {
  // Update the touch co-ordinates
  getTouchPos(e);
  // During a touchmove event, unlike a mousemove event,
  // don't need to check if the touch is engaged, since there will always
  // be contact with the screen by definition.
  touchDrawDot(ctx, touchX, touchY, pixelSize); 

  // Prevent a scrolling action as a result of this touchmove triggering.
  // there is a bug; won't work; but not needed
  //event.preventDefault();
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
          console.log("touch-pos: ", touchX, touchY);
      }
  }
}

function drawDot(ctx, currentX, currentY, pixelSize) {
  console.log("draw dot: ", currentX, currentY)
  // draw square dots on canvas
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  //var pixelSize = 12;
  ctx.fillRect(currentX, currentY, pixelSize, pixelSize);
}

function touchDrawDot(ctx, currentX, currentY, pixelSize) {
  console.log("touch draw dot: ", currentX, currentY)
  // draw square dots on canvas
  ctx.fillStyle = "rgba(0, 0, 0, 1)";
  // Draw a filled circle
  ctx.beginPath();
  ctx.arc(currentX, currentY, pixelSize, 0, Math.PI*2, true); 
  ctx.closePath();
  ctx.fill();
}


function download(){
  var download = document.getElementById("imageDownload");
  //var image = document.getElementById("digitpad").toDataURL("image/png")
  // digitpad or digitpad2
  var image = document.getElementById("digitpad").toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
  download.setAttribute("href", image);
}









document.getElementById("sketchpadapp").onload = init();
var canvas2, ctx2; 

// touch position X & Y
var touchX2, touchY2;

// Set-up the canvas and add our event handlers after the page has loaded
function init() {
      // Get the specific canvas element from the HTML document
      canvas2 = document.getElementById('sketchpad');

      // If the browser supports the canvas tag, get the 2d drawing context for this canvas
      if (canvas2.getContext)
          ctx2 = canvas2.getContext('2d');

      // Check that we have a valid context to draw on/with before adding event handlers
      if (ctx2) {
          // React to mouse events on the canvas, and mouseup on the entire document
          //canvas2.addEventListener('mousedown', sketchpad_mouseDown, false);
          //canvas2.addEventListener('mousemove', sketchpad_mouseMove, false);
          //window.addEventListener('mouseup', sketchpad_mouseUp, false);

          // React to touch events on the canvas
          canvas2.addEventListener('touchstart', sketchpad_touchStart, false);
          canvas2.addEventListener('touchmove', sketchpad_touchMove, false);
      }
}

// Draw something when a touch start is detected
function sketchpad_touchStart() {
    // Update the touch co-ordinates
    getTouchPos2();

    drawDot2(ctx2,touchX2,touchY2,12);

    // Prevents an additional mousedown event being triggered
    event.preventDefault();
}

// Draw something and prevent the default scrolling when touch movement is detected
function sketchpad_touchMove(e) { 
    // Update the touch co-ordinates
    getTouchPos2(e);

    // During a touchmove event, unlike a mousemove event, we don't need to check if the touch is engaged, since there will always be contact with the screen by definition.
    drawDot2(ctx2,touchX2,touchY2,12); 

    // Prevent a scrolling action as a result of this touchmove triggering.
    event.preventDefault();
}

function getTouchPos2(e) {
  if (!e)
      var e = event;

  if(e.touches) {
      if (e.touches.length == 1) { // Only deal with one finger
          var touch = e.touches[0]; // Get the information for finger #1
          touchX2=touch.pageX-touch.target.offsetLeft;
          touchY2=touch.pageY-touch.target.offsetTop;
      }
  }
}

// Draws a dot at a specific position on the supplied canvas name
// Parameters are: A canvas context, the x position, the y position, the size of the dot
function drawDot2(ctx,x,y,size) {
  // Let's use black by setting RGB values to 0, and 255 alpha (completely opaque)
  r=0; g=0; b=0; a=255;

  // Select a fill style
  ctx.fillStyle = "rgba("+r+","+g+","+b+","+(a/255)+")";

  // Draw a filled circle
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI*2, true); 
  ctx.closePath();
  ctx.fill();
} 
