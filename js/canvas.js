// Source for touch: https://gist.github.com/bencentra/91350fe91c377c1ca574

var pixels = [];
for (var i = 0; i < 28*28; i++) pixels[i] = 0;
var click = 0;

// Set up touch events for drawing
var drawing = false;
var mousePos = { x:0, y:0 };
var lastPos = mousePos;

// canvas
var canvas = document.getElementById("digitpad");

// mouse event and drawing
canvas.addEventListener("mousemove", function(e){
  if (e.buttons == 1) {
      click = 1;
      console.log(e.offsetX, e.offsetY);
      canvas.getContext("2d").fillStyle = "rgb(0,0,0)";
      canvas.getContext("2d").fillRect(e.offsetX, e.offsetY, 8, 8);
      //scaledOffsetX = Math.floor(e.offsetX * 0.2);
      //scaledOffsetY = Math.floor(e.offsetY * 0.2);
      //console.log(e.offsetY, e.offsetX);
      x = Math.floor(e.offsetY * 0.2);
      y = Math.floor(e.offsetX * 0.2) + 1;
      console.log("(x,y) = ", x, y);
      for (var dy = 0; dy < 2; dy++){
          for (var dx = 0; dx < 2; dx++){
              if ((x + dx < 28) && (y + dy < 28)){
                  pixels[(y+dy)+(x+dx)*28] = 1;
                  //console.log(y,dy,x,dx,(y+dy)+(x+dx)*28);
              }
          }
      }
  } else {
      //if (click == 1) set_value();
      click = 0;
      //console.log("not write...");
  }
});

// Get a regular interval for touch drawing to the screen
window.requestAnimFrame = (function (callback) {
  return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimaitonFrame ||
        function (callback) {
           window.setTimeout(callback, 1000/60);
        };
})();

// Set up touch events for mobile, etc
canvas.addEventListener("touchstart", function (e) {
  mousePos = getTouchPos(canvas, e);
  //var touch = e.touches[0];
  //var mouseEvent = new MouseEvent("mousedown", {
  //  clientX: touch.clientX,
  //  clientY: touch.clientY
  //});
  //canvas.dispatchEvent(mouseEvent);
  drawing = true;
	lastPos = getTouchPos(canvas, e);
}, false);
canvas.addEventListener("touchend", function (e) {
  //var mouseEvent = new MouseEvent("mouseup", {});
  //canvas.dispatchEvent(mouseEvent);
  drawing = false;
}, false);
canvas.addEventListener("touchmove", function (e) {
  //var touch = e.touches[0];
  mousePos = getTouchPos(canvas, e);
  /**
  var rect = canvas.getBoundingClientRect();
  touchX = touch.clientX - rect.left,
  touchY = touch.clientY - rect.top
  console.log("touch: ", touchX, touchY);
  //var mouseEvent = new MouseEvent("mousemove", {
  //  offsetX: touchX,
  //  offsetY: touchY
  //});
  //canvas.dispatchEvent(mouseEvent);
  //scaledOffsetX = Math.floor(touchX * 0.2);
  //scaledOffsetY = Math.floor(touchY * 0.2);
  x = Math.floor(touchX * 0.24);
  y = Math.floor(touchY * 0.24) + 1;
  console.log("(x,y) = ", x, y);
  for (var dy = 0; dy < 2; dy++){
      for (var dx = 0; dx < 2; dx++){
          if ((x + dx < 28) && (y + dy < 28)){
              pixels[(y+dy)+(x+dx)*28] = 1;
              //console.log(y,dy,x,dx,(y+dy)+(x+dx)*28);
          }
      }
  }*/
}, false);

// Prevent scrolling when touching the canvas
/**
document.body.addEventListener("touchstart", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchend", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
document.body.addEventListener("touchmove", function (e) {
  if (e.target == canvas) {
    e.preventDefault();
  }
}, false);
*/

function clear_value(){
  console.log("clearing canvas...");
  var rect = canvas.getBoundingClientRect();
  console.log("canvas rect (left, top, right, botoom): ", rect.left, rect.top, rect.right, rect.bottom);
  canvas.getContext("2d").fillStyle = "rgb(255,255,255)";
  canvas.getContext("2d").fillRect(0, 0, 140, 140);
  canvas.getContext("2d").strokeStyle = "#222222";
	canvas.getContext("2d").lineWith = 2;
  canvas.width = canvas.width;

  for (var i = 0; i < 28*28; i++) pixels[i] = 0;
}

// Get the position of the mouse relative to the canvas
/**
function getMousePos(canvasDom, mouseEvent) {
  var rect = canvasDom.getBoundingClientRect();
  x = mouseEvent.clientX - rect.left,
  y = mouseEvent.clientY - rect.top
  console.log("mouse-pos: ", x, y);
  return {
    x: x,
    y: y
  };
}
*/

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  x = touchEvent.touches[0].clientX - rect.left,
  y = touchEvent.touches[0].clientY - rect.top
  console.log("touch-pos: ", x, y);
  return {
      x: x,
      y: y
    };
}

// TODO this function is not needed!!!
//function set_value(){
//  var result = ""
//  for (var i = 0; i < 28*28; i++) result += pixels[i] + ","
  //alert(result);
//}

function download(){
  var download = document.getElementById("imageDownload");
  //var image = document.getElementById("digitpad").toDataURL("image/png")
  // digitpad or digitpad2
  var image = document.getElementById("digitpad").toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
  download.setAttribute("href", image);
}

// Draw to the canvas
function renderCanvas() {
  if (drawing) {
    console.log("render: ", lastPos.x, lastPos.y, mousePos.x, mousePos.y);
    canvas.getContext("2d").moveTo(lastPos.x, lastPos.y);
    canvas.getContext("2d").lineTo(mousePos.x, mousePos.y);
    canvas.getContext("2d").stroke();
    lastPos = mousePos;
  }
}


// Allow for animation
(function drawLoop () {
  requestAnimFrame(drawLoop);
  renderCanvas();
})();

document.getElementById("digitpad").onload = clear_value();