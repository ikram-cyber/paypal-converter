import { State } from './state.js';
import { AuthAPI } from '../api/auth-api.js';
import { LoginUI } from '../features/auth/login.js';
import { Timeline } from '../features/feed/timeline.js';
import { Composer } from '../features/creation/composer.js';

class ZyncApp {
    constructor() {
        this.root = document.getElementById('app-root');
        this.initVisuals();
        AuthAPI.listen(() => this.render());
    }

    initVisuals() {
        const canvas = document.getElementById('bg-canvas');
        const ctx = canvas.getContext('2d');
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize); resize();
        const particles = Array.from({length: 20}, () => ({x: Math.random()*canvas.width, y: Math.random()*canvas.height, s: Math.random()*1, d: Math.random()*0.3}));
        const draw = () => {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
            particles.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI*2); ctx.fill(); p.y -= p.d; if(p.y<0) p.y=canvas.height; });
            requestAnimationFrame(draw);
        };
        draw();
    }

    render() {
        this.root.innerHTML = '';
        if (!State.currentUser) return this.renderGateway();
        this.renderMainApp();
    }

    renderGateway() {
        this.root.innerHTML = LoginUI.render();
        LoginUI.attachEvents();
    }

    renderMainApp() {
        this.root.innerHTML = `
            <div class="page-enter pb-24">
                <header class="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-[#020617]/90 backdrop-blur-md border-b border-white/5">
                    <h1 class="text-xl font-black text-white tracking-tighter">ZY<span class="text-cyan-400">NC</span></h1>
                    <div class="flex gap-5 text-lg">
                        <i class="far fa-heart"></i>
                        <i class="fab fa-facebook-messenger"></i>
                    </div>
                </header>

                <div id="main-content" class="pt-20">
                    <div class="flex gap-4 overflow-x-auto px-6 mb-6 no-scrollbar">
                        <div class="flex flex-col items-center gap-1 shrink-0">
                            <div class="w-16 h-16 rounded-full border-2 border-dashed border-slate-700 flex items-center justify-center"><i class="fas fa-plus"></i></div>
                            <span class="text-[9px] text-slate-500 font-bold uppercase">You</span>
                        </div>
                        ${[1,2,3,4].map(i => `<div class="w-16 h-16 rounded-full border-2 border-cyan-500 p-0.5 shrink-0"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${i}" class="w-full h-full rounded-full bg-slate-800"></div>`).join('')}
                    </div>
                    
                    <div class="px-4 mb-8">
                        <div class="glass-panel p-4 rounded-2xl flex gap-3 items-center">
                            <img src="${State.currentUser.avatar}" class="w-8 h-8 rounded-full">
                            <input id="quick-post" type="text" placeholder="Transmit thoughts..." class="bg-transparent border-none outline-none text-xs flex-1 text-white">
                            <button id="btn-quick-send" class="text-cyan-400 font-black text-xs uppercase tracking-widest">Send</button>
                        </div>
                    </div>

                    <div id="feed-container"></div>
                </div>

                <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm glass-panel rounded-full px-8 py-3 flex justify-between items-center z-50">
                    <i class="fas fa-home text-cyan-400 text-xl"></i>
                    <i class="fas fa-search text-slate-500 text-xl"></i>
                    <i class="fas fa-video text-slate-500 text-xl"></i>
                    <img src="${State.currentUser.avatar}" class="w-7 h-7 rounded-full border border-slate-700" onclick="alert('Profile Module Loading...')">
                </nav>
            </div>
        `;

        // Start Timeline Listener
        Timeline.listen('feed-container');

        // Quick Post Event
        document.getElementById('btn-quick-send').addEventListener('click', async () => {
            const input = document.getElementById('quick-post');
            if(!input.value) return;
            await Composer.broadcast(input.value);
            input.value = '';
        });
    }
}
new ZyncApp();
