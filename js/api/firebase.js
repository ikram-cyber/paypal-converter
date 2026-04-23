import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDrNPFvNC-qqB2slfY0F6rtNd1L1cQHAcI",
    authDomain: "ikram-social.firebaseapp.com",
    projectId: "ikram-social",
    storageBucket: "ikram-social.firebasestorage.app",
    messagingSenderId: "250435295406",
    appId: "1:250435295406:web:97dd4e2f5ea8842be7353f"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
