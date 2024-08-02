// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref } from "firebase/database"; // Import database functions

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCXNTt9UTMcnUbH_JExjYFaW1PoRPlbEY0",
  authDomain: "live-stream-46af1.firebaseapp.com",
  projectId: "live-stream-46af1",
  storageBucket: "live-stream-46af1.appspot.com",
  messagingSenderId: "1090172564407",
  appId: "1:1090172564407:web:3c13a386d9c48b268c2e32",
  measurementId: "G-F1BMQBDZP4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Get a reference to the database
// const database = app.database();
export const database = getDatabase(app);
