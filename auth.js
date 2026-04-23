// MESIN AUTHENTICATION & DATABASE ZYNC
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js"; // Mengambil config dari repo Bos

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Mengambil alih (Override) tombol Login/Register dari index.html ke Firebase
window.handleAuth = async () => {
    const email = document.getElementById('auth-email').value;
    const pass = document.getElementById('auth-pass').value;
    const user = document.getElementById('auth-user').value;
    const btn = document.getElementById('auth-btn');

    if(!email || !pass) return alert("Matrix menolak! Kredensial tidak boleh kosong.");
    
    // Efek Loading
    const originalText = btn.innerText;
    btn.innerText = "Membuka Enkripsi...";
    btn.disabled = true;

    try {
        if(isLoginMode) {
            // PROSES LOGIN KE FIREBASE
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
            
            if (userDoc.exists()) {
                // Simpan sesi ke local untuk loading cepat UI
                localStorage.setItem('zync_session', JSON.stringify(userDoc.data()));
                location.reload();
            } else {
                alert("Data profil tidak ditemukan di Matrix!");
            }
        } else {
            // PROSES REGISTER KE FIREBASE
            if(!user) throw new Error("Username wajib diisi untuk membuat node baru!");
            
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            
            // Otomatis Verified khusus untuk Bos (mengandung kata 'ikram')
            const isVerified = user.toLowerCase().includes('ikram');
            
            // Siapkan struktur data profil ZYNC
            const userData = {
                uid: userCredential.user.uid,
                user: "@" + user.replace(/\s+/g,'').toLowerCase(),
                name: user,
                email: email,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user}`,
                verified: isVerified,
                bio: "Node baru di jaringan ZYNC.",
                link: "",
                aura: 0,
                joinedAt: new Date().toISOString()
            };

            // Simpan profil ke Cloud Firestore
            await setDoc(doc(db, "users", userCredential.user.uid), userData);
            
            alert("Identitas berhasil dienkripsi ke Matrix ZYNC! Silakan Log In.");
            toggleAuth(); // Kembali ke tampilan Login
        }
    } catch (error) {
        let msg = "Terjadi anomali: " + error.message;
        if(error.code === 'auth/email-already-in-use') msg = "Email ini sudah terdaftar di jaringan!";
        if(error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') msg = "Akses Ditolak. Email atau Security Key salah.";
        alert(msg);
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
};

// Mengambil alih tombol Logout
window.logout = () => {
    signOut(auth).then(() => {
        localStorage.removeItem('zync_session');
        location.reload();
    }).catch((error) => {
        alert("Gagal keluar dari Matrix: " + error.message);
    });
};
