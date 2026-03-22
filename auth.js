import { auth, db } from './firebase-config.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import {
  doc, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

// CEK STATUS LOGIN
const halaman = window.location.pathname;

onAuthStateChanged(auth, async (user) => {
  if (user) {
    if (halaman.includes('index.html') || 
        halaman.includes('register.html') || 
        halaman === '/') {
      window.location.href = 'dashboard.html';
    }
    if (halaman.includes('dashboard.html')) {
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        document.getElementById('namaUser').textContent = 
          docSnap.data().nama;
        document.getElementById('emailUser').textContent = 
          user.email;
      }
    }
  } else {
    if (!halaman.includes('index.html') && 
        !halaman.includes('register.html') && 
        halaman !== '/') {
      window.location.href = 'index.html';
    }
  }
});

// FUNGSI LOGIN
window.login = async function() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const alertBox = document.getElementById('alertBox');

  if (!email || !password) {
    alertBox.innerHTML = 
      '<div class="alert alert-error">Email & password wajib diisi!</div>';
    return;
  }

  document.getElementById('loading').style.display = 'flex';

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = 'dashboard.html';
  } catch (error) {
    document.getElementById('loading').style.display = 'none';
    alertBox.innerHTML = 
      '<div class="alert alert-error">Email atau password salah!</div>';
  }
};

// FUNGSI REGISTER
window.register = async function() {
  const nama = document.getElementById('nama').value.trim();
  const email = document.getElementById('email').value.trim();
  const paypalEmail = document.getElementById('paypalEmail').value.trim();
  const password = document.getElementById('password').value;
  const konfirmasi = document.getElementById('konfirmasi').value;
  const alertBox = document.getElementById('alertBox');

  if (!nama || !email || !paypalEmail || !password || !konfirmasi) {
    alertBox.innerHTML = 
      '<div class="alert alert-error">Semua field wajib diisi!</div>';
    return;
  }

  if (password.length < 6) {
    alertBox.innerHTML = 
      '<div class="alert alert-error">Password minimal 6 karakter!</div>';
    return;
  }

  if (password !== konfirmasi) {
    alertBox.innerHTML = 
      '<div class="alert alert-error">Password tidak cocok!</div>';
    return;
  }

  document.getElementById('loading').style.display = 'flex';

  try {
    const userCred = await createUserWithEmailAndPassword(
      auth, email, password
    );
    await setDoc(doc(db, "users", userCred.user.uid), {
      nama: nama,
      email: email,
      paypalEmail: paypalEmail,
      createdAt: new Date().toISOString()
    });
    alertBox.innerHTML = 
      '<div class="alert alert-success">Registrasi berhasil! Mengalihkan...</div>';
    setTimeout(() => window.location.href = 'dashboard.html', 1500);
  } catch (error) {
    document.getElementById('loading').style.display = 'none';
    alertBox.innerHTML = 
      `<div class="alert alert-error">Gagal daftar: ${error.message}</div>`;
  }
};

// FUNGSI LUPA PASSWORD
window.lupaPassword = async function() {
  const email = document.getElementById('email').value.trim();
  const alertBox = document.getElementById('alertBox');

  if (!email) {
    alertBox.innerHTML =
      '<div class="alert alert-warning">⚠️ Masukkan email kamu dulu!</div>';
    return;
  }

  try {
    const { sendPasswordResetEmail } = await import(
      "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js"
    );
    await sendPasswordResetEmail(auth, email);
    alertBox.innerHTML =
      '<div class="alert alert-success">✅ Link reset password sudah dikirim ke email kamu! Cek inbox/spam!</div>';
  } catch (error) {
    alertBox.innerHTML =
      '<div class="alert alert-error">❌ Email tidak ditemukan!</div>';
  }
};


// FUNGSI LOGOUT
window.logout = async function() {
  await signOut(auth);
  window.location.href = 'index.html';
};
