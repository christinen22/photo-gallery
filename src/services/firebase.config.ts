// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, FieldValue } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBQebBaoRJaOmsNcMhcfvyQ7khAJGeFeXQ",
    authDomain: "chrilligram-cbdd6.firebaseapp.com",
    projectId: "chrilligram-cbdd6",
    storageBucket: "chrilligram-cbdd6.appspot.com",
    messagingSenderId: "139446513829",
    appId: "1:139446513829:web:3aa9463493e98c093c5d4c",
    measurementId: "G-CHXGYWVJPC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)
export const db = getFirestore(app)
export const auth = getAuth(app)

export { FieldValue }