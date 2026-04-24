import { db } from '../../api/firebase.js';
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { State } from '../../core/state.js';
// import { StorageAPI } from '../../api/storage-api.js'; // Nanti diaktifkan kalau Storage sudah siap

export const ComposerUI = {
    render() {
        return `
            <div id="composer-modal" class="fixed inset-0 bg-[#020617]/95 backdrop-blur-md z-[100] transform translate-y-full transition-transform duration-300 flex flex-col">
                <div class="flex justify-between items-center px-6 py-4 border-b border-white/10">
                    <i class="fas fa-times text-xl text-white cursor-pointer" id="btn-close-composer"></i>
                    <h2 class="font-black text-white tracking-widest uppercase">New Broadcast</h2>
                    <button id="btn-send-post" class="text-cyan-400 font-bold uppercase text-sm">Send</button>
                </div>
                
                <div class="p-6 flex-1 flex flex-col gap-4">
                    <div class="flex gap-4">
                        <img src="${State.currentUser.avatar}" class="w-10 h-10 rounded-full border border-cyan-500 bg-slate-800">
                        <textarea id="composer-text" class="flex-1 bg-transparent border-none outline-none text-white resize-none text-lg" placeholder="Transmit your data to the Matrix... #Zync" rows="5"></textarea>
                    </div>
                    
                    <div class="mt-4">
                        <input type="text" id="composer-img-url" placeholder="🔗 Paste URL Gambar (Sementara)" class="w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-cyan-500">
                        </div>
                </div>
            </div>
        `;
    },

    attachEvents() {
        const modal = document.getElementById('composer-modal');
        const btnClose = document.getElementById('btn-close-composer');
        const btnSend = document.getElementById('btn-send-post');

        // Fungsi Buka Tutup
        window.openComposer = () => modal.classList.remove('translate-y-full');
        btnClose.addEventListener('click', () => modal.classList.add('translate-y-full'));

        // Fungsi Kirim ke Firestore
        btnSend.addEventListener('click', async () => {
            const text = document.getElementById('composer-text').value;
            const imgUrl = document.getElementById('composer-img-url').value;
            
            if(!text && !imgUrl) return;
            
            btnSend.innerText = "UPLOADING...";
            btnSend.disabled = true;

            try {
                await addDoc(collection(db, "transmissions"), {
                    uid: State.currentUser.uid,
                    name: State.currentUser.name,
                    user: State.currentUser.user,
                    avatar: State.currentUser.avatar,
                    verified: State.currentUser.verified,
                    content: text,
                    img: imgUrl,
                    likes: 0,
                    likedBy: [],
                    timestamp: serverTimestamp()
                });
                
                // Reset & Tutup
                document.getElementById('composer-text').value = '';
                document.getElementById('composer-img-url').value = '';
                modal.classList.add('translate-y-full');
                alert("Transmisi Berhasil Mengudara!");
            } catch(e) {
                alert("Gagal: " + e.message);
            } finally {
                btnSend.innerText = "SEND";
                btnSend.disabled = false;
            }
        });
    }
};
