// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCW3BtP6gHb_n88ryZ0gBLmuIZuWwL2wg0",
    authDomain: "clocker-48007.firebaseapp.com",
    projectId: "clocker-48007",
    storageBucket: "clocker-48007.firebasestorage.app",
    messagingSenderId: "178118536607",
    appId: "1:178118536607:web:0af56dd846c86293b9e1aa",
    measurementId: "G-TY4Y1SLZH0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();