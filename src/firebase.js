// src/firebase.js
// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAF7iNNze_pPy1MZxSQnR3Cn4ALF6-YDi8",
  authDomain: "ciat-cyberclub.firebaseapp.com",
  projectId: "ciat-cyberclub",
  storageBucket: "ciat-cyberclub.firebasestorage.app",
  messagingSenderId: "717735420431",
  appId: "1:717735420431:web:2e7dee1d1b729f38d8797a",
  measurementId: "G-5LB5MNVVFP"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // 👈 This fixes your warning

export default app;

