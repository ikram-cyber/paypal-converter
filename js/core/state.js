export const State = {
    currentUser: JSON.parse(localStorage.getItem('zync_session')) || null,
    setUser(user) {
        this.currentUser = user;
        if(user) localStorage.setItem('zync_session', JSON.stringify(user));
        else localStorage.removeItem('zync_session');
    }
};
