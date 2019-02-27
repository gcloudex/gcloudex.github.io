var pixels = [];
for (var i = 0; i < 28*28; i++) pixels[i] = 0;
var click = 0;

var canvas = document.getElementById("digitpad");
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

// Set up touch events for mobile, etc
// Source: https://gist.github.com/bencentra/91350fe91c377c1ca574
/**
canvas.addEventListener("touchstart", function (e) {
  mousePos = getTouchPos(canvas, e);
  var touch = e.touches[0];
  var mouseEvent = new MouseEvent("mousedown", {
    clientX: touch.clientX,
    clientY: touch.clientY
  });
  canvas.dispatchEvent(mouseEvent);
}, false);
canvas.addEventListener("touchend", function (e) {
  var mouseEvent = new MouseEvent("mouseup", {});
  canvas.dispatchEvent(mouseEvent);
}, false);
*/
canvas.addEventListener("touchmove", function (e) {
  var touch = e.touches[0];
  canvas.getContext("2d").fillStyle = "rgb(0,0,0)";
  canvas.getContext("2d").fillRect(touch.clientX, touch.clientY, 8, 8);

  var rect = canvas.getBoundingClientRect();
  touchX = touch.clientX - rect.left,
  touchY = touch.clientY - rect.top
  console.log("touch: ", touchX, touchY);
  var mouseEvent = new MouseEvent("mousemove", {
    offsetX: touchX,
    offsetY: touchY
  });
  //canvas.dispatchEvent(mouseEvent);
  //scaledOffsetX = Math.floor(touchX * 0.2);
  //scaledOffsetY = Math.floor(touchY * 0.2);
  x = Math.floor(touchX * 0.2);
  y = Math.floor(touchY * 0.2) + 1;
  console.log("(x,y) = ", x, y);
  for (var dy = 0; dy < 2; dy++){
      for (var dx = 0; dx < 2; dx++){
          if ((x + dx < 28) && (y + dy < 28)){
              pixels[(y+dy)+(x+dx)*28] = 1;
              //console.log(y,dy,x,dx,(y+dy)+(x+dx)*28);
          }
      }
  }
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
  //canvas.getContext("2d").strokeStyle = "#222222";
	//canvas.getContext("2d").lineWith = 2;
  for (var i = 0; i < 28*28; i++) pixels[i] = 0;
}

// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top
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


document.getElementById("digitpad").onload = clear_value();