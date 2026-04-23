import { auth, db } from './firebase.js';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { State } from '../core/state.js';

export const AuthAPI = {
    async login(email, pass) {
        const c = await signInWithEmailAndPassword(auth, email, pass);
        const d = await getDoc(doc(db, "users", c.user.uid));
        if(d.exists()) State.setUser(d.data());
    },
    async register(email, pass, user) {
        const c = await createUserWithEmailAndPassword(auth, email, pass);
        const data = { uid: c.user.uid, user: "@"+user.toLowerCase(), name: user, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user}`, verified: user.toLowerCase().includes('ikram'), timestamp: new Date().toISOString() };
        await setDoc(doc(db, "users", c.user.uid), data);
        State.setUser(data);
    },
    async logout() { await signOut(auth); State.setUser(null); location.reload(); },
    listen(cb) {
        onAuthStateChanged(auth, async (u) => {
            if(u) {
                const d = await getDoc(doc(db, "users", u.uid));
                if(d.exists()) State.setUser(d.data());
            } else { State.setUser(null); }
            cb();
        });
    }
};
