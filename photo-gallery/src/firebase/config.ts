// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBDBF4Y1_TH_kuMk9nv5dY8oZxRDzo7b6A",
    authDomain: "chrilligram.firebaseapp.com",
    projectId: "chrilligram",
    storageBucket: "chrilligram.appspot.com",
    messagingSenderId: "912553473411",
    appId: "1:912553473411:web:28706ab9e35505135db2b6",
    measurementId: "G-R80QZ9FZ4B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const db = getFirestore(app)

const storage = getStorage(app)

export {
    app as default,
    auth,
    db,
    storage
}