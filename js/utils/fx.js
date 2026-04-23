export const FX = {
    haptic(ms = 50) {
        if (navigator.vibrate) navigator.vibrate(ms);
    },
    toast(msg, type = 'info') {
        this.haptic(30);
        const container = document.getElementById('toast-container') || this.createToastContainer();
        const t = document.createElement('div');
        t.className = `glass-panel px-6 py-3 rounded-full text-xs font-bold border-${type==='error'?'rose':'cyan'}-500/50 text-white animate-bounce-short`;
        t.innerHTML = msg;
        container.appendChild(t);
        setTimeout(() => { t.remove(); }, 3000);
    },
    createToastContainer() {
        const div = document.createElement('div');
        div.id = 'toast-container';
        div.className = 'fixed top-10 left-1/2 -translate-x-1/2 z-[10000] flex flex-col gap-3 pointer-events-none';
        document.body.appendChild(div);
        return div;
    }
};
