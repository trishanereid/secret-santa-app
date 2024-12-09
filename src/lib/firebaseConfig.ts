import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCrUqM3wtSKeUvHjhnsRTmS9LmLMAV2pIc",
    authDomain: "secret-santa-app-ec742.firebaseapp.com",
    projectId: "secret-santa-app-ec742",
    storageBucket: "secret-santa-app-ec742.firebasestorage.app",
    messagingSenderId: "577262725461",
    appId: "1:577262725461:web:86304657fa0d709c3827dc",
    measurementId: "G-R879MEXK21"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();