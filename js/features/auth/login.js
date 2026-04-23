import { AuthAPI } from '../../api/auth-api.js';

export const LoginUI = {
    render() {
        return `
            <div class="min-h-screen flex flex-col items-center justify-center px-6 text-center page-enter z-10 relative">
                <div class="mb-10">
                    <div class="w-24 h-24 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-5xl shadow-[0_0_50px_rgba(34,211,238,0.2)] mx-auto mb-6">
                        <i class="fas fa-fingerprint"></i>
                    </div>
                    <h1 class="text-5xl font-black tracking-[0.3em] text-white" style="text-shadow: 0 0 20px rgba(34, 211, 238, 0.6);">ZY<span class="text-cyan-400">NC</span></h1>
                    <p class="text-[10px] font-mono uppercase tracking-[0.4em] mt-3 text-cyan-500">Identity Gateway</p>
                </div>
                <div class="w-full max-w-sm glass-panel rounded-[2rem] p-8">
                    <h2 id="auth-title" class="text-lg font-bold mb-6 text-white uppercase tracking-widest border-b border-white/10 pb-4">Akses Sistem</h2>
                    <div class="space-y-4">
                        <div id="div-user" class="hidden"><input type="text" id="auth-user" placeholder="Create Identity (@node)" class="w-full bg-slate-900 rounded-xl px-5 py-4 text-sm outline-none text-white border border-white/10 transition-all focus:border-cyan-400"></div>
                        <input type="email" id="auth-email" placeholder="Email Node" class="w-full bg-slate-900 rounded-xl px-5 py-4 text-sm outline-none text-white border border-white/10 transition-all focus:border-cyan-400">
                        <input type="password" id="auth-pass" placeholder="Security Key" class="w-full bg-slate-900 rounded-xl px-5 py-4 text-sm outline-none text-white border border-white/10 transition-all focus:border-cyan-400">
                        <button id="auth-btn" class="w-full bg-cyan-500 hover:bg-cyan-400 text-[#020617] py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all">Initialize</button>
                    </div>
                    <div class="mt-6 flex flex-col gap-3 text-xs text-slate-400">
                        <p><span id="auth-toggle-txt">Node baru?</span> <button id="auth-toggle-btn" class="text-cyan-400 font-bold hover:underline">Generate</button></p>
                    </div>
                    <p id="auth-msg" class="text-rose-500 text-xs mt-4 font-bold hidden"></p>
                </div>
            </div>
        `;
    },
    attachEvents() {
        let isLoginMode = true;
        const btn = document.getElementById('auth-btn');
        const toggleBtn = document.getElementById('auth-toggle-btn');
        const msgBox = document.getElementById('auth-msg');

        toggleBtn.addEventListener('click', () => {
            isLoginMode = !isLoginMode;
            document.getElementById('div-user').classList.toggle('hidden');
            document.getElementById('auth-title').innerText = isLoginMode ? "Akses Sistem" : "Generate Node";
            btn.innerText = isLoginMode ? "Initialize" : "Daftar";
            document.getElementById('auth-toggle-txt').innerText = isLoginMode ? "Node baru?" : "Sudah punya akses?";
            toggleBtn.innerText = isLoginMode ? "Generate" : "Login";
        });

        btn.addEventListener('click', async () => {
            const email = document.getElementById('auth-email').value;
            const pass = document.getElementById('auth-pass').value;
            const user = document.getElementById('auth-user').value;
            
            if(!email || !pass) { msgBox.innerText = "Isi kredensial!"; msgBox.classList.remove('hidden'); return; }
            
            btn.innerText = "Connecting..."; btn.disabled = true; msgBox.classList.add('hidden');
            
            try {
                if(isLoginMode) await AuthAPI.login(email, pass);
                else {
                    if(!user) throw new Error("Username kosong!");
                    await AuthAPI.register(email, pass, user);
                }
            } catch (e) {
                msgBox.innerText = "Error: " + e.message; msgBox.classList.remove('hidden');
            } finally {
                btn.innerText = isLoginMode ? "Initialize" : "Daftar"; btn.disabled = false;
            }
        });
    }
};
