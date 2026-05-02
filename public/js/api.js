// public/js/api.js

const API = {
    // Detect environment
    get isCapacitor() {
        return !!window.Capacitor || window.location.protocol === 'capacitor:' || window.location.protocol === 'file:' || window.location.hostname === 'localhost';
    },

    // Base URL configuration
    getBaseUrl() {
        return this.isCapacitor ? 'http://192.168.18.51/quotation-system/api/v1' : '../api/v1';
    },

    async request(endpoint, method = 'GET', body = null) {
        const baseUrl = this.getBaseUrl();
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = {
            method,
            headers,
            cache: 'no-cache',
            mode: 'cors'
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

        try {
            const response = await fetch(url, options);
            const contentType = response.headers.get("content-type");

            // Check if it's JSON
            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 401) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.hash = '#/login';
                    }
                    throw new Error(data.error || 'Something went wrong');
                }
                return data;
            } else {
                // Not JSON (could be PDF or HTML error)
                if (!response.ok) {
                    const text = await response.text();
                    alert(`SERVER ERROR\n\nURL: ${url}\n\nResponse:\n${text.substring(0, 200)}`);
                    throw new Error('Server returned non-JSON response.');
                }
                // If it's OK but not JSON (like a direct PDF view), return the response or null
                return null;
            }
        } catch (error) {
            if (error.message !== 'Server returned non-JSON response.') {
                alert(`CONNECTION ERROR\nURL: ${url}\nError: ${error.message}`);
            }
            throw error;
        }
    },

    get(endpoint) { return this.request(endpoint, 'GET'); },
    post(endpoint, body) { return this.request(endpoint, 'POST', body); },
    put(endpoint, body) { return this.request(endpoint, 'PUT', body); },
    delete(endpoint) { return this.request(endpoint, 'DELETE'); }
};
