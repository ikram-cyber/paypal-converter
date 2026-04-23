import { State } from './state.js';

class ZyncApp {
    constructor() {
        this.root = document.getElementById('app-root');
        this.initVisuals();
        this.render();
    }

    // Efek Partikel Background
    initVisuals() {
        const canvas = document.getElementById('bg-canvas'); 
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        const particles = Array.from({length: 40}, () => ({x: Math.random()*canvas.width, y: Math.random()*canvas.height, s: Math.random()*2+1, d: Math.random()*1+0.5}));
        
        const drawBg = () => { 
            ctx.clearRect(0,0,canvas.width,canvas.height); 
            ctx.fillStyle = 'rgba(34, 211, 238, 0.4)'; 
            particles.forEach(p => { 
                ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI*2); ctx.fill(); 
                p.y -= p.d; if(p.y < 0) p.y = canvas.height; 
            }); 
            requestAnimationFrame(drawBg); 
        };
        drawBg();
    }

    // Mesin Render Halaman
    render() {
        this.root.innerHTML = ''; // Bersihkan layar

        if (!State.currentUser) {
            // Jika belum login, tampilkan Gateway (Pintu Masuk)
            this.renderGateway();
        } else {
            // Jika sudah login, tampilkan Aplikasi Utama
            this.renderMainLayout();
        }
    }

    renderGateway() {
        this.root.innerHTML = `
            <div class="min-h-screen flex flex-col items-center justify-center px-6 text-center page-enter">
                <div class="mb-10">
                    <h1 class="text-5xl font-black tracking-[0.3em] text-white" style="text-shadow: 0 0 20px rgba(34, 211, 238, 0.6);">ZY<span class="text-cyan-400">NC</span></h1>
                    <p class="text-[10px] font-mono uppercase tracking-[0.4em] mt-3 text-cyan-500">Identity Gateway</p>
                </div>
                <div class="w-full max-w-sm glass-panel rounded-[2rem] p-8">
                    <button id="btn-mock-login" class="w-full bg-cyan-500 text-[#020617] py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.4)]">Masuk Mode Tamu</button>
                </div>
            </div>
        `;

        // Simulasi Login (Akan diganti dengan auth/login.js nanti)
        document.getElementById('btn-mock-login').addEventListener('click', () => {
            State.setUser({ user: "@ikram", name: "Ikram Cyber", verified: true });
            this.render(); // Render ulang layar ke Aplikasi Utama
        });
    }

    renderMainLayout() {
        this.root.innerHTML = `
            <div class="page-enter">
                <header class="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-gradient-to-b from-[#020617] to-transparent">
                    <h1 class="text-2xl font-black tracking-widest text-white">ZY<span class="text-cyan-400">NC</span></h1>
                    <button id="btn-logout" class="text-rose-500 font-bold text-xs bg-rose-500/20 px-3 py-1 rounded-lg">Logout</button>
                </header>
                
                <main class="pt-24 px-6 text-center">
                    <h2 class="text-2xl font-bold text-white">Selamat Datang di Matrix!</h2>
                    <p class="text-cyan-400 font-mono mt-2">${State.currentUser.user}</p>
                    <p class="text-slate-400 text-sm mt-6">Mesin utama berhasil berjalan. Siap menyuntikkan 500 fitur.</p>
                </main>
            </div>
        `;

        // Logika Logout
        document.getElementById('btn-logout').addEventListener('click', () => {
            State.setUser(null);
            this.render(); // Kembali ke Gateway
        });
    }
}

// Jalankan Mesin saat file di-load
new ZyncApp();
