import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from 
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { 
  collection, query, where, orderBy, getDocs 
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) { 
    window.location.href = 'index.html'; 
    return; 
  }
  await tampilRiwayat(user.uid);
});

async function tampilRiwayat(userId) {
  const container = document.getElementById('listRiwayat');

  try {
    const q = query(
      collection(db, "transaksi"),
      where("userId", "==", userId),
      orderBy("tanggal", "desc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = 
        '<p style="color:#888; text-align:center; margin-top:50px;">Belum ada transaksi</p>';
      return;
    }

    container.innerHTML = '';
    snapshot.forEach(doc => {
      const d = doc.data();
      const statusClass = 
        d.status === 'sukses' ? 'status-sukses' :
        d.status === 'gagal' ? 'status-gagal' : 'status-proses';
      const tgl = new Date(d.tanggal).toLocaleString('id-ID');

      let tujuanInfo = '';
      if (d.jenisTujuan === 'bank') {
        tujuanInfo = 
          `${d.tujuanDetail.namaBank} • ${d.tujuanDetail.noRek}`;
      } else {
        tujuanInfo = 
          `${d.tujuanDetail.namaEwallet} • ${d.tujuanDetail.noEwallet}`;
      }

      container.innerHTML += `
        <div class="card" style="margin:10px 0;">
          <div style="display:flex; justify-content:space-between; 
            align-items:start;">
            <div>
              <p style="font-weight:bold; font-size:18px;">
                $${d.nominalUSD} USD
              </p>
              <p style="color:#888; font-size:13px; margin-top:4px;">
                ${tujuanInfo}
              </p>
              <p style="color:#888; font-size:12px;">${tgl}</p>
            </div>
            <div style="text-align:right;">
              <p style="color:#6bff6b; font-weight:bold;">
                Rp ${new Intl.NumberFormat('id-ID').format(d.diterima)}
              </p>
              <p class="${statusClass}" style="font-size:13px; margin-top:4px;">
                ● ${d.status.toUpperCase()}
              </p>
            </div>
          </div>
          <hr style="border-color:#333; margin:10px 0;">
          <div style="display:flex; justify-content:space-between; 
            font-size:13px; color:#888;">
            <span>
              Kurs: Rp ${new Intl.NumberFormat('id-ID').format(d.kursIDR)}
            </span>
            <span>Fee: Rp 2.500</span>
          </div>
        </div>
      `;
    });

  } catch (error) {
    container.innerHTML = 
      `<div class="alert alert-error">Gagal memuat: ${error.message}</div>`;
  }
}
