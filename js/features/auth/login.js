import { AuthAPI } from '../../api/auth-api.js';

export const LoginUI = {
    render() {
        return `
            <div class="min-h-screen flex flex-col items-center justify-center px-6 text-center page-enter">
                <div class="mb-10">
                    <h1 class="text-5xl font-black tracking-widest text-white">ZY<span class="text-cyan-400">NC</span></h1>
                    <p class="text-[10px] font-mono mt-3 text-cyan-500 uppercase tracking-[0.4em]">Matrix Gateway</p>
                </div>
                <div class="w-full max-w-sm glass-panel rounded-[2rem] p-8">
                    <div class="space-y-4">
                        <div id="div-user" class="hidden"><input type="text" id="auth-user" placeholder="Username" class="w-full rounded-xl px-5 py-4 text-sm outline-none bg-slate-900 text-white border border-white/10"></div>
                        <input type="email" id="auth-email" placeholder="Email" class="w-full rounded-xl px-5 py-4 text-sm outline-none bg-slate-900 text-white border border-white/10">
                        <input type="password" id="auth-pass" placeholder="Password" class="w-full rounded-xl px-5 py-4 text-sm outline-none bg-slate-900 text-white border border-white/10">
                        <button id="auth-btn" class="w-full bg-cyan-500 text-black py-4 rounded-xl font-black uppercase text-sm shadow-[0_0_20px_rgba(34,211,238,0.4)]">Initialize</button>
                    </div>
                    <p class="text-xs text-slate-500 mt-6"><span id="auth-txt">Belum terdaftar?</span> <button id="auth-toggle" class="text-cyan-400 font-bold">Daftar</button></p>
                </div>
            </div>
        `;
    },
    attachEvents() {
        let isLogin = true;
        const btn = document.getElementById('auth-btn');
        const toggle = document.getElementById('auth-toggle');
        
        toggle.onclick = () => {
            isLogin = !isLogin;
            document.getElementById('div-user').classList.toggle('hidden');
            btn.innerText = isLogin ? "Initialize" : "Daftar";
            document.getElementById('auth-txt').innerText = isLogin ? "Belum terdaftar?" : "Sudah punya akses?";
            toggle.innerText = isLogin ? "Daftar" : "Login";
        };

        btn.onclick = async () => {
            const email = document.getElementById('auth-email').value;
            const pass = document.getElementById('auth-pass').value;
            const user = document.getElementById('auth-user').value;
            btn.disabled = true; btn.innerText = "Processing...";
            try {
                if(isLogin) await AuthAPI.login(email, pass);
                else await AuthAPI.register(email, pass, user);
            } catch(e) { 
                alert(e.message); 
                btn.disabled = false; btn.innerText = isLogin ? "Initialize" : "Daftar";
            }
        };
    }
};
