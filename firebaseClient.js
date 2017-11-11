const firebase = require('firebase');

var config = {
  apiKey: "AIzaSyAVhNRiAjLRliPoCSuiNLZthLFrmcUgCRo",
  authDomain: "did-u-eat.firebaseapp.com",
  databaseURL: "https://did-u-eat.firebaseio.com",
  projectId: "did-u-eat",
  storageBucket: "",
  messagingSenderId: "896147501067"
};
const firebaseClient = firebase.initializeApp(config);

module.exports = firebaseClient;
