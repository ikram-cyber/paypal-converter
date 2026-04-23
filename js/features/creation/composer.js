import { db } from '../../api/firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { State } from '../../core/state.js';

export const Composer = {
    async broadcast(content, img = "") {
        if (!content && !img) return;
        await addDoc(collection(db, "transmissions"), {
            uid: State.currentUser.uid,
            name: State.currentUser.name,
            user: State.currentUser.user,
            avatar: State.currentUser.avatar,
            verified: State.currentUser.verified,
            content: content,
            img: img,
            likes: 0,
            likedBy: [],
            timestamp: serverTimestamp()
        });
    }
};
