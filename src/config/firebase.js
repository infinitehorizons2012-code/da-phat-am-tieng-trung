import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDEhTrDG4sh689ez6hqHbXNUX3tV3UGckA",
  authDomain: "da-phat-am-tieng-trung.firebaseapp.com",
  projectId: "da-phat-am-tieng-trung",
  storageBucket: "da-phat-am-tieng-trung.firebasestorage.app",
  messagingSenderId: "189238800721",
  appId: "1:189238800721:web:74bdca59db8e9ef87aa370",
  measurementId: "G-W078DQMRC2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
