import { ComposerUI } from "../features/creation/composer.js";
import { State } from './state.js';
import { AuthAPI } from '../api/auth-api.js';
import { LoginUI } from '../features/auth/login.js';
import { Timeline } from '../features/feed/timeline.js';
import { Stories } from '../features/stories/viewer.js';
import { Reels } from '../features/reels/engine.js';
import { Explore } from '../features/explore/search.js';
import { Profile } from '../features/profile/grid.js';

class ZyncApp {
    constructor() {
        this.root = document.getElementById('app-root');
        this.initVisuals();
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
            <div class="h-screen w-full relative">
                <header id="top-nav" class="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-[#020617]/90 backdrop-blur-md border-b border-white/5 transition-all">
                    <h1 class="text-xl font-black text-white">ZY<span class="text-cyan-400">NC</span></h1>
                    <div class="flex items-center gap-5">
                        <i class="far fa-heart text-xl text-white"></i>
                        <button id="btn-logout" class="text-rose-500 font-bold text-[10px] border border-rose-500/30 px-3 py-1 rounded-lg">OUT</button>
                    </div>
                </header>

                <div id="tab-home" class="tab-content pt-20">
                    ${Stories.render()}
                    <div id="feed-container" class="px-4"></div>
                </div>
                <div id="tab-explore" class="tab-content hidden">${Explore.render()}</div>
                <div id="tab-reels" class="tab-content hidden">${Reels.render()}</div>
                <div id="tab-profile" class="tab-content hidden">${Profile.render()}</div>

                <nav id="bottom-nav" class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-panel rounded-full px-8 py-3 flex justify-between items-center z-50">
                    <i id="nav-home" class="nav-btn fas fa-home text-cyan-400 text-xl cursor-pointer transition-all hover:scale-110"></i>
                    <i id="nav-explore" class="nav-btn fas fa-search text-slate-500 text-xl cursor-pointer transition-all hover:scale-110"></i>
                    <i id="nav-reels" class="nav-btn fas fa-video text-slate-500 text-xl cursor-pointer transition-all hover:scale-110"></i>
                    <img id="nav-profile" src="${State.currentUser.avatar}" class="nav-btn w-7 h-7 rounded-full border-2 border-transparent bg-slate-800 object-cover cursor-pointer transition-all hover:scale-110">
                </nav>
            </div>
        `;

        document.getElementById('btn-logout').addEventListener('click', () => AuthAPI.logout());
        Timeline.listen('feed-container'); // Tarik postingan dari Firebase
        this.setupNavigation();
    }

    setupNavigation() {
        const tabs = ['home', 'explore', 'reels', 'profile'];
        tabs.forEach(tab => {
            const btn = document.getElementById(`nav-${tab}`);
            btn.addEventListener('click', () => {
                // Sembunyikan semua tab & reset warna tombol
                tabs.forEach(t => {
                    document.getElementById(`tab-${t}`).classList.add('hidden');
                    if(t !== 'profile') {
                        document.getElementById(`nav-${t}`).classList.remove('text-cyan-400');
                        document.getElementById(`nav-${t}`).classList.add('text-slate-500');
                    } else {
                        document.getElementById('nav-profile').classList.remove('border-cyan-400');
                        document.getElementById('nav-profile').classList.add('border-transparent');
                    }
                });
                
                // Aktifkan tab yang diklik
                document.getElementById(`tab-${tab}`).classList.remove('hidden');
                if (tab === 'profile') {
                    btn.classList.add('border-cyan-400');
                    btn.classList.remove('border-transparent');
                } else {
                    btn.classList.remove('text-slate-500');
                    btn.classList.add('text-cyan-400');
                }

                // Sembunyikan Header atas kalau lagi buka Reels (Biar layar penuh)
                const topNav = document.getElementById('top-nav');
                if(tab === 'reels') topNav.classList.add('hidden');
                else topNav.classList.remove('hidden');
            });
        });
    }
}
new ZyncApp();
