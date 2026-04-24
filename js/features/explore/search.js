export const Explore = {
    render() {
        const imgs = [
            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400",
            "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400",
            "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400",
            "https://images.unsplash.com/photo-1531297172867-11f8185c163e?w=400",
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
            "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400"
        ];
        return `
            <div class="pt-24 px-4 pb-28">
                <div class="glass-panel rounded-2xl flex items-center px-4 py-3 mb-6">
                    <i class="fas fa-search text-cyan-400"></i>
                    <input type="text" placeholder="Search the Matrix..." class="w-full bg-transparent border-none outline-none text-sm ml-3 text-white">
                </div>
                <div class="flex gap-3 overflow-x-auto no-scrollbar mb-6 px-2">
                    <button class="bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 px-4 py-1.5 rounded-full text-xs font-bold shrink-0">🔥 Trending</button>
                    <button class="glass-panel px-4 py-1.5 rounded-full text-xs font-bold text-white shrink-0">#CyberSec</button>
                    <button class="glass-panel px-4 py-1.5 rounded-full text-xs font-bold text-white shrink-0">Web3</button>
                </div>
                <div class="grid grid-cols-3 gap-1">
                    ${imgs.map(img => `<div class="aspect-square bg-slate-800"><img src="${img}" class="w-full h-full object-cover"></div>`).join('')}
                </div>
            </div>
        `;
    }
};
