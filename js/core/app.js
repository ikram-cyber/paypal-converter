import { State } from './state.js';
import { AuthAPI } from '../api/auth-api.js';
import { LoginUI } from '../features/auth/login.js';

class ZyncApp {
    constructor() {
        this.root = document.getElementById('app-root');
        this.initVisuals();
        this.isAppReady = false;

        AuthAPI.listen((user) => {
            this.render();
            this.isAppReady = true;
        });
    }

    initVisuals() {
        const canvas = document.getElementById('bg-canvas'); 
        const ctx = canvas.getContext('2d');
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize); resize();

        const particles = Array.from({length: 30}, () => ({
            x: Math.random()*canvas.width, 
            y: Math.random()*canvas.height, 
            s: Math.random()*1.5+0.5, 
            d: Math.random()*0.5+0.2
        }));
        
        const drawBg = () => { 
            ctx.clearRect(0,0,canvas.width,canvas.height); 
            ctx.fillStyle = 'rgba(34, 211, 238, 0.3)'; 
            particles.forEach(p => { 
                ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI*2); ctx.fill(); 
                p.y -= p.d; if(p.y < 0) p.y = canvas.height; 
            }); 
            requestAnimationFrame(drawBg); 
        };
        drawBg();
    }

    render() {
        // Jika sudah login, jangan tampilkan Gateway lagi
        if (State.currentUser) {
            this.renderMainLayout();
        } else {
            this.renderGateway();
        }
    }

    renderGateway() {
        this.root.innerHTML = LoginUI.render();
        LoginUI.attachEvents();
    }

    renderMainLayout() {
        this.root.innerHTML = `
            <div class="page-enter relative z-10">
                <header class="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
                    <h1 class="text-2xl font-black tracking-tighter text-white">ZY<span class="text-cyan-400">NC</span></h1>
                    <button id="btn-logout" class="text-[10px] font-bold text-rose-400 border border-rose-400/30 px-3 py-1.5 rounded-lg uppercase">Disconnect</button>
                </header>
                
                <main class="pt-32 px-6 flex flex-col items-center">
                    <div class="w-32 h-32 rounded-full p-1 border-2 border-cyan-500/50 mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]">
                        <img src="${State.currentUser.avatar}" class="w-full h-full rounded-full bg-slate-800 object-cover">
                    </div>
                    <h2 class="text-3xl font-black text-white">${State.currentUser.name}</h2>
                    <p class="text-cyan-500 font-mono text-sm tracking-widest mt-1">${State.currentUser.user}</p>
                    
                    <div class="glass-panel mt-10 p-6 rounded-3xl w-full max-w-sm border border-cyan-500/20">
                        <div class="flex items-center gap-3 mb-4">
                            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <p class="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Neural Link Established</p>
                        </div>
                        <p class="text-slate-400 text-xs leading-relaxed">Selamat datang kembali, <span class="text-white">${State.currentUser.name}</span>. Modul Database Firestore telah aktif dan siap menerima transmisi data.</p>
                    </div>
                </main>
            </div>
        `;

        document.getElementById('btn-logout').addEventListener('click', () => {
            AuthAPI.logout();
        });
    }
}

new ZyncApp();
