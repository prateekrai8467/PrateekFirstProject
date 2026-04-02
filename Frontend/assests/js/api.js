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
                window.location.href = '/pages/auth/login.html';
                return;
            }

            if (!response.ok) throw new Error(data.message || 'API Error');
            return data;
        } catch (error) {
            console.error('Fetch Error:', error);
            throw error;
        }
    }
};