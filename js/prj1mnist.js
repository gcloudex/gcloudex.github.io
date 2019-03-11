//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// Change before deployment
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// Enter a client ID for a web application from the Google API Console:
//   https://console.developers.google.com/apis/credentials?project=_
// In your API Console project, add a JavaScript origin that corresponds
//   to the domain where you will be running the script.
  //  development client ID
//var clientId = '267601624832';
  // production
var clientId = '1030010108515-nuqmpkp1sf356pt0gdb4nhhdu2h4o4nr.apps.googleusercontent.com';

//var ml_predict_name = 'projects/temporal-parser-233105/models/mnist';
var ml_predict_name = 'projects/exploreai/models/mnist';

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

// Enter one or more authorization scopes. Refer to the documentation for
// the API or for details.
// the following is for accessing user profile; and Cloud ML Engine
var scopes = 'profile https://www.googleapis.com/auth/cloud-platform';

// Enter the API Discovery Docs that describes the APIs you want to
// access. In this example, we are accessing the People API, so we load
// Discovery Doc found here: https://developers.google.com/people/api/rest/
//      TODO - try out to see if loading the discovery doc of ml.googleapis is
//      necessary; Optimized the code; see discussio about 
//      Option 2: Use gapi.client.request on 
//      https://developers.google.com/api-client-library/javascript/start/start-js 
var discoveryDocs = ["https://people.googleapis.com/$discovery/rest?version=v1",
  "https://ml.googleapis.com/$discovery/rest?version=v1"];

// UI variables
var preauthorized_msg, authorizeButton, welcome_msg, signoutButton;
var predictButton, prediction_msg;

var current_digit;

function init() {
  //console.log("init()...");
  welcome_msg = document.getElementById("welcome_msg");
  preauthorized_msg = document.getElementById("preauthorized_msg");
  authorizeButton = document.getElementById("authorize-button");
  signoutButton = document.getElementById("signout-button");
  predictButton = document.getElementById("predict-button");
  prediction_msg = document.getElementById("prediction_msg");
  initCanvas();
}

function handleClientLoad() {
  // Load the API client and auth2 library
  gapi.load('client:auth2', initClient);
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function handlePredictClick(event) {
  //##### Use to explore the API by printing to console the object structure
  //console.log(gapi.client);

  //console.log("digit: ", pixels);
  var req_payload = convertPixelToJSON();

  // Ref: 
  // - https://cloud.google.com/ml-engine/reference/rest/
  // - https://cloud.google.com/ml-engine/reference/rest/v1/projects/predict
  gapi.client.ml.projects.predict({
    'name': ml_predict_name,
    'resource': req_payload
  }).then(function(resp) {
      /**if (err) {
        renderPrediction(err, null)
        return;
      }*/
      renderMsg(prediction_msg, null, constructPredictionMsg(resp));
    });
}

function initClient() {
  gapi.client.init({
      // Don't need API key in this particular case because of OAuth 2.0
      //apiKey: apiKey,
      discoveryDocs: discoveryDocs,
      clientId: clientId,
      scope: scopes
  }).then(function() {
    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    // Listen for future sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
    predictButton.onclick = handlePredictClick;
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    makeProfileApiCall();
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    preauthorized_msg.style.display = 'none';
    predictButton.style.display = 'inline';
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    preauthorized_msg.style.display = 'block';
    predictButton.style.display = 'none';
    renderMsg(welcome_msg, null, "");
    renderMsg(prediction_msg, null, "");
  }
}

// TODO: Error handling!!
function makeProfileApiCall() {
  gapi.client.people.people.get({
    'resourceName': 'people/me',
    'personFields': 'names'
  }).then(function(resp) {
    renderMsg(welcome_msg, null, constructWelcomeMsg(resp));
  }, function(err) {
    renderMsg(welcome_msg, constructErrMsg(err), "");
  });
}

function renderMsg(msgDiv, err, msg) {
  if (!msgDiv) return;  // return if no place to put the message
  display_msg = "";
  if (err) {
    //console.log(err);
    display_msg = err;
  } else if (msg) {
    display_msg = msg;
  }

  var msg_node = document.createTextNode(display_msg);
  if (msgDiv.childNodes.length == 0) {
    msgDiv.appendChild(msg_node);
  } else {
    //console.log(msgDiv.childNodes)
    msgDiv.replaceChild(msg_node, msgDiv.childNodes[0]);
  }
}

function constructWelcomeMsg(resp) {
  msg = "";
  if (resp) {
    //console.log(JSON.stringify(resp));
    var name = resp.result.names[0].givenName;
    msg =  "Hi, ";
    if (name) msg = msg + name;
  }
  return msg;
}

function constructErrMsg(err) {
  errmsg = "";
  if (err) {
    //console.log(err);
    errmsg = err.result.error.message;
  }
  return msg;
}

function constructPredictionMsg(resp) {
  msg = "";
  if (resp) {
    //console.log(JSON.stringify(resp));
    // hack here because the key name is funky; "dense_8/Softmax:0"
    // redeploy model with TF layer name;
    var predictions = resp.result.predictions;
    var p0 = predictions[0];
    var key = Object.keys(p0)[0];
    var probabilities = p0[key];
    //console.log(probabilities);
    var max_prob = Math.max(...probabilities);   //JS Spread syntax
    var idx = "?";
    if (max_prob > 0.6) {
      idx = String(probabilities.indexOf(max_prob));
      current_digit = probabilities.indexOf(max_prob);

      // append to the number input
      number_input = document.getElementById("number");
      number_value = number_input.value;
      number_value_str = String(number_value) + idx;
      number_input.value = number_value_str;
    }
    //console.log("idx, prob = ", idx, max_prob);
    msg =  "Your wrote: "+idx+" (probab.: "+(max_prob.toFixed(2)*100)+"%)";
  }
  return msg;
}

function convertPixelToJSON() {
  var str_digit = "[";
  for (var y = 0; y < 28; y++){
    row = "[";
    for (var x = 0; x < 28; x++){
      row = row + "[" + pixels[(y*28)+x].toFixed(1) + "]";
      if (x<27) row = row + ", ";
    }
    row = row + "]";
    str_digit = str_digit + row;
    if (y<27) str_digit = str_digit + ", ";
  }
  str_digit = str_digit + "]";
  var req_json = '{"instances": [{"input_image": ' + str_digit + '}]}'; 
  //console.log("request = ", req_json);
  return req_json;
}