// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  onValue,
  remove,
  onDisconnect,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDUvrrrk54kYy2pjMVNR2BobK5lSNo3W1A",
  authDomain: "dgame-c72fd.firebaseapp.com",
  databaseURL: "https://dgame-c72fd-default-rtdb.firebaseio.com",
  projectId: "dgame-c72fd",
  storageBucket: "dgame-c72fd.firebasestorage.app",
  messagingSenderId: "872325783308",
  appId: "1:872325783308:web:fbdf5dbc61e08145c07329",
  measurementId: "G-EGD69V360G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export { db, ref, set, onValue, remove, onDisconnect };
