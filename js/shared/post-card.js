export const PostCard = {
    render(p, currentUserId) {
        const isLiked = p.likedBy?.includes(currentUserId);
        return `
            <div class="post-card mb-6 overflow-hidden">
                <div class="flex items-center justify-between px-4 py-3">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full border border-cyan-500/50 p-0.5">
                            <img src="${p.avatar}" class="w-full h-full rounded-full object-cover">
                        </div>
                        <div class="flex flex-col">
                            <span class="text-xs font-black text-white">${p.name} ${p.verified ? '<i class="fas fa-check-circle text-cyan-400"></i>' : ''}</span>
                            <span class="text-[9px] text-slate-500 font-mono">${p.user}</span>
                        </div>
                    </div>
                    <i class="fas fa-ellipsis-v text-slate-600"></i>
                </div>
                <div class="relative w-full aspect-square bg-slate-900 flex items-center justify-center group" ondblclick="window.handleLike('${p.id}')">
                    ${p.img ? `<img src="${p.img}" class="w-full h-full object-cover">` : `<p class="px-8 text-sm font-medium text-slate-300 leading-relaxed">${p.content}</p>`}
                    <i id="heart-${p.id}" class="fas fa-heart absolute text-6xl text-rose-500 opacity-0 pointer-events-none transition-all"></i>
                </div>
                <div class="px-4 py-3">
                    <div class="flex items-center justify-between text-xl mb-2">
                        <div class="flex gap-5">
                            <i onclick="window.handleLike('${p.id}')" class="${isLiked ? 'fas text-rose-500' : 'far'} fa-heart cursor-pointer"></i>
                            <i class="far fa-comment cursor-pointer"></i>
                            <i class="far fa-paper-plane cursor-pointer"></i>
                        </div>
                        <i class="far fa-bookmark"></i>
                    </div>
                    <p class="text-xs font-black text-white">${p.likes || 0} Likes</p>
                    <p class="text-xs text-slate-300 mt-1"><span class="font-black mr-2">${p.user}</span>${p.content}</p>
                </div>
            </div>
        `;
    }
};
