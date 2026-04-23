import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { State } from '../core/state.js';

export const AuthAPI = {
    async login(email, password) {
        // .trim() untuk hapus spasi tak sengaja
        const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
        const userDoc = await getDoc(doc(db, "users", cred.user.uid));
        if(userDoc.exists()) {
            State.setUser(userDoc.data());
            return userDoc.data();
        }
        throw new Error("Data user tidak ditemukan di database.");
    },
    async register(email, password, username) {
        const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const isVerified = username.toLowerCase().includes('ikram');
        const userData = {
            uid: cred.user.uid,
            user: "@" + username.replace(/\s+/g,'').toLowerCase(),
            name: username,
            email: email.trim(),
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            verified: isVerified,
            bio: "Node terhubung ke ZYNC Cloud."
        };
        await setDoc(doc(db, "users", cred.user.uid), userData);
        State.setUser(userData);
        return userData;
    },
    async logout() {
        localStorage.clear(); // Hapus semua cache lama
        await signOut(auth);
        State.setUser(null);
        window.location.reload(); // Refresh total agar sistem bersih
    },
    listen(callback) {
        onAuthStateChanged(auth, async (user) => {
            if(user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if(userDoc.exists()) {
                    State.setUser(userDoc.data());
                    callback(userDoc.data());
                }
            } else {
                State.setUser(null);
                callback(null);
            }
        });
    }
};
