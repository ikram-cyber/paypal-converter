import { db } from './firebase-config.js';
import {
  collection, query, orderBy, getDocs, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const PASSWORD_ADMIN = "Karamat9";
let semuaTransaksi = [];
let semuaUsers = [];

// CEK PASSWORD ADMIN
window.cekPasswordAdmin = function() {
  const password = document.getElementById('passwordAdmin').value;
  const alertAdmin = document.getElementById('alertAdmin');

  if (password === PASSWORD_ADMIN) {
    document.getElementById('loginAdmin').style.display = 'none';
    document.getElementById('panelAdmin').style.display = 'block';
    ambilSemuaTransaksi();
    ambilSemuaUsers();
  } else {
    alertAdmin.innerHTML =
      '<div class="alert alert-error">Password salah!</div>';
  }
};

// LOGOUT ADMIN
window.logoutAdmin = function() {
  document.getElementById('loginAdmin').style.display = 'block';
  document.getElementById('panelAdmin').style.display = 'none';
  document.getElementById('passwordAdmin').value = '';
};

// SWITCH TAB
window.switchTab = function(tab) {
  document.getElementById('tabTransaksi').style.display =
    tab === 'transaksi' ? 'block' : 'none';
  document.getElementById('tabUsers').style.display =
    tab === 'users' ? 'block' : 'none';

  document.getElementById('btnTabTransaksi').style.background =
    tab === 'transaksi' ? '#003087' : 'transparent';
  document.getElementById('btnTabUsers').style.background =
    tab === 'users' ? '#003087' : 'transparent';
};

// AMBIL SEMUA TRANSAKSI
async function ambilSemuaTransaksi() {
  try {
    const q = query(
      collection(db, "transaksi"),
      orderBy("tanggal", "desc")
    );
    const snapshot = await getDocs(q);
    semuaTransaksi = [];

    snapshot.forEach(docSnap => {
      semuaTransaksi.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    const menunggu = semuaTransaksi.filter(
      t => t.status === 'menunggu_pembayaran').length;
    const sukses = semuaTransaksi.filter(
      t => t.status === 'sukses').length;
    const gagal = semuaTransaksi.filter(
      t => t.status === 'gagal').length;

    document.getElementById('totalTrx').textContent =
      semuaTransaksi.length;
    document.getElementById('totalMenunggu').textContent = menunggu;
    document.getElementById('totalSukses').textContent = sukses;
    document.getElementById('totalGagal').textContent = gagal;

    tampilTransaksi(semuaTransaksi);

  } catch (error) {
    console.error('Error:', error);
  }
};

// AMBIL SEMUA USERS
async function ambilSemuaUsers() {
  try {
    const q = query(
      collection(db, "users"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    semuaUsers = [];

    snapshot.forEach(docSnap => {
      semuaUsers.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });

    document.getElementById('totalUsers').textContent =
      semuaUsers.length;

    tampilUsers(semuaUsers);

  } catch (error) {
    console.error('Error users:', error);
  }
};

// TAMPIL USERS
function tampilUsers(data) {
  const container = document.getElementById('listUsers');

  if (data.length === 0) {
    container.innerHTML =
      '<p style="color:#888; text-align:center;">Belum ada user</p>';
    return;
  }

  container.innerHTML = '';
  data.forEach((user, index) => {
    const tgl = new Date(user.createdAt).toLocaleString('id-ID');
    container.innerHTML += `
      <div class="card" style="margin:10px 0;">
        <div style="display:flex; justify-content:space-between;
          align-items:start;">
          <div>
            <p style="font-weight:bold; font-size:16px;">
              ${user.nama}
            </p>
            <p style="color:#888; font-size:13px; margin-top:4px;">
              📧 ${user.email}
            </p>
            <p style="color:#0070ba; font-size:13px; margin-top:4px;">
              💳 PayPal: ${user.paypalEmail}
            </p>
            <p style="color:#888; font-size:12px; margin-top:4px;">
              📅 Daftar: ${tgl}
            </p>
          </div>
          <div style="background:#003087; border-radius:50%;
            width:40px; height:40px; display:flex;
            justify-content:center; align-items:center;
            font-weight:bold; font-size:18px;">
            ${user.nama.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    `;
  });
}

// FILTER TRANSAKSI
window.filterTransaksi = function() {
  const filter = document.getElementById('filterStatus').value;
  if (filter === 'semua') {
    tampilTransaksi(semuaTransaksi);
  } else {
    const filtered = semuaTransaksi.filter(
      t => t.status === filter
    );
    tampilTransaksi(filtered);
  }
};

// TAMPIL TRANSAKSI
function tampilTransaksi(data) {
  const container = document.getElementById('listAdminTrx');

  if (data.length === 0) {
    container.innerHTML =
      '<p style="color:#888; text-align:center;">Tidak ada transaksi</p>';
    return;
  }

  container.innerHTML = '';
  data.forEach(trx => {
    const tgl = new Date(trx.tanggal).toLocaleString('id-ID');
    const statusColor =
      trx.status === 'sukses' ? '#6bff6b' :
      trx.status === 'gagal' ? '#ff6b6b' : '#ffff6b';
    const statusLabel =
      trx.status === 'sukses' ? '✅ SUKSES' :
      trx.status === 'gagal' ? '❌ DITOLAK' : '⏳ MENUNGGU';

    let tujuanInfo = '';
    if (trx.jenisTujuan === 'bank') {
      tujuanInfo = `
        <p style="color:#888; font-size:13px;">
          🏦 ${trx.tujuanDetail.namaBank}
        </p>
        <p style="color:white; font-size:13px;">
          ${trx.tujuanDetail.noRek}
        </p>
        <p style="color:#888; font-size:13px;">
          a/n ${trx.tujuanDetail.namaPenerima}
        </p>`;
    } else {
      tujuanInfo = `
        <p style="color:#888; font-size:13px;">
          📱 ${trx.tujuanDetail.namaEwallet}
        </p>
        <p style="color:white; font-size:13px;">
          ${trx.tujuanDetail.noEwallet}
        </p>
        <p style="color:#888; font-size:13px;">
          a/n ${trx.tujuanDetail.namaPemilik}
        </p>`;
    }

    container.innerHTML += `
      <div class="card" style="margin:10px 0;">
        <div style="display:flex; justify-content:space-between;
          align-items:start; margin-bottom:10px;">
          <div>
            <p style="font-weight:bold; font-size:18px;">
              $${trx.nominalUSD} USD
            </p>
            <p style="color:#ffff6b; font-size:12px;">
              ${trx.kodeTransaksi}
            </p>
          </div>
          <p style="color:${statusColor}; font-weight:bold;">
            ${statusLabel}
          </p>
        </div>
        <hr style="border-color:#333; margin:8px 0;">
        <p style="color:#888; font-size:12px;">👤 User:</p>
        <p style="color:white; font-size:13px;">${trx.email}</p>
        <hr style="border-color:#333; margin:8px 0;">
        <p style="color:#888; font-size:12px;
          margin-bottom:5px;">📤 Tujuan Transfer:</p>
        ${tujuanInfo}
        <hr style="border-color:#333; margin:8px 0;">
        <div style="display:flex; justify-content:space-between;">
          <span style="color:#888; font-size:13px;">Diterima:</span>
          <span style="color:#6bff6b; font-weight:bold;">
            Rp ${new Intl.NumberFormat('id-ID').format(trx.diterima)}
          </span>
        </div>
        <div style="display:flex; justify-content:space-between;
          margin-top:5px;">
          <span style="color:#888; font-size:13px;">Tanggal:</span>
          <span style="color:#888; font-size:13px;">${tgl}</span>
        </div>
        ${trx.status === 'menunggu_pembayaran' ? `
          <div style="display:grid; grid-template-columns:1fr 1fr;
            gap:10px; margin-top:15px;">
            <button class="btn"
              style="background:#006600; padding:10px;"
              onclick="updateStatus('${trx.id}', 'sukses')">
              ✅ Sukses
            </button>
            <button class="btn"
              style="background:#660000; padding:10px;"
              onclick="updateStatus('${trx.id}', 'gagal')">
              ❌ Tolak
            </button>
          </div>
        ` : `
          <div style="margin-top:10px; text-align:center;">
            <p style="color:${statusColor}; font-size:13px;">
              Transaksi sudah ${trx.status === 'sukses' ?
              'diselesaikan' : 'ditolak'}
            </p>
          </div>
        `}
      </div>
    `;
  });
}

// UPDATE STATUS TRANSAKSI
window.updateStatus = async function(trxId, statusBaru) {
  const konfirm = confirm(
    statusBaru === 'sukses' ?
    '✅ Tandai transaksi ini SUKSES?\nPastikan sudah transfer ke rekening user!' :
    '❌ Tolak transaksi ini?\nPastikan sudah refund ke user jika perlu!'
  );

  if (!konfirm) return;

  document.getElementById('loading').style.display = 'flex';

  try {
    await updateDoc(doc(db, "transaksi", trxId), {
      status: statusBaru,
      updatedAt: new Date().toISOString()
    });

    alert(statusBaru === 'sukses' ?
      '✅ Transaksi berhasil ditandai SUKSES!' :
      '❌ Transaksi berhasil DITOLAK!'
    );

    await ambilSemuaTransaksi();

  } catch (error) {
    alert('Gagal update: ' + error.message);
  }

  document.getElementById('loading').style.display = 'none';
};
