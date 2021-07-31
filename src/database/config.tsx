import firebase from "firebase/app";
import "firebase/database"

const firebaseConfig = {
    apiKey: "AIzaSyD-nNiZgNihTVv14ds9XVsoOMRV9QAU4q4",
    authDomain: "origin-trail.firebaseapp.com",
    databaseURL: "https://origin-trail-default-rtdb.firebaseio.com",
    projectId: "origin-trail",
    storageBucket: "origin-trail.appspot.com",
    messagingSenderId: "1064738814011",
    appId: "1:1064738814011:web:7cb38a9c6925167200041e"
  };

  firebase.initializeApp(firebaseConfig)
  const database = firebase.database();

  export {database}