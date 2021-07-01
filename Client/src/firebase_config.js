import firebase from "firebase";

var firebaseConfig = {
    apiKey: "AIzaSyBZeqMCgGTMnVXhkGqc0Tk7i8Z7lazTwkk",
    authDomain: "fake-abf16.firebaseapp.com",
    projectId: "fake-abf16",
    storageBucket: "fake-abf16.appspot.com",
    messagingSenderId: "448017501326",
    appId: "1:448017501326:web:cac0a5c3014c65d6cecddf",
    measurementId: "G-EZN36JE9BM"
  };
  // Initialize Firebase

  firebase.initializeApp(firebaseConfig);

  const db = firebase.firestore();

  export {db};