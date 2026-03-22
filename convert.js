import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { 
  collection, addDoc, query, where, 
  orderBy, limit, getDocs 
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const API_KEY = "98095f984cd453256722a557";
const FEE_ADMIN = 2500;
let kursIDR = 0;
let currentUser = null;

// CEK LOGIN & AMBIL KURS
onAuthStateChanged(auth, async (user) => {
  if (!user) { 
    window.location.href = 'index.html'; 
    return; 
  }
  currentUser = user;
  await ambilKurs();
  if (document.getElementById('lastTrx')) {
    await tampilTrxTerakhir();
  }
});

// AMBIL KURS REAL-TIME
async function ambilKurs() {
  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`
    );
    const data = await res.json();
    kursIDR = data.conversion_rates.IDR;

    const kursFormatted = 
      new Intl.NumberFormat('id-ID').format(kursIDR);

    if (document.getElementById('kursIDR')) {
      document.getElementById('kursIDR').textContent = 
        `Rp ${kursFormatted}`;
      document.getElementById('lastUpdate').textContent =
        `Update: ${new Date().toLocaleString('id-ID')}`;
    }
    if (document.getElementById('infoKurs')) {
      document.getElementById('infoKurs').textContent = 
        `$1 = Rp ${kursFormatted}`;
    }
  } catch (e) {
    console.error('Gagal ambil kurs:', e);
  }
}

// HITUNG KONVERSI
window.hitungKonversi = function() {
  const nominal = 
    parseFloat(document.getElementById('nominalUSD').value);
  const alertBox = document.getElementById('alertBox');

  if (!nominal || nominal <= 0) {
    document.getElementById('hasilIDR').textContent = 'Rp 0';
    document.getElementById('kamTerima').textContent = 'Rp 0';
    document.getElementById('btnKonfirmasi').disabled = true;
    return;
  }

  if (nominal < 1.2) {
    alertBox.innerHTML = 
      '<div class="alert alert-warning">⚠️ Minimal penukaran $1.2 USD</div>';
    document.getElementById('btnKonfirmasi').disabled = true;
    return;
  }

  alertBox.innerHTML = '';
  const hasilIDR = nominal * kursIDR;
  const diterima = hasilIDR - FEE_ADMIN;

  document.getElementById('hasilIDR').textContent =
    'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(hasilIDR));
  document.getElementById('kamTerima').textContent =
    'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(diterima));
  document.getElementById('btnKonfirmasi').disabled = false;
};

// TOGGLE BANK / EWALLET
window.toggleTujuan = function() {
  const jenis = document.getElementById('jenisTujuan').value;
  document.getElementById('sectionBank').style.display = 
    jenis === 'bank' ? 'block' : 'none';
  document.getElementById('sectionEwallet').style.display = 
    jenis === 'ewallet' ? 'block' : 'none';
};

// KONFIRMASI TRANSAKSI
window.konfirmasiTransaksi = async function() {
  const nominal = 
    parseFloat(document.getElementById('nominalUSD').value);
  const jenis = document.getElementById('jenisTujuan').value;
  const alertBox = document.getElementById('alertBox');

  if (!jenis) {
    alertBox.innerHTML = 
      '<div class="alert alert-error">Pilih tujuan transfer dulu!</div>';
    return;
  }

  let tujuanDetail = {};

  if (jenis === 'bank') {
    const namaBank = document.getElementById('namaBank').value;
    const noRek = 
      document.getElementById('nomorRekening').value.trim();
    const namaPenerima = 
      document.getElementById('namaPenerima').value.trim();
    if (!namaBank || !noRek || !namaPenerima) {
      alertBox.innerHTML = 
        '<div class="alert alert-error">Lengkapi data bank!</div>';
      return;
    }
    tujuanDetail = { namaBank, noRek, namaPenerima };
  } else {
    const namaEwallet = 
      document.getElementById('namaEwallet').value;
    const noEwallet = 
      document.getElementById('nomorEwallet').value.trim();
    const namaPemilik = 
      document.getElementById('namaEwalletPemilik').value.trim();
    if (!namaEwallet || !noEwallet || !namaPemilik) {
      alertBox.innerHTML = 
        '<div class="alert alert-error">Lengkapi data e-wallet!</div>';
      return;
    }
    tujuanDetail = { namaEwallet, noEwallet, namaPemilik };
  }

  const konfirm = confirm(
    `Konfirmasi Transaksi:\n` +
    `Nominal: $${nominal} USD\n` +
    `Kamu terima: Rp ${new Intl.NumberFormat('id-ID').format(
      Math.round(nominal * kursIDR - FEE_ADMIN)
    )}\n` +
    `Fee admin: Rp 2.500\n\nLanjutkan?`
  );

  if (!konfirm) return;

  document.getElementById('loading').style.display = 'flex';

  try {
    await addDoc(collection(db, "transaksi"), {
      userId: currentUser.uid,
      email: currentUser.email,
      nominalUSD: nominal,
      kursIDR: kursIDR,
      hasilIDR: Math.round(nominal * kursIDR),
      feeAdmin: FEE_ADMIN,
      diterima: Math.round(nominal * kursIDR - FEE_ADMIN),
      jenisTujuan: jenis,
      tujuanDetail: tujuanDetail,
      status: "proses",
      tanggal: new Date().toISOString()
    });

    document.getElementById('loading').style.display = 'none';
    alert('✅ Transaksi berhasil diajukan!\nStatus: Sedang diproses\nCek riwayat untuk update status.');
    window.location.href = 'history.html';

  } catch (error) {
    document.getElementById('loading').style.display = 'none';
    alertBox.innerHTML = 
      `<div class="alert alert-error">Gagal: ${error.message}</div>`;
  }
};

// TAMPIL TRANSAKSI TERAKHIR DI DASHBOARD
async function tampilTrxTerakhir() {
  const q = query(
    collection(db, "transaksi"),
    where("userId", "==", currentUser.uid),
    orderBy("tanggal", "desc"),
    limit(3)
  );

  const snapshot = await getDocs(q);
  const container = document.getElementById('lastTrx');

  if (snapshot.empty) {
    container.innerHTML = 
      '<p style="color:#888; text-align:center;">Belum ada transaksi</p>';
    return;
  }

  container.innerHTML = '';
  snapshot.forEach(doc => {
    const d = doc.data();
    const statusClass = 
      d.status === 'sukses' ? 'status-sukses' :
      d.status === 'gagal' ? 'status-gagal' : 'status-proses';
    const tgl = new Date(d.tanggal).toLocaleDateString('id-ID');
    container.innerHTML += `
      <div class="trx-item">
        <div>
          <p style="font-weight:bold;">$${d.nominalUSD} USD</p>
          <p style="color:#888; font-size:12px;">
            ${tgl} • ${d.jenisTujuan}
          </p>
        </div>
        <div style="text-align:right;">
          <p style="color:#6bff6b;">
            Rp ${new Intl.NumberFormat('id-ID').format(d.diterima)}
          </p>
          <p class="${statusClass}" style="font-size:12px;">
            ${d.status.toUpperCase()}
          </p>
        </div>
      </div>
    `;
  });
}
