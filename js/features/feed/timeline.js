import { db } from '../../api/firebase.js';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, increment } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { PostCard } from '../../shared/post-card.js';
import { State } from '../../core/state.js';

export const Timeline = {
    listen(containerId) {
        const q = query(collection(db, "transmissions"), orderBy("timestamp", "desc"));
        onSnapshot(q, (snapshot) => {
            const container = document.getElementById(containerId);
            if (!container) return;
            let html = '';
            snapshot.forEach((doc) => {
                html += PostCard.render({ id: doc.id, ...doc.data() }, State.currentUser.uid);
            });
            container.innerHTML = html || '<p class="text-center text-slate-600 mt-20 font-mono text-xs">NO TRANSMISSIONS FOUND IN THIS SECTOR.</p>';
        });
    },
    async toggleLike(postId) {
        const postRef = doc(db, "transmissions", postId);
        const myUid = State.currentUser.uid;
        // Kita butuh fetch sekali atau pakai data lokal untuk toggle
        // Untuk kecepatan, kita asumsikan toggle di UI dulu
        const heartIcon = document.getElementById(`heart-${postId}`);
        if(heartIcon) {
            heartIcon.classList.add('animate-burst');
            setTimeout(() => heartIcon.classList.remove('animate-burst'), 600);
        }
        // Logic Firestore Update akan di-handle di sini
    }
};
