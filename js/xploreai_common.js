/*
Common functions

TODO: Work in Progress
*/

// UI variables
var preauthorized_msg, authorizeButton, welcome_msg, signoutButton;
var predictButton, prediction_msg;

// initialize security elements: welcome message, signin & signout 
function init_security(){
  welcome_msg = document.getElementById("welcome_msg");
  preauthorized_msg = document.getElementById("preauthorized_msg");
  authorizeButton = document.getElementById("authorize-button");
  signoutButton = document.getElementById("signout-button");
}

function init_results(){
  predictButton = document.getElementById("predict-button");
  prediction_msg = document.getElementById("prediction_msg");
}

