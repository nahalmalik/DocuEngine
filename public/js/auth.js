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

            if (!response || response._nonJson) {
                throw new Error('Invalid server response structure');
            }

            const data = response.data || response; // Handle both wrapped and unwrapped data

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return true;
            } else {
                throw new Error('Login failed: No token received');
            }
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
