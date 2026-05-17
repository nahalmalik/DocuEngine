// public/js/auth.js

const Auth = {
    getToken() {
        return localStorage.getItem('token');
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!this.getToken();
    },

    async login(email, password) {
        try {
            const response = await API.post('/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            return true;
        } catch (error) {
            throw error;
        }
    },

    async register(name, email, password) {
        try {
            await API.post('/auth/register', { name, email, password });
            return true;
        } catch (error) {
            throw error;
        }
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.hash = '#/login';
    }
};
