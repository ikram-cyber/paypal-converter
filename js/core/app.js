import { State } from './state.js';
import { AuthAPI } from '../api/auth-api.js';
import { LoginUI } from '../features/auth/login.js';

class ZyncApp {
    constructor() {
        this.root = document.getElementById('app-root');
        this.initVisuals();
        
        AuthAPI.listen((user) => {
            this.render();
        });
    }

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

    render() {
        this.root.innerHTML = ''; 
        if (!State.currentUser) {
            this.renderGateway();
        } else {
            this.renderMainLayout();
        }
    }

    renderGateway() {
        this.root.innerHTML = LoginUI.render();
        LoginUI.attachEvents();
    }

    renderMainLayout() {
        this.root.innerHTML = `
            <div class="page-enter relative z-10">
                <header class="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-gradient-to-b from-[#020617] to-transparent">
                    <h1 class="text-2xl font-black tracking-widest text-white">ZY<span class="text-cyan-400">NC</span></h1>
                    <button id="btn-logout" class="text-rose-500 font-bold text-xs bg-rose-500/10 px-4 py-2 rounded-xl border border-rose-500/50">Disconnect</button>
                </header>
                
                <main class="pt-28 px-6 text-center">
                    <img src="${State.currentUser.avatar}" class="w-32 h-32 mx-auto rounded-full border-2 border-dashed border-cyan-500 p-1 mb-4 bg-slate-800 object-cover">
                    <h2 class="text-2xl font-black text-white">${State.currentUser.name}</h2>
                    <p class="text-cyan-400 font-mono text-sm">${State.currentUser.user}</p>
                    <div class="glass-panel mt-8 p-5 rounded-2xl max-w-sm mx-auto text-left">
                        <p class="text-emerald-400 text-xs font-mono font-bold">> SYSTEM ONLINE</p>
                    </div>
                </main>
            </div>
        `;

        document.getElementById('btn-logout').addEventListener('click', () => { AuthAPI.logout(); });
    }
}

new ZyncApp();
