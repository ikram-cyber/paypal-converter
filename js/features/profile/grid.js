import { State } from '../../core/state.js';

export const Profile = {
    render() {
        const u = State.currentUser;
        return `
            <div class="pb-28">
                <div class="h-48 bg-gradient-to-b from-cyan-900/40 to-[#020617] relative flex justify-end p-6 pt-10">
                    <i class="fas fa-cog text-xl text-white cursor-pointer hover:text-cyan-400" onclick="alert('Module Settings Loading...')"></i>
                </div>
                <div class="px-6 relative -mt-16">
                    <div class="flex justify-between items-end mb-4">
                        <div class="w-28 h-28 rounded-full bg-[#020617] p-1.5 relative">
                            <div class="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500 animate-spin-slow"></div>
                            <img src="${u.avatar}" class="w-full h-full rounded-full object-cover bg-slate-800">
                        </div>
                        <div class="flex gap-6 text-center mb-2">
                            <div><p class="font-black text-xl text-cyan-400">SYNC</p><p class="text-[9px] text-slate-400 uppercase">Cloud</p></div>
                            <div><p class="font-black text-xl text-white">ON</p><p class="text-[9px] text-slate-400 uppercase">Status</p></div>
                        </div>
                    </div>
                    <h2 class="font-black text-2xl text-white flex items-center gap-2">${u.name} ${u.verified ? '<i class="fas fa-check-circle text-cyan-500 text-sm"></i>' : ''}</h2>
                    <p class="text-sm text-cyan-400 font-mono mt-1">${u.user}</p>
                    <div class="glass-panel p-4 rounded-2xl mt-4 font-mono text-[10px] text-slate-300">
                        <p>> BIO: <span class="text-white">${u.bio || 'Menunggu Sinkronisasi...'}</span></p>
                        <p>> UID: <span class="text-cyan-400">${u.uid}</span></p>
                    </div>
                </div>
                <div class="flex mt-8 border-b border-white/5 bg-[#020617]">
                    <button class="flex-1 py-4 text-center border-b-2 border-cyan-500 text-cyan-400"><i class="fas fa-th-large"></i></button>
                    <button class="flex-1 py-4 text-center text-slate-600"><i class="fas fa-bookmark"></i></button>
                </div>
                <div class="grid grid-cols-3 gap-1 px-1 py-1">
                    <div class="aspect-square bg-slate-900 border border-white/5 flex items-center justify-center"><i class="fas fa-camera text-slate-700"></i></div>
                </div>
            </div>
        `;
    }
};
