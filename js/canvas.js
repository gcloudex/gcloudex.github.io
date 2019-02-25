var pixels = [];
for (var i = 0; i < 28*28; i++) pixels[i] = 0;
var click = 0;

var canvas = document.getElementById("digitpad");
canvas.addEventListener("mousemove", function(e){
  if (e.buttons == 1) {
      click = 1;
      canvas.getContext("2d").fillStyle = "rgb(0,0,0)";
      canvas.getContext("2d").fillRect(e.offsetX, e.offsetY, 8, 8);
      scaledOffsetX = Math.floor(e.offsetX * 0.2);
      scaledOffsetY = Math.floor(e.offsetY * 0.2);
      //console.log(e.offsetY, e.offsetX);
      x = Math.floor(e.offsetY * 0.2);
      y = Math.floor(e.offsetX * 0.2) + 1;
      for (var dy = 0; dy < 2; dy++){
          for (var dx = 0; dx < 2; dx++){
              if ((x + dx < 28) && (y + dy < 28)){
                  pixels[(y+dy)+(x+dx)*28] = 1;
                  //console.log(y,dy,x,dx,(y+dy)+(x+dx)*28);
              }
          }
      }
  } else {
      if (click == 1) set_value();
      click = 0;
  }
});

function clear_value(){
  console.log("clearing canvas...");
  canvas.getContext("2d").fillStyle = "rgb(255,255,255)";
  canvas.getContext("2d").fillRect(0, 0, 140, 140);
  for (var i = 0; i < 28*28; i++) pixels[i] = 0;
}

function set_value(){
  var result = ""
  for (var i = 0; i < 28*28; i++) result += pixels[i] + ","
  //alert(result);
}

function download(){
  var download = document.getElementById("imageDownload");
  //var image = document.getElementById("digitpad").toDataURL("image/png")
  // digitpad or digitpad2
  var image = document.getElementById("digitpad").toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
  download.setAttribute("href", image);
}


document.getElementById("digitpad").onload = clear_value();