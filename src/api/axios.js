import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role')?.toUpperCase();
        const branchId = localStorage.getItem('branchId');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Only append branchId if NOT a Superadmin and if it's a valid ID
        if (role && role !== 'SUPERADMIN' && role !== 'SUPER_ADMIN' && branchId && branchId !== '[object Object]') {
            config.params = {
                ...config.params,
                branchId: branchId
            };
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;   // ✅ matches variable name