import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, GithubAuthProvider, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCW3BtP6gHb_n88ryZ0gBLmuIZuWwL2wg0",
  authDomain: "clocker-48007.firebaseapp.com",
  projectId: "clocker-48007",
  storageBucket: "clocker-48007.firebasestorage.app",
  messagingSenderId: "178118536607",
  appId: "1:178118536607:web:0af56dd846c86293b9e1aa",
  measurementId: "G-TY4Y1SLZH0",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
export const db = getFirestore(app);
