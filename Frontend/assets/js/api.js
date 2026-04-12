/* frontend/assets/js/api.js */
const BASE_URL = 'http://localhost:5000/api';

const API = {
    async request(endpoint, method = 'GET', body = null) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, options);
            const data = await response.json();

            if (response.status === 401 || response.status === 403) {
                // Token expired or unauthorized
                localStorage.clear();
                // Don't redirect if we are already trying to login
                if (!endpoint.includes('/auth/login')) {
                    window.location.href = '../pages/login.html';
                }
                throw new Error(data.message || 'Unauthorized: Invalid credentials');
            }

            if (!response.ok) {
                const errorMsg = data.message || 'API Error';
                const detailMsg = data.error ? ` (${data.error})` : '';
                throw new Error(errorMsg + detailMsg);
            }
            return data;
        } catch (error) {
            console.error('Fetch Error:', error);
            throw error;
        }
    }
};