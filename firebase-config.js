import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCGd_L4Es00xZLpL8HDHgm11kPfWUvqf3U",
  authDomain: "converter-48111.firebaseapp.com",
  projectId: "converter-48111",
  storageBucket: "converter-48111.firebasestorage.app",
  messagingSenderId: "352175968375",
  appId: "1:352175968375:web:7c72b11f7ab120de20f672"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
