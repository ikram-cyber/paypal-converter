import { State } from './state.js';
import { AuthAPI } from '../api/auth-api.js';
import { LoginUI } from '../features/auth/login.js';
import { Timeline } from '../features/feed/timeline.js';

class ZyncApp {
    constructor() {
        console.log("ZYNC System: Initializing...");
        this.root = document.getElementById('app-root');
        this.initVisuals();
        
        // Memastikan sistem stand-by menunggu data cloud
        AuthAPI.listen((user) => {
            console.log("ZYNC Auth Status:", user ? "Connected" : "Disconnected");
            this.render();
        });
    }

    initVisuals() {
        const canvas = document.getElementById('bg-canvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth; canvas.height = window.innerHeight;
        const particles = Array.from({length: 30}, () => ({x: Math.random()*canvas.width, y: Math.random()*canvas.height, s: Math.random()*1, d: Math.random()*0.5}));
        const draw = () => {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
            particles.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, Math.PI*2); ctx.fill(); p.y -= p.d; if(p.y<0) p.y=canvas.height; });
            requestAnimationFrame(draw);
        };
        draw();
    }

    render() {
        if (!State.currentUser) {
            this.root.innerHTML = LoginUI.render();
            LoginUI.attachEvents();
        } else {
            this.renderFeed();
        }
    }

    renderFeed() {
        this.root.innerHTML = `
            <div class="page-enter pb-24">
                <header class="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center bg-[#020617]/90 backdrop-blur-md border-b border-white/5">
                    <h1 class="text-xl font-black text-white tracking-tighter">ZY<span class="text-cyan-400">NC</span></h1>
                    <img src="${State.currentUser.avatar}" class="w-8 h-8 rounded-full border border-cyan-500" onclick="window.handleLogout()">
                </header>
                <div id="main-feed" class="pt-24 px-4"></div>
                <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 w-[85%] glass-panel rounded-full px-8 py-3 flex justify-around items-center z-50">
                    <i class="fas fa-home text-cyan-400"></i>
                    <i class="fas fa-search text-slate-500"></i>
                    <i class="fas fa-plus-circle text-slate-500" onclick="alert('Module Creation Pending')"></i>
                    <i class="fas fa-video text-slate-500"></i>
                    <i class="fas fa-user text-slate-500"></i>
                </nav>
            </div>
        `;
        Timeline.listen('main-feed');
        window.handleLogout = () => AuthAPI.logout();
    }
}

new ZyncApp();
