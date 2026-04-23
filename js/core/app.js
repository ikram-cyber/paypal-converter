import { State } from './state.js';
import { AuthAPI } from '../api/auth-api.js';
import { LoginUI } from '../features/auth/login.js';
import { Timeline } from '../features/feed/timeline.js';

class ZyncApp {
    constructor() {
        this.root = document.getElementById('app-root');
        this.initVisuals();
        // Cek koneksi Firebase & Render
        AuthAPI.listen(() => { this.render(); });
    }

    initVisuals() {
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize); resize();
        const particles = Array.from({length: 30}, () => ({x: Math.random()*canvas.width, y: Math.random()*canvas.height, s: Math.random()*1, d: Math.random()*0.3}));
        const draw = () => {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
            particles.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI*2); ctx.fill(); p.y -= p.d; if(p.y<0) p.y=canvas.height; });
            requestAnimationFrame(draw);
        };
        draw();
    }

    render() {
        this.root.innerHTML = '';
        if (!State.currentUser) {
            this.root.innerHTML = LoginUI.render();
            LoginUI.attachEvents();
        } else {
            this.renderMain();
        }
    }

    renderMain() {
        this.root.innerHTML = `
            <div class="pb-24">
                <header class="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-[#020617]/90 backdrop-blur-md border-b border-white/5">
                    <h1 class="text-xl font-black text-white">ZY<span class="text-cyan-400">NC</span></h1>
                    <button id="btn-logout" class="text-rose-500 font-bold text-[10px] border border-rose-500/30 px-3 py-1 rounded-lg">OUT</button>
                </header>
                <div id="feed-container" class="pt-24 px-4"></div>
                <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-panel rounded-full px-8 py-3 flex justify-around items-center z-50">
                    <i class="fas fa-home text-cyan-400"></i>
                    <i class="fas fa-search text-slate-500"></i>
                    <img src="${State.currentUser.avatar}" class="w-7 h-7 rounded-full border border-cyan-500">
                </nav>
            </div>
        `;
        document.getElementById('btn-logout').addEventListener('click', () => AuthAPI.logout());
        Timeline.listen('feed-container');
    }
}
new ZyncApp();
