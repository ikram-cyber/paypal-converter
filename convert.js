import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { 
  collection, addDoc, query, where, 
  orderBy, limit, getDocs 
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const API_KEY = "98095f984cd453256722a557";
const FEE_ADMIN = 2500;
const PAYPAL_ADMIN = "ikram.ujrc@gmail.com";
let kursIDR = 0;
let currentUser = null;
let userData = null;

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

window.toggleTujuan = function() {
  const jenis = document.getElementById('jenisTujuan').value;
  document.getElementById('sectionBank').style.display = 
    jenis === 'bank' ? 'block' : 'none';
  document.getElementById('sectionEwallet').style.display = 
    jenis === 'ewallet' ? 'block' : 'none';
};

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

  document.getElementById('loading').style.display = 'flex';

  // BUAT KODE UNIK TRANSAKSI
  const kodeTransaksi = 'TRX' + Date.now();
  const diterima = Math.round(nominal * kursIDR - FEE_ADMIN);

  try {
    await addDoc(collection(db, "transaksi"), {
      userId: currentUser.uid,
      email: currentUser.email,
      kodeTransaksi: kodeTransaksi,
      nominalUSD: nominal,
      kursIDR: kursIDR,
      hasilIDR: Math.round(nominal * kursIDR),
      feeAdmin: FEE_ADMIN,
      diterima: diterima,
      jenisTujuan: jenis,
      tujuanDetail: tujuanDetail,
      status: "menunggu_pembayaran",
      tanggal: new Date().toISOString()
    });

    document.getElementById('loading').style.display = 'none';

    // TAMPILKAN INSTRUKSI PEMBAYARAN
    document.getElementById('formTukar').style.display = 'none';
    document.getElementById('instruksiPembayaran').style.display = 'block';
    document.getElementById('infoKodeTransaksi').textContent = kodeTransaksi;
    document.getElementById('infoNominal').textContent = `$${nominal} USD`;
    document.getElementById('infoDiterima').textContent = 
      'Rp ' + new Intl.NumberFormat('id-ID').format(diterima);
    document.getElementById('infoPaypal').textContent = PAYPAL_ADMIN;

    // SIAPKAN TEKS UNTUK DICOPY
    const teksNota = 
`=== NOTA TRANSAKSI ===
Kode: ${kodeTransaksi}
Nominal Kirim: $${nominal} USD
Kirim PayPal ke: ${PAYPAL_ADMIN}
Kamu Terima: Rp ${new Intl.NumberFormat('id-ID').format(diterima)}
Tanggal: ${new Date().toLocaleString('id-ID')}
Status: Menunggu Pembayaran
=====================
Simpan kode ini sebagai bukti transaksi!`;

    document.getElementById('teksNota').textContent = teksNota;

  } catch (error) {
    document.getElementById('loading').style.display = 'none';
    alertBox.innerHTML = 
      `<div class="alert alert-error">Gagal: ${error.message}</div>`;
  }
};

// FUNGSI COPY NOTA
window.copyNota = function() {
  const teks = document.getElementById('teksNota').textContent;
  navigator.clipboard.writeText(teks).then(() => {
    document.getElementById('btnCopy').textContent = '✅ Tersalin!';
    setTimeout(() => {
      document.getElementById('btnCopy').textContent = '📋 Copy Nota';
    }, 2000);
  });
};

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
