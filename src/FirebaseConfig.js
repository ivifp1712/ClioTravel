// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import "firebase/firestore"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBnsA96Xfu-WBNf7SGo1c5zYBAOnWW1OuM",
  authDomain: "cliotravelbeta.firebaseapp.com",
  projectId: "cliotravelbeta",
  storageBucket: "cliotravelbeta.appspot.com",
  messagingSenderId: "944399713532",
  appId: "1:944399713532:web:2e07018f237a9668684379",
  measurementId: "G-RFNFHT99NB"
};

// Initialize Firebase
const fire = initializeApp(firebaseConfig);
const db = getFirestore(fire);
const analytics = getAnalytics(fire);

// export const db = fire.firestore();
export const auth = getAuth(fire);
export default fire;
export { db };
