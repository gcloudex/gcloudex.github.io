/**
 * Reference: 
 * - https://developers.google.com/api-client-library/javascript/start/start-js 
 * - tbd
 *  
*/

// Enter an API key from the Google API Console:
//   https://console.developers.google.com/apis/credentials
// Note: when you authorize your application using Oauth 2.0, 
// you do not also need to set the API key as in the first example. 
// However, it is a good practice to do so, in case your code ever expands
// to handle unauthorized requests.
//var apiKey = 'AIzaSyD';  //incomplete

// Enter the API Discovery Docs that describes the APIs you want to
// access. In this example, we are accessing the People API, so we load
// Discovery Doc found here: https://developers.google.com/people/api/rest/
var discoveryDocs = ["https://people.googleapis.com/$discovery/rest?version=v1"];

// Enter a client ID for a web application from the Google API Console:
//   https://console.developers.google.com/apis/credentials?project=_
// In your API Console project, add a JavaScript origin that corresponds
//   to the domain where you will be running the script.
  //  development client ID
//var clientId = '267601624832-';
  // production
var clientId = '1030010108515-nuqmpkp1sf356pt0gdb4nhhdu2h4o4nr.apps.googleusercontent.com';

// Enter one or more authorization scopes. Refer to the documentation for
// the API or https://developers.google.com/people/v1/how-tos/authorizing
// for details.
var scopes = 'profile';
var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

function handleClientLoad() {
  // Load the API client and auth2 library
  gapi.load('client:auth2', initClient);
}

function initClient() {
  gapi.client.init({
      // Don't need API key in this particular case because of OAuth 2.0
      //apiKey: apiKey,
      discoveryDocs: discoveryDocs,
      clientId: clientId,
      scope: scopes
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    makeApiCall();
  } else {
    authorizeButton.style.display = 'block';
    signoutButton.style.display = 'none';
    clearMessage();
  }
}

function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}

// Load the API and make an API call.  Display the results on the screen.
function makeApiCall() {
  gapi.client.people.people.get({
    'resourceName': 'people/me',
    //'requestMask.includeField': 'person.names'   // depracated
    'personFields': 'names'
  }).then(function(resp) {
    var name = resp.result.names[0].givenName;
    var welcome_text = document.createTextNode('Hello, '+name+'');
    var h1 = document.createElement('h1');
    h1.appendChild(welcome_text);
    var content = document.getElementById('welcome');
    //content.replaceChild(welcome_text, content.childNodes[0]);
    content.replaceChild(h1, content.childNodes[0]);
  });
}

function clearMessage() {
  var content = document.getElementById('welcome');
  var empty_text = document.createTextNode("");
  var h1 = document.createElement('h1');
  h1.appendChild(empty_text);
  //content.replaceChild(empty_text, content.childNodes[0]);
  content.replaceChild(h1, content.childNodes[0]);
}