// Reference: https://developers.google.com/api-client-library/javascript/start/start-js

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// Change before deployment
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// Enter a client ID for a web application from the Google API Console:
//   https://console.developers.google.com/apis/credentials?project=_
// In your API Console project, add a JavaScript origin that corresponds
//   to the domain where you will be running the script.
  //  development client ID
//var clientId = '267601624832-';
  // production
var clientId = '1030010108515-nuqmpkp1sf356pt0gdb4nhhdu2h4o4nr.apps.googleusercontent.com';

//var ml_predict_name = 'projects/temporal-parser-233105/models/census';
var ml_predict_name = 'projects/exploreai/models/census';

//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

// Enter one or more authorization scopes. Refer to the documentation for
// the API or for details.
var scopes = 'profile https://www.googleapis.com/auth/cloud-platform';
//var scopes = 'profile';

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

function handleClientLoad() {
  welcome_msg = document.getElementById("welcome_msg");
  preauthorized_msg = document.getElementById("preauthorized_msg");
  authorizeButton = document.getElementById("authorize-button");
  signoutButton = document.getElementById("signout-button");
  predictButton = document.getElementById("predict-button");
  prediction_msg = document.getElementById("prediction_msg");

  // Load the API client and auth2 library
  gapi.load('client:auth2', initClient);
  //var caploss_input = document.getElementById("caploss");
  //caploss_input.setAttribute("value", capitalLoss);
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

function handlePredictClick(event) {
  //##### Use to explore the API by printing to console the object structure
  console.log(gapi.client);

  // retrive the capital_loss input value
  capitalLoss = document.getElementById("caploss").value;
  //console.log("capital_loss: " + capitalLoss);
  var instance = '{"instances": [{"age": 25, "workclass": " Private", \
  "education": " 11th", "education_num": 7, "marital_status": " Never-married", \
  "occupation": " Machine-op-inspct", "relationship": " Own-child", \
  "race": " Black", "gender": " Male", "capital_gain": 0, \
  "capital_loss": ' + capitalLoss + ', "hours_per_week": 40, \
  "native_country": " United-States"}]}';
  console.log("instance: " + instance);
  // Ref: 
  // - https://cloud.google.com/ml-engine/reference/rest/
  // - https://cloud.google.com/ml-engine/reference/rest/v1/projects/predict
  gapi.client.ml.projects.predict({
    'name': ml_predict_name,
    'resource': instance
  }).then(function(resp) {
      /**if (err) {
        renderPrediction(err, null)
        return;
      }*/
      //renderPrediction(null, resp);
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
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
    predictButton.onclick = handlePredictClick;
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    makeApiCall();
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

function makeApiCall() {
  gapi.client.people.people.get({
    'resourceName': 'people/me',
    //'requestMask.includeField': 'person.names'   // depracated
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
    var probab_le_50k = resp.result.predictions[0].probabilities[1];
    var probab_gt_50k = resp.result.predictions[0].probabilities[0];
    msg = "Predicted Income: >50k with " + 
      "(Probability: " + (probab_gt_50k*100).toFixed(2) + "%)";
    if (probab_gt_50k <= probab_le_50k) {
      msg = "Predicted Income: <=50k with " + 
        "(Probability: " + (probab_le_50k*100).toFixed(2) + "%)";
    }
  }
  return msg;
}
