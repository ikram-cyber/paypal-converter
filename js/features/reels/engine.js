export const Reels = {
    render() {
        const data = [
            { bg: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80", user: "@cyber_ninja", desc: "Matrix flow. #Cyberpunk" },
            { bg: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&q=80", user: "@ikram_core", desc: "Terminal hacking. #Code" }
        ];
        return `
            <div class="h-screen w-full bg-black overflow-y-scroll snap-y snap-mandatory scroll-smooth pb-20">
                ${data.map(r => `
                    <div class="relative h-screen w-full snap-start flex items-center justify-center">
                        <img src="${r.bg}" class="absolute inset-0 w-full h-full object-cover opacity-70">
                        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020617] opacity-90"></div>
                        <div class="absolute bottom-24 left-6 z-10">
                            <div class="flex items-center gap-3 mb-2">
                                <div class="w-10 h-10 rounded-full border border-cyan-500 overflow-hidden"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${r.user}" class="w-full h-full bg-slate-800"></div>
                                <p class="text-white font-black text-sm">${r.user}</p>
                                <button class="border border-white text-xs px-3 py-1 rounded-full text-white font-bold">Follow</button>
                            </div>
                            <p class="text-slate-300 text-sm font-mono">${r.desc}</p>
                        </div>
                        <div class="absolute bottom-24 right-4 z-10 flex flex-col gap-6 items-center text-white text-3xl">
                            <i class="fas fa-heart drop-shadow-lg"></i>
                            <i class="fas fa-comment drop-shadow-lg"></i>
                            <i class="fas fa-share drop-shadow-lg"></i>
                            <i class="fas fa-ellipsis-v text-xl mt-2 drop-shadow-lg"></i>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
};
