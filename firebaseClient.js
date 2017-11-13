const firebase = require('firebase');

const config = {
  apiKey: process.env.APIKEY,
  authDomain: 'did-u-eat.firebaseapp.com',
  databaseURL: 'https://did-u-eat.firebaseio.com',
  projectId: 'did-u-eat',
  storageBucket: '',
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
};
const firebaseClient = firebase.initializeApp(config);

module.exports = firebaseClient;
