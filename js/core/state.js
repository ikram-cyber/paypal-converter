// Memori Global ZYNC
export const State = {
    currentUser: JSON.parse(localStorage.getItem('zync_session')) || null,
    theme: localStorage.getItem('zync_theme') || 'default',
    aura: parseInt(localStorage.getItem('zync_aura')) || 0,

    setUser(user) {
        this.currentUser = user;
        if(user) localStorage.setItem('zync_session', JSON.stringify(user));
        else localStorage.removeItem('zync_session');
    }
};
